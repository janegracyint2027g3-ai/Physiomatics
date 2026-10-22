import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("orthopedic-physiotherapy")!;

export const Route = createFileRoute("/solutions_/orthopedic-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Orthopedic Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Joint mobility restoration, musculoskeletal injury rehabilitation, and structured post-operative protocols for TKA, ACL, and rotator cuff recovery." 
      },
      { property: "og:title", content: "Orthopedic Physiotherapy Solutions — Physiomatics" },
      { property: "og:description", content: "Evidence-informed movement guidance for orthopedic and post-operative recovery." },
    ],
  }),
  component: OrthopedicPhysiotherapyPage,
});

function OrthopedicPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
