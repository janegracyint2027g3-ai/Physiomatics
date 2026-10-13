import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  ClipboardCheck, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Target, 
  Users, 
  CalendarCheck,
  Building2,
  Stethoscope,
  PhoneCall
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_TEL, PHONE_NUMBER_DISPLAY, YOUTUBE_URL, LINKEDIN_URL } from "@/lib/site";
import { GoogleCalendarButton } from "@/components/site/GoogleCalendarButton";

export const Route = createFileRoute("/contact_/consultation")({
  head: () => ({
    meta: [
      { title: "Clinical Technology Consultation — Physiomatics" },
      { 
        name: "description", 
        content: "Schedule an in-depth clinical consultation to evaluate Physiomatics deployment across outpatient clinics, rehabilitation networks, and academic curricula." 
      },
      { property: "og:title", content: "Clinical Technology Consultation — Physiomatics" },
      { property: "og:description", content: "Structured practice assessment and deployment roadmap for clinics." },
    ],
  }),
  component: ConsultationPage,
});

const CONSULTATION_PHASES = [
  {
    step: "01",
    title: "Clinical Needs & Cohort Analysis",
    detail: "We review your clinical specialties (e.g. post-operative TKA/ACL, rotator cuff repairs, or geriatric balance) and quantify current home exercise program (HEP) adherence drop-off points."
  },
  {
    step: "02",
    title: "Zero-Cloud Security & Technical Review",
    detail: "Our engineering leads walk through the browser-based WebAssembly architecture, confirming zero video transmission to comply with hospital and patient privacy requirements."
  },
  {
    step: "03",
    title: "Protocol Customization & Angle Presets",
    detail: "We configure specific joint angle thresholds, repetition tempos, and optical framing guidelines that match your clinic's existing physical therapy care plans."
  },
  {
    step: "04",
    title: "Pilot Onboarding & Outcome Tracking",
    detail: "We establish a structured 30-day clinician trial cohort, providing weekly telemetry review, patient onboarding flyers, and direct clinician technical support."
  }
];

const DELIVERABLES = [
  {
    icon: FileText,
    title: "Practice Deployment Blueprint",
    detail: "A tailored PDF roadmap detailing clinic hardware requirements (standard laptops/tablets), network settings, and patient onboarding workflows."
  },
  {
    icon: Target,
    title: "Custom Kinematic Parameter Matrix",
    detail: "Pre-configured threshold angles for your target exercise catalogue, validated against optical plane specifications."
  },
  {
    icon: Users,
    title: "Therapist & Patient Onboarding Guides",
    detail: "Clean visual step-by-step handouts to help elderly and post-op patients set up their home camera in under 60 seconds."
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Compliance Briefing",
    detail: "Full architectural documentation of edge-only client-side execution to satisfy healthcare IT compliance officers."
  }
];

function ConsultationPage() {
  return (
    <>
      <PageHero 
        eyebrow="Institutional & Clinic Advisory" 
        title="Tailored Physiotherapy Technology Consultation"
        description="Collaborate with our clinical and engineering team to evaluate, customize, and pilot computer-vision rehabilitation tools inside your clinic or healthcare network."
      />

      {/* Overview & Value Proposition */}
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Enterprise & Clinic Partnerships
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Bridging In-Clinic Expertise with Scalable Home Adherence
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Traditional paper or static video exercise handouts suffer from an estimated 70% patient compliance drop-off. Physiomatics provides real-time biomechanical guidance that patients can trust at home, while providing clinicians with objective movement fidelity records.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our consultation is designed for clinical directors, academic department heads, and digital health managers who want a thorough, clinically validated assessment before rolling out new tools.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/contact">
                  Submit Full Consultation Request <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="whatsapp">
                <a 
                  href={whatsappLink("Hello Physiomatics, I would like to schedule a formal clinical technology consultation for my organization.")} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  WhatsApp ({PHONE_NUMBER_DISPLAY})
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Schedule Initial Discovery</h3>
                <p className="text-xs text-muted-foreground">30-minute introductory strategy session</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Book a direct consultation slot on Google Calendar to review your clinical objectives with our team.
            </p>

            <div className="flex justify-center mb-6">
              <GoogleCalendarButton
                label="Book Clinical Consultation"
                source="contact_consultation_page"
                useNativeGoogleWidget={false}
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>No long-term commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Custom pilot protocol proposal included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Direct session with clinical & tech leads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Consultation Journey */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Structured Roadmap</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Our 4-Phase Consultation Framework
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A methodical, risk-free pathway from initial assessment to clinical pilot execution.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONSULTATION_PHASES.map((p) => (
            <div key={p.step} className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{p.step}</span>
                <h4 className="mt-3 text-base font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Deliverables */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Included Assets
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              What You Receive From a Consultation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every consultation provides tangible documentation tailored to your organization's specific technical and clinical environment.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {DELIVERABLES.map((d, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <d.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{d.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{d.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              Direct Clinician Line: <a href={PHONE_TEL} className="font-semibold text-foreground hover:text-primary">{PHONE_NUMBER_DISPLAY}</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                ▶️ YouTube: @JaneGracyDavid
              </a>
              <span>•</span>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                💼 LinkedIn: Physiomatics
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
