/**
 * Vercel Serverless Function — Scheduled Daily Report Endpoint
 *
 * Route: GET /api/report-daily (also accepts POST)
 * Schedule: 15:30 UTC daily (= 21:00 / 9:00 PM Asia/Kolkata IST)
 *
 * Invokes existing daily report generation from api/cron/reports.ts
 * Protected by CRON_SECRET Bearer header / query param.
 */

import { handleReportEndpoint } from "./cron/reports";

export const config = {
  maxDuration: 30,
};

export default handleReportEndpoint("Daily");
