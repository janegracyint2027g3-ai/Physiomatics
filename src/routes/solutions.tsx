import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Physiomatics" },
      { name: "description", content: "Physiomatics workflows for elderly care, injury rehabilitation, physiotherapy clinics and education." },
      { property: "og:title", content: "Solutions — Physiomatics" },
      { property: "og:description", content: "Workflows for elderly care, rehab, clinics and educators." },
    ],
  }),
  component: Solutions,
});

const items = [
  { 
    t: "Elderly Care", 
    problem: "Home exercise programs are often abandoned due to complex interfaces, confusing instructions, or lack of support.",
    benefits: ["Accessible instructions with large controls.", "Seated exercises (e.g., knee extensions) designed for safety.", "Caregiver support tools for tracking progress."],
    workflow: "A caregiver can position the camera, read out the simple instructions, and help record the session. The app tracks the repetitions and angle without requiring complex interaction.",
    limitations: "Safety Note: Exercises must be chosen in consultation with a physiotherapist to ensure they are suitable for the individual's specific health conditions.",
    wa: "elderly"
  },
  { 
    t: "Injury Rehabilitation", 
    problem: "Patients recovering from injuries often struggle to know if they are following their prescribed routine correctly between clinic visits.",
    benefits: ["Follow your clinician-directed exercise program at home.", "Session review to see repetition counts.", "Comparable movement observations over time."],
    workflow: "Record your prescribed exercise using your device's camera. The system estimates your joint angles and logs the session so you can show your physiotherapist how your range of motion has changed.",
    limitations: "Safety Note: If you experience sharp pain at any point, stop immediately and seek professional advice. This tool does not diagnose injuries.",
    wa: "rehab"
  },
  { 
    t: "Physiotherapy Clinics", 
    problem: "Clinicians lack visibility into how patients are actually performing their exercises once they leave the clinic.",
    benefits: ["Visibility into home-exercise adherence.", "Comparable, exercise-specific metrics over time.", "Reduce time spent re-explaining proper form."],
    workflow: "Patients use the web platform to record their exercises. You can review their locally stored session histories during their next visit to make informed adjustments to their program.",
    limitations: "Limitation: Single-camera 2D pose estimation cannot measure true 3D joint angles and should not replace your professional clinical assessment.",
    wa: "clinic"
  },
  { 
    t: "Physiotherapy Education", 
    problem: "Educators need practical ways to demonstrate the mechanics of movement analysis and joint-angle concepts to students.",
    benefits: ["Demonstrate pose estimation on real video.", "Discuss the capabilities and limits of 2D estimation.", "Provide hands-on learning tools for students."],
    workflow: "Educators can record movements and immediately display the overlaid skeletal landmarks and estimated angles, helping students visualize biomechanics in real time.",
    limitations: "Note: For educational purposes only. Does not replace accredited clinical instruction tools.",
    wa: "education"
  },
] as const;

function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="Targeted workflows for every journey">
        Whether you're managing a clinic, recovering from an injury, or caring for an elderly family member, Physiomatics offers a structured approach to movement monitoring.
      </PageHero>
      <section className="container-page grid gap-8 py-16 md:grid-cols-2">
        {items.map((i) => (
          <article key={i.t} className="rounded-3xl border bg-card p-8 shadow-soft flex flex-col">
            <h2 className="text-3xl font-semibold mb-4">{i.t}</h2>
            
            <div className="mb-4 text-sm font-medium text-foreground/90">
              <strong>The Challenge:</strong> {i.problem}
            </div>

            <ul className="mb-6 grid gap-2 text-sm text-muted-foreground flex-1">
              {i.benefits.map((p) => <li key={p} className="flex gap-2 items-start"><span className="text-coral mt-1 text-xs">●</span><span>{p}</span></li>)}
            </ul>

            <div className="mb-4 text-sm bg-accent/50 p-4 rounded-xl">
              <strong>How it works:</strong> {i.workflow}
            </div>

            <div className="mb-6 text-xs text-muted-foreground italic border-l-2 border-coral pl-3 py-1">
              {i.limitations}
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t">
              <Button asChild><Link to="/contact">Talk to Us</Link></Button>
              <Button asChild variant="whatsapp"><a href={whatsappLink(WA_MESSAGES[i.wa])} target="_blank" rel="noreferrer">WhatsApp (7845072426)</a></Button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
