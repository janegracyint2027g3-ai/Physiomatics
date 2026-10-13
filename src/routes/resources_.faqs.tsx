import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  BrainCircuit, 
  Stethoscope, 
  HeartHandshake, 
  Building2, 
  MessageSquare, 
  ArrowRight, 
  Phone 
} from "lucide-react";
import { PHONE_NUMBER_DISPLAY, whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/resources_/faqs")({
  head: () => ({
    meta: [
      { title: "Clinical & Technical FAQ Center — Physiomatics" },
      { name: "description", content: "Comprehensive answers to questions about zero-cloud privacy, 2D camera pose estimation accuracy, clinical oversight, supported exercises, and clinic deployment." },
      { property: "og:title", content: "Frequently Asked Questions — Physiomatics" },
    ],
  }),
  component: FAQsPage,
});

interface FaqItem {
  q: string;
  a: string;
  category: "privacy" | "accuracy" | "clinical" | "elderly" | "clinics";
}

const faqList: FaqItem[] = [
  // Privacy & Data Security
  {
    category: "privacy",
    q: "Is my video recording or camera stream uploaded to any cloud server?",
    a: "No. Absolutely not. The pose-estimation neural network runs entirely inside your client browser via WebAssembly (WASM). Your camera stream is processed frame-by-frame in local device memory, and raw frames are immediately discarded. Neither video nor audio is ever sent to Physiomatics or third-party servers.",
  },
  {
    category: "privacy",
    q: "Where is my session history and repetition count stored?",
    a: "Your telemetry data (exercise name, repetition count, joint angles, and dates) is saved in your device's browser localStorage. You have complete sovereignty over your data and can view, export, or permanently wipe it at any time from your device.",
  },
  {
    category: "privacy",
    q: "Does Physiomatics comply with patient data privacy standards?",
    a: "Because we process video streams locally on-device without ingesting or storing Protected Health Information (PHI) on our servers, we minimize data transmission risks by design. All lead forms and inquiry submissions use encrypted HTTPS with server-side API credential isolation.",
  },

  // Accuracy & Technology
  {
    category: "accuracy",
    q: "How accurate is single-camera 2D movement analysis compared to clinical goniometry?",
    a: "Our system provides reliable kinematic estimates for gross range-of-motion tracking, symmetry observation, and repetition counting. However, because a standard 2D camera projects three-dimensional movement onto a flat plane, slight perspective angles can cause minor deviations (typically ±3° to 5° when properly aligned) compared to a manual physical goniometer. We openly present these as estimates rather than millimeter-perfect 3D lab measurements.",
  },
  {
    category: "accuracy",
    q: "How should I position my camera for the most reliable tracking?",
    a: "Place your smartphone or laptop on a stable surface at approximately hip height, 2.0 to 3.0 meters away from where you are standing or sitting. Ensure your entire body from head to feet is in the camera frame, that lighting is positioned in front of you (not behind you), and that you wear clothing that contrasts with your background.",
  },
  {
    category: "accuracy",
    q: "What happens if the camera angle is bad or lighting is too dim?",
    a: "Unlike black-box fitness apps that guess angles when visibility is poor, Physiomatics displays a real-time warning. If landmark confidence drops below safety thresholds, our system pauses metric calculations rather than displaying false readings.",
  },
  {
    category: "accuracy",
    q: "Which exercises are currently supported for real-time tracking?",
    a: "Our core validated library currently includes: Bodyweight Squat (measuring knee and hip flexion), Seated Knee Extension (measuring terminal extension and quadriceps control), and Standing Shoulder Flexion (measuring glenohumeral arm raise angle). Additional orthopedic movements are in clinical review.",
  },

  // Clinical Oversight
  {
    category: "clinical",
    q: "Does Physiomatics diagnose orthopedic conditions or prescribe treatments?",
    a: "No. Physiomatics is explicitly an educational movement observation and exercise compliance tool, not a diagnostic medical device. It does not diagnose tears, fractures, or pathologies. All exercises must be prescribed by your licensed physiotherapist or orthopedic physician.",
  },
  {
    category: "clinical",
    q: "What should I do if I experience pain during an exercise session?",
    a: "Stop immediately. Mild muscular fatigue is normal during rehabilitation, but sharp joint pain, pinch sensations, or numbness indicate you should cease the movement. Contact your physiotherapist for an in-clinic evaluation. If you suspect an acute emergency, call your local emergency services.",
  },
  {
    category: "clinical",
    q: "How does my physiotherapist use this information in my appointments?",
    a: "During follow-up consultations, you can share your session summary charts showing repetition counts, max flexion angles, and consistency over weeks. This gives your clinician objective longitudinal proof of your home progress, allowing them to advance your exercise program with confidence.",
  },

  // Elderly Care & Caregivers
  {
    category: "elderly",
    q: "Is Physiomatics suitable for elderly seniors recovering at home?",
    a: "Yes. In fact, our platform was designed with senior mobility in mind. We feature large high-contrast buttons, simplified one-click recording, clear verbal prompts, and specific seated routines (such as Seated Knee Extensions) designed for fall prevention and post-arthroplasty mobility.",
  },
  {
    category: "elderly",
    q: "Can a family member or caregiver operate the phone while the senior exercises?",
    a: "Yes, this is common. Caregivers can position the device, initiate the session, and assist the senior with proper posture while watching the visual guide together.",
  },

  // Clinics & Practices
  {
    category: "clinics",
    q: "How can physiotherapy practices integrate Physiomatics?",
    a: "Clinics can use Physiomatics as their home compliance companion. Practice directors can request a demo to explore our upcoming therapist dashboard, which centralizes patient telemetry, adherence velocity, and clinical milestone tracking under Jira-compatible practice boards.",
  },
  {
    category: "clinics",
    q: "Can Physiomatics work with custom clinic rehabilitation protocols?",
    a: "Yes. During clinical consultations, we collaborate with practice directors to map custom range-of-motion threshold goals (e.g., limiting knee flexion to 90° for early-stage ACL reconstruction) to specific patient protocols.",
  },
];

