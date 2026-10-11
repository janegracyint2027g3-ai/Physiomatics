/**
 * SessionTracker — Physiomatics Returning Visitor Recognition & Session Tracker
 *
 * Shows a top banner with:
 *   • Time-based greeting  (Good Morning / Afternoon / Evening / Night)
 *   • Personalized message  (first visit vs returning + visit #N)
 *   • Auto-dismiss after 7 seconds, or close on X
 *
 * Session logic (via visitorSession.ts):
 *   • New session only when ≥30 min of inactivity.
 *   • Page navigations / refreshes within 30 min = SAME session (no duplicate banner).
 *
 * Google Sheets: fires session_start with full payload on new session only.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { resolveVisitorSession } from "@/lib/visitorSession";
import { sendToGoogleSheet } from "@/lib/googleSheets";
import { X } from "lucide-react";

/* ─── Time greeting ──────────────────────────────────────────────────────── */
function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return { text: "Good Morning",   emoji: "🌅" };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
  if (hour >= 17 && hour < 21) return { text: "Good Evening",   emoji: "🌆" };
  return                               { text: "Good Night",     emoji: "🌙" };
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ─── Top Banner ─────────────────────────────────────────────────────────── */
interface BannerProps {
  visitCount: number;
  visitorType: "new" | "returning";
  onClose: () => void;
}

function WelcomeBanner({ visitCount, visitorType, onClose }: BannerProps) {
  const { text: greeting, emoji } = getGreeting();
  const isNew = visitorType === "new" || visitCount <= 1;
  const closeRef = useRef<HTMLButtonElement>(null);

  // Auto-dismiss after 7 s
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const message = isNew
    ? "Welcome to Physiomatics! We're glad you're here."
    : `Welcome back to Physiomatics!`;

  const visitBadge = !isNew ? `Visit #${visitCount}` : null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Welcome notification"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "linear-gradient(90deg, #1e0a3c 0%, #3b0764 40%, #1e1b4b 100%)",
        borderBottom: "1px solid rgba(139,92,246,0.4)",
        boxShadow: "0 4px 32px rgba(109,40,217,0.25)",
        animation: "banner-slide-down 0.4s cubic-bezier(0.22,1,0.36,1) both",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 20px",
        minHeight: "48px",
      }}
    >
      {/* Greeting icon */}
      <span
        style={{ fontSize: "1.2rem", lineHeight: 1, flexShrink: 0 }}
        aria-hidden="true"
      >
        {emoji}
      </span>

      {/* Text */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Greeting label */}
        <span
          style={{
            color: "#c4b5fd",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            flexShrink: 0,
          }}
        >
          {greeting}!
        </span>

        {/* Message */}
        <span
          style={{
            color: "#e5e7eb",
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
        >
          {message}
        </span>

        {/* Visit badge */}
        {visitBadge && (
          <span
            aria-label={`Visit number ${visitCount}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(139,92,246,0.25)",
              border: "1px solid rgba(139,92,246,0.5)",
              color: "#c4b5fd",
              fontWeight: 700,
              fontSize: "0.75rem",
              padding: "2px 10px",
              borderRadius: "999px",
              letterSpacing: "0.03em",
              flexShrink: 0,
            }}
          >
            {visitBadge}
          </span>
        )}
      </div>

      {/* Progress bar — auto-dismiss countdown */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
          animation: "banner-progress 7s linear both",
          borderRadius: "0 2px 2px 0",
        }}
      />

      {/* Close button */}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Dismiss welcome message"
        style={{
          display: "grid",
          placeItems: "center",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1px solid rgba(139,92,246,0.35)",
          background: "rgba(139,92,246,0.15)",
          color: "#c4b5fd",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(139,92,246,0.35)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(139,92,246,0.15)")
        }
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes banner-slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes banner-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
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
    const session = resolveVisitorSession();

    if (session.isNewSession) {
      /* ── Fire session_start to Google Sheets ── */
      sendToGoogleSheet({
        action:       "session_start",
        form_type:    "analytics",
        visitor_id:   session.visitorId,
        session_id:   session.sessionId,
        visit_number: session.visitCount,
        visitor_type: session.visitorType,
        landing_page: typeof window   !== "undefined" ? window.location.pathname : "",
        referrer:     typeof document !== "undefined" ? document.referrer       : "",
        device_type:  typeof window   !== "undefined"
                        ? window.screen.width < 768  ? "mobile"
                        : window.screen.width < 1024 ? "tablet"
                        : "desktop"
                        : "desktop",
        browser: typeof navigator !== "undefined"
          ? /Edg\//.test(navigator.userAgent)     ? "Edge"
          : /OPR\//.test(navigator.userAgent)     ? "Opera"
          : /Chrome\//.test(navigator.userAgent)  ? "Chrome"
          : /Firefox\//.test(navigator.userAgent) ? "Firefox"
          : /Safari\//.test(navigator.userAgent)  ? "Safari"
          : "Other"
          : "unknown",
        language: typeof navigator !== "undefined" ? navigator.language : "",
        timezone: typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "",
      }).catch((err) =>
        console.error("[SessionTracker] Google Sheets sync error:", err)
      );

      /* ── Show banner after 800 ms (let page paint first) ── */
      setTimeout(() => {
        setBanner({
          show:        true,
          visitCount:  session.visitCount,
          visitorType: session.visitorType,
        });
      }, 800);
    }
    // Same session → nothing shown, no Sheet call.
  }, []); // runs once per tab-load

  if (!banner?.show) return null;

  return (
    <WelcomeBanner
      visitCount={banner.visitCount}
      visitorType={banner.visitorType}
      onClose={closeBanner}
    />
  );
}
