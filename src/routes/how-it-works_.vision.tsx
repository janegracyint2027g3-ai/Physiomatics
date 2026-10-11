import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ScanFace, Focus, EyeOff, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works_/vision")({
  head: () => ({
    meta: [
      { title: "Understand the Technology Behind Movement Analysis — Physiomatics" },
      { name: "description", content: "Learn how computer vision and pose estimation turn 2D video into estimated joint angles." },
      { property: "og:title", content: "Computer Vision & Pose Estimation" },
    ],
  }),
  component: VisionPage,
});

function VisionPage() {
  return (
    <>
      <PageHero eyebrow="Computer Vision" title="Understand the Technology Behind Movement Analysis.">
        How our browser-based AI identifies skeletal landmarks and calculates movement angles from a standard camera.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">What is Human Pose Estimation?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Computer vision allows a device to extract meaningful information from digital images. Human pose estimation is a specific technique that trains a machine learning model to identify key points on the human body, such as the shoulders, elbows, hips, and knees.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <ScanFace className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Identifying Landmarks</h3>
              <p className="text-sm text-muted-foreground">The algorithm maps 33 specific 2D coordinates across the body in every single frame of the video.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Focus className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calculating Angles</h3>
              <p className="text-sm text-muted-foreground">By drawing lines between three connected landmarks (e.g., hip to knee, knee to ankle), we can calculate the 2D flexion angle.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Why Accuracy Varies</h3>
          <p className="mb-6">
            Because this runs on standard 2D webcams rather than multi-camera 3D motion capture labs, the algorithm's confidence and accuracy are affected by several physical factors:
          </p>
          <ul className="mb-8 space-y-2">
            <li><strong>Parallax & Perspective:</strong> The angle of the camera relative to your body distorts the apparent angle of the joint.</li>
            <li><strong>Occlusion:</strong> If an arm blocks the view of a hip joint, the AI has to guess the hip's location based on the rest of the body.</li>
            <li><strong>Clothing:</strong> Loose or baggy clothing makes it difficult for the AI to identify where the physical joint actually lies.</li>
            <li><strong>Lighting:</strong> Poor lighting or strong backlighting prevents clear edge detection.</li>
          </ul>

          <div className="rounded-2xl bg-destructive/10 p-6 border-l-4 border-destructive text-destructive">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <AlertTriangle className="size-5" /> Responsible Interpretation
            </div>
            <p className="text-sm m-0">These estimates are meant to track gross consistency, not millimeter-perfect changes. Users should always interpret analysis outputs responsibly and rely on a physiotherapist for clinical evaluation.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">See it working</h3>
            <p className="text-sm text-muted-foreground mb-6">The best way to understand the AI is to see the skeletal overlay yourself.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/analyze">Explore AI Video Analytics <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><EyeOff className="size-5" /> Privacy Notice</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To achieve all of this without compromising your privacy, the pose estimation model runs entirely inside your browser.
            </p>
            <Link to="/how-it-works/privacy" className="text-sm font-semibold text-primary hover:underline">Read how we protect data &rarr;</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
