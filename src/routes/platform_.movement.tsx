import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Activity, 
  Gauge, 
  Target, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  ScanLine, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Scale, 
  Workflow
} from "lucide-react";

export const Route = createFileRoute("/platform_/movement")({
  head: () => ({
    meta: [
      { title: "Kinematic Movement Mechanics & Angle Segmentation — Physiomatics" },
      { 
        name: "description", 
        content: "Explore how Physiomatics computes real-time joint angles, segments repetition cycles using hysteresis logic, and distinguishes measured pixels from clinical interpretation." 
      },
      { property: "og:title", content: "Movement Analysis Mechanics — Physiomatics" },
      { property: "og:description", content: "From pixels to posture: real-time biomechanical analysis on your device." },
    ],
  }),
  component: MovementPage,
});

const TELEMETRY_TIERS = [
  {
    tier: "01",
    label: "Measured Data",
    desc: "The exact 2D pixel coordinates $(X, Y)$ of 33 anatomical landmarks in each incoming video frame, bounded by the camera's resolution and frame rate.",
    clinicalMeaning: "Objective raw geometric observations directly extracted from optical sensors."
  },
  {
    tier: "02",
    label: "Estimated Kinematics",
    desc: "The computed joint flexion angles and repetition counts calculated using trigonometric vectors and state-machine hysteresis.",
    clinicalMeaning: "Approximated biomechanical signals calibrated to planar movement trajectories."
  },
  {
    tier: "03",
    label: "Interpreted Clinical Meaning",
    desc: "The medical assessment of what those angles signify: e.g. muscular inhibition, capsular tightness, or motor recruitment deficits.",
    clinicalMeaning: "Strictly the domain of a licensed physical therapist or medical clinician."
  }
];

const REPETITION_PIPELINE = [
  {
    step: "A",
    title: "Resting Baseline",
    detail: "Subject stands upright within the camera frame. The algorithm verifies joint landmark visibility confidence (>0.5)."
  },
  {
    step: "B",
    title: "Eccentric Descent",
    detail: "Joint angle begins decreasing. Real-time visual dial shows angle in degrees as descent progresses."
  },
  {
    step: "C",
    title: "Target Depth Gate",
    detail: "Angle crosses the 'enter' threshold (e.g. <120° for squat). Auditory confirmation sounds to notify depth achievement."
  },
  {
    step: "D",
    title: "Concentric Ascent",
    detail: "Subject rises out of the squat. The state machine awaits full lockout across the 'exit' threshold (e.g. >155°)."
  },
  {
    step: "E",
    title: "Repetition Logged",
    detail: "Upon crossing exit threshold, the repetition counter increments by +1 and records peak depth and cadence timestamp."
  }
];

export function MovementPage() {
  return (
    <>
      <PageHero 
        eyebrow="Biomechanical Telemetry Mechanics" 
        title="From Pixels to Posture: Real-Time Movement Segmentation"
        description="Discover the mathematical and algorithmic architecture turning raw webcam video frames into structured, clinically useful movement observations."
      />

      {/* Hero Overview Split */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Sensorless Motion Tracking
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Real-Time Skeletal Landmarking Without Wearables
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Traditional biomechanics requires wearable straps, inertial measurement units (IMUs), or magnetic tracking beacons. These devices require charging, pairing, physical calibration, and frequent patient assistance.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics uses on-device computer vision to detect anatomical landmarks directly from standard video feeds. By measuring the relative angles between skeletal nodes (e.g., hip-to-knee and knee-to-ankle vectors), the system monitors range of motion, repetition cadence, and movement consistency instantly in the browser.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/analyze">
                  Open Live Movement Analyzer <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/resources/anatomy">Explore Anatomical Planes Guide</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">33 Skeletal Nodes</div>
                <div className="text-xs text-muted-foreground">Mapped across the human kinetic chain</div>
              </div>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4 border border-border/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Inference Speed:</span>
                <span className="font-mono font-bold text-foreground">~30 FPS (Sub-15ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Client Architecture:</span>
                <span className="font-mono font-bold text-foreground">WebAssembly & WebGL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Video Transmission:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0 KB (Zero Upload)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Repetition Logic:</span>
                <span className="font-mono font-bold text-foreground">Dual Hysteresis Gates</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All calculations execute within the local device memory. Camera buffers are immediately discarded after vector calculation.
            </p>
          </div>
        </div>
      </section>

      {/* The 3 Tiers of Telemetry */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Measurement Rigor</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            The 3 Tiers of Movement Telemetry
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Maintaining scientific and ethical clarity between raw sensor data and clinical interpretation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TELEMETRY_TIERS.map((t) => (
            <div key={t.tier} className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-primary">TIER {t.tier}</span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{t.label}</h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Clinical Role:</span>
                <p className="mt-1 text-xs text-foreground font-medium">{t.clinicalMeaning}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repetition State Machine Pipeline */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Algorithmic Logic
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              How a Repetition is Validated
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To prevent accidental bounces or partial movements from being counted, our state machine enforces a rigorous 5-step lifecycle.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {REPETITION_PIPELINE.map((p) => (
              <div key={p.step} className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
                <span className="font-mono text-xs font-bold text-primary">PHASE {p.step}</span>
                <h4 className="mt-2 text-sm font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Critical Clinical Scope Disclaimer */}
      <section className="container-page py-6">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-semibold text-amber-950 dark:text-amber-100 text-sm mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Scope of Biomechanical Observations</span>
          </div>
          <p className="leading-relaxed">
            Joint angle estimates generated by single 2D camera feeds are sensitive to optical perspective, subject-camera alignment, and clothing. They provide valuable behavioral biofeedback and relative compliance tracking, but must never be treated as definitive clinical goniometric proof of orthopedic pathology or cure.
          </p>
        </div>
      </section>
    </>
  );
}
