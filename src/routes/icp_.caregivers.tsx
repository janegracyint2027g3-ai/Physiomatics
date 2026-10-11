import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
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
            <h3 className="text-xl font-bold mb-2">Start a Guided Session</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Launch our movement assistant and support your family member with confidence today.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full justify-between" variant="hero">
                <Link to="/analyze">Open AI Movement Tool <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <Link to="/solutions/caregiver">Caregiver Guides <Users className="size-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-2">Need Help Getting Started?</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Our support team can answer any questions on setting up your camera or tablet.
            </p>
            <Button asChild variant="outline" className="w-full text-xs">
              <a href={whatsappLink("Hello Physiomatics team, I am a family caregiver and have questions about using the platform.")} target="_blank" rel="noreferrer">
                Chat With Support
              </a>
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
