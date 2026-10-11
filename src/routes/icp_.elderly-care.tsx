import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
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

      <section className="container-page py-16 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
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

          {/* Fall Prevention Science */}
          <div className="rounded-3xl bg-muted/40 border p-8">
            <h3 className="text-xl font-bold mb-3">The Fall Prevention Framework</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Regular participation in targeted lower-limb resistance and balance routines reduces fall incidence by up to 34% among seniors living independently. Physiomatics helps maintain the consistency required to build enduring quad and hip strength.
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

        {/* Sidebar */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Senior Wellness
            </div>
            <h3 className="text-xl font-bold mb-2">Support Your Loved One</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Learn how family members and assisted living facilities deploy Physiomatics for senior residents.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full justify-between" variant="hero">
                <Link to="/solutions/elderly">Explore Senior Protocols <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <a href={whatsappLink("Hello, I am looking for gentle movement guidance for an elderly family member.")} target="_blank" rel="noreferrer">
                  Speak on WhatsApp <PhoneCall className="size-4" />
                </a>
              </Button>
            </div>
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
