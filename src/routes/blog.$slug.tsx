import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ARTICLES, getArticle } from "@/lib/articles";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found — Physiomatics" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — Physiomatics` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl">Article not found</h1>
      <Button asChild className="mt-6"><Link to="/blog">Back to the blog</Link></Button>
    </div>
  );
}

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 2);
  return (
    <article>
      <header className="bg-hero">
        <div className="container-page max-w-3xl py-20 animate-rise">
          <Link to="/blog" className="text-sm font-semibold text-primary">← All articles</Link>
          <div className="mt-6 eyebrow">{a.category} · {a.readMins} min read</div>
          <h1 className="mt-4 text-4xl md:text-5xl">{a.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{a.excerpt}</p>
        </div>
      </header>
      <div className="container-page max-w-3xl py-12">
        {a.sections.map((s) => (
          <section key={s.h} className="mt-10 first:mt-0">
            <h2 className="text-2xl md:text-3xl">{s.h}</h2>
            {s.p.length > 1 ? (
              <ul className="mt-4 grid list-disc gap-2 pl-6 text-lg leading-relaxed">{s.p.map((p) => <li key={p}>{p}</li>)}</ul>
            ) : (
              <p className="mt-4 text-lg leading-relaxed">{s.p[0]}</p>
            )}
          </section>
        ))}
        <p className="mt-12 rounded-2xl bg-muted p-5 text-sm text-muted-foreground">This article is general information, not medical advice. Speak to a qualified physiotherapist or doctor about your situation.</p>
        <div className="mt-10 rounded-3xl bg-primary p-8 text-primary-foreground">
          <h2 className="text-2xl">See your own movement</h2>
          <p className="mt-2 opacity-90">Try the in-browser video analysis or book a demo for your clinic.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="hero"><Link to="/analyze">Try the analysis</Link></Button>
            <Button asChild variant="secondary"><Link to="/contact">Book a demo</Link></Button>
          </div>
        </div>
        <h2 className="mt-16 text-2xl">Keep reading</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {more.map((m) => (
            <Link key={m.slug} to="/blog/$slug" params={{ slug: m.slug }} className="rounded-2xl border bg-card p-5 hover:-translate-y-0.5 transition">
              <div className="text-xs text-muted-foreground">{m.category}</div>
              <div className="mt-2 font-semibold">{m.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
