import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope, HeartHandshake, Bandage, GraduationCap, ScanLine, Video, LineChart, ClipboardCheck, ShieldCheck, Gauge, Repeat, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHead } from "@/components/site/PageHero";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";
import { FAQS } from "@/lib/faq";
import hero from "@/assets/hero.jpg";
import rehab from "@/assets/rehab.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Physiomatics — Smarter Physiotherapy, More Informed Recovery" },
      { name: "description", content: "Video-guided exercises, in-browser AI movement analysis and progress monitoring for elderly care and injury rehabilitation." },
      { property: "og:title", content: "Physiomatics — Move Better. Recover Smarter. Age Stronger." },
      { property: "og:description", content: "AI-assisted movement monitoring that helps people follow prescribed exercises and understand their progress." },
    ],
  }),
  component: Home,
});

const audiences = [
  { icon: Stethoscope, title: "Physiotherapists & clinics", text: "See how patients perform home exercises and compare sessions.", cta: "Book a physiotherapist demo" },
  { icon: HeartHandshake, title: "Elderly people & caregivers", text: "Simple, seated, large-button guidance with family support.", cta: "Explore elderly care" },
  { icon: Bandage, title: "Injury rehabilitation", text: "Stay on track with a prescribed program between visits.", cta: "Start your journey" },
  { icon: GraduationCap, title: "Physiotherapy educators", text: "Teach movement analysis with real video and joint angles.", cta: "Explore education" },
];

const steps = [
  { icon: ClipboardCheck, t: "Select a prescribed exercise" },
  { icon: Video, t: "Watch the demo and record yourself" },
  { icon: ScanLine, t: "AI detects landmarks and joint angles" },
  { icon: LineChart, t: "Review progress with your physiotherapist" },
];

function Home() {
  return (
    <>
      <section className="bg-hero">
        <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div className="animate-rise">
            <div className="eyebrow">Physiotherapy training online</div>
            <h1 className="mt-5 text-5xl leading-[1.05] md:text-7xl">Smarter physiotherapy. <em className="text-primary">More informed</em> recovery.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">Follow prescribed exercises, record a short video, and get estimated joint angles and repetition counts — analyzed privately in your browser and ready to share with your physiotherapist.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/contact">Book a Demo <ArrowRight /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/analyze">Try the video analysis</Link></Button>
              <Button asChild variant="ghost" size="lg"><a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">Chat on WhatsApp</a></Button>
            </div>
          </div>
          <div className="relative animate-rise [animation-delay:150ms]">
            <img src={hero} alt="An older woman doing a seated knee extension guided by a physiotherapist" width={1408} height={1056} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
            <div className="absolute -bottom-6 left-6 rounded-2xl border bg-card p-4 shadow-soft">
              <div className="text-xs text-muted-foreground">Seated knee extension</div>
              <div className="mt-1 flex items-baseline gap-4">
                <span className="font-display text-3xl">8 reps</span>
                <span className="text-sm text-primary">78° range</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Illustrative example</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <SectionHead eyebrow="Who it's for" title="Built for everyone in the recovery journey" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <Link key={a.title} to="/solutions" className="group rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1">
              <a.icon className="size-8 text-primary" />
              <h3 className="mt-5 text-xl">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
              <div className="mt-5 text-sm font-semibold text-primary group-hover:underline">{a.cta} →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 text-ink-foreground">
        <div className="container-page">
          <div className="eyebrow text-coral">How it works</div>
          <h2 className="mt-3 max-w-2xl text-3xl md:text-5xl">Four steps from exercise to insight</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-3xl border border-ink-foreground/10 p-6">
                <div className="font-display text-5xl text-coral">0{i + 1}</div>
                <s.icon className="mt-6 size-6 opacity-80" />
                <p className="mt-3 font-semibold">{s.t}</p>
              </li>
            ))}
          </ol>
          <Button asChild variant="hero" className="mt-10"><Link to="/how-it-works">Explore how it works</Link></Button>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 py-24 lg:grid-cols-2">
        <img src={rehab} alt="A man recording a squat on a phone tripod in a rehab studio" width={1216} height={912} loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover" />
        <div>
          <SectionHead eyebrow="AI video analytics" title="Real computer vision, honestly explained" sub="Physiomatics runs a pose-estimation model directly in your browser. Your video never leaves your device." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [ScanLine, "33 body landmarks", "Skeletal overlay on your recording."],
              [Gauge, "Joint-angle estimates", "Knee and shoulder, in the camera's plane."],
              [Repeat, "Repetition counting", "Exercise-specific thresholds, not one-size-fits-all."],
              [Eye, "Confidence indicators", "Metrics hidden when visibility is too low."],
            ].map(([I, t, d]) => {
              const Icon = I as typeof ScanLine;
              return (
                <li key={t as string} className="rounded-2xl bg-muted p-4">
                  <Icon className="size-5 text-primary" />
                  <div className="mt-2 font-semibold">{t as string}</div>
                  <div className="text-sm text-muted-foreground">{d as string}</div>
                </li>
              );
            })}
          </ul>
          <Button asChild className="mt-8"><Link to="/analyze">Analyze a video now <ArrowRight /></Link></Button>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-primary-soft p-8 md:col-span-2">
            <ShieldCheck className="size-7 text-primary" />
            <h3 className="mt-4 text-2xl">Physiotherapist oversight, by design</h3>
            <p className="mt-3 text-muted-foreground">Results are estimates meant for professional review. Physiomatics supports — and never replaces — your physiotherapist. It does not diagnose conditions or guarantee recovery.</p>
            <Link to="/safety" className="mt-4 inline-block text-sm font-semibold text-primary">Our safety principles →</Link>
          </div>
          <div className="rounded-3xl border bg-card p-8">
            <h3 className="text-2xl">Progress over time</h3>
            <p className="mt-3 text-sm text-muted-foreground">Each analyzed session is saved on your device so you can compare movement range and repetitions across weeks.</p>
            <Link to="/platform" className="mt-4 inline-block text-sm font-semibold text-primary">See the platform →</Link>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="FAQ" title="Questions, answered plainly" />
        <Accordion type="single" collapsible>
          {FAQS.slice(0, 6).map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container-page">
        <div className="rounded-[2rem] bg-primary p-10 text-primary-foreground md:p-16">
          <h2 className="max-w-2xl text-3xl md:text-5xl">Ready to see Physiomatics in action?</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/contact">Book a Demo</Link></Button>
            <Button asChild variant="whatsapp" size="lg"><a href={whatsappLink(WA_MESSAGES.demo)} target="_blank" rel="noreferrer">Chat on WhatsApp</a></Button>
          </div>
        </div>
      </section>
    </>
  );
}
