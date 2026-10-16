/**
 * PHYSIOMATICS — SHARED EMAIL BRAND CONFIGURATION & TEMPLATE RENDERER
 * 
 * Centralized, verifiable brand metadata and URL configuration used across all 
 * 6 lead-generating email templates and local preview systems.
 * 
 * Works as both an ES Module, CommonJS module, and browser global script.
 */

const BRAND_CONFIG = {
  brand: {
    name: "Physiomatics",
    tagline: "Move Better. Recover Smarter.",
    extendedTagline: "Move Better. Recover Smarter. Age Stronger.",
    supportingLine: "Physiotherapy · Rehabilitation · AI-Powered Insights",
    logoUrl: "https://physiomatics.vercel.app/email-assets/logo.png",
    localLogoUrl: "../assets/logo.png",
    headerBannerUrl: "https://physiomatics.vercel.app/email-assets/header-banner-purple.png",
    localHeaderBannerUrl: "../assets/header-banner-purple.png",
    footerBannerUrl: "https://physiomatics.vercel.app/email-assets/footer-banner.png",
    localFooterBannerUrl: "../assets/footer-banner.png",
  },

  contact: {
    email: "janegracy.int2027g3@gmail.com",
    phoneDisplay: "+91 78450 72426",
    phoneTel: "tel:+917845072426",
    whatsappNumber: "917845072426",
    whatsappUrl: "https://wa.me/917845072426",
    youtubeUrl: "https://www.youtube.com/@JaneGracyDavid",
    // Public-facing company page without administrative path
    linkedinUrl: "https://www.linkedin.com/company/143995162/",
  },

  urls: {
    website: "https://physiomatics.vercel.app",
    platform: "https://physiomatics.vercel.app/analyze",
    demo: "https://physiomatics.vercel.app/contact/demo",
    consultation: "https://physiomatics.vercel.app/contact/consultation",
    enquiry: "https://physiomatics.vercel.app/contact/enquiry",
    booking: "https://physiomatics.vercel.app/book",
    clinics: "https://physiomatics.vercel.app/solutions/clinics",
    elderly: "https://physiomatics.vercel.app/solutions/elderly",
    rehab: "https://physiomatics.vercel.app/solutions/rehab",
    sports: "https://physiomatics.vercel.app/icp/sports-academies",
    workflow: "https://physiomatics.vercel.app/how-it-works/workflow",
    privacy: "https://physiomatics.vercel.app/privacy",
    terms: "https://physiomatics.vercel.app/terms",
    unsubscribe: "https://physiomatics.vercel.app/contact/enquiry?action=unsubscribe",
  },

  colors: {
    primaryPurple: "#7c3aed",
    darkPurple: "#6d28d9",
    deepIndigo: "#1e1b4b",
    lightPurpleBg: "#f5f3ff",
    purpleBorder: "#e9d5ff",
    primaryTeal: "#0d9488",
    darkTeal: "#0f766e",
    bodyText: "#334155",
    mutedText: "#64748b",
    borderGray: "#e2e8f0",
    bgLight: "#f8fafc",
    whatsappGreen: "#25D366",
  },

  defaultPlaceholders: {
    name: "Doctor / Healthcare Partner",
    email: "janegracy2005@gmail.com",
    organization: "Physiotherapy & Rehabilitation Practice",
    role: "Clinical Director",
    interest: "AI Video Movement Analysis & Remote Adherence",
    website_url: "https://physiomatics.vercel.app",
    contact_url: "https://physiomatics.vercel.app/contact/enquiry",
    demo_url: "https://physiomatics.vercel.app/contact/demo",
    platform_url: "https://physiomatics.vercel.app/analyze",
    whatsapp_url: "https://wa.me/917845072426",
    youtube_url: "https://www.youtube.com/@JaneGracyDavid",
    linkedin_url: "https://www.linkedin.com/company/143995162/",
    privacy_url: "https://physiomatics.vercel.app/privacy",
    unsubscribe_url: "https://physiomatics.vercel.app/contact/enquiry?action=unsubscribe",
  },

  /**
   * Safely merges placeholder dictionary and replaces all {{field}} tokens in HTML.
   * Warns or alerts if any unhandled placeholders remain.
   */
  renderTemplate: function (htmlContent, customVariables = {}) {
    const merged = { ...BRAND_CONFIG.defaultPlaceholders, ...customVariables };
    
    // Replace explicit keys
    let rendered = htmlContent;
    Object.keys(merged).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      rendered = rendered.replace(regex, merged[key]);
    });

    // Check for any leftover {{...}} placeholders
    const leftoverMatches = rendered.match(/{{\s*[\w_]+\s*}}/g);
    if (leftoverMatches && leftoverMatches.length > 0) {
      console.warn("[BrandConfig/Renderer] Warning: Unresolved placeholders detected in email output:", leftoverMatches);
    }

    return rendered;
  }
};

// Universal export pattern
if (typeof module !== "undefined" && module.exports) {
  module.exports = BRAND_CONFIG;
}
if (typeof window !== "undefined") {
  window.BRAND_CONFIG = BRAND_CONFIG;
}
