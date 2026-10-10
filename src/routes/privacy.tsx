import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Physiomatics" },
      { name: "description", content: "How Physiomatics handles enquiries and exercise videos. Videos are analyzed in your browser and never uploaded." },
      { property: "og:title", content: "Physiomatics Privacy Policy" },
      { property: "og:description", content: "Videos stay on your device. Enquiries are stored securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage eyebrow="Privacy" title="Privacy policy" intro="We collect as little as possible and keep your exercise videos on your own device." sections={[
      { h: "Exercise videos", p: ["Videos you record or upload on the analysis page are processed entirely in your browser. They are not uploaded to our servers.", "Session summaries (repetitions, angles, confidence) are saved only in your browser's local storage. Clearing your browser data removes them."] },
      { h: "Enquiry forms", p: ["When you submit a form we store the details you enter (such as name, contact details, organization and message) so we can respond. Please don't include detailed medical history.", "Your enquiry is also opened in WhatsApp so you can send it; messages sent through WhatsApp are subject to WhatsApp's own privacy terms."] },
      { h: "How we use your information", p: ["Only to reply to your enquiry, arrange demos and share relevant information about Physiomatics. We do not sell your information."] },
      { h: "Your choices", p: ["You can ask us to view, correct or delete the enquiry details we hold by contacting us through the Book a Demo page or WhatsApp."] },
    ]} />
  ),
});
