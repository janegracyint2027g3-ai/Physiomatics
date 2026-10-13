import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { IcpLeadForm } from "@/components/site/IcpLeadForm";
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
import athleteKinematics from "@/assets/athlete_sports_kinematics.jpg";
import patientPhone from "@/assets/patient_phone_tracking.jpg";

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

          {/* Visual Showcase: Athlete Kinematics Lab */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-md">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <img src={athleteKinematics} alt="Athlete performing squat with AI skeletal overlay showing joint angles" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-primary px-2.5 py-0.5 rounded-full">Live Bilateral Symmetry Analysis</span>
                <h3 className="text-xl font-bold mt-2">Sub-Degree Joint Angle Telemetry for Every Athlete on Your Roster</h3>
              </div>
            </div>
            <div className="p-6 grid sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-primary">&lt; 2°</div>
                <div className="text-xs text-muted-foreground mt-0.5">Bilateral Asymmetry Detection</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-emerald-600">20+</div>
                <div className="text-xs text-muted-foreground mt-0.5">Athletes Screened Per Hour</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-muted-foreground mt-0.5">Sensors or Markers Needed</div>
              </div>
            </div>
          </div>

          {/* Return-to-Play Data Sharing */}
          <div className="rounded-3xl bg-muted/40 border overflow-hidden">
            <div className="grid md:grid-cols-[220px_1fr] items-center">
              <div className="h-full min-h-[180px] w-full overflow-hidden">
                <img src={patientPhone} alt="Coach reviewing athlete return-to-play clearance data on phone" className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">Objective Return-to-Play Clearance Data</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Before we cleared our striker post-ACL, we had six weeks of Physiomatics symmetry data from his home sessions. The surgeon could see the exact flexion trajectory week-over-week. No guesswork — just objective biomechanical evidence."
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-4" /> Accepted by Sports Medicine Physicians & Athletic Directors
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Sports Performance
            </div>
            <h3 className="text-xl font-bold mb-1">Request Your Academy Demo</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Takes 30 seconds. Our sports science team will reach you on WhatsApp (+91 78450 72426) to pilot the platform.
            </p>
            <IcpLeadForm
              segment="Sports Academy"
              ctaLabel="Get Sports Academy Demo"
              whatsappMessage="Hi Physiomatics! I coach athletes at a sports academy and want to pilot the platform for performance tracking."
            />
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
