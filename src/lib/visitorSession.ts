/**
 * visitorSession — Physiomatics Privacy-Conscious Visitor Recognition & Session System
 *
 * Capabilities:
 *  1. Persistent anonymous visitor identification (UUID v4, no PII, no fingerprinting).
 *  2. Session lifecycle tracking (30 min inactivity window).
 *  3. Meaningful page history tracking (remembers last clinical/service interest).
 *  4. Safe form engagement tracking (remembers intent WITHOUT storing private inputs).
 *  5. Session-aware & cooldown-aware Welcome Back frequency control.
 *  6. Graceful fallbacks for private browsing, quota errors, and disabled storage.
 */

// ─── Storage Configuration & Keys ───────────────────────────────────────────
const SESSION_INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes
// No cooldown — popups show on every visit as requested

export const STORAGE_KEYS = {
  visitorId:      "physiomatics_visitor_id",
  visitCount:     "physiomatics_visit_count",
  sessionId:      "physiomatics_session_id",
  sessionStarted: "physiomatics_session_started",
  sessionActive:  "physiomatics_session_active",
  lastPage:       "physiomatics_last_page",
  lastActivity:   "physiomatics_last_activity",
  dismissedAt:    "physiomatics_welcome_dismissed_at",
} as const;

export const SESSION_KEYS = {
  welcomeShown:   "physiomatics_welcome_shown_session",
  bannerShownTab: "pm_banner_shown",
} as const;

