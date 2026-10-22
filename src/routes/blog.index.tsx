import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ARTICLES, type Article } from "@/lib/articles";
import { Clock, Calendar, ArrowRight, BookOpen, Sparkles, Filter, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Clinical Insights & Movement Blog — Physiomatics" },
      { name: "description", content: "Evidence-informed physiotherapy articles, home exercise guidelines, clinical computer vision insights, and elderly care strategies." },
      { property: "og:title", content: "Physiomatics Clinical Movement Blog" },
      { property: "og:description", content: "Evidence-based guides for patients, caregivers, and modern physiotherapy clinics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogIndex,
});

const CATEGORIES = ["All", "Elderly care", "Rehabilitation", "Clinics", "Technology"] as const;

function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredArticles = selectedCategory === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <>
      <PageHero 
        eyebrow="Clinical Movement Intelligence Blog" 
        title="Guides for Moving Better & Recovering Smarter"
      >
        Evidence-informed articles, practical setup checklists, and ethical biomechanics insights written for patients, caregivers, and rehabilitation clinics.
      </PageHero>

      {/* Category Filter Pills */}
      <section className="container-page pt-10 pb-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1.5">
            <Filter className="size-3.5 text-primary" /> Filter Topic:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-page grid gap-6 py-8 md:grid-cols-2">
        {filteredArticles.map((a) => (
          <article 
            key={a.slug} 
            className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-soft transition-all hover:border-primary/40 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-4">
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-semibold text-primary">
                  {a.category}
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-muted-foreground/70" /> {a.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-muted-foreground/70" /> {a.readMins} min read
                  </span>
                </div>
              </div>

              <Link to="/blog/$slug" params={{ slug: a.slug }}>
                <h2 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {a.title}
                </h2>
              </Link>

              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {a.excerpt}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="size-3.5 text-primary" /> Educational Reference
              </span>
              <Link 
                to="/blog/$slug" 
                params={{ slug: a.slug }} 
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
              >
                Read Article <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Clinical Guidance CTA Banner */}
      <section className="container-page py-12">
        <div className="rounded-3xl bg-primary-soft border border-primary/20 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Clinical Disclaimer & Inquiries</span>
            <h3 className="mt-1 text-2xl font-serif">Have a specific clinical movement question?</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Articles published on Physiomatics provide general educational biomechanics guidance and do not constitute formal medical diagnoses. For individual musculoskeletal assessments, our licensed physiotherapy team is available for direct consultation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild size="sm">
              <Link to="/contact/consultation">Book Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/safety">Read Safety Protocols</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
