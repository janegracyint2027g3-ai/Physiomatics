import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { HeartHandshake, Eye, CheckSquare, PhoneCall, ArrowRight, AlertTriangle } from "lucide-react";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/solutions_/elderly")({
  head: () => ({
    meta: [
      { title: "Supporting Movement and Confidence at Every Age — Physiomatics" },
      { name: "description", content: "Accessible exercise guidance and movement monitoring for older adults." },
      { property: "og:title", content: "Elderly Care Solutions" },
    ],
  }),
  component: ElderlyCarePage,
});

function ElderlyCarePage() {
  return (
    <>
      <PageHero eyebrow="Elderly Care" title="Supporting Movement and Confidence at Every Age.">
        Accessible exercise guidance and simple movement monitoring to help older adults maintain mobility and independence.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Designed for accessibility</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We understand that technology can sometimes be a barrier rather than a help. Our elderly care features are designed with large touch targets, high contrast, and simplified instructions.
          </p>

          <div className="relative animate-rise my-10 not-prose">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-coral/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" 
              alt="Elderly patient receiving care" 
              className="relative rounded-3xl object-cover shadow-2xl border border-border aspect-[21/9] w-full"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Eye className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Readable Interfaces</h3>
              <p className="text-sm text-muted-foreground">High contrast text, large buttons, and screen-reader support to accommodate visual impairments.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <CheckSquare className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seated Exercises</h3>
              <p className="text-sm text-muted-foreground">Support for safer, seated routines like knee extensions, tailored for balance limitations.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Caregiver-Assisted Routines</h3>
          <p className="mb-6">
            Many users perform their exercises with the help of a family member or professional caregiver. Physiomatics allows the caregiver to set up the camera, read out the instructions, and let the AI handle the counting—leaving the caregiver free to focus on the person, not the screen.
          </p>
          
          <div className="rounded-2xl bg-amber-500/10 p-6 border-l-4 border-amber-500 text-amber-800 dark:text-amber-400">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <AlertTriangle className="size-5" /> Safety Considerations
            </div>
            <p className="text-sm m-0">Physiomatics does not promise fall prevention or independent living. Technology supports human care; it does not replace it. Always ensure appropriate supervision is present if there is any risk of falling or injury.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Need assistance?</h3>
            <p className="text-sm text-muted-foreground mb-6">Our team is available to help you set up an accessible routine.</p>
            <Button asChild className="w-full justify-between mb-3" variant="hero">
              <Link to="/contact">Contact Our Team <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild className="w-full justify-between" variant="outline">
              <a href={whatsappLink(WA_MESSAGES.elderly)} target="_blank" rel="noreferrer">
                <PhoneCall className="size-4" /> Chat on WhatsApp
              </a>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Does this prevent falls?</strong>
                <span className="text-muted-foreground">No technology can guarantee fall prevention. Regular exercise can improve strength, but professional guidance is required.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Do they need to use it alone?</strong>
                <span className="text-muted-foreground">No. We strongly encourage caregivers to assist with the recording and monitoring process.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
