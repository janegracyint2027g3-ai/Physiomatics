/**
 * Vercel Serverless Function — Scheduled Monthly Report Endpoint
 *
 * Route: GET /api/report-monthly (also accepts POST)
 * Schedule: 03:30 UTC on the 1st of every month (= 09:00 AM Asia/Kolkata IST)
 *
 * Invokes existing monthly report generation from api/cron/reports.ts
 * Protected by CRON_SECRET Bearer header / query param.
 */

import { handleReportEndpoint } from "./cron/reports";

export const config = {
  maxDuration: 30,
};

export default handleReportEndpoint("Monthly");
