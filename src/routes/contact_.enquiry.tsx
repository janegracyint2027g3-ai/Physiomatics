import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { 
  whatsappLink, 
  WA_MESSAGES, 
  PHONE_TEL, 
  PHONE_NUMBER_DISPLAY, 
  YOUTUBE_URL, 
  LINKEDIN_URL 
} from "@/lib/site";

export const Route = createFileRoute("/contact_/enquiry")({
  head: () => ({
    meta: [
      { title: "Have a Question About Physiomatics? — Physiomatics" },
    ],
  }),
  component: EnquiryPage,
});

function EnquiryPage() {
  return (
    <>
      <PageHero eyebrow="Quick Enquiry" title="Have a Question About Physiomatics?">
        Send us a fast message and we'll get back to you as soon as possible.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl border bg-card p-12 shadow-sm mb-12">
          <MessageSquare className="size-12 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Fastest way to reach us</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            If you have a simple question about our features, compatibility, or how the platform works, sending a message via WhatsApp or calling us is the fastest way to get an answer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">
                WhatsApp ({PHONE_NUMBER_DISPLAY}) <ArrowRight className="size-4 ml-2" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={PHONE_TEL}>
                <Phone className="size-4 mr-2" /> Call {PHONE_NUMBER_DISPLAY}
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Use Contact Form</Link>
            </Button>
          </div>

          <div className="mt-10 pt-6 border-t flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              ▶️ YouTube: @JaneGracyDavid
            </a>
            <span>•</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              💼 LinkedIn: Physiomatics
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
