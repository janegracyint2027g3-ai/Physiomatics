import { createFileRoute } from "@tanstack/react-router";
import { SolutionDetailTemplate } from "@/components/site/SolutionDetailTemplate";
import { getSolutionBySlug } from "@/data/physiotherapySolutions";

const solution = getSolutionBySlug("womens-health-physiotherapy")!;

export const Route = createFileRoute("/solutions_/womens-health-physiotherapy")({
  head: () => ({
    meta: [
      { title: "Women's Health Physiotherapy Solutions — Physiomatics" },
      { 
        name: "description", 
        content: "Pelvic floor rehabilitation, pregnancy-related mobility, diastasis recti recovery, and postnatal wellness with clinical privacy." 
      },
      { property: "og:title", content: "Women's Health Physiotherapy — Physiomatics" },
      { property: "og:description", content: "Evidence-informed pelvic health, prenatal, and postpartum rehabilitation guidance." },
    ],
  }),
  component: WomensHealthPhysiotherapyPage,
});

function WomensHealthPhysiotherapyPage() {
  return <SolutionDetailTemplate solution={solution} />;
}
