import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

type Node = { text: string; options: { label: string; next?: string; to?: string; wa?: keyof typeof WA_MESSAGES }[] };

const tree: Record<string, Node> = {
  start: {
    text: "Hi! I'm the Physiomatics guide. I can't give medical advice, but I can help you find the right part of the platform. Who are you here for?",
    options: [
      { label: "I'm a physiotherapist / clinic", next: "clinic" },
      { label: "An elderly family member", next: "elderly" },
      { label: "My own injury recovery", next: "rehab" },
      { label: "Education / teaching", next: "education" },
    ],
  },
  clinic: {
    text: "Physiomatics helps you review home-exercise videos with landmark detection, joint angles and rep counts, then compare sessions over time.",
    options: [{ label: "Try the video analysis", to: "/analyze" }, { label: "Book a demo", to: "/contact" }, { label: "Chat on WhatsApp", wa: "clinic" }],
  },
  elderly: {
    text: "We focus on simple, large controls and seated exercises such as knee extensions. Exercises should always be chosen with a physiotherapist.",
    options: [{ label: "See elderly care", to: "/solutions" }, { label: "Ask a question", to: "/contact" }, { label: "Chat on WhatsApp", wa: "elderly" }],
  },
  rehab: {
    text: "You can record a prescribed exercise, see estimated joint angles and reps, and share progress with your physiotherapist. If you feel sharp pain, stop and contact a professional.",
    options: [{ label: "Analyze a video", to: "/analyze" }, { label: "How it works", to: "/how-it-works" }, { label: "Chat on WhatsApp", wa: "rehab" }],
  },
  education: {
    text: "Educators use Physiomatics to demonstrate movement analysis and joint-angle concepts with real video.",
    options: [{ label: "Explore resources", to: "/resources" }, { label: "Partner with us", to: "/contact" }, { label: "Chat on WhatsApp", wa: "education" }],
  },
};

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState("start");
  const n = tree[node];
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div role="dialog" aria-label="Physiomatics assistant" className="w-[min(22rem,calc(100vw-2.5rem))] rounded-3xl border bg-card p-5 shadow-lift animate-rise">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold"><Bot className="size-5 text-primary" /> Guide</div>
            <button aria-label="Close assistant" onClick={() => setOpen(false)}><X className="size-5" /></button>
          </div>
          <p className="text-sm leading-relaxed">{n.text}</p>
          <div className="mt-4 grid gap-2">
            {n.options.map((o) =>
              o.next ? (
                <Button key={o.label} variant="outline" className="justify-start" onClick={() => setNode(o.next!)}>{o.label}</Button>
              ) : o.to ? (
                <Button key={o.label} asChild variant="outline" className="justify-start"><Link to={o.to as "/"} onClick={() => setOpen(false)}>{o.label}</Link></Button>
              ) : (
                <Button key={o.label} asChild variant="whatsapp" className="justify-start"><a href={whatsappLink(WA_MESSAGES[o.wa!])} target="_blank" rel="noreferrer">{o.label}</a></Button>
              ),
            )}
            {node !== "start" && <button className="mt-1 text-xs text-muted-foreground underline" onClick={() => setNode("start")}>Start over</button>}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift">
          <MessageCircle />
        </a>
        <button onClick={() => setOpen((o) => !o)} aria-label="Open assistant" aria-expanded={open} className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift">
          <Bot />
        </button>
      </div>
    </div>
  );
}
