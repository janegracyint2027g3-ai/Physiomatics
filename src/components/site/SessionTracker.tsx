/**
 * SessionTracker — Physiomatics Returning Visitor Recognition & Session Tracker
 *
 * Top-of-page welcome banner with:
 *   • Time-of-day greeting  (Good Morning / Afternoon / Evening / Night)
 *   • First visit:  "Welcome to Physiomatics! We're glad you're here."
 *   • Return visit: "Welcome back to Physiomatics!  [Visit #N]"
 *   • Auto-dismisses after 7 seconds with a purple countdown bar
 *   • Slides in from top, keyboard-accessible (Escape closes)
 *
 * Session rules:
 *   New session = first ever visit OR ≥30 min of inactivity.
 *   Page navigations / refreshes within 30 min = SAME session (no duplicate).
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { resolveVisitorSession } from "@/lib/visitorSession";
import { sendToGoogleSheet } from "@/lib/googleSheets";
import { X } from "lucide-react";

/* ─── Time-aware greeting ─────────────────────────────────────────────────── */
function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return { text: "Good Morning",   emoji: "🌅" };
  if (h >= 12 && h < 17) return { text: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 21) return { text: "Good Evening",   emoji: "🌆" };
  return                         { text: "Good Night",     emoji: "🌙" };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ─── Banner component ───────────────────────────────────────────────────── */
interface BannerProps {
  visitCount: number;
  visitorType: "new" | "returning";
  onClose: () => void;
}

function WelcomeBanner({ visitCount, visitorType, onClose }: BannerProps) {
  const { text: greeting, emoji } = getGreeting();
  const isNew = visitorType === "new" || visitCount <= 1;
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Auto-dismiss after 7 s */
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  /* Escape key */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  /* Focus X button for keyboard users */
  useEffect(() => { btnRef.current?.focus(); }, []);

  const message = isNew
    ? "Welcome to Physiomatics! We're glad you're here."
    : "Welcome back to Physiomatics!";

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes pm-banner-in {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes pm-progress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
        #pm-welcome-banner { animation: pm-banner-in 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        #pm-welcome-progress { animation: pm-progress 7s linear both; }
      `}</style>

      <div
        id="pm-welcome-banner"
        role="status"
        aria-live="polite"
        aria-label="Welcome notification"
        data-testid="welcome-banner"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999,            /* beats header z-40 (=40) by a wide margin */
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 16px",
          minHeight: "46px",
          background: "linear-gradient(90deg,#1e0a3c 0%,#3b0764 45%,#1e1b4b 100%)",
          borderBottom: "1px solid rgba(139,92,246,0.45)",
          boxShadow: "0 4px 24px rgba(109,40,217,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Emoji */}
        <span style={{ fontSize: "1.15rem", lineHeight: 1, flexShrink: 0 }}
              aria-hidden="true">
          {emoji}
        </span>

        {/* Text group */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap",
                      gap: "6px", flex: 1, minWidth: 0, padding: "10px 0" }}>

          {/* "Good Afternoon!" */}
          <span style={{ color: "#c4b5fd", fontWeight: 700,
                         fontSize: "0.85rem", flexShrink: 0 }}>
            {greeting}!
          </span>

          {/* Main message */}
          <span style={{ color: "#e5e7eb", fontSize: "0.85rem" }}>
            {message}
          </span>

          {/* Visit badge — only for returning visitors */}
          {!isNew && (
            <span
              aria-label={`This is visit number ${visitCount}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(139,92,246,0.25)",
                border: "1px solid rgba(139,92,246,0.55)",
                color: "#c4b5fd",
                fontWeight: 700,
                fontSize: "0.72rem",
                padding: "2px 10px",
                borderRadius: "999px",
                letterSpacing: "0.04em",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Visit #{visitCount}
            </span>
          )}

          {/* Ordinal sentence for visit > 2 */}
          {!isNew && visitCount > 1 && (
            <span style={{ color: "#a78bfa", fontSize: "0.75rem", flexShrink: 0 }}>
              — your {ordinal(visitCount)} visit 🎉
            </span>
          )}
        </div>

        {/* Close button */}
        <button
          ref={btnRef}
          onClick={onClose}
          aria-label="Dismiss welcome banner"
          style={{
            display: "grid",
            placeItems: "center",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            border: "1px solid rgba(139,92,246,0.4)",
            background: "rgba(139,92,246,0.15)",
            color: "#c4b5fd",
            cursor: "pointer",
            flexShrink: 0,
            outline: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(139,92,246,0.38)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(139,92,246,0.15)")}
          onFocus={(e) =>
            (e.currentTarget.style.outline = "2px solid #7c3aed")}
          onBlur={(e) =>
            (e.currentTarget.style.outline = "none")}
        >
          <X size={13} strokeWidth={2.5} />
        </button>

        {/* Countdown progress bar */}
        <div
          id="pm-welcome-progress"
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "2px",
            background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
          }}
        />
      </div>

      {/* Spacer so the header doesn't overlap page content */}
      <div style={{ height: "46px" }} aria-hidden="true" />
    </>
  );
}

/* ─── SessionTracker ─────────────────────────────────────────────────────── */
export function SessionTracker() {
  const [banner, setBanner] = useState<{
    show: boolean;
    visitCount: number;
    visitorType: "new" | "returning";
  } | null>(null);

  const closeBanner = useCallback(() => {
    setBanner((b) => (b ? { ...b, show: false } : null));
  }, []);

  useEffect(() => {
    // Guard: localStorage only available in browser
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;

    let session: ReturnType<typeof resolveVisitorSession>;
    try {
      session = resolveVisitorSession();
    } catch (err) {
      console.error("[SessionTracker] resolveVisitorSession failed:", err);
      return;
    }

    if (session.isNewSession) {
      /* ── Send to Google Sheets ── */
      sendToGoogleSheet({
        action:       "session_start",
        form_type:    "analytics",
        visitor_id:   session.visitorId,
        session_id:   session.sessionId,
        visit_number: session.visitCount,
        visitor_type: session.visitorType,
        landing_page: window.location.pathname,
        referrer:     document.referrer,
        device_type:  window.screen.width < 768  ? "mobile"
                    : window.screen.width < 1024 ? "tablet" : "desktop",
        browser: /Edg\//.test(navigator.userAgent)     ? "Edge"
               : /OPR\//.test(navigator.userAgent)     ? "Opera"
               : /Chrome\//.test(navigator.userAgent)  ? "Chrome"
               : /Firefox\//.test(navigator.userAgent) ? "Firefox"
               : /Safari\//.test(navigator.userAgent)  ? "Safari"
               : "Other",
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).catch(() => {});

      /* ── Show banner after 900 ms ── */
      const t = setTimeout(() => {
        setBanner({
          show:        true,
          visitCount:  session.visitCount,
          visitorType: session.visitorType,
        });
      }, 900);

      return () => clearTimeout(t);
    }
  }, []); // ← empty deps = once per browser tab load

  if (!banner?.show) return null;

  return (
    <WelcomeBanner
      visitCount={banner.visitCount}
      visitorType={banner.visitorType}
      onClose={closeBanner}
    />
  );
}
