import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Physiomatics" },
      { name: "description", content: "Physiomatics for elderly care, injury rehabilitation, physiotherapy clinics and education." },
      { property: "og:title", content: "Solutions — Physiomatics" },
      { property: "og:description", content: "Workflows for elderly care, rehab, clinics and educators." },
    ],
  }),
  component: Solutions,
});

const items = [
  { t: "Elderly Care", wa: "elderly", points: ["Seated exercises such as knee extensions", "Large, high-contrast controls and plain language", "Caregivers can help record and review progress", "Exercises chosen with a physiotherapist — not every exercise suits everyone"] },
  { t: "Injury Rehabilitation", wa: "rehab", points: ["Follow a prescribed home program between visits", "Track movement range across sessions", "Stop and seek help if pain occurs"] },
  { t: "Physiotherapy Clinics", wa: "clinic", points: ["Visibility into home-exercise performance", "Comparable, exercise-specific metrics", "Less time re-explaining exercises"] },
  { t: "Physiotherapy Education", wa: "education", points: ["Demonstrate joint-angle estimation on real video", "Discuss limits of 2D pose estimation", "Hands-on learning for students"] },
] as const;

function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="Different journeys, one careful approach" />
      <section className="container-page grid gap-6 py-16 md:grid-cols-2">
        {items.map((i) => (
          <article key={i.t} className="rounded-3xl border bg-card p-8 shadow-soft">
            <h2 className="text-3xl">{i.t}</h2>
            <ul className="mt-5 grid gap-2 text-muted-foreground">
              {i.points.map((p) => <li key={p} className="flex gap-2"><span className="text-coral">●</span>{p}</li>)}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild><Link to="/contact">Talk to us</Link></Button>
              <Button asChild variant="whatsapp"><a href={whatsappLink(WA_MESSAGES[i.wa])} target="_blank" rel="noreferrer">WhatsApp</a></Button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
