import { CheckCircle2 } from "lucide-react";
import { SectionHead } from "./PageHero";

const useCases = [
  {
    type: "Illustrative Use Case: Clinical Review",
    role: "Physiotherapist Workflow",
    text: "A clinician prescribes a seated knee extension for an elderly patient. Between visits, the patient uses Physiomatics at home. During the next appointment, the clinician reviews the locally saved session summary to verify adherence and range of motion estimates.",
  },
  {
    type: "Illustrative Use Case: Independent Rehab",
    role: "Patient Workflow",
    text: "An individual recovering from a shoulder injury performs daily arm raises. They use their laptop camera to record the session. The browser-based AI counts their repetitions and stores the summary locally, helping them stick to the routine.",
  },
  {
    type: "Illustrative Use Case: Education",
    role: "Student Workflow",
    text: "A physiotherapy student records a peer performing a bodyweight squat. They use the platform's visual overlay to study the estimated hip and knee angles, comparing the AI's measurements with their own clinical observations.",
  },
];

export function Testimonials() {
  return (
    <section className="container-page py-24">
      <SectionHead eyebrow="How it's used" title="Example Workflows" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {useCases.map((t) => (
          <div key={t.role} className="rounded-3xl border bg-card p-6 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-4 items-center text-primary text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="size-4" />
                {t.type}
              </div>
              <p className="text-muted-foreground leading-relaxed">{t.text}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="font-semibold text-sm">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
