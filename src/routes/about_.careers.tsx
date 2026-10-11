import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about_/careers")({
  head: () => ({
    meta: [
      { title: "Help Shape the Future of Movement Technology — Physiomatics" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Help Shape the Future of Movement Technology.">
        Join our growing team and help make physiotherapy exercise education and movement observations more accessible.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto">
        <div className="rounded-3xl border bg-card p-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-lg mb-8">
            We do not currently have any open vacancies listed on the website. However, we are always eager to connect with talented engineers, designers, and healthcare professionals who share our mission.
          </p>
          <Button asChild variant="hero">
            <Link to="/contact">Get in Touch <ArrowRight className="size-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
