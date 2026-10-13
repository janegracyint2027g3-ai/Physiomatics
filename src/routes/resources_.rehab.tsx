import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Activity, 
  Compass, 
  Stethoscope, 
  FileText 
} from "lucide-react";

export const Route = createFileRoute("/resources_/rehab")({
  head: () => ({
    meta: [
      { title: "Clinical Rehabilitation Guides & Recovery Protocols — Physiomatics" },
      { name: "description", content: "Evidence-conscious clinical rehabilitation guides: setting up camera angles, phased post-operative recovery, biofeedback motor learning, and clinician collaboration." },
      { property: "og:title", content: "Rehabilitation Guides — Physiomatics" },
    ],
  }),
  component: RehabGuidesPage,
});

const guides = [
  {
    title: "1. The Home Environment & Optical Setup Manual",
    tag: "SETUP MASTERY",
    readTime: "4 min read",
    icon: Camera,
    intro: "Computer vision landmark detection requires adequate contrast, stable perspective, and clear limb boundary recognition.",
    keyPoints: [
      { heading: "Lighting Orientation", text: "Position your light source (lamp or window) directly in front of you. Never exercise directly in front of a bright window, as backlighting turns your body into a silhouette, obscuring joint landmarks." },
      { heading: "Camera Height & Distance", text: "Place your phone or laptop 2.0 to 2.8 meters away at approximately hip or navel height. Both your head and your feet must remain visible at the top and bottom of every repetition." },
      { heading: "Clothing Contrast", text: "Wear form-fitting gym clothes that contrast sharply with your room background. Avoid loose, billowy trousers that hide knee joint articulation." },
    ],
    action: { label: "Test Setup in Analyzer", link: "/analyze" },
  },
  {
    title: "2. The Four Stages of Post-Operative Joint Rehabilitation",
    tag: "RECOVERY TIMELINE",
    readTime: "6 min read",
    icon: Activity,
    intro: "Rehabilitation is not a linear sprint; it is an orchestrated biological healing progression that must respect tissue maturation.",
    keyPoints: [
      { heading: "Phase I: Protection & Effusion Control (Weeks 0–2)", text: "Primary goal is reducing swelling, protecting surgical repairs, and achieving gentle passive extension (e.g., safe terminal knee extension) within prescribed limits." },
      { heading: "Phase II: Active-Assisted Mobility (Weeks 2–6)", text: "Restoring functional range of motion while minimizing compensatory trunk lean. Gradual introduction of Seated Knee Extensions under therapist supervision." },
      { heading: "Phase III: Progressive Resistance & Proprioception (Weeks 6–12)", text: "Strengthening primary movers and stabilizers. Introduction of controlled partial squats with visual feedback to prevent knee valgus." },
      { heading: "Phase IV: Functional Return & Symmetry (Month 3+)", text: "Eliminating bilateral asymmetry and restoring functional movement velocity before returning to sports or recreational activities." },
    ],
    action: { label: "Explore Exercise Library", link: "/resources/library" },
  },
  {
    title: "3. Motor Learning & Proprioceptive Biofeedback",
    tag: "SCIENCE OF MOVEMENT",
    readTime: "5 min read",
    icon: Compass,
    intro: "Why real-time visual biofeedback accelerates neuromotor reorganization faster than unmonitored home practice.",
    keyPoints: [
      { heading: "Schmidt's Schema & Closed-Loop Control", text: "When you can see your real-time joint angle on screen, your brain forms a tight sensory-motor feedback loop, correcting faulty joint paths before they solidify as bad habits." },
      { heading: "Extrinsic Feedback (Knowledge of Performance)", text: "Visual feedback shows you whether your knee reached 90° or stopped at 70°, eliminating guesswork and building self-efficacy." },
      { heading: "Prevention of Pathological Compensation", text: "Post-injury patients instinctively shift weight to their unaffected limb. Real-time angular cues reveal this asymmetry so you can correct it safely." },
    ],
    action: { label: "Read Biomechanics Guide", link: "/resources/anatomy" },
  },
  {
    title: "4. The Clinician Collaboration Handbook",
    tag: "PATIENT ADVOCACY",
    readTime: "5 min read",
    icon: Stethoscope,
    intro: "How to bring your home session metrics into your physical therapy clinic to make every consultation more productive.",
    keyPoints: [
      { heading: "Tracking Consistency Trends", text: "Show your clinician your session frequency logs. Knowing you completed 4 sessions per week allows your therapist to advance your sets safely." },
      { heading: "Reporting Range-of-Motion Plateau", text: "If your knee flexion has hovered at 85° for two weeks despite adherence, this flags the need for targeted manual joint mobilization in the clinic." },
      { heading: "Open Communication on Discomfort", text: "Never hesitate to show your physiotherapist the exact angle where discomfort starts so they can modify your exercise parameters." },
    ],
    action: { label: "View Progress Monitoring", link: "/platform/progress" },
  },
];

const safetyChecklist = [
  "Clear a 3-meter radius around your exercise zone free of rugs, wires, or pets.",
  "Have a sturdy, unpadded chair nearby for seated stability if you feel unsteady.",
  "Check that your phone or tablet is securely propped and will not fall mid-repetition.",
  "Wear non-slip footwear or exercise barefoot on a verified non-slip yoga mat.",
  "If you feel dizziness, sharp joint pain, or hot swelling, stop immediately.",
];

function RehabGuidesPage() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical Rehabilitation Guides" 
        title="Evidence-Conscious Guides for Safe Home Recovery."
      >
        Learn how to configure your home space, navigate post-surgical recovery phases, utilize motor biofeedback, and collaborate productively with your physiotherapist.
      </PageHero>

      {/* Safety Checklist Banner */}
      <section className="container-page py-12">
        <div className="rounded-3xl border bg-amber-500/10 border-amber-500/20 p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 font-bold text-lg mb-4">
            <AlertTriangle className="size-6 shrink-0" />
            <span>The 5-Point Pre-Exercise Safety Checklist</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-foreground/90">
            {safetyChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-Depth Guides Grid */}
      <section className="container-page pb-20">
        <div className="space-y-12 max-w-4xl mx-auto">
          {guides.map((guide) => (
            <article 
              key={guide.title}
              className="rounded-3xl border bg-card p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  <guide.icon className="size-4" />
                  <span>{guide.tag}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {guide.readTime}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                {guide.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                {guide.intro}
              </p>

              <div className="space-y-6 pt-6 border-t">
                {guide.keyPoints.map((pt, pIdx) => (
                  <div key={pIdx} className="space-y-1.5">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary shrink-0" />
                      {pt.heading}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground font-medium">
                  Evidence-based educational material · Always defer to clinical guidance
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link to={guide.action.link}>
                    {guide.action.label} <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Contact Guidance */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl border bg-gradient-to-r from-card to-primary/5 p-8 sm:p-10 text-center shadow-sm">
          <BookOpen className="size-10 text-primary mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Need Custom Protocols for Your Clinic?</h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mt-2 leading-relaxed">
            We collaborate with orthopedic practices to adapt digital guides, range-of-motion bounds, and compliance reports to your clinic's surgical recovery protocols.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/contact">Discuss Clinical Protocol Integration <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/resources/faqs">Browse Clinical FAQs</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

