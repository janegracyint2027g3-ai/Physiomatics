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

const contentBlocks = [
  {
    t: "Our Mission & Product Purpose",
    d: "Our mission is to help people move better, recover smarter, and age stronger. Physiomatics is designed as a communication and monitoring tool that connects online physiotherapy training with AI-assisted movement observations."
  },
  {
    t: "Our Vision",
    d: "We envision a future where individuals recovering from injuries or managing age-related mobility issues have the support they need at home, and physiotherapists have the reliable, longitudinal data they need to make informed decisions."
  },
  {
    t: "Commitment to Physiotherapist Involvement",
    d: "Physiomatics supports physiotherapists. It does not replace them. We do not provide automated diagnoses, create personalized treatment plans, or guarantee medical recovery. Exercises should always be prescribed by a licensed professional."
  },
  {
    t: "Responsible Use of AI",
    d: "We use MediaPipe Pose estimation to identify 33 skeletal landmarks. This 2D estimation provides helpful approximations of joint angles and repetition counts, but it is not 100% accurate. We openly display confidence levels and deliberately hide metrics when visibility is poor rather than guessing."
  },
  {
    t: "User Privacy",
    d: "Your videos belong to you. Our current analysis pipeline runs entirely inside your browser. Video streams are processed locally and are never uploaded to a server. Your session summaries are saved locally on your device and can be cleared at any time."
  },
  {
    t: "Accessibility",
    d: "We design for the people who need this most. This means large touch targets, readable typography, support for keyboard navigation, and explicit respect for reduced-motion settings in the operating system."
  }
];

function About() {
  return (
    <>
      <PageHero eyebrow="About" title="Move better. Recover smarter. Age stronger.">
        Physiomatics combines physiotherapy education with AI-assisted movement monitoring, so people can follow prescribed exercises and understand their progress over time.
      </PageHero>
      <section className="container-page grid gap-6 py-16 md:grid-cols-2">
        {contentBlocks.map((block) => (
          <div key={block.t} className="rounded-3xl border bg-card p-8 shadow-soft">
            <h2 className="text-2xl font-semibold">{block.t}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{block.d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
