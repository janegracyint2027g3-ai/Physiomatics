import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Activity, Gauge, Target, HelpCircle, AlertTriangle, ArrowRight, ScanLine } from "lucide-react";

export const Route = createFileRoute("/platform_/movement")({
  head: () => ({
    meta: [
      { title: "Understand the Movement Behind Every Exercise — Physiomatics" },
      { name: "description", content: "Learn how Physiomatics observes movement, estimates joint angles, and segments repetitions." },
      { property: "og:title", content: "Movement Analysis Mechanics" },
    ],
  }),
  component: MovementPage,
});

function MovementPage() {
  return (
    <>
      <PageHero eyebrow="Movement Analysis" title="Understand the Movement Behind Every Exercise.">
        Explore how human pose estimation turns 2D video recordings into structured, measurable movement observations.
      </PageHero>

      <section className="container-page py-24">
        {/* Hero Split Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <ScanLine className="size-4" /> AI-Powered Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-foreground leading-tight">
              From pixels to posture in real-time.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              When you record a session, the platform uses human pose estimation to identify key skeletal landmarks. By tracking these landmarks frame by frame, we can generate a mathematical representation of your movement without needing any wearable sensors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25">
                <Link to="/analyze">Try Video Analysis <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-rise" style={{ animationDelay: '200ms' }}>
            <div className="absolute -inset-10 bg-gradient-primary rounded-[4rem] blur-3xl opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
              alt="Digital data analysis concept" 
              className="relative rounded-[2.5rem] shadow-2xl border-4 border-white/60 aspect-[4/3] w-full object-cover"
            />
            {/* Overlapping Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-card/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border flex items-center gap-5 animate-rise" style={{ animationDelay: '400ms' }}>
               <div className="bg-primary p-4 rounded-2xl shadow-inner"><Target className="size-8 text-primary-foreground" /></div>
               <div className="pr-4">
                 <p className="font-bold text-2xl text-foreground">33</p>
                 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Skeletal Landmarks</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How it breaks down movement</h2>
            <p className="text-lg text-muted-foreground">Every repetition is captured, analyzed, and segmented using geometric calculations.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-muted/30 rounded-[2rem] p-8 border hover:border-primary/50 transition-colors group">
              <div className="bg-card w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Gauge className="size-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Joint Angles</h3>
              <p className="text-muted-foreground leading-relaxed">Trigonometric calculations between specific landmarks to estimate flexion and extension instantly.</p>
            </div>
            
            <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700">
                <Activity className="size-32" />
              </div>
              <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6">
                <Activity className="size-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Repetition Logic</h3>
              <p className="text-primary-foreground/80 leading-relaxed">Algorithmic segmentation based on exercise-specific angle thresholds and movement phases.</p>
            </div>
            
            <div className="bg-muted/30 rounded-[2rem] p-8 border hover:border-primary/50 transition-colors group">
              <div className="bg-card w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle className="size-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Form Feedback</h3>
              <p className="text-muted-foreground leading-relaxed">Identifies missed thresholds and obscured joints to ensure your repetitions are counted accurately.</p>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-destructive/5 rounded-[2.5rem] p-10 md:p-16 border border-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 font-bold text-destructive mb-4 text-lg">
              <AlertTriangle className="size-6" /> Measurement Limitations
            </div>
            <h2 className="text-2xl font-bold mb-4">Estimates vs. Clinical Diagnosis</h2>
            <p className="text-lg text-muted-foreground mb-6">
              It is critical to understand the distinction between <strong>measured, estimated, and interpreted</strong> information.
            </p>
            <ul className="space-y-3 text-muted-foreground mb-8">
              <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0"></span> <strong>Measured:</strong> The exact pixel coordinates of a landmark in a 2D video frame.</li>
              <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0"></span> <strong>Estimated:</strong> The calculated joint angle derived from those 2D pixels. This is not a true 3D measurement and can be distorted by camera angle.</li>
              <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0"></span> <strong>Interpreted:</strong> The clinical meaning behind that angle. <em>Only a licensed physiotherapist can interpret this data.</em></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
