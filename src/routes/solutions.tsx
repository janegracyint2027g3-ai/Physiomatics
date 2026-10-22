import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SolutionCard } from "@/components/site/SolutionCard";
import { 
  HeartHandshake, 
  Activity, 
  Users, 
  Building2, 
  GraduationCap, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Stethoscope,
  PhoneCall,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";
import { PHYSIOTHERAPY_SOLUTIONS } from "@/data/physiotherapySolutions";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Physiotherapy Solutions Hub & Clinical Disciplines — Physiomatics" },
      { 
        name: "description", 
        content: "Explore the comprehensive Physiomatics Physiotherapy Solutions Hub covering 8 primary clinical disciplines: Orthopedic, Neurological, Sports, Geriatric, Cardiorespiratory, Posture & Spinal, Pediatric, and Women's Health." 
      },
      { property: "og:title", content: "Physiotherapy Solutions Hub — Physiomatics" },
      { property: "og:description", content: "Evidence-informed physiotherapy solutions and on-device movement telemetry for patients, clinics, and specialists." },
    ],
  }),
  component: Solutions,
});

const SETTINGS_SOLUTIONS_DATA = [
  { 
    id: "elderly",
    icon: HeartHandshake,
    title: "Elderly Care & Fall Prevention", 
    tag: "Geriatric Mobility",
    to: "/solutions/elderly",
    problem: "Home exercise programs are frequently abandoned by older adults due to complex app navigation, small font sizes, or fear of losing balance during unsupervised standing exercises.",
    benefits: [
      "Accessible high-contrast UI with large touch targets and simplified text.",
      "Dedicated seated exercise protocols (e.g., seated knee extensions) to minimize fall risk.",
      "Intuitive camera framing requiring zero complex hardware interaction."
    ],
    workflow: "A family member or visiting nurse positions the device at hip height. The patient performs seated knee extensions while real-time audio chimes confirm full extension.",
    limitations: "Safety Note: Does not replace in-person balance supervision. Never perform unassisted standing routines if at high risk of unsteadiness.",
    wa: "elderly"
  },
  { 
    id: "rehab",
    icon: Activity,
    title: "Orthopedic Injury Rehabilitation", 
    tag: "Post-Op Recovery",
    to: "/solutions/rehab",
    problem: "Post-surgical and injured patients (TKA, ACL, rotator cuff) struggle to gauge safe range-of-motion limits between weekly clinic appointments, often either under-rehabilitating or overloading tissues.",
    benefits: [
      "Real-time visual joint angle dials guide movements to approved therapeutic depths.",
      "Repetition hysteresis prevents bouncing, ensuring controlled eccentric loading.",
      "Objective session histories saved locally to share during clinical progress reviews."
    ],
    workflow: "Patients record prescribed exercises using their smartphone or webcam. Joint angles and repetition tempos are tracked and logged without cloud video streaming.",
    limitations: "Safety Note: Do not push through sharp pain. Discontinue exercise immediately if joint swelling or acute discomfort occurs.",
    wa: "rehab"
  },
  { 
    id: "caregiver",
    icon: Users,
    title: "Family & Professional Caregiver Support", 
    tag: "Supervised Routines",
    to: "/solutions/caregiver",
    problem: "Caregivers often feel overwhelmed attempting to manually count repetitions, monitor correct posture, and encourage adherence while juggling complex daily care responsibilities.",
    benefits: [
      "The on-device computer vision automates repetition counting and depth validation.",
      "Caregivers can focus entirely on patient emotional comfort and physical stability.",
      "Zero-cloud video processing preserves family privacy inside private home spaces."
    ],
    workflow: "The caregiver opens Physiomatics on a tablet or laptop, follows the 30-second room framing checklist, and supervises the patient while the platform tracks movement.",
    limitations: "Safety Note: Caregivers should never alter therapist-prescribed exercise parameters without consulting the primary physical therapist.",
    wa: "elderly"
  },
  { 
    id: "clinics",
    icon: Building2,
    title: "Outpatient Physiotherapy Clinics", 
    tag: "Practice Modernization",
    to: "/solutions/clinics",
    problem: "Clinicians lack objective visibility into home exercise compliance, forcing them to rely on subjective patient memory during bi-weekly follow-up evaluations.",
    benefits: [
      "Objective compliance telemetry (completed sessions, reps, peak excursion) between visits.",
      "Reduced appointment time spent retraining basic movement cadence.",
      "Strengthened patient accountability and therapeutic rapport."
    ],
    workflow: "Clinicians prescribe validated movement modules. Patients complete their routines at home, sharing locally saved session metrics during progress consultations.",
    limitations: "Limitation: 2D webcam pose estimation provides valuable adherence estimates but does not replace hands-on clinical goniometry.",
    wa: "clinic"
  },
  { 
    id: "education",
    icon: GraduationCap,
    title: "Academic & University Biomechanics Labs", 
    tag: "Higher Education",
    to: "/solutions/education",
    problem: "Physical therapy and kinesiology students often struggle to grasp the relationship between 2D planar projection, joint kinematics, and computer vision limitations through textbooks alone.",
    benefits: [
      "Real-time interactive MediaPipe 33-point skeletal landmarking demonstrated in class.",
      "Practical laboratory comparisons between manual goniometry and AI angle estimation.",
      "Instant browser-based execution without expensive lab software licensing."
    ],
    workflow: "Lecturers demonstrate live movement capture in lecture halls. Students test parallax distortion and evaluate confidence thresholds on their own laptops.",
    limitations: "Academic Notice: Intended as an educational teaching aid to illustrate biomechanical concepts, not an accredited certification course.",
    wa: "education"
  }
];

