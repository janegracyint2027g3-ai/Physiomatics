import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ScanLine, 
  Dumbbell, 
  LineChart, 
  UserCheck, 
  Lock, 
  Accessibility, 
  ShieldCheck, 
  PlayCircle, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "The Physiomatics Platform — Intelligent Movement & Rehabilitation Telemetry" },
      { 
        name: "description", 
        content: "Explore the complete Physiomatics ecosystem: real-time pose estimation, guided exercise training, longitudinal progress monitoring, and clinician review workflows." 
      },
      { property: "og:title", content: "The Physiomatics Platform" },
      { property: "og:description", content: "On-device movement analysis, exercise guidance, and recovery progress tracking." },
    ],
  }),
  component: Platform,
});

const PLATFORM_MODULES = [
  {
    icon: ScanLine,
    title: "AI Movement Analytics",
    status: "Active & Live",
    badge: "Core Telemetry",
    summary: "Real-time 33-point pose estimation, joint flexion trigonometry, and repetition hysteresis counting inside any modern browser.",
    to: "/platform/movement",
    bullets: ["Sub-15ms client inference", "Zero video transmission", "Angle dials & audio chimes"]
  },
  {
    icon: Dumbbell,
    title: "Exercise Training & Guidance",
    status: "Active & Live",
    badge: "Motor Learning",
    summary: "Standardized clinical protocols, camera framing checklists, and tempo recommendations for post-op and preventative regimens.",
    to: "/platform/training",
    bullets: ["Sagittal & frontal alignments", "Common compensation cues", "Elderly-adapted seated variations"]
  },
  {
    icon: LineChart,
    title: "Progress Telemetry & Trends",
    status: "Active & Live",
    badge: "Recovery Insights",
    summary: "Longitudinal session logs, repetition consistency, and peak joint excursion histories persisted locally in browser storage.",
    to: "/platform/progress",
    bullets: ["Zero-cloud client storage", "Excursion trend curves", "Fatigue cadence insights"]
  },
  {
    icon: UserCheck,
    title: "Clinician Review Dashboard",
    status: "Pilot & Manual Review",
    badge: "Clinical Governance",
    summary: "Collaborative review workflows for physical therapists to evaluate home compliance, adjust ROM targets, and titrate care plans.",
    to: "/platform/dashboard",
    bullets: ["Objective compliance records", "Custom target angle presets", "Telehealth consultation support"]
  }
];

const CAPABILITY_HIGHLIGHTS = [
  {
    stat: "100%",
    label: "Client-Side Processing",
    detail: "All pose neural network inferencing executes within WebAssembly on the patient's device."
  },
  {
    stat: "30+ FPS",
    label: "Continuous Telemetry",
    detail: "Smooth real-time kinematic calculations across supported modern mobile and desktop browsers."
  },
  {
    stat: "0 KB",
    label: "Cloud Video Footprint",
    detail: "Zero video frames or raw facial biometric buffers ever leave the user's hardware."
  },
  {
    stat: "33 Nodes",
    label: "Topological Landmarks",
    detail: "Complete kinetic chain tracking covering shoulders, spine, hips, knees, and ankles."
  }
];

export function Platform() {
  return (
    <>
      <PageHero 
        eyebrow="Integrated Movement Architecture" 
        title="One Unified Platform for Guided Rehabilitation Telemetry"
        description="Connecting clinical exercise prescription with real-time on-device computer vision. Empowering patients to exercise accurately at home while giving physical therapists objective compliance insights."
      />

      {/* Primary 4 Modules Grid */}
      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {PLATFORM_MODULES.map((m) => (
            <Link 
              key={m.title} 
              to={m.to}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <m.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {m.badge}
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {m.status}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {m.summary}
                </p>

                <div className="mt-5 space-y-2 border-t pt-4">
                  {m.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary pt-4 border-t border-border/60">
                <span>Explore module specifications</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Technical Metrics Banner */}
      <section className="container-page py-8">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Technical Performance</span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Engineered for Immediate Clinical Utility
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Built on open web standards to eliminate installation friction while maximizing patient privacy.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITY_HIGHLIGHTS.map((cap, idx) => (
              <div key={idx} className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center backdrop-blur-sm">
                <div className="font-display text-3xl font-bold text-primary">{cap.stat}</div>
                <div className="mt-1 text-xs font-semibold text-foreground uppercase tracking-wider">{cap.label}</div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{cap.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 3-Step Rehabilitation Feedback Loop */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Continuous Care Cycle</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
            How the Platform Connects Care
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A frictionless loop between patient home execution and therapist clinical review.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 mb-5">
                <PlayCircle className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs font-bold text-primary">STEP 01</span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">1. Learn & Calibrate</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Patients review structured exercise instructions, camera framing guides, and target joint angle thresholds before starting their routine.
              </p>
            </div>
            <Link to="/platform/training" className="mt-6 text-xs font-semibold text-primary hover:underline">
              Review Training Framework →
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-5">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs font-bold text-primary">STEP 02</span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">2. Execute with Biofeedback</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                The webcam tracks movement in real time. Concurrent audio cues and visual angle indicators confirm proper depth and pacing.
              </p>
            </div>
            <Link to="/platform/movement" className="mt-6 text-xs font-semibold text-primary hover:underline">
              Review Movement Analytics →
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs font-bold text-primary">STEP 03</span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">3. Track & Progress</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Session telemetry is saved locally. Clinicians and patients review longitudinal recovery trends to safely titrate exercise load.
              </p>
            </div>
            <Link to="/platform/progress" className="mt-6 text-xs font-semibold text-primary hover:underline">
              Review Progress Monitoring →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-8 md:p-12 text-center shadow-soft">
          <Stethoscope className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Experience the Future of Home Rehabilitation Telemetry
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-sm text-muted-foreground">
            Test the on-device analyzer right now or connect with our team to explore clinical pilot deployment.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/analyze">
                Launch Live Movement Analyzer <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact/demo">Schedule 25-Min Clinical Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Clinical Disclaimer */}
      <section className="container-page py-6">
        <div className="rounded-2xl border border-muted bg-muted/40 p-4 text-center text-xs text-muted-foreground">
          <strong>Clinical Safety & Telemetry Scope:</strong> Physiomatics delivers biofeedback and motor learning telemetry to support physical therapy programs. It does not replace hands-on diagnostic examination or clinical supervision. Always perform rehabilitation under licensed clinician guidance.
        </div>
      </section>
    </>
  );
}
