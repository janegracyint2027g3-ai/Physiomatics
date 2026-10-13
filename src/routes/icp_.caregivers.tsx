import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { IcpLeadForm } from "@/components/site/IcpLeadForm";
import { 
  Users, 
  Heart, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Sparkles,
  Check
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import caregiverHome from "@/assets/caregiver_home.jpg";
import caregiverAssisted from "@/assets/caregiver_assisted_session.jpg";
import patientPhone from "@/assets/patient_phone_tracking.jpg";

export const Route = createFileRoute("/icp_/caregivers")({
  head: () => ({
    meta: [
      { title: "Family & Professional Caregivers ICP — Physiomatics" },
      { name: "description", content: "Actionable guidance, reassurance, and easy monitoring tools for family members and home health aides supporting patient rehabilitation." },
      { property: "og:title", content: "Physiomatics for Caregivers & Home Health Aides" },
    ],
  }),
  component: CaregiversICPPage,
});

function CaregiversICPPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Profile: Family Caregivers & Home Health Assistants" 
        title="Be The Best Support System For Your Loved One's Recovery."
      >
        Caring for someone after surgery or illness can be overwhelming. Physiomatics gives you clear, non-technical visual feedback so you know they are performing exercises safely.
      </PageHero>

      <div className="container-page -mt-8 mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border">
          <img 
            src={caregiverHome} 
            alt="Compassionate Caregiver Assisting Recovery in Home Setting" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="size-3.5" /> Home Support & Reassurance
            </span>
            <h3 className="text-xl md:text-2xl font-bold">Taking The Stress Out of Daily Physical Therapy at Home</h3>
          </div>
        </div>
      </div>

      <section className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-12">
          {/* Caregiver Realities */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-semibold mb-3">
              <Users className="size-5" />
              <span>Target Persona: Spouses, Adult Children & Professional In-Home Aides</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Taking The Stress Out of Daily Physical Therapy Routines
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Caregivers carry an immense emotional load. When an orthopedist or physical therapist assigns 3 sets of 10 daily repetitions, family members are often left wondering: "Is mom straining her back? Should I tell dad to stop? Are we doing more harm than good?"
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Physiomatics takes that burden off your shoulders. The tool provides clear color indications (green for in-range movement, amber for deviation) so both the caregiver and patient have instantaneous objective reassurance.
            </p>
          </div>

          {/* Key Caregiver Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Heart className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Reassurance on Every Set</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clear visual markers confirm when your loved one has achieved the target range of motion before prompting the next repetition.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <HelpCircle className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Non-Technical Language</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No complex medical jargon. The interface uses plain English cues like "Slow down slightly" or "Great extension" to keep the experience enjoyable.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <MessageSquare className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Easy Progress Sharing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Show your physical therapist exactly how many sessions were completed and show proof of range improvements on your phone during your next clinical visit.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <ShieldCheck className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Zero Cloud Risk</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Personal home videos are never recorded to the internet, keeping your home environment completely private and secure.
              </p>
            </div>
          </div>

          {/* Visual Showcase: Progress Sharing */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-md">
            <div className="relative h-64 md:h-72 w-full overflow-hidden">
              <img src={patientPhone} alt="Patient reviewing exercise progress data on mobile phone" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-600 px-2.5 py-0.5 rounded-full">Session Progress Reports</span>
                <h3 className="text-xl font-bold mt-2">Share Verified Session Data With Your Loved One's Therapist</h3>
              </div>
            </div>
            <div className="p-6 grid sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground mt-0.5">On-Device Processing</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-emerald-600">Real-time</div>
                <div className="text-xs text-muted-foreground mt-0.5">Visual Feedback Colors</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-muted-foreground mt-0.5">Medical Jargon Required</div>
              </div>
            </div>
          </div>

          {/* Testimonial with Caregiver Session Image */}
          <div className="rounded-3xl bg-muted/40 border overflow-hidden">
            <div className="grid md:grid-cols-[220px_1fr] items-center">
              <div className="h-full min-h-[180px] w-full overflow-hidden">
                <img src={caregiverAssisted} alt="Caregiver lovingly helping patient with rehabilitation exercises" className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">Peace of Mind, Every Single Day</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "After my husband's hip replacement, I was terrified of helping him do the exercises wrong. Physiomatics gives me real-time color signals — green means he's safe, amber means slow down. It's like having a physio in the room with us."
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                  <Heart className="size-4" /> Recommended for: Spousal Carers & Post-Surgical Home Care
                </div>
              </div>
            </div>
          </div>

          {/* Caregiver Checklist */}
          <div className="rounded-3xl bg-muted/40 border p-8">
            <h3 className="text-xl font-bold mb-4">Daily Caregiver Checklist for Success</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong>Consistent Time of Day:</strong> Schedule exercises when your loved one is well-rested, typically mid-morning.
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong>Clear Lighting & Position:</strong> Ensure good lighting so the camera detects key shoulder, hip, and knee landmarks clearly.
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong>Prioritize Form Over Speed:</strong> Encourage deliberate, steady reps over rapid movements.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Caregiver Resource
            </div>
            <h3 className="text-xl font-bold mb-1">Register for Caregiver Support</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Leave your details and we'll walk you through how to use Physiomatics with your family member.
            </p>
            <IcpLeadForm
              segment="Family Caregiver"
              ctaLabel="Get Caregiver Guide"
              whatsappMessage="Hi Physiomatics! I'm a family caregiver and would like help using the platform for a loved one."
            />
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-2">Need Help Getting Started?</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Our support team can answer any questions on setting up your camera or tablet.
            </p>
            <Button asChild variant="outline" className="w-full text-xs">
              <a href={whatsappLink("Hello Physiomatics team, I am a family caregiver and have questions about using the platform.")} target="_blank" rel="noreferrer">
                WhatsApp Support (7845072426)
              </a>
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
