import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Building2, 
  Stethoscope, 
  UserCheck, 
  HeartHandshake, 
  Users, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity
} from "lucide-react";

export const Route = createFileRoute("/icp")({
  head: () => ({
    meta: [
      { title: "Ideal Customer Profiles (ICP) — Physiomatics" },
      { name: "description", content: "Tailored movement intelligence, remote compliance, and clinical analytics for our specialized target personas." },
      { property: "og:title", content: "Ideal Customer Profiles — Physiomatics" },
    ],
  }),
  component: ICPHubPage,
});

import clinicInterior from '@/assets/clinic_interior.jpg';
import clinicAnalytics from '@/assets/clinic_analytics_monitor.jpg';
import ptTablet from '@/assets/pt_assessment_tablet.jpg';
import rehabMirror from '@/assets/rehab_patient_mirror.jpg';
import patientPhone from '@/assets/patient_phone_tracking.jpg';
import elderlyExercise from '@/assets/elderly_exercise.jpg';
import seniorMobility from '@/assets/senior_mobility_balance.jpg';
import caregiverHome from '@/assets/caregiver_home.jpg';
import caregiverAssisted from '@/assets/caregiver_assisted_session.jpg';
import sportsBio from '@/assets/sports_biomechanics.jpg';
import athleteKinematics from '@/assets/athlete_sports_kinematics.jpg';

const icpCards = [
  {
    slug: "/icp/clinics",
    title: "Physiotherapy Clinics & Multi-Location Practices",
    subtitle: "For Practice Owners, Clinic Directors & Lead PTs",
    icon: Building2,
    badge: "Enterprise & Clinics",
    image: clinicInterior,
    secondaryImage: clinicAnalytics,
    painPoint: "High patient drop-off between visits, zero visibility into at-home exercise compliance, and manual documentation bottlenecks.",
    solution: "Browser-based video movement tracking with objective adherence telemetry and automated progress reporting.",
    roi: "Designed to improve treatment plan adherence and save therapists hours each week on manual review notes.",
    features: ["Practice-wide compliance metrics", "No app install required for patients", "Zero-server on-device video privacy", "Multi-therapist workflow"],
  },
  {
    slug: "/icp/physiotherapists",
    title: "Independent & Private Physiotherapists",
    subtitle: "For Solo Practitioners, Mobile Therapists & Consultants",
    icon: Stethoscope,
    badge: "Solo Practitioners",
    image: ptTablet,
    secondaryImage: clinicAnalytics,
    painPoint: "Relying on subjective patient recall during follow-ups and lacking proof of form correctness during home routines.",
    solution: "Objective angular kinematic tracking directly in the client's browser, giving clear proof of extension and reps.",
    roi: "Supports goal-directed discharge with verified functional metrics and strengthened client engagement.",
    features: ["Real-time joint angle overlay", "Automated rep counting thresholds", "Exportable PDF progress summaries", "Instant WhatsApp integration"],
  },
  {
    slug: "/icp/rehab-patients",
    title: "Post-Operative & Musculoskeletal Patients",
    subtitle: "For Individuals Recovering from Surgery or Joint Injury",
    icon: UserCheck,
    badge: "Patient Recovery",
    image: patientPhone,
    secondaryImage: rehabMirror,
    painPoint: "Fear of moving incorrectly, anxiety over causing re-injury, and losing motivation when exercising alone at home.",
    solution: "Live bio-feedback that visually guides joints into correct angular zones and celebrates completed sets.",
    roi: "Safe, guided recovery from the comfort of home with total confidence in form.",
    features: ["Visual skeletal feedback", "Clear rep counter & form cues", "Local private storage on your device", "Direct progress sharing with PT"],
  },
  {
    slug: "/icp/elderly-care",
    title: "Elderly Care Facilities & Geriatric PTs",
    subtitle: "For Senior Living Communities & Geriatric Specialists",
    icon: HeartHandshake,
    badge: "Geriatric & Assisted Living",
    image: seniorMobility,
    secondaryImage: elderlyExercise,
    painPoint: "High fall risk, low tech literacy among seniors, and difficulty tracking gradual mobility deterioration.",
    solution: "High-contrast, one-click interface for chair stands, knee extensions, and balance exercises with automated fall-risk indices.",
    roi: "Significant reduction in mobility-loss incidents and clearer evidence of functional independence.",
    features: ["Large high-contrast display controls", "Seated and supported exercise protocols", "Caregiver assist mode", "Gentle pacing prompts"],
  },
  {
    slug: "/icp/caregivers",
    title: "Family & Professional Home Caregivers",
    subtitle: "For Loved Ones & Home Health Aides Assisting Recovery",
    icon: Users,
    badge: "Caregiver Support",
    image: caregiverAssisted,
    secondaryImage: caregiverHome,
    painPoint: "Uncertainty whether the patient is performing the prescribed exercise safely, leading to constant anxiety.",
    solution: "Interactive coaching companion that indicates 'Good Rep' or 'Needs Adjustment' in plain, non-clinical language.",
    roi: "Confidence that your loved one is safely progressing through rehabilitation every single day.",
    features: ["Simplified status indicators", "Clear scheduled routine reminders", "Direct feedback logs", "One-click therapist updates"],
  },
  {
    slug: "/icp/sports-academies",
    title: "Athletic Teams & Sports Performance Academies",
    subtitle: "For Strength & Conditioning Coaches, Trainers & Academies",
    icon: Trophy,
    badge: "Sports Performance",
    image: athleteKinematics,
    secondaryImage: sportsBio,
    painPoint: "Overuse injuries, asymmetric loading between limbs, and slow return-to-play clearance protocols.",
    solution: "High-speed kinematic symmetry analysis, tracking knee valgus, squat depth, and explosive tempo dynamics.",
    roi: "Faster, safer return-to-sport clearance and quantifiable injury-prevention benchmarks.",
    features: ["Bilateral symmetry comparisons", "Dynamic depth & velocity metrics", "Rapid batch athlete screening", "Exportable raw angle data"],
  },
];

function ICPHubPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Customer Personas" 
        title="Engineered specifically for your unique role in the rehabilitation ecosystem."
      >
        Whether you run a multi-therapist clinic, treat private clients, guide elderly family members, or push athletic recovery limits, Physiomatics delivers tailored movement intelligence.
      </PageHero>

      <section className="container-page py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {icpCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.slug} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border bg-card/70 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div>
                  {/* Card Featured Image */}
                  <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur">
                        <Sparkles className="size-3.5" />
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-foreground">{card.title}</h3>
                  <p className="text-sm font-medium text-primary mt-1">{card.subtitle}</p>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="rounded-2xl bg-destructive/5 border border-destructive/15 p-4">
                      <span className="font-semibold text-destructive block mb-1">Key Challenge:</span>
                      <p className="text-muted-foreground">{card.painPoint}</p>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-4">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">The Physiomatics Solution:</span>
                      <p className="text-muted-foreground">{card.solution}</p>
                    </div>

                    <div className="rounded-2xl bg-primary-soft p-4">
                      <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                        <TrendingUp className="size-4 text-primary" /> Target Outcome / ROI
                      </div>
                      <p className="text-muted-foreground">{card.roi}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Capabilities</h4>
                    <ul className="grid grid-cols-2 gap-2 text-xs">
                      {card.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-1.5 text-foreground/80">
                          <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex items-center justify-between">
                  <Button asChild className="rounded-full w-full justify-between" variant="hero">
                    <Link to={card.slug as any}>
                      <span>Explore {card.badge} Solution</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Technology Showcase Across Profiles */}
      <section className="container-page pb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <Sparkles className="size-3.5" /> High-Resolution Clinical Intelligence
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            See Physiomatics in Action Across Every Clinical Persona
          </h2>
          <p className="text-muted-foreground text-base">
            From multi-therapist clinic monitors to in-home senior guidance and athletic kinetic vectoring — explore real-world deployment across all 6 specialized user segments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 w-full overflow-hidden">
              <img src={clinicAnalytics} alt="Clinic Analytics Console" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/90 px-2 py-0.5 rounded-full text-white">Clinics & Practices</span>
                <h4 className="text-base font-bold mt-1">Multi-Monitor EMR Compliance Station</h4>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dual-screen triage setup displaying 3D skeletal posture, compliance curves, and pain level trends across all recovery rooms.
              </p>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 w-full overflow-hidden">
              <img src={ptTablet} alt="Physiotherapist Tablet Biofeedback" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-600 px-2 py-0.5 rounded-full text-white">Solo Practitioners</span>
                <h4 className="text-base font-bold mt-1">Live In-Plane Goniometry & ROM Testing</h4>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Shoulder abduction tracking with sub-degree angular vectors, target goals, and automated rep thresholds during 1-on-1 consultations.
              </p>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 w-full overflow-hidden">
              <img src={patientPhone} alt="Patient Smartphone Tracking" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-600 px-2 py-0.5 rounded-full text-white">Rehab Patients</span>
                <h4 className="text-base font-bold mt-1">Tripod Mobile Biofeedback Mirror</h4>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                At-home lunge and squat verification: 105° knee flexion, 92° hip extension, and instant "GOOD FORM" feedback.
              </p>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 w-full overflow-hidden">
              <img src={seniorMobility} alt="Elderly Balance Guidance" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-600 px-2 py-0.5 rounded-full text-white">Elderly Care</span>
                <h4 className="text-base font-bold mt-1">High-Contrast Fall-Prevention Display</h4>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Smart TV posture coach for single-leg stands, balance metrics, and gentle audio prompts designed for senior living.
              </p>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 w-full overflow-hidden">
              <img src={caregiverAssisted} alt="Caregiver Companion Mode" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-600 px-2 py-0.5 rounded-full text-white">Caregiver Support</span>
                <h4 className="text-base font-bold mt-1">Empathetic Family Companion Companion</h4>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clear 175° knee extension target goals and non-clinical status cues so caregivers know their loved one is recovering safely.
              </p>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 w-full overflow-hidden">
              <img src={athleteKinematics} alt="Athletic Sports Kinematics" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-600 px-2 py-0.5 rounded-full text-white">Sports Academies</span>
                <h4 className="text-base font-bold mt-1">High-Speed Kinetic Vector Alignment</h4>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tracking 112.4° knee flexion, valgus deviation, and bilateral symmetry during athletic return-to-play training protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Deployment Banner */}
      <section className="container-page pb-24">
        <div className="rounded-3xl bg-ink p-10 md:p-14 text-ink-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-coral mb-4">
              <ShieldCheck className="size-4" /> On-Device Computer Vision
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
              No App Downloads. Zero Video Storage. Complete Privacy.
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Every customer profile benefits from client-side AI processing. Whether your patients are elderly seniors using a laptop or athletes in a gym, Physiomatics runs instantly in any modern web browser.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg" className="rounded-full">
                <Link to="/contact">Book a Customized ICP Demo</Link>
              </Button>
              <Button asChild variant="outline-inverse" size="lg" className="rounded-full">
                <Link to="/analyze">Try Browser Analysis Live</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
