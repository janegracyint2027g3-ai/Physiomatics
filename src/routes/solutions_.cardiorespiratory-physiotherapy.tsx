import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("cardiorespiratory-physiotherapy")!;

export const Route = createFileRoute("/solutions_/cardiorespiratory-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Cardiorespiratory Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Breathing pattern retraining, airway clearance (ACBT), and supervised exercise tolerance for pulmonary and cardiac recovery." 
      },
      { property: "og:title", content: "Cardiorespiratory Physiotherapy Solutions — Physiomatics" },
      { property: "og:description", content: "Respiratory rehabilitation, breathing retraining, and exercise stamina guidance." },
    ],
  }),
  component: CardiorespiratoryPhysiotherapyPage,
});

function CardiorespiratoryPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
