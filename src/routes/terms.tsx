import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Physiomatics" },
      { name: "description", content: "Terms for using the Physiomatics website and in-browser movement analysis. Not a medical device or diagnostic tool." },
      { property: "og:title", content: "Physiomatics Terms of Use" },
      { property: "og:description", content: "Exercise guidance and movement estimates — not medical advice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage eyebrow="Terms" title="Terms of use" intro="Please read these terms before using the site or the video analysis." sections={[
      { h: "Not medical advice", p: ["Physiomatics provides exercise guidance and estimated movement measurements. It does not diagnose, treat or prevent any condition and does not replace a qualified physiotherapist or doctor.", "This site is not for emergencies. If you feel unwell, call your local emergency number."] },
      { h: "Estimates only", p: ["Joint angles and repetition counts come from a single camera and are estimates. Accuracy depends on lighting, camera angle, clothing and visibility. Discuss results with your clinician."] },
      { h: "Exercise safely", p: ["Only perform exercises recommended for you by a professional. Stop if you feel pain, dizziness or breathlessness."] },
      { h: "Use of the site", p: ["Don't misuse the site, attempt to disrupt it, or submit false enquiries. Content on this site may be updated without notice."] },
    ]} />
  ),
});
