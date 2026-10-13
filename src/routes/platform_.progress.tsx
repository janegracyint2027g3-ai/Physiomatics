import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  LineChart, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Database,
  BarChart3,
  Clock,
  Sparkles
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/platform_/progress")({
  head: () => ({
    meta: [
      { title: "Longitudinal Recovery & Progress Telemetry — Physiomatics" },
      { 
        name: "description", 
        content: "Track home rehabilitation compliance over time: session logs, repetition consistency, range-of-motion trends, and local-first data privacy." 
      },
      { property: "og:title", content: "Progress Monitoring & Telemetry — Physiomatics" },
      { property: "og:description", content: "Review session history and track movement trends securely on your own device." },
    ],
  }),
  component: ProgressPage,
});

const TELEMETRY_METRICS = [
  {
    icon: Calendar,
    title: "Session Adherence & Frequency",
    detail: "Tracks the exact days, times, and completion rates of prescribed home exercise bouts to quantify compliance."
  },
  {
    icon: TrendingUp,
    title: "Peak Range-of-Motion Excursion",
    detail: "Calculates the maximum achieved joint flexion angle per session, visualizing gradual mobility improvements."
  },
  {
    icon: Clock,
    title: "Cadence & Repetition Tempo",
    detail: "Monitors active time under tension to ensure exercises are executed with controlled muscular engagement rather than speed."
  },
  {
    icon: BarChart3,
    title: "Fatigue & Consistency Curves",
    detail: "Evaluates whether movement depth degrades across consecutive repetitions, providing insights into muscular endurance."
  }
];

const COMPARISON_STANDARDS = [
  {
    rule: "Optical Setup Continuity",
    detail: "Keep camera height, distance (2.0 - 2.5m), and orientation identical across sessions to prevent perspective distortion."
  },
  {
    rule: "Environmental Uniformity",
    detail: "Maintain consistent room lighting and use the same firm, uncarpeted floor area or stable chair for seated routines."
  },
  {
    rule: "Clothing Consistency",
    detail: "Wear fitted athletic apparel to ensure skeletal landmark edge-detection algorithms identify anatomical nodes uniformly."
  }
];

const PROGRESS_FAQS = [
  {
    q: "Does a higher range-of-motion angle mean my injury is completely healed?",
    a: "No. Increased range of motion is an encouraging functional indicator, but it does not represent complete tissue healing or structural stability. Always have your treating physical therapist perform clinical testing before returning to strenuous sports or heavy lifting."
  },
  {
    q: "Where is my session history saved, and can others access it?",
    a: "Your exercise history is saved exclusively inside your browser's local storage sandbox on your current device. It is never uploaded to public servers, sold, or shared. If you clear your browser cookies and site data, your local history will be erased."
  },
  {
    q: "Can I show these progress graphs to my physical therapist during my next appointment?",
    a: "Yes! In fact, that is the primary intended clinical purpose. Bringing your device to your follow-up visit allows your therapist to review objective compliance logs and make informed adjustments to your rehabilitation plan."
  }
];

export function ProgressPage() {
  return (
    <>
      <PageHero 
        eyebrow="Longitudinal Recovery Telemetry" 
        title="Visualizing Recovery Across Sessions"
        description="Physical rehabilitation is rarely a linear journey. Track your home exercise consistency, review historical movement trends, and share objective compliance records with your clinician."
      />

      {/* Overview Grid */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Objective Compliance Records
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Connecting Daily Effort to Clinical Outcomes
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              When patients return for clinic follow-ups, memory can be fuzzy: <em>"I think I did my squats four times this week, maybe three."</em> Clinicians are left guessing whether slow progress is due to biological factors or inconsistent home practice.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics replaces subjective recollection with objective session logging. Every completed exercise session records timestamped repetitions, duration, and joint range estimates—providing an unshakeable foundation for informed clinical conversations.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/analyze">
                  Complete a Session Now <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/platform/movement">Understand Movement Mechanics</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Local-Only Data Architecture</h3>
                <p className="text-xs text-muted-foreground">Absolute privacy on your personal device</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              All session summaries are stored directly in your browser's local memory. You have complete data sovereignty: no account sign-up is required, and no video telemetry is shared across the web without your permission.
            </p>

            <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950 dark:text-amber-100 mb-1">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Browser Storage Notice</span>
              </div>
              <p className="leading-relaxed">
                Because data is stored on-device, clearing your browser cache or switching devices will start a fresh local log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Progress Metrics */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Metrics Matrix</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            What Progress Monitoring Captures
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Holistic telemetry variables designed to evaluate both movement quantity and quality.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TELEMETRY_METRICS.map((m, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <m.icon className="h-6 w-6" />
                </div>
                <h4 className="text-base font-semibold text-foreground">{m.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ensuring Consistency for Meaningful Comparison */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Scientific Continuity
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              How to Ensure Valid Longitudinal Comparisons
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For week-over-week angle trends to reflect actual anatomical change rather than optical noise, follow these three standardization principles:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {COMPARISON_STANDARDS.map((std, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm space-y-2">
                <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{std.rule}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{std.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Progress Tracking Questions
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {PROGRESS_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`progress-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
