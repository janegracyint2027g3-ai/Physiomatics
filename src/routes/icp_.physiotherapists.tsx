import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Stethoscope, 
  Eye, 
  LineChart, 
  Share2, 
  Smartphone, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { whatsappLink } from "@/lib/site";

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

      <section className="container-page py-16 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
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

          {/* Testimonial / Practical Scenario */}
          <div className="rounded-3xl bg-muted/40 border p-8">
            <h3 className="text-xl font-bold mb-3">Case Scenario: Private ACL Rehabilitation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "For private ACL post-op clients, verifying 0° knee terminal extension and gradual flexion recovery past 90° is critical. With Physiomatics, my clients perform seated extensions and terminal knee extensions at home with visual angle indicators. They arrive at our weekly check-in with tangible verification that they didn't skip or cheat their exercises."
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
              <CheckCircle className="size-4" /> Recommended for: Orthopedic, Sports, and Neuro Rehab Practices
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Practitioner Access
            </div>
            <h3 className="text-xl font-bold mb-2">Try The Clinical Tool Free</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Test pose estimation and repetition tracking right now on your webcam.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full justify-between" variant="hero">
                <Link to="/analyze">Test Live In Browser <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <Link to="/contact">Request Practitioner Pack <Stethoscope className="size-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-3">Therapist Benefits</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" /> Objective discharge criteria</li>
              <li className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" /> Increased client engagement</li>
              <li className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" /> No vendor lock-in or proprietary sensors</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
