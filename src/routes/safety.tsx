import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  UserCheck, 
  AlertTriangle, 
  Scale, 
  Stethoscope, 
  HeartPulse, 
  StopCircle, 
  Info, 
  ChevronRight,
  Activity,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety, Clinical Governance & Responsible AI — Physiomatics" },
      { name: "description", content: "Comprehensive safety standards, clinical red flags, contraindications, on-device privacy architecture, and optical AI limitations at Physiomatics." },
      { property: "og:title", content: "Safety & Responsible AI at Physiomatics" },
      { property: "og:description", content: "Clinical safety protocols, transparent optical limits, zero video uploads, and clinician-led oversight." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Safety,
});

const principles = [
  { 
    icon: Lock, 
    t: "Private By Design (Zero Video Uploads)", 
    d: "All camera frames are processed directly inside your browser using WebAssembly and client-side models. No video stream, raw recording, or facial biometric ever leaves your device." 
  },
  { 
    icon: Eye, 
    t: "Confidence Thresholds Shown", 
    d: "Every computed joint angle includes a real-time tracking confidence score. When lighting is poor or a joint is obscured, tracking degrades gracefully rather than generating false measurements." 
  },
  { 
    icon: UserCheck, 
    t: "Clinician-in-the-Loop Model", 
    d: "Physiomatics is engineered to assist licensed physiotherapists, not replace them. Kinematic telemetry provides objective exercise data to inform clinical decision-making." 
  },
  { 
    icon: AlertTriangle, 
    t: "No Automated Medical Diagnosis", 
    d: "The software strictly measures kinematic movement metrics (angles, repetitions, velocities, symmetry). It does not diagnose medical conditions, stage pathologies, or prescribe drug regimens." 
  },
  { 
    icon: Scale, 
    t: "Honest Optical Boundaries", 
    d: "Monocular (single-camera) computer vision estimates 2D projected angles. We explicitly communicate optical parallax, depth ambiguity, and loose clothing limitations." 
  },
  { 
    icon: ShieldCheck, 
    t: "Universal Accessibility & Safe Pacing", 
    d: "Protocols feature high-contrast interfaces, large interaction zones, seated/supported movement options, and continuous prompts prioritizing user safety over speed." 
  },
];

const redFlags = [
  {
    title: "Sharp or Stabbing Joint Pain",
    desc: "A mild, stretching discomfort is expected during rehab, but acute, sharp, pinching, or stabbing pain is a signal to stop immediately."
  },
  {
    title: "Dizziness, Vertigo or Lightheadedness",
    desc: "Sudden disorientation, nausea, or feeling faint indicates cerebral hypoperfusion or inner ear disturbance. Sit down safely right away."
  },
  {
    title: "Chest Tightness, Pressure or Palpitations",
    desc: "Any sensation of chest heaviness, irregular heartbeat, or unexplained breathlessness requires immediate cessation and medical triage."
  },
  {
    title: "Radiating Numbness or Pins & Needles",
    desc: "Sensations shooting down the arm, leg, or spine suggest nerve impingement. Stop the movement and do not force range of motion."
  },
  {
    title: "Joint Locking or Sudden 'Giving Way'",
    desc: "Mechanical catching, inability to straighten a joint, or sudden collapse suggests internal derangement requiring clinical imaging."
  },
  {
    title: "Sudden Hot Swelling or Redness",
    desc: "Rapid fluid accumulation, warmth, or redness around a joint indicates acute inflammation, infection risk, or vascular compromise."
  }
];

const contraindications = [
  {
    group: "Early Post-Operative (< 6 Weeks)",
    guidance: "Patients recovering from joint replacements, tendon repairs, or spinal fusions must only perform movements cleared explicitly in writing by their orthopedic surgeon."
  },
  {
    group: "Unhealed or Suspected Fractures",
    guidance: "Do not use automated movement tracking on unhealed skeletal injuries where mechanical loading risks structural displacement."
  },
  {
    group: "Severe Balance Impairment & Fall Risk",
    guidance: "Standing exercises without a physical spotter, walker, or secure handrail are contraindicated for individuals with high fall-risk scores."
  },
  {
    group: "Unstable Cardiorespiratory Illness",
    guidance: "Uncontrolled hypertension, unstable angina, or severe COPD flare-ups require continuous clinical monitoring rather than home-based automated exercise."
  }
];

