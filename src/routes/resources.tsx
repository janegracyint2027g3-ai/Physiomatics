import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/site/PageHero";
import { EXERCISES } from "@/lib/movement";
import { FAQS } from "@/lib/faq";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Exercise Library & FAQ — Physiomatics" },
      { name: "description", content: "Supported exercises, recording guidance and answers about privacy, accuracy and physiotherapist involvement." },
      { property: "og:title", content: "Resources — Physiomatics" },
      { property: "og:description", content: "Exercise library, recording tips and FAQ." },
    ],
  }),
  component: Resources,
});

function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Exercise library & guidance" />
      <section className="container-page grid gap-5 py-16 md:grid-cols-3">
        {Object.values(EXERCISES).map((e) => (
          <article key={e.id} className="rounded-3xl border bg-card p-7 shadow-soft">
            <h2 className="text-2xl">{e.name}</h2>
            <div className="mt-2 text-xs font-semibold text-primary">Measures: {e.jointLabel} · {e.camera}</div>
            <p className="mt-3 text-sm text-muted-foreground">{e.instructions}</p>
            <Link to="/analyze" className="mt-4 inline-block text-sm font-semibold text-primary">Analyze this exercise →</Link>
          </article>
        ))}
      </section>
      <section className="container-page max-w-3xl py-8">
        <h2 className="text-3xl">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
