import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about_/team")({
  head: () => ({
    meta: [
      { title: "Our Team — Physiomatics" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <PageHero eyebrow="Team" title="The people behind Physiomatics.">
        A multidisciplinary team dedicated to improving physiotherapy accessibility through appropriate technology.
      </PageHero>

      <section className="container-page py-16 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl border bg-card p-12 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-4">Building the Future of Movement Technology</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We are actively expanding our core team of developers, clinicians, and designers. Detailed team profiles are currently being updated. 
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Our Team <ArrowRight className="size-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
