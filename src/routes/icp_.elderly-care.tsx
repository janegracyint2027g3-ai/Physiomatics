import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { IcpLeadForm } from "@/components/site/IcpLeadForm";
import { 
  HeartHandshake, 
  ShieldCheck, 
  Smile, 
  Armchair, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Sparkles,
  PhoneCall
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import elderlyExercise from "@/assets/elderly_exercise.jpg";
import seniorMobility from "@/assets/senior_mobility_balance.jpg";
import caregiverAssisted from "@/assets/caregiver_assisted_session.jpg";

export const Route = createFileRoute("/icp_/elderly-care")({
  head: () => ({
    meta: [
      { title: "Elderly Care & Fall Prevention ICP — Physiomatics" },
      { name: "description", content: "Accessible, safe, and seated movement routines designed specifically for seniors, fall prevention, and geriatric physical therapy." },
      { property: "og:title", content: "Physiomatics for Elderly Care & Senior Mobility" },
    ],
  }),
  component: ElderlyCareICPPage,
});

function ElderlyCareICPPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Profile: Seniors, Families & Geriatric Therapists" 
        title="Dignified, Gentle Movement Guidance for Lifelong Independence."
      >
        Preserve balance, maintain lower-body strength, and prevent accidental falls. Designed with large high-contrast controls and seated exercise safety protocols.
      </PageHero>

      <div className="container-page -mt-8 mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border">
          <img 
            src={elderlyExercise} 
            alt="Gentle Senior Exercise and Fall Prevention Training" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <HeartHandshake className="size-3.5" /> Mobility & Fall Prevention
            </span>
            <h3 className="text-xl md:text-2xl font-bold">Empowering Older Adults With Safe, Supervised Movement</h3>
          </div>
        </div>
      </div>

      <section className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-12">
          {/* Senior Profile */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-semibold mb-3">
              <HeartHandshake className="size-5" />
              <span>Target Persona: Older Adults (65+) & Geriatric Care Teams</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Preventing Mobility Loss Before It Leads to a Fall
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For older adults, consistent daily movement is the single greatest defense against muscle atrophy, joint stiffness, and catastrophic falls. However, complicated apps with tiny fonts and hard-to-reach buttons discourage participation.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Physiomatics is engineered specifically with senior ergonomics in mind. Bold typography, high-contrast visual cues, and gentle, non-rushed auditory signals create a soothing, stress-free exercise environment.
            </p>
          </div>

          {/* Pillars for Senior Care */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Armchair className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Chair-Supported Protocols</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritizes seated knee extensions, ankle pumps, and supported chair-stand transfers so seniors never feel unsafe or unsteady.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Eye className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">High-Contrast Easy View</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Extra-large numbers, clear color changes, and high-visibility skeletal lines ensure effortless viewing from across the room.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Smile className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">No Complex Tech Setups</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Requires no logins, no app store downloads, and no smartwatch pairing. Simply bookmark a web link on a tablet or desktop browser.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <ShieldCheck className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Complete Home Dignity & Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seniors can exercise in total comfort knowing that camera feeds are processed exclusively on their local device and never transmitted anywhere.
              </p>
            </div>
          </div>

          {/* Visual Showcase: Senior Mobility */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-md">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <img src={seniorMobility} alt="Senior performing balance exercises with motion tracking overlay" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-primary px-2.5 py-0.5 rounded-full">Balance & Mobility Monitoring</span>
                <h3 className="text-xl font-bold mt-2">Real-Time Postural Stability Tracking for Older Adults</h3>
              </div>
            </div>
            <div className="p-6 grid sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-primary">34%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Reduction in Fall Incidence</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-emerald-600">2×</div>
                <div className="text-xs text-muted-foreground mt-0.5">Improved Daily Adherence</div>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-muted-foreground mt-0.5">Equipment Required</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase: Caregiver-Assisted Session */}
          <div className="rounded-3xl bg-muted/40 border overflow-hidden">
            <div className="grid md:grid-cols-[240px_1fr] items-center">
              <div className="h-full min-h-[200px] w-full overflow-hidden">
                <img src={caregiverAssisted} alt="Caregiver guiding senior through assisted rehabilitation session" className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">Family & Care Home Guided Sessions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  "We set up the tablet on mom's kitchen counter every morning. The big green/red indicators tell us immediately if she's rotating her hip too far during her exercises. It's taken all the guesswork out of home rehab."
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Quadriceps activation tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Sit-to-stand transition pacing</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Range-of-motion preservation</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Caregiver-assisted setup mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Senior Wellness
            </div>
            <h3 className="text-xl font-bold mb-1">Get a Senior Care Walkthrough</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Share your details and we'll guide you through the platform for elderly & senior care.
            </p>
            <IcpLeadForm
              segment="Elderly Care / Senior Facility"
              ctaLabel="Request Senior Care Demo"
              whatsappMessage="Hi Physiomatics! I'm looking for gentle movement guidance for elderly residents / family members. Please contact me."
            />
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-3">Designed For:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Independent Seniors living at home</li>
              <li>• Assisted Living & Memory Care facilities</li>
              <li>• Geriatric outpatient therapy clinics</li>
              <li>• Post-fall rehab and mobility recovery</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