const categoryTabs = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "privacy", label: "Privacy & Data", icon: ShieldCheck },
  { id: "accuracy", label: "AI & Camera Accuracy", icon: BrainCircuit },
  { id: "clinical", label: "Clinical Safety", icon: Stethoscope },
  { id: "elderly", label: "Elderly & Caregivers", icon: HeartHandshake },
  { id: "clinics", label: "Clinics & Practices", icon: Building2 },
];

function FAQsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = activeTab === "all" || item.category === activeTab;
    const matchesSearch = 
      searchQuery.trim() === "" ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHero 
        eyebrow="Help Center & Knowledge Base" 
        title="Frequently Asked Questions."
      >
        Find detailed answers regarding zero-cloud video privacy, camera setup accuracy, clinical boundaries, geriatric accessibility, and practice integration.
      </PageHero>

      <section className="container-page py-16 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions (e.g., privacy, camera angle, pain, clinic)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border bg-card text-foreground shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-base"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <tab.icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Accordion FAQ Items */}
        {filteredFaqs.length > 0 ? (
          <Accordion type="multiple" className="w-full space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem 
                value={`item-${index}`} 
                key={faq.q}
                className="border rounded-2xl bg-card px-6 py-1 shadow-xs data-[state=open]:border-primary/40 transition-colors"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-bold py-4 hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-5 pt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 border rounded-3xl bg-card p-8">
            <HelpCircle className="size-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">No matching questions found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try searching with different terms or select "All Questions".
            </p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setActiveTab("all"); }} className="mt-4">
              Reset Filters
            </Button>
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="mt-16 rounded-3xl border bg-gradient-to-br from-card to-primary/5 p-8 sm:p-10 shadow-sm text-center">
          <MessageSquare className="size-10 text-primary mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Have a Specific Clinical or Technical Question?</h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mt-2 leading-relaxed">
            Our clinical team and technology specialists are always available to help answer questions about exercise support, data privacy, or clinic pilot deployments.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/contact">Send Direct Inquiry <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="whatsapp">
              <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">
                WhatsApp Chat ({PHONE_NUMBER_DISPLAY})
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/safety">Read Safety Disclaimers</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

