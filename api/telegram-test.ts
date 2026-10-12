/**
 * Vercel Serverless Function — Telegram Connectivity Test
 *
 * Route: POST /api/telegram-test
 *
 * SECURITY:
 *  - Protected by a TELEGRAM_TEST_SECRET env var (Bearer token).
 *    Requests without a matching Authorization header are rejected with 401.
 *  - Bot token and chat ID are read server-side only; never returned in any response.
 *  - Only available via authenticated POST — no GET exposure.
 *  - Sets no permissive CORS: only same-origin + explicit test clients can call it.
 *
 * Usage:
 *   curl -X POST https://physiomatics.vercel.app/api/telegram-test \
 *     -H "Authorization: Bearer YOUR_TELEGRAM_TEST_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"note": "manual verification"}'
 *
 * Required Vercel Environment Variables:
 *   TELEGRAM_BOT_TOKEN     — Bot API token from @BotFather
 *   TELEGRAM_CHAT_ID       — Chat or user ID to send to
 *   TELEGRAM_TEST_SECRET   — A strong random string (e.g. openssl rand -hex 32)
 *                            Protects this endpoint from unauthorized use.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";

export const config = {
  maxDuration: 10,
};

async function sendTelegramAlert(
  token: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; messageId?: number; error?: string }> {
  const payload = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  return new Promise((resolve) => {
    const req = https.request(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(raw);
            if (json.ok) {
              resolve({ ok: true, messageId: json.result?.message_id });
            } else {
              resolve({ ok: false, error: json.description ?? "ok=false" });
            }
          } catch {
            resolve({ ok: false, error: "Invalid JSON from Telegram" });
          }
        });
      }
    );

    req.on("error", (err: Error) =>
      resolve({ ok: false, error: `Network error: ${err.message}` })
    );

    req.setTimeout(6000, () => {
      req.destroy();
      resolve({ ok: false, error: "Timeout after 6s" });
    });

    req.write(payload);
    req.end();
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Authenticate: require Bearer token matching TELEGRAM_TEST_SECRET
  const testSecret = process.env.TELEGRAM_TEST_SECRET;
  if (!testSecret) {
    // If the operator hasn't configured a secret, refuse all requests for safety.
    console.warn("[TELEGRAM-TEST] TELEGRAM_TEST_SECRET is not set — endpoint disabled.");
    return res.status(503).json({
      error: "Test endpoint is not configured. Set TELEGRAM_TEST_SECRET in Vercel Environment Variables.",
    });
  }

  const authHeader = String(req.headers["authorization"] || "");
  const provided = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!provided || provided !== testSecret) {
    // Log failed attempt without revealing the expected secret
    console.warn("[TELEGRAM-TEST] Unauthorized request from", req.headers["x-forwarded-for"] || "unknown");
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check configuration
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !telegramChatId) {
    return res.status(503).json({
      error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in Vercel Environment Variables.",
      telegram_configured: false,
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const note = body.note ? String(body.note).slice(0, 200) : "No note provided";

  const timestamp = new Date().toISOString();
  const message = [
    "🔔 <b>Physiomatics — Telegram Integration Test</b>",
    "",
    `📋 <b>Status:</b> Connectivity verified`,
    `🕒 <b>Time:</b> ${timestamp}`,
    `📝 <b>Note:</b> ${note
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}`,
    "",
    "✅ If you see this message, the Telegram integration is working correctly.",
  ].join("\n");

  console.log(`[TELEGRAM-TEST] Sending test message at ${timestamp}`);

  const result = await sendTelegramAlert(telegramToken, telegramChatId, message);

  if (result.ok) {
    console.log(`[TELEGRAM-TEST] ✅ Test message delivered. message_id=${result.messageId}`);
    return res.status(200).json({
      success: true,
      message: "Telegram test notification sent successfully.",
      message_id: result.messageId,
      // Never include token, chat_id, or secret in the response
    });
  } else {
    console.error(`[TELEGRAM-TEST] ❌ Test failed: ${result.error}`);
    return res.status(502).json({
      success: false,
      // Return the Telegram API error message (safe: it's from Telegram, not our secrets)
      telegram_error: result.error,
    });
  }
}
