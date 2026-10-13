/**
 * WelcomeBackNotification — Premium dual popup system
 *  LEFT:  Welcome Back card — glassmorphic with feature mini-cards + visit slider
 *  RIGHT: Last Visited Page card — glassmorphic with page preview + quick-access tiles
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  X, ArrowRight, Sparkles, Clock, RotateCcw, Activity,
  ScanLine, Users, HeartHandshake, ShieldCheck, ChevronLeft,
  ChevronRight, MapPin, Zap, Star, TrendingUp,
} from "lucide-react";
import {
  shouldShowWelcomeNotification,
  markWelcomeShown,
  dismissWelcomeNotification,
  getLastVisitedPage,
  MEANINGFUL_ROUTES,
  type MeaningfulPageRecord,
} from "@/lib/visitorSession";

// ─── Shared hook ──────────────────────────────────────────────────────────────
function useCountdown(active: boolean, ms = 18000) {
  const [pct, setPct] = useState(100);
  const hovered = useRef(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!active) return;
    const step = (80 / ms) * 100;
    ref.current = setInterval(() => {
      if (hovered.current) return;
      setPct((p) => {
        const n = p - step;
        if (n <= 0) { if (ref.current) clearInterval(ref.current); return 0; }
        return n;
      });
    }, 80);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [active, ms]);
  return { pct, hovered };
}

// ─── Ordinal ──────────────────────────────────────────────────────────────────
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? "th");
}

// ─── Feature slides data ──────────────────────────────────────────────────────
const FEATURE_SLIDES = [
  {
    icon: ScanLine,
    color: "#592787",
    label: "AI Video Analytics",
    desc: "Pose detection & real-time joint angles",
    stat: "98.4%", statLabel: "accuracy",
  },
  {
    icon: Activity,
    color: "#3a7fb5",
    label: "Movement Analysis",
    desc: "Detailed angular insights into recovery",
    stat: "360°", statLabel: "tracking",
  },
  {
    icon: TrendingUp,
    color: "#5AA9AC",
    label: "Progress Monitoring",
    desc: "Longitudinal recovery charts & compliance",
    stat: "2×", statLabel: "faster recovery",
  },
  {
    icon: Users,
    color: "#7336ad",
    label: "Clinical Dashboard",
    desc: "Multi-patient oversight for your practice",
    stat: "500+", statLabel: "clinics",
  },
];

// ─── Quick-access page tiles ──────────────────────────────────────────────────
const QUICK_TILES = [
  { label: "Analyze", path: "/analyze", icon: ScanLine, color: "#592787" },
  { label: "Solutions", path: "/solutions", icon: Zap, color: "#3a7fb5" },
  { label: "Contact", path: "/contact", icon: HeartHandshake, color: "#5AA9AC" },
  { label: "Privacy", path: "/how-it-works/privacy", icon: ShieldCheck, color: "#7336ad" },
];

// ─── POPUP 1: Welcome Back (bottom-left) ──────────────────────────────────────
function WelcomeCard({
  visitorType, visitCount, onDismiss, delay,
}: {
  visitorType: "new" | "returning";
  visitCount: number;
  onDismiss: () => void;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const { pct, hovered } = useCountdown(visible);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (pct === 0 && visible) { setVisible(false); onDismiss(); }
  }, [pct, visible, onDismiss]);

  // Auto-advance slide
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => {
      if (!hovered.current) setSlide((s) => (s + 1) % FEATURE_SLIDES.length);
    }, 3200);
    return () => clearInterval(t);
  }, [visible, hovered]);

  useEffect(() => {
    if (!visible) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible]);

  const dismiss = useCallback(() => { setVisible(false); onDismiss(); }, [onDismiss]);

  if (!visible) return null;

  const isNew = visitorType === "new" || visitCount <= 1;
  const currentSlide = FEATURE_SLIDES[slide]!;
  const SlideIcon = currentSlide.icon;

  return (
    <div
      role="status" aria-live="polite" aria-label="Welcome notification"
      className="fixed bottom-6 left-4 sm:left-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-bottom-5 duration-500"
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      {/* ── CARD SHELL (glassmorphic) ── */}
      <div
        className="relative overflow-hidden rounded-[1.5rem] shadow-[0_32px_80px_-16px_rgba(89,39,135,0.5)]"
        style={{
          background: "rgba(15, 6, 30, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(89,39,135,0.35)",
        }}
      >
        {/* ── BACKGROUND TEXTURE LAYER ── */}
        {/* Mesh gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 size-48 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #592787, transparent)" }} />
          <div className="absolute top-12 -right-8 size-32 rounded-full opacity-20 blur-2xl"
            style={{ background: "radial-gradient(circle, #5AA9AC, transparent)" }} />
          <div className="absolute -bottom-8 left-16 size-28 rounded-full opacity-25 blur-2xl"
            style={{ background: "radial-gradient(circle, #3a7fb5, transparent)" }} />
          {/* Grid pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wg" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wg)" />
          </svg>
          {/* Diagonal accent line */}
          <div className="absolute top-0 right-0 h-full w-[1px] opacity-20"
            style={{ background: "linear-gradient(180deg, transparent, #592787 40%, #5AA9AC 80%, transparent)" }} />
        </div>

        <div className="relative p-4">
          {/* ── TOP ROW: badge + dismiss ── */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                style={{ background: "linear-gradient(135deg, #592787, #3a7fb5)" }}>
                {isNew ? <Sparkles className="size-4 text-white" /> : <RotateCcw className="size-4 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="size-1.5 rounded-full bg-[#5AA9AC] animate-pulse" />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase"
                    style={{ color: "#5AA9AC" }}>
                    {isNew ? "Welcome" : `Visit ${ordinal(visitCount)}`}
                  </span>
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {isNew ? "Welcome to Physiomatics! 👋" : "Welcome back! 👋"}
                </div>
              </div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss"
              className="size-6 grid place-items-center rounded-full transition-colors shrink-0 -mt-0.5"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <X className="size-3" />
            </button>
          </div>

          {/* ── FEATURE SLIDE CARD ── */}
          <div className="rounded-2xl p-3.5 mb-3 transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${currentSlide.color}28, rgba(255,255,255,0.04))`,
              border: `1px solid ${currentSlide.color}40`,
            }}>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${currentSlide.color}30`, border: `1px solid ${currentSlide.color}50` }}>
                <SlideIcon className="size-5" style={{ color: currentSlide.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white/90 leading-snug">{currentSlide.label}</div>
                <div className="text-[10px] text-white/45 mt-0.5 leading-snug">{currentSlide.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-black leading-none" style={{ color: currentSlide.color }}>
                  {currentSlide.stat}
                </div>
                <div className="text-[9px] text-white/35 uppercase tracking-wider">{currentSlide.statLabel}</div>
              </div>
            </div>
          </div>

          {/* ── SLIDE DOTS ── */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5">
              {FEATURE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === slide ? "20px" : "6px",
                    height: "6px",
                    background: i === slide
                      ? `linear-gradient(90deg, #592787, #5AA9AC)`
                      : "rgba(255,255,255,0.15)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSlide((s) => (s - 1 + FEATURE_SLIDES.length) % FEATURE_SLIDES.length)}
                className="size-5 rounded-full grid place-items-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all">
                <ChevronLeft className="size-3" />
              </button>
              <button onClick={() => setSlide((s) => (s + 1) % FEATURE_SLIDES.length)}
                className="size-5 rounded-full grid place-items-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all">
                <ChevronRight className="size-3" />
              </button>
            </div>
          </div>

          {/* ── VISIT COUNT STRIP ── */}
          {!isNew && (
            <div className="rounded-xl px-3 py-2 mb-3 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2">
                <Star className="size-3.5" style={{ color: "#c4a572" }} />
                <span className="text-[10px] text-white/50 font-medium">Total visits</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(visitCount, 10) }).map((_, i) => (
                  <div key={i} className="size-1.5 rounded-full"
                    style={{ background: `linear-gradient(135deg, #592787, #5AA9AC)`, opacity: 0.6 + (i / Math.min(visitCount, 10)) * 0.4 }} />
                ))}
                {visitCount > 10 && <span className="text-[9px] text-white/30 ml-0.5">+{visitCount - 10}</span>}
              </div>
            </div>
          )}

          {/* ── CTA ── */}
          <button
            onClick={() => { dismiss(); navigate({ to: "/solutions" as any }); }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] group"
            style={{ background: "linear-gradient(90deg, #592787 0%, #3a7fb5 60%, #5AA9AC 100%)" }}>
            <span>Explore Physiomatics</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="absolute bottom-0 left-0 h-[3px] rounded-b-[1.5rem] transition-all ease-linear"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #592787, #5AA9AC)" }}
          aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── POPUP 2: Last Visited Page (bottom-right) ────────────────────────────────
