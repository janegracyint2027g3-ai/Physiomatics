import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { 
  ShieldCheck, 
  HardDrive, 
  ServerOff, 
  Database, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Cpu, 
  FileCheck,
  EyeOff
} from "lucide-react";

export const Route = createFileRoute("/how-it-works_/privacy")({
  head: () => ({
    meta: [
      { title: "Zero-Cloud Data Privacy & Client-Side Security — Physiomatics" },
      { 
        name: "description", 
        content: "Discover how Physiomatics preserves patient confidentiality through on-device edge processing: zero video transmission, local storage persistence, and verified data sovereignty." 
      },
      { property: "og:title", content: "Data Privacy & Client-Side Security — Physiomatics" },
      { property: "og:description", content: "Zero video transmission to external servers. Your biometric movement data stays on your device." },
    ],
  }),
  component: PrivacyPage,
});

const DATA_FLOW_MATRIX = [
  {
    category: "Live Camera Frames & Video Buffers",
    storage: "Volatile Device RAM / WebGL Texture",
    transmission: "Zero (0) bytes uploaded",
    retention: "Instantaneously discarded after frame inference (~33ms)",
    status: "Private & Ephemeral"
  },
  {
    category: "Kinematic Telemetry (Angles, Reps)",
    storage: "Browser LocalStorage / IndexedDB",
    transmission: "None without explicit patient export",
    retention: "Controlled entirely by user (wiped upon clearing cache)",
    status: "Patient-Owned"
  },
  {
    category: "Contact & Consultation Inquiries",
    storage: "Secure HIPAA/GDPR-compliant cloud database",
    transmission: "Encrypted HTTPS (TLS 1.3)",
    retention: "Retained for clinician response & scheduling",
    status: "Encrypted In-Transit"
  }
];

const COMPLIANCE_PILLARS = [
  {
    title: "Data Minimization by Architecture",
    detail: "We do not rely on server-side promises not to view your video. Instead, our software is structurally incapable of seeing your video because no server endpoint exists to accept it."
  },
  {
    title: "WebAssembly Sandbox Isolation",
    detail: "MediaPipe neural networks run within the browser's native JavaScript/Wasm sandbox, restricted from reading files, network sockets, or unauthorized peripheral sensors."
  },
  {
    title: "No Biometric Facial Identifiers",
    detail: "Topological landmarks map skeletal kinematics (shoulders, knees, elbows) rather than biometric facial signatures or facial recognition profiles."
  },
  {
    title: "Absolute Patient Sovereignty",
    detail: "Patients can wipe their entire stored exercise history in a single click by clearing browser website storage. We retain zero shadow backups of your sessions."
  }
];

export function PrivacyPage() {
  return (
    <>
      <PageHero 
        eyebrow="Data Sovereignty & Edge Architecture" 
        title="Zero-Cloud Privacy: Your Video Never Leaves Your Device"
        description="Healthcare privacy cannot rely on policy pledges alone—it must be guaranteed by technical architecture. Learn how Physiomatics isolates video processing locally on your hardware."
      />

      {/* Core Privacy Hero Highlight */}
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Architectural Guarantee
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Local-First Processing by Design
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Performing rehabilitation exercises at home is intimate and vulnerable. Patients should never have to wonder whether raw video recordings of their living room or bedroom are being uploaded to third-party cloud servers, analyzed by overseas contractors, or stored in vulnerable data lakes.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Physiomatics solves this fundamentally: the AI model runs locally inside your browser via compiled WebAssembly. Camera frames are inspected in volatile device memory, converted to mathematical joint angles, and immediately discarded.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild variant="hero">
                <Link to="/analyze">Test Live in Browser (Zero Upload)</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/safety">Review Patient Safety Guidelines</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 shadow-soft text-center space-y-4">
            <ServerOff className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Zero Cloud Storage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No video database. No server-side video ingest pipeline. Even if our web servers were completely offline, your browser can continue tracking movement locally.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Verified Client-Side Isolation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow Matrix */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-card p-8 md:p-10 shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Data Classification</span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground md:text-3xl">
              Transparent Data Flow Lifecycle
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A comprehensive breakdown of how each data artifact is created, handled, and purged.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="p-3.5 font-semibold text-foreground">Data Type</th>
                  <th className="p-3.5 font-semibold text-foreground">Storage Location</th>
                  <th className="p-3.5 font-semibold text-foreground">Network Transmission</th>
                  <th className="p-3.5 font-semibold text-foreground">Retention Policy</th>
                  <th className="p-3.5 font-semibold text-foreground">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DATA_FLOW_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-medium text-foreground">{row.category}</td>
                    <td className="p-3.5 text-muted-foreground">{row.storage}</td>
                    <td className="p-3.5 text-muted-foreground font-mono">{row.transmission}</td>
                    <td className="p-3.5 text-muted-foreground">{row.retention}</td>
                    <td className="p-3.5">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4 Architectural Compliance Pillars */}
      <section className="container-page py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Security Standards</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Our 4 Pillars of Data Governance
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Designed to exceed modern digital healthcare and patient data sovereignty requirements.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COMPLIANCE_PILLARS.map((col, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-primary">PILLAR 0{idx + 1}</span>
                <h4 className="mt-3 text-base font-semibold text-foreground">{col.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{col.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Verify Independent of Promises */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-10 shadow-soft">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Terminal className="h-4 w-4" />
              <span>Independent Verification</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground md:text-3xl">
              How IT Teams & Patients Can Verify Zero-Upload
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              You don't need to take our word for it. Any user, clinical IT coordinator, or cybersecurity auditor can verify that no video streams leave their computer in real time:
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-muted/60 p-5 border border-border space-y-3 font-mono text-xs">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>Open Google Chrome or Microsoft Edge on your computer.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>Press <kbd className="rounded bg-background px-1.5 py-0.5 border">F12</kbd> or right-click anywhere and select <kbd className="rounded bg-background px-1.5 py-0.5 border">Inspect</kbd> to open Developer Tools.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>Navigate to the <strong className="text-foreground">Network</strong> tab and filter by <strong className="text-foreground">WS / Fetch / XHR</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">4.</span>
              <span>Start an exercise session in our analyzer. Observe that zero outbound streaming requests or continuous binary uploads are transmitted.</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 text-xs">
            <span className="text-muted-foreground">
              Have clinical governance or institutional enterprise privacy requirements?
            </span>
            <Link to="/contact/consultation" className="font-semibold text-primary hover:underline shrink-0">
              Request Enterprise Security Whitepaper →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
