import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/resources_/rehab")({
  head: () => ({
    meta: [
      { title: "Rehabilitation Guides — Physiomatics" },
      { name: "description", content: "Evidence-conscious educational articles explaining rehabilitation setup." },
    ],
  }),
  component: RehabGuidesPage,
});

function RehabGuidesPage() {
  return (
    <>
      <PageHero eyebrow="Rehabilitation Guides" title="Prepare for your prescribed sessions.">
        Educational articles to help you maintain consistent recording conditions and manage your home routines.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto">
        <div className="grid gap-8">
          <article className="rounded-3xl border bg-card p-8 sm:p-10">
            <div className="flex items-center gap-3 text-primary font-semibold mb-4">
              <BookOpen className="size-5" /> Guide
            </div>
            <h2 className="text-2xl font-bold mb-4">Recording a video suitable for movement analysis</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The accuracy of human pose estimation heavily depends on the quality of the video. To ensure the AI can correctly identify your joints, follow these simple setup rules before hitting record.
            </p>
            <ul className="space-y-3 mb-8 text-sm">
              <li><strong>Lighting:</strong> Ensure the light source is in front of you, not behind you. Backlighting creates silhouettes.</li>
              <li><strong>Clothing:</strong> Wear fitted clothing. Baggy clothes obscure joint angles.</li>
              <li><strong>Contrast:</strong> Wear clothes that contrast with your background (e.g., don't wear black trousers against a black sofa).</li>
              <li><strong>Position:</strong> Ensure your entire body (from head to toe) is visible in the frame throughout the entire movement.</li>
            </ul>
            <Button asChild variant="outline">
              <Link to="/how-it-works/workflow">Review Full Workflow <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
          </article>
          
          <article className="rounded-3xl border bg-card p-8 sm:p-10">
            <div className="flex items-center gap-3 text-primary font-semibold mb-4">
              <BookOpen className="size-5" /> Guide
            </div>
            <h2 className="text-2xl font-bold mb-4">Discussing observations with your physiotherapist</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              When you return to the clinic, the data you've collected at home can be a valuable conversation starter. Remember that your clinician will use this data as one piece of a larger clinical picture.
            </p>
            <Button asChild variant="outline">
              <Link to="/platform/progress">Learn About Progress Monitoring <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
          </article>
        </div>
      </section>
    </>
  );
}
