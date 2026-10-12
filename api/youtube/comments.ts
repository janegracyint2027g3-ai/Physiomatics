/**
 * Vercel Serverless Function — YouTube Comments & Jira Enquiry Sync
 *
 * Routes:
 *  - GET  /api/youtube/comments — Reads YouTube comments using server-side OAuth refresh token
 *  - POST /api/youtube/comments — Converts a YouTube comment into a Jira Task + 8 Subtasks
 *
 * SECURITY:
 *  - Refresh token is read strictly from HttpOnly cookie `yt_refresh_token`.
 *  - OAuth client secret and Jira API tokens are kept server-side.
 *  - Uses minimal scope: https://www.googleapis.com/auth/youtube.readonly
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { maxDuration: 30 };

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
}

const ENQUIRY_PATTERNS = [
  /\b(price|pricing|cost|fee|charge|how much|quote)\b/i,
  /\b(demo|appointment|consultation|consult|book|booking|session|trial)\b/i,
  /\b(contact|email|phone|whatsapp|reach out|call me|message me)\b/i,
  /\b(clinic|hospital|physio|physiotherapist|patient|treatment|therapy|rehab)\b/i,
  /\b(license|licensing|subscription|plan|software|features|integration)\b/i,
  /\b(pain|injury|exercise|posture|biomechanics|assessment)\b/i,
  /\b(help|interested|available|how to buy|where to get)\b/i,
];

export function isEnquiryText(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return ENQUIRY_PATTERNS.some((pattern) => pattern.test(text));
}

async function getFreshAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

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

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appOrigin = process.env.YOUTUBE_OAUTH_APP_ORIGIN ?? "https://physiomatics.vercel.app";

  res.setHeader("Access-Control-Allow-Origin", appOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET: Read comments from YouTube Data API v3 ──────────────────────────────
  if (req.method === "GET") {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies["yt_refresh_token"];

    if (!refreshToken) {
      return res.status(401).json({
        error: "Not authenticated",
        hint: "Visit /api/youtube/auth to authorize YouTube read-only access.",
      });
    }

    const accessToken = await getFreshAccessToken(refreshToken);
    if (!accessToken) {
      return res.status(401).json({ error: "Failed to refresh YouTube access token. Please re-authorize." });
    }

    try {
      const videoId = typeof req.query.videoId === "string" ? req.query.videoId : undefined;
      const maxResults = Math.min(Number(req.query.maxResults) || 20, 100);

      const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("maxResults", String(maxResults));
      url.searchParams.set("textFormat", "plainText");

      if (videoId) {
        url.searchParams.set("videoId", videoId);
      } else {
        // Fetch channel ID for mine=true
        const chRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=id&mine=true", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const chData = await chRes.json();
        const channelId = chData.items?.[0]?.id;

        if (!channelId) {
          return res.status(404).json({ error: "No YouTube channel found for authenticated account." });
        }
        url.searchParams.set("allThreadsRelatedToChannelId", channelId);
      }

      const commentsRes = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!commentsRes.ok) {
        const errorText = await commentsRes.text();
        return res.status(commentsRes.status).json({ error: "YouTube API error", detail: errorText });
      }

      const commentsData = await commentsRes.json();
      const comments = (commentsData.items ?? []).map((item: any) => {
        const top = item.snippet?.topLevelComment?.snippet || {};
        const text = top.textOriginal || top.textDisplay || "";
        return {
          id: item.id || top.id,
          authorDisplayName: top.authorDisplayName || "Viewer",
          textOriginal: text,
          videoId: item.snippet?.videoId || videoId,
          publishedAt: top.publishedAt,
          likeCount: top.likeCount || 0,
          isEnquiry: isEnquiryText(text),
        };
      });

      return res.status(200).json({
        success: true,
        count: comments.length,
        enquiriesCount: comments.filter((c: any) => c.isEnquiry).length,
        comments,
      });
    } catch (err: any) {
      console.error("[YouTube Comments] Fetch error:", err);
      return res.status(500).json({ error: "Internal server error fetching comments" });
    }
  }

  // ── POST: Convert a comment into a Jira Task + 8 Subtasks ────────────────────
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const {
        authorDisplayName = "YouTube Commenter",
        textOriginal = "",
        videoId,
        videoTitle,
        commentId,
        publishedAt = new Date().toISOString(),
      } = body;

      if (!textOriginal) {
        return res.status(400).json({ error: "Missing required textOriginal parameter" });
      }

      const jiraToken = process.env.JIRA_API_TOKEN || process.env.VITE_JIRA_API_TOKEN;
      const jiraEmail = process.env.JIRA_EMAIL || process.env.VITE_JIRA_EMAIL || "janegracy.int2027g3@gmail.com";
      const jiraHost = (process.env.JIRA_HOST || process.env.VITE_JIRA_HOST || "janegracyint2027g3.atlassian.net")
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "");
      const jiraProjectKey = process.env.JIRA_PROJECT_KEY || process.env.VITE_JIRA_PROJECT_KEY || "PHY";

      if (!jiraToken) {
        return res.status(500).json({ error: "JIRA_API_TOKEN is not configured on server" });
      }

      const authHeader = `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64")}`;
      const videoRef = videoTitle ? `Video: "${videoTitle}"` : videoId ? `Video ID: ${videoId}` : "YouTube";

      const summary = `[YOUTUBE_ENQUIRY] ${authorDisplayName} — ${videoRef}`;
      const descriptionText = [
        `*YouTube Lead / Enquiry Details:*`,
        `• *Author / Name:* ${authorDisplayName}`,
        `• *Video:* ${videoRef}`,
        `• *Comment ID:* ${commentId || "N/A"}`,
        `• *Published At:* ${publishedAt}`,
        `• *Video URL:* ${videoId ? `https://www.youtube.com/watch?v=${videoId}` : "N/A"}`,
        ``,
        `*Comment Enquiry:*`,
        textOriginal,
      ].join("\n");

      // 1. Create Parent Task
      const parentPayload = {
        fields: {
          project: { key: jiraProjectKey },
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
          labels: ["physiomatics-lead", "youtube-enquiry"],
        },
      };

      const parentRes = await fetch(`https://${jiraHost}/rest/api/3/issue`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parentPayload),
      });

      if (!parentRes.ok) {
        const errDetail = await parentRes.text();
        return res.status(502).json({ error: "Failed to create Jira parent task", detail: errDetail });
      }

      const parentData = await parentRes.json();
      const parentKey = parentData.key;

      // 2. Create the 8 standard Physiomatics subtasks
      const subtaskTitles = [
        "1. Initial Contact & Channel Reply (YouTube / DM)",
        "2. Clinical & Organizational Assessment",
        "3. Schedule Discovery & Live Demo Session",
        "4. Conduct Live Platform Walkthrough",
        "5. Technical Integration & EHR/EMR Feasibility Check",
        "6. Commercial Proposal & Pilot Licensing Setup",
        "7. Clinical Onboarding & Staff Training Session",
        "8. Post-Onboarding Review & Satisfaction Check",
      ];

      for (const subTitle of subtaskTitles) {
        try {
          await fetch(`https://${jiraHost}/rest/api/3/issue`, {
            method: "POST",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              fields: {
                project: { key: jiraProjectKey },
                parent: { key: parentKey },
                summary: subTitle,
                issuetype: { name: "Sub-task" },
              },
            }),
          });
        } catch (subErr) {
          console.warn("[YouTube Jira Sync] Subtask creation warning:", subErr);
        }
      }

      return res.status(200).json({
        success: true,
        issueKey: parentKey,
        host: jiraHost,
        message: `Successfully created Jira Task ${parentKey} and 8 subtasks from YouTube comment`,
      });
    } catch (err: any) {
      console.error("[YouTube Jira Sync] Error:", err);
      return res.status(500).json({ error: err?.message || "Failed to create Jira task from comment" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
