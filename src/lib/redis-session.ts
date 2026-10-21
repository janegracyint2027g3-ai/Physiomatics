import Redis from "ioredis";
import crypto from "crypto";

// Global cache for serverless environments (avoids connection exhaustion in Vercel)
declare global {
  // eslint-disable-next-line no-var
  var __redisClient: Redis | undefined;
}

export function getRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is not defined");
  }

  if (!global.__redisClient) {
    global.__redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 8000,
      lazyConnect: false,
    });

    global.__redisClient.on("error", (err) => {
      console.error("[Redis Client Error]:", err.message);
    });
  }

  return global.__redisClient;
}

export interface SessionData {
  id: string;
  createdAt: number;
  data: Record<string, unknown>;
}

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days default session expiry
const COOKIE_NAME = "pm_session";

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not defined");
  }
  return secret;
}

/**
 * Sign session ID using HMAC SHA256 to ensure tampering is detected
 */
export function signSessionId(id: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret).update(id).digest("hex");
  return `${id}.${hmac}`;
}

export function verifySessionId(signedId: string, secret: string): string | null {
  if (!signedId || !signedId.includes(".")) return null;
  const parts = signedId.split(".");
  if (parts.length !== 2) return null;
  const [id, signature] = parts;
  const expected = crypto.createHmac("sha256", secret).update(id).digest("hex");
  
  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
    return valid ? id : null;
  } catch {
    return null;
  }
}

/**
 * Get or create a session for an HTTP request
 */
export async function getSession(cookieHeader?: string | null): Promise<SessionData | null> {
  if (!cookieHeader) return null;
  const secret = getSessionSecret();
  const cookies = parseCookies(cookieHeader);
  const rawCookie = cookies[COOKIE_NAME];
  if (!rawCookie) return null;

  const sessionId = verifySessionId(rawCookie, secret);
  if (!sessionId) return null;

  const redis = getRedisClient();
  const rawData = await redis.get(`session:${sessionId}`);
  if (!rawData) return null;

  try {
    return JSON.parse(rawData) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Create or save session in Redis with configured TTL
 */
export async function saveSession(
  session: { id?: string; data: Record<string, unknown> },
  ttlSeconds = SESSION_TTL_SECONDS
): Promise<{ session: SessionData; cookieValue: string }> {
  const secret = getSessionSecret();
  const id = session.id || crypto.randomUUID();
  const sessionData: SessionData = {
    id,
    createdAt: Date.now(),
    data: session.data,
  };

  const redis = getRedisClient();
  await redis.setex(`session:${id}`, ttlSeconds, JSON.stringify(sessionData));

  const signed = signSessionId(id, secret);
  return {
    session: sessionData,
    cookieValue: signed,
  };
}

/**
 * Build Set-Cookie header for secure HTTP-only session
 */
export function buildSessionCookie(signedValue: string, maxAge = SESSION_TTL_SECONDS): string {
  const isProd = process.env.NODE_ENV === "production";
  const flags = [
    `${COOKIE_NAME}=${encodeURIComponent(signedValue)}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
  ];
  if (isProd) {
    flags.push("Secure");
  }
  return flags.join("; ");
}

function parseCookies(str: string): Record<string, string> {
  const obj: Record<string, string> = {};
  const pairs = str.split(/; */);
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx < 0) continue;
    const key = pair.substring(0, idx).trim();
    const val = pair.substring(idx + 1).trim();
    try {
      obj[key] = decodeURIComponent(val);
    } catch {
      obj[key] = val;
    }
  }
  return obj;
}
