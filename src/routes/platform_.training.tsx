import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { BookOpen, Video, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/platform_/training")({
  head: () => ({
    meta: [
      { title: "Learn Movement. Understand Rehabilitation. — Physiomatics" },
      { name: "description", content: "Educational resources for learning physiotherapy exercises, understanding body positioning, and safe movement mechanics." },
      { property: "og:title", content: "Physiotherapy Training Resources" },
      { property: "og:description", content: "Educational resources for patients and students." },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  return (
    <>
      <PageHero eyebrow="Physiotherapy Training" title="Learn Movement. Understand Rehabilitation.">
        Explore exercise demonstrations, understand body mechanics, and build confidence in your rehabilitation journey with safe, structured learning resources.
      </PageHero>

      <section className="container-page py-16 grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight mb-6">The foundation of effective recovery</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Proper rehabilitation starts with understanding the movement. Our platform provides structured educational resources designed to help patients understand their prescribed exercises and help students visualize clinical mechanics.
          </p>

          <div className="relative animate-rise my-10 not-prose">
            <div className="absolute -inset-4 bg-gradient-to-bl from-primary/20 to-coral/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80" 
              alt="Physiotherapy training and movement" 
              className="relative rounded-3xl object-cover shadow-2xl border border-border aspect-[21/9] w-full"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Video className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exercise Demonstrations</h3>
              <p className="text-sm text-muted-foreground">Clear video instructions and textual guides demonstrating proper body positioning and expected movement patterns.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <BookOpen className="size-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Biomechanics Concepts</h3>
              <p className="text-sm text-muted-foreground">Accessible explanations of joint angles, movement planes, and the terminology used by physiotherapy professionals.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Safe Learning Practices</h3>
          <p className="mb-6">
            While our resources help you visualize and practice movements, they are not a substitute for professional clinical instruction. Always ensure that:
          </p>
          <ul className="grid gap-3 mb-8">
            <li className="flex gap-3"><ShieldCheck className="size-5 text-coral shrink-0" /> You only perform exercises specifically prescribed by your physiotherapist.</li>
            <li className="flex gap-3"><ShieldCheck className="size-5 text-coral shrink-0" /> You stop immediately if you experience sharp pain or discomfort.</li>
            <li className="flex gap-3"><ShieldCheck className="size-5 text-coral shrink-0" /> You confirm your setup and environment are safe before beginning.</li>
          </ul>

          <div className="rounded-2xl bg-accent/50 p-6 border-l-4 border-primary">
            <div className="flex items-center gap-3 font-semibold mb-2">
              <GraduationCap className="size-5" /> Professional Disclosure
            </div>
            <p className="text-sm m-0">Physiomatics is an educational monitoring tool. It is not an accredited medical training course or certification provider. These materials supplement professional care.</p>
          </div>
        </div>

        <aside className="grid gap-6 sticky top-24">
          <div className="rounded-3xl bg-primary-soft p-6">
            <h3 className="font-semibold text-lg mb-2">Ready to apply your knowledge?</h3>
            <p className="text-sm text-muted-foreground mb-6">Use our AI tools to practice what you've learned and track your form.</p>
            <Button asChild className="w-full justify-between" variant="hero">
              <Link to="/analyze">Try Video Analysis <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="block mb-1">Is this an accredited course?</strong>
                <span className="text-muted-foreground">No. This is supplementary educational material for patients and students.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Who created these exercises?</strong>
                <span className="text-muted-foreground">The library contains standard movements commonly prescribed in clinical settings, modeled for AI compatibility.</span>
              </div>
              <hr />
              <div>
                <strong className="block mb-1">Should I try all the exercises?</strong>
                <span className="text-muted-foreground">No. Only attempt exercises explicitly prescribed for your specific condition by a licensed professional.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t bg-muted/30 py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Continue your journey</h2>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg"><Link to="/resources">Explore Training Resources</Link></Button>
        </div>
      </section>
    </>
  );
}
