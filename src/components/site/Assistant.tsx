import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { MessageCircle, X, Bot, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";
import { sendToGoogleSheet } from "@/lib/googleSheets";
import { trackClarityEvent, setClarityTag } from "@/lib/clarity";

// ─── Physiomatics knowledge base ────────────────────────────────────────────
// All answers the chatbot can give without a live AI API.
// Keys are arrays of trigger words/phrases; values are the reply.
const KB: { triggers: string[]; answer: string; links?: { label: string; to: string }[] }[] = [
  {
    triggers: ["what is physiomatics", "what does physiomatics do", "about physiomatics", "tell me about", "physiomatics"],
    answer: "Physiomatics is an AI-assisted physiotherapy training platform that uses computer-vision to detect body landmarks, measure joint angles and count repetitions — all from a recorded video. Clinics, caregivers and patients can monitor exercises remotely without expensive hardware.",
    links: [{ label: "How it works", to: "/how-it-works" }],
  },
  {
    triggers: ["how does it work", "how it works", "how does physiomatics work", "technology", "ai", "artificial intelligence"],
    answer: "Upload or record a short exercise video. Our AI detects 33 body landmarks in every frame, estimates joint angles (e.g. knee flexion), counts reps and flags abnormal movement patterns. Results are shown as a timeline and can be shared with a physiotherapist.",
    links: [{ label: "Try the analyser", to: "/analyze" }],
  },
  {
    triggers: ["pose", "analyze", "analyse", "video analysis", "video", "movement analysis"],
    answer: "The Pose Analyser accepts MP4 / WebM video files. It overlays a skeleton, shows per-frame joint angles and gives a rep count with confidence score. For best results, record from a consistent side angle with good lighting.",
    links: [{ label: "Open Pose Analyser", to: "/analyze" }],
  },
  {
    triggers: ["price", "pricing", "cost", "how much", "free", "paid", "subscription", "plan"],
    answer: "Physiomatics offers a free demo so you can explore the platform before committing. Pricing is tailored to clinic size and volume — book a consultation and we will send a custom proposal.",
    links: [{ label: "Book a consultation", to: "/contact" }],
  },
  {
    triggers: ["demo", "book a demo", "trial", "try", "test"],
    answer: "Book a free 30-minute demo and we will walk you through the platform live. You can also try the Pose Analyser immediately with no sign-up.",
    links: [{ label: "Book demo", to: "/contact" }, { label: "Try analyser now", to: "/analyze" }],
  },
  {
    triggers: ["physiotherapist", "physiotherapy", "clinic", "clinician", "therapist", "pt"],
    answer: "For physiotherapists, Physiomatics means you can review patient home-exercise videos asynchronously, compare sessions week-over-week, and flag patients who need in-person attention — saving hours of manual assessment.",
    links: [{ label: "Physiotherapist solutions", to: "/icp/physiotherapists" }],
  },
  {
    triggers: ["clinic", "hospital", "centre", "center", "facility"],
    answer: "Multi-clinician clinics use Physiomatics as a shared patient monitoring dashboard. Each patient's exercise history is stored, searchable and shareable across the care team.",
    links: [{ label: "Clinic solutions", to: "/icp/clinics" }],
  },
  {
    triggers: ["elderly", "older adult", "senior", "aged", "geriatric", "fall", "balance"],
    answer: "Physiomatics is designed with large, accessible controls for elderly users. It supports seated exercises such as seated knee extensions and shoulder raises. Family caregivers can monitor sessions remotely.",
    links: [{ label: "Elderly care solutions", to: "/icp/elderly-care" }],
  },
  {
    triggers: ["caregiver", "carer", "family", "home care", "parent", "relative"],
    answer: "Caregivers can set up an exercise plan from a physiotherapist's instructions, record a session and instantly see whether the prescribed range-of-motion was achieved — no clinical training required.",
    links: [{ label: "Caregiver solutions", to: "/icp/caregivers" }],
  },
  {
    triggers: ["rehab", "rehabilitation", "injury", "recovery", "post surgery", "post-surgery", "fracture", "knee", "shoulder", "hip", "back"],
    answer: "For rehabilitation patients, Physiomatics tracks your prescribed exercises, shows your improvement over sessions, and lets you share a progress report with your physiotherapist — all without extra clinic visits.",
    links: [{ label: "Rehab patient solutions", to: "/icp/rehab-patients" }],
  },
  {
    triggers: ["sports", "athlete", "academy", "performance", "coach", "training"],
    answer: "Sports academies use Physiomatics to monitor athlete movement quality at scale — checking squat depth, sprint biomechanics or throwing mechanics — and flag early injury risk before it becomes a problem.",
    links: [{ label: "Sports academy solutions", to: "/icp/sports-academies" }],
  },
  {
    triggers: ["privacy", "data", "gdpr", "hipaa", "secure", "security", "patient data", "confidential"],
    answer: "Physiomatics does not store identifiable patient medical records in analytics tools. Video analysis is performed locally in the browser — videos are not uploaded to a central server. Contact us for a full data-processing agreement.",
    links: [{ label: "Contact for DPA", to: "/contact" }],
  },
  {
    triggers: ["contact", "reach", "email", "phone", "whatsapp", "call", "speak", "talk", "linkedin", "youtube", "social"],
    answer: "You can reach us via:\n• 📞 Phone / WhatsApp: +91 78450 72426\n• 💬 WhatsApp chat on the Contact page\n• 💼 LinkedIn: linkedin.com/company/143995162\n• ▶️ YouTube: @JaneGracyDavid\n\nWe typically respond within one business day.",
    links: [{ label: "Contact page", to: "/contact" }],
  },
  {
    triggers: ["feedback", "suggestion", "improve", "feature request"],
    answer: "We love hearing from users! Share your suggestions on the Feedback page and our product team reviews every submission.",
    links: [{ label: "Give feedback", to: "/feedback" }],
  },
  {
    triggers: ["resource", "blog", "guide", "article", "learn", "research", "education"],
    answer: "The Resources section has guides on physiotherapy exercise principles, joint-angle benchmarks and tips for getting the best results from Physiomatics.",
    links: [{ label: "Resources", to: "/resources" }],
  },
  {
    triggers: ["integration", "ehr", "emr", "api", "connect", "plug", "system"],
    answer: "API and EHR integration is available for enterprise clinics. Book a consultation and our team will discuss your technical requirements.",
    links: [{ label: "Book consultation", to: "/contact" }],
  },
  {
    triggers: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste", "hai"],
    answer: "Hello! 👋 Welcome to Physiomatics. Ask me anything about the platform — pricing, features, who it's for, or how to get started.",
  },
  {
    triggers: ["thank", "thanks", "thank you", "cheers"],
    answer: "You're welcome! Is there anything else I can help you with? You can also reach us on WhatsApp anytime.",
  },
  {
    triggers: ["bye", "goodbye", "see you", "exit", "close"],
    answer: "Goodbye! Feel free to come back anytime. You can also reach us on WhatsApp for a faster response.",
  },
];

// ─── Helper: find the best KB match ─────────────────────────────────────────
function findAnswer(input: string): typeof KB[0] | null {
  const q = input.toLowerCase().trim();
  let best: typeof KB[0] | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    for (const trigger of entry.triggers) {
      if (q.includes(trigger)) {
        const score = trigger.length; // prefer longer, more specific matches
        if (score > bestScore) { best = entry; bestScore = score; }
      }
    }
  }
  return best;
}

