// Set a real WhatsApp business number (digits only, with country code) to route chats directly.
export const WHATSAPP_NUMBER = "919876543210";

export function whatsappLink(message: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  general: "Hello Physiomatics, I'd like to learn more about the platform.",
  demo: "Hello Physiomatics, I'd like to book a demo of the platform.",
  clinic: "Hello Physiomatics, I'm a physiotherapist interested in video analytics for my patients.",
  elderly: "Hello Physiomatics, I'm looking for guided exercise support for an elderly family member.",
  rehab: "Hello Physiomatics, I'm recovering from an injury and want to learn about rehabilitation monitoring.",
  education: "Hello Physiomatics, I'm interested in Physiomatics for physiotherapy education.",
};

export const platformMenu = [
  { to: "/analyze", label: "AI Video Analytics", desc: "Pose detection, joint angles and repetitions from a video." },
  { to: "/platform/training", label: "Physiotherapy Training", desc: "Guided, prescribed exercise programs." },
  { to: "/platform/movement", label: "Movement Analysis", desc: "Detailed insights into your recovery." },
  { to: "/platform/progress", label: "Progress Monitoring", desc: "Compare sessions over time." },
  { to: "/platform/dashboard", label: "Physiotherapist Dashboard", desc: "Oversight of shared recordings and metrics." },
] as const;

export const icpMenu = [
  { to: "/icp/clinics", label: "Physiotherapy Clinics & Practices", desc: "For practice owners & clinical directors seeking remote patient adherence." },
  { to: "/icp/physiotherapists", label: "Independent Physiotherapists", desc: "For private practitioners wanting objective bio-angle validation." },
  { to: "/icp/rehab-patients", label: "Post-Operative & Rehab Patients", desc: "For recovering individuals needing real-time visual form guidance." },
  { to: "/icp/elderly-care", label: "Elderly Care & Fall Prevention", desc: "For seniors & geriatric physical therapists focusing on safe mobility." },
  { to: "/icp/caregivers", label: "Family & Professional Caregivers", desc: "For dedicated caregivers managing home recovery routines." },
  { to: "/icp/sports-academies", label: "Athletic & Sports Academies", desc: "For trainers & athletes optimizing kinematic performance & recovery." },
] as const;

export const solutionsMenu = [
  { to: "/solutions/elderly", label: "Elderly Care", desc: "Large controls, seated exercises, caregiver support." },
  { to: "/solutions/rehab", label: "Injury Rehabilitation", desc: "Structured home programs between visits." },
  { to: "/solutions/clinics", label: "Physiotherapy Clinics", desc: "Visibility into home-exercise performance." },
  { to: "/solutions/caregiver", label: "Caregiver Support", desc: "Resources and monitoring for family members." },
  { to: "/solutions/education", label: "Physiotherapy Education", desc: "Movement analysis for teaching." },
] as const;

export const resourcesMenu = [
  { to: "/resources/library", label: "Exercise Library", desc: "Browse prescribed movements." },
  { to: "/resources/rehab", label: "Rehabilitation Guides", desc: "Step-by-step recovery plans." },
  { to: "/resources/anatomy", label: "Anatomy & Learning", desc: "Understand your body better." },
  { to: "/resources/faqs", label: "FAQs", desc: "Frequently asked questions." },
] as const;

export const howItWorksMenu = [
  { to: "/how-it-works/workflow", label: "Workflow Overview", desc: "See the entire platform flow." },
  { to: "/how-it-works/vision", label: "Computer Vision", desc: "How our AI works." },
  { to: "/how-it-works/privacy", label: "Data Privacy", desc: "How we protect your data." },
] as const;

export const aboutMenu = [
  { to: "/about/mission", label: "Our Mission", desc: "Why we started Physiomatics." },
  { to: "/about/team", label: "Team", desc: "Meet the experts." },
  { to: "/about/careers", label: "Careers", desc: "Join our growing team." },
] as const;

export const contactMenu = [
  { to: "/contact/demo", label: "Book a Demo", desc: "Get a guided tour." },
  { to: "/contact/enquiry", label: "Quick Enquiry", desc: "Send a fast message." },
  { to: "/contact/consultation", label: "Consultation", desc: "Detailed discussion." },
] as const;
