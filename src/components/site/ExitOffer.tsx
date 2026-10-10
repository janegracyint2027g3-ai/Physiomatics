import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

const STORAGE_KEY = "physiomatics.exitOffer.v1";

// Exit-intent offer: appears once per session when the cursor leaves the page
// towards the browser chrome (top of the window). Skipped on the contact page
// (forms already live there) and for keyboard-only / touch visitors, who never
// trigger a mouseleave.
export function ExitOffer() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/contact")) return;
    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, 8000);

    const onLeave = (e: MouseEvent) => {
      if (!armed || e.clientY > 8) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/40 p-4" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Before you go"
        className="relative w-full max-w-md rounded-3xl border bg-card p-8 shadow-lift animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <button aria-label="Close" className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
          <X className="size-5" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Before you go</p>
        <h2 className="mt-2 font-display text-2xl leading-snug">See movement analysis on a real exercise video?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Record or upload a short clip and get estimated joint angles, rep counts and a confidence score — right in your browser, nothing uploaded.
        </p>
        <div className="mt-6 grid gap-2">
          <Button asChild><Link to="/contact" onClick={() => setOpen(false)}>Book a demo</Link></Button>
          <Button asChild variant="outline">
            <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <MessageCircle /> Ask a question on WhatsApp
            </a>
          </Button>
          <button className="text-xs text-muted-foreground underline" onClick={() => setOpen(false)}>No thanks, continue browsing</button>
        </div>
      </div>
    </div>
  );
}
