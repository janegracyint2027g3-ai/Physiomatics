import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ShieldCheck, HardDrive, ServerOff, Database, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works_/privacy")({
  head: () => ({
    meta: [
      { title: "Understand How Your Exercise Data Is Handled — Physiomatics" },
      { name: "description", content: "Learn about our browser-based processing, local storage, and strict privacy commitments." },
      { property: "og:title", content: "Data Privacy & Security" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Data Privacy" title="Understand How Your Exercise Data Is Handled.">
        We prioritize your privacy by processing your videos locally and storing your exercise history on your own device.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Processing without uploading</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Recording exercises in your home requires absolute trust. Physiomatics is built on a "local-first" architecture, meaning the most sensitive part of the process—the video analysis—never leaves your computer.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <ServerOff className="size-8 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Browser-Based Processing</h3>
              <p className="text-sm text-muted-foreground">When you run an analysis, the AI model is downloaded to your browser. Your video is processed frame-by-frame entirely on your own hardware. <strong>We never upload your video to our servers.</strong></p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <HardDrive className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Local Session History</h3>
              <p className="text-sm text-muted-foreground">The numerical results (repetitions, angle estimates) are saved securely in your browser's Local Storage. Only you have access to this data on the device where it was recorded.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">What Data We Do Collect</h3>
          <p className="mb-4">
            While exercise monitoring is private, certain other interactions require data transmission to function properly:
          </p>
          <ul className="mb-8">
            <li><strong>Contact Forms:</strong> Information submitted through our enquiry, feedback, or demo request forms is securely transmitted to our backend database (Supabase) to allow us to reply to you.</li>
            <li><strong>Analytics:</strong> We use minimal, anonymized analytics to understand aggregate website usage (e.g., page views). We do not track individual user identities.</li>
            <li><strong>WhatsApp Integration:</strong> If you choose to contact us via WhatsApp, you are subject to WhatsApp's privacy policy and data handling.</li>
          </ul>

          <div className="rounded-2xl bg-muted/50 p-6 border-l-4 border-muted-foreground">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <Database className="size-5" /> Data Deletion
            </div>
            <p className="text-sm m-0">Because your exercise history is stored locally on your device, you have complete control. You can delete your session data at any time by clearing your browser's site data or cache. We cannot recover deleted local data.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Learn more</h3>
            <p className="text-sm text-muted-foreground mb-6">Review our complete privacy policy for detailed legal documentation.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/">Read Our Privacy Policy <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="size-5" /> Guarantee</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We guarantee that the application does not transmit or store your raw camera feed or recorded videos.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
