import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope, HeartHandshake, Bandage, GraduationCap, ScanLine, Video, LineChart, ClipboardCheck, ShieldCheck, Gauge, Repeat, Eye, BarChart, History, CheckCircle2, Shield, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHead } from "@/components/site/PageHero";
import { Testimonials } from "@/components/site/Testimonials";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";
import { FAQS } from "@/lib/faq";
import { HeroCarousel } from "@/components/site/HeroCarousel";
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
  { icon: Stethoscope, title: "Physiotherapists", text: "Video-assisted movement analysis and structured progress summaries for professional review.", cta: "Explore Professional Solutions", link: "/solutions" },
  { icon: HeartHandshake, title: "Elderly Care", text: "Accessible exercise guidance and easy-to-understand progress monitoring.", cta: "Explore Elderly Care", link: "/solutions" },
  { icon: Bandage, title: "Injury Rehab", text: "Guided prescribed exercises, video observations, and longitudinal progress charts.", cta: "Explore Rehabilitation", link: "/solutions" },
  { icon: GraduationCap, title: "Students", text: "Physiotherapy training resources, exercise demonstrations, and visual movement-analysis.", cta: "Explore Training", link: "/platform" },
];

const steps = [
  { icon: ClipboardCheck, t: "Select Exercise", desc: "Choose your prescribed physiotherapy exercise." },
  { icon: Video, t: "Record Video", desc: "Watch the demo and record your movement." },
  { icon: ScanLine, t: "AI Analysis", desc: "Browser-based computer vision tracks your form." },
  { icon: Gauge, t: "Review Metrics", desc: "Analyze data-quality and range of motion." },
  { icon: LineChart, t: "Track Progress", desc: "Compare sessions over weeks of recovery." },
  { icon: ShieldCheck, t: "Share Safely", desc: "Share secure results with your provider." }
];

const features = [
  { icon: Shield, title: "Privacy First", text: "100% on-device AI. Videos are never uploaded to our servers, ensuring total privacy." },
  { icon: Activity, title: "Accurate Tracking", text: "Measures joint angles and counts repetitions to give you clear visibility into your progress." },
  { icon: Users, title: "Collaborative", text: "Designed to act as a bridge between patients at home and physiotherapists in the clinic." },
];

