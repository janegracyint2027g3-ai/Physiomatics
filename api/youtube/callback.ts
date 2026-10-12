/**
 * Vercel Serverless Function — YouTube OAuth 2.0 Callback Handler
 *
 * Route: GET /api/youtube/callback
 *
 * Receives Google's authorization code, validates the CSRF state cookie,
 * exchanges the code for access + refresh tokens, then stores the
 * refresh token securely in an HttpOnly cookie (or forwards to Supabase/KV).
 *
 * SECURITY NOTES:
 *  - Client secret is NEVER sent to the browser — it lives in server env only.
 *  - State is validated against the cookie set in /api/youtube/auth.
 *  - Refresh token is stored in an HttpOnly Secure cookie — not localStorage.
 *  - Access token is NEVER logged in full.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { maxDuration: 30 };

/** Parse cookies from the Cookie request header into a plain object. */
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
  const clientId     = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
  const redirectUri  = process.env.YOUTUBE_OAUTH_REDIRECT_URI;
  const appOrigin    = process.env.YOUTUBE_OAUTH_APP_ORIGIN ?? "https://physiomatics.vercel.app";

  // ── Configuration guard ─────────────────────────────────────────────────────
  if (!clientId || !clientSecret || !redirectUri) {
    console.error("[YouTube Callback] Missing required OAuth env vars.");
    return res.status(500).json({ error: "OAuth misconfigured on server." });
  }

  const { code, state: returnedState, error: oauthError } = req.query as Record<string, string>;

  // ── Handle user denial / Google error ───────────────────────────────────────
  if (oauthError) {
    console.warn(`[YouTube Callback] Google returned error: ${oauthError}`);
    return res.redirect(302, `${appOrigin}/?yt_oauth=denied`);
  }

  if (!code || !returnedState) {
    return res.status(400).json({ error: "Missing code or state in callback." });
  }

  // ── CSRF state validation ────────────────────────────────────────────────────
  const cookies = parseCookies(req.headers.cookie);
  const expectedState = cookies["yt_oauth_state"];

  if (!expectedState || expectedState !== returnedState) {
    console.error("[YouTube Callback] State mismatch — possible CSRF attack.");
    return res.status(403).json({ error: "State validation failed. Request rejected." });
  }

  // ── Exchange authorization code for tokens ───────────────────────────────────
  let tokenData: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:     clientId,
        client_secret: clientSecret,
        redirect_uri:  redirectUri,
        grant_type:    "authorization_code",
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("[YouTube Callback] Token exchange failed:", errBody);
      return res.status(502).json({ error: "Token exchange failed.", detail: errBody });
    }

    tokenData = await tokenRes.json();
  } catch (err) {
    console.error("[YouTube Callback] Network error during token exchange:", err);
    return res.status(502).json({ error: "Network error during token exchange." });
  }

  // ── Log (safely — never log full tokens) ────────────────────────────────────
  console.log("[YouTube Callback] Token exchange succeeded.", {
    scope: tokenData.scope,
    expires_in: tokenData.expires_in,
    has_refresh_token: !!tokenData.refresh_token,
    access_token_prefix: tokenData.access_token?.slice(0, 8) + "…",
  });

  // ── Store refresh token in secure HttpOnly cookie ────────────────────────────
  // The refresh token is long-lived. Store it server-side only.
  // Production hardening: replace cookie storage with Supabase KV / Vercel KV.
  const cookieHeaders: string[] = [
    // Clear the ephemeral state nonce cookie
    `yt_oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`,
  ];

  if (tokenData.refresh_token) {
    // 90-day cookie — matches typical Google refresh token expiry
    cookieHeaders.push(
      `yt_refresh_token=${encodeURIComponent(tokenData.refresh_token)}; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 90}; Path=/`
    );
    console.log("[YouTube Callback] Refresh token stored in HttpOnly cookie.");
  } else {
    console.warn(
      "[YouTube Callback] No refresh_token returned. " +
      "This usually means the user already granted consent previously. " +
      "Revoke access at https://myaccount.google.com/permissions and retry to get a fresh refresh token."
    );
  }

  res.setHeader("Set-Cookie", cookieHeaders);

  // ── Redirect back to the app with a success signal ──────────────────────────
  return res.redirect(302, `${appOrigin}/?yt_oauth=success`);
}
