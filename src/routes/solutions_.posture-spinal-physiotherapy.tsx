import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("posture-spinal-physiotherapy")!;

export const Route = createFileRoute("/solutions_/posture-spinal-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Posture and Spinal Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Mechanical neck pain relief, lumbar stabilization, posture assessment, and spinal functional mobility." 
      },
      { property: "og:title", content: "Posture and Spinal Physiotherapy — Physiomatics" },
      { property: "og:description", content: "Spine, neck, and core rehabilitation with posture alignment telemetry." },
    ],
  }),
  component: PostureSpinalPhysiotherapyPage,
});

function PostureSpinalPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
