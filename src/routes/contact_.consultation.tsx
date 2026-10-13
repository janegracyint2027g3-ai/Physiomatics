import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight, Briefcase } from "lucide-react";

export const Route = createFileRoute("/contact_/consultation")({
  head: () => ({
    meta: [
      { title: "Let's Discuss Your Physiotherapy Technology Needs — Physiomatics" },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  return (
    <>
      <PageHero eyebrow="Consultation" title="Let's Discuss Your Physiotherapy Technology Needs.">
        For clinics, education providers, and organizations exploring specific implementations.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl border bg-card p-12 shadow-sm mb-12">
          <Briefcase className="size-12 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Tailored Discussions</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            If you are looking to integrate Physiomatics into an existing clinic workflow or educational curriculum, we can schedule a consultation to discuss your specific requirements and our planned roadmap capabilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/contact">Submit Consultation Request <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="whatsapp">
              <a href="https://wa.me/917845072426?text=Hello%20Physiomatics%2C%20I'd%20like%20to%20discuss%20a%20clinical%20consultation." target="_blank" rel="noreferrer">
                WhatsApp (+91 78450 72426)
              </a>
            </Button>
          </div>

          <div className="mt-10 pt-6 border-t flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="tel:+917845072426" className="hover:text-primary transition-colors">
              📞 +91 78450 72426
            </a>
            <span>•</span>
            <a href="https://www.youtube.com/@JaneGracyDavid" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              ▶️ YouTube: @JaneGracyDavid
            </a>
            <span>•</span>
            <a href="https://www.linkedin.com/company/143995162/admin/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              💼 LinkedIn: Physiomatics
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
