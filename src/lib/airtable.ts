/**
 * Airtable Integration — Physiomatics Lead Capture & Sync
 *
 * Saves website leads (demo requests, quick enquiries, consultation requests,
 * and feedback) directly to Airtable.
 *
 * Config:
 * - AIRTABLE_API_KEY (Personal Access Token)
 * - AIRTABLE_BASE_ID (from your Airtable URL: https://airtable.com/appXXXXXXXXXXXXXX)
 */

export interface AirtableLeadRecord {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  interest?: string;
  subject?: string;
  message?: string;
  lead_type?: string;
  page_path?: string;
  city?: string;
  country?: string;
  visitor_id?: string;
  session_id?: string;
  received_at?: string;
}

const AIRTABLE_API_KEY =
  import.meta.env.VITE_AIRTABLE_API_KEY ||
  import.meta.env.AIRTABLE_API_KEY ||
  "";

const AIRTABLE_BASE_ID =
  import.meta.env.VITE_AIRTABLE_BASE_ID || "";

const AIRTABLE_TABLE_NAME =
  import.meta.env.VITE_AIRTABLE_TABLE_NAME || "Leads";

/**
 * Sends a lead record to Airtable.
 * Fire-and-forget: does not block form submissions or UI.
 */
export async function saveLeadToAirtable(
  lead: AirtableLeadRecord
): Promise<boolean> {
  if (!AIRTABLE_API_KEY) {
    console.warn("[Airtable] No API key configured.");
    return false;
  }

  if (!AIRTABLE_BASE_ID) {
    console.warn(
      "[Airtable] VITE_AIRTABLE_BASE_ID is not set in .env. Please provide your Base ID (appXXXXXXXXXXXXXX)."
    );
    return false;
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}`;

  const fields: Record<string, any> = {
    Name: lead.name || "Anonymous Visitor",
    Email: lead.email || "",
    Phone: lead.phone || "",
    Organization: lead.organization || "",
    Role: lead.role || "",
    Interest: lead.interest || "",
    Subject: lead.subject || "",
    Message: lead.message || "",
    "Lead Type": lead.lead_type || "General Enquiry",
    Page: lead.page_path || window.location.pathname,
    "Visitor ID": lead.visitor_id || "",
    "Session ID": lead.session_id || "",
    City: lead.city || "",
    Country: lead.country || "",
    "Received At": lead.received_at || new Date().toISOString(),
  };

  // Strip empty string fields if Airtable fields are strict
  Object.keys(fields).forEach((k) => {
    if (fields[k] === "") delete fields[k];
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true, // Auto-creates single-select options & formats numbers/dates
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[Airtable] Error syncing lead:", res.status, errBody);
      return false;
    }

    console.info("[Airtable] ✓ Lead saved successfully to Airtable:", lead.name);
    return true;
  } catch (err) {
    console.error("[Airtable] Failed to save lead:", err);
    return false;
  }
}
