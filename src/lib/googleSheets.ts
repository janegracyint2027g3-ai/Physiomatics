/**
 * Utility to sync form submissions, user feedback, analytics, and session
 * telemetry to the Google Apps Script Web App (VITE_GOOGLE_SHEETS_URL).
 *
 * Automatically attaches:
 * - Anonymous visitor_id and session_id from visitorSession.ts
 * - Real client geolocation (latitude, longitude, city, region, country, timezone)
 * - Network intelligence (client_ip, ISP/Org, ASN, proxy flag)
 *
 * Cross-origin calls use GET query parameters with mode:'no-cors', which reliably
 * delivers events to Google Apps Script's doGet(e) without CORS blockage.
 */

import { resolveVisitorSession } from "@/lib/visitorSession";
import { getCachedGeoIntelligence, getGeoIntelligence } from "@/lib/geoIntelligence";
import { captureVercelLead, trackVercelEvent } from "@/lib/vercelAnalytics";

const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ||
  "https://script.google.com/macros/s/AKfycby_kT_VKNkpRR9xFfVQbf3TFyQ7oINUhgU1DIkjhZSazdeDIrAwBFgklDXN_dfZVx_2/exec";

const GOOGLE_ANALYTICS_URL =
  import.meta.env.VITE_GOOGLE_ANALYTICS_URL || "";

export interface SheetPayload {
  action?: string;
  form_type?: string;
  form_name?: string;
  form_status?: string;
  visitor_id?: string;
  session_id?: string;
  label?: string;
  element_text?: string;
  section?: string;
  category?: string;
  page_path?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Encode all fields as URL query parameters and fire requests to Google Apps Script.
 * Apps Script reads them via e.parameter.fieldName in doGet(e).
 */
export async function sendToGoogleSheet(payload: SheetPayload): Promise<boolean> {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("VITE_GOOGLE_SHEETS_URL is not configured.");
    return false;
  }

  // 1. Session resolution (anonymous UUIDs)
  let visitorId = "";
  let sessionId = "";
  try {
    const session = resolveVisitorSession();
    visitorId = session.visitorId;
    sessionId = session.sessionId;
  } catch {
    // fallback if SSR/unavailable
  }

  // 2. Geolocation & IP intelligence (from cache or trigger in background)
  const geo = getCachedGeoIntelligence();

  // If cache is empty and in browser, kick off background fetch for next events
  if (typeof window !== "undefined" && !geo.latitude && !geo.geo_city) {
    getGeoIntelligence().catch(() => {});
  }

  const baseParams: Record<string, string> = {
    timestamp: new Date().toISOString(),
    pageUrl: typeof window !== "undefined" ? window.location.href : "Unknown",
    page_path: typeof window !== "undefined" ? window.location.pathname : "/",
    page_title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    language: typeof navigator !== "undefined" ? navigator.language : "",
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "Asia/Kolkata",
  };

  if (visitorId && !payload.visitor_id) baseParams.visitor_id = visitorId;
  if (sessionId && !payload.session_id) baseParams.session_id = sessionId;

  // Merge Geo & IP intelligence fields if not already provided
  const geoKeys: (keyof typeof geo)[] = [
    "latitude",
    "longitude",
    "geo_accuracy_meters",
    "geo_city",
    "geo_region",
    "geo_country",
    "geo_country_code",
    "geo_timezone",
    "location_method",
    "consent_status",
    "client_ip",
    "ip_city",
    "ip_region",
    "ip_country",
    "ip_country_code",
    "ip_org",
    "ip_asn",
    "ip_source",
    "security_event",
  ];

  geoKeys.forEach((k) => {
    if (geo[k] !== undefined && geo[k] !== "" && payload[k] === undefined) {
      baseParams[k] = String(geo[k]);
    }
  });

  // Flatten payload into string values (payload overrides base)
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      baseParams[k] = String(v);
    }
  });

  const qs = new URLSearchParams(baseParams).toString();
  const primaryUrl = `${GOOGLE_SHEETS_URL}?${qs}`;

  let success = false;
  try {
    await fetch(primaryUrl, { method: "GET", mode: "no-cors" });
    success = true;
    console.info(
      "[Sheets] ✓ sent:",
      payload.action || payload.form_type || "event"
    );
  } catch (err) {
    console.error("[Sheets] ✗ primary failed:", err);
  }

  // Forward non-lead UI engagement events to Vercel Web Analytics
  try {
    if (payload.action === "click") {
      trackVercelEvent("cta_click", {
        label: String(payload.label || payload.element_text || "button"),
        path: baseParams.page_path || "/",
      });
    } else if (payload.action === "scroll") {
      trackVercelEvent("scroll_depth", {
        depth: String(payload.section || "0%"),
        path: baseParams.page_path || "/",
      });
    } else if (payload.action === "user_feedback") {
      trackVercelEvent("user_feedback", {
        category: String(payload.category || "general"),
      });
    }
  } catch (_) {}

  return success;
}

/* ─── Convenience helpers ──────────────────────────────────────────────── */

/** Call this on page navigation to track page views & performance */
export function trackPageView(pagePath: string, title?: string) {
  sendToGoogleSheet({
    action: "page_view",
    event_type: "page_view",
    event_name: "page_view",
    page_path: pagePath,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
    traffic_source:
      typeof document !== "undefined" && document.referrer ? "referral" : "direct",
    referrer_url: typeof document !== "undefined" ? document.referrer : "",
  }).catch(() => {});
}

/** Call this on any button/link click you want tracked */
export function trackClick(label: string, extra?: Record<string, string>) {
  sendToGoogleSheet({
    action: "click",
    event_type: "click",
    label,
    element_text: label,
    ...extra,
  }).catch(() => {});
}

/** Call this with a section name when a landmark section enters the viewport */
export function trackScroll(section: string) {
  sendToGoogleSheet({
    action: "scroll",
    event_type: "scroll",
    section,
  }).catch(() => {});
}

/**
 * Uploads a customer clinical report/document to Google Drive via Apps Script Web App
 * and returns the shareable viewing link for Google Sheets, Jira, and Airtable.
 */
export async function uploadReportDocument(fileData: {
  name: string;
  type: string;
  base64: string;
}): Promise<{ success: boolean; fileUrl?: string; fileName?: string; error?: string }> {
  if (!GOOGLE_SHEETS_URL) {
    return { success: false, error: "GOOGLE_SHEETS_URL not configured" };
  }
  try {
    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upload_report",
        file_name: fileData.name,
        file_type: fileData.type,
        file_base64: fileData.base64,
      }),
      redirect: "follow",
    });

    const data = await res.json();
    if (data.fileUrl) {
      console.info("[Sheets/Drive] ✓ Report uploaded to Google Drive:", data.fileUrl);
      return { success: true, fileUrl: data.fileUrl, fileName: fileData.name };
    }
    return { success: false, error: data.message || "Failed to obtain file URL" };
  } catch (err: any) {
    console.warn("[Sheets/Drive] Report upload error:", err.message);
    return { success: false, error: err.message };
  }
}
