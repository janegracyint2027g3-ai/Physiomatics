/**
 * Automated Sync: YouTube Video Comments -> Jira Leads Pipeline + Google Sheets
 *
 * Reads comments from the channel / specified videos and creates:
 * - Parent Jira Task with detailed commenter & video metadata
 * - 8 Standard Operating Subtasks for sales & clinical qualification
 * - Deduplication via Jira JQL and labels
 * - Raw data row in Google Sheets (YouTube_Raw_Leads tab) via Apps Script webhook
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// ── 1. Load Environment Variables ─────────────────────────────────────────────
function loadEnv() {
  const env = {};
  for (const envFile of [".env", ".env.local"]) {
    const fullPath = path.join(rootDir, envFile);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const k = trimmed.slice(0, eqIdx).trim();
        let v = trimmed.slice(eqIdx + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        env[k] = v;
      }
    }
  }
  return env;
}

const env = loadEnv();

const JIRA_EMAIL = env.JIRA_EMAIL || env.VITE_JIRA_EMAIL || "janegracy.int2027g3@gmail.com";
const JIRA_API_TOKEN = env.JIRA_API_TOKEN || env.VITE_JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = env.JIRA_PROJECT_KEY || env.VITE_JIRA_PROJECT_KEY || "PHY";

function getJiraHosts() {
  const primary = env.JIRA_HOST || env.VITE_JIRA_HOST || "janegracyint2027g3.atlassian.net";
  const additional = env.JIRA_ADDITIONAL_HOSTS || env.VITE_JIRA_ADDITIONAL_HOSTS || "trustworkz.atlassian.net";
  return Array.from(
    new Set(
      `${primary},${additional}`
        .split(",")
        .map((h) => h.trim().replace(/^https?:\/\//, "").replace(/\/+$/, ""))
        .filter(Boolean)
    )
  );
}

const JIRA_HOSTS = getJiraHosts();
const JIRA_AUTH = `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")}`;

// ── Google Sheets webhook (Apps Script) ───────────────────────────────────────
const GOOGLE_SHEETS_URL =
  env.VITE_GOOGLE_SHEETS_URL ||
  env.GOOGLE_SHEETS_URL ||
  "https://script.google.com/macros/s/AKfycby_kT_VKNkpRR9xFfVQbf3TFyQ7oINUhgU1DIkjhZSazdeDIrAwBFgklDXN_dfZVx_2/exec";

/**
 * Posts a YouTube lead to the Google Sheets Apps Script webhook.
 * Targets the YouTube_Raw_Leads tab via action="youtube_lead".
 */
async function postToGoogleSheets(payload) {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("[Sheets] GOOGLE_SHEETS_URL not configured — skipping.");
    return { success: false, reason: "not_configured" };
  }
  try {
    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "youtube_lead", ...payload }),
      redirect: "follow",
    });
    const data = await res.json();
    if (data.skipped) {
      console.log(`[Sheets] Comment ${payload.comment_id} already in sheet — skipped (duplicate).`);
    } else if (data.stored) {
      console.log(`[Sheets] ✓ Stored new row for comment ${payload.comment_id} by ${payload.author_name} in YouTube_Raw_Leads.`);
    } else if (data.success) {
      // Generic success from processEvent_ (before redeploy) or stored path
      console.log(`[Sheets] ✓ Accepted by Apps Script (success). Comment ${payload.comment_id}.`);
    } else {
      console.warn("[Sheets] Apps Script returned non-success:", data);
    }
    return data;
  } catch (err) {
    console.error("[Sheets] POST error:", err.message);
    return { success: false, error: err.message };
  }
}


