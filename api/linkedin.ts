/**
 * Vercel Serverless Function — LinkedIn Lead Automation & Multi-Channel Pipeline
 *
 * Route: POST /api/linkedin  (Ingest lead or trigger sync)
 *        GET  /api/linkedin  (Health check, status & manual sync trigger)
 *
 * CHANNELS DISPATCHED:
 *  1. Telegram Alert (Instant HTML message with profile link & comment)
 *  2. Jira Cloud (Parent Task + 8 Clinical/Commercial Subtasks under PHY)
 *  3. Google Sheets (Logged into LinkedIn_Raw_Leads + Lead_Management tabs)
 *  4. Airtable (Lead record created in Leads table)
 *  5. Email (Instant HTML notification to janegracy.int2027g3@gmail.com)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";

export const config = {
  maxDuration: 60,
};

// ─── 1. In-Memory Deduplication ──────────────────────────────────────────────
const recentInteractions = new Map<string, number>();
const DEDUP_WINDOW_MS = 60000; // 1 minute window

function isDuplicate(id: string): boolean {
  if (!id) return false;
  const now = Date.now();
  recentInteractions.forEach((ts, key) => {
    if (now - ts > DEDUP_WINDOW_MS) recentInteractions.delete(key);
  });
  if (recentInteractions.has(id)) return true;
  recentInteractions.set(id, now);
  return false;
}

function escapeHtml(value: unknown): string {
  if (value === undefined || value === null || String(value).trim() === "") return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── 2. Telegram Alert Dispatcher ─────────────────────────────────────────────
async function sendTelegramAlert(
  token: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; messageId?: number; error?: string }> {
  const payload = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: false,
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
              resolve({ ok: false, error: json.description || "Telegram returned false" });
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
      resolve({ ok: false, error: "Telegram request timed out" });
    });
    req.write(payload);
    req.end();
  });
}

function buildLinkedInTelegramMessage(lead: Record<string, any>, jiraIssueKey?: string): string {
  const actionEmoji: Record<string, string> = {
    comment: "💬",
    like: "👍",
    reaction: "❤️",
    share: "🔄",
    repost: "🔄",
    visit: "👀",
    lead_form: "📋",
  };
  const emoji = actionEmoji[lead.interaction_type] || "💼";
  const typeLabel = String(lead.interaction_type || "INTERACTION").toUpperCase();
  const jiraHost = (process.env.JIRA_HOST || "janegracyint2027g3.atlassian.net")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const jiraLine = jiraIssueKey
    ? `\n🎫 <b>Jira Issue:</b> <a href="https://${jiraHost}/browse/${escapeHtml(jiraIssueKey)}">${escapeHtml(jiraIssueKey)}</a>`
    : "";

  return [
    `${emoji} <b>New LinkedIn Lead — ${escapeHtml(typeLabel)}</b>`,
    "",
    `👤 <b>Name:</b> ${escapeHtml(lead.author_name || "LinkedIn User")}`,
    lead.author_headline ? `💼 <b>Headline / Role:</b> ${escapeHtml(lead.author_headline)}` : null,
    lead.author_profile_url ? `🔗 <b>Profile:</b> <a href="${escapeHtml(lead.author_profile_url)}">${escapeHtml(lead.author_profile_url)}</a>` : null,
    lead.email ? `📧 <b>Email:</b> ${escapeHtml(lead.email)}` : null,
    lead.phone ? `📱 <b>Phone:</b> ${escapeHtml(lead.phone)}` : null,
    lead.content_text ? `💬 <b>Comment / Note:</b> ${escapeHtml(lead.content_text)}` : null,
    lead.post_url ? `📄 <b>Post:</b> <a href="${escapeHtml(lead.post_url)}">View LinkedIn Post</a>` : null,
    jiraLine || null,
    "",
    `🕒 <b>Time:</b> ${escapeHtml(lead.timestamp || new Date().toISOString())}`,
    `🏢 <b>Channel:</b> LinkedIn Company Page`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

// ─── 3. Jira Cloud (Parent Task + 8 Subtasks) ─────────────────────────────────
const LINKEDIN_LEAD_SUBTASKS = [
  { summary: "1. Direct Message & Identity Verification on LinkedIn", description: "Send connection request or DM acknowledging interaction on LinkedIn within 15 minutes." },
  { summary: "2. Clinical & Organizational Background Review", description: "Review member's LinkedIn profile, clinic affiliations, role, and rehabilitation interest." },
  { summary: "3. Schedule Platform Discovery & Demo Session", description: "Share calendar invite link for live Physiomatics platform demo." },
  { summary: "4. Conduct Live Platform Walkthrough", description: "Demonstrate AI posture tracking, patient dashboard, and compliance monitoring." },
  { summary: "5. Technical Integration & Camera Feasibility Check", description: "Review clinic workflows, EHR compatibility, and camera hardware setup." },
  { summary: "6. Commercial Proposal & Pilot Licensing Setup", description: "Send quotation, pricing tier, and pilot clinical terms." },
  { summary: "7. Clinical Onboarding & Staff Training Session", description: "Schedule workshop for clinic physiotherapists and assign staff credentials." },
  { summary: "8. Post-Onboarding Review & Satisfaction Check", description: "Review initial patient sessions and collect feedback." },
];

async function syncToJira(lead: Record<string, any>): Promise<{ success: boolean; issueKey?: string; error?: string }> {
  const email = process.env.JIRA_EMAIL || "janegracy.int2027g3@gmail.com";
  const apiToken = process.env.JIRA_API_TOKEN || "";
  const host = (process.env.JIRA_HOST || "janegracyint2027g3.atlassian.net")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const projectKey = process.env.JIRA_PROJECT_KEY || "PHY";

  if (!apiToken || !host) {
    return { success: false, error: "Jira credentials not configured" };
  }

  const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString("base64")}`;
  const actionLabel = (lead.interaction_type || "INTERACTION").toUpperCase();
  const summary = `[LINKEDIN_${actionLabel}] ${lead.author_name || "LinkedIn Lead"} — ${lead.author_headline || "Direct Prospect"}`;

  const descriptionText = [
    `LinkedIn Lead Details:`,
    `• Name: ${lead.author_name || "N/A"}`,
    `• Headline / Role: ${lead.author_headline || "N/A"}`,
    `• Profile URL: ${lead.author_profile_url || "N/A"}`,
    `• Email: ${lead.email || "N/A"}`,
    `• Phone: ${lead.phone || "N/A"}`,
    `• Interaction Type: ${lead.interaction_type || "N/A"}`,
    `• Post URL: ${lead.post_url || "N/A"}`,
    `• Post URN: ${lead.post_urn || "N/A"}`,
    `• Received At: ${lead.timestamp || new Date().toISOString()}`,
    ``,
    `Message / Comment:`,
    lead.content_text || "Engaged with company post.",
  ].join("\n");

  try {
    const parentRes = await fetch(`https://${host}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
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
          labels: ["physiomatics-lead", "linkedin-lead", `linkedin-${String(lead.interaction_type || "engagement").toLowerCase()}`],
        },
      }),
    });

    if (!parentRes.ok) {
      const errText = await parentRes.text();
      return { success: false, error: `Jira parent failed (${parentRes.status}): ${errText}` };
    }

    const parentData = (await parentRes.json()) as { key: string };
    const parentKey = parentData.key;

    // Create 8 subtasks in parallel
    const subtaskPromises = LINKEDIN_LEAD_SUBTASKS.map((sub) =>
      fetch(`https://${host}/rest/api/3/issue`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
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
            labels: ["physiomatics-subtask", "linkedin-followup"],
          },
        }),
      }).catch(() => null)
    );

    await Promise.allSettled(subtaskPromises);
    return { success: true, issueKey: parentKey };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// ─── 4. Google Sheets Helper ──────────────────────────────────────────────────
async function syncToGoogleSheets(lead: Record<string, any>, jiraIssueKey?: string): Promise<{ success: boolean; error?: string }> {
  const sheetsUrl =
    process.env.GOOGLE_SHEETS_URL ||
    process.env.VITE_GOOGLE_SHEETS_URL ||
    "https://script.google.com/macros/s/AKfycby_kT_VKNkpRR9xFfVQbf3TFyQ7oINUhgU1DIkjhZSazdeDIrAwBFgklDXN_dfZVx_2/exec";

  try {
    const payload = {
      action: "linkedin_lead",
      interaction_id: lead.interaction_id || `li_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      interaction_type: lead.interaction_type || "comment",
      author_name: lead.author_name || "LinkedIn User",
      author_profile_url: lead.author_profile_url || "",
      author_headline: lead.author_headline || "",
      author_urn: lead.author_urn || "",
      post_url: lead.post_url || "",
      post_urn: lead.post_urn || "",
      comment_text: lead.content_text || "",
      content_text: lead.content_text || "",
      email: lead.email || "",
      phone: lead.phone || "",
      is_enquiry: Boolean(lead.content_text),
      jira_key_primary: jiraIssueKey || "",
      timestamp: lead.timestamp || new Date().toISOString(),
    };

    const res = await fetch(sheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    return { success: res.ok };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// ─── 5. Airtable Helper ───────────────────────────────────────────────────────
async function syncToAirtable(lead: Record<string, any>, jiraIssueKey?: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY || "";
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID || "";
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Leads";

  if (!apiKey || !baseId) {
    return { success: true }; // skipped gracefully
  }

  try {
    const fields: Record<string, any> = {
      Name: lead.author_name || "LinkedIn Lead",
      Email: lead.email || "",
      Phone: lead.phone || "",
      Organization: lead.author_headline || "LinkedIn Prospect",
      Role: lead.author_headline || "",
      Interest: "LinkedIn Post Engagement",
      Subject: `LinkedIn ${lead.interaction_type || "Action"}`,
      Message: lead.content_text || `Engaged on post: ${lead.post_url || ""}`,
      "Lead Type": "LinkedIn Lead",
      Page: lead.post_url || "LinkedIn",
      "Received At": lead.timestamp || new Date().toISOString(),
      "Jira Key": jiraIssueKey || "",
    };
    Object.keys(fields).forEach((k) => { if (fields[k] === "") delete fields[k]; });

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    return { success: res.ok };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// ─── 6. LinkedIn API Fetcher (for Comments & Reactions) ───────────────────────
async function fetchLinkedInPostEngagement(accessToken: string, postUrn: string): Promise<Record<string, any>[]> {
  const leads: Record<string, any>[] = [];
  const cleanUrn = encodeURIComponent(postUrn.trim());

  // 1. Fetch Comments
  try {
    const commentsUrl = `https://api.linkedin.com/rest/socialActions/${cleanUrn}/comments?count=50`;
    const res = await fetch(commentsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data = await res.json() as any;
      const elements = data.elements || [];
      for (const c of elements) {
        const actor = c.actor || "";
        const commentId = c.$URN || c.id || `li_comment_${Date.now()}`;
        leads.push({
          interaction_id: commentId,
          interaction_type: "comment",
          author_urn: actor,
          author_name: c.created?.actor?.name || actor.replace("urn:li:person:", "User "),
          author_profile_url: actor ? `https://www.linkedin.com/in/${actor.replace("urn:li:person:", "")}` : "",
          content_text: c.message?.text || "",
          post_urn: postUrn,
          timestamp: new Date(c.created?.time || Date.now()).toISOString(),
        });
      }
    }
  } catch (e) {
    console.warn("[LinkedIn] Comments fetch error:", e);
  }

  // 2. Fetch Reactions (Likes, etc.)
  try {
    const reactionsUrl = `https://api.linkedin.com/rest/socialActions/${cleanUrn}/reactions?count=100`;
    const res = await fetch(reactionsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data = await res.json() as any;
      const elements = data.elements || [];
      for (const r of elements) {
        const actor = r.root || r.actor || "";
        const reactionType = r.reactionType || "LIKE";
        const reactionId = `li_react_${actor}_${cleanUrn}`;
        leads.push({
          interaction_id: reactionId,
          interaction_type: reactionType.toLowerCase(),
          author_urn: actor,
          author_name: actor ? `LinkedIn Member (${actor.replace("urn:li:person:", "")})` : "LinkedIn Member",
          author_profile_url: actor ? `https://www.linkedin.com/in/${actor.replace("urn:li:person:", "")}` : "",
          content_text: `Reacted with ${reactionType} on your post`,
          post_urn: postUrn,
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (e) {
    console.warn("[LinkedIn] Reactions fetch error:", e);
  }

  return leads;
}

// ─── 7. Master Processing Pipeline ────────────────────────────────────────────
async function processLinkedInLead(lead: Record<string, any>): Promise<{
  success: boolean;
  jiraKey?: string;
  telegramSent: boolean;
  sheetsSynced: boolean;
  airtableSynced: boolean;
}> {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN || "";
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || "";

  // 1. Jira Task & 8 Subtasks
  let jiraKey: string | undefined;
  try {
    const jiraRes = await syncToJira(lead);
    if (jiraRes.success) jiraKey = jiraRes.issueKey;
  } catch (e) {
    console.error("[LinkedIn Pipeline] Jira error:", e);
  }

  // 2. Telegram Alert
  let telegramSent = false;
  if (telegramToken && telegramChatId) {
    try {
      const msg = buildLinkedInTelegramMessage(lead, jiraKey);
      const teleRes = await sendTelegramAlert(telegramToken, telegramChatId, msg);
      telegramSent = teleRes.ok;
    } catch (e) {
      console.error("[LinkedIn Pipeline] Telegram error:", e);
    }
  }

  // 3. Google Sheets (Logs to LinkedIn_Raw_Leads + triggers Email)
  let sheetsSynced = false;
  try {
    const sheetsRes = await syncToGoogleSheets(lead, jiraKey);
    sheetsSynced = sheetsRes.success;
  } catch (e) {
    console.error("[LinkedIn Pipeline] Sheets error:", e);
  }

  // 4. Airtable
  let airtableSynced = false;
  try {
    const airtableRes = await syncToAirtable(lead, jiraKey);
    airtableSynced = airtableRes.success;
  } catch (e) {
    console.error("[LinkedIn Pipeline] Airtable error:", e);
  }

  return {
    success: true,
    jiraKey,
    telegramSent,
    sheetsSynced,
    airtableSynced,
  };
}

// ─── 8. Main HTTP Handler ─────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET: Health check & configuration status
  if (req.method === "GET") {
    const hasToken = Boolean(process.env.LINKEDIN_ACCESS_TOKEN);
    const hasOrgId = Boolean(process.env.LINKEDIN_ORGANIZATION_ID);
    const hasPost = Boolean(process.env.LINKEDIN_MONITOR_POST_URNS || req.query.post_urn);

    // If sync=true requested in query
    if (req.query.sync === "true" && hasToken) {
      const token = process.env.LINKEDIN_ACCESS_TOKEN || "";
      const postUrn = String(req.query.post_urn || process.env.LINKEDIN_MONITOR_POST_URNS || "");
      if (!postUrn) {
        return res.status(400).json({ error: "Missing post_urn parameter or LINKEDIN_MONITOR_POST_URNS" });
      }

      const leads = await fetchLinkedInPostEngagement(token, postUrn);
      const results = [];
      for (const lead of leads) {
        if (!isDuplicate(lead.interaction_id)) {
          const outcome = await processLinkedInLead(lead);
          results.push({ lead: lead.author_name, outcome });
        }
      }

      return res.status(200).json({
        success: true,
        message: `Synced ${leads.length} engagements. Processed ${results.length} new leads.`,
        results,
      });
    }

    return res.status(200).json({
      status: "online",
      endpoint: "Physiomatics LinkedIn Automation Engine",
      configured: {
        hasLinkedInToken: hasToken,
        hasOrganizationId: hasOrgId,
        hasMonitoredPost: hasPost,
        hasTelegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
        hasJira: Boolean(process.env.JIRA_API_TOKEN),
        hasSheets: Boolean(process.env.GOOGLE_SHEETS_URL || process.env.VITE_GOOGLE_SHEETS_URL),
        hasAirtable: Boolean(process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY),
      },
      instructions: "Send POST with lead object or set LINKEDIN_ACCESS_TOKEN and visit ?sync=true",
    });
  }

  // POST: Lead ingestion / webhook / manual trigger
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

      // 1. If payload contains array of leads
      if (Array.isArray(body.leads)) {
        const results = [];
        for (const l of body.leads) {
          if (!isDuplicate(l.interaction_id)) {
            const outcome = await processLinkedInLead(l);
            results.push(outcome);
          }
        }
        return res.status(200).json({ success: true, processed: results.length });
      }

      // 2. Single lead payload
      const leadId = body.interaction_id || body.id || `li_${Date.now()}`;
      if (isDuplicate(leadId)) {
        return res.status(200).json({ success: true, message: "Duplicate lead ignored", leadId });
      }

      const outcome = await processLinkedInLead({
        interaction_id: leadId,
        interaction_type: body.interaction_type || body.type || "comment",
        author_name: body.author_name || body.name || "LinkedIn Prospect",
        author_headline: body.author_headline || body.headline || body.role || "",
        author_profile_url: body.author_profile_url || body.profile_url || body.url || "",
        author_urn: body.author_urn || body.urn || "",
        post_url: body.post_url || "",
        post_urn: body.post_urn || "",
        content_text: body.content_text || body.comment || body.message || "",
        email: body.email || "",
        phone: body.phone || "",
        timestamp: body.timestamp || new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: "LinkedIn lead successfully routed across Jira, Sheets, Airtable, Telegram & Email",
        outcome,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || "Failed to process LinkedIn lead" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
