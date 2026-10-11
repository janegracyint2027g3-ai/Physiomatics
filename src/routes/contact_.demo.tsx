import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight, Video } from "lucide-react";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/contact_/demo")({
  head: () => ({
    meta: [
      { title: "See How Physiomatics Fits Your Use Case — Physiomatics" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <>
      <PageHero eyebrow="Book a Demo" title="See How Physiomatics Fits Your Use Case.">
        Get a guided walkthrough of our video-analysis capabilities and discuss how they can integrate into your workflow.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl border bg-card p-12 shadow-sm mb-12">
          <Video className="size-12 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">What to expect</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            A live demonstration of the browser-based pose estimation. We'll cover supported exercises, limitations of the 2D tracking, and how patients use the tool at home.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/contact">Request via Email <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline">
              <a href={whatsappLink(WA_MESSAGES.demo)} target="_blank" rel="noreferrer">
                Book via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
