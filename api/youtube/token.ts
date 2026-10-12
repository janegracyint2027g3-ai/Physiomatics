/**
 * Vercel Serverless Function — YouTube Token Refresh
 *
 * Route: POST /api/youtube/token
 *
 * Uses the server-stored refresh token (HttpOnly cookie) to obtain a
 * fresh short-lived access token from Google. Returns only the access token
 * and its expiry — never the refresh token — to the calling frontend code.
 *
 * SECURITY NOTES:
 *  - The refresh token is read from an HttpOnly cookie — never from the request body.
 *  - Client secret lives in server env only.
 *  - CORS is locked to the production origin.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { maxDuration: 15 };

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appOrigin = process.env.YOUTUBE_OAUTH_APP_ORIGIN ?? "https://physiomatics.vercel.app";

  res.setHeader("Access-Control-Allow-Origin", appOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const clientId     = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "OAuth not configured on server." });
  }

  // Read refresh token from the HttpOnly cookie — never from req.body
  const cookies = parseCookies(req.headers.cookie);
  const refreshToken = cookies["yt_refresh_token"];

  if (!refreshToken) {
    return res.status(401).json({
      error: "Not authenticated",
      hint: "Visit /api/youtube/auth to authorize YouTube access.",
    });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type:    "refresh_token",
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("[YouTube Token] Refresh failed:", errBody);
      // Likely the refresh token was revoked — clear the stale cookie
      res.setHeader("Set-Cookie", `yt_refresh_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`);
      return res.status(401).json({ error: "Refresh token invalid or revoked. Re-authorize." });
    }

    const data: { access_token: string; expires_in: number; scope: string } = await tokenRes.json();

    // Return ONLY the short-lived access token — never the refresh token
    return res.status(200).json({
      access_token: data.access_token,
      expires_in:   data.expires_in,
      scope:        data.scope,
      issued_at:    Date.now(),
    });
  } catch (err) {
    console.error("[YouTube Token] Network error:", err);
    return res.status(502).json({ error: "Failed to contact Google token endpoint." });
  }
}
