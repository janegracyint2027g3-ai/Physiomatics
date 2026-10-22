import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { IcpLeadForm } from "@/components/site/IcpLeadForm";
import { 
  Stethoscope, 
  Eye, 
  LineChart, 
  Share2, 
  Smartphone, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import ptTablet from "@/assets/pt_assessment_tablet.jpg";
import clinicAnalytics from "@/assets/clinic_analytics_monitor.jpg";
import rehabMirror from "@/assets/rehab_patient_mirror.jpg";

export const Route = createFileRoute("/icp_/physiotherapists")({
  head: () => ({
    meta: [
      { title: "Independent Physiotherapists ICP — Physiomatics" },
      { name: "description", content: "Designed for solo practitioners and private consultants looking to provide objective biomechanical guidance to their clients." },
      { property: "og:title", content: "Physiomatics for Solo & Independent Physiotherapists" },
    ],
  }),
  component: PhysiotherapistsICPPage,
});

function PhysiotherapistsICPPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Profile: Solo Practitioners & Private Consultants" 
        title="Deliver Precision Kinematics Without Expensive Hardware."
      >
        You don't need a $10,000 optical motion lab to measure functional range of motion. Give your private clients camera-based exercise observation right from their living room.
      </PageHero>

      {/* Hero Visual Showcase */}
      <div className="container-page -mt-8 mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border">
          <img 
            src={ptTablet} 
            alt="Physical Therapist holding tablet with AI joint angle skeletal overlay" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <Stethoscope className="size-3.5" /> Direct Telemetry & Tablet Goniometry
            </span>
            <h3 className="text-xl md:text-2xl font-bold">Live Real-Time Joint Angular Biofeedback on Any Screen</h3>
          </div>
        </div>
      </div>

      <section className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-12">
          {/* Persona Overview */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-semibold mb-3">
              <Stethoscope className="size-5" />
              <span>Target Persona: Private Practice & Traveling Physical Therapist</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Eliminate the Guesswork From Remote Patient Progress
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              As an independent therapist, your reputation hinges on direct patient outcomes. But when clients leave your room, you lose all oversight. Are they hyperextending their lumbar during squats? Are they compensating on their rotator cuff raises?
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Physiomatics provides real-time biomechanical feedback. The camera estimates joint vectors, alerts the client when they deviate from prescribed range-of-motion constraints, and records clean session data for your next evaluation.
            </p>
          </div>

          {/* Core Feature Matrix */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Eye className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Live In-Plane Goniometry</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automated 2D angular computation across shoulder abduction, elbow flexion, hip depth, and knee flexion directly through the device camera.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <LineChart className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Longitudinal Session Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review weekly velocity trends, max extension angles, and repetition consistency to validate when it's safe to progress rehabilitation resistance.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Smartphone className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Zero Client Setup Overhead</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send your client a web link via WhatsApp or email. They open the link, prop their phone or laptop on a chair, and start moving immediately.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Share2 className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Instant Review Notes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quickly glance over their adherence score and angular improvements before the start of each consultation session.
              </p>
            </div>
          </div>

          {/* Visual Clinical Interface Showcase */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-md">
            <div className="relative h-64 md:h-72 w-full overflow-hidden">
              <img src={clinicAnalytics} alt="Therapist reviewing patient kinematic curves on dual screen console" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-primary px-2.5 py-0.5 rounded-full">Therapist Control Deck</span>
                <h3 className="text-xl font-bold mt-1.5">Longitudinal Angle Progression & Compliance Curves</h3>
              </div>
            </div>
            <div className="p-6 grid sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-primary">60 FPS</div>
                <div className="text-xs text-muted-foreground mt-0.5">Real-Time Pose Tracking</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-emerald-600">3.2x</div>
                <div className="text-xs text-muted-foreground mt-0.5">Higher Home Completion</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-blue-600">0 sec</div>
                <div className="text-xs text-muted-foreground mt-0.5">App Download or Setup Time</div>
              </div>
            </div>
          </div>

          {/* Testimonial / Practical Scenario with Visual Context */}
          <div className="rounded-3xl bg-muted/40 border overflow-hidden">
            <div className="grid md:grid-cols-[200px_1fr] items-center">
              <div className="h-full min-h-[180px] w-full overflow-hidden">
                <img src={rehabMirror} alt="Patient performing rehab exercise" className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">Case Scenario: Private ACL Rehabilitation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "For private ACL post-op clients, verifying 0° knee terminal extension and gradual flexion recovery past 90° is critical. With Physiomatics, my clients perform seated extensions and terminal knee extensions at home with visual angle indicators. They arrive at our weekly check-in with tangible verification that they didn't skip or cheat their exercises."
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                  <CheckCircle className="size-4" /> Recommended for: Orthopedic, Sports, and Neuro Rehab Practices
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Practitioner Access
            </div>
            <h3 className="text-xl font-bold mb-1">Request Your Free Demo</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Takes 30 seconds. We'll reach you on WhatsApp (+91 78450 72426) to schedule a walkthrough.
            </p>
            <IcpLeadForm
              segment="Physiotherapist"
              ctaLabel="Get Practitioner Demo"
              whatsappMessage="Hi Physiomatics! I'm a physiotherapist and would like a free demo of the platform."
            />
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-3">Therapist Benefits</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" /> Objective discharge criteria</li>
              <li className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" /> Increased client engagement</li>
              <li className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" /> No vendor lock-in or proprietary sensors</li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-card p-4 flex gap-3">
            <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
              <Link to="/analyze">Try Live Analysis</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
              <Link to="/contact">Full Consultation</Link>
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
