import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Physiomatics" },
      { name: "description", content: "From prescribed exercise to recorded video, in-browser pose analysis and progress review." },
      { property: "og:title", content: "How Physiomatics Works" },
      { property: "og:description", content: "Nine clear steps from exercise to insight." },
    ],
  }),
  component: How,
});

const steps = [
  {
    t: "1. Selecting an exercise",
    expl: "Begin by selecting an exercise that your physiotherapist has prescribed for your routine.",
    action: "You choose an exercise from the library.",
    response: "The app displays camera setup instructions specifically tailored for that movement.",
    req: "You must only perform exercises appropriate for your condition."
  },
  {
    t: "2. Recording a video",
    expl: "Set up your camera according to the instructions to capture your full range of motion.",
    action: "You record a short video of yourself performing the exercise, or upload an existing clip.",
    response: "The app loads the video locally without uploading it.",
    req: "Good lighting and a clear view of your body are required."
  },
  {
    t: "3. Browser-based pose estimation",
    expl: "Our platform uses on-device artificial intelligence to identify key skeletal landmarks.",
    action: "You initiate the analysis.",
    response: "MediaPipe Pose runs inside your browser, plotting 33 landmarks onto your recorded video.",
    req: "The AI cannot 'see' through baggy clothing or furniture."
  },
  {
    t: "4. Exercise-specific measurement",
    expl: "The system computes the angle of the joints relevant to the selected exercise.",
    action: "You wait a few moments while processing completes.",
    response: "The app overlays the estimated joint angle and counts your repetitions.",
    req: "Movement tracking provides estimates, not definitive clinical measurements."
  },
  {
    t: "5. Reliability checks",
    expl: "The system constantly checks if your joints are visible enough to provide a reliable estimate.",
    action: "You review the system's confidence score.",
    response: "If visibility is too low, the app skips measurement for those frames rather than guessing.",
    req: "If confidence is low, you should re-record the video."
  },
  {
    t: "6. Reviewing session results",
    expl: "After processing, you receive a concise summary of your performance.",
    action: "You review your repetition count, duration, and range of motion.",
    response: "The app presents a detailed but easy-to-read session summary.",
    req: "Remember that high AI confidence does not guarantee clinical correctness."
  },
  {
    t: "7. Comparing stored session history",
    expl: "Over time, you can see how your movement range and consistency have changed.",
    action: "You visit the dashboard to view past sessions.",
    response: "The app renders graphs of your historical performance.",
    req: "Comparisons only work when the camera setup remains consistent across sessions."
  },
  {
    t: "8. Discussing results with a physiotherapist",
    expl: "Physiomatics is a communication tool, designed to help you and your clinician.",
    action: "You share your stored session data with your physiotherapist.",
    response: "The app provides export or direct-review capabilities for clinics.",
    req: "A physiotherapist is necessary to correctly interpret the data."
  },
  {
    t: "9. Privacy and data handling",
    expl: "We prioritize your privacy above all else. Your videos stay on your device.",
    action: "You control your stored data.",
    response: "The app processes video locally and saves session data to your browser's local storage.",
    req: "If you clear your browser data, your session history will be deleted."
  }
];

function How() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Transparent, step by step">
        A detailed look at how Physiomatics guides you from exercise to insight securely within your browser.
      </PageHero>
      <div className="container-page grid gap-6 py-16">
        {steps.map((step, i) => (
          <article key={step.t} className="rounded-3xl border bg-card p-7 shadow-soft grid md:grid-cols-[200px_1fr] gap-6 items-start">
            <h2 className="text-xl font-semibold text-primary">{step.t}</h2>
            <div className="grid gap-3">
              <p className="text-foreground text-lg">{step.expl}</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-accent/50 p-4 rounded-xl text-sm">
                  <span className="block font-semibold mb-1">Your Action:</span>
                  {step.action}
                </div>
                <div className="bg-primary-soft p-4 rounded-xl text-sm text-accent-foreground">
                  <span className="block font-semibold mb-1">App Response:</span>
                  {step.response}
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground border-l-2 border-coral pl-3 py-1">
                <strong>Limitation/Requirement:</strong> {step.req}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="container-page pb-16 flex justify-center">
        <Button asChild variant="hero" size="lg"><Link to="/analyze">Try the video analysis</Link></Button>
      </div>
    </>
  );
}