// Standard 8 Lead Qualification Subtasks
const LEAD_SUBTASKS = [
  {
    summary: "1. Initial Contact & Channel Reply (YouTube / DM)",
    description: "Acknowledge receipt on YouTube, reply with portal link or direct message, and verify lead details."
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

const ENQUIRY_PATTERNS = [
  /\b(price|pricing|cost|fee|charge|how much|quote)\b/i,
  /\b(demo|appointment|consultation|consult|book|booking|session|trial)\b/i,
  /\b(contact|email|phone|whatsapp|reach out|call me|message me)\b/i,
  /\b(clinic|hospital|physio|physiotherapist|patient|treatment|therapy|rehab)\b/i,
  /\b(license|licensing|subscription|plan|software|features|integration)\b/i,
  /\b(pain|injury|exercise|posture|biomechanics|assessment)\b/i,
  /\b(help|interested|available|how to buy|where to get)\b/i,
  /\b(url|link|website|web|portal|app|info|information|details|share|send|access)\b/i,
];

export function isEnquiry(text) {
  if (!text || !text.trim()) return false;
  return ENQUIRY_PATTERNS.some((p) => p.test(text));
}

// ── 2. YouTube OAuth Token Refresh ────────────────────────────────────────────
async function getYouTubeAccessToken() {
  const clientId = env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = env.YOUTUBE_OAUTH_CLIENT_SECRET;
  const refreshToken = env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing YouTube OAuth credentials in .env (YOUTUBE_OAUTH_CLIENT_ID, YOUTUBE_OAUTH_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN)");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`YouTube OAuth token refresh failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

// ── 3. YouTube Comments Fetching (Published + Held For Review) ─────────────────
async function fetchVideoComments(token, videoId) {
  const list = [];
  const seenIds = new Set();

  const publishedUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=100&textFormat=plainText`;
  const heldUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=100&moderationStatus=heldForReview&textFormat=plainText`;

  for (const url of [publishedUrl, heldUrl]) {
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) continue;
      const data = await res.json();
      for (const item of data.items || []) {
        const top = item.snippet?.topLevelComment?.snippet || {};
        const commentId = item.id || top.id;
        if (!commentId || seenIds.has(commentId)) continue;
        seenIds.add(commentId);

        // Auto-approve if YouTube placed it in moderation so it's not hidden
        if (top.moderationStatus === "heldForReview") {
          try {
            await fetch(`https://www.googleapis.com/youtube/v3/comments/setModerationStatus?id=${commentId}&moderationStatus=published`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`[YouTube] Auto-approved held-for-review comment ${commentId}`);
          } catch (modErr) {
            console.warn(`[YouTube] Moderation approval warning:`, modErr.message);
          }
        }

        const replies = (item.replies?.comments || []).map((r) => ({
          id: r.id,
          author: r.snippet?.authorDisplayName || "Viewer",
          text: r.snippet?.textOriginal || r.snippet?.textDisplay || "",
          publishedAt: r.snippet?.publishedAt,
        }));

        list.push({
          id: commentId,
          authorDisplayName: top.authorDisplayName || "Viewer",
          authorChannelUrl: top.authorChannelUrl?.value || top.authorChannelUrl,
          text: top.textOriginal || top.textDisplay || "",
          publishedAt: top.publishedAt,
          videoId: item.snippet?.videoId || videoId,
          replies,
        });
      }
    } catch (err) {
      console.warn("Comment fetch error:", err.message);
    }
  }

  return list;
}

async function getVideoTitle(token, videoId) {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.items?.[0]?.snippet?.title || "Physiomatics Video";
  } catch {
    return "Physiomatics Video";
  }
}

// ── 4. Jira Lead Creation with Deduplication ──────────────────────────────────
async function isCommentAlreadyInJira(host, commentId) {
  const cleanId = String(commentId).replace(/[^a-zA-Z0-9_-]/g, "");
  const jql = `project = "${JIRA_PROJECT_KEY}" AND (labels = "yt-comment-${cleanId}" OR text ~ "${cleanId}")`;
  try {
    const res = await fetch(`https://${host}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=1&fields=key,summary`, {
      headers: { Authorization: JIRA_AUTH, Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.issues && data.issues.length > 0) {
        return data.issues[0].key;
      }
    }
  } catch (err) {
    console.warn(`[Jira] Deduplication check error on ${host}:`, err.message);
  }
  return null;
}

async function createJiraLeadForComment(comment, videoTitle) {
  const cleanId = String(comment.id).replace(/[^a-zA-Z0-9_-]/g, "");
  const videoRef = videoTitle ? `Video: "${videoTitle}"` : `Video ID: ${comment.videoId}`;
  const videoUrl = comment.videoId ? `https://www.youtube.com/watch?v=${comment.videoId}` : "";
  const summary = `[YOUTUBE_ENQUIRY] ${comment.authorDisplayName} — ${videoRef}`;

  const repliesText = comment.replies && comment.replies.length > 0
    ? `\n\n*Thread Replies:*\n` + comment.replies.map(r => `• ${r.author}: "${r.text}" (${r.publishedAt})`).join("\n")
    : "";

  const descriptionText = [
    `*YouTube Lead / Enquiry Details:*`,
    `• *Author / Name:* ${comment.authorDisplayName}`,
    `• *Video Title:* ${videoTitle}`,
    `• *Comment ID:* ${comment.id}`,
    `• *Published At:* ${comment.publishedAt}`,
    `• *Channel URL:* ${comment.authorChannelUrl || "N/A"}`,
    `• *Video URL:* ${videoUrl || "N/A"}`,
    ``,
    `*Comment Enquiry:*`,
    `"${comment.text}"`,
    repliesText,
  ].filter(Boolean).join("\n");

  const results = [];

  for (const host of JIRA_HOSTS) {
    // Check duplicate
    const existingKey = await isCommentAlreadyInJira(host, comment.id);
    if (existingKey) {
      console.log(`[Jira ${host}] Skipping comment ${comment.id} — already exists as ${existingKey}`);
      results.push({ host, key: existingKey, alreadyExists: true });
      continue;
    }

    console.log(`[Jira ${host}] Creating parent Task for "${comment.authorDisplayName}"...`);
    const parentPayload = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: descriptionText }],
            },
          ],
        },
        issuetype: { name: "Task" },
        labels: [
          "physiomatics-lead",
          "youtube-enquiry",
          `yt-comment-${cleanId}`,
        ],
      },
    };

    const res = await fetch(`https://${host}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        Authorization: JIRA_AUTH,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parentPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Jira ${host}] Failed to create parent task:`, errText);
      results.push({ host, error: errText });
      continue;
    }

    const data = await res.json();
    const parentKey = data.key;
    console.log(`[Jira ${host}] Created parent Task ${parentKey}`);

    // Create 8 subtasks
    const subtaskKeys = [];
    for (const sub of LEAD_SUBTASKS) {
      try {
        const subRes = await fetch(`https://${host}/rest/api/3/issue`, {
          method: "POST",
          headers: {
            Authorization: JIRA_AUTH,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
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
                    content: [{ type: "text", text: sub.description }],
                  },
                ],
              },
              issuetype: { name: "Sub-task" },
            },
          }),
        });

        if (subRes.ok) {
          const subData = await subRes.json();
          subtaskKeys.push(subData.key);
        } else {
          const subErr = await subRes.text();
          console.warn(`[Jira ${host}] Subtask warning (${sub.summary}):`, subErr);
        }
      } catch (err) {
        console.warn(`[Jira ${host}] Error creating subtask:`, err.message);
      }
    }

    results.push({
      host,
      key: parentKey,
      subtasks: subtaskKeys,
      alreadyExists: false,
    });
  }

  return results;
}

