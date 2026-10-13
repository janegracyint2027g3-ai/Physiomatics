/**
 * WelcomeBackNotification — Premium dual popup system
 *  LEFT:  Welcome Back card — translucent glassmorphic with feature mini-cards + visit slider
 *  RIGHT: Last Visited Page card — translucent glassmorphic with page preview + quick-access tiles
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
  resolveVisitorSession,
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
      className="fixed bottom-6 left-4 sm:left-6 z-50 w-[345px] max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-bottom-5 duration-500"
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      {/* ── CARD SHELL (neat translucent glassmorphic) ── */}
      <div
        className="relative overflow-hidden rounded-[1.75rem] shadow-[0_25px_60px_-15px_rgba(89,39,135,0.22)]"
        style={{
          background: "rgba(255, 255, 255, 0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* ── BACKGROUND TRANSLUCENT TEXTURE LAYER ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 size-48 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #592787, transparent)" }} />
          <div className="absolute top-12 -right-8 size-32 rounded-full opacity-20 blur-2xl"
            style={{ background: "radial-gradient(circle, #5AA9AC, transparent)" }} />
          <div className="absolute -bottom-8 left-16 size-28 rounded-full opacity-15 blur-2xl"
            style={{ background: "radial-gradient(circle, #3a7fb5, transparent)" }} />
          {/* Neat Dotted Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: 'radial-gradient(circle, #592787 1.2px, transparent 1.2px)',
              backgroundSize: '18px 18px',
            }}
          />
          {/* Subtle gradient border accent */}
          <div className="absolute top-0 right-0 h-full w-[1.5px] opacity-25"
            style={{ background: "linear-gradient(180deg, transparent, #592787 40%, #5AA9AC 80%, transparent)" }} />
        </div>

        <div className="relative p-4.5">
          {/* ── TOP ROW: badge + dismiss ── */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl flex items-center justify-center shadow-md shrink-0"
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
                <div className="text-sm font-bold text-[#3b1d60] leading-tight">
                  {isNew ? "Welcome to Physiomatics! 👋" : "Welcome back! 👋"}
                </div>
              </div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss"
              className="size-6 grid place-items-center rounded-full transition-colors shrink-0 -mt-0.5 text-muted-foreground/70 hover:text-foreground hover:bg-black/5">
              <X className="size-3.5" />
            </button>
          </div>

          {/* ── FEATURE SLIDE CARD (translucent mini-card) ── */}
          <div className="rounded-2xl p-3 mb-3 transition-all duration-500 shadow-2xs"
            style={{
              background: `linear-gradient(135deg, ${currentSlide.color}10, rgba(255,255,255,0.8))`,
              border: `1px solid ${currentSlide.color}25`,
            }}>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                style={{ background: `${currentSlide.color}15`, border: `1px solid ${currentSlide.color}35` }}>
                <SlideIcon className="size-4.5" style={{ color: currentSlide.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#3b1d60] leading-snug">{currentSlide.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{currentSlide.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-black leading-none" style={{ color: currentSlide.color }}>
                  {currentSlide.stat}
                </div>
                <div className="text-[9px] text-muted-foreground/80 uppercase tracking-wider">{currentSlide.statLabel}</div>
              </div>
            </div>
          </div>

          {/* ── SLIDE DOTS ── */}
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div className="flex gap-1.5">
              {FEATURE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === slide ? "20px" : "6px",
                    height: "5px",
                    background: i === slide
                      ? `linear-gradient(90deg, #592787, #5AA9AC)`
                      : "rgba(89, 39, 135, 0.18)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSlide((s) => (s - 1 + FEATURE_SLIDES.length) % FEATURE_SLIDES.length)}
                className="size-5 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-black/5 transition-all">
                <ChevronLeft className="size-3" />
              </button>
              <button onClick={() => setSlide((s) => (s + 1) % FEATURE_SLIDES.length)}
                className="size-5 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-black/5 transition-all">
                <ChevronRight className="size-3" />
              </button>
            </div>
          </div>

          {/* ── VISIT COUNT STRIP ── */}
          {!isNew && (
            <div className="rounded-xl px-3 py-1.5 mb-3 flex items-center justify-between"
              style={{ background: "rgba(89, 39, 135, 0.04)", border: "1px solid rgba(89, 39, 135, 0.08)" }}>
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5" style={{ color: "#c4a572" }} />
                <span className="text-[10px] text-muted-foreground font-medium">Total visits</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(visitCount, 8) }).map((_, i) => (
                  <div key={i} className="size-1.5 rounded-full"
                    style={{ background: `linear-gradient(135deg, #592787, #5AA9AC)`, opacity: 0.6 + (i / Math.min(visitCount, 8)) * 0.4 }} />
                ))}
                {visitCount > 8 && <span className="text-[9px] text-muted-foreground ml-0.5">+{visitCount - 8}</span>}
              </div>
            </div>
          )}

          {/* ── CTA BUTTON ── */}
          <button
            onClick={() => { dismiss(); navigate({ to: "/solutions" as any }); }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:opacity-95 active:scale-[0.98] group"
            style={{ background: "linear-gradient(90deg, #592787 0%, #3a7fb5 60%, #5AA9AC 100%)" }}>
            <span>Explore Physiomatics</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="absolute bottom-0 left-0 h-[3px] rounded-b-[1.75rem] transition-all ease-linear"
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

  const catColor = lastPage.category === "platform" ? "#592787"
    : lastPage.category === "services" ? "#3a7fb5"
    : lastPage.category === "contact" ? "#5AA9AC"
    : lastPage.category === "analyze" ? "#c4a572" : "#7336ad";

  return (
    <div
      role="status" aria-live="polite" aria-label="Last visited page"
      className="fixed bottom-6 right-4 sm:right-6 z-50 w-[345px] max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-bottom-5 duration-500"
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      <div
        className="relative overflow-hidden rounded-[1.75rem] shadow-[0_25px_60px_-15px_rgba(90,169,172,0.22)]"
        style={{
          background: "rgba(255, 255, 255, 0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* ── BACKGROUND TRANSLUCENT TEXTURE ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 right-0 size-40 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #5AA9AC, transparent)" }} />
          <div className="absolute bottom-0 -left-6 size-28 rounded-full opacity-15 blur-2xl"
            style={{ background: "radial-gradient(circle, #592787, transparent)" }} />
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: 'radial-gradient(circle, #5AA9AC 1.2px, transparent 1.2px)',
              backgroundSize: '18px 18px',
            }}
          />
          {/* Accent border glow on left */}
          <div className="absolute top-0 left-0 h-full w-[2px] opacity-40"
            style={{ background: `linear-gradient(180deg, transparent, ${catColor} 40%, #3a7fb5 80%, transparent)` }} />
        </div>

        <div className="relative p-4.5">
          {/* ── TOP ROW ── */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl flex items-center justify-center shadow-md shrink-0"
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
                <div className="text-sm font-bold text-[#3b1d60] leading-tight">Pick up where you left off</div>
              </div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss"
              className="size-6 grid place-items-center rounded-full transition-colors shrink-0 -mt-0.5 text-muted-foreground/70 hover:text-foreground hover:bg-black/5">
              <X className="size-3.5" />
            </button>
          </div>

          {/* ── PAGE PREVIEW CARD ── */}
          <div
            className="rounded-2xl p-3 mb-3 cursor-pointer transition-all duration-200 hover:ring-1 group shadow-2xs"
            style={{
              background: `linear-gradient(135deg, ${catColor}10, rgba(255,255,255,0.85))`,
              border: `1px solid ${catColor}28`,
            }}
            onClick={handleResume}
          >
            {/* Faux browser bar */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex gap-1">
                <div className="size-1.5 rounded-full bg-slate-300" />
                <div className="size-1.5 rounded-full bg-slate-300" />
                <div className="size-1.5 rounded-full" style={{ background: catColor }} />
              </div>
              <div className="flex-1 h-4 rounded-full px-2 flex items-center gap-1 bg-black/[0.04]">
                <div className="size-1.5 rounded-full" style={{ background: catColor }} />
                <span className="text-[8px] text-muted-foreground font-mono truncate">
                  physiomatics.com{lastPage.path}
                </span>
              </div>
            </div>

            {/* Page details */}
            <div className="flex items-start gap-2.5">
              <div className="size-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${catColor}15`, border: `1px solid ${catColor}30` }}>
                <Activity className="size-4" style={{ color: catColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: `${catColor}` }}>
                  {lastPage.category}
                </div>
                <div className="text-xs font-bold text-[#3b1d60] leading-snug truncate">{lastPage.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Tap to resume →</div>
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
                    background: isCurrent ? `${tile.color}15` : "rgba(89, 39, 135, 0.04)",
                    border: `1px solid ${isCurrent ? tile.color + "40" : "rgba(89, 39, 135, 0.08)"}`,
                  }}
                >
                  <TileIcon className="size-3.5" style={{ color: isCurrent ? tile.color : "#592787" }} />
                  <span className="text-[8px] leading-none font-semibold"
                    style={{ color: isCurrent ? tile.color : "#64748b" }}>
                    {tile.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── RESUME CTA ── */}
          <button
            onClick={handleResume}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md shadow-[#5AA9AC]/20 transition-all duration-200 hover:opacity-95 active:scale-[0.98] group"
            style={{ background: `linear-gradient(90deg, ${catColor} 0%, #5AA9AC 100%)` }}>
            <span>Resume — {shortLabel}</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="absolute bottom-0 left-0 h-[3px] rounded-b-[1.75rem] transition-all ease-linear"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${catColor}, #5AA9AC)` }}
          aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function WelcomeBackNotification() {
  const [show, setShow] = useState(false);
  const [visitorType, setVisitorType] = useState<"new" | "returning">("new");
  const [visitCount, setVisitCount] = useState(1);
  const [lastPage, setLastPage] = useState<MeaningfulPageRecord | null>(null);

  useEffect(() => {
    if (!shouldShowWelcomeNotification()) return;

    const session = resolveVisitorSession();
    setVisitorType(session.visitorType);
    setVisitCount(session.visitCount);
    setLastPage(getLastVisitedPage());
    setShow(true);
    markWelcomeShown();
  }, []);

  const handleDismiss = useCallback(() => {
    setShow(false);
    dismissWelcomeNotification();
  }, []);

  if (!show) return null;

  return (
    <>
      {/* 1. Bottom-LEFT: Welcome Back card */}
      <WelcomeCard
        visitorType={visitorType}
        visitCount={visitCount}
        onDismiss={handleDismiss}
        delay={800}
      />

      {/* 2. Bottom-RIGHT: Last Visited Page card */}
      {lastPage && (
        <LastVisitedCard
          lastPage={lastPage}
          onDismiss={handleDismiss}
          delay={1400}
        />
      )}
    </>
  );
}
export default WelcomeBackNotification;
