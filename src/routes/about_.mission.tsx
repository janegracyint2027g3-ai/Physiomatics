import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  Target, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  Activity, 
  Scale, 
  Users2, 
  BookOpen, 
  Stethoscope 
} from "lucide-react";

export const Route = createFileRoute("/about_/mission")({
  head: () => ({
    meta: [
      { title: "Our Mission & Rehabilitation Philosophy — Physiomatics" },
      { name: "description", content: "Learn how Physiomatics bridges the clinic-to-home recovery gap through on-device computer vision and physical therapist collaboration." },
      { property: "og:title", content: "Our Mission — Safe, Accessible Movement Intelligence" },
    ],
  }),
  component: MissionPage,
});

const missionPillars = [
  {
    title: "1. Overcoming the Clinic-to-Home Dropoff",
    subtitle: "Reinventing Static Paper Handouts",
    description: "Traditional rehabilitation gives patients paper stick-figure sheets that fail to communicate dynamic velocity, joint angles, or real-time compensation. We replace static handouts with interactive, visual feedback that guides each repetition safely.",
    icon: Activity,
  },
  {
    title: "2. Amplifying Clinicians, Not Replacing Them",
    subtitle: "Zero-Diagnosis Medical Ethics",
    description: "Physical therapy is an art and science practiced by licensed clinicians. Physiomatics deliberately provides biomechanical telemetry—leaving clinical diagnosis, surgical clearance, and personalized program adjustments entirely in human expert hands.",
    icon: Stethoscope,
  },
  {
    title: "3. Radical On-Device Patient Privacy",
    subtitle: "Zero-Cloud Video Architecture",
    description: "Patients perform exercises in their living rooms, bedrooms, and clinical recovery suites. We architected our algorithms using client-side WebAssembly to ensure video pixels are processed in the browser and never transmitted or stored remotely.",
    icon: ShieldCheck,
  },
  {
    title: "4. Universal Geriatric & Motor Accessibility",
    subtitle: "Designed for Vulnerable Populations",
    description: "Modern health apps often cater only to the young and able-bodied. We specifically design high-contrast colorways, giant click targets, audio-visual prompts, and seated routines to empower elderly patients and those with stroke or arthritis.",
    icon: HeartHandshake,
  },
];

const motorLearningPrinciples = [
  {
    principle: "Knowledge of Performance (KP)",
    application: "Real-time visual skeletal overlay highlights joint angle alignment as the movement happens, enabling immediate proprioceptive adjustment.",
  },
  {
    principle: "Compensatory Movement Detection",
    application: "Identifies dangerous trunk-lean during squats or shoulder-hiking during arm flexion before faulty motor patterns become habitual.",
  },
  {
    principle: "Graduated Progression Tracking",
    application: "Stores longitudinal angle history so physiotherapists can objectively see 5° of improved knee extension over consecutive weeks.",
  },
  {
    principle: "Psychological Efficacy & Motivation",
    application: "Transforms solitary, repetitive home regimens into clear, measurable milestones that build patient confidence and adherence.",
  },
];

function MissionPage() {
  return (
    <>
      <PageHero 
        eyebrow="Our Mission & Purpose" 
        title="Closing the Critical Gap Between Clinic Visits and Home Recovery."
      >
        Rehabilitation does not succeed in 45-minute weekly appointments alone—it is decided during the hundreds of repetitions performed at home. We empower patients and therapists with privacy-first movement intelligence.
      </PageHero>

      {/* Narrative Section */}
      <section className="container-page py-16">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            The Problem We Exist to Solve
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-foreground leading-tight">
            Why 70% of Rehabilitation Programs Fail in the Living Room
          </h2>
          <div className="mt-6 text-base sm:text-lg text-muted-foreground space-y-4 leading-relaxed">
            <p>
              When a patient leaves a physical therapy clinic after joint replacement, sports trauma, or stroke rehabilitation, they are given a prescribed home regimen. But within 72 hours, doubts emerge: <em>"Am I bending too deep? Is my knee caving inward? Am I risking re-injury?"</em>
            </p>
            <p>
              Without immediate feedback, patients either stop doing their exercises out of fear or continue performing them with harmful biomechanical compensations. This leads to chronic joint inflammation, prolonged recovery times, and unnecessary re-admissions.
            </p>
            <p className="font-semibold text-foreground">
              Physiomatics was founded on a simple conviction: technology should give patients immediate reassurance and give physiotherapists objective clarity—without requiring expensive sensors or sacrificing privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Four Core Pillars Grid */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Foundational Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">The Four Commitments of Physiomatics</h2>
            <p className="text-muted-foreground mt-3">
              Every feature we build and every algorithm we test must satisfy these four core principles.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {missionPillars.map((pillar) => (
              <div 
                key={pillar.title} 
                className="rounded-3xl border bg-card p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="rounded-2xl bg-primary/10 p-3.5 text-primary">
                    <pillar.icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{pillar.title}</h3>
                    <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{pillar.subtitle}</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motor Learning Science Section */}
      <section className="container-page py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">The Clinical Science</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Grounded in Motor Learning Theory</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              How biofeedback transforms neural plasticity and accelerates muscular re-education.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {motorLearningPrinciples.map((item, idx) => (
              <div key={idx} className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-base text-foreground mb-2">
                    <Scale className="size-4 text-primary" /> {item.principle}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.application}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border bg-primary/5 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-foreground">Are You a Practicing Clinician?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Explore how our therapist dashboard gives you longitudinal visibility into patient adherence.
              </p>
            </div>
            <Button asChild variant="hero" className="shrink-0">
              <Link to="/platform/dashboard">Explore Therapist Dashboard <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#1a0a2e] to-[#2c134d] p-10 sm:p-14 text-white text-center shadow-xl max-w-4xl mx-auto">
          <Target className="size-12 text-[#5AA9AC] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Experience Our Movement Platform</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Test on-device pose estimation right in your browser or explore our library of evidence-backed exercises.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/analyze">Try Video Movement Analysis <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/resources/library">Browse Exercise Library</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/safety">Read Safety Disclaimers</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