export function Solutions() {
  const [filter, setFilter] = useState<string>("all");

  const filteredSolutions = PHYSIOTHERAPY_SOLUTIONS.filter((item) => {
    if (filter === "all") return true;
    if (filter === "musculoskeletal") return item.id === "orthopedic" || item.id === "sports" || item.id === "posture-spinal";
    if (filter === "neuromotor") return item.id === "neurological" || item.id === "pediatric";
    if (filter === "specialized") return item.id === "geriatric" || item.id === "cardiorespiratory" || item.id === "womens-health";
    return true;
  });

  return (
    <>
      <PageHero 
        eyebrow="PHYSIOTHERAPY SOLUTIONS HUB" 
        title="Comprehensive Physiotherapy Solutions & Clinical Disciplines"
        description="Empowering evidence-informed rehabilitation workflows through on-device movement telemetry, clinical exercise education, and longitudinal recovery tracking across eight primary healthcare disciplines."
      />

      {/* Prominent Hub Introduction */}
      <section className="container-page py-10">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#17072a] via-[#260e40] to-[#1a082e] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-[#5AA9AC]/20 blur-3xl" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#5AA9AC] border border-white/15">
              <Sparkles className="size-3.5" />
              Next-Generation Movement Telemetry
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Bridging Clinical Prescriptions and Home Movement Adherence
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Physiomatics supports physiotherapy education, rehabilitation workflows, real-time pose and movement analysis, and adherence monitoring. Designed for patients, solo practitioners, clinics, and academic institutions—all running client-side with zero-cloud video storage to protect personal privacy.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild size="sm" className="rounded-full bg-[#5AA9AC] hover:bg-[#48989b] text-white border-0 font-bold">
                <Link to="/analyze">Test AI Video Analytics →</Link>
              </Button>
              <Button asChild size="sm" variant="outline-inverse" className="rounded-full">
                <Link to="/book">Book Clinical Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Primary Clinical Disciplines Grid */}
      <section className="container-page py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 rounded-full bg-[#592787]" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Primary Specialties
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Explore Physiotherapy Specialties
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Select any of the eight clinical physiotherapy disciplines below for phased treatment journeys, indications, and educational guidance.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border/70 self-start sm:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-white dark:bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All (8)
            </button>
            <button
              onClick={() => setFilter("musculoskeletal")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === "musculoskeletal"
                  ? "bg-white dark:bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Musculoskeletal
            </button>
            <button
              onClick={() => setFilter("neuromotor")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === "neuromotor"
                  ? "bg-white dark:bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Neuromotor
            </button>
            <button
              onClick={() => setFilter("specialized")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === "specialized"
                  ? "bg-white dark:bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Specialized Care
            </button>
          </div>
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSolutions.map((sol) => (
            <SolutionCard key={sol.id} solution={sol} />
          ))}
        </div>
      </section>

      {/* Target Populations & Delivery Models */}
      <section className="container-page py-16 border-t border-border/60">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5AA9AC]">
            Delivery Settings &amp; Populations
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">
            Target Rehabilitation Environments &amp; Operational Models
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            How Physiomatics is deployed across patient homes, outpatient clinics, caregiving teams, and academic research settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SETTINGS_SOLUTIONS_DATA.map((sol) => (
            <article 
              key={sol.id} 
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <sol.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                    {sol.tag}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                  {sol.title}
                </h3>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {sol.problem}
                </p>

                <div className="mt-4 space-y-1.5 pt-1">
                  {sol.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#5AA9AC] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <Link 
                  to={sol.to as any} 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Learn more</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <Button asChild size="sm" variant="ghost" className="text-xs h-7 px-2.5">
                  <Link to="/contact">Consultation →</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Clinical Disclaimer */}
      <section className="container-page py-6 pb-14">
        <div className="flex items-start gap-4 rounded-3xl border border-muted bg-muted/40 p-6 text-xs text-muted-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Clinical Governance &amp; Diagnostic Scope</h4>
            <p className="leading-relaxed">
              Physiomatics solutions are designed to support and reinforce clinical care, exercise education, and patient engagement. They do not constitute autonomous medical diagnosis or clinical certification. All rehabilitation programs should be directed and validated by licensed physiotherapists or physicians.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
