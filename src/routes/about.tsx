import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Privacy — Physiomatics" },
      { name: "description", content: "Our mission, responsible AI principles and how Physiomatics handles your videos and data." },
      { property: "og:title", content: "About Physiomatics" },
      { property: "og:description", content: "Responsible, privacy-first movement monitoring." },
    ],
  }),
  component: About,
});

const principles = [
  ["Support, not replace", "Physiomatics supports physiotherapists. It does not diagnose, treat or guarantee recovery."],
  ["Honest metrics", "We show estimates with confidence levels, and nothing at all when the video can't be measured reliably."],
  ["Privacy first", "Videos on this site are processed in your browser and never uploaded. Session summaries stay on your device and can be cleared at any time."],
  ["Accessible", "Designed for older adults: readable text, large controls, keyboard support and reduced-motion respect."],
];

function About() {
  return (
    <>
      <PageHero eyebrow="About" title="Move better. Recover smarter. Age stronger.">
        Physiomatics combines physiotherapy education with AI-assisted movement monitoring, so people can follow prescribed exercises and understand their progress over time.
      </PageHero>
      <section className="container-page grid gap-5 py-16 md:grid-cols-2">
        {principles.map(([t, d]) => (
          <div key={t} className="rounded-3xl border bg-card p-8">
            <h2 className="text-2xl">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
