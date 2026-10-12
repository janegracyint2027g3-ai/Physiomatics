/**
 * Jira Cloud REST API v3 Integration
 *
 * Automatically creates:
 * 1. Parent Task for every incoming lead (Demo, Consultation, Quick Enquiry, Chatbot).
 * 2. 8 Structured Subtasks for end-to-end physiotherapy sales & clinical qualification.
 * 3. Scheduled Report Tasks (Daily, Weekly, Monthly performance digests).
 */

export interface JiraLeadPayload {
  name: string;
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
  received_at?: string;
  lead_id?: string;
}

export interface JiraReportPayload {
  interval: "Daily" | "Weekly" | "Monthly";
  period: string;
  visitors: number;
  pageViews: number;
  leads: number;
  conversionRate: string;
  avgEngagementSec: number;
  demos: number;
  consultations: number;
  quickEnquiries: number;
  chatbotMessages: number;
  sheetUrl?: string;
}

const env = import.meta.env as Record<string, string | undefined>;

export function getJiraHosts(): string[] {
  const primary = (
    env["VITE_JIRA_HOST"] ||
    env["JIRA_HOST"] ||
    "janegracyint2027g3.atlassian.net"
  );
  const additional = (
    env["VITE_JIRA_ADDITIONAL_HOSTS"] ||
    env["JIRA_ADDITIONAL_HOSTS"] ||
    "trustworkz.atlassian.net"
  );
  const raw = `${primary},${additional}`;
  const hosts = raw
    .split(",")
    .map((h) => h.trim().replace(/^https?:\/\//, "").replace(/\/+$/, ""))
    .filter(Boolean);
  return Array.from(new Set(hosts));
}

const JIRA_EMAIL =
  env["VITE_JIRA_EMAIL"] ||
  env["JIRA_EMAIL"] ||
  "janegracy.int2027g3@gmail.com";

const JIRA_API_TOKEN =
  env["VITE_JIRA_API_TOKEN"] ||
  env["JIRA_API_TOKEN"] ||
  "";

const JIRA_PROJECT_KEY =
  env["VITE_JIRA_PROJECT_KEY"] ||
  env["JIRA_PROJECT_KEY"] ||
  "";

/**
 * 8 Standard Operating Subtasks for Lead Pipeline Qualification & Delivery
 */
export const LEAD_SUBTASKS = [
  {
    summary: "1. Initial Contact & Identity Verification",
    description: "Verify lead contact channels (Email & WhatsApp/Phone), confirm identity and acknowledge receipt within 15 minutes."
  },
  {
    summary: "2. Clinical & Organizational Assessment",
    description: "Assess clinical requirements, clinic/hospital capacity, patient volume, and biomechanics specialization needs."
  },
  {
    summary: "3. Schedule Discovery & Live Demo Session",
    description: "Coordinate calendar invite with senior consultant and prepare tailored Physiomatics platform demo."
  },
  {
    summary: "4. Conduct Live Platform Walkthrough",
    description: "Demonstrate AI posture tracking, patient dashboard, exercise compliance monitoring, and reporting suite."
  },
  {
    summary: "5. Technical Integration & EHR/EMR Feasibility Check",
    description: "Review clinic workflows, EHR/EMR compatibility, hardware setup (cameras/sensors), and HIPAA/GDPR readiness."
  },
  {
    summary: "6. Commercial Proposal & Pilot Licensing Setup",
    description: "Generate customized quotation, software tier pricing, pilot period terms, and send clinical SLA contract."
  },
  {
    summary: "7. Clinical Onboarding & Staff Training Session",
    description: "Schedule training workshop for physiotherapists, assign clinic admin credentials, and conduct trial run."
  },
  {
    summary: "8. Post-Onboarding Review & Satisfaction Check",
    description: "Review 14-day patient compliance data, collect feedback, address clinical questions, and ensure full operational adoption."
  }
];

function getAuthHeader(): string {
  if (!JIRA_EMAIL || !JIRA_API_TOKEN) return "";
  // btoa for browser environments
  const credentials = `${JIRA_EMAIL}:${JIRA_API_TOKEN}`;
  try {
    return `Basic ${btoa(credentials)}`;
  } catch {
    return "";
  }
}

/**
 * Creates parent Jira Task and 8 subtasks for an incoming lead
 */
export async function createJiraLeadWithSubtasks(
  lead: JiraLeadPayload
): Promise<{ success: boolean; issueKey?: string; issueKeys?: string[]; error?: string }> {
  const hosts = getJiraHosts();
  if (hosts.length === 0 || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
    console.warn(
      "[Jira] Skipping Jira lead sync — Host, Project Key, or API Token not configured yet in .env."
    );
    return { success: false, error: "Jira credentials incomplete" };
  }

  const authHeader = getAuthHeader();
  if (!authHeader) return { success: false, error: "Failed to generate auth header" };

  const leadTypeLabel = (lead.lead_type || "Lead").toUpperCase();
  const summary = `[${leadTypeLabel}] ${lead.name || "New Visitor"} — ${lead.organization || "Direct Patient / Individual"}`;

  const descriptionContent = [
    `*Lead Details:*`,
    `• *Name:* ${lead.name || "N/A"}`,
    `• *Email:* ${lead.email || "N/A"}`,
    `• *Phone:* ${lead.phone || "N/A"}`,
    `• *Organization:* ${lead.organization || "N/A"}`,
    `• *Role:* ${lead.role || "N/A"}`,
    `• *Interest / Segment:* ${lead.interest || "N/A"}`,
    `• *Topic / Challenge:* ${lead.subject || "N/A"}`,
    `• *Location:* ${[lead.city, lead.country].filter(Boolean).join(", ") || "N/A"}`,
    `• *Source Page:* ${lead.page_path || "N/A"}`,
    `• *Received:* ${lead.received_at || new Date().toISOString()}`,
    ``,
    `*Enquiry / Message:*`,
    lead.message || "No custom message provided."
  ].join("\n");

  const createdKeys: string[] = [];
  const errors: string[] = [];

  for (const host of hosts) {
    try {
      // 1. Create Parent Issue (Task)
      const parentPayload = {
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          summary: summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: descriptionContent }]
              }
            ]
          },
          issuetype: { name: "Task" },
          labels: ["physiomatics-lead", (lead.lead_type || "web-lead").replace(/_/g, "-")].filter(Boolean)
        }
      };

      const parentRes = await fetch(`https://${host}/rest/api/3/issue`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(parentPayload)
      });

      if (!parentRes.ok) {
        const errText = await parentRes.text();
        console.error(`[Jira] Failed to create parent task on ${host}:`, errText);
        errors.push(`${host}: ${errText}`);
        continue;
      }

      const parentData = await parentRes.json();
      const parentKey = parentData.key;
      createdKeys.push(`${host}:${parentKey}`);
      console.log(`[Jira] Successfully created parent Task ${parentKey} on ${host}`);

      // 2. Create the 8 Subtasks linked to the parent task
      for (const sub of LEAD_SUBTASKS) {
        try {
          const subPayload = {
            fields: {
              project: { key: JIRA_PROJECT_KEY },
              parent: { key: parentKey },
              summary: sub.summary,
              description: {
                type: "doc",
                version: 1,
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: sub.description }]
                  }
                ]
              },
              issuetype: { name: "Sub-task" }
            }
          };

          await fetch(`https://${host}/rest/api/3/issue`, {
            method: "POST",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(subPayload)
          });
        } catch (subErr) {
          console.warn(`[Jira] Failed to create subtask on ${host}: ${sub.summary}`, subErr);
        }
      }
    } catch (err: any) {
      console.error(`[Jira] Exception during lead sync on ${host}:`, err);
      errors.push(`${host}: ${err?.message || String(err)}`);
    }
  }

  if (createdKeys.length > 0) {
    return {
      success: true,
      issueKey: createdKeys[0].split(":")[1],
      issueKeys: createdKeys
    };
  }

  return {
    success: false,
    error: errors.join("; ") || "Failed to create Jira issues on all hosts"
  };
}
