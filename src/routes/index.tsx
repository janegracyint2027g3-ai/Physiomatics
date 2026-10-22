import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ArrowRight, 
  Stethoscope, 
  HeartHandshake, 
  Bandage, 
  GraduationCap, 
  ScanLine, 
  Video, 
  LineChart, 
  ClipboardCheck, 
  ShieldCheck, 
  Gauge, 
  Repeat, 
  Eye, 
  BarChart, 
  History, 
  CheckCircle2, 
  Shield, 
  Activity, 
  Users,
  Sparkles,
  Smartphone,
  Lock,
  Award,
  Zap,
  Layers,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHead } from "@/components/site/PageHero";
import { Testimonials } from "@/components/site/Testimonials";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";
import { FAQS } from "@/lib/faq";
import { HeroCarousel } from "@/components/site/HeroCarousel";

import clinicInterior from "@/assets/clinic_interior.jpg";
import elderlyExercise from "@/assets/elderly_exercise.jpg";
import rehabMirror from "@/assets/rehab_patient_mirror.jpg";
import sportsBio from "@/assets/sports_biomechanics.jpg";
import ptTablet from "@/assets/pt_assessment_tablet.jpg";
import patientPhone from "@/assets/patient_phone_tracking.jpg";
import clinicAnalytics from "@/assets/clinic_analytics_monitor.jpg";
import caregiverAssisted from "@/assets/caregiver_assisted_session.jpg";
import seniorMobility from "@/assets/senior_mobility_balance.jpg";
import rehab from "@/assets/rehab.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Physiomatics — Smarter Physiotherapy, More Informed Recovery" },
      { name: "description", content: "Video-guided exercises, in-browser AI movement analysis, and progress monitoring for elderly care, rehabilitation, and modern clinics." },
      { property: "og:title", content: "Physiomatics — Move Better. Recover Smarter. Age Stronger." },
      { property: "og:description", content: "AI-assisted movement monitoring that helps people follow prescribed exercises and understand their recovery progress." },
    ],
  }),
  component: Home,
});

const statCards = [
  {
    icon: Zap,
    value: "60 FPS",
    label: "On-Device Pose Engine",
    sub: "Real-time edge joint angle estimation",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    icon: BrainCircuit,
    value: "33 Points",
    label: "Skeletal Landmark Vectors",
    sub: "Bilateral tracking across sagittal & frontal planes",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  },
  {
    icon: TrendingUp,
    value: "3.2x",
    label: "Higher Home Completion",
    sub: "Documented adherence with live biofeedback",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    icon: Lock,
    value: "100%",
    label: "Client-Side Privacy",
    sub: "Zero video streamed or saved to cloud servers",
    color: "text-[#5AA9AC]",
    bg: "bg-[#5AA9AC]/10",
    border: "border-[#5AA9AC]/20"
  }
];

const audiences = [
  { 
    icon: Stethoscope, 
    badge: "Practice Operating System",
    title: "Physiotherapists & Clinics", 
    text: "Bridge the gap between clinic visits. Get objective home exercise compliance data and kinematic telemetry.", 
    cta: "Explore Clinic Solutions", 
    link: "/icp/clinics",
    image: clinicInterior
  },
  { 
    icon: HeartHandshake, 
    badge: "Geriatric & Safety",
    title: "Elderly Care & Fall Prevention", 
    text: "High-contrast guided chair routines, balance stability indicators, and gentle companionship for safe home mobility.", 
    cta: "Explore Senior Care", 
    link: "/icp/elderly-care",
    image: elderlyExercise
  },
  { 
    icon: Bandage, 
    badge: "Guided Rehabilitation",
    title: "Rehabilitation Patients", 
    text: "Real-time visual joint angle biofeedback and repetition guidance so you can recover with total confidence at home.", 
    cta: "Explore Patient Recovery", 
    link: "/icp/rehab-patients",
    image: rehabMirror
  },
  { 
    icon: GraduationCap, 
    badge: "Athletic Biomechanics",
    title: "Athletes & Sports Academies", 
    text: "Bilateral kinematic symmetry analysis, valgus deviation monitoring, and evidence-informed return-to-sport metrics.", 
    cta: "Explore Sports Solutions", 
    link: "/icp/sports-academies",
    image: sportsBio
  },
];

