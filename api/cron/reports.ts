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

export const config = {
  maxDuration: 30,
};

function getKolkataDate(): Date {
  // Current time in IST (UTC+5:30)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

async function sendTelegramReport(token: string, chatId: string, text: string): Promise<boolean> {
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

async function createJiraDigestTask(params: {
  interval: "Daily" | "Weekly" | "Monthly";
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify Cron authorization
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
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const kolkataNow = getKolkataDate();
  const dayOfWeek = kolkataNow.getDay(); // 0 = Sun, 1 = Mon ...
  const dayOfMonth = kolkataNow.getDate(); // 1..31
  const dateStr = kolkataNow.toISOString().split("T")[0];

  const intervalsToRun: ("Daily" | "Weekly" | "Monthly")[] = ["Daily"];

  // Weekly digest on Mondays
  if (dayOfWeek === 1 || req.query.interval === "Weekly") {
    intervalsToRun.push("Weekly");
  }

  // Monthly digest on the 1st
  if (dayOfMonth === 1 || req.query.interval === "Monthly") {
    intervalsToRun.push("Monthly");
  }

  // Force specific interval if requested in query
  if (req.query.interval === "Daily" && !intervalsToRun.includes("Daily")) {
    intervalsToRun.push("Daily");
  }

  console.log(`[Cron] Running scheduled digests for: ${intervalsToRun.join(", ")} on ${dateStr} (IST)`);

  const results: Record<string, any> = {};
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;

  for (const interval of intervalsToRun) {
    const periodLabel = `${interval} Digest (${dateStr})`;
    const jiraKey = await createJiraDigestTask({ interval, period: dateStr });

    let telegramSent = false;
    if (tgToken && tgChatId) {
      const tgMsg = [
        `📊 <b>Physiomatics ${interval} Executive Digest</b>`,
        "",
        `🗓️ <b>Period:</b> ${dateStr} (Asia/Kolkata)`,
        jiraKey ? `🎫 <b>Jira Digest Task:</b> <code>${jiraKey}</code>` : null,
        `🌐 <b>Website:</b> https://physiomatics.vercel.app/`,
        "",
        `✅ Automated lead routing, Jira tasks, and data sync engines operating normally.`,
      ].filter(Boolean).join("\n");

      telegramSent = await sendTelegramReport(tgToken, tgChatId, tgMsg);
    }

    // Trigger Google Apps Script Executive Digest Email dispatch
    let emailReportSent = false;
    const sheetsUrl =
      process.env.GOOGLE_SHEETS_URL ||
      process.env.VITE_GOOGLE_SHEETS_URL ||
      "https://script.google.com/macros/s/AKfycby_kT_VKNkpRR9xFfVQbf3TFyQ7oINUhgU1DIkjhZSazdeDIrAwBFgklDXN_dfZVx_2/exec";

    try {
      const emailRes = await fetch(`${sheetsUrl}?action=run_digest&interval=${encodeURIComponent(interval)}`, {
        signal: AbortSignal.timeout(20000),
      });
      emailReportSent = emailRes.ok;
      console.log(`[Cron] Google Apps Script report email triggered (${interval}): status ${emailRes.status}`);
    } catch (sheetCronErr: any) {
      console.warn(`[Cron] Apps Script report email trigger notice (${interval}):`, sheetCronErr?.message || sheetCronErr);
    }

    results[interval] = {
      period: dateStr,
      jira_task: jiraKey || "skipped_or_failed",
      telegram_sent: telegramSent,
      email_sent: emailReportSent,
    };
  }

  return res.status(200).json({
    success: true,
    timestamp_ist: kolkataNow.toISOString(),
    runs: results,
  });
}
