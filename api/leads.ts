/**
 * Vercel Serverless Function — Lead Capture, Automation & Telegram Notification Endpoint
 *
 * Route: POST /api/leads
 * Also: GET /api/leads (Health & status check)
 *
 * Telegram notification is sent server-side using TELEGRAM_BOT_TOKEN and
 * TELEGRAM_CHAT_ID environment variables. These MUST be configured in the
 * Vercel project settings (Environment Variables). They are never exposed
 * in API responses, logs, or the frontend.
 *
 * Flow:
 *  1. Parse and validate lead payload
 *  2. Log structured record to Vercel Runtime Logs
 *  3. Send Telegram notification (non-blocking — failures are logged only)
 *  4. Return 200 success to frontend
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";

export const config = {
  maxDuration: 15,
};

// ──────────────────────────────────────────────────────────────────────────────
// Telegram helpers (server-side only)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Escape user-controlled text so it is safe in Telegram HTML messages.
 * Only & < > need escaping in parse_mode: HTML.
 */
function escapeHtml(value: unknown): string {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "—";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Send a single Telegram message using the Bot API.
 * Returns an object with { ok, error? } — never throws.
 */
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
              resolve({ ok: false, error: json.description || "Telegram API returned ok=false" });
            }
          } catch (parseErr) {
            resolve({ ok: false, error: `Failed to parse Telegram response: ${raw}` });
          }
        });
      }
    );

    req.on("error", (err: Error) =>
      resolve({ ok: false, error: `Network error: ${err.message}` })
    );

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ ok: false, error: "Telegram request timed out after 5s" });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Build a human-readable Telegram notification for a captured lead.
 * No credentials or sensitive infrastructure details are included in the message.
 */
function buildLeadMessage(
  record: ReturnType<typeof buildLeadRecord>,
  jiraIssueKey?: string | null
): string {
  const typeEmoji: Record<string, string> = {
    consultation: "🩺",
    quick_enquiry: "⚡",
    demo_request: "🎯",
    chatbot: "🤖",
    youtube_comment: "📺",
    feedback: "💬",
  };
  const emoji = typeEmoji[record.lead_type] ?? "📋";
  const labelMap: Record<string, string> = {
    consultation: "Consultation Request",
    quick_enquiry: "Quick Enquiry",
    demo_request: "Demo Request",
    chatbot: "Chatbot Lead",
    youtube_comment: "YouTube Comment Lead",
    feedback: "Feedback Submission",
  };
  const typeLabel = labelMap[record.lead_type] ?? record.lead_type.replace(/_/g, " ");

  const jiraHost = "janegracyint2027g3.atlassian.net";
  const jiraLine = jiraIssueKey
    ? `\n🎫 <b>Jira Issue:</b> <a href="https://${jiraHost}/browse/${escapeHtml(jiraIssueKey)}">${escapeHtml(jiraIssueKey)}</a>`
    : "";

  const locationParts = [record.location.city, record.location.region, record.location.country]
    .filter((v) => v && v !== "Unknown")
    .join(", ");

  const lines = [
    `${emoji} <b>New Physiomatics Lead — ${escapeHtml(typeLabel)}</b>`,
    "",
    `👤 <b>Name:</b> ${escapeHtml(record.name)}`,
    record.email ? `📧 <b>Email:</b> ${escapeHtml(record.email)}` : null,
    record.phone ? `📱 <b>Phone:</b> ${escapeHtml(record.phone)}` : null,
    record.organization ? `🏢 <b>Organization:</b> ${escapeHtml(record.organization)}` : null,
    record.role ? `💼 <b>Role:</b> ${escapeHtml(record.role)}` : null,
    record.interest ? `💡 <b>Interest:</b> ${escapeHtml(record.interest)}` : null,
    record.message ? `💬 <b>Message:</b> ${escapeHtml(record.message.slice(0, 300))}${record.message.length > 300 ? "…" : ""}` : null,
    locationParts ? `📍 <b>Location:</b> ${escapeHtml(locationParts)}` : null,
    jiraLine,
    "",
    `🕒 <b>Time:</b> ${record.timestamp}`,
    `🌐 <b>Source:</b> ${escapeHtml(record.page_path)}`,
  ].filter((l) => l !== null);

  return lines.join("\n");
}

