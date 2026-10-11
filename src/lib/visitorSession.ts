/**
 * useVisitorSession — Physiomatics Returning Visitor Recognition System
 *
 * Stores everything in localStorage under these keys:
 *   physiomatics_visitor_id        — persistent anonymous UUID (never changes)
 *   physiomatics_visit_count       — total number of distinct sessions started
 *   physiomatics_session_id        — UUID for the current session (changes each session)
 *   physiomatics_session_started   — ISO timestamp when the current session began
 *   physiomatics_session_active    — timestamp of the last activity in this session
 *
 * Session definition:
 *   A new session starts when ≥ 30 minutes have elapsed since the last recorded
 *   activity OR when no previous session has ever been started.
 *   Page navigations and refreshes within those 30 minutes are the SAME session.
 *
 * Privacy:
 *   All IDs are randomly generated UUIDs. No name, email, IP or health data is
 *   stored. The visitor_id is anonymous and cannot be linked to a real person.
 */

const SESSION_INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

const KEYS = {
  visitorId:       "physiomatics_visitor_id",
  visitCount:      "physiomatics_visit_count",
  sessionId:       "physiomatics_session_id",
  sessionStarted:  "physiomatics_session_started",
  sessionActive:   "physiomatics_session_active",
};

/** Generate a compact UUID v4. */
function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Rough device category from screen width. */
function getDeviceCategory(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.screen.width;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/** Parse a UA string to get a rough browser label. */
function getBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua))   return "Edge";
  if (/OPR\//.test(ua))   return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

export interface VisitorSessionInfo {
  /** Persistent anonymous UUID — never changes for this browser. */
  visitorId: string;
  /** UUID for the current session — changes after 30 min inactivity. */
  sessionId: string;
  /** Total number of distinct sessions started (≥1). */
  visitCount: number;
  /** Whether this call started a brand-new session. */
  isNewSession: boolean;
  /** "new" on first ever visit, "returning" thereafter. */
  visitorType: "new" | "returning";
  /** ISO string of when the current session was first created. */
  sessionStartedAt: string;
}

/**
 * Idempotent: call it on every page mount.
 * Returns session info and records a new session only when warranted.
 */
export function resolveVisitorSession(): VisitorSessionInfo {
  const now = Date.now();

  // ── 1. Persistent visitor ID ──────────────────────────────────────────────
  let visitorId = localStorage.getItem(KEYS.visitorId) || "";
  const isFirstEverVisit = !visitorId;
  if (!visitorId) {
    visitorId = uuid();
    localStorage.setItem(KEYS.visitorId, visitorId);
  }

  // ── 2. Visit count ────────────────────────────────────────────────────────
  let visitCount = parseInt(localStorage.getItem(KEYS.visitCount) || "0", 10);

  // ── 3. Session expiry check ───────────────────────────────────────────────
  const lastActiveStr = localStorage.getItem(KEYS.sessionActive);
  const lastActive    = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;
  const sessionExpired = !lastActive || (now - lastActive) > SESSION_INACTIVITY_MS;

  // ── 4. Existing session ID / start time ───────────────────────────────────
  let sessionId        = localStorage.getItem(KEYS.sessionId) || "";
  let sessionStartedAt = localStorage.getItem(KEYS.sessionStarted) || "";
  let isNewSession     = false;

  if (sessionExpired || !sessionId) {
    // Start a brand new session
    sessionId        = uuid();
    sessionStartedAt = new Date(now).toISOString();
    visitCount       = visitCount + 1;

    localStorage.setItem(KEYS.sessionId,      sessionId);
    localStorage.setItem(KEYS.sessionStarted, sessionStartedAt);
    localStorage.setItem(KEYS.visitCount,     visitCount.toString());

    isNewSession = true;
  }

  // ── 5. Heartbeat — update activity timestamp on every call ───────────────
  // This prevents the 30-min clock from expiring while the user is still browsing.
  localStorage.setItem(KEYS.sessionActive, now.toString());

  return {
    visitorId,
    sessionId,
    visitCount,
    isNewSession,
    visitorType: isFirstEverVisit ? "new" : (visitCount === 1 ? "new" : "returning"),
    sessionStartedAt,
  };
}
