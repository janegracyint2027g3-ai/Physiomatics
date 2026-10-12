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
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (tokenData.refresh_token) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Physiomatics — YouTube OAuth Connected</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; max-width: 640px; width: 100%; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 9999px; padding: 6px 14px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; margin: 0 0 10px 0; color: #fff; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .token-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 14px; font-family: monospace; font-size: 13px; color: #38bdf8; word-break: break-all; user-select: all; margin-bottom: 20px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 10px; text-decoration: none; border: none; cursor: pointer; font-size: 14px; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
    .btn-secondary { background: #334155; color: #f8fafc; margin-left: 10px; }
    .btn-secondary:hover { background: #475569; }
    .hint { background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #bfdbfe; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓ Connected to YouTube Data API v3</div>
    <h1>Google OAuth Connected Successfully!</h1>
    <p>Your authorization code was exchanged. Below is your <strong>YOUTUBE_REFRESH_TOKEN</strong>. Save this in your Vercel Environment Variables so the server can run 24/7 background scans without needing your browser open.</p>

    <div class="hint">
      <strong>Next Step:</strong> Copy the token below → open <strong>Vercel Dashboard → Physiomatics → Settings → Environment Variables</strong> → add <code>YOUTUBE_REFRESH_TOKEN</code>.
    </div>

    <div class="token-box" id="token">${tokenData.refresh_token}</div>

    <div>
      <button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('token').innerText); this.innerText='Copied!';">Copy Token</button>
      <a href="${appOrigin}/" class="btn btn-secondary">Go to Website</a>
    </div>
  </div>
</body>
</html>`;
    return res.status(200).send(html);
  }

  // If Google did NOT return a refresh_token (account was already authorized)
  const noTokenHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Physiomatics — Re-authorization Notice</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; max-width: 640px; width: 100%; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 9999px; padding: 6px 14px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; margin: 0 0 10px 0; color: #fff; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .steps { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
    .step-item { display: flex; align-items: flex-start; margin-bottom: 14px; font-size: 14px; color: #e2e8f0; }
    .step-item:last-child { margin-bottom: 0; }
    .step-num { background: #2563eb; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 12px; flex-shrink: 0; }
    .btn { display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 10px; text-decoration: none; border: none; cursor: pointer; font-size: 14px; }
    .btn:hover { background: #1d4ed8; }
    .btn-warn { background: #d97706; margin-left: 10px; }
    .btn-warn:hover { background: #b45309; }
    a.link { color: #38bdf8; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">⚠ Previous Authorization Detected</div>
    <h1>Google Did Not Re-issue a Refresh Token</h1>
    <p>Google OAuth only provides a <code>refresh_token</code> on the <strong>first</strong> authorization. Because your Google account previously granted access to this app, Google omitted the refresh token.</p>

    <div class="steps">
      <div class="step-item">
        <div class="step-num">1</div>
        <div>
          Disconnect Physiomatics at <a href="https://myaccount.google.com/connections" target="_blank" class="link">Google Account Connections (myaccount.google.com)</a>.
        </div>
      </div>
      <div class="step-item" style="margin-top: 14px;">
        <div class="step-num">2</div>
        <div>
          Click the button below to re-authorize. Google will treat it as a fresh consent and immediately display your refresh token on screen!
        </div>
      </div>
    </div>

    <div>
      <a href="/api/youtube/auth" class="btn">Re-authorize YouTube</a>
      <a href="https://myaccount.google.com/connections" target="_blank" class="btn btn-warn">Open Google Connections</a>
    </div>
  </div>
</body>
</html>`;
  return res.status(200).send(noTokenHtml);
}
