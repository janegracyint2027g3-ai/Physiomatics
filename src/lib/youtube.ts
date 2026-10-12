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
