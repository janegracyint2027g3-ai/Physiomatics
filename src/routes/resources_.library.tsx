import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Video, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Dumbbell, 
  Layers, 
  Eye, 
  Sparkles,
  Camera
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/resources_/library")({
  head: () => ({
    meta: [
      { title: "Clinical Exercise Library & Kinematic Telemetry — Physiomatics" },
      { 
        name: "description", 
        content: "Detailed biomechanical guides for supported physiotherapy exercises: target joints, angle thresholds, camera perspectives, common compensation faults, and cadence." 
      },
      { property: "og:title", content: "Clinical Exercise Library — Physiomatics" },
      { property: "og:description", content: "Biomechanical parameters, joint angles, and setup guidance for supported exercises." },
    ],
  }),
  component: LibraryPage,
});

const EXERCISE_CATALOGUE = [
  {
    id: "squat",
    name: "Bodyweight Squat",
    category: "Closed-Chain Lower Extremity",
    plane: "Sagittal Plane (Side View)",
    targetJoint: "Knee & Hip Flexion",
    thresholds: "Enter < 120° · Exit > 155°",
    tempo: "3-1-2 (3s down, 1s hold, 2s up)",
    cameraSetup: "Phone or laptop at hip height, 2.0 - 2.5m away, perpendicular side profile showing full body.",
    muscles: "Quadriceps, Gluteus Maximus, Hamstrings, Core Stabilizers",
    compensations: "Excessive forward trunk lean, heels lifting off floor, premature lumbar rounding, knee valgus collapse.",
    clinicalUtility: "Fundamental functional movement for gait power, stair climbing, and general lower-extremity kinetic chain restoration."
  },
  {
    id: "knee_ext",
    name: "Seated Knee Extension",
    category: "Open-Chain Lower Extremity (Elderly Adapted)",
    plane: "Sagittal Plane (Side View)",
    targetJoint: "Knee Extension Angle",
    thresholds: "Enter > 145° · Exit < 115°",
    tempo: "2-2-2 (2s up, 2s squeeze, 2s lower)",
    cameraSetup: "Camera at seated knee height, side profile showing chair legs, torso, and full lower leg travel.",
    muscles: "Quadriceps (Rectus Femoris, Vastus Medialis / Lateralis)",
    compensations: "Leaning back into chair, hiking the hip, swinging the leg ballistically using momentum.",
    clinicalUtility: "Safely strengthens knee extensors post-op TKA or for frail seniors without introducing fall risk."
  },
  {
    id: "arm_raise",
    name: "Standing Arm Raise (Scaption)",
    category: "Upper Extremity & Scapular",
    plane: "Scapular Plane (30° anterior to frontal)",
    targetJoint: "Shoulder Elevation (Glenohumeral)",
    thresholds: "Enter > 140° · Exit < 90°",
    tempo: "2-1-2 (2s raise, 1s pause, 2s descent)",
    cameraSetup: "Camera at chest height, front-facing 2.0m away, full upper body and arms visible at top of travel.",
    muscles: "Supraspinatus, Anterior & Middle Deltoid, Serratus Anterior",
    compensations: "Superior shoulder shrugging (upper trapezius substitution), hyperextending the lumbar spine.",
    clinicalUtility: "Restores overhead reach capacity post-rotator cuff repair, subacromial decompression, or adhesive capsulitis."
  }
];

const LIBRARY_FAQS = [
  {
    q: "Why are some exercises measured from the side and others from the front?",
    a: "2D computer vision tracking calculates angles within a single planar projection. Movements with primary flexion/extension (like squats and seated knee extensions) happen in the sagittal plane, requiring a 90° side profile camera. Overhead raises occur primarily in frontal/scapular planes, requiring a front-facing camera."
  },
  {
    q: "Can I adjust the angle depth if my doctor ordered a strict 90° flexion limit?",
    a: "Yes. In clinical practice, physical therapists customize depth parameters. Our analyzer provides real-time numerical dials so patients can stop at their clinician's approved limit rather than pushing past safe ranges."
  },
  {
    q: "What causes a repetition not to count in the analyzer?",
    a: "Our repetition engine requires crossing both the 'enter' depth threshold and returning past the 'exit' lockout threshold. Partial repetitions, excessive bouncing, or moments where body landmarks become occluded will prevent a repetition from incrementing."
  }
];

export function LibraryPage() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical Biomechanics Catalogue" 
        title="Supported Exercise Kinematic Library"
        description="Comprehensive technical and clinical parameters for every movement tracked by Physiomatics: joint angle thresholds, muscle activation, camera perspectives, and common compensation faults."
      />

      {/* Catalogue Grid */}
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {EXERCISE_CATALOGUE.map((ex) => (
            <article 
              key={ex.id}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {ex.targetJoint}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">{ex.thresholds}</span>
                </div>

                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {ex.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{ex.category}</p>

                <div className="mt-5 space-y-3 border-t pt-4 text-xs">
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-primary" /> Camera Setup:
                    </span>
                    <p className="mt-0.5 text-muted-foreground">{ex.cameraSetup}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" /> Prescribed Tempo:
                    </span>
                    <p className="mt-0.5 font-mono text-muted-foreground">{ex.tempo}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Dumbbell className="h-3.5 w-3.5 text-primary" /> Primary Musculature:
                    </span>
                    <p className="mt-0.5 text-muted-foreground">{ex.muscles}</p>
                  </div>

                  <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                    <span className="font-semibold flex items-center gap-1 text-amber-950 dark:text-amber-100">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Watch for Compensation:
                    </span>
                    <p className="mt-1 text-[11px] leading-relaxed">{ex.compensations}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <Button asChild variant="hero" className="w-full text-xs h-9">
                  <Link to="/analyze" search={{ exercise: ex.id }}>
                    Launch {ex.name} Analyzer <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Exercise Library FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {LIBRARY_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`library-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