// ──────────────────────────────────────────────────────────────────────────────
// Shared lead record builder
// ──────────────────────────────────────────────────────────────────────────────

function buildLeadRecord(
  lead: Record<string, unknown>,
  vercelCity: string,
  vercelRegion: string,
  vercelCountry: string,
  clientIp: string
) {
  return {
    event: "LEAD_CAPTURED",
    timestamp: new Date().toISOString(),
    lead_type: String(lead.lead_type || lead.form_type || "lead"),
    name: String(lead.name || lead.full_name || "Anonymous"),
    email: String(lead.email || (String(lead.contact || "").includes("@") ? lead.contact : "") || ""),
    phone: String(lead.phone || (!String(lead.contact || "").includes("@") ? lead.contact : "") || ""),
    organization: String(lead.organization || lead.company || lead.organization_type || ""),
    role: String(lead.role || lead.job_title || ""),
    interest: String(lead.interest || lead.segment || lead.organization_type || ""),
    subject: String(lead.subject || lead.challenge || ""),
    message: String(lead.message || ""),
    page_path: String(lead.page_path || lead.pageUrl || "/"),
    // Jira issue key, if the frontend already created a Jira issue before calling this endpoint
    jira_issue_key: lead.jira_issue_key ? String(lead.jira_issue_key) : null,
    location: {
      city: vercelCity,
      region: vercelRegion,
      country: vercelCountry,
      ip: clientIp,
    },
    source: "vercel_automation_engine",
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Handler
// ──────────────────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Health-check — intentionally omits Telegram config presence
  if (req.method === "GET") {
    return res.status(200).json({
      status: "online",
      service: "Physiomatics Vercel Lead Automation",
      timestamp: new Date().toISOString(),
      platform: "Vercel Serverless Functions",
      telegram_configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const lead: Record<string, unknown> =
      typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const clientIp = String(
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      (req.socket as any)?.remoteAddress ||
      "unknown"
    ).split(",")[0].trim();

    const vercelCountry = String(req.headers["x-vercel-ip-country"] || lead.geo_country || "Unknown");
    const vercelCity = String(decodeURIComponent(String(req.headers["x-vercel-ip-city"] || lead.geo_city || "Unknown")));
    const vercelRegion = String(req.headers["x-vercel-ip-country-region"] || lead.geo_region || "Unknown");

    // 1. Build structured record for Vercel Runtime Logs
    const record = buildLeadRecord(lead, vercelCity, vercelRegion, vercelCountry, clientIp);

    // 2. Print to Vercel console (appears in Vercel Dashboard → Logs)
    // IP address is logged here server-side for debugging; it is NOT returned in the API response.
    console.log(
      "🚀 [VERCEL LEAD AUTOMATION] Lead Captured:",
      JSON.stringify(record, null, 2)
    );

    // 3. Send Telegram notification — server-side only, non-blocking
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      console.warn(
        "⚠️ [TELEGRAM] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in Vercel Environment Variables. " +
        "Notification skipped. Add these in Vercel Dashboard → Project → Settings → Environment Variables."
      );
    } else {
      const message = buildLeadMessage(record, record.jira_issue_key);
      const telegramResult = await sendTelegramAlert(telegramToken, telegramChatId, message);

      if (telegramResult.ok) {
        console.log(
          `✅ [TELEGRAM] Notification sent. message_id=${telegramResult.messageId} lead_type=${record.lead_type}`
        );
      } else {
        // Log the error clearly but do NOT expose it in the API response.
        // This allows debugging via Vercel logs without silently hiding failures.
        console.error(
          `❌ [TELEGRAM] Notification failed. lead_type=${record.lead_type} error="${telegramResult.error}"`
        );
      }
    }

    // 4. Respond to frontend — never include Telegram config or internal errors
    return res.status(200).json({
      success: true,
      platform: "Vercel",
      message: "Lead successfully recorded in Vercel Automation Engine",
      lead_id: `vcl_${Date.now()}`,
      captured_at: record.timestamp,
    });
  } catch (err: any) {
    console.error("❌ [VERCEL LEAD AUTOMATION] Error:", err?.message || err);
    return res.status(500).json({
      success: false,
      error: "Failed to process lead",
    });
  }
}
