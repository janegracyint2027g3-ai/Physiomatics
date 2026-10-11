import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Eye, Stethoscope, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/solutions_/clinics")({
  head: () => ({
    meta: [
      { title: "Video-Assisted Movement Monitoring for Clinics — Physiomatics" },
      { name: "description", content: "Explore how video-assisted movement monitoring can support patient education and supervised home-exercise workflows." },
      { property: "og:title", content: "Physiotherapy Clinics Solutions" },
    ],
  }),
  component: ClinicsPage,
});

function ClinicsPage() {
  return (
    <>
      <PageHero eyebrow="Physiotherapy Clinics" title="Explore Video-Assisted Movement Monitoring for Physiotherapy Practice.">
        Support your supervised home-exercise workflows with clearer, objective session documentation.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Objective insights between appointments</h2>
          <p className="text-lg text-muted-foreground mb-8">
            When patients leave the clinic, tracking their adherence relies on self-reporting. Physiomatics provides video-assisted exercise observation to help you see exactly how they are performing their home routines.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Eye className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video-Assisted Observation</h3>
              <p className="text-sm text-muted-foreground">Patients use their own devices. The browser-based AI provides repetition counting and angle estimates.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <FileCheck className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Session Documentation</h3>
              <p className="text-sm text-muted-foreground">Review the patient's securely stored session history during their next visit to make informed adjustments.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Implementation Considerations</h3>
          <p className="mb-6">
            Physiomatics is designed as an accessible home-support tool, not a clinical diagnostic device. It works best when integrated into a supervised workflow where the physiotherapist retains full clinical oversight.
          </p>
          
          <div className="rounded-2xl bg-accent p-6 border-l-4 border-primary">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <ShieldCheck className="size-5" /> Current Capabilities
            </div>
            <p className="text-sm m-0">Please note: Physiomatics does not currently feature built-in Electronic Health Record (EHR) integrations, team accounts, or centralized clinic analytics. The current workflow relies on patients sharing their locally stored data during appointments.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Interested in adopting?</h3>
            <p className="text-sm text-muted-foreground mb-6">Speak with us to understand how Physiomatics can fit into your clinic.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/contact">Request a Demo <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Does it store patient video?</strong>
                <span className="text-muted-foreground">No. Videos are processed on the patient's device and immediately discarded. Only the numerical metrics are saved.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Is it a medical device?</strong>
                <span className="text-muted-foreground">No. It is an educational and communication tool that provides 2D estimates, not clinical-grade 3D motion capture.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
