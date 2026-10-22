import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("geriatric-physiotherapy")!;

export const Route = createFileRoute("/solutions_/geriatric-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Geriatric Physiotherapy & Fall Prevention — Physiomatics" },
      { 
        name: "description", 
        content: "Age-appropriate mobility preservation, fall risk reduction, seated exercises, and everyday functional confidence for older adults." 
      },
      { property: "og:title", content: "Geriatric Physiotherapy Solutions — Physiomatics" },
      { property: "og:description", content: "Safe mobility, balance training, and senior rehabilitation protocols." },
    ],
  }),
  component: GeriatricPhysiotherapyPage,
});

function GeriatricPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
