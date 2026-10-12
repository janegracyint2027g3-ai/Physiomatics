/**
 * YouTube Data API v3 — Client-side integration helper
 *
 * SECURITY CONTRACT:
 *  - This file contains ZERO secrets.
 *  - OAuth flow is handled entirely by server-side Vercel Functions:
 *      /api/youtube/auth      → starts OAuth, redirects to Google
 *      /api/youtube/callback  → receives code, stores refresh token in HttpOnly cookie
 *      /api/youtube/token     → returns a fresh access token (reads cookie server-side)
 *  - This module only calls those endpoints and the YouTube Data API with
 *    the short-lived access token it receives.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface YouTubeTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  issued_at: number;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  thumbnailUrl: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

// ─── In-memory token cache ──────────────────────────────────────────────────────
// Access tokens are short-lived (1 hr). We cache them in memory to avoid
// hammering /api/youtube/token on every YouTube API call.

let cachedToken: YouTubeTokenResponse | null = null;

function isTokenFresh(token: YouTubeTokenResponse): boolean {
  const expiresAt = token.issued_at + token.expires_in * 1000;
  return Date.now() < expiresAt - 60_000; // 60s buffer
}

// ─── Auth helpers ───────────────────────────────────────────────────────────────

/**
 * Redirects the user to /api/youtube/auth to start the OAuth consent flow.
 * Call this from a "Connect YouTube" button in the UI.
 */
export function startYouTubeOAuth(): void {
  window.location.href = "/api/youtube/auth";
}

/**
 * Fetches a fresh short-lived access token from the server.
 * The server reads the refresh token from its own HttpOnly cookie.
 * Returns null if the user is not authorized.
 */
export async function getYouTubeAccessToken(): Promise<string | null> {
  if (cachedToken && isTokenFresh(cachedToken)) {
    return cachedToken.access_token;
  }

  try {
    const res = await fetch("/api/youtube/token", {
      method: "POST",
      credentials: "include", // send HttpOnly cookies to the server
    });

    if (res.status === 401) {
      cachedToken = null;
      return null; // Not authorized — call startYouTubeOAuth() to begin flow
    }

    if (!res.ok) {
      console.error("[YouTube] Token endpoint error:", await res.text());
      return null;
    }

    cachedToken = await res.json();
    return cachedToken!.access_token;
  } catch (err) {
    console.error("[YouTube] Failed to fetch access token:", err);
    return null;
  }
}

/**
 * Returns true if the current user has a valid YouTube OAuth session.
 */
export async function isYouTubeAuthorized(): Promise<boolean> {
  const token = await getYouTubeAccessToken();
  return token !== null;
}

// ─── YouTube Data API helpers ───────────────────────────────────────────────────

/**
 * Fetches the authenticated user's YouTube channel statistics.
 */
export async function getYouTubeChannelStats(): Promise<YouTubeChannel | null> {
  const token = await getYouTubeAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      console.error("[YouTube] channels API error:", await res.text());
      return null;
    }

    const data = await res.json();
    const ch = data.items?.[0];
    if (!ch) return null;

    return {
      id:              ch.id,
      title:           ch.snippet.title,
      subscriberCount: ch.statistics.subscriberCount ?? "0",
      viewCount:       ch.statistics.viewCount ?? "0",
      videoCount:      ch.statistics.videoCount ?? "0",
      thumbnailUrl:    ch.snippet.thumbnails?.default?.url ?? "",
    };
  } catch (err) {
    console.error("[YouTube] getYouTubeChannelStats error:", err);
    return null;
  }
}

/**
 * Fetches the most recent `maxResults` videos uploaded by the authenticated channel.
 * @param maxResults - number of videos to return (1-50, default 10)
 */
export async function getLatestYouTubeVideos(maxResults = 10): Promise<YouTubeVideo[]> {
  const token = await getYouTubeAccessToken();
  if (!token) return [];

  try {
    // Step 1 — Get the upload playlist ID for the channel
    const chRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const chData = await chRes.json();
    const uploadsPlaylistId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return [];

    // Step 2 — Fetch latest video IDs from the playlist
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const plData = await plRes.json();
    const videoIds: string[] = (plData.items ?? []).map(
      (item: any) => item.snippet.resourceId.videoId
    );
    if (!videoIds.length) return [];

    // Step 3 — Fetch full video statistics
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(",")}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const statsData = await statsRes.json();

    return (statsData.items ?? []).map((v: any): YouTubeVideo => ({
      id:           v.id,
      title:        v.snippet.title,
      description:  v.snippet.description,
      publishedAt:  v.snippet.publishedAt,
      thumbnailUrl: v.snippet.thumbnails?.medium?.url ?? "",
      viewCount:    v.statistics.viewCount ?? "0",
      likeCount:    v.statistics.likeCount ?? "0",
      commentCount: v.statistics.commentCount ?? "0",
    }));
  } catch (err) {
    console.error("[YouTube] getLatestYouTubeVideos error:", err);
    return [];
  }
}

// ─── Comment Types & Helpers ───────────────────────────────────────────────────

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl?: string;
  authorChannelUrl?: string;
  textDisplay: string;
  textOriginal: string;
  videoId?: string;
  videoTitle?: string;
  publishedAt: string;
  likeCount: number;
  totalReplyCount?: number;
  isEnquiry?: boolean;
}

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