const clinicalSolutions = [
  {
    title: "Orthopedic Physiotherapy",
    desc: "Post-surgical ACL, hip replacement, and joint rehabilitation with measured range-of-motion curves.",
    link: "/solutions/orthopedic-physiotherapy",
    badge: "Surgical & Joint Care"
  },
  {
    title: "Geriatric Physiotherapy",
    desc: "Fall prevention, functional chair stands, and balance maintenance for graceful aging at home.",
    link: "/solutions/geriatric-physiotherapy",
    badge: "Fall Risk Reduction"
  },
  {
    title: "Sports Injury & Kinematics",
    desc: "Dynamic valgus assessment, jump landing symmetry, and sport-specific biomechanical conditioning.",
    link: "/solutions/sports-physiotherapy",
    badge: "Performance & Return-to-Play"
  },
  {
    title: "Neurological Rehabilitation",
    desc: "Repetitive motor re-learning, post-stroke functional drills, and ataxia gait stability guidance.",
    link: "/solutions/neurological-physiotherapy",
    badge: "Neuroplastic Recovery"
  },
  {
    title: "Cardiorespiratory Therapy",
    desc: "Safe pacing protocols, thoracic expansion tracking, and breathlessness management exercises.",
    link: "/solutions/cardiorespiratory-physiotherapy",
    badge: "Cardiopulmonary Pacing"
  },
  {
    title: "Posture & Spine Health",
    desc: "Cervicothoracic alignment, lumbar pelvic dissociation, and core stabilization routines.",
    link: "/solutions/posture-spinal-physiotherapy",
    badge: "Spinal Rehabilitation"
  }
];

const steps = [
  { icon: ClipboardCheck, t: "1. Select Routine", desc: "Choose your prescribed exercise protocol from our clinical library." },
  { icon: Video, t: "2. Position Camera", desc: "Prop your smartphone or laptop 2 metres away with limbs clearly visible." },
  { icon: ScanLine, t: "3. Real-Time Tracking", desc: "In-browser computer vision maps 33 joints with zero video uploads." },
  { icon: Gauge, t: "4. Live Biofeedback", desc: "Instant visual and numerical cues guide your angles into the target therapeutic zone." },
  { icon: LineChart, t: "5. Automated Metrics", desc: "Repetition counts, time under tension, and angular depth calculate automatically." },
  { icon: ShieldCheck, t: "6. Clinician Review", desc: "Export objective recovery curves or share session telemetry with your physical therapist." }
];