// ─── Guided flow (button-based tree) ────────────────────────────────────────
type TreeNode = { text: string; options: { label: string; next?: string; to?: string; wa?: keyof typeof WA_MESSAGES }[] };
const tree: Record<string, TreeNode> = {
  start: {
    text: "Hi! I'm the Physiomatics AI guide. Ask me anything, or pick who you are:",
    options: [
      { label: "Physiotherapist / Clinic", next: "clinic" },
      { label: "Elderly care / Caregiver", next: "elderly" },
      { label: "Injury rehabilitation", next: "rehab" },
      { label: "Sports academy / Coach", next: "sports" },
      { label: "Pricing & demo", next: "pricing" },
    ],
  },
  clinic: {
    text: "Physiomatics lets clinics review home-exercise videos with AI landmark detection, measure joint angles, count reps and compare sessions over time — all remotely.",
    options: [{ label: "See clinic features", to: "/icp/clinics" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  elderly: {
    text: "Designed for older adults: large controls, simple interface, and seated exercise support. Family caregivers can monitor sessions from anywhere.",
    options: [{ label: "Elderly care page", to: "/icp/elderly-care" }, { label: "Caregiver page", to: "/icp/caregivers" }, { label: "Chat on WhatsApp", wa: "elderly" }],
  },
  rehab: {
    text: "Track prescribed exercises, monitor joint-angle progress over sessions, and share reports with your physiotherapist — no extra clinic visits needed.",
    options: [{ label: "Rehab patient page", to: "/icp/rehab-patients" }, { label: "Try the analyser", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "rehab" }],
  },
  sports: {
    text: "Monitor athlete movement quality at scale — squat depth, sprint biomechanics, throwing mechanics — and catch injury risk early.",
    options: [{ label: "Sports academy page", to: "/icp/sports-academies" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  pricing: {
    text: "Physiomatics offers a free demo. Pricing is customised by clinic size. Book a consultation and we'll send you a tailored proposal.",
    options: [{ label: "Book consultation", to: "/contact" }, { label: "Try analyser free", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  // ── Page-specific nodes (one per route) ──────────────────────────────────
  home: {
    text: "Welcome to Physiomatics! 👋 I can help you explore AI-assisted physiotherapy, find the right solution for your role, or book a demo. What brings you here today?",
    options: [{ label: "See how it works", to: "/how-it-works" }, { label: "Find my solution", next: "start" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  analyze: {
    text: "📹 You're on the Pose Analyser. Upload an exercise video and our AI detects body landmarks, measures joint angles and counts reps automatically. Need tips for the best recording setup?",
    options: [{ label: "Who is this for?", next: "clinic" }, { label: "Privacy & data", next: "pricing" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  how_it_works: {
    text: "🔬 Physiomatics uses MediaPipe to detect 33 body landmarks per frame, compute joint angles in real time and count exercise reps — all inside your browser. No data leaves your device during analysis.",
    options: [{ label: "See the workflow", to: "/how-it-works/workflow" }, { label: "Privacy details", to: "/how-it-works/privacy" }, { label: "Try it now", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  workflow: {
    text: "🔄 The Physiomatics workflow: Record exercise → Upload video → AI detects landmarks → Joint angles & reps computed → Report shared with physiotherapist. Simple, fast and private.",
    options: [{ label: "Try the analyser", to: "/analyze" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  vision: {
    text: "👁️ Our computer-vision engine runs fully in the browser using MediaPipe BlazePose. It identifies 33 skeletal landmarks to compute precise joint angles without needing a wearable device.",
    options: [{ label: "Try the analyser", to: "/analyze" }, { label: "How it works", to: "/how-it-works" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  privacy: {
    text: "🔒 Your videos are processed locally in the browser — they are never uploaded to a server. We don't store identifiable patient data in our analytics tools. A Data Processing Agreement is available for enterprise clients.",
    options: [{ label: "Contact for DPA", to: "/contact" }, { label: "Privacy policy", to: "/privacy" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  solutions: {
    text: "🩺 Physiomatics has tailored solutions for physiotherapy clinics, elderly care, home rehabilitation, sports academies, educators and caregivers. Which applies to you?",
    options: [{ label: "Physiotherapy clinics", to: "/solutions/clinics" }, { label: "Elderly care", to: "/solutions/elderly" }, { label: "Rehabilitation", to: "/solutions/rehab" }, { label: "Education", to: "/solutions/education" }],
  },
  solutions_clinics: {
    text: "🏥 Clinic solution: Review patient home-exercise videos remotely, compare session timelines, get rep & angle data per patient — and only call in the ones who need it. Scales from solo practitioners to multi-clinician centres.",
    options: [{ label: "ICP — Clinics", to: "/icp/clinics" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  solutions_elderly: {
    text: "👴 Elderly solution: Large on-screen controls, high-contrast UI and seated exercise support. Family members can watch recorded sessions from anywhere and share them with the care team.",
    options: [{ label: "Elderly care ICP", to: "/icp/elderly-care" }, { label: "Caregiver ICP", to: "/icp/caregivers" }, { label: "Chat on WhatsApp", wa: "elderly" }],
  },
  solutions_rehab: {
    text: "🦵 Rehabilitation solution: Upload prescribed exercise videos, track joint-angle recovery over weeks, and generate a shareable progress report for your physiotherapist — all from home.",
    options: [{ label: "Rehab patient ICP", to: "/icp/rehab-patients" }, { label: "Try the analyser", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "rehab" }],
  },
  solutions_caregiver: {
    text: "❤️ Caregiver solution: You don't need clinical training. Record a session, Physiomatics measures the range of motion and flags if the patient is meeting their physiotherapist's targets.",
    options: [{ label: "Caregiver ICP", to: "/icp/caregivers" }, { label: "Book a consultation", to: "/contact" }, { label: "Chat on WhatsApp", wa: "elderly" }],
  },
  solutions_education: {
    text: "🎓 Education solution: Use Physiomatics to demonstrate joint-angle concepts, biomechanics principles and movement analysis in real time with actual video — perfect for physiotherapy curriculum.",
    options: [{ label: "Resources", to: "/resources" }, { label: "Partner with us", to: "/contact" }, { label: "Chat on WhatsApp", wa: "education" }],
  },
  icp: {
    text: "🎯 Our Ideal Customer Profiles (ICPs) show you exactly how Physiomatics fits your specific role. Select yours for tailored content and a relevant case study.",
    options: [{ label: "Physiotherapists", to: "/icp/physiotherapists" }, { label: "Clinics", to: "/icp/clinics" }, { label: "Elderly care", to: "/icp/elderly-care" }, { label: "Sports academies", to: "/icp/sports-academies" }],
  },
  icp_physio: {
    text: "👨‍⚕️ For physiotherapists: Review home exercise videos asynchronously, see joint-angle timelines, and compare progress between sessions — saving hours of manual assessment each week.",
    options: [{ label: "Request free demo", to: "/contact" }, { label: "Try the analyser", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  icp_clinic: {
    text: "🏥 For clinics: A shared dashboard where every physiotherapist can monitor their patient caseloads, compare session histories and flag patients who need urgent in-person review.",
    options: [{ label: "Request clinic demo", to: "/contact" }, { label: "See pricing", next: "pricing" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  icp_caregivers: {
    text: "❤️ For caregivers: Record your loved one's exercises at home. Physiomatics measures whether they're hitting the physiotherapist's prescribed range of motion — no clinical expertise needed.",
    options: [{ label: "Request free demo", to: "/contact" }, { label: "Solutions for elderly", to: "/solutions/elderly" }, { label: "Chat on WhatsApp", wa: "elderly" }],
  },
  icp_elderly: {
    text: "👴 For elderly individuals: Simple, accessible interface with large buttons and high contrast. Seated exercises like knee extensions are fully supported. Family can monitor sessions remotely.",
    options: [{ label: "Request free demo", to: "/contact" }, { label: "Caregiver solution", to: "/icp/caregivers" }, { label: "Chat on WhatsApp", wa: "elderly" }],
  },
  icp_rehab: {
    text: "🦵 For rehabilitation patients: Track your recovery progress at home, see your joint angle improve week by week, and share a report with your physiotherapist — no extra clinic visits needed.",
    options: [{ label: "Request free demo", to: "/contact" }, { label: "Try the analyser", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "rehab" }],
  },
  icp_sports: {
    text: "🏃 For sports academies: Monitor multiple athletes' movement quality — squat mechanics, sprint posture, throwing biomechanics — flag injury risk early and track improvements across the season.",
    options: [{ label: "Request sports demo", to: "/contact" }, { label: "Try the analyser", to: "/analyze" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  platform: {
    text: "🖥️ The Physiomatics platform includes a Pose Analyser, Movement Tracker, Progress Dashboard and Training Library. Which would you like to explore?",
    options: [{ label: "Movement tracker", to: "/platform/movement" }, { label: "Progress dashboard", to: "/platform/progress" }, { label: "Training library", to: "/platform/training" }, { label: "Book a demo", to: "/contact" }],
  },
  platform_movement: {
    text: "🦴 The Movement Tracker analyses video frame-by-frame, identifies 33 skeletal landmarks, and computes joint angles over time so you can see how movement changes within a single session.",
    options: [{ label: "Try it live", to: "/analyze" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  platform_progress: {
    text: "📈 The Progress Dashboard shows how joint range of motion, rep count and confidence scores change session-over-session. Ideal for physiotherapists reviewing a patient's rehabilitation trajectory.",
    options: [{ label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  platform_training: {
    text: "📚 The Training Library contains guided exercise templates — each with target joint angles and rep targets — so patients always know exactly what their physiotherapist expects.",
    options: [{ label: "Resources", to: "/resources" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  platform_dashboard: {
    text: "📊 The Clinic Dashboard gives your whole team a single view of all active patients — latest session, progress trend and flags for anyone needing urgent review.",
    options: [{ label: "Book a clinic demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  resources: {
    text: "📖 The Resources section has clinical guides, FAQs, an anatomy reference and a rehab exercise library. What are you looking for?",
    options: [{ label: "FAQs", to: "/resources/faqs" }, { label: "Anatomy reference", to: "/resources/anatomy" }, { label: "Rehab exercise library", to: "/resources/rehab" }, { label: "Resource library", to: "/resources/library" }],
  },
  resources_faqs: {
    text: "❓ Can't find your answer in the FAQs? Ask me directly — I know Physiomatics inside out — or reach our team on WhatsApp.",
    options: [{ label: "Ask a question", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  resources_anatomy: {
    text: "🦴 The Anatomy Reference explains the joints and muscles Physiomatics tracks — hip, knee, ankle, shoulder, elbow and wrist — and what normal range-of-motion looks like for common exercises.",
    options: [{ label: "Try the analyser", to: "/analyze" }, { label: "Rehab library", to: "/resources/rehab" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  resources_rehab: {
    text: "🏋️ The Rehab Exercise Library has step-by-step guides for common prescribed exercises — knee extensions, shoulder circles, hip flexor stretches — each with the target angle range Physiomatics measures.",
    options: [{ label: "Try the analyser", to: "/analyze" }, { label: "Book a consultation", to: "/contact" }, { label: "Chat on WhatsApp", wa: "rehab" }],
  },
  resources_library: {
    text: "📂 The Resource Library has downloadable guides, research summaries and clinical templates for physiotherapists and educators using Physiomatics in practice.",
    options: [{ label: "Partner with us", to: "/contact" }, { label: "Chat on WhatsApp", wa: "education" }],
  },
  contact: {
    text: "📩 You're on the Contact page. Send a quick enquiry, book a detailed consultation, or connect via WhatsApp, phone (+91 78450 72426), LinkedIn or YouTube. How can we help?",
    options: [
      { label: "See pricing info", next: "pricing" },
      { label: "Chat on WhatsApp", wa: "general" },
      { label: "LinkedIn page", to: "/contact" },
      { label: "YouTube channel", to: "/contact" },
    ],
  },
  feedback: {
    text: "💬 Thanks for taking the time to give feedback! Our product team reads every message. You can also use the feedback form right here on this page.",
    options: [{ label: "Contact us", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  about: {
    text: "🏢 Physiomatics is building the next generation of remote physiotherapy monitoring — making clinical-grade movement analysis accessible to every patient, caregiver and clinic worldwide.",
    options: [{ label: "Our mission", to: "/about/mission" }, { label: "Meet the team", to: "/about/team" }, { label: "Careers", to: "/about/careers" }, { label: "Contact us", to: "/contact" }],
  },
  about_mission: {
    text: "🎯 Our mission: Democratise physiotherapy by giving every patient access to clinical-quality movement analysis — regardless of where they live or whether they can afford frequent clinic visits.",
    options: [{ label: "How we do it", to: "/how-it-works" }, { label: "Meet the team", to: "/about/team" }, { label: "Contact us", to: "/contact" }],
  },
  about_team: {
    text: "👥 The Physiomatics team combines expertise in computer vision, clinical physiotherapy and healthcare product design. We'd love to connect!",
    options: [{ label: "Contact the team", to: "/contact" }, { label: "Careers", to: "/about/careers" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  about_careers: {
    text: "💼 Interested in joining Physiomatics? We're always looking for people passionate about AI, healthcare and making a real impact on patients' lives.",
    options: [{ label: "Get in touch", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  blog: {
    text: "📝 Our blog covers AI in physiotherapy, clinical case studies, biomechanics research and product updates. Is there a topic you'd like to learn more about?",
    options: [{ label: "Resources", to: "/resources" }, { label: "Contact us", to: "/contact" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
  safety: {
    text: "⚠️ Safety reminder: Physiomatics is a monitoring and analysis tool only. It does not provide medical diagnoses. Always follow your physiotherapist's prescribed plan and stop any exercise that causes pain.",
    options: [{ label: "Contact a professional", to: "/contact" }, { label: "Privacy policy", to: "/privacy" }, { label: "Chat on WhatsApp", wa: "general" }],
  },
};

// ─── Message type ────────────────────────────────────────────────────────────
type Msg = { type: "user" | "bot"; text: string; links?: { label: string; to: string }[] };

export function Assistant() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [node, setNode] = useState("start");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [showTree, setShowTree] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Map every route to the correct chatbot node ───────────────────────────
  // Exact matches take priority; prefix matches are fallbacks.
  const PAGE_CONTEXT: { match: string | string[]; node: string; autoOpen?: boolean }[] = [
    // Home
    { match: "/",                          node: "home" },
    // Analyse
    { match: "/analyze",                   node: "analyze",          autoOpen: true },
    // How it works
    { match: "/how-it-works/workflow",     node: "workflow" },
    { match: "/how-it-works/vision",       node: "vision" },
    { match: "/how-it-works/privacy",      node: "privacy" },
    { match: "/how-it-works",              node: "how_it_works" },
    // Solutions
    { match: "/solutions/clinics",         node: "solutions_clinics" },
    { match: "/solutions/elderly",         node: "solutions_elderly", autoOpen: true },
    { match: "/solutions/rehab",           node: "solutions_rehab" },
    { match: "/solutions/caregiver",       node: "solutions_caregiver" },
    { match: "/solutions/education",       node: "solutions_education" },
    { match: "/solutions",                 node: "solutions" },
    // ICP pages
    { match: "/icp/physiotherapists",      node: "icp_physio" },
    { match: "/icp/clinics",               node: "icp_clinic" },
    { match: "/icp/caregivers",            node: "icp_caregivers" },
    { match: "/icp/elderly-care",          node: "icp_elderly" },
    { match: "/icp/rehab-patients",        node: "icp_rehab" },
    { match: "/icp/sports-academies",      node: "icp_sports" },
    { match: "/icp",                       node: "icp" },
    // Platform
    { match: "/platform/movement",         node: "platform_movement" },
    { match: "/platform/progress",         node: "platform_progress" },
    { match: "/platform/training",         node: "platform_training" },
    { match: "/platform/dashboard",        node: "platform_dashboard" },
    { match: "/platform",                  node: "platform" },
    // Resources
    { match: "/resources/faqs",            node: "resources_faqs" },
    { match: "/resources/anatomy",         node: "resources_anatomy" },
    { match: "/resources/rehab",           node: "resources_rehab" },
    { match: "/resources/library",         node: "resources_library" },
    { match: "/resources",                 node: "resources" },
    // Contact
    { match: ["/contact", "/contact/demo", "/contact/enquiry", "/contact/consultation"], node: "contact" },
    // Feedback
    { match: "/feedback",                  node: "feedback" },
    // About
    { match: "/about/mission",             node: "about_mission" },
    { match: "/about/team",               node: "about_team" },
    { match: "/about/careers",             node: "about_careers" },
    { match: "/about",                     node: "about" },
    // Blog
    { match: "/blog",                      node: "blog" },
    // Legal / safety
    { match: "/safety",                    node: "safety" },
    { match: "/privacy",                   node: "privacy" },
  ];

  // Set chatbot node whenever the route changes
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    let matched = "start";
    let shouldAutoOpen = false;
    for (const ctx of PAGE_CONTEXT) {
      const matchers = Array.isArray(ctx.match) ? ctx.match : [ctx.match];
      if (matchers.some((m) => path === m || path.startsWith(m + "/"))) {
        matched = ctx.node;
        if (ctx.autoOpen) shouldAutoOpen = true;
        break; // first (most specific) match wins
      }
    }
    setNode(matched);
    setShowTree(true);
    if (shouldAutoOpen && !open) setTimeout(() => setOpen(true), 1800);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // On node change, reset messages to the node greeting
  useEffect(() => {
    const n = tree[node] || tree["start"];
    setMessages([{ type: "bot", text: n.text }]);
  }, [node]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for global open requests (e.g. from top announcement Ask AI button)
  useEffect(() => {
    const handleOpenRequest = () => setOpen(true);
    window.addEventListener("open-ai-assistant", handleOpenRequest);
    return () => window.removeEventListener("open-ai-assistant", handleOpenRequest);
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: Msg = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setShowTree(false);

    // Log to Google Sheets
    sendToGoogleSheet({
      action: "chatbot_inquiry",
      form_type: "assistant_chat",
      message: text,
      context_node: node,
    }).catch(() => {});

    try {
      trackClarityEvent("chatbot_message");
      setClarityTag("used_chatbot", "true");
    } catch (_) {}

    // Resolve answer from KB
    setTimeout(() => {
      const match = findAnswer(text);
      let botMsg: Msg;
      if (match) {
        botMsg = { type: "bot", text: match.answer, links: match.links };
      } else {
        botMsg = {
          type: "bot",
          text: "I don't have a specific answer for that yet, but our team would love to help. You can reach us via WhatsApp or the Contact page for a detailed response.",
          links: [{ label: "Contact us", to: "/contact" }],
        };
      }
      setMessages((prev) => [...prev, botMsg]);
      setShowTree(true);
    }, 600);
  };

  const n = tree[node] || tree["start"];

  return (
    <>
      {/* WhatsApp — left */}
      <div className="fixed bottom-5 left-5 z-50">
        <a
          href={whatsappLink(WA_MESSAGES.general)}
          target="_blank" rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift hover:scale-105 transition-transform"
        >
          <MessageCircle className="size-6" />
        </a>
      </div>

      {/* Assistant — right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <div
            role="dialog"
            aria-label="Physiomatics AI assistant"
            className="w-[min(24rem,calc(100vw-2.5rem))] rounded-3xl border bg-card shadow-lift animate-rise flex flex-col"
            style={{ maxHeight: "min(82vh, 600px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-primary text-primary-foreground rounded-t-3xl">
              <div className="flex items-center gap-2 font-semibold">
                <Bot className="size-5" />
                Physiomatics Guide
                <span className="ml-1 inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <button aria-label="Close assistant" onClick={() => setOpen(false)}>
                <X className="size-5 opacity-80 hover:opacity-100" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-1 ${msg.type === "bot" ? "items-start" : "items-end"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[88%] leading-relaxed ${
                      msg.type === "bot"
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Inline quick-links after bot messages */}
                  {msg.type === "bot" && msg.links && (
                    <div className="flex flex-wrap gap-1.5 mt-1 ml-1">
                      {msg.links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to as "/"}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                        >
                          {l.label} <ChevronRight className="size-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Guided button tree after latest bot reply */}
              {showTree && (
                <div className="mt-3 grid gap-1.5">
                  {n.options.map((o) =>
                    o.next ? (
                      <Button
                        key={o.label} variant="outline"
                        className="justify-start text-xs h-9 rounded-xl"
                        onClick={() => { setNode(o.next!); setShowTree(true); }}
                      >
                        {o.label}
                      </Button>
                    ) : o.to ? (
                      <Button key={o.label} asChild variant="outline" className="justify-start text-xs h-9 rounded-xl">
                        <Link to={o.to as "/"} onClick={() => setOpen(false)}>{o.label}</Link>
                      </Button>
                    ) : (
                      <Button key={o.label} asChild variant="whatsapp" className="justify-start text-xs h-9 rounded-xl">
                        <a href={whatsappLink(WA_MESSAGES[o.wa!])} target="_blank" rel="noreferrer">{o.label}</a>
                      </Button>
                    )
                  )}
                  {node !== "start" && (
                    <button
                      className="mt-1 text-xs text-muted-foreground underline hover:text-primary transition-colors text-center"
                      onClick={() => setNode("start")}
                    >
                      ← Back to main menu
                    </button>
                  )}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-2 items-center px-4 py-3 border-t">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything about Physiomatics…"
                className="h-9 text-xs rounded-full"
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open Physiomatics assistant"
          aria-expanded={open}
          className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift hover:scale-105 transition-transform"
        >
          {open ? <X className="size-6" /> : <Bot className="size-6" />}
        </button>
      </div>
    </>
  );
}
