import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Activity, 
  Camera, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  Smartphone,
  Compass,
  Lock,
  Workflow,
  BarChart3
} from "lucide-react";


export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Physiomatics Works — On-Device Biomechanical Telemetry" },
      { 
        name: "description", 
        content: "Detailed technical and clinical overview of Physiomatics: local browser pose estimation, real-time joint kinematic calculation, and zero-cloud privacy architecture." 
      },
      { property: "og:title", content: "How Physiomatics Works" },
      { property: "og:description", content: "End-to-end architecture from optical capture to clinical adherence review." },
    ],
  }),
  component: HowItWorksHub,
});

const SUBPAGES = [
  {
    icon: Workflow,
    title: "End-to-End Clinical Workflow",
    description: "Step-by-step journey from therapist exercise prescription to patient home setup, live biofeedback, and session review.",
    to: "/how-it-works/workflow",
    tag: "Workflow Guide"
  },
  {
    icon: Eye,
    title: "Computer Vision & Pose Estimation",
    description: "Deep dive into 33-point skeletal landmarking, 2D vector trigonometry, planar projection, and confidence scoring.",
    to: "/how-it-works/vision",
    tag: "AI Architecture"
  },
  {
    icon: Lock,
    title: "Zero-Cloud Privacy & Security",
    description: "Why zero video frames leave your device. Complete overview of client-side WebAssembly sandboxing and HIPAA/GDPR alignment.",
    to: "/how-it-works/privacy",
    tag: "Data Sovereignty"
  },
  {
    icon: BarChart3,
    title: "Wellness KPI Analytics Dashboard",
    description: "Monitor 15 evidence-informed physiotherapy wellness indicators—pain reduction, ROM, balance, adherence, QoL—with interactive charts and assessment forms.",
    to: "/how-it-works/kpi-dashboard",
    tag: "Analytics Demo"
  }
];


const ARCHITECTURE_LAYERS = [
  {
    layer: "01",
    name: "Optical Frame Ingestion",
    tech: "HTML5 MediaStream API",
    detail: "High-resolution video frames are ingested at 30+ FPS directly from any connected smartphone, tablet, or laptop camera."
  },
  {
    layer: "02",
    name: "Client-Side Pose Estimation",
    tech: "MediaPipe WebAssembly",
    detail: "Neural network maps 33 topological landmark coordinates in normalized 3D space with sub-15ms inference latencies on modern hardware."
  },
  {
    layer: "03",
    name: "Kinematic Angle Calculation",
    tech: "Trigonometric Vector Engine",
    detail: "Calculates articulation angles (e.g. hip-knee-ankle, shoulder-elbow) using atan2 geometry with temporal jitter smoothing."
  },
  {
    layer: "04",
    name: "Repetition State Machine",
    tech: "Hysteresis Thresholds",
    detail: "Detects rep entry and exit transitions, validating range of motion, pacing tempo, and peak excursion before counting valid repetitions."
  },
  {
    layer: "05",
    name: "Local Storage & Session Persistence",
    tech: "Browser IndexedDB / LocalStorage",
    detail: "Telemetry metrics (reps, duration, peak angles) are saved locally on the client device. Zero raw video is ever uploaded or stored remotely."
  }
];

const CORE_STEPS = [
  {
    number: "01",
    title: "Exercise Selection & Plane Framing",
    summary: "Patient or clinician chooses the target exercise protocol. The system displays exact camera placement instructions (e.g. sagittal side-view for squats, frontal view for shoulder abduction).",
    safety: "Patient must clear a 2x2 meter flat footprint free from fall hazards."
  },
  {
    number: "02",
    title: "Real-Time Landmark Detection",
    summary: "As the user performs the movement, the on-device AI tracks anatomical nodes. The system verifies joint visibility and highlights skeletal vectors in real time.",
    safety: "If limb occlusion occurs or confidence drops below 0.5, calculations pause automatically."
  },
  {
    number: "03",
    title: "Concurrent Kinematic Telemetry",
    summary: "Joint angles are computed frame-by-frame. Live visual dials and optional audio chimes guide the patient to approved range-of-motion depths without requiring eye contact with the screen.",
    safety: "Thresholds are conservative guidelines, not forced clinical targets."
  },
  {
    number: "04",
    title: "Session Analytics & Clinician Export",
    summary: "Upon completion, the patient receives instant metrics on total repetitions, average peak depth, and cadence consistency to share during clinical consultations.",
    safety: "Clinician oversight remains mandatory for interpreting biomechanical trends."
  }
];

export function HowItWorksHub() {
  return (
    <>
      <PageHero 
        eyebrow="System Architecture & Clinical Workflow" 
        title="Transparent, On-Device Movement Analysis"
        description="Discover how Physiomatics brings hospital-grade kinematic biofeedback into the patient's home—with zero video uploads, instant browser execution, and evidence-informed movement tracking."
      />

      {/* Sub-Topics Exploration Cards */}
      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {SUBPAGES.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <page.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {page.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {page.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {page.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Explore technical details</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5-Layer System Architecture */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Engineering Stack
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              5-Layer On-Device Processing Pipeline
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              From the millisecond a camera frame is captured to the final repetition count, every computational step happens inside your browser sandbox.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {ARCHITECTURE_LAYERS.map((layer) => (
              <div 
                key={layer.layer}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-xs font-bold text-primary">
                    {layer.layer}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{layer.name}</h4>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {layer.tech}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{layer.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Clinical Journey */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Patient Experience</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
            The Patient Session Journey
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How patients experience guided rehabilitation without confusing technical barriers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CORE_STEPS.map((s) => (
            <div key={s.number} className="rounded-3xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{s.number}</span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.summary}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{s.safety}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="container-page py-12 text-center">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-12 max-w-3xl mx-auto">
          <Activity className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Test Real-Time Biomechanics in Your Browser
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Experience our on-device pose estimation engine right now. No software download, account registration, or video upload needed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/analyze">
                Launch Live Movement Analyzer <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/how-it-works/workflow">Explore Clinician Workflow</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Clinical Disclaimer */}
      <section className="container-page py-6">
        <div className="rounded-2xl border border-muted bg-muted/40 p-5 text-xs text-muted-foreground text-center">
          <strong>Biomechanical Measurement Notice:</strong> On-device pose estimation estimates joint angles from 2D camera projections. Measurements serve as motivational biofeedback and adherence telemetry, not definitive clinical goniometry. Clinical diagnoses must be performed by a qualified healthcare professional.
        </div>
      </section>
    </>
  );
}
