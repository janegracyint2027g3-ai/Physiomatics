import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  BookOpen, 
  Video, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Sparkles, 
  Dumbbell, 
  HeartHandshake,
  HelpCircle,
  Compass
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/platform_/training")({
  head: () => ({
    meta: [
      { title: "Physiotherapy Exercise Training & Motor Learning — Physiomatics" },
      { 
        name: "description", 
        content: "Structured motor learning protocols, cadence standards, compensatory movement identification, and safe exercise execution guides." 
      },
      { property: "og:title", content: "Physiotherapy Exercise Training — Physiomatics" },
      { property: "og:description", content: "Educational movement foundations, motor learning science, and clinical safety." },
    ],
  }),
  component: TrainingPage,
});

const MOTOR_LEARNING_PILLARS = [
  {
    icon: Compass,
    title: "Knowledge of Performance (KP)",
    description: "Biofeedback that focuses on movement quality, joint angles, and symmetry—rather than just the raw number of completed repetitions."
  },
  {
    icon: Clock,
    title: "Controlled Cadence & Tempo",
    description: "Rehabilitation demands controlled eccentric muscle loading (e.g. 3-second lowering) rather than uncontrolled ballistic momentum."
  },
  {
    icon: ShieldCheck,
    title: "Compensatory Fault Detection",
    description: "Identifying maladaptive movement substitutions, such as knee valgus collapse or excessive lumbar extension, before they become habitual."
  },
  {
    icon: Activity,
    title: "Phased Load Progression",
    description: "Systematic advancement from non-weight-bearing seated motions to closed-chain functional multi-joint patterns as motor control improves."
  }
];

const EXERCISE_CATEGORIES = [
  {
    category: "Lower Kinetic Chain",
    exercises: [
      { name: "Bodyweight Squat", target: "Knee & Hip Flexion", plane: "Sagittal Plane", reps: "8 - 12 Reps", tempo: "3-1-2" },
      { name: "Seated Knee Extension", target: "Quadriceps Activation", plane: "Sagittal Plane", reps: "10 - 15 Reps", tempo: "2-2-2" },
      { name: "Sit-to-Stand Transfer", target: "Functional Lower Limb Power", plane: "Sagittal Plane", reps: "6 - 10 Reps", tempo: "2-1-2" }
    ]
  },
  {
    category: "Upper Kinetic Chain & Scapular",
    exercises: [
      { name: "Standing Arm Raise (Scaption)", target: "Glenohumeral & Rotator Cuff", plane: "Scapular Plane (30°)", reps: "8 - 12 Reps", tempo: "2-1-2" },
      { name: "Shoulder Abduction", target: "Deltoid & Supraspinatus", plane: "Frontal Plane", reps: "8 - 12 Reps", tempo: "2-1-2" }
    ]
  }
];

const PRE_SESSION_CHECKLIST = [
  "Confirm your physical therapist has formally authorized the selected exercise module.",
  "Clear a 2x2 meter flat floor space free of cords, rugs, or furniture.",
  "Wear supportive, non-slip footwear and snug athletic clothing.",
  "Have a sturdy, unwheeled chair or railing nearby if balance is compromised.",
  "Keep a glass of water nearby and stay adequately hydrated."
];

const TRAINING_FAQS = [
  {
    q: "Is Physiomatics Training an accredited academic course or physical therapy certification?",
    a: "No. Physiomatics provides supplemental educational resources, biomechanical biofeedback, and movement telemetry. It is not an accredited medical training program or certification body. It is designed to reinforce your licensed clinician's instructions."
  },
  {
    q: "How does motor learning biofeedback improve home exercise compliance?",
    a: "Research in motor learning demonstrates that concurrent biofeedback (real-time angle indicators and auditory cues) enhances proprioceptive awareness, prevents compensatory movement faults, and increases patient confidence during unsupervised home sessions."
  },
  {
    q: "What should I do if I experience pain during an exercise session?",
    a: "Mild discomfort (0 to 2 on a 10-point scale) can be typical during early recovery, but any sharp, pinching, or escalating pain (3 or higher) is an immediate stop signal. Terminate the exercise session and contact your treating physical therapist."
  }
];

export function TrainingPage() {
  return (
    <>
      <PageHero 
        eyebrow="Motor Learning & Movement Education" 
        title="Evidence-Informed Exercise Training & Biomechanics"
        description="Master proper movement kinematics, understand joint trajectories, and cultivate safe home exercise habits backed by contemporary motor learning science."
      />

      {/* Hero Overview */}
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              The Science of Rehabilitation
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Moving Beyond Static Handouts
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              For decades, home exercise programs have relied on photocopied 2D paper drawings or static YouTube videos. Patients often wonder: <em>"Am I bending my knee far enough? Am I moving too fast? Is my back rounding?"</em>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics replaces guesswork with real-time on-device feedback. By breaking down each exercise into clear phase milestones, cadence guidance, and compensatory fault checks, patients build muscle memory and movement confidence safely at home.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/analyze">
                  Practice with Live Biofeedback <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/resources">Browse Full Exercise Library</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-7 shadow-soft space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Pre-Session Safety Rules</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Safety Checklist Before Starting</h3>

            <ul className="space-y-3">
              {PRE_SESSION_CHECKLIST.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950 dark:text-amber-100">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>The Pain Stop Rule</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Never push through sharp or increasing pain. Mild stretching sensation is acceptable; sharp joint impingement is not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Motor Learning */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Methodological Foundation</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Our 4 Pillars of Guided Motor Learning
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built on established clinical physical therapy and motor control principles.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MOTOR_LEARNING_PILLARS.map((p, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <p.icon className="h-6 w-6" />
                </div>
                <h4 className="text-base font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Exercise Categories Table */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-card p-8 md:p-10 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Exercise Protocols</span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Supported Training Movements & Cadence
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Standardized parameters calibrated for accurate computer vision tracking.
            </p>
          </div>

          <div className="space-y-8">
            {EXERCISE_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-base text-foreground mb-4 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  <span>{cat.category}</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="p-3 font-semibold text-foreground">Exercise Name</th>
                        <th className="p-3 font-semibold text-foreground">Kinematic Target</th>
                        <th className="p-3 font-semibold text-foreground">Camera Plane</th>
                        <th className="p-3 font-semibold text-foreground">Prescribed Reps</th>
                        <th className="p-3 font-semibold text-foreground">Tempo (Ecc-Iso-Con)</th>
                        <th className="p-3 font-semibold text-foreground text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {cat.exercises.map((ex, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-medium text-foreground">{ex.name}</td>
                          <td className="p-3 text-muted-foreground">{ex.target}</td>
                          <td className="p-3 text-muted-foreground">{ex.plane}</td>
                          <td className="p-3 text-muted-foreground">{ex.reps}</td>
                          <td className="p-3 font-mono text-muted-foreground">{ex.tempo}</td>
                          <td className="p-3 text-right">
                            <Link 
                              to="/analyze" 
                              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                            >
                              <span>Practice</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Exercise Training FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {TRAINING_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`training-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
