import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Users, Camera, ShieldAlert, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/solutions_/caregiver")({
  head: () => ({
    meta: [
      { title: "Help Make Supported Exercise Sessions Easier to Follow — Physiomatics" },
      { name: "description", content: "Resources and monitoring workflows for family caregivers assisting someone with prescribed physiotherapy exercises." },
      { property: "og:title", content: "Caregiver Support" },
    ],
  }),
  component: CaregiverPage,
});

function CaregiverPage() {
  return (
    <>
      <PageHero eyebrow="Caregiver Support" title="Help Make Supported Exercise Sessions Easier to Follow.">
        Practical tools for family members and caregivers assisting someone with a prescribed physiotherapy routine.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Supporting their recovery journey</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Assisting a family member with their daily exercises can be challenging. Physiomatics simplifies the process by handling the repetition counting and progress tracking, so you can focus on providing support and encouragement.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Camera className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Camera Setup</h3>
              <p className="text-sm text-muted-foreground">Follow simple visual guides to position the device correctly, ensuring the AI can clearly see the movements.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Users className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Supervised Sessions</h3>
              <p className="text-sm text-muted-foreground">Ensure the environment is safe while the application records the session summary to share with their physiotherapist later.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Respecting Privacy and Consent</h3>
          <p className="mb-6">
            When helping someone record an exercise, always ensure they are comfortable and have consented to the recording. Remember that all videos are processed locally and are never uploaded to the internet.
          </p>
          
          <div className="rounded-2xl bg-destructive/10 p-6 border-l-4 border-destructive text-destructive">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <ShieldAlert className="size-5" /> Professional Boundaries
            </div>
            <p className="text-sm m-0">Caregivers should never independently diagnose problems, prescribe new movements, or modify the physiotherapist's treatment plan. Always defer to professional clinical guidance.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Learn the workflow</h3>
            <p className="text-sm text-muted-foreground mb-6">See exactly how the platform works before starting a session.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/how-it-works">Learn How It Works <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">What if they can't stand up?</strong>
                <span className="text-muted-foreground">The platform supports several seated exercises specifically designed for older adults or those with mobility limitations.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Does it record audio?</strong>
                <span className="text-muted-foreground">No, the AI only tracks visual skeletal landmarks. Audio is not recorded or processed.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
