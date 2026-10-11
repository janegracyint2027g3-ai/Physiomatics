/**
 * Utility to sync form submissions, user feedback, analytics, and session telemetry
 * to the Google Apps Script Web App configured in .env via VITE_GOOGLE_SHEETS_URL.
 */

const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ||
  "https://script.google.com/macros/s/AKfycbxI1_azH8xgylaC16XYrkOLuEkwI92Tr_-LhFQ_FJaoymTU7nmN2dQ0ukfr2VWpYfVMbw/exec";

export interface SheetPayload {
  action?: string;
  formType?: string;
  source?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Send data to Google Sheets via fetch.
 * Uses mode: 'no-cors' so that browser CORS restrictions with Google Apps Script
 * redirects (302) do not throw errors or block form progression.
 */
export async function sendToGoogleSheet(payload: SheetPayload): Promise<boolean> {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("VITE_GOOGLE_SHEETS_URL is not configured.");
    return false;
  }

  const dataToSend = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
    pageUrl: typeof window !== "undefined" ? window.location.href : "Unknown",
  };

  try {
    // Google Apps Script accepts text/plain or application/x-www-form-urlencoded easily without CORS preflight blocks
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(dataToSend),
    });

    console.info("Synced to Google Sheets successfully:", payload.formType || payload.action || "record");
    return true;
  } catch (err) {
    console.error("Failed to sync to Google Sheets:", err);
    return false;
  }
}
