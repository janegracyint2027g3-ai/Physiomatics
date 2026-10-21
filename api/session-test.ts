import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import {
  saveSession,
  getSession,
  buildSessionCookie,
  getRedisClient,
} from "../src/lib/redis-session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use GET or POST." });
  }

  const testId = crypto.randomBytes(8).toString("hex");
  const testPayload = {
    userId: "test-user-physiomatics",
    testRunId: testId,
    verifiedAt: new Date().toISOString(),
  };

  try {
    // 1. Save new session to Redis with 10 minutes test TTL
    const { session, cookieValue } = await saveSession({ data: testPayload }, 600);

    // 2. Build secure cookie header
    const cookieHeader = buildSessionCookie(cookieValue, 600);

    // 3. Directly read back from Redis using session ID to verify raw persistence
    const redis = getRedisClient();
    const rawStored = await redis.get(`session:${session.id}`);

    if (!rawStored) {
      return res.status(500).json({
        success: false,
        error: "Session was not found in Redis after write",
      });
    }

    // 4. Verify reading back through getSession with the cookie
    const simulatedCookieHeader = `pm_session=${cookieValue}`;
    const retrievedSession = await getSession(simulatedCookieHeader);

    if (!retrievedSession || retrievedSession.id !== session.id) {
      return res.status(500).json({
        success: false,
        error: "Failed to verify session using signed cookie authentication",
      });
    }

    // Set HTTP-only cookie on response
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
