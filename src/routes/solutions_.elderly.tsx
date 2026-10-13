import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  HeartHandshake, 
  Eye, 
  CheckSquare, 
  PhoneCall, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  Accessibility, 
  Armchair,
  Sparkles
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/solutions_/elderly")({
  head: () => ({
    meta: [
      { title: "Elderly Care & Fall Prevention Mobility Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Accessible movement guidance, seated exercise protocols, and high-contrast interfaces designed to help older adults maintain mobility safely." 
      },
      { property: "og:title", content: "Elderly Care & Mobility Solutions — Physiomatics" },
      { property: "og:description", content: "Safe, dignified exercise tracking designed for senior adults and caregivers." },
    ],
  }),
  component: ElderlyCarePage,
});

const ACCESSIBILITY_PILLARS = [
  {
    icon: Armchair,
    title: "Seated-First Exercise Protocols",
    description: "Focus on stable, seated movements (such as seated knee extensions) that build essential quadriceps strength without introducing fall hazards."
  },
  {
    icon: Eye,
    title: "High-Contrast, Large-Type Interface",
    description: "Generous font sizes, distinct color contrast, and uncluttered layouts designed specifically for users with age-related visual impairments."
  },
  {
    icon: Volume2,
    title: "Multi-Sensory Audio Chimes",
    description: "Clear audio tones announce repetition completion, removing the need for seniors to strain their neck watching the device screen during exercise."
  },
  {
    icon: ShieldCheck,
    title: "Zero-Friction Camera Setup",
    description: "Simple camera framing that family members or visiting nurses can configure on any standard smartphone or tablet in under 30 seconds."
  }
];

const SENIOR_SAFETY_RULES = [
  "Always position a sturdy, unwheeled, armrest-equipped chair on a non-slip floor.",
  "Never attempt standing balance exercises without a caregiver or therapist within arm's reach.",
  "Ensure room lighting is bright and free of shadows across the floor area.",
  "Wear supportive, non-skid footwear or grip socks—never walk or exercise in loose slippers.",
  "Stop immediately if feeling lightheaded, dizzy, short of breath, or joint discomfort."
];

const ELDERLY_FAQS = [
  {
    q: "Does using Physiomatics guarantee that an older adult will not fall?",
    a: "No technology can guarantee fall prevention. Fall risk is multifaceted and influenced by balance, medication, vision, and home hazards. Physiomatics provides accessible exercise guidance to help maintain muscular strength and joint mobility under professional guidance."
  },
  {
    q: "Can an elderly family member use this independently if they are not tech-savvy?",
    a: "While our interface is simplified, we strongly recommend that seniors begin their sessions with the assistance of a family member, caregiver, or home health aide to position the camera and ensure environmental stability."
  },
  {
    q: "Are the exercises safe for seniors with knee arthritis or hip replacements?",
    a: "Our seated knee extension module provides gentle, non-weight-bearing quadriceps activation commonly prescribed for knee osteoarthritis. However, any individual with joint replacements or active arthritis must have their routine approved by their treating physical therapist."
  }
];

export function ElderlyCarePage() {
  return (
    <>
      <PageHero 
        eyebrow="Geriatric Mobility & Active Aging" 
        title="Dignified, Safe Movement Guidance for Older Adults"
        description="Empowering seniors to maintain independent mobility, preserve lower limb strength, and practice home exercises safely with accessible design and seated protocols."
      />

      {/* Hero Overview */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Mobility Preservation
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Preserving Independence Through Accessible Movement
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Loss of lower extremity muscle strength (sarcopenia) and impaired joint range of motion are primary drivers of loss of independence in senior years. While physical therapists prescribe regular home exercises, older adults often abandon routines because technology feels intimidating or complex.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics rethinks movement tracking from an accessibility-first perspective. With seated exercise routines, audible rep confirmations, and zero required account logins, seniors can focus on what matters most: maintaining the strength needed for daily living.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/analyze" search={{ exercise: "knee_ext" }}>
                  Try Seated Knee Extension <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="whatsapp">
                <a href={whatsappLink(WA_MESSAGES.elderly)} target="_blank" rel="noreferrer">
                  Consult via WhatsApp ({PHONE_NUMBER_DISPLAY})
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Fall Prevention Safety Protocol</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Essential Environmental Checklist</h3>

            <ul className="space-y-3">
              {SENIOR_SAFETY_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950 dark:text-amber-100">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Supervision Notice</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Technology complements human care—it does not replace it. If an older adult has a documented history of falls, caregiver presence is mandatory during all sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Accessibility Pillars */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Design Principles</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Built Specifically for Senior Accessibility
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thoughtful engineering that removes cognitive load and digital intimidation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACCESSIBILITY_PILLARS.map((p, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <p.icon className="h-6 w-6" />
                </div>
                <h4 className="text-base font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Elderly Care Questions & Answers
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {ELDERLY_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`elderly-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
