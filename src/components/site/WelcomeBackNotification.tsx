/**
 * WelcomeBackNotification — Two popup cards on every visit:
 *  1. Bottom-LEFT  → "Welcome Back" card with visit count badge
 *  2. Bottom-RIGHT → "Last Visited Page" card with resume CTA
 *
 * Both show on every fresh page load (new tab/window).
 * Each has its own dismiss button and 14s auto-dismiss countdown.
 */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  X,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  RotateCcw,
  Eye,
} from "lucide-react";
import {
  shouldShowWelcomeNotification,
  markWelcomeShown,
  dismissWelcomeNotification,
  getLastVisitedPage,
  MEANINGFUL_ROUTES,
  type MeaningfulPageRecord,
} from "@/lib/visitorSession";

interface Props {
  visitorType: "new" | "returning";
  visitCount: number;
}

// ─── Shared auto-dismiss hook ─────────────────────────────────────────────────
function useCountdown(active: boolean, durationMs = 14000) {
  const [progress, setProgress] = useState(100);
  const hoveredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) return;
    const INTERVAL = 80;
    const step = (INTERVAL / durationMs) * 100;

    timerRef.current = setInterval(() => {
      if (hoveredRef.current) return;
      setProgress((p) => {
        const next = p - step;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return next;
      });
    }, INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, durationMs]);

  return { progress, hoveredRef };
}

// ─── Ordinal helper ───────────────────────────────────────────────────────────
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? "th");
}

