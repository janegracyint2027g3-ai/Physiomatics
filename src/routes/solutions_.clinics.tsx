import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Building2, 
  Eye, 
  Stethoscope, 
  FileCheck, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  CalendarCheck, 
  Users, 
  Clock, 
  DollarSign,
  Sparkles
} from "lucide-react";
import { GoogleCalendarButton } from "@/components/site/GoogleCalendarButton";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/solutions_/clinics")({
  head: () => ({
    meta: [
      { title: "Physical Therapy Clinic Modernization & Telemetry — Physiomatics" },
      { 
        name: "description", 
        content: "Empower your outpatient physical therapy clinic with objective home exercise compliance tracking, zero-cloud privacy, and streamlined progress note documentation." 
      },
      { property: "og:title", content: "Physical Therapy Clinics Solutions — Physiomatics" },
      { property: "og:description", content: "Objective compliance tracking and practice modernization without hardware overhead." },
    ],
  }),
  component: ClinicsPage,
});

const CLINIC_VALUE_PROPS = [
  {
    icon: TrendingUp,
    title: "Verify Home Adherence",
    detail: "Replace subjective patient recall with objective, timestamped completion records and repetition counts between clinic visits."
  },
  {
    icon: Clock,
    title: "Save Follow-Up Appointment Time",
    detail: "Patients arrive with muscle memory reinforced by real-time audio and visual biofeedback, cutting down time spent re-teaching foundational exercises."
  },
  {
    icon: ShieldCheck,
    title: "Zero IT Infrastructure Overhead",
    detail: "Runs instantly in any modern web browser. No proprietary sensors, wearable charging docks, or software app store installations required."
  },
  {
    icon: Stethoscope,
    title: "Clinician in the Driver's Seat",
    detail: "Technology acts as an adherence companion under the therapist's direction. You set the approved exercise modules and range-of-motion targets."
  }
];

const ONBOARDING_STEPS = [
  {
    phase: "Phase 1",
    title: "Initial 15-Minute Staff Walkthrough",
    detail: "We introduce your clinical staff to the optical setup standards, joint angle trigonometry, and patient guidance flyer."
  },
  {
    phase: "Phase 2",
    title: "Targeted Cohort Trial (10 Patients)",
    detail: "Select 10 motivated post-operative or balance patients to use the platform during their standard home exercise cycle."
  },
  {
    phase: "Phase 3",
    title: "Progress Evaluation & Practice Rollout",
    detail: "Review patient engagement feedback, adherence logs, and clinician satisfaction before scaling across all treatment bays."
  }
];

const CLINIC_FAQS = [
  {
    q: "Do clinics need to purchase expensive optical cameras or specialized tablets?",
    a: "No! Physiomatics is built on open web standards. Patients use their existing smartphones, tablets, or home laptops. Clinics can use any standard browser on their treatment room computers or iPads."
  },
  {
    q: "Does this replace our existing EMR / EHR documentation system?",
    a: "No. Physiomatics provides objective telemetry metrics (e.g. 'Completed 8 sessions over 14 days, average knee flexion depth 118°') that physical therapists reference when entering daily SOAP notes into their current EMR."
  },
  {
    q: "How does the zero-cloud video architecture protect clinic liability?",
    a: "Because video is processed locally within the patient's device browser and never uploaded to external servers, clinics avoid the severe cybersecurity risks, HIPAA data breach liabilities, and video storage compliance burdens of legacy telehealth systems."
  }
];

export function ClinicsPage() {
  return (
    <>
      <PageHero 
        eyebrow="Outpatient Practice Modernization" 
        title="Objective Home Exercise Adherence for Physiotherapy Clinics"
        description="Equip your practice with browser-based movement telemetry. Gain clarity into patient home exercise habits, strengthen therapeutic outcomes, and modernise patient care without hardware capital expenditure."
      />

      {/* Hero Overview */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Clinical Visibility
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Turn the Home Exercise "Black Box" Into Actionable Telemetry
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every outpatient clinic director knows the frustration: you spend 45 minutes crafting a personalized home exercise plan, only for the patient to return two weeks later having practiced haphazardly or forgotten key movement cues entirely.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics provides the bridge. By enabling patients to practice at home with real-time on-device feedback, your clinic gains verifiable adherence records while patients enjoy greater confidence and accountability.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/contact/demo">
                  Book Clinic Walkthrough <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact/consultation">Request Clinic Pilot</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Clinic Pilot Program</h3>
                <p className="text-xs text-muted-foreground">30-day risk-free practice evaluation</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Schedule an interactive 25-minute strategy call to discuss deploying Physiomatics across your physical therapy treatment bays.
            </p>

            <div className="flex justify-center pt-2">
              <GoogleCalendarButton
                label="Book Clinical Walkthrough"
                source="solutions_clinics_page"
                useNativeGoogleWidget={false}
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-3.5 text-xs text-muted-foreground space-y-1.5 border border-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Zero hardware installation required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Patient onboarding handouts provided</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Value Pillars for Clinics */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Practice Value</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Why Outpatient Clinics Partner With Physiomatics
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Measurable clinical and operational benefits designed for modern physical therapy practices.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {CLINIC_VALUE_PROPS.map((prop, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <prop.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">{prop.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{prop.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Phase Practice Onboarding Roadmap */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Implementation Pathway
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Seamless 3-Phase Clinic Pilot Roadmap
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A risk-free, phased approach to introducing movement telemetry without disrupting clinician workflows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ONBOARDING_STEPS.map((s) => (
              <div key={s.phase} className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm space-y-2">
                <span className="font-mono text-xs font-bold text-primary">{s.phase}</span>
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Clinic Implementation FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {CLINIC_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`clinic-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
