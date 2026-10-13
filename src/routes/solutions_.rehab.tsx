import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Activity, 
  Camera, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Stethoscope, 
  Compass,
  Sparkles
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/solutions_/rehab")({
  head: () => ({
    meta: [
      { title: "Orthopedic & Post-Operative Injury Rehabilitation — Physiomatics" },
      { 
        name: "description", 
        content: "Structured movement telemetry for orthopedic recovery: Total Knee Arthroplasty (TKA), ACL reconstruction, rotator cuff repair, and patellofemoral rehabilitation." 
      },
      { property: "og:title", content: "Orthopedic Rehabilitation Solutions — Physiomatics" },
      { property: "og:description", content: "Evidence-informed movement guidance for orthopedic and post-operative recovery." },
    ],
  }),
  component: RehabPage,
});

const REHAB_CONDITIONS = [
  {
    condition: "Total Knee Arthroplasty (TKA)",
    phase: "Weeks 2 - 12",
    focus: "Progressive knee flexion recovery, quadriceps lag elimination, and symmetric sit-to-stand mechanics."
  },
  {
    condition: "ACL Reconstruction",
    phase: "Weeks 4 - 24",
    focus: "Sagittal squat depth tracking, preventing knee valgus collapse, and restoring bilateral kinetic symmetry."
  },
  {
    condition: "Rotator Cuff Repair",
    phase: "Weeks 6 - 16",
    focus: "Controlled scapular plane arm raises (scaption), avoiding superior shoulder hiking substitutions."
  },
  {
    condition: "Patellofemoral Pain Syndrome",
    phase: "Weeks 1 - 8",
    focus: "Paced closed-chain knee flexion with controlled eccentric deceleration to minimize retropatellar joint stress."
  }
];

const REHAB_PILLARS = [
  {
    icon: Compass,
    title: "Real-Time Angle Gating",
    desc: "Visual dials signal when you have achieved the exact therapeutic joint angle prescribed by your clinician, preventing harmful hyperextension or excessive loading."
  },
  {
    icon: Clock,
    title: "Controlled Eccentric Cadence",
    desc: "Tissue remodelling requires controlled tempo (e.g. 3-second lowering) rather than ballistic bouncing that spikes intra-articular shear forces."
  },
  {
    icon: TrendingUp,
    title: "Objective Recovery Logs",
    desc: "Session logs capture peak range of motion and repetition counts so you can bring clear evidence of compliance to your weekly clinic appointments."
  },
  {
    icon: ShieldCheck,
    title: "Zero-Cloud Privacy",
    desc: "Practice exercises in complete comfort. Video processing occurs locally on your phone or laptop—no living room video is ever uploaded."
  }
];

const REHAB_FAQS = [
  {
    q: "Can I use Physiomatics without a physical therapist's guidance?",
    a: "We strongly advise against self-directing injury rehabilitation. Post-operative tissue healing requires clinical goniometry, surgical protocol clearance, and clinical load titration. Physiomatics is designed as an adherence biofeedback companion to your physical therapist's care plan."
  },
  {
    q: "What should I do if my knee swells or aches after an exercise session?",
    a: "Mild delayed muscular soreness is expected. However, if you experience increased joint swelling, warmth, throbbing, or sharp pain, pause your exercise program, apply elevation/cold therapy as prescribed, and notify your physical therapist or orthopedic surgeon."
  },
  {
    q: "How does the computer vision prevent me from doing an exercise incorrectly?",
    a: "Our algorithm validates joint landmark vectors and requires full transition past defined depth and lockout boundaries before counting repetitions. If you cut repetitions short or move erratically, the system rejects the rep and provides immediate visual feedback."
  }
];

export function RehabPage() {
  return (
    <>
      <PageHero 
        eyebrow="Orthopedic & Post-Operative Telemetry" 
        title="Evidence-Informed Movement Guidance for Injury Recovery"
        description="Bridge the gap between weekly clinical visits. Execute home rehabilitation routines with real-time joint kinematic feedback, controlled tempos, and objective adherence records."
      />

      {/* Hero Overview */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              The Rehabilitation Challenge
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Closing the Clinic-to-Home Adherence Gap
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              In the clinic, your physical therapist provides constant tactile cues, verbal corrections, and visual reinforcement. But once at home, over 70% of orthopedic patients struggle to replicate the prescribed movement depth, pace, and form—often leading to compensatory joint habits or premature plateau.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics delivers browser-based biomechanical biofeedback that acts as your clinical guardrail. With real-time angle calculations and repetition validation, you can exercise with confidence knowing you are adhering to your therapist's protocol.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/analyze">
                  Open Movement Analyzer <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/resources/rehab">View Phased Protocols</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              Clinical Conditions
            </span>
            <h3 className="text-lg font-semibold text-foreground">Common Post-Op Programs</h3>

            <div className="space-y-3">
              {REHAB_CONDITIONS.map((c, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-muted/30 p-3.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>{c.condition}</span>
                    <span className="text-[11px] font-mono text-primary">{c.phase}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{c.focus}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-destructive/10 p-3.5 border border-destructive/20 text-xs text-destructive">
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>The Pain Boundary Rule</span>
              </div>
              <p className="leading-relaxed">
                Rehabilitation should challenge muscles, not irritate joints. Sharp, stabbing, or pinching pain is an absolute stop signal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Guided Recovery */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Key Advantages</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            How Telemetry Safeguards Orthopedic Recovery
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Four engineering principles designed to promote safe tissue adaptation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REHAB_PILLARS.map((p, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <p.icon className="h-6 w-6" />
                </div>
                <h4 className="text-base font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Rehabilitation FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {REHAB_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`rehab-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
