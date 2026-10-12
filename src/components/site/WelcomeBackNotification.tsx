import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { X, ArrowRight, Compass, Sparkles, MessageSquare, History } from "lucide-react";
import {
  shouldShowWelcomeNotification,
  markWelcomeShown,
  dismissWelcomeNotification,
  getPersonalizedWelcomeContent,
  type WelcomeContent,
} from "@/lib/visitorSession";

interface WelcomeBackNotificationProps {
  visitorType: "new" | "returning";
  visitCount: number;
}

export function WelcomeBackNotification({
  visitorType,
  visitCount,
}: WelcomeBackNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<WelcomeContent | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(100);
  const isHoveredRef = useRef(false);

  // Generate personalized content based on latest location
  const updateContent = useCallback(() => {
    const data = getPersonalizedWelcomeContent(
      visitorType,
      visitCount,
      location.pathname
    );
    setContent(data);
  }, [visitorType, visitCount, location.pathname]);

  // Initial display gate
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!shouldShowWelcomeNotification()) {
      return;
    }

    updateContent();

    // Gentle entrance delay (1.2s) so the initial page settles first
    const delayTimer = setTimeout(() => {
      setVisible(true);
      markWelcomeShown();
    }, 1200);

    return () => clearTimeout(delayTimer);
  }, [updateContent]);

  // Auto-dismiss countdown with hover pause
  useEffect(() => {
    if (!visible) return;

    const DURATION_MS = 14000; // 14s auto-dismiss
    const INTERVAL_MS = 100;
    const step = (INTERVAL_MS / DURATION_MS) * 100;

    progressTimerRef.current = setInterval(() => {
      if (isHoveredRef.current) return; // pause when hovered

      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          setVisible(false);
          return 0;
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [visible]);

  // Escape key handler
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible]);

  const handleDismiss = () => {
    dismissWelcomeNotification();
    setVisible(false);
  };

  const handleResume = (path: string) => {
    handleDismiss();
    try {
      navigate({ to: path as any });
    } catch {
      window.location.href = path;
    }
  };

  if (!visible || !content) return null;

  return (
    <div
      role="region"
      aria-label="Welcome notification"
      className="fixed bottom-24 right-4 sm:right-6 z-40 max-w-[390px] w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-bottom-5 duration-300"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl transition-all hover:shadow-primary/10 hover:border-primary/40">
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Header row: Badge + Close button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3 text-primary shrink-0" />
              {content.badgeText}
            </span>
            {content.isReturning && (
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Physiomatics Care
              </span>
            )}
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss welcome notification"
            className="grid size-6 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Message body */}
        <div className="space-y-1 pr-1">
          <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
            {content.headline}
          </h3>
          <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
            {content.subtext}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 flex flex-col gap-2">
          {/* Primary Action Button */}
          {content.primaryAction.isResume ? (
            <button
              onClick={() => handleResume(content.primaryAction.path)}
              className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              <History className="size-3.5" />
              <span>{content.primaryAction.label}</span>
              <ArrowRight className="size-3.5 ml-auto" />
            </button>
          ) : (
            <Link
              to={content.primaryAction.path as any}
              onClick={handleDismiss}
              className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              <Compass className="size-3.5" />
              <span>{content.primaryAction.label}</span>
              <ArrowRight className="size-3.5 ml-auto" />
            </Link>
          )}

          {/* Secondary Actions Row */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <Link
              to="/solutions"
              onClick={handleDismiss}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-foreground bg-muted/60 hover:bg-muted rounded-lg transition-colors text-center"
            >
              <Compass className="size-3 text-muted-foreground" />
              <span>Explore Services</span>
            </Link>

            <Link
              to="/contact"
              onClick={handleDismiss}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-foreground bg-muted/60 hover:bg-muted rounded-lg transition-colors text-center"
            >
              <MessageSquare className="size-3 text-muted-foreground" />
              <span>Contact Us</span>
            </Link>

            <button
              type="button"
              onClick={handleDismiss}
              className="px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Auto-dismiss countdown progress line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-primary/40 transition-all ease-linear"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
