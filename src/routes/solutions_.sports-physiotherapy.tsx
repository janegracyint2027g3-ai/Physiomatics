import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("sports-physiotherapy")!;

export const Route = createFileRoute("/solutions_/sports-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Sports Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Athletic injury rehabilitation, dynamic progressive loading, and objective return-to-sport evaluation with kinematic form validation." 
      },
      { property: "og:title", content: "Sports Physiotherapy Solutions — Physiomatics" },
      { property: "og:description", content: "High-performance athletic rehabilitation and return-to-play criteria tracking." },
    ],
  }),
  component: SportsPhysiotherapyPage,
});

function SportsPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
