import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  BrainCircuit, 
  Users, 
  HeartHandshake, 
  Target, 
  Lock, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Compass, 
  Briefcase, 
  FileText 
} from "lucide-react";
import { PHONE_NUMBER_DISPLAY, whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Physiomatics — Privacy-First Movement Intelligence & Rehabilitation" },
      { name: "description", content: "Learn about Physiomatics: our mission, ethical AI principles, on-device pose estimation architecture, and commitment to physical therapist oversight." },
      { property: "og:title", content: "About Physiomatics — Move Better. Recover Smarter. Age Stronger." },
      { property: "og:description", content: "Responsible, privacy-first movement monitoring bridging clinic to home." },
    ],
  }),
  component: About,
});

const principles = [
  {
    title: "1. Human Clinician at the Center",
    tag: "CLINICAL OVERSIGHT",
    description: "Physiomatics does not diagnose, prescribe surgical protocols, or replace a licensed physical therapist. We provide objective bio-kinematic telemetry to help therapists make data-driven care adjustments.",
    icon: Users,
  },
  {
    title: "2. Zero-Cloud Video Processing",
    tag: "ABSOLUTE PRIVACY",
    description: "Patient video streams never leave the user's browser. Our MediaPipe vision models run completely on-device using WebAssembly and WebGL, guaranteeing medical privacy in the home.",
    icon: Lock,
  },
  {
    title: "3. Honest & Transparent Metrics",
    tag: "ALGORITHMIC INTEGRITY",
    description: "When camera visibility, angle perspective, or lighting is compromised, our system displays real-time alignment warnings and deliberately hides metrics rather than calculating fabricated angles.",
    icon: Eye,
  },
  {
    title: "4. Geriatric & Universal Ergonomics",
    tag: "INCLUSIVE DESIGN",
    description: "Built for patients recovering from surgery, stroke, or osteoarthritis. High-contrast typography, large buttons, audio-visual feedback, and seated exercise support ensure accessibility for all ages.",
    icon: HeartHandshake,
  },
];

const subpages = [
  {
    title: "Our Mission",
    path: "/about/mission",
    desc: "Closing the 80% non-adherence gap in home rehabilitation through motor-learning feedback.",
    icon: Target,
  },
  {
    title: "Clinical & AI Leadership",
    path: "/about/team",
    desc: "Meet the senior physiotherapists, computer vision researchers, and UX architects behind our system.",
    icon: Users,
  },
  {
    title: "Careers & Culture",
    path: "/about/careers",
    desc: "Join our team engineering privacy-first computer vision and motor rehabilitation software.",
    icon: Briefcase,
  },
  {
    title: "Safety & Disclaimers",
    path: "/safety",
    desc: "Review clinical boundaries, medical disclaimers, and when to seek immediate emergency care.",
    icon: ShieldCheck,
  },
];

const stats = [
  { value: "100%", label: "On-Device Client Processing", sub: "Zero video frames uploaded" },
  { value: "33", label: "Skeletal Landmark Coordinates", sub: "Sub-millisecond tracking" },
  { value: "0", label: "Cloud Video Storage", sub: "True local-first architecture" },
  { value: "3+", label: "Validated Core Movements", sub: "Squat, knee extension, arm raise" },
];

function About() {
  return (
    <>
      <PageHero 
        eyebrow="About Physiomatics" 
        title="Move Better. Recover Smarter. Age Stronger."
      >
        Physiomatics connects online physiotherapy training with on-device AI movement observation—helping patients follow prescribed exercises with confidence while giving clinicians objective longitudinal insight.
      </PageHero>

      {/* Stats Bar */}
      <section className="border-b bg-card">
        <div className="container-page py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary font-display">{s.value}</div>
                <div className="text-sm font-bold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin & Vision Section */}
      <section className="container-page py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Our Origin & Purpose
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-foreground">
              Built to Solve the Solitary Struggle of Home Physical Therapy
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
              Every year, millions of individuals receive physical therapy for joint replacements, sports injuries, neurological trauma, or age-related mobility decline. But while clinical sessions offer close guidance, recovery at home is often confusing, unmeasured, and lonely.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Paper exercise sheets cannot verify if your knee was tracking over your second toe, or if your lumbar spine was compensating during a squat. Physiomatics provides real-time biomechanical guidance through your standard phone or laptop webcam—providing immediate feedback without invasive wearables.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/about/mission">Read Our Clinical Mission <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/about/team">Meet the Clinical Team</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-card via-card/90 to-primary/5 p-8 sm:p-10 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Cpu className="size-6 text-primary" /> Engineering Architecture
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our vision engine is built on client-side Google MediaPipe running inside a WebAssembly sandbox. It computes 33 2D coordinates 30 times per second directly in the browser's memory, calculates trigonometric joint angles, and destroys raw video frames immediately after angle computation.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>Runs smoothly on modern smartphones, tablets, and budget laptops</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>No specialized hardware, motion capture suits, or sensors required</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>Zero bandwidth costs for video streaming—100% on-device</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Tenets</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">The Principles Guiding Our Development</h2>
            <p className="text-muted-foreground mt-3 text-base">
              Healthcare software must adhere to stricter standards than typical consumer apps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-3xl border bg-card p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-2xl bg-primary/10 p-3.5 text-primary">
                    <p.icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider">{p.tag}</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore About Submenu Section */}
      <section className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Explore Our Organization</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Learn More About Physiomatics</h2>
          <p className="text-muted-foreground mt-3">
            Dive deeper into our clinical protocols, leadership team, research initiatives, and safety standards.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subpages.map((sp) => (
            <Link 
              key={sp.title} 
              to={sp.path} 
              className="group rounded-3xl border bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary w-fit mb-5 group-hover:scale-110 transition-transform">
                  <sp.icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {sp.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {sp.desc}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary pt-4 border-t">
                <span>View {sp.title}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#1a0a2e] to-[#2c134d] p-10 sm:p-14 text-white text-center shadow-xl max-w-4xl mx-auto">
          <Sparkles className="size-12 text-[#5AA9AC] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Experience Real-Time Movement Intelligence</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Test on-device movement tracking in your browser or schedule a clinical walkthrough with our team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/analyze">Try Video Movement Analysis <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="whatsapp">
              <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">
                Speak on WhatsApp ({PHONE_NUMBER_DISPLAY})
              </a>
            </Button>
            <Button asChild variant="outline-inverse">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

