import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Trophy, 
  Gauge, 
  Activity, 
  Timer, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import sportsBio from "@/assets/sports_biomechanics.jpg";

export const Route = createFileRoute("/icp_/sports-academies")({
  head: () => ({
    meta: [
      { title: "Sports Academies & Athletic Performance ICP — Physiomatics" },
      { name: "description", content: "Kinematic joint tracking, limb symmetry analysis, and return-to-play clearance protocols for strength coaches, trainers, and athletes." },
      { property: "og:title", content: "Physiomatics for Athletic Performance & Sports Academies" },
    ],
  }),
  component: SportsAcademiesICPPage,
});

function SportsAcademiesICPPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Profile: Strength Coaches, Athletic Trainers & Sports Clubs" 
        title="Quantify Kinematic Symmetry & Accelerate Safe Return-To-Play."
      >
        Bridging high-performance sports training and sports medicine. Track bilateral knee valgus, depth angles, and explosive tempo dynamics without bulky equipment.
      </PageHero>

      <div className="container-page -mt-8 mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border">
          <img 
            src={sportsBio} 
            alt="Advanced Athletic Kinematic Motion Capture and Symmetry Analysis" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <Trophy className="size-3.5" /> High-Speed Motion Telemetry
            </span>
            <h3 className="text-xl md:text-2xl font-bold">Dynamic Biomechanical Analysis On Any Field or Track</h3>
          </div>
        </div>
      </div>

      <section className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-12">
          {/* Athletic Profile */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-semibold mb-3">
              <Trophy className="size-5" />
              <span>Target Persona: Head Strength & Conditioning Coach, Head Athletic Trainer</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Preventing Non-Contact ACL Tears & Overuse Sprains With Visual Metrics
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In competitive sports, small asymmetric loading habits—such as favoring the non-dominant knee during landing or shifting hip weight under fatigue—predispose athletes to non-contact injuries.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Physiomatics allows coaches and performance trainers to screen athletes rapidly right on the gym floor or turf. Measure squat depth symmetry, limb angles during single-leg hops, and repetition tempo in seconds using a tablet.
            </p>
          </div>

          {/* Performance Pillars */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Gauge className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Bilateral Joint Symmetry</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Detect subtle angular deficits between left and right limb kinematics during bilateral squats, lunges, and overhead presses.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Timer className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Repetition Tempo Dynamics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Measure eccentric lowering duration versus concentric drive to evaluate motor control under progressive muscular fatigue.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <TrendingUp className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Return-to-Play Milestones</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Provide orthopedic surgeons and athletic directors with objective functional data before clearing an athlete for full-contact play.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Zap className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Rapid Team Batch Screening</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Screen an entire roster of 20+ athletes during pre-season testing without attaching markers, sensors, or syncing Bluetooth receivers.
              </p>
            </div>
          </div>

          {/* Athletic Protocols */}
          <div className="rounded-3xl bg-muted/40 border p-8">
            <h3 className="text-xl font-bold mb-4">Supported Athletic Screening Protocols</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-card p-4 border">
                <strong className="block text-primary mb-1">Overhead Deep Squat</strong>
                <p className="text-xs text-muted-foreground">Screens hip mobility, knee valgus, and bilateral femoral parallel depth.</p>
              </div>
              <div className="rounded-2xl bg-card p-4 border">
                <strong className="block text-primary mb-1">Single-Leg Step Down</strong>
                <p className="text-xs text-muted-foreground">Isolates glute medius stability and pelvic drop under unilateral loading.</p>
              </div>
              <div className="rounded-2xl bg-card p-4 border">
                <strong className="block text-primary mb-1">Scapular Plane Abduction</strong>
                <p className="text-xs text-muted-foreground">Evaluates shoulder overhead rhythm for throwers and overhead athletes.</p>
              </div>
              <div className="rounded-2xl bg-card p-4 border">
                <strong className="block text-primary mb-1">Terminal Knee Extension</strong>
                <p className="text-xs text-muted-foreground">Verifies quad lockout and patellar tracking following knee interventions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Sports Performance
            </div>
            <h3 className="text-xl font-bold mb-2">Empower Your Athletic Roster</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Connect with our sports science specialists to pilot Physiomatics across your team or performance facility.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full justify-between" variant="hero">
                <Link to="/contact">Request Team Demo <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <a href={whatsappLink("Hello Physiomatics, I coach athletes and want to discuss using the platform for performance tracking.")} target="_blank" rel="noreferrer">
                  Sports Specialist WhatsApp <Trophy className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-3">Target Academies:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Collegiate & University Athletic Programs</li>
              <li>• Youth Football & Basketball Academies</li>
              <li>• Elite Cross-Training & Strength Gyms</li>
              <li>• Private Sports Medicine Institutes</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
