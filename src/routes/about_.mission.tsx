import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about_/mission")({
  head: () => ({
    meta: [
      { title: "Making Movement Insights More Accessible — Physiomatics" },
    ],
  }),
  component: MissionPage,
});

function MissionPage() {
  return (
    <>
      <PageHero eyebrow="Our Mission" title="Making Movement Insights More Accessible.">
        We believe that effective rehabilitation requires consistent effort and clear feedback. Our goal is to provide accessible movement monitoring tools that bridge the gap between clinical visits.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h2>The Problem We're Solving</h2>
        <p>Physiotherapy is most effective when exercises are performed consistently and correctly. However, patients often struggle to remember their precise prescribed movements or lose motivation when they cannot track their progress at home.</p>

        <h2>Human-Centered Design</h2>
        <p>Technology should empower patients, not frustrate them. We focus on building accessible interfaces that can be used by older adults and individuals dealing with physical pain or limited mobility.</p>

        <h2>Responsible AI</h2>
        <p>We use artificial intelligence to support human care, not to replace it. Our AI models process videos locally to protect patient privacy, and we explicitly avoid making diagnostic claims. The physiotherapist remains the ultimate authority in a patient's care.</p>
        
        <div className="mt-8 not-prose">
          <Button asChild variant="hero">
            <Link to="/platform/training">Explore the Platform <ArrowRight className="size-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
