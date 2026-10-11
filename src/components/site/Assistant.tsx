import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { MessageCircle, X, Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const location = useLocation();
  const [node, setNode] = useState("start");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{type: 'user' | 'bot', text: string}[]>([]);

  // Context-specific behavior based on navigation
  useEffect(() => {
    let nextNode = "start";
    if (location.pathname.includes("/analyze")) {
      nextNode = "clinic";
      if (!open) setTimeout(() => setOpen(true), 2000);
    } else if (location.pathname.includes("/solutions")) {
      nextNode = "elderly";
      if (!open) setTimeout(() => setOpen(true), 2000);
    } else if (location.pathname.includes("/resources")) {
      nextNode = "education";
    }
    setNode(nextNode);
  }, [location.pathname, open]);

  // When node changes, reset messages to just show the node text
  useEffect(() => {
    const n = tree[node] || tree["start"];
    setMessages([{ type: 'bot', text: n.text }]);
  }, [node]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
    setInputValue("");
    
    // Simulate a simple bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: "Thanks for your message. Since I'm a simple guide, please select one of the options below or contact us on WhatsApp." }]);
    }, 1000);
  };

  const n = tree[node] || tree["start"];

  return (
    <>
      {/* WhatsApp Left Side */}
      <div className="fixed bottom-5 left-5 z-50">
        <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift hover:scale-105 transition-transform">
          <MessageCircle className="size-6" />
        </a>
      </div>

      {/* Assistant Right Side */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <div role="dialog" aria-label="Physiomatics assistant" className="w-[min(22rem,calc(100vw-2.5rem))] rounded-3xl border bg-card p-5 shadow-lift animate-rise flex flex-col max-h-[80vh]">
            <div className="mb-3 flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2 font-semibold"><Bot className="size-5 text-primary" /> Guide</div>
              <button aria-label="Close assistant" onClick={() => setOpen(false)}><X className="size-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 text-sm flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${msg.type === 'bot' ? 'bg-muted rounded-tl-sm self-start' : 'bg-primary text-primary-foreground rounded-tr-sm self-end'}`}>
                  {msg.text}
                </div>
              ))}
              
              {/* Options always appear after messages */}
              <div className="mt-4 grid gap-2">
                {n.options.map((o) =>
                  o.next ? (
                    <Button key={o.label} variant="outline" className="justify-start text-xs h-9" onClick={() => setNode(o.next!)}>{o.label}</Button>
                  ) : o.to ? (
                    <Button key={o.label} asChild variant="outline" className="justify-start text-xs h-9"><Link to={o.to as "/"} onClick={() => setOpen(false)}>{o.label}</Link></Button>
                  ) : (
                    <Button key={o.label} asChild variant="whatsapp" className="justify-start text-xs h-9"><a href={whatsappLink(WA_MESSAGES[o.wa!])} target="_blank" rel="noreferrer">{o.label}</a></Button>
                  ),
                )}
                {node !== "start" && <button className="mt-2 text-xs text-muted-foreground underline hover:text-primary transition-colors text-center w-full" onClick={() => setNode("start")}>Start over</button>}
              </div>
            </div>

            <form onSubmit={handleSend} className="flex gap-2 items-center pt-3 border-t">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="h-9 text-xs rounded-full"
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        )}
        <button onClick={() => setOpen((o) => !o)} aria-label="Open assistant" aria-expanded={open} className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift hover:scale-105 transition-transform">
          {open ? <X className="size-6" /> : <Bot className="size-6" />}
        </button>
      </div>
    </>
  );
}
