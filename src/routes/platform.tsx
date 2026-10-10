import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanLine, Dumbbell, LineChart, UserCheck, Lock, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform — Physiomatics" },
      { name: "description", content: "Exercise training, AI movement analysis, progress monitoring and physiotherapist review in one platform." },
      { property: "og:title", content: "The Physiomatics Platform" },
      { property: "og:description", content: "What's available today and what's coming next." },
    ],
  }),
  component: Platform,
});

const features = [
  { icon: ScanLine, t: "AI Video Analytics", d: "Landmark detection, skeletal overlay, joint angles, repetitions and confidence.", status: "Available", to: "/analyze" },
  { icon: Dumbbell, t: "Exercise Training", d: "Step-by-step guidance and camera setup for each supported exercise.", status: "Available", to: "/resources" },
  { icon: LineChart, t: "Progress Monitoring", d: "Session history and movement-range trends, stored on your device.", status: "Available", to: "/analyze" },
  { icon: UserCheck, t: "Physiotherapist Dashboard", d: "Review authorized recordings, add notes and manage programs.", status: "In development", to: "/contact" },
  { icon: Lock, t: "Privacy-first processing", d: "Videos are processed in-browser and never uploaded on this site.", status: "Available", to: "/about" },
  { icon: Accessibility, t: "Accessible by design", d: "Large targets, readable type, keyboard support and reduced motion.", status: "Available", to: "/solutions" },
] as const;

function Platform() {
  return (
    <>
      <PageHero eyebrow="Platform" title="One place for guided exercise and movement insight">
        Clear labels show what works today and what's in development — no mockups dressed up as features.
      </PageHero>
      <section className="container-page grid gap-5 py-16 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.t} to={f.to} className="rounded-3xl border bg-card p-7 shadow-soft transition hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <f.icon className="size-7 text-primary" />
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${f.status === "Available" ? "bg-primary-soft text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{f.status}</span>
            </div>
            <h3 className="mt-5 text-xl">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </Link>
        ))}
      </section>
      <div className="container-page"><Button asChild variant="hero" size="lg"><Link to="/analyze">Try the analysis</Link></Button></div>
    </>
  );
}