function Home() {
  return (
    <>
      <HeroCarousel />

      <section className="container-page py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10 rounded-b-[4rem]"></div>
        <SectionHead eyebrow="Who We Serve" title="Built for everyone in the recovery journey" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <Link key={a.title} to={a.link as "/solutions"} className="group relative overflow-hidden rounded-[2rem] border bg-card/60 backdrop-blur-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <a.icon className="size-24" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="rounded-2xl bg-primary/10 p-3 w-fit">
                  <a.icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight">{a.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground flex-1 leading-relaxed">{a.text}</p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>{a.cta}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 text-ink-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-ink to-ink -z-10"></div>
        <div className="container-page relative z-10">
          <div className="eyebrow text-coral">How it works</div>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl font-semibold tracking-tight">Six steps from exercise to insight</h2>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.t} className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10 backdrop-blur-sm">
                <div className="absolute -top-6 -right-6 text-[8rem] font-black text-white/[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <s.icon className="size-8 text-coral mb-6" />
                <h3 className="text-xl font-semibold mb-2">{s.t}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="hero" className="rounded-full px-8"><Link to="/how-it-works">Explore Detailed Walkthrough</Link></Button>
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="text-center mb-16">
          <SectionHead eyebrow="Why Choose Us" title="Technology that respects your recovery" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex gap-6 rounded-3xl bg-muted/50 p-8 border border-muted transition hover:bg-muted">
              <div className="shrink-0 rounded-2xl bg-primary/10 p-4 h-fit">
                <f.icon className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid items-center gap-16 py-24 lg:grid-cols-2">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary to-coral opacity-20 blur-2xl rounded-[3rem] transition-opacity group-hover:opacity-30"></div>
          <img src={rehab} alt="A man recording a squat on a phone tripod in a rehab studio" width={1216} height={912} loading="lazy" className="relative z-10 aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-border/50" />
        </div>
        <div className="flex flex-col justify-center">
          <SectionHead eyebrow="AI Video Analytics" title="Real computer vision, honestly explained" sub="Physiomatics runs a pose-estimation model directly in your browser. Your video never leaves your device." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              [ScanLine, "Video Monitoring", "Skeletal overlay on your recording."],
              [Gauge, "Angle Measurement", "Knee and shoulder, in the camera's plane."],
              [Repeat, "Rep Counting", "Exercise-specific thresholds."],
              [Eye, "Confidence Checks", "Metrics hidden when visibility is low."],
              [History, "Session History", "Track changes in movement over time."],
              [ShieldCheck, "Clinical Review", "Share secure results directly."]
            ].map(([I, t, d]) => {
              const Icon = I as typeof ScanLine;
              return (
                <li key={t as string} className="flex gap-4 items-start rounded-2xl bg-card border p-5 shadow-sm hover:shadow-md transition">
                  <Icon className="size-5 text-coral shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">{t as string}</div>
                    <div className="text-xs text-muted-foreground mt-1">{d as string}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Button asChild className="mt-10 w-fit rounded-full px-8 shadow-lg shadow-primary/20"><Link to="/analyze">Try the Demo <ArrowRight className="ml-2 size-4" /></Link></Button>
        </div>
      </section>
      
      <section className="container-page py-12">
        <div className="rounded-[3rem] bg-gradient-to-br from-primary-soft to-background border p-10 md:p-20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow text-primary mb-4">Progress Monitoring</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Track your recovery journey</h2>
            <p className="text-muted-foreground text-lg">Review session history, completion rates, and exercise adherence in one beautiful dashboard.</p>
          </div>
          
          <div className="relative z-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-card/80 backdrop-blur-xl p-8 border shadow-lg hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <BarChart className="text-primary size-6" />
                </div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Adherence</h4>
              </div>
              <div className="text-5xl font-display font-bold">85<span className="text-2xl text-muted-foreground">%</span></div>
              <div className="text-sm text-emerald-500 font-medium mt-3 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> +5% from last week
              </div>
            </div>
            
            <div className="rounded-3xl bg-card/80 backdrop-blur-xl p-8 border shadow-lg hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-coral/10 p-3 rounded-2xl">
                  <Activity className="text-coral size-6" />
                </div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Completion</h4>
              </div>
              <div className="text-5xl font-display font-bold">12<span className="text-2xl text-muted-foreground">/14</span></div>
              <div className="text-sm text-muted-foreground mt-3">Sessions this month</div>
            </div>
            
            <div className="rounded-3xl bg-card/80 backdrop-blur-xl p-8 border shadow-lg hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <History className="text-primary size-6" />
                </div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Avg Time</h4>
              </div>
              <div className="text-5xl font-display font-bold">24<span className="text-2xl text-muted-foreground">m</span></div>
              <div className="text-sm text-muted-foreground mt-3">Optimal range achieved</div>
            </div>
          </div>
          
          <div className="relative z-10 mt-12 flex justify-center">
             <Button asChild variant="hero" className="rounded-full px-8 shadow-xl shadow-primary/25"><Link to="/platform">Explore Progress Dashboards <ArrowRight className="ml-2 size-4" /></Link></Button>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="container-page grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHead eyebrow="FAQ" title="Questions, answered plainly" sub="Everything you need to know about how Physiomatics works, how we protect your data, and what to expect." />
          <Button asChild variant="outline" className="mt-8 rounded-full"><Link to="/resources">View all FAQs</Link></Button>
        </div>
        <div className="rounded-3xl bg-card border p-2 shadow-sm">
          <Accordion type="single" collapsible className="px-6">
            {FAQS.slice(0, 5).map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border/50 py-2">
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary transition-colors">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-ink text-ink-foreground p-10 md:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to see Physiomatics in action?</h2>
              <p className="text-ink-foreground/80 text-lg mb-10 max-w-md">Join clinicians and patients who are already using AI to track movement and improve recovery outcomes.</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="hero" size="lg" className="rounded-full shadow-lg shadow-primary/20"><Link to="/contact">Book a Demo</Link></Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent border-white/20 hover:bg-white/10 text-white"><a href={whatsappLink(WA_MESSAGES.demo)} target="_blank" rel="noreferrer">Chat on WhatsApp</a></Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="size-64 rounded-full bg-gradient-to-tr from-primary to-coral opacity-20 blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
