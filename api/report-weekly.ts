/**
 * Vercel Serverless Function — Scheduled Weekly Report Endpoint
 *
 * Route: GET /api/report-weekly (also accepts POST)
 * Schedule: 03:30 UTC every Monday (= 09:00 AM Asia/Kolkata IST)
 *
 * Invokes existing weekly report generation from api/cron/reports.ts
 * Protected by CRON_SECRET Bearer header / query param.
 */

import { handleReportEndpoint } from "./cron/reports";

export const config = {
  maxDuration: 30,
};

export default handleReportEndpoint("Weekly");
