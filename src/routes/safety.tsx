import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Eye, Lock, UserCheck, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & Responsible AI — Physiomatics" },
      { name: "description", content: "How Physiomatics uses AI responsibly: on-device processing, confidence scores, clear limits and physiotherapist oversight." },
      { property: "og:title", content: "Safety & Responsible AI at Physiomatics" },
      { property: "og:description", content: "Honest limits, private by design, and always reviewed by a professional." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Safety,
});

const principles = [
  { icon: Lock, t: "Private by design", d: "Videos are analyzed in your browser. They are never uploaded to our servers." },
  { icon: Eye, t: "Confidence shown, always", d: "Every result has a confidence score. When the body isn't clearly visible, we show no numbers instead of guessing." },
  { icon: UserCheck, t: "A professional stays involved", d: "Results are estimates for you to discuss with your physiotherapist. They support care, never replace it." },
  { icon: AlertTriangle, t: "No diagnosis", d: "Physiomatics doesn't diagnose, treat or predict conditions, and it doesn't promise recovery." },
  { icon: Scale, t: "Honest about limits", d: "One camera can't measure true 3D angles. Lighting, clothing and camera angle all affect accuracy." },
  { icon: ShieldCheck, t: "Accessible and safe to use", d: "Large buttons, readable text, seated options and clear stop-if-pain guidance." },
];

function Safety() {
  return (
    <>
      <PageHero eyebrow="Trust" title="Safety and responsible AI">
        We'd rather show you nothing than show you a wrong number. Here's how we keep the technology honest.
      </PageHero>
      <section className="container-page grid gap-5 py-16 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((p) => (
          <div key={p.t} className="rounded-3xl border bg-card p-7 shadow-soft">
            <p.icon className="size-7 text-primary" />
            <h2 className="mt-5 text-xl">{p.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </section>
      <section className="container-page">
        <div className="rounded-3xl bg-primary-soft p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl">When to stop and get help</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Stop exercising if you feel sharp pain, dizziness, chest discomfort or breathlessness. This site is not for emergencies. Call your local emergency number if you need urgent help.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild><Link to="/privacy">Read our privacy policy</Link></Button>
            <Button asChild variant="outline"><Link to="/terms">Terms of use</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
