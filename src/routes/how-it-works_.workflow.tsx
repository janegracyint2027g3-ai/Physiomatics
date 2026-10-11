import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Video, Camera, Activity, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works_/workflow")({
  head: () => ({
    meta: [
      { title: "From Exercise Recording to Movement Review — Physiomatics" },
      { name: "description", content: "Understand the complete user journey from setting up the camera to reviewing your movement observations." },
      { property: "og:title", content: "Workflow Overview" },
    ],
  }),
  component: WorkflowPage,
});

function WorkflowPage() {
  return (
    <>
      <PageHero eyebrow="Workflow Overview" title="From Exercise Recording to Movement Review.">
        Understand the complete user journey: from selecting your exercise to discussing the results with your physiotherapist.
      </PageHero>

      <section className="container-page py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">The Physiomatics Journey</h2>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary-foreground font-bold z-10">1</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Video className="size-5 text-primary" /> Select an Exercise</h3>
              <p className="text-muted-foreground text-sm">Choose an exercise from the library that matches the one prescribed by your physiotherapist. Only supported exercises will trigger the AI analysis.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary-foreground font-bold z-10">2</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Camera className="size-5 text-primary" /> Prepare the Environment</h3>
              <p className="text-muted-foreground text-sm">Position your device's camera so your entire body is visible. Ensure the room is well-lit and you are wearing contrasting clothing so the AI can distinguish your joints.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary-foreground font-bold z-10">3</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Activity className="size-5 text-primary" /> Record and Analyze</h3>
              <p className="text-muted-foreground text-sm">Perform the exercise. The browser will process the video frame-by-frame, counting repetitions and estimating joint angles in real-time.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary-foreground font-bold z-10">4</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><FileText className="size-5 text-primary" /> Review Observations</h3>
              <p className="text-muted-foreground text-sm">Check the session summary to see your completion rate and movement trends. Save the history locally to share during your next clinical appointment.</p>
            </div>
          </div>

        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/analyze">Try Video Analysis <ArrowRight className="size-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
