# Physiomatics Email Template Assets

This directory contains the visual branding assets used across the Physiomatics email marketing and lead generation templates.

## Asset Inventory

| Files | Description | Purpose |
|---|---|---|
| `template-1-header.png` through `template-5-header.png` | Sharpened 1200px-wide header artwork cropped from the supplied reference sheet | Email headers displayed at 600px for high-density screens |
| `template-1-footer.png` through `template-5-footer.png` | Footer artwork retained as unused reference assets | Not embedded in emails; the HTML footer carries contact details and links |
| `header-banner.png`, `header-banner-purple.png`, `footer-banner.png` | Existing compatibility aliases | Shared preview/deployment URLs |
| `logo.png` | Official Physiomatics brand emblem and typography | Primary brand mark |

The six emails use numbered header artwork only. Template 6 reuses header 3. Graphic footer banners are deliberately not embedded in email templates.

## Dual Delivery Architecture

1. **Local Previews:** Loaded via relative paths (`./assets/...`) or base64 data URIs.
2. **Production Emails:** Also deployed to `public/email-assets/` so they are accessible via HTTPS at:
   - `https://physiomatics.vercel.app/email-assets/template-1-header.png` through `template-5-header.png`
   - `https://physiomatics.vercel.app/email-assets/header-banner.png` (compatibility alias)
   - `https://physiomatics.vercel.app/email-assets/logo.png`

## Bulletproof Fallback
All templates implement table-based layouts with HTML background colors (`#0f766e`, `#042f2e`) and live HTML text overlay. If an email client blocks images by default (such as Microsoft Outlook or Gmail "Ask before displaying external images"), all brand titles, slogans, contact numbers, and CTAs remain 100% legible.
