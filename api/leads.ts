/**
 * Vercel Serverless Function — Lead Capture & Automation Endpoint
 *
 * Route: POST /api/leads
 * Also: GET /api/leads (Health & status check)
 *
 * This function runs directly on Vercel's Edge/Node.js Serverless runtime,
 * logging structured lead data to Vercel Runtime Logs and providing a backend
 * lead automation record within Vercel.
 */

export const config = {
  maxDuration: 10,
};

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Health-check
  if (req.method === "GET") {
    return res.status(200).json({
      status: "online",
      service: "Physiomatics Vercel Lead Automation",
      timestamp: new Date().toISOString(),
      platform: "Vercel Serverless Functions",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const lead = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const clientIp =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection?.remoteAddress ||
      "unknown";

    const vercelCountry = req.headers["x-vercel-ip-country"] || lead.geo_country || "Unknown";
    const vercelCity = req.headers["x-vercel-ip-city"] || lead.geo_city || "Unknown";
    const vercelRegion = req.headers["x-vercel-ip-country-region"] || lead.geo_region || "Unknown";

    // Structured Log Output for Vercel Runtime Logs
    const structuredLeadRecord = {
      event: "LEAD_CAPTURED",
      timestamp: new Date().toISOString(),
      lead_type: lead.lead_type || lead.form_type || "lead",
      name: lead.name || lead.full_name || "Anonymous",
      email: lead.email || (String(lead.contact || "").includes("@") ? lead.contact : ""),
      phone: lead.phone || (!String(lead.contact || "").includes("@") ? lead.contact : ""),
      organization: lead.organization || lead.company || lead.organization_type || "",
      role: lead.role || lead.job_title || "",
      interest: lead.interest || lead.segment || lead.organization_type || "",
      subject: lead.subject || lead.challenge || "",
      message: lead.message || "",
      page_path: lead.page_path || lead.pageUrl || "/",
      location: {
        city: vercelCity,
        region: vercelRegion,
        country: vercelCountry,
        ip: clientIp,
      },
      source: "vercel_automation_engine",
    };

    // Print to Vercel console — appears directly in Vercel Dashboard -> Logs
    console.log(
      "🚀 [VERCEL LEAD AUTOMATION] Lead Captured:",
      JSON.stringify(structuredLeadRecord, null, 2)
    );

    return res.status(200).json({
      success: true,
      platform: "Vercel",
      message: "Lead successfully recorded in Vercel Automation Engine",
      lead_id: `vcl_${Date.now()}`,
      captured_at: structuredLeadRecord.timestamp,
    });
  } catch (err: any) {
    console.error("❌ [VERCEL LEAD AUTOMATION] Error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Failed to process lead on Vercel",
    });
  }
}
