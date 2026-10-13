import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ScanFace, 
  Focus, 
  EyeOff, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Compass, 
  Scale, 
  ShieldCheck, 
  Code2,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/how-it-works_/vision")({
  head: () => ({
    meta: [
      { title: "Computer Vision & Pose Estimation Architecture — Physiomatics" },
      { 
        name: "description", 
        content: "In-depth engineering review of MediaPipe 33-point pose estimation, joint vector kinematics, planar projection goniometry, and on-device WebAssembly execution." 
      },
      { property: "og:title", content: "Computer Vision Architecture — Physiomatics" },
      { property: "og:description", content: "How edge machine learning extracts joint angles from standard 2D webcams." },
    ],
  }),
  component: VisionPage,
});

const LANDMARK_GROUPS = [
  {
    category: "Cranial & Facial Orientation",
    indices: "0 - 10",
    nodes: "Nose, Inner/Outer Canthi, Ears, Mouth angles",
    purpose: "Establishes head tilt, cervical posture, and sagittal gaze direction."
  },
  {
    category: "Torso & Pelvic Girdle",
    indices: "11, 12, 23, 24",
    nodes: "Left/Right Acromion (Shoulders), ASIS / Greater Trochanter (Hips)",
    purpose: "Forms the trunk reference axis for calculating pelvic tilt, lateral trunk flexion, and spine neutrality."
  },
  {
    category: "Upper Extremity Kinematics",
    indices: "13 - 22",
    nodes: "Elbows, Wrists, Pinkies, Index fingers, Thumbs",
    purpose: "Measures glenohumeral elevation, elbow flexion/extension, and forearm rotational trajectories."
  },
  {
    category: "Lower Extremity Kinetic Chain",
    indices: "25 - 32",
    nodes: "Knees (Lateral epicondyles), Ankles (Malleoli), Heels, Foot indices",
    purpose: "Measures knee flexion angle, hip excursion, and closed-chain weight-bearing symmetry."
  }
];

const VALIDATION_METRICS = [
  {
    name: "Sub-15ms Edge Latency",
    desc: "Runs locally using SIMD-accelerated WebAssembly and WebGL shaders, avoiding network roundtrips."
  },
  {
    name: "33 Topological Nodes",
    desc: "Maps full-body anatomical landmarks concurrently for holistic kinetic chain tracking."
  },
  {
    name: "Planar Accuracy Envelope",
    desc: "Achieves ±3° to 5° mean absolute error compared to manual universal goniometry in orthogonal planes."
  },
  {
    name: "Dual Hysteresis Gates",
    desc: "Eliminates false repetition counting by requiring complete entry and exit across boundary angles."
  }
];

export function VisionPage() {
  return (
    <>
      <PageHero 
        eyebrow="Machine Learning & Edge Telemetry" 
        title="Inside Our Computer Vision Architecture"
        description="Discover how browser-based neural networks turn standard 2D webcam video into high-frequency joint kinematic estimates without uploading a single frame to the cloud."
      />

      {/* Overview Grid */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Foundational Principle</span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
                What is On-Device Pose Estimation?
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Human pose estimation is a computer vision technique that infers the spatial arrangement of skeletal joints from regular visual sensor data. Rather than relying on expensive multi-camera optical motion capture laboratories or wearable IMU sensors, Physiomatics executes a convolutional and transformer-assisted neural network entirely inside modern web browsers.
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The inference engine identifies 33 distinctive anatomical landmarks on every video frame at 30+ frames per second. Each landmark output provides normalized coordinates $(X, Y, Z)$ along with an independent statistical confidence score between 0.0 and 1.0.
              </p>
            </div>

            {/* Landmark Distribution */}
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-soft">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Topological Landmark Mapping
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {LANDMARK_GROUPS.map((group, i) => (
                  <div key={i} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{group.category}</span>
                      <span className="font-mono text-primary font-bold">{group.indices}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">{group.nodes}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80 leading-relaxed">{group.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigonometric Angle Formulation */}
            <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Code2 className="h-4 w-4" />
                <span>Kinematic Formulation</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                How Joint Angles Are Calculated
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To measure a joint angle (such as knee flexion between hip $A$, knee $B$, and ankle $C$), the platform constructs two 2D vectors: $\vec{u} = A - B$ and $\vec{v} = C - B$. The absolute angle $\theta$ is extracted using arc-tangent geometry:
              </p>
              
              <div className="rounded-xl bg-muted/80 p-4 font-mono text-xs text-foreground overflow-x-auto border border-border">
                <code>
                  {`function calculateJointAngle(pointA, pointB, pointC) {
  const angleAB = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  const angleCB = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x);
  let degrees = Math.abs(((angleAB - angleCB) * 180) / Math.PI);
  if (degrees > 180) degrees = 360 - degrees;
  return degrees; // Yields internal joint angle [0° - 180°]
}`}
                </code>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                By maintaining continuous angle history, our state machine recognizes transitions past defined <strong className="text-foreground">enter</strong> (depth threshold) and <strong className="text-foreground">exit</strong> (lockout recovery) triggers, preventing the system from registering partial or bouncing repetitions.
              </p>
            </div>

            {/* Planar vs 3D MoCap Honest Comparison */}
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Scale className="h-4 w-4" />
                <span>Clinical Fidelity & Limitations</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Planar 2D Projection vs 3D Marker Laboratories
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Clinical transparency is essential. Single-camera computer vision does not replace gold-standard 12-camera Vicon stereophotogrammetry or dual-fluoroscopy. Understanding how they compare ensures proper clinical utility:
              </p>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <h4 className="font-semibold text-primary">Physiomatics Web-Based CV</h4>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>• Zero specialized hardware (runs on phones/laptops)</li>
                    <li>• Instant home access without clinic appointments</li>
                    <li>• Optimal for sagittal & frontal planar excursions</li>
                    <li>• Subject to parallax if viewing angle is oblique</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-muted bg-muted/30 p-4 space-y-2">
                  <h4 className="font-semibold text-foreground">3D Biomechanics Laboratory</h4>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>• Millimeter-accurate multi-axis rotational tracking</li>
                    <li>• Immune to single-camera planar occlusion</li>
                    <li>• Requires $50,000+ laboratory installations</li>
                    <li>• Impractical for daily longitudinal home compliance</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Info & Controls */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-soft space-y-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Interactive Validation
              </span>
              <h3 className="font-display text-xl font-semibold text-foreground">
                See Pose Estimation in Action
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Launch your camera to see 33-point skeletal landmarking overlaid in real time. Observe confidence scores and flexion calculations instantly.
              </p>
              <Button asChild variant="hero" className="w-full">
                <Link to="/analyze">
                  Open Movement Analyzer <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Engine Performance</h4>
              <div className="space-y-3">
                {VALIDATION_METRICS.map((vm, idx) => (
                  <div key={idx} className="border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-primary">{vm.name}</span>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{vm.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-semibold mb-1 text-amber-950 dark:text-amber-100">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Clinical Interpretation Disclaimer</span>
              </div>
              <p className="leading-relaxed">
                Computer vision estimates are designed to track gross motor consistency, repetition cadence, and range-of-motion progress over time. They must not be used as isolated diagnostic proof of pathology.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Navigation Footer */}
      <section className="container-page py-8 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <Link to="/how-it-works/workflow" className="hover:text-primary transition-colors flex items-center gap-1.5 font-semibold">
            ← Previous: Clinical Workflow
          </Link>
          <Link to="/how-it-works/privacy" className="hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-primary">
            Next: Data Privacy & Zero-Cloud Security →
          </Link>
        </div>
      </section>
    </>
  );
}
