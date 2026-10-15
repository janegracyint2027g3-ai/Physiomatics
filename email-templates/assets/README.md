# Physiomatics Email Template Assets

This directory contains the visual branding assets used across the Physiomatics email marketing and lead generation templates.

## Asset Inventory

| File | Resolution | Description | Purpose |
|---|---|---|---|
| `header-banner.png` | 1920 × 1080 (Retina 600px display) | Modern clinical physiotherapy session with subtle kinematic joint vectors, pale mint & white medical tones | Email header hero visual |
| `footer-banner.png` | 1920 × 1080 (Retina 600px display) | Deep teal and midnight gradient with biomechanical particle waves | Email footer visual background |
| `logo.png` | Official High-Resolution Logo | Official Physiomatics brand emblem and typography | Primary brand mark |

## Dual Delivery Architecture

1. **Local Previews:** Loaded via relative paths (`./assets/...`) or base64 data URIs.
2. **Production Emails:** Also deployed to `public/email-assets/` so they are accessible via HTTPS at:
   - `https://physiomatics.vercel.app/email-assets/header-banner.png`
   - `https://physiomatics.vercel.app/email-assets/footer-banner.png`
   - `https://physiomatics.vercel.app/email-assets/logo.png`

## Bulletproof Fallback
All templates implement table-based layouts with HTML background colors (`#0f766e`, `#042f2e`) and live HTML text overlay. If an email client blocks images by default (such as Microsoft Outlook or Gmail "Ask before displaying external images"), all brand titles, slogans, contact numbers, and CTAs remain 100% legible.
