import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  Layers, 
  Activity, 
  Compass, 
  Gauge, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  ScanLine 
} from "lucide-react";

export const Route = createFileRoute("/resources_/anatomy")({
  head: () => ({
    meta: [
      { title: "Clinical Anatomy & Biomechanics of Movement — Physiomatics" },
      { name: "description", content: "Master human movement mechanics: anatomical planes, joint vectors, knee flexion angles, scapular rhythm, and 2D single-camera perspective mathematics." },
      { property: "og:title", content: "Anatomy & Biomechanics Guide — Physiomatics" },
    ],
  }),
  component: AnatomyPage,
});

const anatomicalPlanes = [
  {
    plane: "1. Sagittal Plane",
    axis: "Mediolateral Axis",
    movements: "Flexion & Extension",
    clinicalRelevance: "Dominant plane for walking, squatting, and knee extensions. Optimal camera view: strict side profile (90° perpendicular).",
  },
  {
    plane: "2. Frontal (Coronal) Plane",
    axis: "Anteroposterior Axis",
    movements: "Abduction, Adduction & Lateral Flexion",
    clinicalRelevance: "Crucial for evaluating knee valgus (knock-knees), hip drop (Trendelenburg sign), and lateral trunk lean. Optimal camera view: direct front facing.",
  },
  {
    plane: "3. Transverse (Horizontal) Plane",
    axis: "Longitudinal / Vertical Axis",
    movements: "Internal & External Rotation",
    clinicalRelevance: "Critical for tibial rotation and spinal twisting. Requires specialized calibration on single 2D cameras due to foreshortening.",
  },
];

const jointMechanics = [
  {
    joint: "The Knee Complex (Tibiofemoral & Patellofemoral)",
    angles: "0° (Full Extension) to 135°–145° (Full Flexion)",
    keyMechanics: "The knee is a modified hinge joint with a subtle 'screw-home' rotational mechanism during terminal extension. In rehabilitation, tracking knee flexion depth prevents overloading early graft repairs (e.g. ACL reconstruction limits in weeks 1–6).",
    warning: "Knee valgus (inward caving of the patella past the second toe) during squatting creates destructive shear on the ACL and medial meniscus.",
  },
  {
    joint: "The Hip Articulation (Acetabulofemoral)",
    angles: "0° Extension to 120° Flexion",
    keyMechanics: "A multi-axial ball-and-socket joint that transfers ground reaction forces to the spine. Differentiating between true femoral-on-pelvic hip flexion and compensatory lumbar spine rounding is essential for lower-back safety.",
    warning: "Restricted hip mobility often causes patients to bend through their lumbar spine instead of hinging properly through the hips.",
  },
  {
    joint: "The Shoulder Girdle (Glenohumeral & Scapulothoracic)",
    angles: "0° Resting to 170°–180° Complete Elevation",
    keyMechanics: "For every 2° of glenohumeral arm elevation, the scapula must rotate upward by 1° (a 2:1 scapulohumeral rhythm). Raising the arm in the plane of the scapula (scaption, ~30° anterior to frontal) protects the supraspinatus tendon from subacromial impingement.",
    warning: "Shoulder hiking (excessive upper trapezius recruitment) before 90° of arm raise indicates weakness in the rotator cuff or serratus anterior.",
  },
];

const cameraPhysics = [
  {
    factor: "Planar Projection (2D vs. 3D)",
    detail: "A camera sensor captures light on a 2D pixel grid. When a bone moves toward or away from the camera, its apparent length compresses on screen (foreshortening).",
    solution: "Position the phone exactly 90° perpendicular to the intended exercise plane.",
  },
  {
    factor: "Parallax Distortion",
    detail: "Placing a phone too low on the floor causes joints further away (shoulders) to appear distorted relative to joints near the bottom (ankles).",
    solution: "Keep camera mounted or resting at mid-torso or hip height (approximately 90–110 cm off the floor).",
  },
  {
    factor: "Joint Landmark Occlusion",
    detail: "If an arm, bag, or loose clothing covers the hip joint, the AI neural network must infer coordinates from neighboring keypoints.",
    solution: "Wear form-fitting athletic wear with contrasting colors to the room background.",
  },
];

function AnatomyPage() {
  return (
    <>
      <PageHero 
        eyebrow="Anatomy & Biomechanics" 
        title="The Skeletal Mechanics and Vectors of Human Movement."
      >
        Learn how clinical physical therapists evaluate joint angles, identify compensatory patterns, and interpret 2D camera geometry during home rehabilitation.
      </PageHero>

      {/* Anatomical Planes Section */}
      <section className="container-page py-16">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Spatial Foundations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-foreground">
            The Three Cardinal Planes of Movement
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
            Human movement occurs across three primary geometric planes. In clinical practice, measuring an exercise accurately requires matching the camera angle directly to the plane of primary motion.
          </p>

          <div className="grid gap-6 sm:grid-cols-3 mt-10">
            {anatomicalPlanes.map((plane) => (
              <div key={plane.plane} className="rounded-3xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary w-fit mb-3">
                    <Compass className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{plane.plane}</h3>
                  <div className="text-xs font-semibold text-primary mt-1">{plane.axis}</div>
                  <div className="text-xs font-medium text-foreground/80 mt-1 mb-3">Primary: {plane.movements}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {plane.clinicalRelevance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Major Joints & Kinematic Angles */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Kinematic Deep-Dive</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Core Joints Monitored by Physiomatics</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              How reference angles, clinical ranges, and compensatory habits are evaluated by our exercise algorithms.
            </p>
          </div>

          <div className="space-y-8">
            {jointMechanics.map((jm) => (
              <div key={jm.joint} className="rounded-3xl border bg-card p-8 sm:p-10 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">{jm.joint}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    Normative: {jm.angles}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  {jm.keyMechanics}
                </p>

                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-foreground/90">
                    <strong className="text-foreground">Clinical Compensation Watch:</strong> {jm.warning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2D Camera Physics & Distortion */}
      <section className="container-page py-20 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Computer Vision Mathematics</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">2D Planar Projection vs. 3D Goniometry</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-base">
            Why transparency about single-camera optical physics matters in responsible healthcare engineering.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cameraPhysics.map((cp) => (
            <div key={cp.factor} className="rounded-3xl border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-foreground mb-2">{cp.factor}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{cp.detail}</p>
              </div>
              <div className="pt-3 border-t text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                ✓ <strong>Mitigation:</strong> {cp.solution}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border bg-card p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h4 className="text-lg font-bold text-foreground">See Real-Time Landmark Tracking in Action</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Open your browser camera to see live skeletal coordinates, angle calculations, and confidence scores.
            </p>
          </div>
          <Button asChild variant="hero" className="shrink-0">
            <Link to="/analyze">Launch Movement Analyzer <ArrowRight className="size-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}