// ── 5. Main Execution Flow ───────────────────────────────────────────────────
export async function syncYouTubeLeads(targetVideoId = "eRGcQo4qWiM") {
  console.log("=== Physiomatics YouTube to Jira + Google Sheets Sync ===");
  console.log(`Target Video ID: ${targetVideoId}`);
  console.log(`Jira Hosts: ${JIRA_HOSTS.join(", ")}`);
  console.log(`Jira Project: ${JIRA_PROJECT_KEY}`);
  console.log(`Google Sheets Webhook: ${GOOGLE_SHEETS_URL ? "configured ✓" : "NOT configured ✗"}`);

  const token = await getYouTubeAccessToken();
  console.log("✓ YouTube access token obtained.");

  const videoTitle = await getVideoTitle(token, targetVideoId);
  console.log(`✓ Video Title: "${videoTitle}"`);

  const comments = await fetchVideoComments(token, targetVideoId);
  console.log(`✓ Fetched ${comments.length} comment threads.`);

  const syncReport = [];

  for (const comment of comments) {
    const isLead = isEnquiry(comment.text);
    console.log(`\nComment [${comment.id}] from ${comment.authorDisplayName}:`);
    console.log(`  "${comment.text}"`);
    console.log(`  Intent Classified as Lead: ${isLead ? "YES" : "NO"}`);

    let jiraResults = [];
    let sheetsResult = null;

    if (isLead) {
      // ── Step A: Create / check Jira tasks ──────────────────────────────────
      jiraResults = await createJiraLeadForComment(comment, videoTitle);

      // ── Step B: Extract Jira keys for Sheets row ───────────────────────────
      const primaryJira  = jiraResults.find(r => r.host === JIRA_HOSTS[0]);
      const secondaryJira = jiraResults.find(r => r.host === JIRA_HOSTS[1]);
      const jiraKeyPrimary   = primaryJira?.key   || "";
      const jiraKeySecondary = secondaryJira?.key  || "";
      const syncStatus = jiraResults.some(r => r.alreadyExists) ? "duplicate" : "new";

      // ── Step C: Post raw data row to Google Sheets ─────────────────────────
      const replyText = (comment.replies || []).map(r => `${r.author}: ${r.text}`).join(" | ");
      sheetsResult = await postToGoogleSheets({
        comment_id:          comment.id,
        video_id:            targetVideoId,
        video_title:         videoTitle,
        channel:             comment.authorChannelUrl || "",
        author_name:         comment.authorDisplayName,
        author_channel_url:  comment.authorChannelUrl || "",
        comment_text:        comment.text,
        reply_text:          replyText,
        published_at:        comment.publishedAt,
        like_count:          0,
        is_enquiry:          true,
        jira_key_primary:    jiraKeyPrimary,
        jira_key_secondary:  jiraKeySecondary,
        sync_status:         syncStatus,
      });

      syncReport.push({
        commentId: comment.id,
        author:    comment.authorDisplayName,
        text:      comment.text,
        jiraResults,
        sheetsResult,
      });
    }
  }

  console.log("\n=== Sync Summary Report ===");
  console.log(JSON.stringify(syncReport, null, 2));
  return syncReport;
}

// Run directly if invoked via node
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const videoIdArg = process.argv[2] || "eRGcQo4qWiM";
  syncYouTubeLeads(videoIdArg)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Sync failed:", err);
      process.exit(1);
    });
}
