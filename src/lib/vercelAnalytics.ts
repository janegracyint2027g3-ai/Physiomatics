/**
 * Vercel Web Analytics & Lead Automation Engine
 *
 * Integrates with:
 * 1. @vercel/analytics — populates Vercel Web Analytics dashboard (Visitors, Pageviews, Top Pages, Custom Events).
 * 2. @vercel/speed-insights — populates Vercel Speed Insights (Core Web Vitals).
 * 3. /api/leads — Vercel Serverless Function logging leads to Vercel Runtime Logs.
 */

import { track } from "@vercel/analytics";

export interface VercelLeadData {
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  organization?: string;
  company?: string;
  organization_type?: string;
  segment?: string;
  role?: string;
  job_title?: string;
  interest?: string;
  subject?: string;
  challenge?: string;
  message?: string;
  lead_type?: string;
  form_type?: string;
  page_path?: string;
  pageUrl?: string;
  city?: string;
  country?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track custom events into Vercel Web Analytics dashboard
 */
export function trackVercelEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null>
): void {
  try {
    if (typeof window === "undefined") return;

    // Filter out undefined/null properties for Vercel Analytics compatibility
    const cleanProps: Record<string, string | number | boolean> = {};
    if (properties) {
      Object.entries(properties).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          cleanProps[k] = v;
        }
      });
    }

    track(eventName, cleanProps);
    console.debug(`[Vercel Analytics] Tracked: ${eventName}`, cleanProps);
  } catch (err) {
    // Analytics failures must never break the UX
    console.warn("[Vercel Analytics] Tracking warning:", err);
  }
}

/**
 * Capture a new lead across Vercel Web Analytics and Vercel Serverless API
 */
export async function captureVercelLead(lead: VercelLeadData): Promise<boolean> {
  const leadType = String(lead.lead_type || lead.form_type || "lead");

  // 1. Log custom event in Vercel Web Analytics
  try {
    trackVercelEvent("lead_submission", {
      lead_type: leadType,
      segment: String(lead.interest || lead.organization_type || "general"),
      role: String(lead.role || lead.job_title || "visitor"),
      page: String(lead.page_path || window?.location?.pathname || "/"),
      has_email: Boolean(lead.email || (lead.contact && String(lead.contact).includes("@"))),
      has_phone: Boolean(lead.phone || (lead.contact && !String(lead.contact).includes("@"))),
      has_organization: Boolean(lead.organization),
    });

    // Also track specific conversion type
    trackVercelEvent(`conversion_${leadType}`, {
      page: String(lead.page_path || window?.location?.pathname || "/"),
      segment: String(lead.interest || lead.organization_type || "general"),
    });
  } catch (_) {}

  // 2. Dispatch to Vercel Serverless Function (/api/leads)
  try {
    const payload = {
      ...lead,
      captured_at: new Date().toISOString(),
      source_platform: "vercel_frontend",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.info("[Vercel Lead Engine] ✓ Lead recorded in Vercel Automation.");
      return true;
    }
  } catch (err) {
    console.warn("[Vercel Lead Engine] API route notice:", err);
  }

  return true;
}
