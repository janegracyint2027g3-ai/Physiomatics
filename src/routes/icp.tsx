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

const icpCards = [
  {
    slug: "/icp/clinics",
    title: "Physiotherapy Clinics & Multi-Location Practices",
    subtitle: "For Practice Owners, Clinic Directors & Lead PTs",
    icon: Building2,
    badge: "Enterprise & Clinics",
    painPoint: "High patient drop-off between visits, zero visibility into at-home exercise compliance, and manual documentation bottlenecks.",
    solution: "Browser-based video movement tracking with objective adherence telemetry and automated progress reporting.",
    roi: "+42% Treatment plan completion rate; 3.5 hrs saved per therapist/week on review notes.",
    features: ["Practice-wide compliance metrics", "No app install required for patients", "Zero-server on-device video privacy", "Multi-therapist workflow"],
  },
  {
    slug: "/icp/physiotherapists",
    title: "Independent & Private Physiotherapists",
    subtitle: "For Solo Practitioners, Mobile Therapists & Consultants",
    icon: Stethoscope,
    badge: "Solo Practitioners",
    painPoint: "Relying on subjective patient recall during follow-ups and lacking proof of form correctness during home routines.",
    solution: "Sub-degree angular kinematic tracking directly in the client's browser, giving objective proof of extension and reps.",
    roi: "Dramatically faster discharge with verified functional goals and higher client retention.",
    features: ["Real-time joint angle overlay", "Automated rep counting thresholds", "Exportable PDF progress summaries", "Instant WhatsApp integration"],
  },
  {
    slug: "/icp/rehab-patients",
    title: "Post-Operative & Musculoskeletal Patients",
    subtitle: "For Individuals Recovering from Surgery or Joint Injury",
    icon: UserCheck,
    badge: "Patient Recovery",
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
                className="group relative flex flex-col justify-between rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Sparkles className="size-3.5" />
                      {card.badge}
                    </span>
                    <div className="rounded-2xl bg-muted p-2.5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Icon className="size-6" />
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

      {/* Trust & Deployment Banner */}
      <section className="container-page pb-24">
        <div className="rounded-3xl bg-ink p-10 md:p-14 text-ink-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-coral mb-4">
              <ShieldCheck className="size-4" /> On-Device Computer Vision
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              No App Downloads. Zero Video Storage. Complete Privacy.
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Every customer profile benefits from client-side AI processing. Whether your patients are elderly seniors using a laptop or athletes in a gym, Physiomatics runs instantly in any modern web browser.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg" className="rounded-full">
                <Link to="/contact">Book a Customized ICP Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 text-white hover:bg-white/10">
                <Link to="/analyze">Try Browser Analysis Live</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
