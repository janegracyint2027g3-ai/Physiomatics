// Set a real WhatsApp business number (digits only, with country code) to route chats directly.
export const WHATSAPP_NUMBER = "917845072426";
export const PHONE_NUMBER_DISPLAY = "+91 78450 72426";
export const PHONE_NUMBER_RAW = "7845072426";
export const PHONE_TEL = "tel:+917845072426";
export const YOUTUBE_URL = "https://www.youtube.com/@JaneGracyDavid";
export const LINKEDIN_URL = "https://www.linkedin.com/company/143995162/admin/";

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

export interface MenuItem {
  to: string;
  label: string;
  desc: string;
  tag?: string;
  icon?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  description?: string;
  items: readonly MenuItem[];
}

export const platformMenu: readonly MenuItem[] = [
  { to: "/analyze", label: "AI Video Analytics", desc: "Pose detection, joint angles & real-time repetitions.", tag: "COMPUTER VISION", icon: "ScanLine" },
  { to: "/platform/training", label: "Physiotherapy Training", desc: "Guided, prescribed exercise programs & form validation.", tag: "BIO-KINEMATICS", icon: "Activity" },
  { to: "/platform/movement", label: "Movement Analysis", desc: "Detailed angular insights into functional recovery.", tag: "DIAGNOSTICS", icon: "Gauge" },
  { to: "/platform/progress", label: "Progress Monitoring", desc: "Longitudinal recovery charts & compliance velocity.", tag: "TELEMETRY", icon: "LineChart" },
  { to: "/platform/dashboard", label: "Physiotherapist Dashboard", desc: "Oversight of shared patient recordings and clinical metrics.", tag: "CLINICAL PORTAL", icon: "BarChart3" },
];

export const icpCategories: readonly MenuCategory[] = [
  {
    id: "clinical",
    label: "Clinical & Enterprise",
    description: "Healthcare organizations, clinics and solo therapists",
    items: [
      { to: "/icp/clinics", label: "Physiotherapy Clinics", desc: "For practice owners & clinical directors seeking remote adherence.", tag: "PRACTICE SCALING", icon: "Building2" },
      { to: "/icp/physiotherapists", label: "Solo & Private PTs", desc: "For private practitioners wanting objective bio-angle validation.", tag: "PRIVATE CONSULTING", icon: "Stethoscope" },
    ],
  },
  {
    id: "recovery",
    label: "Patient & Recovery",
    description: "Patients recovering from surgery and injuries",
    items: [
      { to: "/icp/rehab-patients", label: "Post-Op & Rehab Patients", desc: "For recovering individuals needing real-time visual form guidance.", tag: "GUIDED REHAB", icon: "UserCheck" },
      { to: "/icp/elderly-care", label: "Elderly Care & Fall Prevention", desc: "For seniors & geriatric physical therapists focusing on mobility.", tag: "GERIATRIC SAFETY", icon: "HeartHandshake" },
      { to: "/icp/caregivers", label: "Family & Professional Caregivers", desc: "For dedicated caregivers managing home recovery routines.", tag: "HOME SUPPORT", icon: "Users" },
    ],
  },
  {
    id: "athletic",
    label: "Sports & Performance",
    description: "Athletic teams, academies and training coaches",
    items: [
      { to: "/icp/sports-academies", label: "Athletic & Sports Academies", desc: "For coaches optimizing kinematic symmetry & return-to-play.", tag: "PERFORMANCE AI", icon: "Trophy" },
    ],
  },
];

