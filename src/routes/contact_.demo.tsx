import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  Video, 
  CalendarCheck, 
  Clock, 
  Users, 
  Laptop, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Stethoscope,
  PhoneCall,
  Sparkles
} from "lucide-react";
import { whatsappLink, WA_MESSAGES, PHONE_TEL, PHONE_NUMBER_DISPLAY, YOUTUBE_URL, LINKEDIN_URL } from "@/lib/site";
import { GoogleCalendarButton } from "@/components/site/GoogleCalendarButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact_/demo")({
  head: () => ({
    meta: [
      { title: "Book a Clinical & Technical Demo — Physiomatics" },
      { 
        name: "description", 
        content: "Schedule a 25-minute live interactive demonstration of Physiomatics on-device computer vision, kinematic biofeedback, and clinic dashboard integration." 
      },
      { property: "og:title", content: "Book a Clinical Demo — Physiomatics" },
      { property: "og:description", content: "Experience real-time joint kinematic analysis and explore clinical workflows with our team." },
    ],
  }),
  component: DemoPage,
});

const DEMO_AGENDA = [
  {
    time: "00 - 05 min",
    title: "Clinical Context & Objectives",
    description: "Brief alignment on your practice model: outpatient orthopedic, geriatric fall prevention, sports rehab, or academic instruction."
  },
  {
    time: "05 - 15 min",
    title: "Live Edge Computer Vision Walkthrough",
    description: "Real-time demonstration of browser-based 33-point MediaPipe landmarking, joint angle calculation (knee flexion, shoulder elevation), and repetition counter hysteresis."
  },
  {
    time: "15 - 20 min",
    title: "Patient Experience & Adherence Tools",
    description: "Review of audio cues, visual targets, home lighting tolerance, and zero-cloud on-device privacy architecture."
  },
  {
    time: "20 - 25 min",
    title: "Q&A, Pilot Setup & Next Steps",
    description: "Discussion of pilot deployment timelines, clinician dashboard integration, and custom protocol configuration."
  }
];

const WHO_SHOULD_ATTEND = [
  {
    icon: Stethoscope,
    title: "Clinic Owners & Lead PTs",
    detail: "Seeking objective home exercise compliance data to reduce patient dropout between in-clinic appointments."
  },
  {
    icon: Users,
    title: "Care Coordinators & Geriatricians",
    detail: "Evaluating safe, accessible balance and seated mobility tracking for senior living communities and home care."
  },
  {
    icon: Laptop,
    title: "Healthtech & Digital Health Leaders",
    detail: "Exploring zero-cloud, client-side computer vision integrations with existing telehealth and EMR platforms."
  }
];

const DEMO_FAQS = [
  {
    q: "Do I need any special camera or hardware for the demo?",
    a: "No special equipment is required. The live demo runs entirely over standard Google Meet or Zoom, and you can test the platform yourself using any standard laptop webcam, smartphone camera, or tablet."
  },
  {
    q: "Can my clinical team and department heads join the call?",
    a: "Yes! When you book via the Google Calendar widget, you can add multiple guest email addresses so all stakeholders receive the calendar invite and meeting link."
  },
  {
    q: "What if I need a time slot outside of standard business hours?",
    a: "If the available calendar slots don't match your time zone or schedule, simply send us a quick note via WhatsApp (+91 78450 72426) or our enquiry form, and we will arrange an accommodating time."
  }
];

function DemoPage() {
  return (
    <>
      <PageHero 
        eyebrow="Interactive Clinical Demonstration" 
        title="Experience On-Device Movement Analysis Live"
        description="Book a dedicated 25-minute interactive walkthrough. See how real-time biomechanical biofeedback elevates patient engagement and clinical oversight."
      />

      {/* Main Scheduling Section */}
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Calendar & Booking Widget */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card p-8 md:p-10 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">Select an Appointment Time</h2>
                <p className="text-xs text-muted-foreground">Instant confirmation via Google Calendar & Google Meet</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
              <CalendarCheck className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-lg text-foreground">Instant Calendar Scheduling</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Pick a slot that suits your schedule. A Google Meet link and confirmation will be sent directly to your inbox.
              </p>
              <div className="mt-6 flex justify-center">
                <GoogleCalendarButton
                  label="Schedule Live 25-Min Demo"
                  source="contact_demo_page"
                  useNativeGoogleWidget={false}
                />
              </div>
            </div>

            {/* Alternative Direct Channels */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Alternative Fast Contact
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="whatsapp" className="text-xs h-10 px-4">
                  <a href={whatsappLink(WA_MESSAGES.demo)} target="_blank" rel="noreferrer">
                    Book via WhatsApp ({PHONE_NUMBER_DISPLAY})
                  </a>
                </Button>
                <Button asChild variant="outline" className="text-xs h-10 px-4">
                  <Link to="/contact">
                    Detailed Consultation Form <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <a href={PHONE_TEL} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call {PHONE_NUMBER_DISPLAY}</span>
                </a>
                <span>•</span>
                <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  YouTube: @JaneGracyDavid
                </a>
                <span>•</span>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  LinkedIn: Physiomatics
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Demo Agenda & What to Expect */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Clock className="h-4 w-4" />
                <span>25-Minute Structured Agenda</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground">What We Cover Together</h3>

              <div className="mt-6 space-y-5">
                {DEMO_AGENDA.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="font-mono text-xs font-bold text-primary shrink-0 pt-0.5">
                      {item.time}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span>Privacy & Zero Data Footprint</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                During the demonstration, you will see how camera video frames are processed strictly within the local browser sandbox. No video stream is ever transmitted across the network or stored in cloud buckets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Benefits Most */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Tailored Context</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Who Typically Attends Our Walkthroughs
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We customize the session to address your primary operational or clinical bottlenecks.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {WHO_SHOULD_ATTEND.map((w, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{w.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{w.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo FAQ */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="text-center font-display text-2xl font-semibold text-foreground">
          Demo Scheduling Questions
        </h2>
        <Accordion type="single" collapsible className="mt-6 space-y-3">
          {DEMO_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`demo-faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
