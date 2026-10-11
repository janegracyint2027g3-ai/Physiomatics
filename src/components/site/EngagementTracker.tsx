/**
 * EngagementTracker
 *
 * Mounts once in the app root and tracks:
 *  - Scroll depth (25%, 50%, 75%, 100%) → Google Sheets action:"scroll"
 *  - Outbound link & CTA button clicks  → Google Sheets action:"click"
 *
 * Uses IntersectionObserver for section-level scroll events and a global
 * click listener (event delegation) for CTA tracking.
 * All events are fire-and-forget; nothing blocks the UI.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { sendToGoogleSheet, trackClick } from "@/lib/googleSheets";

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

export function EngagementTracker() {
  const location = useLocation();
  const sentDepths = useRef<Set<number>>(new Set());
  const pageLoadRef = useRef<number>(Date.now());

  // ── Reset per navigation ──────────────────────────────────────────────
  useEffect(() => {
    sentDepths.current = new Set();
    pageLoadRef.current = Date.now();
  }, [location.pathname]);

  // ── Scroll depth tracker ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !sentDepths.current.has(threshold)) {
          sentDepths.current.add(threshold);
          sendToGoogleSheet({
            action: "scroll_depth",
            section: `${threshold}%`,
            page: location.pathname,
            time_on_page_sec: Math.round(
              (Date.now() - pageLoadRef.current) / 1000
            ),
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // ── IntersectionObserver: track named sections ────────────────────────
  useEffect(() => {
    const observed = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id =
              (entry.target as HTMLElement).dataset.track ||
              (entry.target as HTMLElement).id;
            if (id && !observed.has(id)) {
              observed.add(id);
              sendToGoogleSheet({
                action: "section_view",
                section: id,
                page: location.pathname,
              }).catch(() => {});
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    // Observe all elements with data-track="..." or a meaningful id
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-track], section[id], [id^='section-']"
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  // ── Global click tracker (event delegation) ───────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-track-click]"
      );
      if (!target) return;

      // Skip purely internal scroll links and toggles
      const href = (target as HTMLAnchorElement).href || "";
      const label =
        target.dataset.trackClick ||
        target.getAttribute("aria-label") ||
        target.innerText?.trim().slice(0, 60) ||
        href.replace(window.location.origin, "");

      if (!label) return;

      // Don't spam on every tiny navigation click — only track meaningful labels
      const skip = ["", "close", "open", "×", "‹", "›"];
      if (skip.some((s) => label.toLowerCase() === s)) return;

      trackClick(label, { page: location.pathname });
    };

    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, [location.pathname]);

  return null;
}
