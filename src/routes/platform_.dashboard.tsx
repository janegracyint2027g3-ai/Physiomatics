import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { UserCheck, Shield, FileText, Share2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/platform_/dashboard")({
  head: () => ({
    meta: [
      { title: "Bring Structured Movement Observations Into Professional Review — Physiomatics" },
      { name: "description", content: "The professional review workflow for physiotherapists, clinics, and authorized users." },
      { property: "og:title", content: "Physiotherapist Dashboard (Planned)" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <PageHero eyebrow="Physiotherapist Dashboard" title="Bring Structured Movement Observations Into Professional Review.">
        Explore the planned professional workflow for reviewing patient adherence and discussing movement observations.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="rounded-2xl bg-muted/50 border p-4 mb-8 text-sm text-muted-foreground flex items-center gap-3">
            <Shield className="size-5 shrink-0" />
            <p className="m-0"><strong>Status Notice:</strong> The dedicated multi-patient clinic dashboard, cloud-synced histories, and direct EHR integrations are currently <em>in development</em>. This page describes the supported manual workflow and planned future capabilities.</p>
          </div>

          <h2 className="text-3xl font-bold tracking-tight mb-6">Current Professional Workflow</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Physiomatics currently supports a collaborative, in-person review workflow. Patients record sessions at home and bring their device to the clinic.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <FileText className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Summaries</h3>
              <p className="text-sm text-muted-foreground">Review the patient's locally stored session history to confirm adherence between visits.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Share2 className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Discuss Observations</h3>
              <p className="text-sm text-muted-foreground">Use the generated angle estimates as a starting point for clinical conversation.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Planned Capabilities</h3>
          <p className="mb-6">
            We are actively developing a secure, centralized dashboard for authorized clinicians to manage patients remotely. Future capabilities will include:
          </p>
          <ul className="mb-8">
            <li>Secure, opt-in remote sharing of session summaries.</li>
            <li>Multi-patient oversight panels.</li>
            <li>The ability to prescribe specific exercise modules.</li>
            <li>Customizable repetition and angle thresholds.</li>
          </ul>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Interested in Clinic Access?</h3>
            <p className="text-sm text-muted-foreground mb-6">Contact us to discuss early access and implementation for your practice.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/contact">Request a Demonstration <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild className="w-full mt-3" variant="outline">
              <Link to="/analyze">Explore Video Analytics</Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">FAQs</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Does it integrate with my EHR?</strong>
                <span className="text-muted-foreground">Not currently. We prioritize local, on-device processing to ensure maximum privacy.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Can I see the raw video?</strong>
                <span className="text-muted-foreground">No. To protect patient privacy, videos are processed locally and discarded. Only the numerical summary is stored.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
