/**
 * Microsoft Clarity Analytics & Heatmap Integration
 * Project ID: yw07ute7ic
 *
 * Features:
 * - Session Recordings & User Replays
 * - Click Maps, Scroll Maps & Area Heatmaps
 * - Custom Event Tracking (page views, CTA clicks, scroll depth, form submissions)
 * - Custom Tagging (visitor type, visit count, lead type)
 * - Session Upgrades (prioritizes lead & conversion sessions in Clarity dashboard)
 */

declare global {
  interface Window {
    clarity?: {
      (command: "event", name: string): void;
      (command: "set", key: string, value: string | string[]): void;
      (command: "identify", customId: string, sessionId?: string, pageId?: string, friendlyName?: string): void;
      (command: "upgrade", reason: string): void;
      (command: "consent"): void;
      (command: string, ...args: any[]): void;
      q?: any[];
    };
  }
}

export const CLARITY_PROJECT_ID =
  import.meta.env.VITE_CLARITY_ID || "yw07ute7ic";

let isInitialized = false;

/**
 * Initializes Microsoft Clarity tracking script.
 * Idempotent: safe to call multiple times, only runs once in the browser.
 */
export function initClarity(projectId: string = CLARITY_PROJECT_ID): void {
  if (typeof window === "undefined" || isInitialized) return;
  if (!projectId) {
    console.warn("[Clarity] No Clarity Project ID provided.");
    return;
  }

  try {
    // Official Microsoft Clarity loader script
    (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      } else {
        l.head.appendChild(t);
      }
    })(window, document, "clarity", "script", projectId);

    isInitialized = true;
    console.info(`[Clarity] Initialized with ID: ${projectId}`);
  } catch (err) {
    console.error("[Clarity] Failed to initialize:", err);
  }
}

/** Track a custom event in Clarity for heatmaps and funnel analysis */
export function trackClarityEvent(eventName: string): void {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    window.clarity("event", eventName);
  } catch (err) {
    // ignore
  }
}

/** Set custom dimensions/tags in Clarity (filterable in dashboard) */
export function setClarityTag(key: string, value: string | string[]): void {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    window.clarity("set", key, value);
  } catch (err) {
    // ignore
  }
}

/**
 * Identify a user in Clarity session recordings
 * @param customId Anonymous persistent visitor ID
 * @param sessionId Current session ID
 * @param pageId Current page path
 * @param friendlyName Human-friendly label (e.g. "Visitor #3")
 */
export function identifyClarityUser(
  customId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string
): void {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    window.clarity("identify", customId, sessionId, pageId, friendlyName);
  } catch (err) {
    // ignore
  }
}

/**
 * Upgrade session: forces Clarity to record and prioritize high-value sessions
 * (e.g. lead submissions, demo requests, consultations)
 */
export function upgradeClaritySession(reason: string): void {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    window.clarity("upgrade", reason);
  } catch (err) {
    // ignore
  }
}
