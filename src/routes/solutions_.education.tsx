import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  GraduationCap, 
  BrainCircuit, 
  Activity, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  FlaskConical, 
  BookOpen, 
  Layers, 
  Compass,
  Sparkles
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/solutions_/education")({
  head: () => ({
    meta: [
      { title: "Academic & University Biomechanics Education — Physiomatics" },
      { 
        name: "description", 
        content: "Interactive teaching tools for physical therapy lecturers, kinesiology students, and clinical researchers to visualize biomechanics, pose estimation, and kinematic goniometry." 
      },
      { property: "og:title", content: "Academic Biomechanics Education — Physiomatics" },
      { property: "og:description", content: "Connecting physical therapy education with real-time computer vision movement analysis." },
    ],
  }),
  component: EducationPage,
});

const ACADEMIC_PILLARS = [
  {
    icon: Compass,
    title: "Planar Kinematics Visualization",
    detail: "Demonstrate sagittal and frontal motion planes in real time, showing students how skeletal vectors map to anatomical joint rotations."
  },
  {
    icon: FlaskConical,
    title: "Goniometry vs AI Comparative Labs",
    detail: "Empower students to measure subjects using universal goniometers and compare findings against automated computer vision calculations."
  },
  {
    icon: BrainCircuit,
    title: "Computer Vision Sensitivity Analysis",
    detail: "Teach optical capture limitations: analyzing how parallax angle, poor ambient lighting, and clothing occlusion influence confidence scores."
  },
  {
    icon: BookOpen,
    title: "Zero-Cost Classroom Deployment",
    detail: "Runs in the browser on student laptops and mobile devices with no software licensing fees, IT installation tickets, or specialized hardware."
  }
];

const CLASSROOM_LABS = [
  {
    lab: "Lab 01",
    title: "Planar Goniometric Validation Study",
    objectives: "Students measure passive knee flexion with manual goniometers, then run Physiomatics to compute mean absolute percentage error (MAPE) and standard deviation."
  },
  {
    lab: "Lab 02",
    title: "Perspective Parallax & Angle Distortion",
    objectives: "Students record the same squat exercise from 0°, 15°, 30°, and 45° off-axis to quantify how perspective foreshortening alters 2D vector trigonometry."
  },
  {
    lab: "Lab 03",
    title: "Repetition Cadence & Motor Fatigue Curve",
    objectives: "Students record a 20-repetition set to graph time under tension and observe how joint excursion depths degrade with neuromuscular fatigue."
  }
];

const ACADEMIC_FAQS = [
  {
    q: "Is Physiomatics an accredited degree program or physical therapy certification provider?",
    a: "No. Physiomatics is an educational software platform and movement telemetry tool. It is designed to be utilized by university professors, clinical instructors, and researchers within existing accredited physical therapy, kinesiology, or biomedical curricula."
  },
  {
    q: "Do students need to create accounts or install software on university lab computers?",
    a: "No accounts or downloads are required. The platform operates entirely inside modern web browsers (Chrome, Edge, Safari, Firefox), enabling frictionless use across university computer labs or personal student laptops."
  },
  {
    q: "Can university researchers use Physiomatics for thesis projects and undergraduate research?",
    a: "Yes! Physiomatics provides an accessible, zero-cost means to track joint kinematics, cadence, and repetition frequency for undergraduate motor control and adherence research projects."
  }
];

export function EducationPage() {
  return (
    <>
      <PageHero 
        eyebrow="Academic & Higher Education" 
        title="Connecting Biomechanics Learning With Real-Time Movement Technology"
        description="Provide physical therapy, kinesiology, and sports science students with hands-on tools to visualize skeletal kinematics, evaluate computer vision accuracy, and investigate optical movement mechanics."
      />

      {/* Hero Overview */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Interactive Biomechanics
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Bringing Movement Science to Life in the Classroom
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Teaching joint articulation, anatomical coordinate systems, and kinematic planes from static textbook diagrams often leaves students struggling to connect abstract mathematics with clinical reality.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics transforms any classroom or seminar room into an interactive movement analysis lab. Students observe 33 skeletal landmarks tracked live on video, see joint angles calculated in real time, and investigate the opportunities and boundaries of digital healthcare technology.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/resources/anatomy">
                  Explore Biomechanics Guide <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/analyze">Launch Live Analyzer in Class</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Academic Integration</h3>
                <p className="text-xs text-muted-foreground">Practical teaching resources</p>
              </div>
            </div>

            <div className="space-y-3">
              {ACADEMIC_PILLARS.map((p, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-muted/30 p-3.5 text-xs">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <p.icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{p.title}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground leading-relaxed pl-6">{p.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-muted/50 p-3.5 border border-border/60 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
                <AlertCircle className="h-4 w-4 shrink-0 text-primary" />
                <span>Academic Notice</span>
              </div>
              <p className="leading-relaxed">
                Physiomatics is provided as an educational teaching aid and research exploratory tool. It does not replace accredited clinical instruction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Classroom Laboratory Modules */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Curriculum Modules
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Turnkey Classroom Laboratory Frameworks
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Three ready-to-run practical laboratory experiments for undergraduate and postgraduate biomechanics classes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CLASSROOM_LABS.map((lab) => (
              <div key={lab.lab} className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm space-y-2">
                <span className="font-mono text-xs font-bold text-primary">{lab.lab}</span>
                <h4 className="text-sm font-semibold text-foreground">{lab.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{lab.objectives}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Education & Research FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {ACADEMIC_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`acad-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