/**
 * Determines whether a YouTube comment text expresses potential commercial,
 * clinical, or consultation enquiry intent.
 */
export function isPotentialEnquiry(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return ENQUIRY_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Fetches comment threads for a specific YouTube video.
 * Uses the minimal `https://www.googleapis.com/auth/youtube.readonly` OAuth scope.
 */
export async function getYouTubeVideoComments(
  videoId: string,
  maxResults = 20
): Promise<YouTubeComment[]> {
  const token = await getYouTubeAccessToken();
  if (!token) return [];

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("videoId", videoId);
    url.searchParams.set("maxResults", String(Math.min(maxResults, 100)));
    url.searchParams.set("textFormat", "plainText");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("[YouTube] commentThreads error:", await res.text());
      return [];
    }

    const data = await res.json();
    return parseCommentThreads(data.items ?? [], videoId);
  } catch (err) {
    console.error("[YouTube] getYouTubeVideoComments error:", err);
    return [];
  }
}

/**
 * Fetches all recent comment threads across the authenticated user's channel.
 * Uses the minimal `https://www.googleapis.com/auth/youtube.readonly` OAuth scope.
 */
export async function getRecentChannelComments(
  channelId?: string,
  maxResults = 20
): Promise<YouTubeComment[]> {
  const token = await getYouTubeAccessToken();
  if (!token) return [];

  try {
    let targetChannelId = channelId;
    if (!targetChannelId) {
      const channel = await getYouTubeChannelStats();
      targetChannelId = channel?.id;
    }

    if (!targetChannelId) {
      console.warn("[YouTube] No channel ID available to fetch channel comments.");
      return [];
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("allThreadsRelatedToChannelId", targetChannelId);
    url.searchParams.set("maxResults", String(Math.min(maxResults, 100)));
    url.searchParams.set("textFormat", "plainText");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("[YouTube] channel commentThreads error:", await res.text());
      return [];
    }

    const data = await res.json();
    return parseCommentThreads(data.items ?? []);
  } catch (err) {
    console.error("[YouTube] getRecentChannelComments error:", err);
    return [];
  }
}

function parseCommentThreads(items: any[], defaultVideoId?: string): YouTubeComment[] {
  return items.map((item: any): YouTubeComment => {
    const topSnippet = item.snippet?.topLevelComment?.snippet || {};
    const textOriginal = topSnippet.textOriginal || topSnippet.textDisplay || "";
    const videoId = item.snippet?.videoId || defaultVideoId;

    return {
      id: item.id || topSnippet.id || "",
      authorDisplayName: topSnippet.authorDisplayName || "YouTube User",
      authorProfileImageUrl: topSnippet.authorProfileImageUrl,
      authorChannelUrl: topSnippet.authorChannelUrl?.value || topSnippet.authorChannelUrl,
      textDisplay: topSnippet.textDisplay || "",
      textOriginal,
      videoId,
      publishedAt: topSnippet.publishedAt || new Date().toISOString(),
      likeCount: topSnippet.likeCount ?? 0,
      totalReplyCount: item.snippet?.totalReplyCount ?? 0,
      isEnquiry: isPotentialEnquiry(textOriginal),
    };
  });
}

// ─── Jira Integration Bridge ───────────────────────────────────────────────────

import { createJiraLeadWithSubtasks, type JiraLeadPayload } from "./jira";

/**
 * Converts a YouTube comment into a structured JiraLeadPayload
 * compatible with the Physiomatics Jira pipeline.
 */
export function convertCommentToJiraPayload(
  comment: YouTubeComment,
  videoTitle?: string
): JiraLeadPayload {
  const videoReference = videoTitle
    ? `YouTube Video: "${videoTitle}"`
    : comment.videoId
    ? `YouTube Video ID: ${comment.videoId}`
    : "Physiomatics YouTube Channel";

  return {
    name: comment.authorDisplayName || "YouTube Commenter",
    email: "", // YouTube comments do not provide user emails
    phone: "",
    organization: "YouTube Community",
    role: "Viewer / Prospective Client",
    interest: videoReference,
    subject: `[YouTube Enquiry] ${comment.authorDisplayName} on ${videoReference}`,
    message: [
      `Comment text: "${comment.textOriginal}"`,
      ``,
      `Comment ID: ${comment.id}`,
      `Published at: ${comment.publishedAt}`,
      comment.authorChannelUrl ? `Author Channel: ${comment.authorChannelUrl}` : "",
      comment.videoId ? `Video URL: https://www.youtube.com/watch?v=${comment.videoId}` : "",
    ].filter(Boolean).join("\n"),
    lead_type: "youtube_enquiry",
    page_path: comment.videoId
      ? `https://www.youtube.com/watch?v=${comment.videoId}`
      : "https://www.youtube.com",
    received_at: comment.publishedAt,
    lead_id: `yt_${comment.id}`,
  };
}

/**
 * Creates a parent Jira Task + 8 standard subtasks from a YouTube comment enquiry,
 * using the project's existing Jira workflow.
 */
export async function createJiraTaskFromComment(
  comment: YouTubeComment,
  videoTitle?: string
): Promise<{ success: boolean; issueKey?: string; issueKeys?: string[]; error?: string }> {
  const payload = convertCommentToJiraPayload(comment, videoTitle);
  return createJiraLeadWithSubtasks(payload);
}

