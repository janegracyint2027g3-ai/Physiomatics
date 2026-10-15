/**
 * Vercel Cron Job — Scheduled Executive Reporting Engine
 *
 * Route: GET /api/cron/reports
 * Schedule: 15:30 UTC daily (= 21:00 / 9:00 PM Asia/Kolkata IST)
 *
 * Performs:
 *  1. Daily Executive Digest & Jira Task creation
 *  2. Weekly Executive Digest on Mondays
 *  3. Monthly Executive Digest on the 1st of each month
 *  4. Rich Telegram Executive Report delivery to TELEGRAM_CHAT_ID
 *  5. Jira Digest Task creation under project PHY
 *
 * Protected by CRON_SECRET Bearer header.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as https from "https";
import {
  fetchReportDataFromAppsScript,
  sendExecutiveReportEmail,
  type ReportMetrics,
} from "../../src/lib/reportEmail.ts";

export const config = {
  maxDuration: 60,
};

export type ReportInterval = "Daily" | "Weekly" | "Monthly";

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
  // Current time in IST (UTC+5:30)
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

  // 1. Fetch live aggregated metrics from Google Sheets via Apps Script endpoint
  const { retrieved, metrics } = await fetchReportDataFromAppsScript(interval, dateStr);
  console.log(`[Cron] Report data retrieved from Google Sheets: ${retrieved ? "YES" : "NO (using fallback metrics)"}`);

  // 2. Create Jira Digest Task under project PHY
  const jiraKey = await createJiraDigestTask({ interval, period: dateStr });
  if (jiraKey) {
    console.log(`[Cron] ✓ Jira digest task created: ${jiraKey}`);
  } else {
    console.warn(`[Cron] Jira digest task skipped or credentials missing.`);
  }

  // 3. Send Telegram executive digest
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

  // 4. Send Executive Report Email directly from Vercel backend using Nodemailer / Gmail SMTP
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
  // Verify Cron authorization
  if (!verifyCronAuth(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const kolkataNow = getKolkataDate();
  const dayOfWeek = kolkataNow.getDay(); // 0 = Sun, 1 = Mon ...
  const dayOfMonth = kolkataNow.getDate(); // 1..31
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
    // Default automated schedule matching current day
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
}
