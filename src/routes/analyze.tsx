import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PoseAnalyzer } from "@/components/analyze/PoseAnalyzer";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "AI Video Analytics — Physiomatics" },
      { name: "description", content: "Record or upload an exercise video and get estimated joint angles, repetition counts and confidence — processed privately in your browser." },
      { property: "og:title", content: "AI Video Analytics — Physiomatics" },
      { property: "og:description", content: "In-browser pose estimation for squats, knee extensions and arm raises." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  return (
    <>
      <PageHero eyebrow="AI video analytics" title="Analyze an exercise video">
        A real pose-estimation model detects body landmarks, estimates joint angles and counts repetitions. Everything runs on your device.
      </PageHero>
      <div className="container-page -mt-8 md:-mt-12">
        <PoseAnalyzer />
      </div>
    </>
  );
}