// ─── Safe Storage Utilities (Gracefully handle private browsing / quota errors) ─
export function safeGet(isSession: boolean, key: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    const storage = isSession ? window.sessionStorage : window.localStorage;
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(isSession: boolean, key: string, value: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    const storage = isSession ? window.sessionStorage : window.localStorage;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(isSession: boolean, key: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    const storage = isSession ? window.sessionStorage : window.localStorage;
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** Generate a compact, privacy-conscious UUID v4 */
function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback if crypto.randomUUID fails
    }
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── Meaningful Routes & Categories ─────────────────────────────────────────
export type PageCategory =
  | "contact"
  | "services"
  | "analyze"
  | "about"
  | "platform"
  | "resources"
  | "general";

export interface MeaningfulPageRecord {
  path: string;
  title: string;
  category: PageCategory;
  timestamp: number;
}

export interface VisitorActivityRecord {
  type: "page_view" | "form_interaction" | "consultation_view" | "demo_view" | "movement_analysis";
  description: string;
  path: string;
  timestamp: number;
}

export const MEANINGFUL_ROUTES: Record<
  string,
  { title: string; category: PageCategory; shortLabel: string }
> = {
  "/contact": { title: "Contact & Consultation", category: "contact", shortLabel: "Contact page" },
  "/contact/consultation": { title: "Clinical Consultation", category: "contact", shortLabel: "Consultation booking" },
  "/contact/demo": { title: "Live Platform Demo", category: "contact", shortLabel: "Demo request" },
  "/contact/enquiry": { title: "General Enquiry", category: "contact", shortLabel: "Enquiry form" },
  "/solutions": { title: "Physiotherapy Solutions", category: "services", shortLabel: "our services" },
  "/solutions/clinics": { title: "Clinic Solutions", category: "services", shortLabel: "Clinic solutions" },
  "/solutions/rehab": { title: "Rehabilitation Solutions", category: "services", shortLabel: "Rehabilitation solutions" },
  "/solutions/elderly": { title: "Elderly Care Solutions", category: "services", shortLabel: "Elderly care solutions" },
  "/solutions/caregiver": { title: "Caregiver Solutions", category: "services", shortLabel: "Caregiver solutions" },
  "/solutions/education": { title: "Education & Research Solutions", category: "services", shortLabel: "Education solutions" },
  "/icp": { title: "Specialized Use Cases", category: "services", shortLabel: "Use cases" },
  "/icp/clinics": { title: "Clinics & Hospitals", category: "services", shortLabel: "Clinics overview" },
  "/icp/physiotherapists": { title: "Physiotherapists Solution", category: "services", shortLabel: "Physiotherapist solutions" },
  "/icp/rehab-patients": { title: "Rehab Patients Program", category: "services", shortLabel: "Patient rehabilitation" },
  "/icp/elderly-care": { title: "Elderly Movement Care", category: "services", shortLabel: "Elderly care" },
  "/icp/caregivers": { title: "Family & Caregivers", category: "services", shortLabel: "Caregiver solutions" },
  "/icp/sports-academies": { title: "Sports Biomechanics", category: "services", shortLabel: "Sports biomechanics" },
  "/analyze": { title: "AI Movement Analyser", category: "analyze", shortLabel: "AI Pose Analyser" },
  "/platform": { title: "Physiomatics Platform", category: "platform", shortLabel: "Platform overview" },
  "/platform/movement": { title: "Movement Screening", category: "platform", shortLabel: "Movement screening" },
  "/platform/training": { title: "Exercise Training", category: "platform", shortLabel: "Exercise training" },
  "/platform/progress": { title: "Patient Progress Tracker", category: "platform", shortLabel: "Progress tracker" },
  "/platform/dashboard": { title: "Clinical Dashboard", category: "platform", shortLabel: "Clinical dashboard" },
  "/how-it-works": { title: "How It Works", category: "about", shortLabel: "How It Works" },
  "/how-it-works/workflow": { title: "Clinical Workflow", category: "about", shortLabel: "Clinical workflow" },
  "/how-it-works/vision": { title: "Computer Vision & AI", category: "about", shortLabel: "Computer Vision" },
  "/how-it-works/privacy": { title: "Security & Patient Privacy", category: "about", shortLabel: "Privacy & security" },
  "/about": { title: "About Physiomatics", category: "about", shortLabel: "About us" },
  "/about/mission": { title: "Mission & Standards", category: "about", shortLabel: "Our mission" },
  "/about/team": { title: "Clinical Team", category: "about", shortLabel: "Our team" },
  "/about/careers": { title: "Careers", category: "about", shortLabel: "Careers" },
  "/resources": { title: "Clinical Resources", category: "resources", shortLabel: "Clinical resources" },
  "/resources/rehab": { title: "Rehabilitation Guides", category: "resources", shortLabel: "Rehabilitation guides" },
  "/resources/anatomy": { title: "Biomechanical Anatomy", category: "resources", shortLabel: "Anatomy guide" },
  "/resources/library": { title: "Exercise Library", category: "resources", shortLabel: "Exercise library" },
  "/resources/faqs": { title: "Frequently Asked Questions", category: "resources", shortLabel: "FAQs" },
  "/feedback": { title: "Share Feedback", category: "contact", shortLabel: "Feedback" },
};

/** Normalize route pathname (remove trailing slashes, hash, queries) */
export function normalizePath(path: string): string {
  if (!path) return "/";
  let cleaned = (path.split("?")[0] ?? path).split("#")[0]?.trim() ?? path;
  while (cleaned.length > 1 && cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned || "/";
}

/** Check if path corresponds to a known, valid meaningful route */
export function isValidMeaningfulRoute(path: string): boolean {
  const norm = normalizePath(path);
  if (norm === "/" || norm === "/auth" || norm === "/terms" || norm === "/privacy") {
    return false;
  }
  return Boolean(MEANINGFUL_ROUTES[norm]);
}

/**
 * Record a page visit if it is meaningful.
 * Never collects form field data or personal identifiers.
 */
export function recordPageVisit(pathname: string, customTitle?: string): void {
  const norm = normalizePath(pathname);
  if (!isValidMeaningfulRoute(norm)) return;

  const routeInfo = MEANINGFUL_ROUTES[norm];
  const record: MeaningfulPageRecord = {
    path: norm,
    title: customTitle || routeInfo?.title || "Physiomatics",
    category: routeInfo?.category || "general",
    timestamp: Date.now(),
  };

  safeSet(false, STORAGE_KEYS.lastPage, JSON.stringify(record));
}

/**
 * Record a meaningful user action (e.g. started consultation form, viewed pose analyser demo)
 * Strictly privacy-conscious: stores action type and route only, never sensitive inputs.
 */
export function recordMeaningfulActivity(activity: {
  type: VisitorActivityRecord["type"];
  description: string;
  path: string;
}): void {
  const record: VisitorActivityRecord = {
    ...activity,
    path: normalizePath(activity.path),
    timestamp: Date.now(),
  };

  safeSet(false, STORAGE_KEYS.lastActivity, JSON.stringify(record));
}

/** Retrieve the last visited meaningful page (if valid) */
export function getLastVisitedPage(): MeaningfulPageRecord | null {
  const raw = safeGet(false, STORAGE_KEYS.lastPage);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MeaningfulPageRecord;
    if (parsed && parsed.path && isValidMeaningfulRoute(parsed.path)) {
      return parsed;
    }
  } catch {
    // Malformed JSON handled gracefully
  }
  return null;
}

/** Retrieve last recorded meaningful activity */
export function getLastActivity(): VisitorActivityRecord | null {
  const raw = safeGet(false, STORAGE_KEYS.lastActivity);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VisitorActivityRecord;
  } catch {
    return null;
  }
}

// ─── Welcome Back Notification State ────────────────────────────────────────
/**
 * Always show on every page load — both welcome + last-visited popups.
 * The only gate is the in-memory flag set after this page load's show,
 * so navigating between tabs/pages doesn't spam, but a fresh load always shows.
 */
export function shouldShowWelcomeNotification(): boolean {
  // Gate: only once per browser tab lifetime (sessionStorage clears on tab close)
  const shownThisTab = safeGet(true, SESSION_KEYS.welcomeShown);
  return shownThisTab !== "1";
}

/** Mark welcome notification as shown for this tab */
export function markWelcomeShown(): void {
  safeSet(true, SESSION_KEYS.welcomeShown, "1");
}

/** Visitor dismissed — just clear for this tab, no long-term cooldown */
export function dismissWelcomeNotification(): void {
  safeSet(true, SESSION_KEYS.welcomeShown, "1");
}

// ─── Message Generation ─────────────────────────────────────────────────────
export interface WelcomeContent {
  headline: string;
  subtext: string;
  primaryAction: {
    label: string;
    path: string;
    isResume: boolean;
  };
  badgeText: string;
  isReturning: boolean;
}

export function getPersonalizedWelcomeContent(
  visitorType: "new" | "returning",
  visitCount: number,
  currentPath: string
): WelcomeContent {
  const isReturning = visitorType === "returning" || visitCount > 1;
  const lastPage = getLastVisitedPage();
  const lastActivity = getLastActivity();
  const normCurrent = normalizePath(currentPath);

  // Default fallback for first-time visitors
  if (!isReturning) {
    return {
      headline: "Welcome to Physiomatics! 👋",
      subtext: "Explore our AI-assisted physiotherapy training and clinical movement monitoring platform.",
      primaryAction: {
        label: "Explore Services",
        path: "/solutions",
        isResume: false,
      },
      badgeText: "Welcome",
      isReturning: false,
    };
  }

  // Returning visitor badge
  const badgeText = visitCount > 1 ? `Visit #${visitCount}` : "Returning Visitor";

  // Case 1: Visitor previously engaged with a form or contact page
  if (
    lastActivity?.type === "form_interaction" ||
    lastPage?.category === "contact"
  ) {
    const resumePath = lastPage?.path || "/contact";
    const canResume = normCurrent !== resumePath;

    return {
      headline: "Welcome back! 👋",
      subtext: canResume
        ? "Last time, you explored our Contact page. Ready to continue?"
        : "Good to see you again! Ready to complete your enquiry?",
      primaryAction: canResume
        ? { label: "Resume where I left off", path: resumePath, isResume: true }
        : { label: "Explore Services", path: "/solutions", isResume: false },
      badgeText,
      isReturning: true,
    };
  }

  // Case 2: Visitor previously checked services or solutions
  if (lastPage?.category === "services") {
    const canResume = normCurrent !== lastPage.path;
    const label = MEANINGFUL_ROUTES[lastPage.path]?.shortLabel || "our services";

    return {
      headline: "Welcome back!",
      subtext: canResume
        ? `You were checking out ${label}. Pick up where you left off.`
        : "Good to see you again! Need help finding the right physiotherapy solution?",
      primaryAction: canResume
        ? { label: "Resume where I left off", path: lastPage.path, isResume: true }
        : { label: "Contact Us", path: "/contact", isResume: false },
      badgeText,
      isReturning: true,
    };
  }

  // Case 3: Visitor previously tried Pose Analyser or Platform
  if (lastPage?.category === "analyze" || lastPage?.category === "platform") {
    const canResume = normCurrent !== lastPage.path;
    return {
      headline: "Welcome back!",
      subtext: canResume
        ? "Pick up your AI movement screening and exercise analysis right where you left off."
        : "Good to see you again! Your next step in movement analysis is just a click away.",
      primaryAction: canResume
        ? { label: "Resume where I left off", path: lastPage.path, isResume: true }
        : { label: "Contact Us", path: "/contact", isResume: false },
      badgeText,
      isReturning: true,
    };
  }

  // Case 4: Visitor previously explored About / How it works
  if (lastPage?.category === "about") {
    const canResume = normCurrent !== lastPage.path;
    return {
      headline: "Good to see you again!",
      subtext: canResume
        ? "Last time you explored how Physiomatics works. Ready to see our clinical solutions?"
        : "Need help finding the right physiotherapy solution for your clinic or patients?",
      primaryAction: canResume
        ? { label: "Resume where I left off", path: lastPage.path, isResume: true }
        : { label: "Explore Services", path: "/solutions", isResume: false },
      badgeText,
      isReturning: true,
    };
  }

  // Case 5: Generic returning visitor fallback
  return {
    headline: "Welcome back!",
    subtext: "Good to see you again! Your next step in AI-guided physiotherapy is just a click away.",
    primaryAction: {
      label: lastPage && normCurrent !== lastPage.path ? "Resume where I left off" : "Explore Services",
      path: lastPage && normCurrent !== lastPage.path ? lastPage.path : "/solutions",
      isResume: Boolean(lastPage && normCurrent !== lastPage.path),
    },
    badgeText,
    isReturning: true,
  };
}

// ─── Core Session Resolver (Preserved for Google Sheets & Clarity) ───────────
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
 * Fully protects against storage exceptions.
 */
export function resolveVisitorSession(): VisitorSessionInfo {
  const now = Date.now();

  // ── 1. Persistent visitor ID ──────────────────────────────────────────────
  let visitorId = safeGet(false, STORAGE_KEYS.visitorId) || "";
  const isFirstEverVisit = !visitorId;
  if (!visitorId) {
    visitorId = uuid();
    safeSet(false, STORAGE_KEYS.visitorId, visitorId);
  }

  // ── 2. Visit count ────────────────────────────────────────────────────────
  let visitCount = parseInt(safeGet(false, STORAGE_KEYS.visitCount) || "0", 10);
  if (isNaN(visitCount)) visitCount = 0;

  // ── 3. Session expiry check ───────────────────────────────────────────────
  const lastActiveStr = safeGet(false, STORAGE_KEYS.sessionActive);
  const lastActive    = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;
  const sessionExpired = !lastActive || (now - lastActive) > SESSION_INACTIVITY_MS;

  // ── 4. Existing session ID / start time ───────────────────────────────────
  let sessionId        = safeGet(false, STORAGE_KEYS.sessionId) || "";
  let sessionStartedAt = safeGet(false, STORAGE_KEYS.sessionStarted) || "";
  let isNewSession     = false;

  if (sessionExpired || !sessionId) {
    sessionId        = uuid();
    sessionStartedAt = new Date(now).toISOString();
    visitCount       = visitCount + 1;

    safeSet(false, STORAGE_KEYS.sessionId,      sessionId);
    safeSet(false, STORAGE_KEYS.sessionStarted, sessionStartedAt);
    safeSet(false, STORAGE_KEYS.visitCount,     visitCount.toString());

    isNewSession = true;
  }

  // ── 5. Heartbeat — update activity timestamp ──────────────────────────────
  safeSet(false, STORAGE_KEYS.sessionActive, now.toString());

  return {
    visitorId,
    sessionId,
    visitCount,
    isNewSession,
    visitorType: isFirstEverVisit ? "new" : (visitCount === 1 ? "new" : "returning"),
    sessionStartedAt,
  };
}
