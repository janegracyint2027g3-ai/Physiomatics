import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
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
  PhoneCall
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Specialized Rehabilitation Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Explore tailored movement telemetry workflows for elderly mobility, post-operative orthopedic recovery, caregiver assistance, clinic operations, and academic education." 
      },
      { property: "og:title", content: "Specialized Rehabilitation Solutions — Physiomatics" },
      { property: "og:description", content: "Targeted physical therapy workflows for elderly, patients, caregivers, clinics, and educators." },
    ],
  }),
  component: Solutions,
});

const SOLUTIONS_DATA = [
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
  return (
    <>
      <PageHero 
        eyebrow="Tailored Rehabilitation Pathways" 
        title="Specialized Solutions for Every Rehabilitation Environment"
        description="Whether supporting an aging parent at home, recovering from joint surgery, modernizing clinic compliance, or teaching biomechanics—Physiomatics delivers purposeful movement telemetry."
      />

      {/* Solutions Grid */}
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {SOLUTIONS_DATA.map((sol) => (
            <article 
              key={sol.id} 
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <sol.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {sol.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                  {sol.title}
                </h3>

                <div className="mt-4 rounded-2xl bg-muted/40 p-4 text-xs">
                  <strong className="text-foreground">The Challenge:</strong>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{sol.problem}</p>
                </div>

                <div className="mt-5 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">How Physiomatics Helps:</span>
                  <ul className="space-y-1.5 pt-1">
                    {sol.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 rounded-2xl bg-primary/5 p-4 border border-primary/10 text-xs">
                  <strong className="text-foreground">Supported Workflow:</strong>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{sol.workflow}</p>
                </div>

                <div className="mt-4 text-[11px] text-muted-foreground italic border-l-2 border-primary/40 pl-3 py-0.5">
                  {sol.limitations}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <Link 
                  to={sol.to} 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Explore dedicated {sol.title} page</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="text-xs h-8">
                    <Link to="/contact">Consult</Link>
                  </Button>
                  <Button asChild size="sm" variant="whatsapp" className="text-xs h-8">
                    <a href={whatsappLink(WA_MESSAGES[sol.wa])} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Clinical Disclaimer */}
      <section className="container-page py-6">
        <div className="flex items-start gap-4 rounded-2xl border border-muted bg-muted/40 p-5 text-xs text-muted-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Clinical Governance & Scope</h4>
            <p className="leading-relaxed">
              Physiomatics solutions are designed to support and reinforce clinical care, education, and patient engagement. They do not constitute autonomous medical advice, diagnosis, or clinical certification. All rehabilitation programs should be directed by licensed healthcare providers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