function Home() {
  return (
    <>
      {/* ── 1. HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── 2. HIGH-IMPACT STATS STRIP ── */}
      <section className="container-page -mt-6 sm:-mt-10 relative z-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div 
              key={stat.label} 
              className={`rounded-3xl border bg-card/90 backdrop-blur-xl p-6 shadow-lg shadow-purple-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="size-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/80 bg-muted px-2.5 py-1 rounded-full">
                  Verified Engine
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-foreground">
                {stat.label}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. WHO WE SERVE: VISUAL CARDS WITH PHOTOGRAPHY ── */}
      <section className="container-page py-24 relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-b-[4rem]">
          <div className="absolute top-0 right-1/4 size-96 rounded-full bg-[#592787]/[0.05] blur-3xl" />
          <div className="absolute bottom-0 left-10 size-80 rounded-full bg-[#5AA9AC]/[0.08] blur-3xl" />
          <div 
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: 'radial-gradient(circle, #592787 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <SectionHead 
          eyebrow="Target Audiences" 
          title="Tailored Movement Intelligence for Every Stage of Care" 
          sub="Whether managing a multi-bed physiotherapy clinic, guiding a frail elder, or rehabilitating an athlete post-surgery, Physiomatics delivers purpose-built workflows."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <Link 
              key={a.title} 
              to={a.link as "/solutions"} 
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/40"
            >
              {/* Photo Header */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={a.image} 
                  alt={a.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="absolute top-3.5 left-3.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20 tracking-wide uppercase">
                  {a.badge}
                </span>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="rounded-xl bg-white/20 backdrop-blur-md p-2 border border-white/20">
                    <a.icon className="size-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {a.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{a.cta}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. DUAL SHOWCASE: CLINIC CONTROL & HOME EMPOWERMENT ── */}
      <section className="bg-muted/40 border-y py-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Unified Care Continuum</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
              From In-Clinic Evaluation to Daily Home Adherence
            </h2>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Eliminate patient drop-off between visits. Physiomatics provides lead therapists with objective data while giving patients clear visual guidance at home.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-stretch">
            {/* Left: The Clinical Practice Deck */}
            <div className="rounded-[2.5rem] border bg-card p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6 border">
                  <img 
                    src={ptTablet} 
                    alt="Physical Therapist holding tablet with live kinematic joint goniometry" 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary px-3 py-1 rounded-full">
                      Clinical In-Take & Discharge
                    </span>
                    <h4 className="text-lg font-bold mt-1">Live Angular Goniometry on Any Tablet</h4>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  <Stethoscope className="size-3.5" /> For Practice Owners & Physical Therapists
                </div>
                <h3 className="text-2xl font-serif font-bold">Objective Practice Telemetry</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Validate functional milestones with numerical precision. Review longitudinal range-of-motion curves, time under tension, and movement symmetry before every follow-up.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Real-time goniometric skeletal overlay during in-clinic intake.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Multi-patient adherence dashboard flagging non-compliant home routines.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Exportable PDF documentation for referring physicians and insurance.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/icp/clinics">
                    Request Clinic Demo <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: The Patient Living Room Experience */}
            <div className="rounded-[2.5rem] border bg-card p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6 border">
                  <img 
                    src={patientPhone} 
                    alt="Patient running exercise monitoring on smartphone at home" 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 px-3 py-1 rounded-full">
                      Zero App Install Friction
                    </span>
                    <h4 className="text-lg font-bold mt-1">Camera Guided Exercise on Any Smartphone</h4>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
                  <Smartphone className="size-3.5" /> For Patients & Family Caregivers
                </div>
                <h3 className="text-2xl font-serif font-bold">Confidence In Every Repetition</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  No confusing diagrams or forgotten verbal cues. Patients open a browser link, follow visual angle targets, and receive immediate affirmation when form is correct.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Real-time repetition counter and audible lockout affirmation.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Automatic notification when compensatory posture faults are detected.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Complete peace of mind — 100% on-device processing, zero video uploads.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/analyze">
                    Launch Interactive Analyzer <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SIX STEPS: FROM EXERCISE TO INSIGHT (DARK SHOWCASE) ── */}
      <section className="bg-ink py-24 text-ink-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-ink to-ink -z-10" />
        <div className="container-page relative z-10">
          <div className="max-w-2xl">
            <div className="eyebrow text-coral">Structured Workflow</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-white">
              Six Steps From Movement to Clinical Telemetry
            </h2>
            <p className="text-white/60 text-sm mt-3">
              How our on-device computer vision engine transforms a standard smartphone camera into an intelligent physiotherapy observation companion.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div 
                key={s.t} 
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-sm"
              >
                <div className="absolute -top-6 -right-6 text-[7rem] font-black text-white/[0.04] pointer-events-none group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <div className="p-3 rounded-2xl bg-white/10 w-fit mb-5">
                  <s.icon className="size-7 text-coral" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.t}</h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Embedded Clinical Dashboard Preview */}
          <div className="mt-16 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-md">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={clinicAnalytics} 
                  alt="Therapist reviewing patient exercise metrics on dual screen clinic workstation" 
                  className="w-full h-64 sm:h-80 object-cover" 
                />
              </div>
              <div className="lg:col-span-6 text-white space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-coral">
                  Tele-Rehabilitation Intelligence
                </span>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Zero Special Sensors. Zero Wearable Bands.
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Traditional motion capture requires $10k+ optical marker setups or battery-draining inertial sensors. Physiomatics relies solely on the monocular optical feed already in your patient's pocket.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Button asChild variant="hero" className="rounded-full">
                    <Link to="/how-it-works">Explore Full Architecture</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                    <Link to="/how-it-works/vision">Inspect Vision Pipeline</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. SPECIALIZED PHYSIOTHERAPY DISCIPLINES ── */}
      <section className="container-page py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Specialized Care Modules</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
              Clinical Solutions Across Disciplines
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl">
              From post-operative joint rehabilitation to high-performance athletic biomechanics, explore our evidence-informed clinical pathways.
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto shrink-0">
            <Link to="/solutions">View All 8 Specialties <ArrowRight className="size-4 ml-1.5" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinicalSolutions.map((sol) => (
            <Link 
              key={sol.title} 
              to={sol.link as "/solutions"} 
              className="group rounded-3xl border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                    {sol.badge}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {sol.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {sol.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t text-xs font-semibold text-primary flex items-center gap-1">
                <span>View Clinical Pathway</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 7. PROGRESS MONITORING DASHBOARD (RICH STATS & REHAB PHOTO) ── */}
      <section className="container-page py-12">
        <div className="rounded-[3rem] bg-gradient-to-br from-white via-primary-soft/25 to-white border border-white/80 p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#5AA9AC]/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#592787]/[0.06] blur-3xl rounded-full -translate-x-1/4" />
            <div 
              className="absolute inset-0 opacity-[0.20]"
              style={{
                backgroundImage: 'radial-gradient(circle, #592787 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow text-primary mb-3">Progress Monitoring Telemetry</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-[#3b1d60]">
              Track Your Recovery Journey
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-sans">
              Review session history, completion rates, and exercise adherence in one intuitive dashboard.
            </p>
            <p className="text-[11px] text-muted-foreground/80 font-mono mt-2 uppercase tracking-wider">
              Illustrative Patient Dashboard Preview
            </p>
          </div>
          
          <div className="relative z-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white/85 dark:bg-card/70 backdrop-blur-xl p-8 border border-white/90 shadow-lg hover:-translate-y-1.5 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-primary/10 border border-primary/15 p-3 rounded-2xl">
                  <BarChart className="text-primary size-6" />
                </div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Adherence (Sample)</h4>
              </div>
              <div className="text-5xl font-display font-bold text-[#3b1d60]">85<span className="text-2xl text-muted-foreground">%</span></div>
              <div className="text-sm text-emerald-600 font-medium mt-3 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> +5% illustrative trend
              </div>
            </div>
            
            <div className="rounded-3xl bg-white/85 dark:bg-card/70 backdrop-blur-xl p-8 border border-white/90 shadow-lg hover:-translate-y-1.5 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-[#5AA9AC]/15 border border-[#5AA9AC]/20 p-3 rounded-2xl">
                  <Activity className="text-[#5AA9AC] size-6" />
                </div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Completion (Sample)</h4>
              </div>
              <div className="text-5xl font-display font-bold text-[#3b1d60]">12<span className="text-2xl text-muted-foreground">/14</span></div>
              <div className="text-sm text-muted-foreground mt-3">Monthly prescribed sessions</div>
            </div>
            
            <div className="rounded-3xl bg-white/85 dark:bg-card/70 backdrop-blur-xl p-8 border border-white/90 shadow-lg hover:-translate-y-1.5 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-primary/10 border border-primary/15 p-3 rounded-2xl">
                  <History className="text-primary size-6" />
                </div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Avg Duration (Sample)</h4>
              </div>
              <div className="text-5xl font-display font-bold text-[#3b1d60]">24<span className="text-2xl text-muted-foreground">m</span></div>
              <div className="text-sm text-muted-foreground mt-3">Target therapeutic session time</div>
            </div>
          </div>
          
          <div className="relative z-10 mt-12 flex justify-center">
            <Button asChild variant="hero" className="rounded-full px-8 shadow-xl shadow-primary/25">
              <Link to="/platform">
                Explore Progress Dashboards <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ── */}
      <Testimonials />

      {/* ── 9. FREQUENTLY ASKED QUESTIONS ── */}
      <section className="container-page grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHead 
            eyebrow="Clinical FAQ" 
            title="Questions, answered plainly" 
            sub="Everything you need to know about how Physiomatics works, how we protect your camera data, and what to expect during home rehabilitation." 
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/resources/faqs">View All FAQs</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/safety">Read Safety Standards</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-3xl bg-card border p-2 shadow-sm">
          <Accordion type="single" collapsible className="px-6">
            {FAQS.slice(0, 5).map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border/50 py-2">
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary transition-colors">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 10. HIGH CONVERSION CTA BANNER WITH PHOTOGRAPHY ── */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-ink text-ink-foreground p-8 sm:p-12 md:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-4 border border-white/15">
                <Sparkles className="size-3.5 text-coral" /> Evidence-Informed Movement Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                Ready to Experience Physiomatics in Action?
              </h2>
              <p className="text-ink-foreground/80 text-sm sm:text-base mb-8 max-w-lg leading-relaxed">
                Connect with our clinical team to explore how camera-assisted movement analytics can transform home adherence and patient confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="hero" size="lg" className="rounded-full shadow-lg shadow-primary/20">
                  <Link to="/book">Book a Consultation</Link>
                </Button>
                <Button asChild variant="outline-inverse" size="lg" className="rounded-full">
                  <a href={whatsappLink(WA_MESSAGES.demo)} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <PhoneCall className="size-4" />
                    <span>WhatsApp (7845072426)</span>
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <img 
                  src={caregiverAssisted} 
                  alt="Caregiver and physical therapist supporting a recovery patient session" 
                  className="w-full h-64 sm:h-72 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-coral">
                    Compassionate Care Delivery
                  </div>
                  <div className="text-sm font-semibold mt-0.5">
                    Supporting Independent Living & Safe Movement at Home
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
