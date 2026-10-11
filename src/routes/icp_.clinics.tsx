import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  Building2, 
  TrendingUp, 
  Users2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import clinicInterior from "@/assets/clinic_interior.jpg";

export const Route = createFileRoute("/icp_/clinics")({
  head: () => ({
    meta: [
      { title: "Physiotherapy Clinics & Practices ICP — Physiomatics" },
      { name: "description", content: "Scale patient retention, automate home exercise compliance tracking, and elevate practice documentation with Physiomatics." },
      { property: "og:title", content: "Physiomatics for Clinics & Multi-Location Practices" },
    ],
  }),
  component: ClinicsICPPage,
});

function ClinicsICPPage() {
  return (
    <>
      <PageHero 
        eyebrow="Target Profile: Clinic Owners & Clinical Directors" 
        title="Modernize Your Clinic's Home Exercise Prescription With Objective Data."
      >
        Bridging the critical gap between in-clinic sessions and home compliance. Empower your therapists with real video kinematic telemetry while eliminating patient dropout.
      </PageHero>

      <div className="container-page -mt-8 mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border">
          <img 
            src={clinicInterior} 
            alt="Modern Physiotherapy and Motion Analytics Clinic" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="size-3.5" /> High-Performance Practice Architecture
            </span>
            <h3 className="text-xl md:text-2xl font-bold">Smart Movement Observation Across All Practice Rooms</h3>
          </div>
        </div>
      </div>

      <section className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-12">
          {/* Executive Overview */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-semibold mb-3">
              <Building2 className="size-5" />
              <span>Target Persona: Physical Therapy Practice Owner / Clinical Director</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Solve the 70% Home Exercise Non-Compliance Crisis
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Clinical studies demonstrate that over 70% of physical therapy patients fail to execute their home exercise regimens correctly or consistently. In traditional clinics, this leads to prolonged recovery times, frustrated patients, and missed discharge goals.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Physiomatics transforms paper handouts and static PDFs into interactive, camera-assisted recovery sessions. Patients open a browser link, follow the visual exercise cadence, and their performance metrics are verified automatically.
            </p>
          </div>

          {/* Key Value Pillars */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <TrendingUp className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Practice Revenue & Retention</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Patients who see objective metric progression (e.g., knee flexion moving from 72° to 110°) are 3.2x more likely to finish their entire prescribed plan of care.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Clock className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Zero Administrative Drag</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Therapists spend less time interrogating patients about home routines. Form metrics and adherence percentages are organized automatically for quick check-ins.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <ShieldCheck className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Strict On-Device Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zero patient video is streamed to or stored on servers. Kinematic calculations execute in the browser using WebAssembly and client-side models, simplifying compliance.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Layers className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Frictionless Patient Experience</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No app store downloads, hardware wearables, or account setup friction. Patients can run guided sessions directly from any smartphone, tablet, or laptop.
              </p>
            </div>
          </div>

          {/* Clinic Workflow comparison */}
          <div className="rounded-3xl border bg-card p-8">
            <h3 className="text-xl font-bold mb-6">Workflow Comparison: Traditional vs Physiomatics</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-destructive/5 border border-destructive/15 p-5">
                <div className="font-semibold text-destructive mb-2">❌ Traditional Clinic Model</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Paper exercise sheets easily lost or forgotten</li>
                  <li>• Unverified patient self-reporting during visits</li>
                  <li>• Patients perform exercises with flawed biomechanics</li>
                  <li>• High drop-out rates after 3-4 visits</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-5">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">✅ Physiomatics-Powered Clinic</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Interactive browser link with guided voice & visual rep feedback</li>
                  <li>• Quantified completion rates and session timestamps</li>
                  <li>• Real-time joint angle threshold verification</li>
                  <li>• High patient engagement and transparent recovery charts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Conversion CTA */}
        <aside className="space-y-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6 border shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="size-4" /> Clinic Deployment
            </div>
            <h3 className="text-xl font-bold mb-2">Transform Your Practice Today</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Schedule a personalized walkthrough designed for clinic owners and therapy directors.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full justify-between" variant="hero">
                <Link to="/contact">Book Clinic Demo <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <a href={whatsappLink("Hello, I am interested in deploying Physiomatics across our physiotherapy clinic.")} target="_blank" rel="noreferrer">
                  Chat With Team <Activity className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h4 className="font-semibold mb-3">Key Clinic Metrics</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Typical Patient Onboarding:</span>
                <span className="font-semibold">&lt; 30 Seconds</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">App Downloads:</span>
                <span className="font-semibold text-emerald-600">0 (Web-Only)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Supported Modalities:</span>
                <span className="font-semibold">Shoulder, Knee, Hip, Spine</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
