import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  UserCheck, 
  Shield, 
  FileText, 
  Share2, 
  ArrowRight, 
  Stethoscope, 
  Sliders, 
  CheckCircle2, 
  Users, 
  CalendarCheck, 
  Clock, 
  Lock,
  Sparkles,
  Layers
} from "lucide-react";
import { GoogleCalendarButton } from "@/components/site/GoogleCalendarButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/platform_/dashboard")({
  head: () => ({
    meta: [
      { title: "Physical Therapist Clinical Dashboard & Workflow — Physiomatics" },
      { 
        name: "description", 
        content: "Explore our clinical review workflow: multi-patient compliance tracking, custom joint angle parameter presets, and objective progress documentation." 
      },
      { property: "og:title", content: "Physical Therapist Dashboard — Physiomatics" },
      { property: "og:description", content: "Clinical oversight, custom protocols, and objective home exercise adherence records." },
    ],
  }),
  component: DashboardPage,
});

const DASHBOARD_CAPABILITIES = [
  {
    icon: Users,
    title: "Multi-Patient Cohort Telemetry",
    badge: "Oversight",
    desc: "At-a-glance compliance heatmaps highlighting which patients are maintaining their prescribed cadence and who requires clinical check-in."
  },
  {
    icon: Sliders,
    title: "Customizable Biomechanical Presets",
    badge: "Clinical Control",
    desc: "Configure individualized ROM targets (e.g., knee flexion limited to 90° for early post-operative meniscal repairs) and repetition thresholds."
  },
  {
    icon: FileText,
    title: "Objective Progress Note Export",
    badge: "Documentation",
    desc: "Generate clean summary metrics (average peak angles, total completed bouts, cadence) ready to paste into clinical progress notes and EMRs."
  },
  {
    icon: Shield,
    title: "Zero-Video Data Governance",
    badge: "Compliance",
    desc: "Clinicians receive numerical telemetry and vector graphs without streaming or storing invasive raw video of patients' homes."
  }
];

const CLINICAL_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "In-Clinic Assessment & Parameter Definition",
    detail: "During the initial clinical evaluation, the physical therapist tests patient baseline mobility and selects the appropriate Physiomatics exercise module."
  },
  {
    step: "02",
    title: "Patient Performs Guided Home Sessions",
    detail: "The patient executes prescribed routines using any phone or laptop webcam. Real-time audio and visual biofeedback guide movement without cloud streaming."
  },
  {
    step: "03",
    title: "Collaborative Follow-Up Review",
    detail: "During follow-up visits or telehealth calls, the clinician reviews session logs to verify compliance, analyze fatigue trends, and titrate exercise difficulty."
  }
];

const DASHBOARD_FAQS = [
  {
    q: "Is the clinician dashboard currently available for all outpatient clinics?",
    a: "The collaborative in-person review workflow (where patients bring local device logs to follow-up sessions) is fully active and free to use today. Our multi-tenant centralized cloud dashboard with remote clinic invitations is currently being piloted with select rehabilitation partners."
  },
  {
    q: "Can physical therapists prescribe custom exercises not currently in the library?",
    a: "During our clinical pilot programs, we work directly with clinic teams to map and deploy custom kinematic exercise models tailored to specialized orthopedic or neurological care pathways."
  },
  {
    q: "How does this fit into existing EMR / EHR documentation?",
    a: "Physiomatics outputs standardized numerical telemetry summaries (dates, completed sets/reps, mean peak excursion, and compliance percentage) that physical therapists can easily reference when drafting daily SOAP notes."
  }
];

export function DashboardPage() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical Governance & Oversight" 
        title="Physical Therapist Review & Practice Management"
        description="Empowering physical therapy teams with objective home compliance records, custom joint threshold presets, and actionable recovery telemetry."
      />

      {/* Overview Grid */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Clinician in the Loop
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Elevating Clinical Decision-Making With Objective Data
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics is engineered as a decision-support and adherence tool for qualified healthcare providers—never as an autonomous diagnostic substitute. We believe technology achieves its highest potential when it strengthens the vital therapeutic alliance between clinician and patient.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our clinical dashboard architecture gives physical therapists transparent insight into what happens between in-person appointments: verifying whether patients completed their prescribed sets, identifying adherence drop-offs, and celebrating recovery milestones.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/contact/demo">
                  Schedule a Clinical Walkthrough <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact/consultation">Request Clinic Pilot Access</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Clinic Pilot Program</h3>
                <p className="text-xs text-muted-foreground">Collaborative beta deployment</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              We are actively enrolling outpatient physical therapy clinics, university research departments, and sports medicine practices in our structured 30-day pilot program.
            </p>

            <div className="flex justify-center pt-2">
              <GoogleCalendarButton
                label="Book Clinical Walkthrough"
                source="platform_dashboard_page"
                useNativeGoogleWidget={false}
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-3.5 text-xs text-muted-foreground space-y-1.5 border border-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Dedicated clinician onboarding session</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Custom angle preset calibration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Dashboard Capabilities */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Feature Suite</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Core Clinical Dashboard Capabilities
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tools designed to streamline patient oversight without increasing administrative documentation burden.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {DASHBOARD_CAPABILITIES.map((cap, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <cap.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {cap.badge}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-foreground">{cap.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Workflow Loop */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Standard Operating Procedure
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              The 3-Step Collaborative Practice Workflow
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              How Physiomatics seamlessly folds into existing outpatient clinic routines.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CLINICAL_WORKFLOW_STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm space-y-2">
                <span className="font-mono text-xs font-bold text-primary">STEP {s.step}</span>
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Clinical Review FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {DASHBOARD_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`dash-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
