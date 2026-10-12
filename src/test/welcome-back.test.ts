import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  resolveVisitorSession,
  recordPageVisit,
  recordMeaningfulActivity,
  getLastVisitedPage,
  getLastActivity,
  shouldShowWelcomeNotification,
  dismissWelcomeNotification,
  markWelcomeShown,
  getPersonalizedWelcomeContent,
  isValidMeaningfulRoute,
  normalizePath,
  STORAGE_KEYS,
  SESSION_KEYS,
  safeGet,
  safeSet,
} from "@/lib/visitorSession";

describe("Welcome Back & Returning Visitor System", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe("1. Visitor Identification & Session Recognition", () => {
    it("recognizes first-time visitor and assigns anonymous visitorId", () => {
      const session = resolveVisitorSession();

      expect(session.visitorId).toBeTruthy();
      expect(session.visitorId.length).toBeGreaterThan(10);
      expect(session.visitCount).toBe(1);
      expect(session.visitorType).toBe("new");
      expect(session.isNewSession).toBe(true);
    });

    it("recognizes returning visitor on subsequent session", () => {
      // First visit
      const first = resolveVisitorSession();
      expect(first.visitCount).toBe(1);

      // Fast forward 31 minutes into the future
      const thirtyOneMinsLater = Date.now() + 31 * 60 * 1000;
      vi.spyOn(Date, "now").mockReturnValue(thirtyOneMinsLater);

      const second = resolveVisitorSession();
      expect(second.visitorId).toBe(first.visitorId); // Persistent ID remains identical
      expect(second.sessionId).not.toBe(first.sessionId); // New session ID
      expect(second.visitCount).toBe(2);
      expect(second.visitorType).toBe("returning");
      expect(second.isNewSession).toBe(true);
    });

    it("keeps same session during active browsing within 30 minutes", () => {
      const first = resolveVisitorSession();

      // Browsing 5 minutes later
      const fiveMinsLater = Date.now() + 5 * 60 * 1000;
      vi.spyOn(Date, "now").mockReturnValue(fiveMinsLater);

      const continued = resolveVisitorSession();
      expect(continued.sessionId).toBe(first.sessionId);
      expect(continued.visitCount).toBe(1);
      expect(continued.isNewSession).toBe(false);
    });
  });

  describe("2. Meaningful Page & Activity Memory", () => {
    it("records valid meaningful pages and ignores non-meaningful pages", () => {
      // Non-meaningful pages: home, auth, privacy, terms
      recordPageVisit("/");
      expect(getLastVisitedPage()).toBeNull();

      recordPageVisit("/terms");
      expect(getLastVisitedPage()).toBeNull();

      // Meaningful pages: /contact, /solutions, /analyze
      recordPageVisit("/contact");
      const savedContact = getLastVisitedPage();
      expect(savedContact).not.toBeNull();
      expect(savedContact?.path).toBe("/contact");
      expect(savedContact?.category).toBe("contact");

      recordPageVisit("/solutions/clinics");
      const savedClinics = getLastVisitedPage();
      expect(savedClinics?.path).toBe("/solutions/clinics");
      expect(savedClinics?.category).toBe("services");
    });

    it("normalizes pathnames with trailing slashes and query strings", () => {
      expect(normalizePath("/solutions/rehab/")).toBe("/solutions/rehab");
      expect(normalizePath("/contact?tab=consultation#form")).toBe("/contact");
      expect(normalizePath("///")).toBe("/");

      expect(isValidMeaningfulRoute("/contact/demo")).toBe(true);
      expect(isValidMeaningfulRoute("/invalid-random-page")).toBe(false);
    });

    it("records safe form interaction without storing sensitive PII", () => {
      recordMeaningfulActivity({
        type: "form_interaction",
        description: "consultation_form",
        path: "/contact",
      });

      const activity = getLastActivity();
      expect(activity).not.toBeNull();
      expect(activity?.type).toBe("form_interaction");
      expect(activity?.path).toBe("/contact");

      // Verify no PII keys exist in localStorage
      const allStorageKeys = Object.keys(localStorage);
      expect(allStorageKeys.some((k) => k.includes("name") || k.includes("email") || k.includes("phone"))).toBe(false);
    });
  });

  describe("3. Personalized Welcome Content Generation", () => {
    it("generates friendly first-time greeting for new visitors", () => {
      const content = getPersonalizedWelcomeContent("new", 1, "/");

      expect(content.isReturning).toBe(false);
      expect(content.headline).toContain("Welcome to Physiomatics!");
      expect(content.primaryAction.label).toBe("Explore Services");
      expect(content.primaryAction.path).toBe("/solutions");
      expect(content.primaryAction.isResume).toBe(false);
    });

    it("generates 'Resume where I left off' when returning visitor explored Contact", () => {
      recordPageVisit("/contact");

      const content = getPersonalizedWelcomeContent("returning", 2, "/");

      expect(content.isReturning).toBe(true);
      expect(content.headline).toContain("Welcome back!");
      expect(content.subtext).toContain("explored our Contact page. Ready to continue?");
      expect(content.primaryAction.isResume).toBe(true);
      expect(content.primaryAction.label).toBe("Resume where I left off");
      expect(content.primaryAction.path).toBe("/contact");
      expect(content.badgeText).toBe("Visit #2");
    });

    it("generates service-focused resume when returning visitor explored services", () => {
      recordPageVisit("/solutions/elderly");

      const content = getPersonalizedWelcomeContent("returning", 3, "/");

      expect(content.isReturning).toBe(true);
      expect(content.headline).toBe("Welcome back!");
      expect(content.subtext).toContain("Elderly care solutions");
      expect(content.primaryAction.isResume).toBe(true);
      expect(content.primaryAction.path).toBe("/solutions/elderly");
    });

    it("adapts primary action if visitor is already on the previous page", () => {
      recordPageVisit("/contact");

      // Visitor lands directly on /contact on return
      const content = getPersonalizedWelcomeContent("returning", 2, "/contact");

      // Does not show redundant 'Resume' to current page
      expect(content.primaryAction.isResume).toBe(false);
      expect(content.primaryAction.path).not.toBe("/contact");
    });
  });

  describe("4. Session Gate & Cooldown Intelligence", () => {
    it("allows showing on first tab open and suppresses duplicate shows in same session", () => {
      expect(shouldShowWelcomeNotification()).toBe(true);

      markWelcomeShown();
      expect(shouldShowWelcomeNotification()).toBe(false);
    });

    it("honors dismissal cooldown across sessions", () => {
      expect(shouldShowWelcomeNotification()).toBe(true);

      dismissWelcomeNotification();
      expect(shouldShowWelcomeNotification()).toBe(false);

      // New tab session started (clearing sessionStorage)
      sessionStorage.clear();

      // Within 12-hour cooldown: should still be suppressed
      expect(shouldShowWelcomeNotification()).toBe(false);

      // After 13 hours: cooldown expired, can show again
      const thirteenHoursLater = Date.now() + 13 * 60 * 60 * 1000;
      vi.spyOn(Date, "now").mockReturnValue(thirteenHoursLater);
      expect(shouldShowWelcomeNotification()).toBe(true);
    });
  });

  describe("5. Storage Failure & Privacy Mode Resilience", () => {
    it("safely handles storage exceptions without throwing or crashing", () => {
      // Simulate private mode throwing SecurityError on setItem
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("The operation is insecure", "SecurityError");
      });
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("The operation is insecure", "SecurityError");
      });

      expect(safeGet(false, "any_key")).toBeNull();
      expect(safeSet(false, "any_key", "val")).toBe(false);

      // resolveVisitorSession should still execute safely
      expect(() => resolveVisitorSession()).not.toThrow();

      // recordPageVisit should still execute safely
      expect(() => recordPageVisit("/contact")).not.toThrow();
    });
  });
});