export const icpMenu: readonly MenuItem[] = [
  { to: "/icp/clinics", label: "Physiotherapy Clinics & Practices", desc: "For practice owners & clinical directors seeking remote patient adherence.", tag: "PRACTICE SCALING", icon: "Building2" },
  { to: "/icp/physiotherapists", label: "Independent Physiotherapists", desc: "For private practitioners wanting objective bio-angle validation.", tag: "PRIVATE CONSULTING", icon: "Stethoscope" },
  { to: "/icp/rehab-patients", label: "Post-Operative & Rehab Patients", desc: "For recovering individuals needing real-time visual form guidance.", tag: "GUIDED REHAB", icon: "UserCheck" },
  { to: "/icp/elderly-care", label: "Elderly Care & Fall Prevention", desc: "For seniors & geriatric physical therapists focusing on safe mobility.", tag: "GERIATRIC SAFETY", icon: "HeartHandshake" },
  { to: "/icp/caregivers", label: "Family & Professional Caregivers", desc: "For dedicated caregivers managing home recovery routines.", tag: "HOME SUPPORT", icon: "Users" },
  { to: "/icp/sports-academies", label: "Athletic & Sports Academies", desc: "For trainers & athletes optimizing kinematic performance & recovery.", tag: "PERFORMANCE AI", icon: "Trophy" },
];

export const solutionsCategories: readonly MenuCategory[] = [
  {
    id: "clinical-disciplines",
    label: "Physiotherapy Specialties",
    description: "Evidence-informed rehabilitation programs across primary clinical disciplines",
    items: [
      { to: "/solutions/orthopedic-physiotherapy", label: "Orthopedic Physiotherapy", desc: "Joint mobility, post-op recovery, and musculoskeletal pain.", tag: "ORTHOPEDIC", icon: "Bandage" },
      { to: "/solutions/neurological-physiotherapy", label: "Neurological Physiotherapy", desc: "Motor relearning, balance, and post-stroke gait retraining.", tag: "NEURO-REHAB", icon: "Activity" },
      { to: "/solutions/sports-physiotherapy", label: "Sports Physiotherapy", desc: "Athletic injuries, progressive loading, and return-to-sport criteria.", tag: "ATHLETIC", icon: "Trophy" },
      { to: "/solutions/geriatric-physiotherapy", label: "Geriatric Physiotherapy", desc: "Fall prevention, seated mobility, and senior independence.", tag: "GERIATRIC", icon: "HeartHandshake" },
      { to: "/solutions/cardiorespiratory-physiotherapy", label: "Cardiorespiratory Physiotherapy", desc: "Breathing mechanics, airway clearance, and exercise tolerance.", tag: "PULMONARY", icon: "Gauge" },
      { to: "/solutions/posture-spinal-physiotherapy", label: "Posture and Spinal Physiotherapy", desc: "Neck discomfort, back pain, and core stabilization.", tag: "SPINE & CORE", icon: "Layers" },
      { to: "/solutions/pediatric-physiotherapy", label: "Pediatric Physiotherapy", desc: "Gross motor milestones and play-based functional therapy.", tag: "PEDIATRIC", icon: "Users" },
      { to: "/solutions/womens-health-physiotherapy", label: "Women's Health Physiotherapy", desc: "Pelvic floor rehabilitation, pre/postnatal and core recovery.", tag: "PELVIC HEALTH", icon: "UserCheck" },
    ],
  },
  {
    id: "delivery-models",
    label: "Care Settings & Populations",
    description: "Rehabilitation delivery models for organizations, caregivers, and clinics",
    items: [
      { to: "/solutions/elderly", label: "Elderly Care & Fall Prevention", desc: "Large controls, seated exercises, and fall risk prevention.", tag: "SENIOR HEALTH", icon: "HeartHandshake" },
      { to: "/solutions/rehab", label: "Injury Rehabilitation", desc: "Structured home programs between clinical visits.", tag: "POST-OP", icon: "Bandage" },
      { to: "/solutions/caregiver", label: "Caregiver Support", desc: "Resources and visual guidance for family members.", tag: "FAMILY AID", icon: "Users" },
      { to: "/solutions/clinics", label: "Physiotherapy Clinics", desc: "Visibility into home-exercise performance and adherence.", tag: "CLINICAL OPS", icon: "Building2" },
      { to: "/solutions/education", label: "Physiotherapy Education", desc: "Movement analysis and anatomical mechanics for teaching.", tag: "ACADEMIC LAB", icon: "GraduationCap" },
    ],
  },
];

