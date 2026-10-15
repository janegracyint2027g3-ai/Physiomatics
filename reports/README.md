# Physiomatics Executive Reporting Engine & Email Architecture

This document outlines the architecture, scheduled triggers, email delivery engine, and testing instructions for the automated Daily, Weekly, and Monthly Physiomatics Executive Digests.

---

## 1. Architecture Overview

```
                                  ┌────────────────────────┐
                                  │   Vercel Cron Engine   │
                                  │   (Daily, Weekly, Mon) │
                                  └───────────┬────────────┘
                                              │ GET /api/cron/reports?interval=...
                                              ▼
                                 ┌─────────────────────────┐
                                 │   api/cron/reports.ts   │
                                 │  (Central Coordinator)  │
                                 └────────────┬────────────┘
                   ┌──────────────────────────┼─────────────────────────┐
                   ▼                          ▼                         ▼
         ┌───────────────────┐      ┌───────────────────┐     ┌───────────────────┐
         │ 1. Data Retrieval │      │  2. Integrations  │     │ 3. Email Delivery │
         │   (Google Sheets) │      │  • Jira (PHY)     │     │   (Nodemailer)    │
         │   via Apps Script │      │  • Telegram Bot   │     │   via Gmail SMTP  │
         │  get_report_data  │      │    Instant Digest │     │   (Direct Vercel) │
         └───────────────────┘      └───────────────────┘     └───────────────────┘
```

### Key Architectural Principles
1. **Direct Vercel Email Delivery**: All executive report emails are sent directly from the Vercel Serverless Function backend via Nodemailer with Gmail SMTP.
2. **Decoupled Responsibilities**: Google Apps Script compiles and aggregates data from `Live_Traffic_Events`, `YouTube_Raw_Leads`, and `LinkedIn_Raw_Leads`. It **no longer** sends report emails (`MailApp.sendEmail` removed for reports), completely eliminating duplicate emails and Apps Script quota limits.
3. **Single Source of Truth**: `api/cron/reports.ts` is the single source of truth for coordinating the reporting pipeline, Jira digest tasks, Telegram alerts, and SMTP delivery.
4. **Resilience & Fallbacks**: If Google Sheets / Apps Script takes too long to respond on a cold start, Vercel gracefully proceeds with fallback metrics so report delivery never fails.
5. **Accurate Delivery Reporting**: The API only reports `email_sent: true` when Gmail SMTP accepts the message and returns a valid Message-ID.

---

## 2. Production Schedules & Endpoints

| Report | IST Schedule | UTC Cron (`vercel.json`) | Endpoint | Rewrite / Route |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Report** | Daily at 9:00 PM IST (21:00) | `30 15 * * *` (15:30 UTC) | `/api/report-daily` | `/api/cron/reports?interval=Daily` |
| **Weekly Report** | Mondays at 9:00 AM IST | `30 3 * * 1` (03:30 UTC Mon) | `/api/report-weekly` | `/api/cron/reports?interval=Weekly` |
| **Monthly Report** | 1st of month at 9:00 AM IST | `30 3 1 * *` (03:30 UTC 1st) | `/api/report-monthly` | `/api/cron/reports?interval=Monthly` |
| **All 3 Reports (Trigger)** | On-demand / Trigger | Triggers Daily, Weekly, & Monthly emails | `/api/report-all` | `/api/cron/reports?interval=All` |
| **Unified Cron** | Dynamic fallback | Scheduled via crons | `/api/cron/reports` | Main handler |

> **Note on Hobby Plan Limits**: Consolidating endpoints through `api/cron/reports.ts` and `vercel.json` rewrites guarantees compliance with Vercel's 12-function limit on the Hobby plan.

---

## 3. Required Environment Variables

Configure these variables in **Vercel Project Settings → Environment Variables**:

