// Set a real WhatsApp business number (digits only, with country code) to route chats directly.
export const WHATSAPP_NUMBER = "";

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
  { to: "/platform", label: "Exercise Training", desc: "Guided, prescribed exercise programs." },
  { to: "/platform", label: "Progress Monitoring", desc: "Compare sessions over time." },
  { to: "/platform", label: "Physiotherapist Review", desc: "Oversight of shared recordings and metrics." },
] as const;

export const solutionsMenu = [
  { to: "/solutions", label: "Elderly Care", desc: "Large controls, seated exercises, caregiver support." },
  { to: "/solutions", label: "Injury Rehabilitation", desc: "Structured home programs between visits." },
  { to: "/solutions", label: "Physiotherapy Clinics", desc: "Visibility into home-exercise performance." },
  { to: "/solutions", label: "Physiotherapy Education", desc: "Movement analysis for teaching." },
] as const;
