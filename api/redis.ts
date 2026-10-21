import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import Redis from "ioredis";

// Global cache for serverless environments (avoids connection exhaustion in Vercel)
declare global {
  // eslint-disable-next-line no-var
  var __redisClient: Redis | undefined;
}

function getRedisClient(): Redis {
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

interface SessionData {
  id: string;
  createdAt: number;
  data: Record<string, unknown>;
}

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const COOKIE_NAME = "pm_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not defined");
  }
  return secret;
}

function signSessionId(id: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret).update(id).digest("hex");
  return `${id}.${hmac}`;
}

function verifySessionId(signedId: string, secret: string): string | null {
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

async function getSession(cookieHeader?: string | null): Promise<SessionData | null> {
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

async function saveSession(
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

function buildSessionCookie(signedValue: string, maxAge = SESSION_TTL_SECONDS): string {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
  const action = url.searchParams.get("action") || (req.query?.action as string);

  // Health check action (default or ?action=health)
  if (!action || action === "health") {
    const startTime = Date.now();
    try {
      const redis = getRedisClient();
      const pong = await redis.ping();
      const latencyMs = Date.now() - startTime;

      if (pong === "PONG") {
        return res.status(200).json({
          success: true,
          status: "ok",
          message: "Redis connected successfully!",
          ping: pong,
          latencyMs,
          timestamp: new Date().toISOString(),
        });
      } else {
        return res.status(500).json({
          success: false,
          status: "error",
          error: `Unexpected response from Redis: ${pong}`,
        });
      }
    } catch (error: any) {
      console.error("[Redis Health Check Error]:", error);
      return res.status(500).json({
        success: false,
        status: "error",
        error: error?.message || "Failed to connect to Redis",
      });
    }
  }

  // Session test action (?action=session)
  if (action === "session") {
    const testId = crypto.randomBytes(8).toString("hex");
    const testPayload = {
      userId: "test-user-physiomatics",
      testRunId: testId,
      verifiedAt: new Date().toISOString(),
    };

    try {
      const { session, cookieValue } = await saveSession({ data: testPayload }, 600);
      const cookieHeader = buildSessionCookie(cookieValue, 600);

      const redis = getRedisClient();
      const rawStored = await redis.get(`session:${session.id}`);

      if (!rawStored) {
        return res.status(500).json({
          success: false,
          error: "Session was not found in Redis after write",
        });
      }

      const simulatedCookieHeader = `pm_session=${cookieValue}`;
      const retrievedSession = await getSession(simulatedCookieHeader);

      if (!retrievedSession || retrievedSession.id !== session.id) {
        return res.status(500).json({
          success: false,
          error: "Failed to verify session using signed cookie authentication",
        });
      }

      res.setHeader("Set-Cookie", cookieHeader);

      return res.status(200).json({
        success: true,
        message: "Session stored and verified successfully in Redis!",
        sessionId: session.id,
        persistedData: retrievedSession.data,
        cookieSet: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Session Test Error]:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Session test failed",
      });
    }
  }

  return res.status(400).json({
    success: false,
    error: `Unknown action '${action}'. Use 'health' or 'session'.`,
  });
}
