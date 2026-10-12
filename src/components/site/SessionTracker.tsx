/**
 * SessionTracker — Physiomatics Returning Visitor Recognition & Session Tracker
 *
 * Integrates:
 *   1. Anonymous session resolution via resolveVisitorSession()
 *   2. Microsoft Clarity identification & tag enrichment
 *   3. Geo-intelligence collection & Google Sheets session_start telemetry
 *   4. Meaningful page history recording on route transitions
 *   5. Personalized, engaging "Welcome Back" notification card
 */

import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  resolveVisitorSession,
  recordPageVisit,
  type VisitorSessionInfo,
} from "@/lib/visitorSession";
import { sendToGoogleSheet } from "@/lib/googleSheets";
import { getGeoIntelligence } from "@/lib/geoIntelligence";
import { identifyClarityUser, setClarityTag } from "@/lib/clarity";
import { WelcomeBackNotification } from "@/components/site/WelcomeBackNotification";

export function SessionTracker() {
  const [session, setSession] = useState<VisitorSessionInfo | null>(null);
  const location = useLocation();

  // 1. Record meaningful page visits whenever navigation occurs
  useEffect(() => {
    if (typeof window === "undefined") return;
    recordPageVisit(location.pathname);
  }, [location.pathname]);

  // 2. Initialize session telemetry & user identification
  useEffect(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;

    let resolvedSession: VisitorSessionInfo;
    try {
      resolvedSession = resolveVisitorSession();
      setSession(resolvedSession);
    } catch (err) {
      console.error("[SessionTracker] resolveVisitorSession failed:", err);
      return;
    }

    // ── Microsoft Clarity: identify user & set custom dimensions ──────────
    try {
      identifyClarityUser(
        resolvedSession.visitorId,
        resolvedSession.sessionId,
        window.location.pathname,
        `Visit #${resolvedSession.visitCount}`
      );
      setClarityTag("visitor_type", resolvedSession.visitorType);
      setClarityTag("visit_count", String(resolvedSession.visitCount));
      setClarityTag("landing_page", window.location.pathname);
    } catch {
      // safe ignore
    }

    // ── Google Sheets: fire when 30-min rule starts a new session ─────────
    if (resolvedSession.isNewSession) {
      getGeoIntelligence()
        .then((geo) => {
          sendToGoogleSheet({
            action:       "session_start",
            event_type:   "session",
            event_name:   "session_start",
            form_type:    "analytics",
            visitor_id:   resolvedSession.visitorId,
            session_id:   resolvedSession.sessionId,
            visit_number: resolvedSession.visitCount,
            visitor_type: resolvedSession.visitorType,
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
            timezone: geo.geo_timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude: geo.latitude,
            longitude: geo.longitude,
            geo_accuracy_meters: geo.geo_accuracy_meters,
            geo_city: geo.geo_city,
            geo_region: geo.geo_region,
            geo_country: geo.geo_country,
            geo_country_code: geo.geo_country_code,
            location_method: geo.location_method,
            consent_status: geo.consent_status,
            client_ip: geo.client_ip,
            ip_city: geo.ip_city,
            ip_region: geo.ip_region,
            ip_country: geo.ip_country,
            ip_country_code: geo.ip_country_code,
            ip_org: geo.ip_org,
            ip_asn: geo.ip_asn,
            ip_source: geo.ip_source,
            security_event: geo.security_event,
          }).catch(() => {});
        })
        .catch(() => {
          sendToGoogleSheet({
            action:       "session_start",
            event_type:   "session",
            event_name:   "session_start",
            visitor_id:   resolvedSession.visitorId,
            session_id:   resolvedSession.sessionId,
            visit_number: resolvedSession.visitCount,
          }).catch(() => {});
        });
    }
  }, []);

  if (!session) return null;

  return (
    <WelcomeBackNotification
      visitorType={session.visitorType}
      visitCount={session.visitCount}
    />
  );
}
