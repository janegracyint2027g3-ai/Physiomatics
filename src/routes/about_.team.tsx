import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ArrowRight, 
  Stethoscope, 
  BrainCircuit, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Linkedin, 
  Mail, 
  Users, 
  HeartHandshake, 
  Activity, 
  Layers 
} from "lucide-react";
import { LINKEDIN_URL, PHONE_NUMBER_DISPLAY, whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/about_/team")({
  head: () => ({
    meta: [
      { title: "Clinical & Engineering Leadership — Physiomatics" },
      { name: "description", content: "Meet the physical therapy clinicians, computer vision researchers, and healthcare UX architects behind Physiomatics." },
      { property: "og:title", content: "Clinical & AI Leadership — Physiomatics" },
    ],
  }),
  component: TeamPage,
});

const teamMembers = [
  {
    name: "Jane Gracy David",
    role: "Founder & Lead Technology Architect",
    specialty: "Computer Vision & Edge Healthcare Systems",
    bio: "Pioneering browser-based spatial computing for clinical rehabilitation. Architected the zero-cloud MediaPipe pipeline ensuring patient videos remain 100% on-device.",
    credentials: "B.Tech Computer Science & Healthcare Systems",
    focus: "Real-Time Pose Kinematics & Multimodal Telemetry",
    icon: BrainCircuit,
  },
  {
    name: "Clinical Advisory Board",
    role: "Orthopedic & Geriatric Physical Therapists",
    specialty: "Evidence-Based Rehabilitation Protocols",
    bio: "A council of practicing senior physiotherapists and sports rehab clinicians who calibrate exercise threshold parameters, validate joint angles, and define patient safety bounds.",
    credentials: "Master of Physiotherapy (MPT / MS Ortho & Neuro)",
    focus: "Kinematic Bounds, Goniometer Validation, Safe Re-injury Limits",
    icon: Stethoscope,
  },
  {
    name: "Biomechanics & Pose Estimation Core",
    role: "Spatial Geometry & Algorithm Research",
    specialty: "Mathematical Modeling of 33 Skeletal Coordinates",
    bio: "Focuses on temporal joint angle smoothing, perspective correction for 2D smartphone webcams, and repetition cycle segmentation across squats, knee extensions, and shoulder raises.",
    credentials: "Mathematics & Edge Machine Learning",
    focus: "Perspective Distortion Correction & Landmark Confidence",
    icon: Activity,
  },
  {
    name: "Accessible Healthcare Design Collective",
    role: "Senior Ergonomics & Assistive UX",
    specialty: "Geriatric & Limited-Dexterity Usability",
    bio: "Translates complex clinical feedback into warm, high-contrast, large-button visual interfaces designed specifically for patients recovering from surgery or living with arthritis.",
    credentials: "Human-Computer Interaction (HCI) & Universal Design",
    focus: "WCAG 2.2 AAA Compliance & Visual Biofeedback",
    icon: HeartHandshake,
  },
];

const clinicalGuarantees = [
  {
    title: "1. Registered Clinicians Lead Program Design",
    description: "Every movement routine and reference angle in our library is curated and reviewed by licensed physiotherapists. Algorithms never invent unvalidated exercises.",
    icon: GraduationCap,
  },
  {
    title: "2. Rigorous 2D vs. 3D Goniometry Calibration",
    description: "We benchmark our landmark-derived angles against manual clinical goniometry and 3D motion tracking systems, openly documenting 2D camera tolerances.",
    icon: Layers,
  },
  {
    title: "3. Absolute Clinician Oversight",
    description: "Physiomatics does not replace clinical judgment. We provide objective session data to help physiotherapists make informed rehabilitation adjustments.",
    icon: ShieldCheck,
  },
  {
    title: "4. Compassionate Communication",
    description: "We build technology that speaks to patients with empathy—celebrating steady incremental gains without confusing medical jargon or unrealistic recovery promises.",
    icon: Users,
  },
];

function TeamPage() {
  return (
    <>
      <PageHero 
        eyebrow="Clinical & AI Team" 
        title="Uniting Orthopedic Clinicians and Computer Vision Engineers."
      >
        We believe that effective healthcare technology requires equal parts clinical expertise and engineering craftsmanship. Meet the multidisciplinary leaders dedicated to safe, transparent movement intelligence.
      </PageHero>

      {/* Leadership & Practice Pillars */}
      <section className="container-page py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Interdisciplinary Excellence</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
            Built at the Intersection of Medicine & Mathematics
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Physiomatics brings clinical rigor into software engineering to ensure every tracked repetition is safe, verifiable, and private.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {teamMembers.map((member) => (
            <div 
              key={member.name}
              className="rounded-3xl border bg-card p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                    <member.icon className="size-8" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {member.specialty}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                <div className="text-sm font-semibold text-primary/90 mb-4">{member.role}</div>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  {member.bio}
                </p>

                <div className="space-y-2 pt-4 border-t text-xs">
                  <div className="text-muted-foreground">
                    <strong className="text-foreground">Credentials / Background:</strong> {member.credentials}
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="text-foreground">Core Focus:</strong> {member.focus}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Award className="size-4" /> Active Clinical Contributor
                </span>
                <a 
                  href={LINKEDIN_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                >
                  <Linkedin className="size-3.5" /> Company Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Governance Section */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Clinical Governance</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">Our Clinical Principles</h2>
            <p className="text-muted-foreground mt-3">
              How our team ensures technology acts as a trusted partner to licensed medical providers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {clinicalGuarantees.map((item) => (
              <div key={item.title} className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary w-fit mb-4">
                  <item.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with our specialists */}
      <section className="container-page py-20 text-center">
        <div className="max-w-3xl mx-auto rounded-3xl border bg-gradient-to-b from-card to-primary/5 p-10 sm:p-14 shadow-sm">
          <Users className="size-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Would You Like to Collaborate With Our Team?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you are a clinic director exploring institutional deployment or a physical therapist interested in contributing clinical validation data, our team is eager to connect.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero">
              <Link to="/contact">Schedule Team Introduction <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="whatsapp">
              <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer">
                WhatsApp Us ({PHONE_NUMBER_DISPLAY})
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about/careers">View Career Openings</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

