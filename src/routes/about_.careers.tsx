import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  BrainCircuit, 
  Stethoscope, 
  HeartHandshake, 
  ShieldCheck, 
  Code2, 
  GraduationCap, 
  Compass, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Briefcase 
} from "lucide-react";
import { PHONE_NUMBER_DISPLAY, whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/about_/careers")({
  head: () => ({
    meta: [
      { title: "Careers in Movement Intelligence & AI Physiotherapy — Physiomatics" },
      { name: "description", content: "Join the Physiomatics multidisciplinary team uniting computer vision engineers, orthopedic clinicians, and accessibility designers." },
      { property: "og:title", content: "Careers at Physiomatics — Engineering the Future of Rehabilitation" },
    ],
  }),
  component: CareersPage,
});

const openRoles = [
  {
    title: "Senior Computer Vision / Edge AI Engineer",
    department: "AI & Biomechanics Engineering",
    type: "Full-Time / Hybrid",
    location: "Bengaluru & Remote",
    icon: BrainCircuit,
    description: "Lead on-device pose estimation, real-time joint kinematic estimation algorithms, and temporal repetition segmentation using WebAssembly and MediaPipe.",
    skills: ["MediaPipe / TensorFlow.js", "WebAssembly (WASM)", "Spatial Geometry & Biomechanics", "TypeScript / WebGL / Canvas"],
  },
  {
    title: "Clinical Physiotherapy Research Consultant",
    department: "Clinical Operations & Protocols",
    type: "Clinical Practice / Advisory",
    location: "Flexible / Clinical Site",
    icon: Stethoscope,
    description: "Validate exercise movement angles against clinical goniometry gold standards, formulate safe post-op recovery protocols, and guide geriatric mobility safeguards.",
    skills: ["Master of Physiotherapy (MPT / MS)", "Orthopedic / Neuro Rehabilitation", "Kinematic Validation", "Clinical Trial Design"],
  },
  {
    title: "Healthcare UX & Accessibility Frontend Engineer",
    department: "Product & Digital Experience",
    type: "Full-Time",
    location: "Hybrid / Remote",
    icon: Code2,
    description: "Design high-contrast, tactile interfaces for elderly patients and individuals with limited motor dexterity while engineering real-time telemetry dashboards for clinics.",
    skills: ["React 19 / TanStack Start", "WCAG 2.2 AAA Guidelines", "Tailwind CSS & Micro-interactions", "Touch / Assistive Device UX"],
  },
  {
    title: "Clinical Practice Onboarding & Success Manager",
    department: "Clinical Partnerships",
    type: "Full-Time",
    location: "Bengaluru / Regional",
    icon: HeartHandshake,
    description: "Partner with orthopedic clinics, geriatric care centers, and private physiotherapy practices to streamline therapist dashboard onboarding and home exercise adherence.",
    skills: ["Healthcare SaaS Integration", "Clinician Relationship Management", "EHR / EMR Workflows", "Customer Training & Care"],
  },
];

const cultureValues = [
  {
    title: "Clinical Safety Over Novelty",
    description: "We never release an algorithm without clinical validation. If visibility is compromised or angle confidence is low, our system displays caution rather than guessing.",
    icon: ShieldCheck,
  },
  {
    title: "Zero-Cloud Data Ethics",
    description: "Patient dignity is non-negotiable. We engineer algorithms to compute in the client browser so private home therapy sessions never leave the user's room.",
    icon: Compass,
  },
  {
    title: "Inclusive & Geriatric Accessibility",
    description: "Our technology is purposefully engineered for 75-year-old hip-replacement patients, not just tech enthusiasts. Simplicity, contrast, and warmth define every screen.",
    icon: HeartHandshake,
  },
  {
    title: "Cross-Disciplinary Rigor",
    description: "Software developers learn human anatomy; physical therapists learn computer vision mathematics. We bridge code and kinesiology in every conversation.",
    icon: GraduationCap,
  },
];

const benefits = [
  "Comprehensive Medical & Family Health Coverage",
  "Generous Continuous Learning & Clinical Conference Budget",
  "Ergonomic Home Office & Physiotherapy Equipment Allowance",
  "Flexible Hybrid Schedules Supporting Clinical Practice Hours",
  "Direct Impact on Real Patient Recovery Journeys",
  "Equity Options in Early-Stage Healthcare AI Innovation",
];

function CareersPage() {
  return (
    <>
      <PageHero 
        eyebrow="Careers & Culture" 
        title="Engineer the Future of Accessible Movement Intelligence."
      >
        We are building the bridge between clinical physiotherapy and home recovery. Join a multidisciplinary collective of computer vision engineers, physical therapists, and healthcare designers dedicated to ethical, privacy-first movement analysis.
      </PageHero>

      {/* Overview & Mission Pitch */}
      <section className="container-page py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Why Physiomatics Matters
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-foreground">
              Bridging the 80% Gap in Home Physiotherapy Adherence
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
              Clinical studies consistently show that while physiotherapy is prescribed to millions of post-operative and elderly patients annually, up to 70–80% struggle to maintain correct form or lose motivation between clinic appointments.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              At Physiomatics, we are solving this challenge not by replacing physiotherapists, but by arming both clinicians and patients with accessible, on-device spatial intelligence. Your work directly prevents patient re-injuries, enhances balance in seniors, and accelerates recovery.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <a href="#positions">Explore Open Opportunities <ArrowRight className="size-4 ml-2" /></a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/about/mission">Read Our Clinical Mission</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-card via-card/80 to-primary/5 p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="size-5 text-primary" /> What You Will Experience
            </h3>
            <ul className="space-y-4">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="bg-muted/30 py-20 border-y">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Open Practice & Engineering Roles</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Active Strategic Openings</h2>
            <p className="text-muted-foreground mt-3">
              We recruit purpose-driven individuals across biomechanics, edge machine learning, and healthcare design.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {openRoles.map((role) => (
              <div 
                key={role.title} 
                className="group rounded-3xl border bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <role.icon className="size-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {role.department}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {role.location}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> {role.type}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {role.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">Key Competencies</div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.skills.map((s) => (
                        <span key={s} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Applications Reviewed Continuously</span>
                  <Button asChild variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Link to="/contact" search={{ subject: `Application: ${role.title}` }}>
                      Apply For Role <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Principles */}
      <section className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">How We Work</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Core Principles That Anchor Us</h2>
          <p className="text-muted-foreground mt-3">
            In healthcare technology, culture is not about buzzwords—it is a commitment to clinical safety and patient privacy.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cultureValues.map((v) => (
            <div key={v.title} className="rounded-3xl border bg-card p-6 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary w-fit mb-4">
                <v.icon className="size-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spontaneous Application CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#1a0a2e] to-[#2c134d] p-10 sm:p-14 text-white shadow-xl text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="relative z-10">
            <Briefcase className="size-12 text-[#5AA9AC] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Do Not See Your Exact Role?</h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              We frequently collaborate with practicing physical therapists, medical writers, computer vision researchers, and clinical interns. Reach out directly with your portfolio or CV.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild variant="hero">
                <Link to="/contact">Send Spontaneous Application <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="whatsapp">
                <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">
                  Connect on WhatsApp ({PHONE_NUMBER_DISPLAY})
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

