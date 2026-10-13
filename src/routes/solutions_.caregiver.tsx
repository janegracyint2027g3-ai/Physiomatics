import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Users, 
  Camera, 
  ShieldAlert, 
  ArrowRight, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  EyeOff, 
  PhoneCall,
  Sparkles,
  ClipboardList
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/solutions_/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver Support & Assisted Exercise Workflows — Physiomatics" },
      { 
        name: "description", 
        content: "Practical guides and tools for family members and professional caregivers assisting loved ones with prescribed physical therapy routines." 
      },
      { property: "og:title", content: "Caregiver Support & Assisted Workflows — Physiomatics" },
      { property: "og:description", content: "Empowering caregivers with simple setup, automated rep counting, and local privacy." },
    ],
  }),
  component: CaregiverPage,
});

const CAREGIVER_BENEFITS = [
  {
    icon: Volume2,
    title: "Automated Repetition Counting",
    detail: "The computer vision engine counts valid repetitions and announces them with audio tones, freeing you from manual counting so you can focus on patient safety."
  },
  {
    icon: EyeOff,
    title: "Absolute Home Privacy",
    detail: "Zero video frames leave your device. Camera feeds are processed locally in the browser, safeguarding patient dignity and home privacy."
  },
  {
    icon: ClipboardList,
    title: "Automatic Session Logs",
    detail: "Completed repetitions and dates are recorded locally, making it effortless to report weekly adherence to the visiting physical therapist."
  },
  {
    icon: HeartHandshake,
    title: "Strengthened Rapport",
    detail: "Removes frustration and tension during home exercises. The app acts as an objective guide, letting you focus on encouragement and emotional support."
  }
];

const CAREGIVER_PLAYBOOK = [
  {
    step: "01",
    action: "Environment Prep",
    desc: "Clear a 2x2m space. Ensure the patient is seated in a sturdy, unwheeled chair or standing on non-slip flooring."
  },
  {
    step: "02",
    action: "Camera Placement",
    desc: "Position the phone or laptop on a stable table roughly 2 to 2.5 meters away, matching hip height."
  },
  {
    step: "03",
    action: "Patient Briefing",
    desc: "Confirm the patient is hydrated, feeling steady, and ready to start. Explain that audio chimes will guide each rep."
  },
  {
    step: "04",
    action: "Supervised Execution",
    desc: "Stay within arm's reach for physical spotting. Allow the system to track joint angles and validate full extension."
  },
  {
    step: "05",
    action: "Session Review",
    desc: "Review the instant summary screen together. Praise their consistency and let the session log automatically."
  }
];

const CAREGIVER_FAQS = [
  {
    q: "Do I need technical expertise to set this up for my family member?",
    a: "None at all. If you can open a web browser on a phone, tablet, or laptop, you can run Physiomatics. There is no software to install and no account creation required."
  },
  {
    q: "What if the person I am caring for cannot stand up for exercises?",
    a: "Physiomatics includes dedicated seated routines, such as seated knee extensions, specifically engineered for individuals with balance challenges or mobility impairments."
  },
  {
    q: "Can I adjust the angle targets or prescribe new exercises myself?",
    a: "No. Professional boundaries are crucial. Caregivers should never independently modify target exercise depths, repetitions, or protocols without explicit instruction from the treating physical therapist."
  }
];

export function CaregiverPage() {
  return (
    <>
      <PageHero 
        eyebrow="Family & Professional Caregiver Support" 
        title="Making Supported Home Rehabilitation Easier and Safer"
        description="Empowering family members, nursing aides, and caregivers with automated repetition tracking, simplified camera guidance, and zero-cloud privacy."
      />

      {/* Hero Overview */}
      <section className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Caregiver Relief
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Focus on the Person, Not the Math
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Caring for a recovering loved one or an aging parent is physically and emotionally demanding. Trying to manually count repetitions, verify correct joint extension, check the clock, and maintain physical spotting all at once can feel overwhelming.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics lifts the computational burden. The browser-based AI handles repetition validation, pacing audio cues, and session documentation—allowing you to be fully present as a supportive, reassuring companion.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/how-it-works/workflow">
                  Review Setup Workflow <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="whatsapp">
                <a href={whatsappLink(WA_MESSAGES.elderly)} target="_blank" rel="noreferrer">
                  Caregiver Advice on WhatsApp ({PHONE_NUMBER_DISPLAY})
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Caregiver Benefits</h3>
                <p className="text-xs text-muted-foreground">Practical tools for daily support</p>
              </div>
            </div>

            <div className="space-y-3">
              {CAREGIVER_BENEFITS.map((b, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-muted/30 p-3.5 text-xs">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <b.icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{b.title}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground leading-relaxed pl-6">{b.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950 dark:text-amber-100">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Clinical Boundaries</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Always ensure the patient exercises only within the safe envelope authorized by their licensed physical therapist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Caregiver Playbook */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Step-by-Step Guidance
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
              The 5-Minute Assisted Session Playbook
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A straightforward routine for caregivers to guide stress-free exercise bouts.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CAREGIVER_PLAYBOOK.map((p) => (
              <div key={p.step} className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
                <span className="font-mono text-xs font-bold text-primary">STEP {p.step}</span>
                <h4 className="mt-2 text-sm font-semibold text-foreground">{p.action}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Caregiver FAQs
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {CAREGIVER_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`caregiver-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
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
