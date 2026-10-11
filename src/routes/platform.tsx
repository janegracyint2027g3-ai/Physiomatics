import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanLine, Dumbbell, LineChart, UserCheck, Lock, Accessibility, ShieldCheck, PlayCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform — Physiomatics" },
      { name: "description", content: "Exercise training, AI movement analysis, progress monitoring and physiotherapist review in one platform." },
      { property: "og:title", content: "The Physiomatics Platform" },
      { property: "og:description", content: "What's available today and what's coming next." },
    ],
  }),
  component: Platform,
});

const features = [
  { icon: ScanLine, t: "AI Video Analytics", d: "Landmark detection, skeletal overlay, joint angles, repetitions and confidence.", status: "Available", to: "/analyze" },
  { icon: Dumbbell, t: "Exercise Training", d: "Step-by-step guidance and camera setup for each supported exercise.", status: "Available", to: "/resources" },
  { icon: LineChart, t: "Progress Monitoring", d: "Session history and movement-range trends, stored on your device.", status: "Available", to: "/analyze" },
  { icon: UserCheck, t: "Clinician Dashboard", d: "Review authorized recordings, add notes and manage programs.", status: "In development", to: "/contact" },
  { icon: Lock, t: "Privacy-First", d: "Videos are processed in-browser and never uploaded on this site.", status: "Available", to: "/about" },
  { icon: Accessibility, t: "Accessible Design", d: "Large targets, readable type, keyboard support and reduced motion.", status: "Available", to: "/solutions" },
] as const;

function Platform() {
  return (
    <>
      <PageHero eyebrow="Platform" title="One place for guided exercise and movement insight">
        Physiomatics connects online physiotherapy training with AI-assisted movement monitoring. Track your progress securely, entirely in your browser.
      </PageHero>
      
      <section className="container-page grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.t} to={f.to} className="group relative overflow-hidden rounded-3xl border bg-card/80 backdrop-blur-sm p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/40">
            <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <f.icon className="size-40" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="rounded-2xl bg-primary/10 p-3">
                  <f.icon className="size-6 text-primary" />
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${f.status === "Available" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {f.status}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold tracking-tight">{f.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed flex-1">{f.d}</p>
              
              <div className="mt-8 flex items-center text-sm font-semibold text-primary">
                Explore {f.t.toLowerCase()} <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-muted/30 py-24 border-y">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it fits together</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Our modules are designed to work together seamlessly to create a complete care journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 rounded-3xl bg-card border p-8 shadow-md flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 shadow-inner text-blue-600">
                <PlayCircle className="size-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Learn</h3>
              <p className="text-sm text-muted-foreground">Patients learn proper form through our <strong>Exercise Training</strong> library.</p>
            </div>
            
            <div className="relative z-10 rounded-3xl bg-card border p-8 shadow-md flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-inner text-emerald-600">
                <ScanLine className="size-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Execute</h3>
              <p className="text-sm text-muted-foreground">Patients perform the exercise using <strong>AI Video Analytics</strong> for real-time tracking.</p>
            </div>
            
            <div className="relative z-10 rounded-3xl bg-card border p-8 shadow-md flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center mb-6 shadow-inner text-purple-600">
                <Layers className="size-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Review</h3>
              <p className="text-sm text-muted-foreground"><strong>Progress Monitoring</strong> summarizes the session for the patient and clinician.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container-page py-24">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-primary to-coral p-10 md:p-20 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 size-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <ShieldCheck className="size-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Start your recovery journey today</h2>
            <p className="text-white/80 mb-10 text-xl leading-relaxed">Whether you are a patient looking to track your exercises securely, or a clinic seeking to monitor progress, Physiomatics provides the tools you need.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="secondary" size="lg" className="rounded-full font-bold px-8 shadow-lg text-primary hover:scale-105 transition-transform"><Link to="/analyze">Try Video Analysis</Link></Button>
              <Button asChild variant="outline" size="lg" className="rounded-full font-bold px-8 border-white/30 text-white hover:bg-white/10"><Link to="/contact">Book a Demo</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
