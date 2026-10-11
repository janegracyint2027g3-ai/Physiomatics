/**
 * Utility to sync form submissions, user feedback, analytics, and session
 * telemetry to the Google Apps Script Web App (VITE_GOOGLE_SHEETS_URL).
 *
 * WHY GET params?
 * With mode:'no-cors' the browser never reads the response, so we can't know
 * if the POST body was received. Google Apps Script reliably reads GET query
 * parameters via e.parameter regardless of CORS, making GET the safest choice
 * for cross-origin fire-and-forget calls to Apps Script.
 */

const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ||
  "https://script.google.com/macros/s/AKfycbxI1_azH8xgylaC16XYrkOLuEkwI92Tr_-LhFQ_FJaoymTU7nmN2dQ0ukfr2VWpYfVMbw/exec";

export interface SheetPayload {
  action?: string;
  form_type?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Encode all fields as URL query parameters and fire a GET request.
 * Apps Script reads them via e.parameter.fieldName in doGet(e).
 * mode:'no-cors' suppresses CORS errors on the 302 redirect Apps Script returns.
 */
export async function sendToGoogleSheet(payload: SheetPayload): Promise<boolean> {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("VITE_GOOGLE_SHEETS_URL is not configured.");
    return false;
  }

  const params: Record<string, string> = {
    timestamp: new Date().toISOString(),
    pageUrl:
      typeof window !== "undefined" ? window.location.href : "Unknown",
  };

  // Flatten payload into string values
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params[k] = String(v);
  });

  const qs = new URLSearchParams(params).toString();
  const url = `${GOOGLE_SHEETS_URL}?${qs}`;

  try {
    await fetch(url, { method: "GET", mode: "no-cors" });
    console.info(
      "[Sheets] ✓ sent:",
      payload.action || payload.form_type || "event"
    );
    return true;
  } catch (err) {
    console.error("[Sheets] ✗ failed:", err);
    return false;
  }
}

/* ─── Convenience helpers ──────────────────────────────────────────────── */

/** Call this on any button/link click you want tracked. */
export function trackClick(label: string, extra?: Record<string, string>) {
  sendToGoogleSheet({ action: "click", label, ...extra }).catch(() => {});
}

/** Call this with a section name when a landmark section enters the viewport. */
export function trackScroll(section: string) {
  sendToGoogleSheet({ action: "scroll", section }).catch(() => {});
}

