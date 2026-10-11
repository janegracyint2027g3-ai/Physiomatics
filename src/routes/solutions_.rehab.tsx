import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Activity, Camera, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/solutions_/rehab")({
  head: () => ({
    meta: [
      { title: "Support Your Rehabilitation With Clearer Movement Insights — Physiomatics" },
      { name: "description", content: "Follow your prescribed rehabilitation plan with structured exercise routines and video-based movement observations." },
      { property: "og:title", content: "Injury Rehabilitation Solutions" },
    ],
  }),
  component: RehabPage,
});

function RehabPage() {
  return (
    <>
      <PageHero eyebrow="Injury Rehabilitation" title="Support Your Rehabilitation With Clearer Movement Insights.">
        Maintain consistency between clinic visits with structured exercise tracking and video-assisted movement observation.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Bridging the gap between clinic visits</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Recovering from an injury requires consistent adherence to an individualized rehabilitation plan. Physiomatics helps you follow your prescribed routine correctly at home by providing visual feedback and structured session history.
          </p>

          <div className="relative animate-rise my-10 not-prose">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-coral/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1598136490937-f77b0ce520fe?auto=format&fit=crop&w=1200&q=80" 
              alt="Person undergoing rehabilitation" 
              className="relative rounded-3xl object-cover shadow-2xl border border-border aspect-[21/9] w-full"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Camera className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video-Based Observation</h3>
              <p className="text-sm text-muted-foreground">Record your prescribed exercises to receive immediate repetition counts and range-of-motion estimates.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <TrendingUp className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Session Documentation</h3>
              <p className="text-sm text-muted-foreground">Your performance is logged securely on your device, making it easier to discuss your progress at your next appointment.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">The Importance of Following Your Plan</h3>
          <p className="mb-6">
            Physiomatics is a tool, not a treatment. It is crucial that you only perform exercises that have been specifically prescribed for your injury by a qualified professional.
          </p>
          
          <div className="rounded-2xl bg-destructive/10 p-6 border-l-4 border-destructive text-destructive">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <AlertTriangle className="size-5" /> Safety and Symptom Awareness
            </div>
            <p className="text-sm m-0">Do not push through sharp pain. If you experience unexpected swelling, sharp pain, or worsening symptoms during an exercise, stop immediately and seek professional advice. This platform does not diagnose injuries or promise faster recovery.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Try the platform</h3>
            <p className="text-sm text-muted-foreground mb-6">See how video analysis can track your prescribed home routine.</p>
            <Button asChild className="w-full justify-between mb-3" variant="hero">
              <Link to="/analyze">Try Video Analysis <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Will this speed up my recovery?</strong>
                <span className="text-muted-foreground">Recovery timelines depend on your injury and biology. We provide tracking, not a cure.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Can I use this without a physio?</strong>
                <span className="text-muted-foreground">We strongly advise against self-prescribing exercises for an injury. Consult a professional first.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
