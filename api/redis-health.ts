import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedisClient } from "../src/lib/redis-session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET and POST for health check
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use GET or POST." });
  }

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