function LastVisitedCard({
  lastPage, onDismiss, delay,
}: {
  lastPage: MeaningfulPageRecord;
  onDismiss: () => void;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { pct, hovered } = useCountdown(visible, 20000);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (pct === 0 && visible) { setVisible(false); onDismiss(); }
  }, [pct, visible, onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible]);

  const dismiss = useCallback(() => { setVisible(false); onDismiss(); }, [onDismiss]);

  const handleResume = useCallback(() => {
    dismiss();
    try { navigate({ to: lastPage.path as any }); }
    catch { window.location.href = lastPage.path; }
  }, [dismiss, lastPage.path, navigate]);

  if (!visible) return null;

  const shortLabel = MEANINGFUL_ROUTES[lastPage.path]?.shortLabel || lastPage.title;
  const minsAgo = Math.floor((Date.now() - lastPage.timestamp) / 60000);
  const timeLabel = minsAgo < 2 ? "Just now" : minsAgo < 60 ? `${minsAgo}m ago`
    : minsAgo < 1440 ? `${Math.floor(minsAgo / 60)}h ago` : `${Math.floor(minsAgo / 1440)}d ago`;

  // Category color
  const catColor = lastPage.category === "contact" ? "#5AA9AC"
    : lastPage.category === "analyze" ? "#592787"
    : lastPage.category === "platform" ? "#3a7fb5"
    : lastPage.category === "services" ? "#7336ad"
    : "#5AA9AC";

  return (
    <div
      role="status" aria-live="polite" aria-label="Last visited page"
      className="fixed bottom-6 right-4 sm:right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-bottom-5 duration-500"
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      <div
        className="relative overflow-hidden rounded-[1.5rem] shadow-[0_32px_80px_-16px_rgba(90,169,172,0.45)]"
        style={{
          background: "rgba(5, 18, 30, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(90,169,172,0.30)",
        }}
      >
        {/* ── BACKGROUND TEXTURE ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 right-0 size-40 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #5AA9AC, transparent)" }} />
          <div className="absolute bottom-0 -left-6 size-28 rounded-full opacity-20 blur-2xl"
            style={{ background: "radial-gradient(circle, #592787, transparent)" }} />
          {/* Dot grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lg" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lg)" />
          </svg>
          {/* Accent border glow on left */}
          <div className="absolute top-0 left-0 h-full w-[2px] opacity-40"
            style={{ background: `linear-gradient(180deg, transparent, ${catColor} 40%, #3a7fb5 80%, transparent)` }} />
        </div>

        <div className="relative p-4">
          {/* ── TOP ROW ── */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${catColor}, #3a7fb5)` }}>
                <Clock className="size-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin className="size-2.5" style={{ color: catColor }} />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: catColor }}>
                    Last Visited · {timeLabel}
                  </span>
                </div>
                <div className="text-sm font-bold text-white leading-tight">Pick up where you left off</div>
              </div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss"
              className="size-6 grid place-items-center rounded-full transition-colors shrink-0 -mt-0.5"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <X className="size-3" />
            </button>
          </div>

          {/* ── PAGE PREVIEW CARD ── */}
          <div
            className="rounded-2xl p-3.5 mb-3 cursor-pointer transition-all duration-200 hover:ring-1 group"
            style={{
              background: `linear-gradient(135deg, ${catColor}18, rgba(255,255,255,0.03))`,
              border: `1px solid ${catColor}35`,
            }}
            onClick={handleResume}
          >
            {/* Faux browser bar */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-1">
                <div className="size-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="size-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="size-2 rounded-full" style={{ background: `${catColor}80` }} />
              </div>
              <div className="flex-1 h-4 rounded-full px-2 flex items-center gap-1"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="size-2 rounded-full" style={{ background: `${catColor}60` }} />
                <span className="text-[8px] text-white/30 font-mono truncate">
                  physiomatics.com{lastPage.path}
                </span>
              </div>
            </div>

            {/* Page details */}
            <div className="flex items-start gap-2.5">
              <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${catColor}25`, border: `1px solid ${catColor}40` }}>
                <Activity className="size-4" style={{ color: catColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: `${catColor}` }}>
                  {lastPage.category}
                </div>
                <div className="text-sm font-bold text-white/90 leading-snug">{lastPage.title}</div>
                <div className="text-[10px] text-white/40 mt-0.5 leading-snug">Tap to resume →</div>
              </div>
            </div>
          </div>

          {/* ── QUICK ACCESS TILES ── */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {QUICK_TILES.map((tile) => {
              const TileIcon = tile.icon;
              const isCurrent = tile.path === lastPage.path;
              return (
                <button
                  key={tile.path}
                  onClick={() => { dismiss(); navigate({ to: tile.path as any }); }}
                  className="flex flex-col items-center gap-1 rounded-xl py-2 px-1 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: isCurrent ? `${tile.color}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isCurrent ? tile.color + "50" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <TileIcon className="size-3.5" style={{ color: isCurrent ? tile.color : "rgba(255,255,255,0.4)" }} />
                  <span className="text-[8px] leading-none font-semibold"
                    style={{ color: isCurrent ? tile.color : "rgba(255,255,255,0.35)" }}>
                    {tile.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── RESUME CTA ── */}
          <button
            onClick={handleResume}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] group"
            style={{ background: `linear-gradient(90deg, ${catColor} 0%, #3a7fb5 100%)` }}>
            <RotateCcw className="size-3.5" />
            <span>Resume — {shortLabel}</span>
            <ArrowRight className="size-3.5 ml-auto transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="absolute bottom-0 left-0 h-[3px] rounded-b-[1.5rem] transition-all ease-linear"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${catColor}, #3a7fb5)` }}
          aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── ORCHESTRATOR ─────────────────────────────────────────────────────────────
interface Props { visitorType: "new" | "returning"; visitCount: number; }

export function WelcomeBackNotification({ visitorType, visitCount }: Props) {
  const [show, setShow] = useState(false);
  const [w, setW] = useState(true);
  const [l, setL] = useState(true);
  const lastPage = getLastVisitedPage();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldShowWelcomeNotification()) return;
    markWelcomeShown();
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <>
      {w && (
        <WelcomeCard
          visitorType={visitorType}
          visitCount={visitCount}
          onDismiss={() => { setW(false); dismissWelcomeNotification(); }}
          delay={900}
        />
      )}
      {l && lastPage && (
        <LastVisitedCard
          lastPage={lastPage}
          onDismiss={() => setL(false)}
          delay={1700}
        />
      )}
    </>
  );
}
