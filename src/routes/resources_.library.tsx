import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Video, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/resources_/library")({
  head: () => ({
    meta: [
      { title: "Exercise Library — Physiomatics" },
      { name: "description", content: "Educational library of supported physiotherapy exercises." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <>
      <PageHero eyebrow="Exercise Library" title="Explore Supported Exercises.">
        Educational guides for the specific movements supported by our AI analysis.
      </PageHero>

      <section className="container-page py-16">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <p className="text-xl text-muted-foreground">This library contains standard movements modeled for AI compatibility. Always ensure these match your specific clinical prescription.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="rounded-3xl border bg-card overflow-hidden flex flex-col">
            <div className="aspect-video bg-muted flex items-center justify-center border-b">
              <Video className="size-12 text-muted-foreground/30" />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-bold mb-2">Bodyweight Squat</h3>
              <p className="text-muted-foreground mb-6 flex-1">A fundamental lower-body exercise targeting the quadriceps, hamstrings, and glutes.</p>
              
              <div className="space-y-4 text-sm mb-6">
                <div><strong>Purpose:</strong> Lower body strengthening and functional mobility.</div>
                <div><strong>Analysis Tracks:</strong> Knee flexion angle, hip depth.</div>
                <div><strong>Camera Setup:</strong> Side profile, full body visible.</div>
              </div>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/analyze">Analyze Squat <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card overflow-hidden flex flex-col">
            <div className="aspect-video bg-muted flex items-center justify-center border-b">
              <Video className="size-12 text-muted-foreground/30" />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-bold mb-2">Seated Knee Extension</h3>
              <p className="text-muted-foreground mb-6 flex-1">An isolated, seated movement designed to strengthen the quadriceps safely.</p>
              
              <div className="space-y-4 text-sm mb-6">
                <div><strong>Purpose:</strong> Accessible knee strengthening.</div>
                <div><strong>Analysis Tracks:</strong> Knee extension angle.</div>
                <div><strong>Camera Setup:</strong> Side profile, chair and legs fully visible.</div>
              </div>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/analyze">Analyze Knee Extension <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
          
          <div className="rounded-3xl border bg-card overflow-hidden flex flex-col md:col-span-2 max-w-2xl mx-auto w-full">
            <div className="p-8 flex flex-col flex-1 text-center">
              <h3 className="text-2xl font-bold mb-2">Shoulder Flexion (Arm Raise)</h3>
              <p className="text-muted-foreground mb-6">An upper-body mobility exercise targeting the shoulder joint.</p>
              <Button asChild className="w-full max-w-xs mx-auto" variant="outline">
                <Link to="/analyze">Analyze Shoulder Flexion <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
