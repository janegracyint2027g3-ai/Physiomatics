import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import defaultCronHandler, {
  verifyCronAuth,
  runReportForInterval,
  runDailyReport,
  runWeeklyReport,
  runMonthlyReport,
  handleReportEndpoint,
} from "../../api/cron/reports";

const dailyHandler = handleReportEndpoint("Daily");
const weeklyHandler = handleReportEndpoint("Weekly");
const monthlyHandler = handleReportEndpoint("Monthly");

function createMockReqRes(options: {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  method?: string;
} = {}) {
  const req = {
    headers: options.headers || {},
    query: options.query || {},
    method: options.method || "GET",
  } as unknown as VercelRequest;

  let statusCode = 200;
  let jsonBody: any = null;

  const res = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return res;
    }),
    json: vi.fn((data: any) => {
      jsonBody = data;
      return res;
    }),
    getStatusCode: () => statusCode,
    getBody: () => jsonBody,
  } as unknown as VercelResponse & { getStatusCode: () => number; getBody: () => any };

  return { req, res };
}

describe("Vercel Executive Reporting Engine (/api/report-*)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("1. Security & CRON_SECRET Verification", () => {
    it("allows execution when CRON_SECRET is not configured (open dev mode)", () => {
      delete process.env.CRON_SECRET;
      const { req } = createMockReqRes();
      expect(verifyCronAuth(req)).toBe(true);
    });

    it("blocks unauthorized requests when CRON_SECRET is set", () => {
      process.env.CRON_SECRET = "super-secret-key-123";
      const { req } = createMockReqRes({
        headers: { authorization: "Bearer wrong-token" },
      });
      expect(verifyCronAuth(req)).toBe(false);
    });

    it("authorizes request with Bearer CRON_SECRET header", () => {
      process.env.CRON_SECRET = "super-secret-key-123";
      const { req } = createMockReqRes({
        headers: { authorization: "Bearer super-secret-key-123" },
      });
      expect(verifyCronAuth(req)).toBe(true);
    });

    it("authorizes request with secret query param", () => {
      process.env.CRON_SECRET = "super-secret-key-123";
      const { req } = createMockReqRes({
        query: { secret: "super-secret-key-123" },
      });
      expect(verifyCronAuth(req)).toBe(true);
    });

    it("authorizes request with x-vercel-cron header", () => {
      process.env.CRON_SECRET = "super-secret-key-123";
      const { req } = createMockReqRes({
        headers: { "x-vercel-cron": "1" },
      });
      expect(verifyCronAuth(req)).toBe(true);
    });
  });

  describe("2. Dedicated Report API Endpoints", () => {
    it("/api/report-daily returns 401 when unauthorized", async () => {
      process.env.CRON_SECRET = "test-secret";
      const { req, res } = createMockReqRes();

      await dailyHandler(req, res);

      expect(res.getStatusCode()).toBe(401);
      expect(res.getBody()).toEqual({ error: "Unauthorized" });
    });

    it("/api/report-daily executes Daily report successfully", async () => {
      process.env.CRON_SECRET = "test-secret";
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ key: "PHY-DAILY-1" }),
      } as Response);

      const { req, res } = createMockReqRes({
        headers: { authorization: "Bearer test-secret" },
      });

      await dailyHandler(req, res);

      expect(res.getStatusCode()).toBe(200);
      const body = res.getBody();
      expect(body.success).toBe(true);
      expect(body.interval).toBe("Daily");
      expect(body.result.email_sent).toBe(true);

      // Verify Google Apps Script call had interval=Daily
      const appsScriptCall = fetchSpy.mock.calls.find((call) =>
        String(call[0]).includes("action=run_digest&interval=Daily")
      );
      expect(appsScriptCall).toBeDefined();
    });

    it("/api/report-weekly executes Weekly report successfully", async () => {
      process.env.CRON_SECRET = "test-secret";
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ key: "PHY-WEEKLY-1" }),
      } as Response);

      const { req, res } = createMockReqRes({
        query: { secret: "test-secret" },
      });

      await weeklyHandler(req, res);

      expect(res.getStatusCode()).toBe(200);
      const body = res.getBody();
      expect(body.success).toBe(true);
      expect(body.interval).toBe("Weekly");
      expect(body.result.email_sent).toBe(true);

      const appsScriptCall = fetchSpy.mock.calls.find((call) =>
        String(call[0]).includes("action=run_digest&interval=Weekly")
      );
      expect(appsScriptCall).toBeDefined();
    });

    it("/api/report-monthly executes Monthly report successfully", async () => {
      process.env.CRON_SECRET = "test-secret";
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ key: "PHY-MONTHLY-1" }),
      } as Response);

      const { req, res } = createMockReqRes({
        headers: { "x-vercel-cron": "1" },
      });

      await monthlyHandler(req, res);

      expect(res.getStatusCode()).toBe(200);
      const body = res.getBody();
      expect(body.success).toBe(true);
      expect(body.interval).toBe("Monthly");
      expect(body.result.email_sent).toBe(true);

      const appsScriptCall = fetchSpy.mock.calls.find((call) =>
        String(call[0]).includes("action=run_digest&interval=Monthly")
      );
      expect(appsScriptCall).toBeDefined();
    });
  });

  describe("3. reports.ts Core Function Exports & Compatibility", () => {
    it("exports runDailyReport, runWeeklyReport, runMonthlyReport", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ key: "PHY-MOCK" }),
      } as Response);

      const daily = await runDailyReport("2026-10-15");
      expect(daily.period).toBe("2026-10-15");
      expect(daily.email_sent).toBe(true);

      const weekly = await runWeeklyReport("2026-10-15");
      expect(weekly.period).toBe("2026-10-15");
      expect(weekly.email_sent).toBe(true);

      const monthly = await runMonthlyReport("2026-10-15");
      expect(monthly.period).toBe("2026-10-15");
      expect(monthly.email_sent).toBe(true);
    });

    it("preserves backward compatibility of default /api/cron/reports handler", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ key: "PHY-ALL" }),
      } as Response);

      const { req, res } = createMockReqRes({
        query: { interval: "Daily" },
      });

      await defaultCronHandler(req, res);

      expect(res.getStatusCode()).toBe(200);
      const body = res.getBody();
      expect(body.success).toBe(true);
      expect(body.runs.Daily).toBeDefined();
    });
  });
});
