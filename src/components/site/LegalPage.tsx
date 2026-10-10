import { PageHero } from "@/components/site/PageHero";

export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>{intro}</PageHero>
      <div className="container-page max-w-3xl py-12">
        {sections.map((s) => (
          <section key={s.h} className="mt-10 first:mt-0">
            <h2 className="text-2xl">{s.h}</h2>
            {s.p.map((p) => <p key={p} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}
          </section>
        ))}
        <p className="mt-12 text-sm text-muted-foreground">Last updated: October 2026</p>
      </div>
    </>
  );
}
