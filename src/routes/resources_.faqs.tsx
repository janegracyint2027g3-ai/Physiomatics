import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FAQS } from "@/lib/faq";

export const Route = createFileRoute("/resources_/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Physiomatics" },
    ],
  }),
  component: FAQsPage,
});

function FAQsPage() {
  return (
    <>
      <PageHero eyebrow="FAQs" title="Frequently Asked Questions.">
        Find answers about privacy, accuracy, supported exercises, and getting started.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto">
        <Accordion type="multiple" className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left text-lg font-semibold">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
