import { describe, expect, it, vi, beforeEach } from "vitest";
import { captureVercelLead } from "@/lib/vercelAnalytics";
import { sendToGoogleSheet } from "@/lib/googleSheets";

describe("Centralized Vercel Lead Engine & Integration Verification", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("1. captureVercelLead Central Routing", () => {
    it("dispatches lead to /api/leads and returns structured result", async () => {
      const mockResponse = {
        success: true,
        lead_id: "lead_12345",
        jira_issue_key: "PHY-105",
        jira: { success: true, issueKey: "PHY-105" },
        sheets: { success: true },
        airtable: { success: true },
        telegram: { success: true, messageId: 999 },
      };

      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await captureVercelLead({
        name: "Dr. Jane Doe",
        email: "jane@clinic.com",
        phone: "+91 9876543210",
        organization: "Apex Physiotherapy",
        lead_type: "consultation",
        message: "Need 10 platform seats",
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, options] = fetchSpy.mock.calls[0];
      expect(url).toBe("/api/leads");
      expect(options?.method).toBe("POST");

      const body = JSON.parse(options?.body as string);
      expect(body.name).toBe("Dr. Jane Doe");
      expect(body.email).toBe("jane@clinic.com");
      expect(body.lead_type).toBe("consultation");
      expect(body.source_platform).toBe("vercel_central_engine");

      expect(result.success).toBe(true);
      expect(result.jira_issue_key).toBe("PHY-105");
      expect(result.jira?.issueKey).toBe("PHY-105");
      expect(result.telegram?.messageId).toBe(999);
    });

    it("gracefully returns failure when server returns error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => "Invalid lead payload",
      } as Response);

      const result = await captureVercelLead({
        name: "",
        lead_type: "demo_request",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid lead payload");
    });
  });

  describe("2. Elimination of Duplicate Submissions", () => {
    it("sendToGoogleSheet does NOT trigger captureVercelLead", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
      } as Response);

      await sendToGoogleSheet({
        action: "lead_submission",
        form_status: "submitted",
        form_name: "quick_enquiry",
        name: "Test User",
      });

      // Exactly ONE fetch to Google Sheets, and ZERO calls to /api/leads
      const apiLeadsCalls = fetchSpy.mock.calls.filter((c) => String(c[0]).includes("/api/leads"));
      expect(apiLeadsCalls.length).toBe(0);

      const sheetsCalls = fetchSpy.mock.calls.filter((c) => String(c[0]).includes("script.google.com"));
      expect(sheetsCalls.length).toBe(1);
    });
  });
});