// ─── POPUP 1: Welcome Back (bottom-left) ─────────────────────────────────────
function WelcomeCard({
  visitorType,
  visitCount,
  onDismiss,
  delay,
}: {
  visitorType: "new" | "returning";
  visitCount: number;
  onDismiss: () => void;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const { progress, hoveredRef } = useCountdown(visible);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Auto-dismiss when progress hits 0
  useEffect(() => {
    if (progress === 0 && visible) {
      setVisible(false);
      onDismiss();
    }
  }, [progress, visible, onDismiss]);

  // Escape key
  useEffect(() => {
    if (!visible) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleDismiss(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  if (!visible) return null;

  const isNew = visitorType === "new" || visitCount <= 1;
  const visitLabel = isNew
    ? "First Visit"
    : visitCount === 2
    ? "2nd Visit"
    : `${ordinal(visitCount)} Visit`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Welcome notification"
      className="fixed bottom-6 left-4 sm:left-6 z-50 w-[300px] max-w-[calc(50vw-1.5rem)] select-none animate-in fade-in slide-in-from-bottom-4 duration-400"
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_-12px_rgba(89,39,135,0.4)] ring-1 ring-[#592787]/30">
        
        {/* Purple gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, #1a0a2e 0%, #2d1155 50%, #0e1a2e 100%)",
          }}
        />
        {/* Glowing orb */}
        <div className="absolute -top-6 -left-6 size-24 rounded-full bg-[#592787]/30 blur-2xl" />
        <div className="absolute -bottom-4 -right-4 size-16 rounded-full bg-[#5AA9AC]/20 blur-xl" />

        <div className="relative p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Icon */}
              <div className="size-9 rounded-xl bg-gradient-to-br from-[#592787] to-[#3a7fb5] flex items-center justify-center shadow-lg shadow-[#592787]/30 shrink-0">
                {isNew
                  ? <Sparkles className="size-4 text-white" />
                  : <RotateCcw className="size-4 text-white" />
                }
              </div>
              <div>
                {/* Visit badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#592787]/40 border border-[#592787]/60 text-[9px] font-bold tracking-widest text-[#d4b4f8] uppercase mb-0.5">
                  <div className="size-1 rounded-full bg-[#5AA9AC] animate-pulse" />
                  {visitLabel}
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {isNew ? "Welcome! 👋" : "Welcome back! 👋"}
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss welcome notification"
              className="size-6 grid place-items-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors shrink-0 -mt-0.5"
            >
              <X className="size-3" />
            </button>
          </div>

          {/* Body */}
          <p className="text-xs text-white/55 leading-relaxed mb-3">
            {isNew
              ? "Discover AI-powered physiotherapy analytics, movement tracking, and clinical rehabilitation tools."
              : visitCount === 2
              ? "Great to have you back! Explore what's new in AI physiotherapy monitoring."
              : `You've visited us ${visitCount} times — thanks for coming back to Physiomatics!`
            }
          </p>

          {/* Visit count dots */}
          {!isNew && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[9px] text-white/30 uppercase tracking-wider font-bold">Sessions</span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(visitCount, 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="size-1.5 rounded-full"
                    style={{
                      background: i < visitCount
                        ? `linear-gradient(135deg, #592787, #5AA9AC)`
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
                {visitCount > 8 && (
                  <span className="text-[9px] text-white/30 ml-0.5">+{visitCount - 8}</span>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <a
            href="/solutions"
            onClick={(e) => { e.preventDefault(); handleDismiss(); window.location.href = "/solutions"; }}
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(90deg, #592787 0%, #3a7fb5 100%)" }}
          >
            <Eye className="size-3.5" />
            <span>Explore Platform</span>
            <ArrowRight className="size-3.5 ml-auto" />
          </a>
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl transition-all ease-linear"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #592787, #5AA9AC)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ─── POPUP 2: Last Visited Page (bottom-right) ────────────────────────────────
function LastVisitedCard({
  lastPage,
  onDismiss,
  delay,
}: {
  lastPage: MeaningfulPageRecord;
  onDismiss: () => void;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { progress, hoveredRef } = useCountdown(visible, 16000);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Auto-dismiss
  useEffect(() => {
    if (progress === 0 && visible) {
      setVisible(false);
      onDismiss();
    }
  }, [progress, visible, onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleDismiss(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  const handleResume = () => {
    handleDismiss();
    try {
      navigate({ to: lastPage.path as any });
    } catch {
      window.location.href = lastPage.path;
    }
  };

  if (!visible) return null;

  const shortLabel = MEANINGFUL_ROUTES[lastPage.path]?.shortLabel || lastPage.title;

  // Time since visit
  const minsAgo = Math.floor((Date.now() - lastPage.timestamp) / 60000);
  const timeLabel =
    minsAgo < 2 ? "Just now" :
    minsAgo < 60 ? `${minsAgo}m ago` :
    minsAgo < 1440 ? `${Math.floor(minsAgo / 60)}h ago` :
    `${Math.floor(minsAgo / 1440)}d ago`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Last visited page notification"
      className="fixed bottom-6 right-4 sm:right-6 z-50 w-[300px] max-w-[calc(50vw-1.5rem)] select-none animate-in fade-in slide-in-from-bottom-4 duration-400"
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_-12px_rgba(90,169,172,0.3)] ring-1 ring-[#5AA9AC]/30">
        
        {/* Teal-dark background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, #071b1c 0%, #0f2e30 50%, #071b2e 100%)",
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute -top-6 -right-6 size-24 rounded-full bg-[#5AA9AC]/20 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-[#592787]/15 blur-xl" />

        <div className="relative p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Icon */}
              <div className="size-9 rounded-xl bg-gradient-to-br from-[#5AA9AC] to-[#3a7fb5] flex items-center justify-center shadow-lg shadow-[#5AA9AC]/25 shrink-0">
                <Clock className="size-4 text-white" />
              </div>
              <div>
                {/* Time badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5AA9AC]/20 border border-[#5AA9AC]/40 text-[9px] font-bold tracking-widest text-[#7de0e3] uppercase mb-0.5">
                  <MapPin className="size-2.5" />
                  {timeLabel}
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  Last Visited Page
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss last visited notification"
              className="size-6 grid place-items-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors shrink-0 -mt-0.5"
            >
              <X className="size-3" />
            </button>
          </div>

          {/* Page info */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-3">
            <div className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-0.5">
              {lastPage.category}
            </div>
            <div className="text-sm font-semibold text-white leading-snug">
              {lastPage.title}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 font-mono">
              physiomatics.com{lastPage.path}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleResume}
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(90deg, #5AA9AC 0%, #3a7fb5 100%)" }}
          >
            <RotateCcw className="size-3.5" />
            <span>Resume — {shortLabel}</span>
            <ArrowRight className="size-3.5 ml-auto" />
          </button>
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl transition-all ease-linear"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #5AA9AC, #3a7fb5)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ─── ORCHESTRATOR: renders both popups ───────────────────────────────────────
export function WelcomeBackNotification({ visitorType, visitCount }: Props) {
  const [show, setShow] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [lastPageDismissed, setLastPageDismissed] = useState(false);
  const lastPage = getLastVisitedPage();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldShowWelcomeNotification()) return;

    markWelcomeShown();
    setShow(true);
  }, []);

  const handleWelcomeDismiss = () => {
    setWelcomeDismissed(true);
    dismissWelcomeNotification();
  };

  const handleLastPageDismiss = () => {
    setLastPageDismissed(true);
  };

  if (!show) return null;

  return (
    <>
      {/* Popup 1 — Welcome + visit count (always shown) */}
      {!welcomeDismissed && (
        <WelcomeCard
          visitorType={visitorType}
          visitCount={visitCount}
          onDismiss={handleWelcomeDismiss}
          delay={1000}
        />
      )}

      {/* Popup 2 — Last visited page (only when there's a recorded page) */}
      {!lastPageDismissed && lastPage && (
        <LastVisitedCard
          lastPage={lastPage}
          onDismiss={handleLastPageDismiss}
          delay={1800}
        />
      )}
    </>
  );
}
