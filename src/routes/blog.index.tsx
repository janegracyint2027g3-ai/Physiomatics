import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ARTICLES } from "@/lib/articles";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Physiomatics" },
      { name: "description", content: "Practical guides on home exercise, elderly care, injury rehabilitation and responsible movement analysis." },
      { property: "og:title", content: "Physiomatics Blog" },
      { property: "og:description", content: "Guides for patients, caregivers and physiotherapists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Guides for moving better and recovering smarter">
        Plain-language articles for patients, caregivers and physiotherapists. General information only — always follow your own clinician's advice.
      </PageHero>
      <section className="container-page grid gap-5 py-16 md:grid-cols-2">
        {ARTICLES.map((a) => (
          <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="group rounded-3xl border bg-card p-7 shadow-soft transition hover:-translate-y-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary-soft px-3 py-1 font-semibold text-accent-foreground">{a.category}</span>
              <span>{a.readMins} min read</span>
            </div>
            <h2 className="mt-4 text-2xl group-hover:text-primary">{a.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{a.excerpt}</p>
            <div className="mt-5 text-sm font-semibold text-primary">Read article →</div>
          </Link>
        ))}
      </section>
    </>
  );
}