const technicalLimits = [
  {
    topic: "2D Monocular Projection",
    detail: "Standard webcams capture a single 2D plane. Out-of-plane rotations (such as transversal spinal rotation or subtle tibial torsion) are projected approximations, not full 3D motion capture laboratory grade measurements."
  },
  {
    topic: "Lighting & Contrast Dependency",
    detail: "Pose landmark estimators require clean edge contrast between the patient's limbs and background. Backlit rooms, heavy shadows, or dim environments reduce tracking accuracy."
  },
  {
    topic: "Clothing & Environmental Occlusion",
    detail: "Baggy, loose clothing, thick robes, or objects blocking the camera view (furniture, blankets, handrails) obstruct joint detection, causing temporary metric drops."
  },
  {
    topic: "Hardware & Framerate Variance",
    detail: "Variations in webcam frame rates (15 FPS vs 60 FPS) and browser hardware acceleration impact velocity calculations. Rapid ballistic movements are harder to capture accurately than controlled eccentric repetitions."
  }
];

function Safety() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical Safety & Ethics" 
        title="Safety, Clinical Governance & Responsible AI"
      >
        We believe clinical technology must be radically transparent about what it can and cannot do. Here is our formal framework for patient safety, algorithmic boundaries, and clinician oversight.
      </PageHero>

      {/* Core Principles */}
      <section className="container-page py-16">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Foundational Pillars</span>
          <h2 className="mt-2 text-3xl font-serif">Responsible Movement Intelligence</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            How we protect patient autonomy, data integrity, and clinical precision in every interaction.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.t} className="rounded-3xl border bg-card p-7 shadow-soft transition-all hover:border-primary/40">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <p.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Red Flags & Stop Conditions */}
      <section className="bg-destructive/5 border-y border-destructive/20 py-16">
        <div className="container-page">
          <div className="flex items-center gap-3 text-destructive mb-3">
            <StopCircle className="size-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Clinical Stop Conditions</span>
          </div>
          <h2 className="text-3xl font-serif">When to Stop Exercising Immediately</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            No algorithm can replace your own body awareness. If you experience any of the following "red flag" symptoms during an exercise session, halt immediately, sit down in a safe position, and seek medical attention if symptoms persist.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {redFlags.map((flag) => (
              <div key={flag.title} className="rounded-2xl border border-destructive/20 bg-background p-5 shadow-xs">
                <div className="flex items-center gap-2 font-semibold text-destructive text-sm">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>{flag.title}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{flag.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contraindications & Clinical Clearance */}
      <section className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Pre-Participation Screening</span>
            <h2 className="mt-2 text-3xl font-serif">Clinical Contraindications</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Automated computer vision movement tracking is designed for stable rehabilitation, functional mobility maintenance, and performance coaching. It is not an acute diagnostic tool and must not be used independently in high-risk scenarios.
            </p>
            <div className="mt-6 p-5 rounded-2xl bg-muted/50 border text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Stethoscope className="size-4 text-primary" />
                <span>Need Clinical Guidance?</span>
              </div>
              <p>
                If you are unsure whether your medical condition allows self-directed exercise, consult our registered physiotherapy team before initiating workouts.
              </p>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to="/contact/consultation">Schedule Clinical Consultation</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {contraindications.map((item) => (
              <div key={item.group} className="rounded-2xl border bg-card p-6 shadow-xs">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                  <span className="size-2 rounded-full bg-amber-500" />
                  {item.group}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.guidance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optical AI Limitations */}
      <section className="bg-muted/30 border-y py-16">
        <div className="container-page">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Technical Transparency</span>
            <h2 className="mt-2 text-3xl font-serif">Single-Camera Optical Limitations</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To keep Physiomatics accessible on standard smartphones and laptops without specialized depth sensors or wearable markers, we utilize single-stream 2D computer vision. Here is how this affects data output.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {technicalLimits.map((limit) => (
              <div key={limit.topic} className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Info className="size-4" />
                  </div>
                  <h3 className="font-semibold text-sm">{limit.topic}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{limit.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Link to="/how-it-works/vision" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Read how our Vision Engine handles joint vectors <ChevronRight className="size-3" />
            </Link>
            <span className="text-border">•</span>
            <Link to="/how-it-works/privacy" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Explore our client-side processing pipeline <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Notice & Footer Actions */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-8 md:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <PhoneCall className="size-3.5" />
              <span>Emergency Disclaimer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif">Physiomatics Is Not An Emergency Medical System</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              If you or someone under your care experiences sudden loss of consciousness, severe trauma, suspected stroke symptoms (facial drooping, slurred speech, sudden limb weakness), acute chest pain, or profuse bleeding, do not use this website. Immediately contact your local emergency services (such as 112, 911, or 999) or proceed to the nearest hospital emergency department.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contact/consultation">Book Clinician Consultation</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/privacy">Privacy Policy</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/terms">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
