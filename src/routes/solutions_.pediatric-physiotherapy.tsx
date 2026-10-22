import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("pediatric-physiotherapy")!;

export const Route = createFileRoute("/solutions_/pediatric-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Pediatric Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Gross motor development, pediatric coordination, play-based movement rehabilitation, and caregiver guidance for children." 
      },
      { property: "og:title", content: "Pediatric Physiotherapy Solutions — Physiomatics" },
      { property: "og:description", content: "Child-centered motor milestones and developmental physical therapy guidance." },
    ],
  }),
  component: PediatricPhysiotherapyPage,
});

function PediatricPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
