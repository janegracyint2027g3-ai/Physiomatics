import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { GraduationCap, BrainCircuit, Activity, AlertCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/solutions_/education")({
  head: () => ({
    meta: [
      { title: "Connect Physiotherapy Learning With Movement Technology — Physiomatics" },
      { name: "description", content: "Educational tools for physiotherapy students, lecturers, and clinical educators to explore movement observation and pose estimation." },
      { property: "og:title", content: "Physiotherapy Education Solutions" },
    ],
  }),
  component: EducationPage,
});

function EducationPage() {
  return (
    <>
      <PageHero eyebrow="Physiotherapy Education" title="Connect Physiotherapy Learning With Movement Technology.">
        Practical tools for students and educators to visualize biomechanics, evaluate AI pose estimation, and understand movement analysis.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Visualizing biomechanics in real-time</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Educators need practical ways to demonstrate the mechanics of movement analysis and joint-angle concepts to students. Physiomatics allows you to record movements and immediately display the overlaid skeletal landmarks.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <BrainCircuit className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pose Estimation Concepts</h3>
              <p className="text-sm text-muted-foreground">Demonstrate MediaPipe capabilities on real video to show students how computer vision interprets human posture.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Activity className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Evaluating AI Accuracy</h3>
              <p className="text-sm text-muted-foreground">Allow students to compare the system's 2D joint-angle estimates against their own clinical goniometry measurements.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Educational Use Cases</h3>
          <p className="mb-6">
            Physiomatics can be used in the classroom to spark discussions about:
          </p>
          <ul>
            <li>The effects of camera position (parallax error) on 2D angle estimation.</li>
            <li>How lighting, clothing, and occlusion affect algorithmic confidence.</li>
            <li>The distinction between a gross movement estimate and a true 3D clinical measurement.</li>
          </ul>
          
          <div className="rounded-2xl bg-muted/50 p-6 border-l-4 border-muted-foreground mt-8">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <AlertCircle className="size-5" /> Academic Notice
            </div>
            <p className="text-sm m-0">Physiomatics provides these tools for general learning and demonstration. We do not currently claim formal academic accreditation or formal institutional adoption by universities.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Start exploring</h3>
            <p className="text-sm text-muted-foreground mb-6">Use the platform to demonstrate pose estimation in your next class.</p>
            <Button asChild className="w-full justify-between mb-3" variant="hero">
              <Link to="/resources">Explore Educational Resources <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link to="/analyze">Try Movement Analysis</Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Is this an accredited course?</strong>
                <span className="text-muted-foreground">No. This is a practical software tool that educators can integrate into their existing curriculum.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Can students create accounts?</strong>
                <span className="text-muted-foreground">Accounts are not required. The video analysis runs directly in the browser for immediate, anonymous use.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
