import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Physiomatics" },
      { name: "description", content: "From prescribed exercise to recorded video, in-browser pose analysis and progress review." },
      { property: "og:title", content: "How Physiomatics Works" },
      { property: "og:description", content: "Four steps from exercise to insight." },
    ],
  }),
  component: How,
});

const steps = [
  ["Select a prescribed exercise", "Choose the exercise your physiotherapist recommended. Each comes with camera setup instructions."],
  ["Record or upload a video", "Use your camera or upload a clip. You confirm consent before anything is processed."],
  ["AI analyzes supported movements", "MediaPipe Pose detects 33 landmarks per frame. We compute the relevant joint angle, smooth it and count repetitions with exercise-specific thresholds."],
  ["Check quality and confidence", "If landmarks aren't visible in enough frames, we tell you and show no metrics rather than guessing."],
  ["Review progress and consult", "Sessions are saved on your device so you can compare range and repetitions — and share them with your physiotherapist."],
];

function How() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Transparent, step by step" />
      <ol className="container-page grid gap-4 py-16">
        {steps.map(([t, d], i) => (
          <li key={t} className="grid gap-4 rounded-3xl border bg-card p-7 md:grid-cols-[6rem_1fr]">
            <div className="font-display text-5xl text-coral">0{i + 1}</div>
            <div><h2 className="text-2xl">{t}</h2><p className="mt-2 text-muted-foreground">{d}</p></div>
          </li>
        ))}
      </ol>
      <div className="container-page"><Button asChild variant="hero" size="lg"><Link to="/analyze">Try it now</Link></Button></div>
    </>
  );
}
