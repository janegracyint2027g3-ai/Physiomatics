import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { LineChart, History, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/platform_/progress")({
  head: () => ({
    meta: [
      { title: "See Your Exercise Journey Over Time — Physiomatics" },
      { name: "description", content: "Learn how to review exercise sessions and compare compatible movement observations over time." },
      { property: "og:title", content: "Progress Monitoring" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <>
      <PageHero eyebrow="Progress Monitoring" title="See Your Exercise Journey Over Time.">
        Review session history, completion rates, and track your movement trends securely on your own device.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Connecting the dots across sessions</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Recovery is rarely linear. Progress Monitoring helps you and your clinician look past a single day's performance to understand your broader adherence and movement trends.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <History className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Session History</h3>
              <p className="text-sm text-muted-foreground">Automatically log your completed repetitions, session duration, and the date of each supported exercise.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <LineChart className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Movement Trends</h3>
              <p className="text-sm text-muted-foreground">Compare the estimated movement range between compatible sessions to visualize gross changes.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">The Importance of Consistency</h3>
          <p className="mb-6">
            For comparisons to be valid, you must record your exercises under similar conditions. 
          </p>
          <ul className="grid gap-3 mb-8">
            <li className="flex gap-3"><CheckCircle2 className="size-5 text-emerald-500 shrink-0" /> Place your camera at the same height and distance.</li>
            <li className="flex gap-3"><CheckCircle2 className="size-5 text-emerald-500 shrink-0" /> Ensure the lighting is similar.</li>
            <li className="flex gap-3"><CheckCircle2 className="size-5 text-emerald-500 shrink-0" /> Use the same chair or floor space if applicable.</li>
          </ul>

          <div className="rounded-2xl bg-amber-500/10 p-6 border-l-4 border-amber-500 text-amber-700 dark:text-amber-400">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <AlertCircle className="size-5" /> Local Storage Limitation
            </div>
            <p className="text-sm m-0">Your session history is stored locally in your browser to protect your privacy. If you clear your browser data or use a different device, your history will not be available.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Start tracking today</h3>
            <p className="text-sm text-muted-foreground mb-6">Complete a video analysis session to generate your first progress point.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/analyze">Try an Exercise Analysis <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Does improved range mean I'm cured?</strong>
                <span className="text-muted-foreground">No. An observed change in measurements does not automatically mean your medical condition has improved. Always consult your physiotherapist.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Can I sync data to my phone?</strong>
                <span className="text-muted-foreground">Currently, data stays entirely on the device where it was recorded.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
