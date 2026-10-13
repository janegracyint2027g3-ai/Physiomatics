import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight, Video, CalendarCheck } from "lucide-react";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";
import { GoogleCalendarButton } from "@/components/site/GoogleCalendarButton";

export const Route = createFileRoute("/contact_/demo")({
  head: () => ({
    meta: [
      { title: "Book an Appointment & Demo — Physiomatics" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <>
      <PageHero eyebrow="Book an Appointment" title="See How Physiomatics Fits Your Use Case.">
        Choose a time directly on our Google Calendar for a guided walkthrough of our video-analysis capabilities and discuss clinical integration.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl border bg-card p-12 shadow-sm mb-12">
          <Video className="size-12 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">What to expect</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            A live demonstration of the browser-based pose estimation. We'll cover supported exercises, clinical validation, and how patients use the tool at home.
          </p>

          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-8 max-w-lg mx-auto">
            <CalendarCheck className="size-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-base mb-1">Instant Calendar Scheduling</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select an available time slot and get a Google Meet invite instantly.
            </p>
            <div className="flex justify-center">
              <GoogleCalendarButton
                label="Book an appointment"
                source="contact_demo_page"
                useNativeGoogleWidget={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/contact">
                Enquiry Form <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="whatsapp">
              <a href={whatsappLink(WA_MESSAGES.demo)} target="_blank" rel="noreferrer">
                Book via WhatsApp (+91 78450 72426)
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
