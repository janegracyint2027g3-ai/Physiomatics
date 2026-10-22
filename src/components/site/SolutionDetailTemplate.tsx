import React from "react";
import { Link } from "@tanstack/react-router";
import { 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  HelpCircle,
  Activity,
  Layers,
  LineChart,
  Target,
  Stethoscope,
  HeartHandshake,
  Trophy,
  Bandage,
  Gauge,
  Users,
  UserCheck,
  Clock,
  PhoneCall,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { IcpLeadForm } from "@/components/site/IcpLeadForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { whatsappLink, WA_MESSAGES, PHONE_NUMBER_DISPLAY } from "@/lib/site";
import type { PhysiotherapySolution } from "@/data/physiotherapySolutions";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Bandage,
  Trophy,
  HeartHandshake,
  Gauge,
  Layers,
  Users,
  UserCheck,
  Stethoscope,
  Target,
  LineChart,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
};

interface SolutionDetailTemplateProps {
  solution: PhysiotherapySolution;
}

export function SolutionDetailTemplate({ solution }: SolutionDetailTemplateProps) {
  const IconComponent = iconMap[solution.iconName] || Activity;

  return (
    <>
      {/* ─── A. HERO SECTION ─── */}
      <PageHero
        eyebrow={`PHYSIOTHERAPY SOLUTIONS • ${solution.tag}`}
        title={solution.title}
        description={solution.shortDesc}
      />

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          {/* Hero text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#592787]/10 px-3.5 py-1 text-xs font-bold text-[#592787] border border-[#592787]/15">
              <span className="size-2 rounded-full bg-[#5AA9AC] animate-pulse" />
              Evidence-Informed Clinical Education
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              {solution.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {solution.heroIntro}
            </p>

            {/* Who May Benefit Box */}
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                Who May Benefit From This Therapy
              </div>
              <ul className="space-y-2">
                {solution.whoBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80">
                    <CheckCircle2 className="size-4 shrink-0 text-[#5AA9AC] mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Button asChild variant="hero" size="lg" className="rounded-full shadow-lg shadow-[#592787]/20">
                <Link to="/book">
                  Book a Consultation <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="#treatment-journey">Explore Treatment Steps</a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full text-[#5AA9AC] hover:text-[#458b8e]">
                <Link to="/analyze">Test Live AI Vision →</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-card p-3 shadow-soft group">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-[2rem] bg-muted">
                <img
                  src={solution.image}
                  alt={solution.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating pill over image */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 dark:bg-card/95 backdrop-blur-md p-3.5 shadow-lg flex items-center justify-between border border-white/40">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#592787] text-white">
                      <IconComponent className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">{solution.shortTitle} Rehabilitation</div>
                      <div className="text-[11px] text-muted-foreground">Individualized Clinical Assessment</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#5AA9AC] uppercase">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── B. CONDITIONS AND FUNCTIONAL PROBLEMS ─── */}
      <section className="container-page py-12 border-t border-border/60">
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Clinical Scope &amp; Indications
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Conditions &amp; Movement Difficulties Commonly Addressed
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Physiotherapy addresses a wide spectrum of functional movement limitations and musculoskeletal challenges. Suitability and recovery outcomes depend on individual clinical assessment, tissue healing stage, and medical precautions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solution.conditions.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-[#592787]/30 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#592787]/10 text-[#592787] font-mono text-xs font-bold">
                  0{idx + 1}
                </div>
                <h3 className="font-semibold text-base text-foreground leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border/70 text-xs">
                <span className="font-semibold text-[#5AA9AC] block text-[11px] uppercase tracking-wider mb-1">
                  Rehabilitation Focus
                </span>
                <span className="text-foreground/90">{item.clinicalFocus}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Disclaimer Alert Banner */}
        <div className="mt-8 rounded-2xl bg-muted/40 border border-border p-4.5 text-xs text-muted-foreground flex items-start gap-3 max-w-4xl mx-auto">
          <AlertTriangle className="size-5 shrink-0 text-[#5AA9AC] mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-foreground font-semibold">Individual Clinical Assessment Required: </strong>
            Physiotherapy is an individualized healthcare intervention, not a universal guarantee of cure. Every human body responds differently based on underlying tissue integrity, age, medical history, and clinical diagnosis. Always consult a licensed physiotherapist or medical physician for personalized medical evaluation.
          </p>
        </div>
      </section>

      {/* ─── C. STEP-BY-STEP PHYSIOTHERAPY PROCESS ─── */}
      <section id="treatment-journey" className="container-page py-14 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Structured Clinical Roadmap
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Your Physiotherapy Journey
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A progressive, evidence-informed framework customized for {solution.title.toLowerCase()}. Care is adapted to your symptoms, clinical comfort, and functional milestones.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solution.journeySteps.map((step) => {
            const StepIcon = iconMap[step.icon] || Activity;
            return (
              <div
                key={step.step}
                className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-[#592787]/40 hover:shadow-lg"
              >
                {/* Step indicator header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-[#592787] text-white font-mono text-sm font-bold shadow-sm">
                      {step.step}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#5AA9AC]/10 text-[#5AA9AC]">
                      <StepIcon className="size-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Key clinical activity pill */}
                <div className="mt-5 pt-3.5 border-t border-border/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Key Clinical Focus
                  </span>
                  <div className="text-xs font-medium text-[#592787] dark:text-[#a78bfa]">
                    {step.keyActivity}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground italic">
            * Educational workflow structure only. Interventions are adapted to individual clinical assessment, precautions, and patient consent.
          </p>
        </div>
      </section>

      {/* ─── D. BENEFITS AND EXPECTED FUNCTIONAL OUTCOMES ─── */}
      <section className="container-page py-12 border-t border-border/60">
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5AA9AC]">
            Anticipated Goals
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Benefits &amp; Potential Functional Outcomes
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear, achievable milestones designed to restore meaningful physical function and everyday comfort.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solution.functionalOutcomes.map((benefit, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-6 shadow-soft flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-[#5AA9AC]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5AA9AC]">
                  {benefit.category}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              <div className="mt-4 pt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-[#5AA9AC]" />
                <span>Possible therapeutic goal</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── E. EXERCISES AND EDUCATIONAL CONTENT ─── */}
      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Educational Movement Examples
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Sample Prescribed Exercises &amp; Clinical Precautions
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Examples of movements commonly prescribed in this field. Rehabilitation exercises should always be vetted by your physical therapist to match your specific tissue tolerance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {solution.sampleExercises.map((ex, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-secondary-foreground uppercase">
                  {ex.category}
                </span>
                <h3 className="mt-2 text-base font-bold text-foreground">
                  {ex.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">General Purpose: </strong>
                  {ex.purpose}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Clinical Precaution</span>
                </div>
                <p className="leading-relaxed">{ex.precautions}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-card border border-border p-4 text-center max-w-xl mx-auto">
          <p className="text-xs text-muted-foreground">
            Do not perform exercises that induce sharp or escalating pain. Seek immediate professional clinical evaluation if symptoms are severe or worsening.
          </p>
        </div>
      </section>

      {/* ─── F. PROGRESS TRACKING & PHYSIOMATICS TECHNOLOGY ─── */}
      <section className="container-page py-14 border-t border-border/60">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#17072a] via-[#260e40] to-[#1a082e] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[#5AA9AC]/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-[#592787]/40 blur-3xl" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#5AA9AC] border border-white/15">
              <Sparkles className="size-3.5" />
              On-Device Biomechanical Telemetry
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
              How Physiomatics Supports {solution.shortTitle} Rehabilitation
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Physiomatics bridges the clinic-to-home recovery gap through client-side computer vision. We provide objective exercise adherence feedback without transmitting private patient video footage to the cloud.
            </p>
          </div>

          {/* Features Grid */}
          <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solution.techFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-2 ${
                      feat.status === "Implemented in Physiomatics"
                        ? "bg-[#5AA9AC]/20 text-[#5AA9AC] border border-[#5AA9AC]/30"
                        : feat.status === "In Clinical Validation"
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        : "bg-white/10 text-white/60 border border-white/10"
                    }`}
                  >
                    {feat.status}
                  </span>
                  <h3 className="font-semibold text-sm text-white">{feat.title}</h3>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
            <span>Client-side MediaPipe landmarking • Zero video transmission • Adherence telemetry</span>
            <Button asChild size="sm" className="rounded-full bg-[#5AA9AC] hover:bg-[#479da0] text-white border-0 font-bold">
              <Link to="/how-it-works/vision">Explore Vision Engine →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── G. FREQUENTLY ASKED QUESTIONS ─── */}
      <section className="container-page max-w-4xl py-14">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Got Questions?</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Common questions regarding {solution.title.toLowerCase()} and rehabilitation workflows.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {solution.faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-2xl border border-border/80 bg-card px-5 shadow-xs"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ─── H. LEAD GENERATION & CONTACT SECTION ─── */}
      <section className="container-page py-12 border-t border-border/60">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Lead Copy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              Begin Your Rehabilitation Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Ready to Discuss Your {solution.shortTitle} Care Plan?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with our clinical and technical team to discuss personalized rehabilitation pathways, request an interactive demonstration of Physiomatics computer-vision telemetry, or ask specific exercise questions.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#5AA9AC]/10 text-[#5AA9AC]">
                  <CheckCircle2 className="size-4" />
                </div>
                <span>Centralized Vercel serverless lead capture &amp; telemetry</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#5AA9AC]/10 text-[#5AA9AC]">
                  <CheckCircle2 className="size-4" />
                </div>
                <span>Instant WhatsApp handoff for fast specialist replies</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#5AA9AC]/10 text-[#5AA9AC]">
                  <CheckCircle2 className="size-4" />
                </div>
                <span>5-step booking wizard for tailored consultations</span>
              </div>
            </div>

            {/* Direct buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Button asChild variant="hero" className="rounded-full">
                <Link to="/book">
                  <Calendar className="size-4 mr-2" /> Book Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href={whatsappLink(`Hi Physiomatics, I'm inquiring about ${solution.title}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PhoneCall className="size-4 mr-2" /> WhatsApp: {PHONE_NUMBER_DISPLAY}
                </a>
              </Button>
            </div>
          </div>

          {/* Right Lead Capture Form Card */}
          <div className="lg:col-span-6 rounded-[2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft">
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#592787] mb-1">
                Direct Inquiry Form
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Request Information for {solution.shortTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                Submit your contact details and our team will get back to you promptly.
              </p>
            </div>

            <IcpLeadForm
              segment={solution.title}
              ctaLabel={`Request Consultation for ${solution.shortTitle}`}
              whatsappMessage={`Hello Physiomatics, I would like to inquire about ${solution.title} and see a demonstration.`}
            />
          </div>
        </div>

        {/* Related Solutions Navigation */}
        <div className="mt-16 pt-10 border-t border-border/70">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Related Physiotherapy Disciplines
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {solution.relatedSolutions.map((rel) => (
              <Link
                key={rel.slug}
                to={`/solutions/${rel.slug}` as any}
                className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-[#592787]/40 hover:shadow-sm hover:-translate-y-0.5"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5AA9AC]">
                    {rel.tag}
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {rel.title}
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
