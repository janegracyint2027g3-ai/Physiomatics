# PHYSIOMATICS — LEAD-GENERATING EMAIL TEMPLATE SYSTEM

**Live Website:** [https://physiomatics.vercel.app/](https://physiomatics.vercel.app/)  
**Brand:** Physiomatics  
**Primary Slogan:** *Move Better. Recover Smarter.*  
**Extended Slogan:** *Move Better. Recover Smarter. Age Stronger.*  
**Supporting Line:** *Physiotherapy · Rehabilitation · AI-Powered Insights*  

---

## 1. Directory Structure

```text
email-templates/
├── assets/
│   ├── header-banner.png      # 1920×1080 retina clinical physiotherapy session visual
│   ├── footer-banner.png      # 1920×1080 retina deep teal kinetic vector wave
│   ├── logo.png               # High-resolution brand mark
│   └── README.md              # Asset specs & dual delivery guide
├── welcome.html               # Template 1: Welcome & Onboarding
├── advertising.html           # Template 2: Platform Promotion & Benefit Spotlight
├── business-value.html        # Template 3: Clinic & Healthcare Value Proposition
├── reengagement.html          # Template 4: Respectful Lead & Inactive Contact Follow-up
├── lead-generation.html       # Template 5: Demo & Consultation Conversion
├── products-features.html     # Template 6: 5 Verified Capabilities Deep-Dive
├── shared/
│   ├── brand-config.js        # Universal config & safe placeholder substitution renderer
│   └── email-styles.css       # Master email client resets & responsive tokens
├── preview/
│   └── index.html             # Interactive preview app (desktop/mobile/image-blocking test)
└── README.md                  # System documentation & Vercel deployment guide
```

---

## 2. Template Inventory & Strategic Objectives

| # | File | Subject Line | Target Audience | Primary Conversion Goal |
|---|---|---|---|---|
| **1** | `welcome.html` | Welcome to Physiomatics — Let's Move Forward Together! | New website enquiries, newsletter subscribers & opted-in contacts | Platform exploration & direct WhatsApp connection |
| **2** | `advertising.html` | Discover a Smarter Approach to Physiotherapy | Opted-in healthcare professionals, solo PTs & clinic directors | Test-drive browser video analytics & submit an inquiry |
| **3** | `business-value.html` | Explore New Possibilities for Your Physiotherapy Practice | Hospital administrators, clinic owners & practice directors | Schedule a clinical walkthrough & discuss practice requirements |
| **4** | `reengagement.html` | Ready to Revisit Physiomatics, {{name}}? | Inactive leads, past demo requesters & contacts due for follow-up | Revisit platform features & reply via low-friction WhatsApp |
| **5** | `lead-generation.html` | Let's Explore Your Physiotherapy Technology Needs | High-intent prospective partners, clinics & sports academies | Direct demo booking (`/contact/demo`) & consultation lead capture |
| **6** | `products-features.html` | Explore Physiomatics — Movement Insights and More | Evaluators interested in technical goniometry & data privacy | Explore live features, review privacy specs & submit requirements |

---

## 3. Official Verified Branding & Contact Links

All templates strictly enforce the verified project metadata:

* **Official Website:** [https://physiomatics.vercel.app](https://physiomatics.vercel.app)
* **Phone Direct:** `+91 78450 72426` (`tel:+917845072426`)
* **WhatsApp Business:** [https://wa.me/917845072426](https://wa.me/917845072426)
* **Official YouTube:** [https://www.youtube.com/@JaneGracyDavid](https://www.youtube.com/@JaneGracyDavid)
* **Public LinkedIn:** [https://www.linkedin.com/company/143995162/](https://www.linkedin.com/company/143995162/) *(Public company page without administrative path)*
* **Contact Email:** `janegracy.int2027g3@gmail.com`
* **Privacy Policy:** [https://physiomatics.vercel.app/privacy](https://physiomatics.vercel.app/privacy)
* **Terms of Use:** [https://physiomatics.vercel.app/terms](https://physiomatics.vercel.app/terms)
* **Demo Booking:** [https://physiomatics.vercel.app/contact/demo](https://physiomatics.vercel.app/contact/demo)
* **Consultation Booking:** [https://physiomatics.vercel.app/contact/consultation](https://physiomatics.vercel.app/contact/consultation)

---

## 4. Personalization Placeholders Reference

Every template supports safe, double-brace placeholder substitution. If a field is omitted, `shared/brand-config.js` injects sensible clinical defaults so raw tokens are never exposed to recipients:

| Token | Description | Example Replacement |
|---|---|---|
| `{{name}}` | Recipient First/Full Name | `Dr. Jane Gracy` |
| `{{email}}` | Recipient Email Address | `doctor@example.com` |
| `{{organization}}` | Practice / Hospital Name | `Apex Rehabilitation Clinic` |
| `{{role}}` | Professional Title | `Chief Physical Therapist` |
| `{{interest}}` | Topic of expressed interest | `AI Video Movement Analysis` |
| `{{website_url}}` | Base Website URL | `https://physiomatics.vercel.app` |
| `{{platform_url}}` | Live In-Browser Video Analytics | `https://physiomatics.vercel.app/analyze` |
| `{{demo_url}}` | Demo Booking Page | `https://physiomatics.vercel.app/contact/demo` |
| `{{contact_url}}` | Contact / Enquiry Page | `https://physiomatics.vercel.app/contact/enquiry` |
| `{{whatsapp_url}}` | Pre-configured WhatsApp Link | `https://wa.me/917845072426` |
| `{{youtube_url}}` | Official YouTube Channel | `https://www.youtube.com/@JaneGracyDavid` |
| `{{linkedin_url}}` | Public LinkedIn Profile | `https://www.linkedin.com/company/143995162/` |
| `{{privacy_url}}` | Legal Privacy Policy | `https://physiomatics.vercel.app/privacy` |
| `{{unsubscribe_url}}`| Unsubscribe Request Handler | `https://physiomatics.vercel.app/contact/enquiry?action=unsubscribe` |

---

## 5. How to Preview and Test Locally

1. Open `email-templates/preview/index.html` directly in any web browser, or serve the project with `npm run dev`.
2. Navigate between all 6 templates using the top navigation bar.
3. Switch viewports between **Desktop (640px)** and **Mobile (390px simulated smartphone)** to verify responsive collapse.
4. Click **Simulate Images Blocked** to inspect how the email renders when external images are turned off in Microsoft Outlook or Apple Mail. Notice how the logo text, slogans, contact numbers, feature cards, and CTAs remain completely crisp and legible.
5. Edit the values under **Live Placeholders Test** in the right-hand panel to see real-time updates.
6. Click **Copy HTML Code** to copy the rendered email ready for sending.

---

## 6. Architecture & Future Vercel Integration

The email templates are designed for seamless dispatch via the existing Vercel Serverless Function architecture (`api/cron/reports.ts` or a new endpoint such as `api/marketing/send.ts`).

### Recommended Dispatch Flow:
```text
Lead Trigger / Admin Dispatch
       │
       ▼
Vercel API Route (/api/email/send)
  ├── 1. Verify Authorization (CRON_SECRET / Admin Token)
  ├── 2. Load Template HTML (e.g., welcome.html or lead-generation.html)
  ├── 3. Merge Variables via shared/brand-config.js (renderTemplate)
  ├── 4. Dispatch Email via Nodemailer (Gmail SMTP using existing SMTP_USER & SMTP_PASS)
  ├── 5. Log Message ID & Delivery Status
  └── 6. Optional: Sync Activity to Lead_Management / Jira PHY Task
```

### Zero Disruption Guarantee
* Existing lead capture forms (`public.leads` Supabase, Google Sheets, Airtable, Telegram, and Jira) remain 100% untouched.
* The email library is strictly modular and standalone.