export const solutionsMenu: readonly MenuItem[] = [
  { to: "/solutions/orthopedic-physiotherapy", label: "Orthopedic Physiotherapy", desc: "Joint mobility & post-op protocols.", tag: "ORTHOPEDIC", icon: "Bandage" },
  { to: "/solutions/neurological-physiotherapy", label: "Neurological Physiotherapy", desc: "Gait retraining & balance control.", tag: "NEURO-REHAB", icon: "Activity" },
  { to: "/solutions/sports-physiotherapy", label: "Sports Physiotherapy", desc: "Athletic return-to-sport criteria.", tag: "ATHLETIC", icon: "Trophy" },
  { to: "/solutions/geriatric-physiotherapy", label: "Geriatric Physiotherapy", desc: "Fall-prevention & senior mobility.", tag: "GERIATRIC", icon: "HeartHandshake" },
  { to: "/solutions/cardiorespiratory-physiotherapy", label: "Cardiorespiratory Physiotherapy", desc: "Breathing retraining & stamina.", tag: "PULMONARY", icon: "Gauge" },
  { to: "/solutions/posture-spinal-physiotherapy", label: "Posture & Spinal Physiotherapy", desc: "Neck, back & ergonomic care.", tag: "SPINE & CORE", icon: "Layers" },
  { to: "/solutions/pediatric-physiotherapy", label: "Pediatric Physiotherapy", desc: "Play-based motor milestones.", tag: "PEDIATRIC", icon: "Users" },
  { to: "/solutions/womens-health-physiotherapy", label: "Women's Health Physiotherapy", desc: "Pelvic floor & pre/postnatal.", tag: "PELVIC HEALTH", icon: "UserCheck" },
];

export const resourcesMenu: readonly MenuItem[] = [
  { to: "/resources/library", label: "Exercise Library", desc: "Browse prescribed movements & video demos.", tag: "GUIDELINES", icon: "BookOpen" },
  { to: "/resources/rehab", label: "Rehabilitation Guides", desc: "Step-by-step recovery plans & protocols.", tag: "PROTOCOLS", icon: "FileText" },
  { to: "/resources/anatomy", label: "Anatomy & Biomechanics", desc: "Understand your joint mechanics and vectors.", tag: "EDUCATION", icon: "Layers" },
  { to: "/resources/faqs", label: "Help Center & FAQs", desc: "Frequently asked technical & clinical questions.", tag: "SUPPORT", icon: "HelpCircle" },
];

export const howItWorksMenu: readonly MenuItem[] = [
  { to: "/how-it-works/workflow", label: "Workflow Overview", desc: "See the end-to-end patient & clinician flow.", tag: "EXPERIENCE", icon: "Workflow" },
  { to: "/how-it-works/vision", label: "Computer Vision", desc: "How on-device MediaPipe pose estimation works.", tag: "ALGORITHMS", icon: "Eye" },
  { to: "/how-it-works/privacy", label: "Zero-Cloud Data Privacy", desc: "Why patient videos never touch our servers.", tag: "SECURITY", icon: "ShieldCheck" },
];

export const aboutMenu: readonly MenuItem[] = [
  { to: "/about/mission", label: "Our Mission", desc: "Bridging the clinic-to-home recovery gap.", tag: "PURPOSE", icon: "Target" },
  { to: "/about/team", label: "Clinical & AI Team", desc: "Physiotherapists & computer vision engineers.", tag: "LEADERSHIP", icon: "Users" },
  { to: "/about/careers", label: "Careers", desc: "Join our team pioneering computer-vision health.", tag: "HIRING", icon: "Sparkles" },
];

export const contactMenu: readonly MenuItem[] = [
  { to: "/book", label: "Book a Consultation", desc: "5-step booking wizard — select your consultation type and schedule.", tag: "APPOINTMENT BOOKING", icon: "CalendarCheck2" },
  { to: "/contact/demo", label: "Book a Demo", desc: "Get an interactive guided tour with our specialists.", tag: "LIVE WALKTHROUGH", icon: "Calendar" },
  { to: "/contact/enquiry", label: "Quick Enquiry", desc: "Send an instant inquiry to our product team.", tag: "DIRECT INQUIRY", icon: "Mail" },
  { to: "/contact/consultation", label: "Clinical Consultation", desc: "Detailed integration & deployment discussion.", tag: "SPECIALIST REVIEW", icon: "Stethoscope" },
];
