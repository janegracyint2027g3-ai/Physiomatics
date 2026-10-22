import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("neurological-physiotherapy")!;

export const Route = createFileRoute("/solutions_/neurological-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Neurological Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Movement retraining, balance recovery, and functional independence for stroke, Parkinson's disease, and neurological conditions." 
      },
      { property: "og:title", content: "Neurological Physiotherapy Solutions — Physiomatics" },
      { property: "og:description", content: "Neuroplasticity-informed balance and gait rehabilitation with objective visual telemetry." },
    ],
  }),
  component: NeurologicalPhysiotherapyPage,
});

function NeurologicalPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
