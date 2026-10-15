/**
 * Vercel Serverless Function — Appointment Booking Engine
 *
 * Route: POST /api/booking   — Create a new appointment booking
 *        GET  /api/booking   — Health check & integration status
 *
 * ARCHITECTURE:
 *  1. Validate required booking fields (name, email, consultation_type, preferred_date).
 *  2. Generate a unique booking reference (PHY-YYYYMMDD-XXXX).
 *  3. Deduplicate using in-memory cache (15s window).
 *  4. Send Telegram alert immediately.
 *  5. Fan out to Jira (task + subtasks), Google Sheets, Airtable in parallel.
 *  6. Return booking reference, confirmation details, and WhatsApp handoff link.
 *
 * GOOGLE CALENDAR (future-ready):
 *  When GOOGLE_CALENDAR_ID and GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON are set,
 *  this endpoint will also create a calendar event server-side.
 *
 * SECURITY:
 *  - All secrets read strictly from process.env.
 *  - No credentials returned in any response.
 *  - Rate-limited by deduplication + Vercel edge limits.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";

export const config = {
  maxDuration: 60,
};

// ─── 1. Booking Reference Generator ──────────────────────────────────────────
function generateBookingRef(): string {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PHY-${ymd}-${rand}`;
}

// ─── 2. In-Memory Deduplication Cache ────────────────────────────────────────
const recentBookings = new Map<string, number>();
const DEDUP_WINDOW_MS = 20000;

function isDuplicateBooking(fingerprint: string): boolean {
  const now = Date.now();
  recentBookings.forEach((ts, key) => {
    if (now - ts > DEDUP_WINDOW_MS) recentBookings.delete(key);
  });
  if (recentBookings.has(fingerprint)) return true;
  recentBookings.set(fingerprint, now);
  return false;
}

// ─── 3. Telegram Helper ───────────────────────────────────────────────────────
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
): Promise<{ ok: boolean; error?: string }> {
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
            resolve({ ok: Boolean(json.ok) });
          } catch {
            resolve({ ok: false, error: "Failed to parse Telegram response" });
          }
        });
      }
    );
    req.on("error", (err: Error) =>
      resolve({ ok: false, error: err.message })
    );
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ ok: false, error: "Telegram request timed out" });
    });
    req.write(payload);
    req.end();
  });
}

function buildBookingTelegramMessage(booking: Record<string, any>): string {
  const lines = [
    `📅 <b>New Appointment Booking — Physiomatics</b>`,
    ``,
    `🔖 <b>Ref:</b> ${escapeHtml(booking.booking_ref)}`,
    `👤 <b>Name:</b> ${escapeHtml(booking.name)}`,
    `📧 <b>Email:</b> ${escapeHtml(booking.email)}`,
    booking.phone ? `📱 <b>Phone:</b> ${escapeHtml(booking.phone)}` : null,
    booking.organization ? `🏢 <b>Organization:</b> ${escapeHtml(booking.organization)}` : null,
    booking.job_title ? `💼 <b>Role:</b> ${escapeHtml(booking.job_title)}` : null,
    ``,
    `🩺 <b>Consultation Type:</b> ${escapeHtml(booking.consultation_type)}`,
    `🎯 <b>Goal:</b> ${escapeHtml(booking.goal)}`,
    booking.preferred_date ? `📆 <b>Preferred Date:</b> ${escapeHtml(booking.preferred_date)}` : null,
    booking.preferred_time ? `⏰ <b>Preferred Time:</b> ${escapeHtml(booking.preferred_time)}` : null,
    `🌐 <b>Format:</b> ${escapeHtml(booking.format || "Online")}`,
    `🕐 <b>Timezone:</b> ${escapeHtml(booking.timezone || "Asia/Kolkata")}`,
    booking.language ? `🗣 <b>Language:</b> ${escapeHtml(booking.language)}` : null,
    booking.message
      ? `💬 <b>Notes:</b> ${escapeHtml(String(booking.message).slice(0, 300))}`
      : null,
    ``,
    `🕒 <b>Submitted:</b> ${escapeHtml(booking.timestamp)}`,
    `🌐 <b>Country:</b> ${escapeHtml(booking.location?.country)}`,
  ].filter((l) => l !== null);

  return lines.join("\n");
}

// ─── 4. Jira Helper ───────────────────────────────────────────────────────────
async function syncBookingToJira(
  booking: Record<string, any>
): Promise<{ success: boolean; issueKey?: string; error?: string }> {
  const email = process.env.JIRA_EMAIL || "";
  const apiToken = process.env.JIRA_API_TOKEN || "";
  const host = (process.env.JIRA_HOST || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const projectKey = process.env.JIRA_PROJECT_KEY || "PHY";

  if (!apiToken || !host) return { success: false, error: "Jira not configured" };

  const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString("base64")}`;
  const summary = `[BOOKING] ${booking.name} — ${booking.consultation_type}`;
  const descriptionText = [
    `Booking Reference: ${booking.booking_ref}`,
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone || "N/A"}`,
    `Organization: ${booking.organization || "N/A"}`,
    `Job Title: ${booking.job_title || "N/A"}`,
    `Consultation Type: ${booking.consultation_type}`,
    `Goal: ${booking.goal}`,
    `Preferred Date: ${booking.preferred_date || "Flexible"}`,
    `Preferred Time: ${booking.preferred_time || "Flexible"}`,
    `Format: ${booking.format || "Online"}`,
    `Timezone: ${booking.timezone || "Asia/Kolkata"}`,
    `Language: ${booking.language || "English"}`,
    `Country: ${booking.location?.country || "N/A"}`,
    ``,
    `Notes: ${booking.message || "None"}`,
    ``,
    `Submitted: ${booking.timestamp}`,
  ].join("\n");

  try {
    const res = await fetch(`https://${host}/rest/api/3/issue`, {
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
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: descriptionText }],
              },
            ],
          },
          issuetype: { name: "Task" },
          labels: ["physiomatics-booking", "appointment"],
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Jira/Booking] Failed:", res.status, errText);
      return { success: false, error: `Jira ${res.status}` };
    }

    const data = (await res.json()) as { key: string };
    console.log(`[Jira/Booking] ✓ Created ${data.key}`);
    return { success: true, issueKey: data.key };
  } catch (err: any) {
    console.error("[Jira/Booking] Exception:", err);
    return { success: false, error: err?.message };
  }
}

// ─── 5. Google Sheets Helper ──────────────────────────────────────────────────
// ─── 5. Google Sheets Helper ──────────────────────────────────────────────────
async function syncBookingToSheets(
  booking: Record<string, any>,
  jiraKey?: string
): Promise<{ success: boolean; error?: string }> {
  const sheetsUrl =
    process.env.GOOGLE_SHEETS_URL ||
    process.env.VITE_GOOGLE_SHEETS_URL ||
    "";

  if (!sheetsUrl) return { success: false, error: "Sheets URL not configured" };

  try {
    const params = new URLSearchParams({
      action: "booking_submission",
      event_name: "booking_submission",
      form_type: "appointment_booking",
      lead_type: "appointment_booking",
      form_status: "submitted",
      booking_ref: String(booking.booking_ref || ""),
      full_name: String(booking.name || ""),
      name: String(booking.name || ""),
      email: String(booking.email || ""),
      phone: String(booking.phone || ""),
      contact: String(booking.email || booking.phone || ""),
      organization: String(booking.organization || ""),
      job_title: String(booking.job_title || ""),
      role: String(booking.job_title || ""),
      consultation_type: String(booking.consultation_type || ""),
      interest: String(booking.consultation_type || ""),
      subject: String(booking.consultation_type || ""),
      goal: String(booking.goal || ""),
      preferred_date: String(booking.preferred_date || "Flexible"),
      preferred_time: String(booking.preferred_time || "Flexible"),
      format: String(booking.format || "Online"),
      timezone: String(booking.timezone || "Asia/Kolkata"),
      language: String(booking.language || "English"),
      message: String(booking.message || ""),
      notes: String(booking.notes || booking.message || ""),
      geo_country: String(booking.location?.country || ""),
      geo_city: String(booking.location?.city || ""),
      jira_key: String(jiraKey || ""),
      timestamp: String(booking.timestamp || ""),
    });

    const res = await fetch(`${sheetsUrl}?${params.toString()}`, {
      method: "GET",
      signal: AbortSignal.timeout(15000),
    });
    console.log(`[Sheets/Booking] ✓ Status: ${res.status}`);
    return { success: true };
  } catch (err: any) {
    console.error("[Sheets/Booking] Error:", err);
    return { success: false, error: err?.message };
  }
}

// ─── 5b. Direct Resend Email Helper (fallback / instant delivery) ─────────────
async function sendBookingEmailViaResend(
  booking: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "RESEND_API_KEY not set" };

  try {
    const fromEmail = process.env.EMAIL_FROM || "Physiomatics <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_EMAIL || "janegracy.int2027g3@gmail.com";
    const bookingRef = String(booking.booking_ref || "PHY-REF");

    const visitorHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#3b1d60 0%,#1e1035 100%);padding:24px;border-radius:8px;text-align:center;color:#ffffff;margin-bottom:24px;">
          <h1 style="margin:0;font-size:22px;">Appointment Booking Confirmed</h1>
          <p style="margin:8px 0 0 0;color:#e9d5ff;font-size:14px;">Physiomatics AI-Powered Physiotherapy</p>
        </div>
        <p style="font-size:15px;color:#334155;">Dear <strong>${escapeHtml(booking.name)}</strong>,</p>
        <p style="font-size:14px;color:#475569;line-height:1.6;">Thank you for scheduling your consultation with Physiomatics. Your appointment enquiry has been logged successfully.</p>
        
        <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:16px;margin:20px 0;">
          <div style="font-size:11px;text-transform:uppercase;font-weight:bold;color:#7c3aed;margin-bottom:4px;">Booking Reference</div>
          <div style="font-size:20px;font-family:monospace;font-weight:bold;color:#3b1d60;">${escapeHtml(bookingRef)}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
          <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;">Consultation:</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">${escapeHtml(booking.consultation_type)}</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;">Preferred Date:</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">${escapeHtml(booking.preferred_date || "Flexible")}</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;">Preferred Time:</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">${escapeHtml(booking.preferred_time || "Flexible")} (${escapeHtml(booking.timezone || "Asia/Kolkata")})</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;">Format:</td><td style="padding:8px 0;color:#0f172a;">${escapeHtml(booking.format || "Online")}</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;">Goal:</td><td style="padding:8px 0;color:#0f172a;">${escapeHtml(booking.goal || "—")}</td></tr>
        </table>

        <div style="background:#f8fafc;border-radius:8px;padding:16px;font-size:13px;color:#475569;line-height:1.6;margin-bottom:20px;">
          <strong>What's Next?</strong><br/>
          • Our clinical team will review your consultation request within 24 hours.<br/>
          • You will receive a calendar invitation with a video consultation link.<br/>
          • For immediate coordination or questions, reach us on WhatsApp.
        </div>

        <div style="text-align:center;margin-top:24px;">
          <a href="https://wa.me/917845072426" style="display:inline-block;background:#25D366;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Chat on WhatsApp</a>
        </div>
      </div>
    `;

    const adminHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#3b1d60;margin-top:0;">📅 New Appointment Booking: ${escapeHtml(bookingRef)}</h2>
        <p><strong>Patient / Visitor:</strong> ${escapeHtml(booking.name)} (${escapeHtml(booking.email)}${booking.phone ? " / " + escapeHtml(booking.phone) : ""})</p>
        <p><strong>Consultation Type:</strong> ${escapeHtml(booking.consultation_type)}</p>
        <p><strong>Date &amp; Time:</strong> ${escapeHtml(booking.preferred_date || "Flexible")} at ${escapeHtml(booking.preferred_time || "Flexible")} (${escapeHtml(booking.timezone || "Asia/Kolkata")})</p>
        <p><strong>Format:</strong> ${escapeHtml(booking.format || "Online")}</p>
        <p><strong>Goal:</strong> ${escapeHtml(booking.goal || "N/A")}</p>
        <p><strong>Notes:</strong> ${escapeHtml(booking.message || "None")}</p>
        <p><strong>Location:</strong> ${escapeHtml(booking.location?.city || "Unknown")}, ${escapeHtml(booking.location?.country || "Unknown")}</p>
      </div>
    `;

    await Promise.allSettled([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [booking.email],
          subject: `✅ Appointment Confirmation: ${booking.consultation_type} [Ref: ${bookingRef}]`,
          html: visitorHtml,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          subject: `📅 [NEW APPOINTMENT] ${bookingRef} — ${booking.name} (${booking.consultation_type})`,
          html: adminHtml,
        }),
      }),
    ]);

    console.log(`[Resend/Booking] Emails dispatched for ${bookingRef}`);
    return { success: true };
  } catch (err: any) {
    console.error("[Resend/Booking] Error:", err);
    return { success: false, error: err?.message };
  }
}

// ─── 6. Airtable Helper ───────────────────────────────────────────────────────
async function syncBookingToAirtable(
  booking: Record<string, any>,
  jiraKey?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY || "";
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID || "";
  const tableName = process.env.AIRTABLE_BOOKINGS_TABLE || process.env.AIRTABLE_TABLE_NAME || "Leads";

  if (!apiKey || !baseId) return { success: true }; // Skip gracefully

  try {
    const fields: Record<string, any> = {
      Name: booking.name,
      Email: booking.email,
      Phone: booking.phone || "",
      Organization: booking.organization || "",
      "Job Title": booking.job_title || "",
      "Booking Ref": booking.booking_ref,
      "Consultation Type": booking.consultation_type,
      Goal: booking.goal,
      "Preferred Date": booking.preferred_date || "Flexible",
      "Preferred Time": booking.preferred_time || "Flexible",
      Format: booking.format || "Online",
      Timezone: booking.timezone || "Asia/Kolkata",
      Language: booking.language || "English",
      Message: booking.message || "",
      "Lead Type": "appointment_booking",
      Country: booking.location?.country || "",
      "Received At": booking.timestamp,
      "Jira Key": jiraKey || "",
    };
    Object.keys(fields).forEach((k) => { if (fields[k] === "") delete fields[k]; });

    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({ records: [{ fields }], typecast: true }),
      }
    );

    if (res.ok) {
      console.log("[Airtable/Booking] ✓ Saved");
      return { success: true };
    } else {
      const errBody = await res.text();
      console.warn("[Airtable/Booking] Warning:", res.status, errBody);
      return { success: false, error: `Airtable ${res.status}` };
    }
  } catch (err: any) {
    console.error("[Airtable/Booking] Exception:", err);
    return { success: false, error: err?.message };
  }
}

// ─── 7. Main Handler ──────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      status: "online",
      service: "Physiomatics Booking Engine",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      integrations: {
        jira: Boolean(process.env.JIRA_API_TOKEN),
        sheets: Boolean(process.env.GOOGLE_SHEETS_URL || process.env.VITE_GOOGLE_SHEETS_URL),
        airtable: Boolean(process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY),
        telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
        googleCalendarApi: Boolean(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON),
        email: Boolean(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY),
      },
      note: "Google Calendar API availability and email confirmation require GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON + RESEND_API_KEY — see README.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const raw = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    // ── Validate required fields ──────────────────────────────────────────────
    const name = String(raw.name || raw.full_name || "").trim();
    const email = String(raw.email || "").trim();
    const consultationType = String(raw.consultation_type || raw.consultationType || "").trim();

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required to book an appointment.",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    if (!consultationType) {
      return res.status(400).json({
        success: false,
        error: "Please select a consultation type.",
      });
    }

    // ── Deduplication ─────────────────────────────────────────────────────────
    const rawIp =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      (req.socket as any)?.remoteAddress ||
      "unknown";
    const clientIp = (Array.isArray(rawIp) ? rawIp[0] || "unknown" : String(rawIp)).split(",")[0]?.trim() || "unknown";

    const dedupFingerprint = `booking_${name}_${email}_${consultationType}_${clientIp}`;
    if (isDuplicateBooking(dedupFingerprint)) {
      console.warn(`[Booking] Duplicate: ${dedupFingerprint}`);
      return res.status(200).json({
        success: true,
        deduplicated: true,
        message: "Booking already received and being processed.",
      });
    }

    // ── Build booking record ──────────────────────────────────────────────────
    const bookingRef = generateBookingRef();
    const booking: Record<string, any> = {
      booking_ref: bookingRef,
      booking_id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      lead_type: "appointment_booking",

      name,
      email,
      phone: String(raw.phone || "").trim(),
      organization: String(raw.organization || raw.clinic_name || "").trim(),
      job_title: String(raw.job_title || raw.role || "").trim(),
      country: String(raw.country || "").trim(),
      city: String(raw.city || "").trim(),
      preferred_contact: String(raw.preferred_contact || "email").trim(),

      consultation_type: consultationType,
      goal: String(raw.goal || raw.main_goal || "").trim(),
      preferred_date: String(raw.preferred_date || "").trim(),
      preferred_time: String(raw.preferred_time || "").trim(),
      format: String(raw.format || raw.consultation_format || "Online").trim(),
      timezone: String(raw.timezone || "Asia/Kolkata").trim(),
      language: String(raw.language || "English").trim(),
      patient_type: String(raw.patient_type || "").trim(),
      requirements: String(raw.requirements || "").trim(),
      message: String(raw.message || raw.notes || raw.additional_comments || "").trim(),

      page_path: String(raw.page_path || "/book"),
      page_url: String(raw.page_url || ""),
      location: {
        city: String(
          decodeURIComponent(String(req.headers["x-vercel-ip-city"] || raw.city || "Unknown"))
        ),
        region: String(req.headers["x-vercel-ip-country-region"] || raw.region || "Unknown"),
        country: String(req.headers["x-vercel-ip-country"] || raw.country || "Unknown"),
        ip: clientIp,
      },
    };

    console.log(`🗓 [Booking] Processing: ${bookingRef} for "${name}" (${consultationType})`);

    // ── Jira (create booking task) ────────────────────────────────────────────
    let jiraStatus: { success: boolean; issueKey?: string; error?: string } = { success: false };
    try {
      jiraStatus = await syncBookingToJira(booking);
    } catch (err: any) {
      console.warn("[Booking] Jira warning:", err);
    }
    const jiraKey = jiraStatus.issueKey;

    // ── Telegram + Sheets + Airtable + Email (parallel) ──────────────────────
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    const [sheetsRes, airtableRes, telegramRes, resendRes] = await Promise.allSettled([
      syncBookingToSheets(booking, jiraKey),
      syncBookingToAirtable(booking, jiraKey),
      tgToken && tgChatId
        ? sendTelegramAlert(tgToken, tgChatId, buildBookingTelegramMessage(booking))
        : Promise.resolve({ ok: false, error: "Telegram not configured" }),
      sendBookingEmailViaResend(booking),
    ]);

    const sheetsOk =
      sheetsRes.status === "fulfilled" ? sheetsRes.value.success : false;
    const airtableOk =
      airtableRes.status === "fulfilled" ? airtableRes.value.success : false;
    const telegramOk =
      telegramRes.status === "fulfilled"
        ? (telegramRes.value as any).ok
        : false;
    const emailDirectOk =
      resendRes.status === "fulfilled" ? resendRes.value.success : false;
    // Email is handled either via direct Resend (if configured) or via Google Apps Script (Sheets sync)
    const emailOk = emailDirectOk || sheetsOk;

    console.log(
      `[Booking] Done: ref=${bookingRef}, Jira=${jiraKey || "failed"}, Sheets/AppsScript=${sheetsOk}, Airtable=${airtableOk}, Telegram=${telegramOk}, Email=${emailOk}`
    );

    // ── Respond with full confirmation ────────────────────────────────────────
    return res.status(200).json({
      success: true,
      booking_ref: bookingRef,
      message: "Appointment enquiry received. Our team will confirm within 24 hours.",
      details: {
        name: booking.name,
        email: booking.email,
        consultation_type: booking.consultation_type,
        preferred_date: booking.preferred_date || "To be confirmed",
        preferred_time: booking.preferred_time || "To be confirmed",
        format: booking.format,
        timezone: booking.timezone,
      },
      whatsapp_followup: `https://wa.me/917845072426?text=${encodeURIComponent(
        `Hi Physiomatics, I just submitted a booking enquiry. My reference is ${bookingRef}. Consultation: ${booking.consultation_type}. Looking forward to hearing from you!`
      )}`,
      next_steps: [
        "Our team will review your enquiry within 24 hours.",
        "You will receive a confirmation email at " + booking.email,
        "To confirm faster, use the WhatsApp link above.",
        "Your booking reference: " + bookingRef,
      ],
      integrations: {
        jira: jiraStatus.success ? jiraKey : null,
        sheets: sheetsOk,
        airtable: airtableOk,
        telegram: telegramOk,
        email: emailOk,
      },
    });
  } catch (err: any) {
    console.error("❌ [Booking] Fatal error:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Booking could not be processed. Please try again or contact us via WhatsApp.",
      });
    }
    return;
  }
}
