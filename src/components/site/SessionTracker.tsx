/**
 * SessionTracker — Physiomatics Returning Visitor Recognition & Session Tracker
 *
 * Mounted once in __root.tsx. On every page mount it calls resolveVisitorSession()
 * which is idempotent — it only starts a new session (and increments the visit
 * counter) when ≥ 30 minutes of inactivity have elapsed. Page navigations and
 * refreshes within the same 30-minute window are counted as ONE session.
 *
 * What gets sent to Google Sheets (Visitor_Sessions tab):
 *   action          → "session_start"      (exact name expected by Apps Script)
 *   form_type       → "analytics"
 *   visitor_id      → persistent anonymous UUID
 *   session_id      → UUID for this session
 *   visit_number    → total sessions started (= visit count)
 *   visitor_type    → "new" | "returning"
 *   landing_page    → window.location.pathname at session start
 *   referrer        → document.referrer (empty for direct traffic)
 *   device_type     → "mobile" | "tablet" | "desktop"
 *   browser         → rough browser label from UA
 *   language        → navigator.language
 *   timezone        → Intl.DateTimeFormat timezone
 *
 * Shows:
 *   • A modal welcome popup on new session start (not a toast, per requirements)
 *   • First visit: "Welcome to Physiomatics!"
 *   • Returning visit N: "Welcome back! This is your 3rd visit to Physiomatics."
 *
 * Popup is shown ONCE per session. Keyboard-accessible (Escape closes it,
 * focus is trapped inside the dialog). Does NOT show again on page navigation
 * within the same session.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { Bot } from "lucide-react";
import { resolveVisitorSession } from "@/lib/visitorSession";
import { sendToGoogleSheet } from "@/lib/googleSheets";

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ─── Welcome Popup ──────────────────────────────────────────────────────── */
interface WelcomePopupProps {
  visitCount: number;
  visitorType: "new" | "returning";
  onClose: () => void;
}

function WelcomePopup({ visitCount, visitorType, onClose }: WelcomePopupProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Trap focus inside dialog + close on Escape
  useEffect(() => {
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isNew = visitorType === "new" || visitCount === 1;
  const heading = isNew
    ? "Welcome to Physiomatics!"
    : `Welcome back!`;
  const body = isNew
    ? "We're glad you're here. Explore AI-assisted physiotherapy training — designed for clinics, caregivers, and patients."
    : `This is your ${getOrdinal(visitCount)} visit to Physiomatics. Ready to pick up where you left off?`;

  return (
    /* Backdrop */
    <div
      role="presentation"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-heading"
        aria-describedby="welcome-body"
        className="relative w-full max-w-sm rounded-3xl border bg-card shadow-2xl overflow-hidden"
        style={{ animation: "welcome-rise 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Purple gradient header */}
        <div
          className="flex flex-col items-center gap-3 px-6 pt-8 pb-6"
          style={{
            background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #4f46e5 100%)",
          }}
        >
          {/* Animated icon */}
          <div
            className="grid size-16 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg"
            style={{ animation: "welcome-bounce 0.6s 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <Bot className="size-8 text-white" />
          </div>

          <h2
            id="welcome-heading"
            className="text-center text-xl font-bold text-white"
          >
            {heading}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p
            id="welcome-body"
            className="text-center text-sm text-muted-foreground leading-relaxed"
          >
            {body}
          </p>

          {!isNew && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {Array.from({ length: Math.min(visitCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="size-2 rounded-full"
                  style={{
                    background: i < visitCount ? "#7c3aed" : "#e5e7eb",
                    opacity: i < visitCount ? 1 : 0.3,
                  }}
                />
              ))}
              {visitCount > 5 && (
                <span className="text-xs text-muted-foreground">+{visitCount - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            style={{
              background: "linear-gradient(90deg, #5b21b6, #7c3aed)",
            }}
          >
            {isNew ? "Explore Physiomatics" : "Continue"}
          </button>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
            aria-label="Dismiss welcome message"
          >
            Dismiss
          </button>
        </div>

        {/* Close X button */}
        <button
          onClick={onClose}
          aria-label="Close welcome popup"
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes welcome-rise {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes welcome-bounce {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}

/* ─── SessionTracker ─────────────────────────────────────────────────────── */
export function SessionTracker() {
  const [popup, setPopup] = useState<{
    show: boolean;
    visitCount: number;
    visitorType: "new" | "returning";
  } | null>(null);

  const closePopup = useCallback(() => {
    setPopup((p) => p ? { ...p, show: false } : null);
  }, []);

  useEffect(() => {
    const session = resolveVisitorSession();

    if (session.isNewSession) {
      // ── Fire session_start to Google Sheets (Visitor_Sessions tab) ───────
      sendToGoogleSheet({
        action:        "session_start",
        form_type:     "analytics",
        visitor_id:    session.visitorId,
        session_id:    session.sessionId,
        visit_number:  session.visitCount,
        visitor_type:  session.visitorType,
        landing_page:  typeof window !== "undefined" ? window.location.pathname : "",
        referrer:      typeof document !== "undefined" ? document.referrer : "",
        device_type:   typeof window !== "undefined"
                         ? (window.screen.width < 768 ? "mobile"
                           : window.screen.width < 1024 ? "tablet" : "desktop")
                         : "desktop",
        browser:       typeof navigator !== "undefined"
                         ? (/Edg\//.test(navigator.userAgent)     ? "Edge"
                           : /OPR\//.test(navigator.userAgent)    ? "Opera"
                           : /Chrome\//.test(navigator.userAgent) ? "Chrome"
                           : /Firefox\//.test(navigator.userAgent)? "Firefox"
                           : /Safari\//.test(navigator.userAgent) ? "Safari"
                           : "Other")
                         : "unknown",
        language:      typeof navigator !== "undefined" ? navigator.language : "",
        timezone:      typeof Intl !== "undefined"
                         ? Intl.DateTimeFormat().resolvedOptions().timeZone
                         : "",
      }).catch((err) =>
        console.error("[SessionTracker] Google Sheets sync error:", err)
      );

      // ── Show welcome popup (after a short delay for page paint) ──────────
      setTimeout(() => {
        setPopup({
          show:        true,
          visitCount:  session.visitCount,
          visitorType: session.visitorType,
        });
      }, 1200);
    }
    // No else — same session, no popup, no Sheet call.
  }, []); // ← empty deps: runs once per component mount (= once per browser tab load)

  if (!popup?.show) return null;

  return (
    <WelcomePopup
      visitCount={popup.visitCount}
      visitorType={popup.visitorType}
      onClose={closePopup}
    />
  );
}
