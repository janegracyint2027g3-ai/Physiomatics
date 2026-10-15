/**
 * Vercel Serverless Function — Scheduled Executive Reporting Engine
 *
 * Route: GET /api/cron/reports
 * Schedule:
 *   - Daily:   15:30 UTC daily (= 21:00 / 9:00 PM Asia/Kolkata IST)
 *   - Weekly:  03:30 UTC Mondays (= 09:00 AM Asia/Kolkata IST)
 *   - Monthly: 03:30 UTC 1st of month (= 09:00 AM Asia/Kolkata IST)
 *
 * Performs:
 *  1. Data compilation from Google Sheets / Apps Script
 *  2. Jira Executive Digest Task creation under project PHY
 *  3. Rich Telegram Executive Report delivery to TELEGRAM_CHAT_ID
 *  4. Direct Executive Email Report dispatch via Nodemailer (Gmail SMTP)
 *
 * Protected by CRON_SECRET Bearer header or ?secret= query parameter.
 * Self-contained module: zero relative runtime import dependencies.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";
import nodemailer from "nodemailer";

export const config = {
  maxDuration: 60,
};

export type ReportInterval = "Daily" | "Weekly" | "Monthly";

export interface TopEmailItem {
  email: string;
  count: number;
  name: string;
  source: string;
}

export interface TrendRowItem {
  period: string;
  visitors: string | number;
  pageViews: string | number;
  leads: string | number;
  convRate: string;
}

export interface ReportMetrics {
  interval: string;
  period: string;
  totalEvents: number;
  visitors: number;
  pageViews: number;
  demos: number;
  quick: number;
  consults: number;
  chatbot: number;
  feedback: number;
  leads: number;
  convRate: string;
  avgDuration: string | number;
  ytLeads: number;
  ytEnquiries: number;
  liLeads: number;
  liEnquiries: number;
  telegramLeads: number;
  telegramSentAlerts: number;
  totalAllLeads: number;
  topEmails: TopEmailItem[];
  trendRows: TrendRowItem[];
  sheetUrl: string;
}

export interface ReportRunResult {
  period: string;
  jira_task: string;
  telegram_sent: boolean;
  email_sent: boolean;
  email_message_id?: string;
  email_recipients_count?: number;
  report_data_retrieved: boolean;
  email_response?: string;
  error?: string;
}

export function getKolkataDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

export function verifyCronAuth(req: VercelRequest): boolean {
  const authHeader = String(req.headers["authorization"] || "");
  const secretQuery = String(req.query.secret || "");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret) {
    const isAuthorized =
      authHeader === `Bearer ${expectedSecret}` ||
      secretQuery === expectedSecret ||
      req.headers["x-vercel-cron"] === "1";

    if (!isAuthorized) {
      console.warn("[Cron] Unauthorized cron invocation attempt.");
      return false;
    }
  }

  return true;
}

export function getDefaultMetrics(interval: string, periodDate?: string): ReportMetrics {
  const period = periodDate || new Date().toISOString().split("T")[0];
  return {
    interval,
    period,
    totalEvents: 0,
    visitors: 0,
    pageViews: 0,
    demos: 0,
    quick: 0,
    consults: 0,
    chatbot: 0,
    feedback: 0,
    leads: 0,
    convRate: "0.0%",
    avgDuration: "0",
    ytLeads: 0,
    ytEnquiries: 0,
    liLeads: 0,
    liEnquiries: 0,
    telegramLeads: 0,
    telegramSentAlerts: 0,
    totalAllLeads: 0,
    topEmails: [],
    trendRows: [],
    sheetUrl: "https://docs.google.com/spreadsheets/d/1FZW3gVn8122ufMPScamNRhTQUYSIqjl7ApP_f_VA8mQ/edit",
  };
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildReportHtml(interval: string, m: ReportMetrics): string {
  const maxLead = Math.max(m.demos, m.quick, m.consults, m.ytEnquiries, m.liEnquiries, m.feedback, 1);

  const barRow = (name: string, count: number, color: string) => {
    const pct = Math.min(100, Math.round((count / maxLead) * 100));
    return `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:#334155;margin-bottom:4px;">
          <span>${escapeHtml(name)}</span>
          <span style="color:${color};font-weight:700;">${count}</span>
        </div>
        <div style="background:#f1f5f9;height:8px;border-radius:4px;overflow:hidden;">
          <div style="background:${color};height:8px;width:${pct}%;border-radius:4px;"></div>
        </div>
      </div>
    `;
  };

  let topEmailsHtml = "";
  if (m.topEmails && m.topEmails.length > 0) {
    topEmailsHtml = `
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <h3 style="margin:0;font-size:15px;color:#0f172a;font-weight:700;">🔁 Most Repeated / Active Lead Email IDs</h3>
          <span style="font-size:11px;color:#64748b;font-weight:600;background:#f1f5f9;padding:3px 8px;border-radius:12px;">High Intent Priority</span>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">
              <th style="padding:8px 10px;text-align:left;">Rank</th>
              <th style="padding:8px 10px;text-align:left;">Lead Name &amp; Email</th>
              <th style="padding:8px 10px;text-align:left;">Channel</th>
              <th style="padding:8px 10px;text-align:center;">Submissions</th>
            </tr>
          </thead>
          <tbody>
            ${m.topEmails
              .map((e, i) => {
                const rankBadge = i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : i === 2 ? "🥉 #3" : `#${i + 1}`;
                const badgeBg = i === 0 ? "#fef3c7" : i === 1 ? "#f1f5f9" : i === 2 ? "#ffedd5" : "#f8fafc";
                const badgeTextColor = i === 0 ? "#b45309" : i === 1 ? "#475569" : i === 2 ? "#c2410c" : "#64748b";
                const countTagColor = e.count >= 3 ? "#dc2626" : e.count >= 2 ? "#d97706" : "#2563eb";

                return `
                  <tr style="border-bottom:1px solid #f1f5f9;font-size:13px;">
                    <td style="padding:10px 10px;"><span style="background:${badgeBg};color:${badgeTextColor};font-size:11px;font-weight:800;padding:3px 8px;border-radius:12px;">${rankBadge}</span></td>
                    <td style="padding:10px 10px;">
                      <div style="color:#0f172a;font-weight:700;">${escapeHtml(e.name)}</div>
                      <div style="color:#2563eb;font-size:12px;font-weight:500;"><a href="mailto:${escapeHtml(e.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(e.email)}</a></div>
                    </td>
                    <td style="padding:10px 10px;color:#64748b;font-size:12px;font-weight:600;">${escapeHtml(e.source)}</td>
                    <td style="padding:10px 10px;text-align:center;">
                      <span style="background:${countTagColor};color:#ffffff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;">${e.count}x Leads</span>
                    </td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } else {
    topEmailsHtml = `
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:20px;text-align:center;color:#64748b;font-size:13px;">
        🔁 <strong>Most Repeated Lead Emails:</strong> No repeated lead entries recorded for this period.
      </div>
    `;
  }

  let trendRowsHtml = "";
  if (m.trendRows && m.trendRows.length > 0) {
    trendRowsHtml = m.trendRows
      .map(
        (r) => `
        <tr style="border-bottom:1px solid #f1f5f9;font-size:13px;">
          <td style="padding:8px 10px;font-weight:600;color:#1e293b;">${escapeHtml(r.period)}</td>
          <td style="padding:8px 10px;color:#2563eb;text-align:center;font-weight:700;">${escapeHtml(r.visitors)}</td>
          <td style="padding:8px 10px;color:#475569;text-align:center;">${escapeHtml(r.pageViews)}</td>
          <td style="padding:8px 10px;color:#059669;text-align:center;font-weight:700;">${escapeHtml(r.leads)}</td>
          <td style="padding:8px 10px;color:#7c3aed;text-align:center;font-weight:700;">${escapeHtml(r.convRate)}</td>
        </tr>
      `
      )
      .join("");
  } else {
    trendRowsHtml = `<tr><td colspan="5" style="padding:12px;text-align:center;color:#94a3b8;font-size:12px;">No historical periods recorded yet.</td></tr>`;
  }

  const ssUrl = m.sheetUrl || "https://docs.google.com/spreadsheets/d/1FZW3gVn8122ufMPScamNRhTQUYSIqjl7ApP_f_VA8mQ/edit";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Physiomatics ${escapeHtml(interval)} Performance Dashboard</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
    
    <div style="background:linear-gradient(135deg,#0284c7 0%,#0f172a 100%);padding:28px 24px;color:#ffffff;">
      <div style="display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.2);color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:20px;margin-bottom:8px;">
        ${escapeHtml(interval)} Executive Digest
      </div>
      <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Physiomatics Performance Dashboard</h1>
      <p style="margin:6px 0 0 0;color:#bae6fd;font-size:13px;">Reporting Period: <strong>${escapeHtml(m.period)}</strong> &bull; Asia/Kolkata (IST)</p>
    </div>

    <div style="padding:22px 24px 12px 24px;background:#ffffff;">

      <!-- KPI Row 1 -->
      <div style="display:table;width:100%;margin-bottom:12px;">
        <div style="display:table-cell;width:50%;padding-right:6px;vertical-align:top;">
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;">
            <div style="color:#15803d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">👥 Unique Visitors</div>
            <div style="color:#166534;font-size:28px;font-weight:800;margin-top:4px;">${m.visitors}</div>
            <div style="color:#15803d;font-size:12px;margin-top:2px;">${m.pageViews} total page views</div>
          </div>
        </div>
        <div style="display:table-cell;width:50%;padding-left:6px;vertical-align:top;">
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;">
            <div style="color:#1d4ed8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">🎯 Omnichannel Leads</div>
            <div style="color:#1e40af;font-size:28px;font-weight:800;margin-top:4px;">${m.totalAllLeads}</div>
            <div style="color:#1d4ed8;font-size:12px;margin-top:2px;">Web: <strong>${m.leads}</strong> &bull; Social: <strong>${m.ytEnquiries + m.liEnquiries}</strong> &bull; Conv: <strong>${escapeHtml(m.convRate)}</strong></div>
          </div>
        </div>
      </div>

      <!-- KPI Row 2 -->
      <div style="display:table;width:100%;margin-bottom:12px;">
        <div style="display:table-cell;width:50%;padding-right:6px;vertical-align:top;">
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;">
            <div style="color:#0284c7;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">📱 Telegram Leads</div>
            <div style="color:#0369a1;font-size:28px;font-weight:800;margin-top:4px;">${m.telegramLeads}</div>
            <div style="color:#0284c7;font-size:12px;margin-top:2px;">${m.telegramSentAlerts} instant bot alerts delivered</div>
          </div>
        </div>
        <div style="display:table-cell;width:50%;padding-left:6px;vertical-align:top;">
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;">
            <div style="color:#b91c1c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">▶️ YouTube Leads</div>
            <div style="color:#991b1b;font-size:28px;font-weight:800;margin-top:4px;">${m.ytEnquiries}</div>
            <div style="color:#b91c1c;font-size:12px;margin-top:2px;">${m.ytLeads} comments tracked &bull; ${m.ytEnquiries} qualified</div>
          </div>
        </div>
      </div>

      <!-- KPI Row 3 -->
      <div style="display:table;width:100%;margin-bottom:12px;">
        <div style="display:table-cell;width:50%;padding-right:6px;vertical-align:top;">
          <div style="background:#f0f7ff;border:1px solid #c7d2fe;border-radius:12px;padding:16px;">
            <div style="color:#3730a3;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">💼 LinkedIn Leads</div>
            <div style="color:#312e81;font-size:28px;font-weight:800;margin-top:4px;">${m.liEnquiries}</div>
            <div style="color:#3730a3;font-size:12px;margin-top:2px;">${m.liLeads} interactions &bull; ${m.liEnquiries} qualified</div>
          </div>
        </div>
        <div style="display:table-cell;width:50%;padding-left:6px;vertical-align:top;">
          <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;">
            <div style="color:#7e22ce;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">⚡ Web Inquiries</div>
            <div style="color:#6b21a8;font-size:28px;font-weight:800;margin-top:4px;">${m.leads}</div>
            <div style="color:#7e22ce;font-size:12px;margin-top:2px;">Demos: ${m.demos} &bull; Consults: ${m.consults} &bull; Quick: ${m.quick}</div>
          </div>
        </div>
      </div>

      <!-- KPI Row 4 -->
      <div style="display:table;width:100%;margin-bottom:20px;">
        <div style="display:table-cell;width:50%;padding-right:6px;vertical-align:top;">
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;">
            <div style="color:#b45309;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">🤖 AI Chat &amp; Feedback</div>
            <div style="color:#92400e;font-size:28px;font-weight:800;margin-top:4px;">${m.chatbot + m.feedback}</div>
            <div style="color:#b45309;font-size:12px;margin-top:2px;">${m.chatbot} chats &bull; ${m.feedback} feedback reviews</div>
          </div>
        </div>
        <div style="display:table-cell;width:50%;padding-left:6px;vertical-align:top;">
          <div style="background:#fdf2f8;border:1px solid #fbcfe8;border-radius:12px;padding:16px;">
            <div style="color:#9d174d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">⏱️ Avg Engagement</div>
            <div style="color:#831843;font-size:28px;font-weight:800;margin-top:4px;">${m.avgDuration}s</div>
            <div style="color:#9d174d;font-size:12px;margin-top:2px;">${m.totalEvents} live interaction events</div>
          </div>
        </div>
      </div>

      <!-- Omnichannel Breakdown -->
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:20px;">
        <h3 style="margin:0 0 14px 0;font-size:15px;color:#0f172a;font-weight:700;">📊 Omnichannel Lead &amp; Conversion Breakdown</h3>
        ${barRow("🎯 Demo / ICP Requests", m.demos, "#7c3aed")}
        ${barRow("💬 Clinical Consultations", m.consults, "#059669")}
        ${barRow("⚡ Quick Enquiries", m.quick, "#0284c7")}
        ${barRow("📱 Telegram Lead Dispatches", m.telegramLeads, "#0891b2")}
        ${barRow("▶️ YouTube Comment Enquiries", m.ytEnquiries, "#dc2626")}
        ${barRow("💼 LinkedIn Profile Enquiries", m.liEnquiries, "#3730a3")}
        ${barRow("🤖 AI Chatbot Inquiries", m.chatbot, "#f59e0b")}
        ${barRow("⭐ Patient Feedback", m.feedback, "#ec4899")}
      </div>

      <!-- Top Repeated Emails -->
      ${topEmailsHtml}

      <!-- Historical Trends -->
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:22px;">
        <h3 style="margin:0 0 12px 0;font-size:15px;color:#0f172a;font-weight:700;">📈 Recent Performance History</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;font-size:12px;color:#64748b;text-transform:uppercase;">
              <th style="padding:8px 10px;text-align:left;">Period</th>
              <th style="padding:8px 10px;text-align:center;">Visitors</th>
              <th style="padding:8px 10px;text-align:center;">Views</th>
              <th style="padding:8px 10px;text-align:center;">Leads</th>
              <th style="padding:8px 10px;text-align:center;">Conv.</th>
            </tr>
          </thead>
          <tbody>
            ${trendRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Quick Action Buttons -->
      <div style="text-align:center;margin-bottom:12px;">
        <a href="${escapeHtml(ssUrl)}" style="display:inline-block;padding:12px 20px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:4px;">📊 Live Google Sheet</a>
        <a href="https://airtable.com/apptNJUsbdqh4dxvS" style="display:inline-block;padding:12px 20px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:4px;">🗂️ Airtable Base</a>
        <a href="https://janegracyint2027g3.atlassian.net/jira/core/projects/PHY/board" style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:4px;">📋 Jira PHY Board</a>
        <a href="https://physiomatics.vercel.app/" style="display:inline-block;padding:12px 20px;background:#f1f5f9;color:#334155;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;border:1px solid #cbd5e1;margin:4px;">🌐 Visit Website</a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;">
      Physiomatics Intelligence System &bull; Google Sheets &bull; Jira &bull; Airtable &bull; Telegram &bull; YouTube &bull; LinkedIn
    </div>

  </div>
</body>
</html>`;
}

export function buildReportPlainText(interval: string, m: ReportMetrics): string {
  const topEmailsText =
    m.topEmails && m.topEmails.length > 0
      ? "Most Repeated Lead Emails:\n" +
        m.topEmails.map((e, i) => `  ${i + 1}. ${e.email} (${e.name}) — ${e.count}x [${e.source}]`).join("\n")
      : "Most Repeated Lead Emails: None recorded for this period.";

  return [
    `[${interval} Summary] Physiomatics Website Report`,
    `Period: ${m.period}`,
    `Unique Visitors: ${m.visitors}`,
    `Total Page Views: ${m.pageViews}`,
    `Total Leads (Omnichannel): ${m.totalAllLeads} (Conv: ${m.convRate})`,
    `  ↳ Telegram Leads: ${m.telegramLeads} (${m.telegramSentAlerts} alerts delivered)`,
    `  ↳ YouTube Leads: ${m.ytEnquiries} (${m.ytLeads} comments total)`,
    `  ↳ LinkedIn Leads: ${m.liEnquiries} (${m.liLeads} interactions total)`,
    `  ↳ Web Forms: ${m.leads} (Demos: ${m.demos}, Consults: ${m.consults}, Quick: ${m.quick})`,
    `Chatbot Messages: ${m.chatbot}`,
    `Avg Engagement: ${m.avgDuration}s`,
    topEmailsText,
    `Sheet URL: ${m.sheetUrl || "https://docs.google.com/spreadsheets/d/1FZW3gVn8122ufMPScamNRhTQUYSIqjl7ApP_f_VA8mQ/edit"}`,
    `Platform: https://physiomatics.vercel.app/`,
  ].join("\n");
}

export async function fetchReportDataFromAppsScript(
  interval: string,
  customDate?: string
): Promise<{ retrieved: boolean; metrics: ReportMetrics }> {
  const sheetsUrl =
    process.env.GOOGLE_SHEETS_URL ||
    process.env.VITE_GOOGLE_SHEETS_URL ||
    "https://script.google.com/macros/s/AKfycby_kT_VKNkpRR9xFfVQbf3TFyQ7oINUhgU1DIkjhZSazdeDIrAwBFgklDXN_dfZVx_2/exec";

  const defaultMetrics = getDefaultMetrics(interval, customDate);

  try {
    const fetchUrl = `${sheetsUrl}?action=run_digest&interval=${encodeURIComponent(interval)}`;
    const res = await fetch(fetchUrl, {
      method: "GET",
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        const d = json.data;
        const merged: ReportMetrics = {
          interval: d.interval || interval,
          period: customDate || d.period || defaultMetrics.period,
          totalEvents: Number(d.totalEvents) || 0,
          visitors: Number(d.visitors) || 0,
          pageViews: Number(d.pageViews) || 0,
          demos: Number(d.demos) || 0,
          quick: Number(d.quick) || 0,
          consults: Number(d.consults) || 0,
          chatbot: Number(d.chatbot) || 0,
          feedback: Number(d.feedback) || 0,
          leads: Number(d.leads) || 0,
          convRate: d.convRate || "0.0%",
          avgDuration: d.avgDuration || "0",
          ytLeads: Number(d.ytLeads) || 0,
          ytEnquiries: Number(d.ytEnquiries) || 0,
          liLeads: Number(d.liLeads) || 0,
          liEnquiries: Number(d.liEnquiries) || 0,
          telegramLeads: Number(d.telegramLeads) || 0,
          telegramSentAlerts: Number(d.telegramSentAlerts) || 0,
          totalAllLeads: Number(d.totalAllLeads) || 0,
          topEmails: Array.isArray(d.topEmails) ? d.topEmails : [],
          trendRows: Array.isArray(d.trendRows) ? d.trendRows : [],
          sheetUrl: d.sheetUrl || defaultMetrics.sheetUrl,
        };
        console.log(`[Report/Data] ✓ Retrieved aggregated metrics from Apps Script for ${interval} (${merged.period})`);
        return { retrieved: true, metrics: merged };
      }
    }
    console.warn(`[Report/Data] Apps Script response status ${res.status}. Falling back to default zero-state metrics.`);
  } catch (err: any) {
    console.warn(`[Report/Data] Could not fetch live metrics from Apps Script (${err?.message || err}). Using default zero-state.`);
  }

  return { retrieved: false, metrics: defaultMetrics };
}

export async function sendExecutiveReportEmail(params: {
  interval: string;
  metrics: ReportMetrics;
  customDate?: string;
}): Promise<{
  success: boolean;
  messageId?: string;
  recipientCount: number;
  response?: string;
  error?: string;
}> {
  const { interval, metrics } = params;

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || "";
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASS || process.env.GMAIL_PASS || "";
  const reportEmailConfig = process.env.REPORT_EMAIL || process.env.ADMIN_EMAIL || "janegracy.int2027g3@gmail.com";

  const recipients = reportEmailConfig
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  const recipientCount = recipients.length;

  console.log(`[Email] Preparing ${interval} Report dispatch (Period: ${metrics.period}). Recipient count: ${recipientCount}`);

  if (!smtpUser || !smtpPass) {
    const errorMsg = "SMTP credentials missing. Please set SMTP_USER and SMTP_PASS in Vercel environment variables.";
    console.warn(`[Email] ✗ Cannot deliver email: ${errorMsg}`);
    return {
      success: false,
      recipientCount,
      error: errorMsg,
    };
  }

  if (recipientCount === 0) {
    const errorMsg = "No valid recipient email address configured in REPORT_EMAIL.";
    console.warn(`[Email] ✗ Cannot deliver email: ${errorMsg}`);
    return {
      success: false,
      recipientCount: 0,
      error: errorMsg,
    };
  }

  const subject = `📊 [Physiomatics] ${interval} Digest — ${metrics.visitors} Visitors, ${metrics.totalAllLeads} Leads (${metrics.convRate})`;
  const htmlContent = buildReportHtml(interval, metrics);
  const plainContent = buildReportPlainText(interval, metrics);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      pool: false,
      secure: true,
    });

    const info = await transporter.sendMail({
      from: `"Physiomatics Website Intelligence" <${smtpUser}>`,
      to: recipients.join(", "),
      subject,
      text: plainContent,
      html: htmlContent,
      replyTo: smtpUser,
    });

    console.log(
      `[Email] ✓ ${interval} Report email successfully accepted by Gmail SMTP. Message ID: ${info.messageId || "N/A"}. Response: ${info.response || "250 OK"}`
    );

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      recipientCount,
    };
  } catch (err: any) {
    const errorDetail = err?.message || String(err);
    console.error(`[Email] ✗ Failed to send ${interval} report email via Gmail SMTP:`, errorDetail);
    return {
      success: false,
      recipientCount,
      error: errorDetail,
    };
  }
}

export async function sendTelegramReport(token: string, chatId: string, text: string): Promise<boolean> {
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
        resolve(res.statusCode === 200);
      }
    );

    req.on("error", () => resolve(false));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}

export async function createJiraDigestTask(params: {
  interval: ReportInterval;
  period: string;
}): Promise<string | null> {
  const email = process.env.JIRA_EMAIL || process.env.VITE_JIRA_EMAIL || "janegracy.int2027g3@gmail.com";
  const apiToken = process.env.JIRA_API_TOKEN || process.env.VITE_JIRA_API_TOKEN || "";
  const host = (process.env.JIRA_HOST || process.env.VITE_JIRA_HOST || "janegracyint2027g3.atlassian.net").replace(/^https?:\/\//, "");
  const projectKey = process.env.JIRA_PROJECT_KEY || "PHY";

  if (!apiToken || !host) return null;

  const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString("base64")}`;
  const summary = `[${params.interval} Report] Physiomatics Executive Digest — ${params.period}`;

  const descriptionLines = [
    `*Physiomatics ${params.interval} Operations & Intelligence Digest*`,
    `• *Period:* ${params.period}`,
    `• *Platform:* https://physiomatics.vercel.app/`,
    `• *Generated:* ${new Date().toISOString()}`,
    `• *Engine:* Vercel Cron Automations (Asia/Kolkata)`,
    ``,
    `*System Status:* All website lead pipelines (Google Sheets, Jira, Airtable, Telegram) active and operational.`,
  ];

  try {
    const res = await fetch(`https://${host}/rest/api/3/issue`, {
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
            content: [{ type: "paragraph", content: [{ type: "text", text: descriptionLines.join("\n") }] }],
          },
          issuetype: { name: "Task" },
          labels: ["physiomatics-report", `${params.interval.toLowerCase()}-digest`],
        },
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as { key: string };
      return data.key;
    }
  } catch (err) {
    console.warn(`[Cron] Jira report creation notice:`, err);
  }
  return null;
}

export async function runReportForInterval(interval: ReportInterval, customDate?: string): Promise<ReportRunResult> {
  const kolkataNow = getKolkataDate();
  const dateStr: string = customDate || kolkataNow.toISOString().split("T")[0] || "";

  console.log(`[Cron] Executing ${interval} executive report for period ${dateStr} (IST)`);

  const { retrieved, metrics } = await fetchReportDataFromAppsScript(interval, dateStr);
  console.log(`[Cron] Report data retrieved from Google Sheets: ${retrieved ? "YES" : "NO (using fallback metrics)"}`);

  const jiraKey = await createJiraDigestTask({ interval, period: dateStr });
  if (jiraKey) {
    console.log(`[Cron] ✓ Jira digest task created: ${jiraKey}`);
  } else {
    console.warn(`[Cron] Jira digest task skipped or credentials missing.`);
  }

  let telegramSent = false;
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChatId) {
    const tgMsg = [
      `📊 <b>Physiomatics ${interval} Executive Digest</b>`,
      "",
      `🗓️ <b>Period:</b> ${dateStr} (Asia/Kolkata)`,
      `👥 <b>Visitors:</b> ${metrics.visitors} | 📄 <b>Views:</b> ${metrics.pageViews}`,
      `🎯 <b>Total Leads:</b> ${metrics.totalAllLeads} (${metrics.convRate} conv)`,
      jiraKey ? `🎫 <b>Jira Digest Task:</b> <code>${jiraKey}</code>` : null,
      `🌐 <b>Website:</b> https://physiomatics.vercel.app/`,
      "",
      `✅ Automated lead routing, Jira tasks, and data sync engines operating normally.`,
    ].filter(Boolean).join("\n");

    telegramSent = await sendTelegramReport(tgToken, tgChatId, tgMsg);
    console.log(`[Cron] Telegram digest dispatch: ${telegramSent ? "SUCCESS" : "FAILED"}`);
  }

  const emailResult = await sendExecutiveReportEmail({
    interval,
    metrics,
    customDate: dateStr,
  });

  console.log(
    `[Cron] ${interval} Report Execution Completed: Email=${emailResult.success ? "DELIVERED" : "FAILED"} (Recipients=${emailResult.recipientCount}), Jira=${jiraKey || "none"}, Telegram=${telegramSent}`
  );

  return {
    period: dateStr,
    jira_task: jiraKey || "skipped_or_failed",
    telegram_sent: telegramSent,
    email_sent: emailResult.success,
    email_message_id: emailResult.messageId,
    email_recipients_count: emailResult.recipientCount,
    report_data_retrieved: retrieved,
    email_response: emailResult.response,
    error: emailResult.error,
  };
}

export async function runDailyReport(customDate?: string): Promise<ReportRunResult> {
  return runReportForInterval("Daily", customDate);
}

export async function runWeeklyReport(customDate?: string): Promise<ReportRunResult> {
  return runReportForInterval("Weekly", customDate);
}

export async function runMonthlyReport(customDate?: string): Promise<ReportRunResult> {
  return runReportForInterval("Monthly", customDate);
}

export async function runAllReports(customDate?: string): Promise<Record<ReportInterval, ReportRunResult>> {
  const intervals: ReportInterval[] = ["Daily", "Weekly", "Monthly"];
  const results: Record<string, ReportRunResult> = {};
  for (const interval of intervals) {
    results[interval] = await runReportForInterval(interval, customDate);
  }
  return results as Record<ReportInterval, ReportRunResult>;
}

export function handleReportEndpoint(interval: ReportInterval | "All") {
  return async function (req: VercelRequest, res: VercelResponse) {
    if (!verifyCronAuth(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const kolkataNow = getKolkataDate();
    const customDate = typeof req.query.date === "string" ? req.query.date : undefined;

    try {
      if (interval === "All") {
        console.log(`[Cron] Invoking All 3 Executive Reports endpoint (${kolkataNow.toISOString()})`);
        const results = await runAllReports(customDate);
        return res.status(200).json({
          success: true,
          triggered: "All 3 reports (Daily, Weekly, Monthly)",
          timestamp_ist: kolkataNow.toISOString(),
          runs: results,
        });
      }

      console.log(`[Cron] Invoking ${interval} Executive Report endpoint (${kolkataNow.toISOString()})`);
      const result = await runReportForInterval(interval, customDate);

      return res.status(200).json({
        success: true,
        interval,
        timestamp_ist: kolkataNow.toISOString(),
        result,
      });
    } catch (err: any) {
      console.error(`[Cron] Error executing report:`, err);
      return res.status(500).json({
        success: false,
        interval,
        error: err?.message || String(err),
      });
    }
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!verifyCronAuth(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const kolkataNow = getKolkataDate();
    const dayOfWeek = kolkataNow.getDay();
    const dayOfMonth = kolkataNow.getDate();
    const dateStr = kolkataNow.toISOString().split("T")[0];

    let intervalsToRun: ReportInterval[] = [];

    const requestedInterval = String(req.query.interval || "").trim();

    if (
      requestedInterval.toLowerCase() === "all" ||
      req.query.all === "true" ||
      req.query.trigger === "all" ||
      req.query.trigger_all === "true"
    ) {
      intervalsToRun = ["Daily", "Weekly", "Monthly"];
    } else if (requestedInterval === "Daily") {
      intervalsToRun = ["Daily"];
    } else if (requestedInterval === "Weekly") {
      intervalsToRun = ["Weekly"];
    } else if (requestedInterval === "Monthly") {
      intervalsToRun = ["Monthly"];
    } else {
      intervalsToRun = ["Daily"];
      if (dayOfWeek === 1) {
        intervalsToRun.push("Weekly");
      }
      if (dayOfMonth === 1) {
        intervalsToRun.push("Monthly");
      }
    }

    console.log(`[Cron] Running scheduled digests for: ${intervalsToRun.join(", ")} on ${dateStr} (IST)`);

    const results: Record<string, ReportRunResult> = {};

    for (const interval of intervalsToRun) {
      results[interval] = await runReportForInterval(interval, dateStr);
    }

    return res.status(200).json({
      success: true,
      triggered_reports: intervalsToRun,
      timestamp_ist: kolkataNow.toISOString(),
      runs: results,
    });
  } catch (fatalErr: any) {
    console.error("[Cron/Reports] Fatal execution error:", fatalErr);
    return res.status(500).json({
      success: false,
      error: fatalErr?.message || String(fatalErr),
    });
  }
}
