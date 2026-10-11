import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { MessageCircle, X, Bot, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";
import { sendToGoogleSheet } from "@/lib/googleSheets";

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
    triggers: ["contact", "reach", "email", "phone", "whatsapp", "call", "speak", "talk"],
    answer: "You can reach us via the Contact page (quick enquiry or detailed consultation) or chat directly on WhatsApp. We usually respond within one business day.",
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

  // Auto-open on analyze / solutions pages
  useEffect(() => {
    let nextNode = "start";
    if (location.pathname.includes("/analyze")) nextNode = "clinic";
    else if (location.pathname.includes("/solutions")) nextNode = "elderly";
    else if (location.pathname.includes("/icp/elderly") || location.pathname.includes("/icp/caregiver")) nextNode = "elderly";
    else if (location.pathname.includes("/icp/rehab")) nextNode = "rehab";
    else if (location.pathname.includes("/icp/sports")) nextNode = "sports";
    setNode(nextNode);
    setShowTree(true);
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
