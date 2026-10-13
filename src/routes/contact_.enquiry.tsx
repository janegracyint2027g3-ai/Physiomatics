import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  Mail
} from "lucide-react";
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
      { title: "Direct Clinical & Technical Enquiry — Physiomatics" },
      { 
        name: "description", 
        content: "Submit a direct enquiry or message our clinical team via WhatsApp or telephone for immediate answers on exercises, clinic onboarding, and pilot programs." 
      },
      { property: "og:title", content: "Direct Clinical Enquiry — Physiomatics" },
      { property: "og:description", content: "Fast responses to your physiotherapy technology questions." },
    ],
  }),
  component: EnquiryPage,
});

const INQUIRY_CATEGORIES = [
  {
    icon: Stethoscope,
    title: "Clinics & Physical Therapists",
    description: "Questions regarding remote patient compliance tracking, patient dashboard access, or tailored exercise protocols.",
    actionText: "Chat about Clinic Pilots",
    waMsg: "Hello Physiomatics, I am a physical therapist inquiring about clinic deployment and patient tracking features."
  },
  {
    icon: Users,
    title: "Patients & Family Caregivers",
    description: "Guidance on how to use the webcam analyzer at home, device requirements, or camera positioning tips.",
    actionText: "Chat about Home Setup",
    waMsg: "Hello Physiomatics, I am a patient/caregiver with questions about using the movement analysis tool at home."
  },
  {
    icon: GraduationCap,
    title: "Educators & Researchers",
    description: "Inquiries regarding biomechanics teaching labs, student projects, or computer vision accuracy validation.",
    actionText: "Academic Inquiries",
    waMsg: "Hello Physiomatics, I represent an educational/research institution interested in using your biomechanics platform."
  },
  {
    icon: Building2,
    title: "Healthtech & EMR Partners",
    description: "Discussions regarding software licensing, telehealth platform embedding, or bespoke joint angle tracking.",
    actionText: "Discuss Integration",
    waMsg: "Hello Physiomatics, I would like to discuss a technology integration or partnership opportunity."
  }
];

const SLA_HIGHLIGHTS = [
  {
    icon: Clock,
    title: "Under 4 Hours Response",
    detail: "WhatsApp queries during daytime business hours receive rapid responses from our core engineering and clinical team."
  },
  {
    icon: ShieldCheck,
    title: "Strict Confidentiality",
    detail: "We never sell, rent, or share clinic details or patient inquiries. All communication adheres to medical privacy standards."
  },
  {
    icon: Sparkles,
    title: "Direct Clinician Triage",
    detail: "Technical and rehabilitation questions are reviewed by team members with genuine physical therapy and computer vision backgrounds."
  }
];

function EnquiryPage() {
  return (
    <>
      <PageHero 
        eyebrow="Direct Communication" 
        title="Have Questions About Physiomatics?"
        description="Whether you are a clinician looking to modernize home exercise adherence, a patient learning how to position your camera, or a researcher exploring kinematic accuracy—we're here to help."
      />

      {/* Inquiry Pathways */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Targeted Triage</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Select Your Area of Interest
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your profile below to start a direct WhatsApp conversation with pre-aligned context.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INQUIRY_CATEGORIES.map((cat, idx) => (
            <div 
              key={idx} 
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-primary/40 hover:-translate-y-1"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{cat.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <Button asChild variant="whatsapp" className="w-full text-xs h-9">
                  <a href={whatsappLink(cat.waMsg)} target="_blank" rel="noreferrer">
                    {cat.actionText} →
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Contact Channels Box */}
      <section className="container-page py-8">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Instant Connect Available</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                Prefer a Phone Call or Complete Form?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Reach out by telephone during business hours or complete our structured contact form if you need to attach documentation or outline multi-site clinical requirements.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild variant="hero">
                  <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">
                    Message WhatsApp ({PHONE_NUMBER_DISPLAY})
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={PHONE_TEL}>
                    <Phone className="size-4 mr-2" /> Call {PHONE_NUMBER_DISPLAY}
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/contact">
                    Detailed Form <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Communication Commitments</h4>
              <div className="space-y-4">
                {SLA_HIGHLIGHTS.map((sla, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <sla.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{sla.title}:</strong>
                      <span className="text-muted-foreground ml-1">{sla.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              Physiomatics Clinical Technology Team · Direct Line: <a href={PHONE_TEL} className="font-semibold text-foreground hover:text-primary">{PHONE_NUMBER_DISPLAY}</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                ▶️ YouTube: @JaneGracyDavid
              </a>
              <span>•</span>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                💼 LinkedIn: Physiomatics
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="container-page py-6">
        <div className="rounded-2xl border border-muted bg-muted/30 p-5 text-center text-xs text-muted-foreground">
          <strong>Important Clinical Reminder:</strong> If you are experiencing acute, sharp, radiating pain, sudden joint locking, or signs of medical distress, please contact emergency medical services or your physician immediately. Physiomatics enquiry channels do not provide emergency medical triage.
        </div>
      </section>
    </>
  );
}
