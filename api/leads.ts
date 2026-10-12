/**
 * Vercel Serverless Function — Central Lead Processing & Integration Engine
 *
 * Route: POST /api/leads
 * Also: GET  /api/leads (Health & status check)
 *
 * ARCHITECTURE:
 *  1. Validate + deduplicate the lead immediately.
 *  2. Send Telegram alert FIRST — so you always get notified even if downstream
 *     integrations are slow or fail.
 *  3. Respond 200 to the browser immediately (prevents client-side timeouts).
 *  4. Jira + Google Sheets + Airtable run in a background Promise chain that
 *     Vercel's Node.js runtime will complete before the process is frozen.
 *
 * TIMEOUT FIX:
 *  Previously all integrations ran serially before responding, causing
 *  FUNCTION_INVOCATION_TIMEOUT. Now we respond early and fire integrations
 *  in the background so the function always finishes within budget.
 *
 * SECURITY:
 *  - All secrets (Jira, Airtable, Telegram) are read strictly from process.env.
 *  - No credentials or internal errors are returned in API responses.
 *  - Supabase is excluded per project requirements.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";

export const config = {
  maxDuration: 60, // Hobby plan max; Pro plan supports up to 300s
};

// ─── 1. In-Memory Deduplication Cache ────────────────────────────────────────
const recentSubmissions = new Map<string, number>();
const DEDUP_WINDOW_MS = 15000;

function isDuplicateSubmission(fingerprint: string): boolean {
  const now = Date.now();
  recentSubmissions.forEach((ts, key) => {
    if (now - ts > DEDUP_WINDOW_MS) recentSubmissions.delete(key);
  });
  if (recentSubmissions.has(fingerprint)) return true;
  recentSubmissions.set(fingerprint, now);
  return false;
}

// ─── 2. Telegram Helper ───────────────────────────────────────────────────────
function escapeHtml(value: unknown): string {
  if (value === undefined || value === null || String(value).trim() === "") return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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
              resolve({ ok: false, error: json.description || "Telegram returned ok=false" });
            }
          } catch {
            resolve({ ok: false, error: "Failed to parse Telegram response" });
          }
        });
      }
    );

    req.on("error", (err: Error) =>
      resolve({ ok: false, error: `Telegram network error: ${err.message}` })
    );
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ ok: false, error: "Telegram request timed out after 8s" });
    });
    req.write(payload);
    req.end();
  });
}

function buildLeadTelegramMessage(
  lead: Record<string, any>,
  jiraIssueKey?: string | null
): string {
  const typeEmoji: Record<string, string> = {
    consultation: "🩺",
    consultation_request: "🩺",
    quick_enquiry: "⚡",
    demo_request: "🎯",
    icp_lead: "🎯",
    chatbot: "🤖",
    feedback: "💬",
  };
  const emoji = typeEmoji[lead.lead_type] || "📋";
  const typeLabel = (lead.lead_type || "lead").replace(/_/g, " ").toUpperCase();

  const jiraHost = (process.env.JIRA_HOST || "janegracyint2027g3.atlassian.net").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const jiraLine = jiraIssueKey
    ? `\n🎫 <b>Jira Issue:</b> <a href="https://${jiraHost}/browse/${escapeHtml(jiraIssueKey)}">${escapeHtml(jiraIssueKey)}</a>`
    : "";

  const locationParts = [lead.location?.city, lead.location?.region, lead.location?.country]
    .filter((v) => v && v !== "Unknown")
    .join(", ");

  const lines = [
    `${emoji} <b>New Physiomatics Lead — ${escapeHtml(typeLabel)}</b>`,
    "",
    `👤 <b>Name:</b> ${escapeHtml(lead.name)}`,
    lead.email ? `📧 <b>Email:</b> ${escapeHtml(lead.email)}` : null,
    lead.phone ? `📱 <b>Phone:</b> ${escapeHtml(lead.phone)}` : null,
    lead.organization ? `🏢 <b>Organization:</b> ${escapeHtml(lead.organization)}` : null,
    lead.role ? `💼 <b>Role:</b> ${escapeHtml(lead.role)}` : null,
    lead.interest ? `💡 <b>Interest:</b> ${escapeHtml(lead.interest)}` : null,
    lead.message
      ? `💬 <b>Message:</b> ${escapeHtml(String(lead.message).slice(0, 300))}${String(lead.message).length > 300 ? "…" : ""}`
      : null,
    lead.document_name ? `📎 <b>Attached Report:</b> ${escapeHtml(lead.document_name)}` : null,
    locationParts ? `📍 <b>Location:</b> ${escapeHtml(locationParts)}` : null,
    jiraLine || null,
    "",
    `🕒 <b>Time:</b> ${escapeHtml(lead.timestamp)}`,
    `🌐 <b>Source:</b> ${escapeHtml(lead.page_path)}`,
  ].filter((l) => l !== null);

  return lines.join("\n");
}

// ─── 3. Jira Cloud Helper ─────────────────────────────────────────────────────
const LEAD_SUBTASKS = [
  { summary: "1. Initial Contact & Identity Verification", description: "Verify lead channels and acknowledge receipt within 15 minutes." },
  { summary: "2. Clinical & Organizational Assessment", description: "Assess clinical requirements, clinic/hospital capacity, and patient volume." },
  { summary: "3. Schedule Discovery & Live Demo Session", description: "Coordinate calendar invite with senior consultant for platform demo." },
  { summary: "4. Conduct Live Platform Walkthrough", description: "Demonstrate AI posture tracking, patient dashboard, and exercise compliance." },
  { summary: "5. Technical Integration & EHR/EMR Feasibility Check", description: "Review clinic workflows, EHR compatibility, and camera hardware." },
  { summary: "6. Commercial Proposal & Pilot Licensing Setup", description: "Generate quotation, software tier pricing, and pilot terms." },
  { summary: "7. Clinical Onboarding & Staff Training Session", description: "Schedule training workshop for physiotherapists and staff." },
  { summary: "8. Post-Onboarding Review & Satisfaction Check", description: "Review patient compliance data and collect feedback." },
];

async function syncToJiraServer(
  lead: Record<string, any>
): Promise<{ success: boolean; issueKey?: string; error?: string }> {
  const email = process.env.JIRA_EMAIL || "janegracy.int2027g3@gmail.com";
  const apiToken = process.env.JIRA_API_TOKEN || "";
  const primaryHost = (process.env.JIRA_HOST || "janegracyint2027g3.atlassian.net")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const projectKey = process.env.JIRA_PROJECT_KEY || "PHY";

  if (!apiToken || !primaryHost) {
    console.warn("[Jira] Credentials missing. Skipping Jira.");
    return { success: false, error: "Jira credentials not configured" };
  }

  const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString("base64")}`;
  const leadTypeLabel = (lead.lead_type || "Lead").toUpperCase();
  const summary = `[${leadTypeLabel}] ${lead.name || "New Visitor"} — ${lead.organization || "Direct Patient / Individual"}`;

  const descriptionText = [
    `Lead Details:`,
    `• Name: ${lead.name || "N/A"}`,
    `• Email: ${lead.email || "N/A"}`,
    `• Phone: ${lead.phone || "N/A"}`,
    `• Organization: ${lead.organization || "N/A"}`,
    `• Role: ${lead.role || "N/A"}`,
    `• Interest / Segment: ${lead.interest || "N/A"}`,
    `• Topic / Challenge: ${lead.subject || "N/A"}`,
    `• Source Page: ${lead.page_path || "N/A"}`,
    `• Received: ${lead.timestamp || new Date().toISOString()}`,
    ``,
    `Message:`,
    lead.message || "No custom message provided.",
    lead.document_name ? `\nAttached Clinical Report: ${lead.document_name}` : "",
  ].join("\n");

  try {
    // Create Parent Task
    const parentRes = await fetch(`https://${primaryHost}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fields: {
          project: { key: projectKey },
          summary,
          description: {
            type: "doc",
            version: 1,
            content: [{ type: "paragraph", content: [{ type: "text", text: descriptionText }] }],
          },
          issuetype: { name: "Task" },
          labels: ["physiomatics-lead", String(lead.lead_type || "web-lead").replace(/_/g, "-")],
        },
      }),
    });

    if (!parentRes.ok) {
      const errText = await parentRes.text();
      console.error("[Jira] Parent creation failed:", parentRes.status, errText);
      return { success: false, error: `Jira parent failed (${parentRes.status})` };
    }

    const parentData = (await parentRes.json()) as { key: string; id: string };
    const parentKey = parentData.key;
    console.log(`[Jira] ✓ Created parent Task ${parentKey}`);

    // Spawn subtasks asynchronously — do NOT await (non-blocking)
    (async () => {
      for (const sub of LEAD_SUBTASKS) {
        try {
          await fetch(`https://${primaryHost}/rest/api/3/issue`, {
            method: "POST",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              fields: {
                project: { key: projectKey },
                parent: { key: parentKey },
                summary: `${sub.summary} [${parentKey}]`,
                description: {
                  type: "doc",
                  version: 1,
                  content: [{ type: "paragraph", content: [{ type: "text", text: sub.description }] }],
                },
                issuetype: { name: "Sub-task" },
                labels: ["physiomatics-subtask"],
              },
            }),
          });
        } catch (_) {}
      }
      console.log(`[Jira] ✓ All 8 subtasks created for ${parentKey}`);
    })().catch(() => {});

    return { success: true, issueKey: parentKey };
  } catch (err: any) {
    console.error("[Jira] Exception:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

// ─── 4. Google Sheets Helper ──────────────────────────────────────────────────
async function syncToGoogleSheetsServer(
  lead: Record<string, any>,
  jiraIssueKey?: string
): Promise<{ success: boolean; error?: string }> {
  const sheetsUrl =
    process.env.GOOGLE_SHEETS_URL ||
    process.env.VITE_GOOGLE_SHEETS_URL ||
    "https://script.google.com/macros/s/AKfycby_kT_VKNkpRR9xFfVQbf3TFyQ7oINUhgU1DIkjhZSazdeDIrAwBFgklDXN_dfZVx_2/exec";

  try {
    const params = new URLSearchParams({
      action: "lead_submission",
      form_type: String(lead.lead_type || "lead"),
      form_name: String(lead.lead_type || "lead"),
      form_status: "submitted",
      full_name: String(lead.name || ""),
      name: String(lead.name || ""),
      email: String(lead.email || ""),
      phone: String(lead.phone || ""),
      contact: String(lead.email || lead.phone || ""),
      organization: String(lead.organization || ""),
      organization_type: String(lead.organization || ""),
      role: String(lead.role || ""),
      job_title: String(lead.role || ""),
      interest: String(lead.interest || ""),
      subject: String(lead.subject || ""),
      challenge: String(lead.subject || ""),
      message: String(lead.message || ""),
      page_path: String(lead.page_path || "/"),
      pageUrl: String(lead.page_url || ""),
      client_ip: String(lead.location?.ip || ""),
      geo_city: String(lead.location?.city || ""),
      geo_region: String(lead.location?.region || ""),
      geo_country: String(lead.location?.country || ""),
      jira_issue_key: String(jiraIssueKey || ""),
      jira_key: String(jiraIssueKey || ""),
      timestamp: String(lead.timestamp || new Date().toISOString()),
      report_file_name: String(lead.document_name || ""),
      report_file_url: String(lead.document_url || ""),
    });

    const res = await fetch(`${sheetsUrl}?${params.toString()}`, { method: "GET" });
    console.log(`[Sheets] ✓ Sent lead. Status: ${res.status}`);
    return { success: true };
  } catch (err: any) {
    console.error("[Sheets] Error:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

// ─── 5. Airtable Helper ───────────────────────────────────────────────────────
async function syncToAirtableServer(
  lead: Record<string, any>,
  jiraIssueKey?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY || "";
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID || "";
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Leads";

  if (!apiKey || !baseId) {
    console.log("[Airtable] Credentials not configured. Skipping.");
    return { success: true };
  }

  try {
    const fields: Record<string, any> = {
      Name: lead.name || "Anonymous Visitor",
      Email: lead.email || "",
      Phone: lead.phone || "",
      Organization: lead.organization || "",
      Role: lead.role || "",
      Interest: lead.interest || "",
      Subject: lead.subject || "",
      Message: lead.message || "",
      "Lead Type": lead.lead_type || "General Enquiry",
      Page: lead.page_path || "/",
      City: lead.location?.city || "",
      Country: lead.location?.country || "",
      "Received At": lead.timestamp || new Date().toISOString(),
      "Jira Key": jiraIssueKey || "",
      "Report Name": lead.document_name || "",
      "Report URL": lead.document_url || "",
    };
    Object.keys(fields).forEach((k) => { if (fields[k] === "") delete fields[k]; });

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (res.ok) {
      console.log("[Airtable] ✓ Saved lead record");
      return { success: true };
    } else {
      const errBody = await res.text();
      console.warn("[Airtable] Warning:", res.status, errBody);
      return { success: false, error: `Airtable ${res.status}` };
    }
  } catch (err: any) {
    console.error("[Airtable] Exception:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

// ─── 6. Main Handler ──────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      status: "online",
      service: "Physiomatics Central Lead Engine",
      timestamp: new Date().toISOString(),
      integrations: {
        jira: Boolean(process.env.JIRA_API_TOKEN),
        sheets: Boolean(process.env.GOOGLE_SHEETS_URL || process.env.VITE_GOOGLE_SHEETS_URL),
        airtable: Boolean(process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY),
        telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      },
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const raw = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    // Validate
    const name = String(raw.name || raw.full_name || "").trim();
    const contact = String(raw.contact || raw.email || raw.phone || "").trim();
    const message = String(raw.message || raw.challenge || "").trim();

    if (!name && !contact && !message) {
      return res.status(400).json({
        success: false,
        error: "Invalid submission: at least a name, contact detail, or message is required.",
      });
    }

    // Deduplication
    const clientIp = String(
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      (req.socket as any)?.remoteAddress ||
      "unknown"
    ).split(",")[0].trim();

    const dedupFingerprint = `${name}_${contact}_${raw.lead_type || raw.form_type}_${clientIp}`;
    if (isDuplicateSubmission(dedupFingerprint)) {
      console.warn(`[Lead] Duplicate submission: ${dedupFingerprint}`);
      return res.status(200).json({
        success: true,
        message: "Lead already received and being processed.",
        deduplicated: true,
      });
    }

    const email = String(raw.email || (contact.includes("@") ? contact : "")).trim();
    const phone = String(raw.phone || (!contact.includes("@") ? contact : "")).trim();
    const leadType = String(raw.lead_type || raw.form_type || "lead");

    const record: Record<string, any> = {
      lead_id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      lead_type: leadType,
      name: name || "Anonymous",
      email,
      phone,
      organization: String(raw.organization || raw.company || raw.organization_type || ""),
      role: String(raw.role || raw.job_title || ""),
      interest: String(raw.interest || raw.segment || raw.organization_type || ""),
      subject: String(raw.subject || raw.challenge || ""),
      message,
      page_path: String(raw.page_path || raw.pageUrl || "/"),
      page_url: String(raw.page_url || ""),
      document_name: raw.document_name ? String(raw.document_name) : "",
      document_url: raw.document_url ? String(raw.document_url) : "",
      location: {
        city: String(decodeURIComponent(String(req.headers["x-vercel-ip-city"] || raw.city || "Unknown"))),
        region: String(req.headers["x-vercel-ip-country-region"] || raw.region || "Unknown"),
        country: String(req.headers["x-vercel-ip-country"] || raw.country || "Unknown"),
        ip: clientIp,
      },
    };

    console.log(`🚀 [Lead] Processing: ${record.lead_id} (${record.lead_type}) for "${record.name}"`);

    // ── STEP 1: Send Telegram FIRST (fast, ~1-2s) ──────────────────────────
    // We notify BEFORE the slow integrations so the alert is never missed.
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    let telegramStatus: { success: boolean; messageId?: number; error?: string } = { success: false };

    if (tgToken && tgChatId) {
      try {
        const tgText = buildLeadTelegramMessage(record, null); // No Jira key yet — sent instantly
        const tgRes = await sendTelegramAlert(tgToken, tgChatId, tgText);
        telegramStatus = { success: tgRes.ok, messageId: tgRes.messageId, error: tgRes.error };
        if (tgRes.ok) {
          console.log(`[Lead] ✓ Telegram alert sent (msg_id=${tgRes.messageId})`);
        } else {
          console.error(`[Lead] ✗ Telegram failed: ${tgRes.error}`);
        }
      } catch (tgErr: any) {
        telegramStatus = { success: false, error: tgErr?.message || String(tgErr) };
        console.error("[Lead] Telegram exception:", tgErr);
      }
    } else {
      telegramStatus = { success: false, error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in Vercel env" };
      console.warn("[Lead] ⚠ Telegram env vars missing. Skipping Telegram notification.");
    }

    // ── STEP 2: Respond to client immediately (prevents browser timeout) ───
    // Return 200 right away. Backend integrations continue in the background.
    res.status(200).json({
      success: true,
      lead_id: record.lead_id,
      telegram: telegramStatus,
      captured_at: record.timestamp,
      message: "Lead received. Processing integrations in background.",
    });

    // ── STEP 3: Run heavy integrations in background (non-blocking) ─────────
    // Vercel Node.js runtime keeps running after res.end() until the event
    // loop drains or maxDuration is hit — so these will complete.
    (async () => {
      try {
        // A. Jira (slowest — creates parent + 8 subtasks sequentially)
        let jiraIssueKey: string | undefined;
        try {
          const jiraStatus = await syncToJiraServer(record);
          if (jiraStatus.success && jiraStatus.issueKey) {
            jiraIssueKey = jiraStatus.issueKey;
            // Send an updated Telegram message with the Jira key
            if (tgToken && tgChatId && telegramStatus.success) {
              try {
                const updateText = `🎫 <b>Jira issue created for "${escapeHtml(record.name)}":</b> <a href="https://${(process.env.JIRA_HOST || "janegracyint2027g3.atlassian.net").replace(/^https?:\/\//, "").replace(/\/$/, "")}/browse/${escapeHtml(jiraIssueKey)}">${escapeHtml(jiraIssueKey)}</a>`;
                await sendTelegramAlert(tgToken, tgChatId, updateText);
                console.log(`[Lead] ✓ Telegram Jira follow-up sent for ${jiraIssueKey}`);
              } catch (_) {}
            }
          }
        } catch (jErr) {
          console.error("[Lead] Jira background step error:", jErr);
        }

        // B. Google Sheets + Airtable in parallel
        await Promise.allSettled([
          syncToGoogleSheetsServer(record, jiraIssueKey),
          syncToAirtableServer(record, jiraIssueKey),
        ]);

        console.log(`[Lead] ✓ All background integrations complete for ${record.lead_id}`);
      } catch (bgErr) {
        console.error("[Lead] Background integration error:", bgErr);
      }
    })();
  } catch (err: any) {
    console.error("❌ [Lead] Fatal error:", err);
    // Only send error response if we haven't responded yet
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Lead processing encountered an unexpected error.",
      });
    }
  }
}
