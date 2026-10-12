/**
 * Vercel Serverless Function — YouTube OAuth 2.0 Authorization Entry
 *
 * Route: GET /api/youtube/auth
 *
 * Starts the Google OAuth 2.0 Authorization Code flow for YouTube Data API v3.
 * Generates a cryptographically random `state` token, stores it in a short-lived
 * cookie, then redirects the browser to Google's consent screen.
 *
 * SECURITY NOTES:
 *  - Client ID is read from server-only env vars (never VITE_* prefixed).
 *  - The `state` param is a random hex nonce — validated in the callback to
 *    prevent CSRF attacks.
 *  - No secrets are ever sent to the browser.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "crypto";

export const config = { maxDuration: 10 };

// Minimum OAuth scopes required: youtube.readonly (channels & videos) + youtube.force-ssl (required by Google for commentThreads.list)
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl",
].join(" ");

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error("[YouTube Auth] Missing YOUTUBE_OAUTH_CLIENT_ID or YOUTUBE_OAUTH_REDIRECT_URI");
    return res.status(500).json({
      error: "OAuth not configured",
      hint: "Set YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_REDIRECT_URI in Vercel environment variables.",
    });
  }

  // Generate a random CSRF state token
  const state = randomBytes(24).toString("hex");

  // Store state in a secure, HttpOnly, SameSite=Lax cookie (10-minute TTL)
  res.setHeader(
    "Set-Cookie",
    `yt_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`
  );

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "offline");            // request refresh token
  authUrl.searchParams.set("prompt", "consent select_account");   // forces consent prompt & account selection

  return res.redirect(302, authUrl.toString());
}
