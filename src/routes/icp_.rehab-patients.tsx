import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { IcpLeadForm } from "@/components/site/IcpLeadForm";
import { 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  Smile, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import rehabMirror from "@/assets/rehab_patient_mirror.jpg";
import patientPhone from "@/assets/patient_phone_tracking.jpg";
import caregiverAssisted from "@/assets/caregiver_assisted_session.jpg";

export const Route = createFileRoute("/icp_/rehab-patients")({
  head: () => ({
    meta: [
      { title: "Post-Operative & Rehab Patients ICP — Physiomatics" },
      { name: "description", content: "Recover with confidence at home with real-time pose tracking, repetition counting, and zero performance anxiety." },
      { property: "og:title", content: "Physiomatics for Patients in Rehabilitation" },
    ],
  }),
  component: RehabPatientsICPPage,
});

function RehabPatientsICPPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Profile: Recovering Individuals & Surgical Patients" 
        title="Recover With Absolute Confidence. Never Wonder If You're Doing It Right."
      >
        Doing your home physical therapy can feel lonely and confusing. Physiomatics acts like a virtual mirror, giving you real-time visual confirmation on every repetition.
      </PageHero>

      <div className="container-page -mt-8 mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border">
          <img 
            src={rehabMirror} 
            alt="Virtual Mirror Joint Tracking and Home Rehabilitation Feedback" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <UserCheck className="size-3.5" /> Virtual Biofeedback Mirror
            </span>
            <h3 className="text-xl md:text-2xl font-bold">Real-Time Joint Angle Guidance From the Comfort of Home</h3>
          </div>
        </div>
      </div>

      <section className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-12">
          {/* Patient Perspective */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-semibold mb-3">
              <UserCheck className="size-5" />
              <span>Target Persona: Individuals recovering from joint, tendon, or muscle injury</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              "Am I bending too far? Did I do 10 or 12 reps? Is this helping?"
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When your therapist sends you home with exercise instructions, it's easy to second-guess yourself. Flawed movement can aggravate inflamed tendons or cause compensatory aches in other joints.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Physiomatics uses your device's camera like an intelligent mirror. You see your body with smooth skeletal overlays. As you bend your knee or raise your arm, the screen shows your real-time angle and chimes when you complete a proper rep.
            </p>
          </div>

          {/* Patient Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <PlayCircle className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Automated Repetition Counter</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No need to keep count in your head while focusing on your balance. The AI recognizes the start, peak range, and return phases of every movement.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <ShieldCheck className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">100% Private & Safe</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your video never leaves your phone or computer. Everything is calculated locally inside your browser window. No recordings are ever uploaded to any cloud server.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Activity className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Visual Range of Motion Goals</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Watch your range of motion improve day by day. See yourself reach 90°, 100°, and 115° as your joint heals and flexibility returns.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Smile className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Zero Complicated Equipment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You don't need sensors strapped to your limbs, specialized watches, or costly smart mats. Just your standard phone or computer camera.
              </p>
            </div>
          </div>

          {/* Visual Showcase: Smartphone Biofeedback Mirror */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-md">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <img src={patientPhone} alt="Patient exercising with smartphone tripod tracking angles in real time" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 px-3 py-1 rounded-full">Patient Virtual Mirror</span>
                <h3 className="text-xl md:text-2xl font-bold mt-2">Live Angle Node Guidance & Automated Rep Counter</h3>
              </div>
            </div>
            <div className="p-6 md:p-8 grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="text-lg font-bold mb-2">Instant Visual Affirmation ("GOOD FORM")</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Never worry if your knee is flexing enough or if your posture is sagging. Green skeletal lines guide your joints to exact clinical thresholds (105° Knee Flexion, 92° Hip Extension), locking in safe muscle memory.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden border">
                <img src={caregiverAssisted} alt="Family assisted extension therapy" className="h-44 w-full object-cover" />
                <div className="p-3 bg-muted/40 text-xs font-medium text-muted-foreground text-center">
                  Share Your Verified Repetitions Directly With Your Physical Therapist
                </div>
              </div>
            </div>
          </div>

          {/* Simple Steps */}
          <div className="rounded-3xl bg-primary-soft p-8 border">
            <h3 className="text-xl font-bold mb-4">How To Use It At Home</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl bg-card p-4 border shadow-sm">
                <div className="size-7 rounded-full bg-primary text-primary-foreground font-bold grid place-items-center mb-2">1</div>
                <div className="font-semibold mb-1">Set Up Your Device</div>
                <p className="text-xs text-muted-foreground">Place your phone or laptop on a stable surface 6–8 feet away so your full body or joint is visible.</p>
              </div>

              <div className="rounded-2xl bg-card p-4 border shadow-sm">
                <div className="size-7 rounded-full bg-primary text-primary-foreground font-bold grid place-items-center mb-2">2</div>
                <div className="font-semibold mb-1">Select Exercise</div>
                <p className="text-xs text-muted-foreground">Choose Squats, Arm Raises, or Leg Extensions matching your clinician's prescription.</p>
              </div>

              <div className="rounded-2xl bg-card p-4 border shadow-sm">
                <div className="size-7 rounded-full bg-primary text-primary-foreground font-bold grid place-items-center mb-2">3</div>
                <div className="font-semibold mb-1">Move & Recover</div>
                <p className="text-xs text-muted-foreground">Follow the visual cues, complete your sets, and celebrate your milestone achievements!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Start Moving Today
            </div>
            <h3 className="text-xl font-bold mb-1">Begin Your Recovery Journey</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Register and we'll connect you with a guided Physiomatics rehab session.
            </p>
            <IcpLeadForm
              segment="Rehab Patient"
              ctaLabel="Start My Recovery Plan"
              whatsappMessage="Hi Physiomatics! I'm recovering from an injury and would like to use the platform for guided rehab."
            />
          </div>

          <div className="rounded-3xl border bg-muted/40 p-6">
            <h4 className="font-semibold mb-2">Have questions about your injury?</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Physiomatics supports recovery under physical therapist supervision. Message our support desk on WhatsApp for assistance.
            </p>
            <Button asChild variant="outline" className="w-full text-xs">
              <a href={whatsappLink("Hi Physiomatics, I am recovering from an injury and want to ask about using the tool.")} target="_blank" rel="noreferrer">
                Ask Questions on WhatsApp
              </a>
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