| Variable | Description | Example / Recommended |
| :--- | :--- | :--- |
| `SMTP_USER` | Authorized Gmail account used as sender | `janegracy.int2027g3@gmail.com` |
| `SMTP_PASS` | 16-character Gmail App Password (not your Gmail login password) | `abcd efgh ijkl mnop` |
| `REPORT_EMAIL` | Comma-separated list of executive recipients | `janegracy.int2027g3@gmail.com` |
| `CRON_SECRET` | Secret token protecting cron endpoints from unauthorized triggers | e.g. `physiomatics_cron_secret_2026` |
| `GOOGLE_SHEETS_URL` | Apps Script `/exec` Web App URL for data fetching | `https://script.google.com/macros/s/.../exec` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token for instant alerts | `8624490353:AAHR...` |
| `TELEGRAM_CHAT_ID` | Telegram chat/group ID for executive alerts | `7545126841` |
| `JIRA_API_TOKEN` | Jira Cloud API token for Task creation | Atlassian API token |
| `JIRA_EMAIL` | Jira account email | `janegracy.int2027g3@gmail.com` |
| `JIRA_HOST` | Jira host domain | `janegracyint2027g3.atlassian.net` |
| `JIRA_PROJECT_KEY`| Project key for report tasks | `PHY` |

---

## 4. How to Generate a Gmail App Password

1. Go to your **Google Account** ([https://myaccount.google.com/](https://myaccount.google.com/)).
2. Navigate to **Security** → **2-Step Verification** (must be enabled).
3. Scroll to the bottom and click on **App Passwords**.
4. Create a new App Password:
   - App name: `Physiomatics Reports`
5. Copy the 16-character code (without spaces) and paste it into Vercel as `SMTP_PASS`.

---

## 5. Testing & Verification

### A. Testing Endpoints Locally or via cURL

Pass the `CRON_SECRET` either in the `Authorization: Bearer <SECRET>` header or as `?secret=<SECRET>` query parameter:

```bash
# Test Daily Report
curl -X GET "https://physiomatics.vercel.app/api/report-daily?secret=YOUR_CRON_SECRET"

# Test Weekly Report
curl -X GET "https://physiomatics.vercel.app/api/report-weekly?secret=YOUR_CRON_SECRET"

# Test Monthly Report
curl -X GET "https://physiomatics.vercel.app/api/report-monthly?secret=YOUR_CRON_SECRET"

# Trigger ALL 3 reports (Daily, Weekly, Monthly) at once
curl -X GET "https://physiomatics.vercel.app/api/report-all?secret=YOUR_CRON_SECRET"

# Test unified endpoint with a custom date
curl -X GET "https://physiomatics.vercel.app/api/cron/reports?interval=Daily&date=2026-10-15&secret=YOUR_CRON_SECRET"
```

### B. Expected Response Format

```json
{
  "success": true,
  "interval": "Daily",
  "timestamp_ist": "2026-10-15T21:00:00.000Z",
  "result": {
    "period": "2026-10-15",
    "jira_task": "PHY-792",
    "telegram_sent": true,
    "email_sent": true,
    "email_message_id": "<0100018f...gmail.com>",
    "email_recipients_count": 1,
    "report_data_retrieved": true,
    "email_response": "250 2.0.0 OK"
  }
}
```

### C. Error Handling Verification

If `SMTP_USER` or `SMTP_PASS` is omitted or invalid, the API gracefully logs the issue and returns:
```json
{
  "email_sent": false,
  "error": "SMTP credentials missing. Please set SMTP_USER and SMTP_PASS in Vercel environment variables."
}
```
The endpoint returns HTTP 200 with `email_sent: false` so monitoring tools can detect delivery status accurately without failing entire cron batches.

---

## 6. Duplicate Email Prevention

1. **Apps Script Trigger Clean-up**:
   - `disableAppsScriptReportTriggers()` removes `dailyReport`, `weeklyReport`, and `monthlyReport` time-based triggers in Google Apps Script.
   - `setupPhysiomaticsTriggers()` now only creates the hourly YouTube auto-sync trigger (`SYNC_YOUTUBE_COMMENTS_AUTO`), omitting any internal report triggers.
2. **Single Scheduler**:
   - Only Vercel Cron executes at the scheduled times (15:30 UTC Daily, 03:30 UTC Mondays, 03:30 UTC 1st of month).
