import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Video, 
  Camera, 
  Activity, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Stethoscope, 
  UserCheck, 
  Eye, 
  Sliders, 
  Volume2, 
  History, 
  Sparkles,
  HelpCircle
} from "lucide-react";

export const Route = createFileRoute("/how-it-works_/workflow")({
  head: () => ({
    meta: [
      { title: "Complete Clinical & Patient Workflow — Physiomatics" },
      { 
        name: "description", 
        content: "Explore the end-to-end 6-stage Physiomatics workflow: from therapist prescription to home camera capture, live biofeedback, and clinical outcome review." 
      },
      { property: "og:title", content: "End-to-End Rehabilitation Workflow — Physiomatics" },
      { property: "og:description", content: "From exercise prescription to objective recovery tracking." },
    ],
  }),
  component: WorkflowPage,
});

const WORKFLOW_STAGES = [
  {
    step: "01",
    icon: Stethoscope,
    badge: "Clinical Initiation",
    title: "Therapist Prescription & Parameter Setting",
    description: "The clinician evaluates the patient in-clinic or via telehealth, selecting the appropriate exercise protocol and defining targeted range-of-motion (ROM) thresholds and repetition goals.",
    actions: [
      "Select approved exercise pattern (e.g., squat, seated knee extension, arm raise)",
      "Define conservative ROM envelope (e.g., knee flexion limit of 90° for acute meniscal recovery)",
      "Establish repetition frequency (e.g., 2 sets of 10 repetitions, twice daily)"
    ]
  },
  {
    step: "02",
    icon: Camera,
    badge: "Spatial Calibration",
    title: "Patient Home Environmental Setup",
    description: "The patient opens Physiomatics on any smartphone, tablet, or laptop. Clear on-screen framing guidelines instruct camera positioning and safe clearance.",
    actions: [
      "Place camera at hip level, 2.0 to 2.5 meters away perpendicular to movement plane",
      "Ensure front illumination without bright backlights or windows behind subject",
      "Wear contrasting athletic clothing to ensure clean skeletal landmark edge detection"
    ]
  },
  {
    step: "03",
    icon: Activity,
    badge: "Execution & Biofeedback",
    title: "Real-Time Computer Vision & Audio Guidance",
    description: "As movement begins, the on-device MediaPipe engine tracks 33 skeletal landmarks at 30 FPS. Visual indicators and audio chimes validate each repetition without requiring continuous screen watching.",
    actions: [
      "Real-time visual joint angle dial updates concurrently with movement",
      "Auditory chime sounds upon achieving the prescribed target joint angle",
      "Repetition hysteresis counter ensures controlled descent and complete lockout"
    ]
  },
  {
    step: "04",
    icon: Sliders,
    badge: "Quality Filtering",
    title: "Automatic Confidence & Artifact Rejection",
    description: "If the patient steps out of frame, limb occlusion occurs, or lighting dips below threshold, the telemetry engine pauses rather than recording false data.",
    actions: [
      "Continuous landmark visibility scoring (threshold: min 0.5 confidence per node)",
      "Rejection of partial or uncontrolled ballistic momentum repetitions",
      "Automatic side-selection heuristic prioritizes the camera-facing limb profile"
    ]
  },
  {
    step: "05",
    icon: History,
    badge: "Session Telemetry",
    title: "Instant Session Summary & Local Persistence",
    description: "Upon session completion, the patient immediately reviews repetition count, active duration, peak angle excursion, and adherence cadence.",
    actions: [
      "Instant feedback metrics displayed on clean, accessible cards",
      "Data saved locally in client browser storage without transmitting video to the cloud",
      "Progressive session logs maintain longitudinal record of recovery milestones"
    ]
  },
  {
    step: "06",
    icon: FileText,
    badge: "Clinical Review",
    title: "Telehealth Review & Care-Plan Titration",
    description: "During follow-up appointments, the physical therapist reviews objective home exercise compliance data to inform clinical decision-making.",
    actions: [
      "Identify compliance drop-offs or fatigue-induced ROM reductions",
      "Progress exercise difficulty (e.g., deepening squat depth or adding resistance)",
      "Provide positive reinforcement grounded in verifiable objective movement telemetry"
    ]
  }
];

const COMMON_ERRORS = [
  {
    error: "Harsh Backlighting",
    cause: "Positioning camera facing a bright window or glass door.",
    solution: "Move camera so daylight or lamps illuminate the patient from the front or side."
  },
  {
    error: "Off-Axis Camera Angle",
    cause: "Placing camera at 45° for an exercise requiring sagittal profile.",
    solution: "Align camera squarely 90° perpendicular to the sagittal or frontal motion plane."
  },
  {
    error: "Baggy / Flowing Garments",
    cause: "Wearing loose bathrobes, wide skirts, or bulky jackets.",
    solution: "Wear fitted athletic shorts, leggings, or snug clothing to expose joint landmarks."
  },
  {
    error: "Camera Placed on the Floor",
    cause: "Propping phone against the floor creates upward keystone parallax.",
    solution: "Place device on a table, shelf, or chair near hip/waist height."
  }
];

function WorkflowPage() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical & Patient Protocol" 
        title="From Exercise Prescription to Objective Recovery"
        description="A structured, evidence-informed 6-stage journey that bridges in-clinic guidance with verified home rehabilitation compliance."
      />

      {/* 6-Stage Timeline */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Comprehensive Pathway</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
            The 6-Stage Rehabilitation Loop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How clinicians and patients collaborate seamlessly using browser-based biomechanical telemetry.
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {WORKFLOW_STAGES.map((stage) => (
            <div 
              key={stage.step}
              className="rounded-3xl border border-border/80 bg-card p-7 md:p-9 shadow-soft transition-all hover:border-primary/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <stage.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">STAGE {stage.step}</span>
                    <h3 className="font-display text-xl font-semibold text-foreground">{stage.title}</h3>
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground self-start sm:self-auto">
                  {stage.badge}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {stage.description}
              </p>

              <div className="mt-5 rounded-2xl bg-muted/40 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Key Protocol Actions:</h4>
                <ul className="space-y-2">
                  {stage.actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Troubleshooting Environmental Pitfalls */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Quality Assurance
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Common Environmental Pitfalls & Resolutions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Achieving consistent landmark telemetry requires standard optical conditions. Review these simple fixes for common patient setup hurdles.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {COMMON_ERRORS.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{item.error}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>Cause:</strong> {item.cause}
                </div>
                <div className="mt-2 rounded-xl bg-primary/5 p-3 text-xs text-foreground border border-primary/10">
                  <strong className="text-primary">Resolution:</strong> {item.solution}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 text-xs">
            <span className="text-muted-foreground">
              Need assistance configuring your clinic's remote patient onboarding workflow?
            </span>
            <Link to="/contact/consultation" className="font-semibold text-primary hover:underline shrink-0">
              Book Clinic Integration Consultation →
            </Link>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <section className="container-page py-12 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Experience the Workflow Firsthand
          </h2>
          <p className="text-sm text-muted-foreground">
            Test the on-device movement analyzer right in your browser or explore our computer vision architecture.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/analyze">
                Launch Live Analyzer <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/how-it-works/vision">Read Computer Vision Deep Dive</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
