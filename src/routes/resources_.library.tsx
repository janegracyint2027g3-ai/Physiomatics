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
  Camera,
  Info,
  Stethoscope,
  BookOpen
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

interface ExerciseItem {
  id: string;
  name: string;
  category: string;
  plane: string;
  targetJoint: string;
  thresholds: string;
  tempo: string;
  cameraSetup: string;
  muscles: string;
  compensations: string;
  clinicalUtility: string;
  isAiSupported?: boolean;
}

const EXERCISE_CATALOGUE: ExerciseItem[] = [
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
    clinicalUtility: "Fundamental functional movement for gait power, stair climbing, and general lower-extremity kinetic chain restoration.",
    isAiSupported: true
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
    clinicalUtility: "Safely strengthens knee extensors post-op TKA or for frail seniors without introducing fall risk.",
    isAiSupported: true
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
    clinicalUtility: "Restores overhead reach capacity post-rotator cuff repair, subacromial decompression, or adhesive capsulitis.",
    isAiSupported: true
  },
  {
    id: "hip_hinge",
    name: "Hip Hinge (Romanian Deadlift Pattern)",
    category: "Posterior Kinetic Chain",
    plane: "Sagittal Plane (Side View)",
    targetJoint: "Coxofemoral (Hip) Flexion / Extension",
    thresholds: "Sagittal hip flexion 60°–80° with neutral spine",
    tempo: "3-1-1 (3s eccentric hinge, 1s isometric hold, 1s hip drive)",
    cameraSetup: "Camera at pelvic height, side profile 2.5m away with clear view of spine from sacrum to occiput.",
    muscles: "Hamstrings (Biceps Femoris, Semitendinosus), Gluteus Maximus, Erector Spinae",
    compensations: "Knees shifting forward into squat pattern, lumbar hyperflexion (rounding lower back), cervical hyperextension.",
    clinicalUtility: "Teaches lumbo-pelvic dissociation, reducing shear stress on lumbar discs during lifting and daily bending tasks.",
    isAiSupported: false
  },
  {
    id: "calf_raise",
    name: "Standing Heel / Calf Raise",
    category: "Distal Lower Extremity & Ankle",
    plane: "Frontal / Posterior Sagittal",
    targetJoint: "Talocrural Plantarflexion",
    thresholds: "Plantarflexion > 30° elevation",
    tempo: "2-2-3 (2s concentric lift, 2s peak hold, 3s eccentric lowering)",
    cameraSetup: "Camera near floor level (30–50cm), viewing ankles and lower leg against high-contrast backdrop.",
    muscles: "Gastrocnemius, Soleus, Tibialis Posterior, Peroneus Longus",
    compensations: "Ankle inversion/eversion rolling, shifting body forward onto countertop, bending knees to fake height.",
    clinicalUtility: "Essential for push-off power in gait, Achilles tendinopathy rehabilitation, and venous return pump efficiency.",
    isAiSupported: false
  },
  {
    id: "hip_abduction",
    name: "Side-Lying Hip Abduction",
    category: "Pelvic Stability & Gluteal",
    plane: "Frontal Plane (Coronal)",
    targetJoint: "Hip Abduction Angle",
    thresholds: "Target 30°–40° abduction without pelvic rotation",
    tempo: "2-1-2 (2s lift, 1s top squeeze, 2s controlled descent)",
    cameraSetup: "Camera mounted 1.5m away at mat level, perpendicular to long axis of the body.",
    muscles: "Gluteus Medius (Posterior Fibers), Gluteus Minimus, Tensor Fasciae Latae",
    compensations: "Rolling pelvis backwards, flexing hip forward to substitute TFL, hiking the lumbar quadratus lumborum.",
    clinicalUtility: "Strengthens lateral pelvic stabilizers to eliminate Trendelenburg gait and alleviate patellofemoral knee pain.",
    isAiSupported: false
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
  },
  {
    q: "How do I know if an exercise should be progressed?",
    a: "Progression should never be based solely on repetition count. A movement should be progressed only when performed with flawless kinematic form, zero compensation patterns, controlled cadence, and acceptable pain levels (< 2/10) as cleared by your treating physiotherapist."
  },
  {
    q: "What is the difference between normal muscle soreness and injury pain?",
    a: "Delayed onset muscle soreness (DOMS) is a generalized, dull, aching tightness felt 24 to 48 hours after exercise in muscular bellies. Injury pain is typically sharp, localized to a joint or tendon, happens during the movement, or radiates along a nerve line."
  }
];

export function LibraryPage() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical Biomechanics Catalogue" 
        title="Supported Exercise Kinematic Library"
        description="Comprehensive technical and clinical parameters for rehabilitation movements: target joints, angle thresholds, muscle activation, camera perspectives, and common compensation faults."
      />

      {/* Clinical Disclaimer Banner */}
      <section className="container-page pt-8">
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Stethoscope className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Clinical Exercise Prescription Notice</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-3xl leading-relaxed">
                The parameters catalogued below serve as educational reference standards and computer vision benchmarks. Exercise dosage (sets, reps, resistance, and range of motion) must be tailored to your pathology and stage of recovery by a licensed physiotherapist.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link to="/contact/consultation">Consult a Physiotherapist</Link>
          </Button>
        </div>
      </section>

      {/* Catalogue Grid */}
      <section className="container-page py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Biomechanical Specs</span>
            <h2 className="text-2xl md:text-3xl font-serif mt-1">Exercise Profiles & Pose Protocols</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Live AI Monitored
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              Clinical Reference
            </span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {EXERCISE_CATALOGUE.map((ex) => (
            <article 
              key={ex.id}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary truncate">
                    {ex.targetJoint}
                  </span>
                  {ex.isAiSupported ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                      <Sparkles className="size-3" /> Live Vision AI
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                      Reference
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {ex.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{ex.category}</p>

                <div className="mt-5 space-y-3 border-t pt-4 text-xs">
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-primary" /> Camera Setup & Plane:
                    </span>
                    <p className="mt-0.5 text-muted-foreground">{ex.cameraSetup} ({ex.plane})</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" /> Target Angles & Tempo:
                    </span>
                    <p className="mt-0.5 font-mono text-muted-foreground">{ex.thresholds} · Tempo: {ex.tempo}</p>
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

                  <div className="p-3 rounded-xl bg-muted/50 border text-muted-foreground">
                    <span className="font-semibold text-foreground text-[11px] flex items-center gap-1">
                      <BookOpen className="size-3 text-primary" /> Clinical Rationale:
                    </span>
                    <p className="mt-1 text-[11px] leading-relaxed">{ex.clinicalUtility}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                {ex.isAiSupported ? (
                  <Button asChild variant="hero" className="w-full text-xs h-9">
                    <Link to="/analyze">
                      Launch {ex.name} Analyzer <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full text-xs h-9">
                    <Link to="/resources/rehab">
                      View Rehabilitation Guides <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Exercise Library & Telemetry FAQs
        </h2>
        <p className="text-center text-xs text-muted-foreground mt-2">
          How computer vision joint tracking works alongside clinical prescription.
        </p>
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
