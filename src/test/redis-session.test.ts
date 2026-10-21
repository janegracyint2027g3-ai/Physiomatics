import { describe, it, expect, beforeAll } from "vitest";
import { getRedisClient, saveSession, getSession, signSessionId, verifySessionId } from "@/lib/redis-session";

describe("Redis Client & Session Persistence Suite", () => {
  const testSecret = "4bd8c8105636649ea233fa7c3d0123c377cca63145c1a25685e4f34be8bafb90";

  beforeAll(() => {
    process.env.SESSION_SECRET = testSecret;
    if (!process.env.REDIS_URL) {
      process.env.REDIS_URL = "redis://default:yavENEpWOxEQmtBe7pQJBQrkqBC0kVsy@merino-scent-stone-45240.db.redis.io:13864";
    }
  });

  it("should securely sign and verify session IDs with HMAC SHA-256", () => {
    const rawId = "user-session-12345";
    const signed = signSessionId(rawId, testSecret);

    expect(signed).toContain(".");
    const verified = verifySessionId(signed, testSecret);
    expect(verified).toBe(rawId);

    // Tampered signature must fail verification
    const tampered = signed.slice(0, -2) + "ff";
    expect(verifySessionId(tampered, testSecret)).toBeNull();
  });

  it("should connect to live Redis cloud and respond to PING with PONG", async () => {
    const client = getRedisClient();
    const pong = await client.ping();
    expect(pong).toBe("PONG");
  });

  it("should create, store in Redis, retrieve, and verify session persistence", async () => {
    const client = getRedisClient();
    const testPayload = {
      user: "Jane Gracy David",
      role: "admin",
      timestamp: Date.now(),
    };

    // 1. Save session to Redis with 60 seconds TTL
    const { session, cookieValue } = await saveSession({ data: testPayload }, 60);
    expect(session.id).toBeDefined();

    // 2. Read back from Redis using the signed cookie
    const retrieved = await getSession(`pm_session=${cookieValue}`);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(session.id);
    expect(retrieved?.data).toEqual(testPayload);

    // Clean up test key
    await client.del(`session:${session.id}`);
  });
});
