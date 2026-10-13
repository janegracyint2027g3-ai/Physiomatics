import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Activity, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Maximize2, 
  Eye, 
  ArrowRight,
  Info
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/site/PageHero";
import { EXERCISES } from "@/lib/movement";
import { FAQS } from "@/lib/faq";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Clinical Resources & Exercise Biomechanics Library — Physiomatics" },
      { 
        name: "description", 
        content: "Comprehensive physiotherapy guides, joint kinematic tracking reference, patient capture setup standards, and clinical rehabilitation protocols." 
      },
      { property: "og:title", content: "Clinical Resources & Exercise Library — Physiomatics" },
      { property: "og:description", content: "In-depth exercise kinematic references, setup checklists, anatomy planes, and clinical guidelines." },
    ],
  }),
  component: Resources,
});

const RESOURCE_HUBS = [
  {
    icon: Compass,
    title: "Biomechanics & Anatomical Planes",
    description: "Detailed kinematic breakdown of the sagittal, frontal, and transverse planes, joint angles, and 2D planar projection criteria.",
    to: "/resources/anatomy",
    tag: "Clinical Theory"
  },
  {
    icon: Layers,
    title: "Phased Rehabilitation Protocols",
    description: "Evidence-informed 4-stage rehabilitation pathways from acute tissue protection to high-velocity dynamic motor control.",
    to: "/resources/rehab",
    tag: "Care Pathways"
  },
  {
    icon: HelpCircle,
    title: "Comprehensive Clinical & Technical FAQs",
    description: "Detailed answers regarding edge-computing privacy, clinical goniometry variance, elderly safety, and clinic EMR workflows.",
    to: "/resources/faqs",
    tag: "Knowledge Base"
  }
];

const SETUP_STANDARDS = [
  {
    icon: Camera,
    step: "01",
    title: "Optical Plane Alignment",
    detail: "Position your webcam or smartphone directly perpendicular to the primary movement plane (e.g. sagittal profile for squats, frontal view for shoulder raises). Keep lens height roughly at pelvic/hip height."
  },
  {
    icon: Eye,
    step: "02",
    title: "Subject Framing & Distance",
    detail: "Maintain 2.0 to 2.5 meters (6.5 to 8 feet) from the camera. The patient's entire body—from vertex of the skull down through the soles of both feet—must stay within the frame across full excursion."
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Lighting & Silhouette Contrast",
    detail: "Ensure front-facing or diffuse ambient illumination. Avoid harsh backlighting or windows directly behind the patient, which cast silhouettes and decrease landmark confidence scores."
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Stable Footing & Safety Clearance",
    detail: "Clear a 2x2 meter flat floor space free of slip hazards, loose rugs, or clutter. For elderly or impaired balance users, always position a sturdy unwheeled chair within arm's reach."
  }
];

export function Resources() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical & Technical Resource Center" 
        title="Evidence-Informed Movement Guides & Knowledge Hub"
        description="Explore biomechanical telemetry principles, validated home setup guidelines, phased rehabilitation pathways, and our on-device exercise library."
      />

      {/* Primary Sub-Hub Cards */}
      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {RESOURCE_HUBS.map((hub) => (
            <Link
              key={hub.to}
              to={hub.to}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <hub.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {hub.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {hub.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {hub.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-primary">
                <span>Explore guide</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Exercise Library Deep Dive */}
      <section className="container-page py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Computer Vision Telemetry</div>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Active Exercise Telemetry Models
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
              Each exercise is mapped using high-confidence landmark vectors running locally in your browser. Real-time feedback guides velocity, range-of-motion thresholds, and repetition count.
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-90"
          >
            <Activity className="h-4 w-4" />
            <span>Launch Live Analyzer</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {Object.values(EXERCISES).map((e) => (
            <article 
              key={e.id} 
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:border-primary/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {e.jointLabel}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">Threshold: {e.enter}° - {e.exit}°</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{e.name}</h3>
                
                <div className="mt-4 rounded-2xl bg-muted/50 p-3.5 text-xs">
                  <span className="font-semibold text-foreground">Camera Perspective:</span>
                  <div className="mt-0.5 text-muted-foreground">{e.camera}</div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {e.instructions}
                </p>

                <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Calculates angle across 3 key skeletal nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Real-time Repetition hysteresis validation</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <Link 
                  to="/analyze" 
                  search={{ exercise: e.id }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <span>Practice {e.name}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Optical Capture & Quality Standards */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Best Practice Protocol
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Patient Environmental Capture Standards
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Biomechanical computer vision relies on high signal-to-noise optical capture. Adhering to these four standardized environmental steps ensures landmark confidence scores above 0.85.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SETUP_STANDARDS.map((s) => (
              <div key={s.step} className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{s.step}</span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mt-3 text-base font-semibold text-foreground">{s.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-primary/5 p-4 border border-primary/20 text-xs">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Clinician Note:</strong> Remind patients that loose, flowing garments can obscure joint articulation. Snug athletic apparel provides optimal anatomical tracking.
              </span>
            </div>
            <Link to="/resources/anatomy" className="shrink-0 font-semibold text-primary hover:underline">
              Read Biomechanics Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* Clinical FAQ Accordion */}
      <section className="container-page max-w-4xl py-12">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Clarifications & Answers</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
            Frequently Asked Clinical Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Key details on how Physiomatics integrates with conventional physical therapy care.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {FAQS.slice(0, 6).map((f) => (
            <AccordionItem key={f.q} value={f.q} className="rounded-2xl border border-border bg-card px-5 py-1">
              <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <Link 
            to="/resources/faqs" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <span>View all 14+ technical & clinical questions in FAQ directory</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Clinical Disclaimer Banner */}
      <section className="container-page py-6">
        <div className="flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-950 dark:text-amber-100">Educational & Telemetry Scope Only</h4>
            <p className="leading-relaxed">
              Physiomatics resources, exercise libraries, and computer vision estimates are intended exclusively for guidance, educational review, and motor performance biofeedback. They do not constitute formal medical diagnosis, physical therapy prescription, or individualized clinical clearance. Always consult your licensed physical therapist or physician before initiating, modifying, or progressing any exercise regimen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
