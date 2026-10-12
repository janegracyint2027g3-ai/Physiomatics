/**
 * IcpLeadForm – compact inline lead capture used in ICP page sidebars.
 * Centralized through Vercel Serverless Lead Engine (/api/leads) which
 * coordinates Jira, Google Sheets, Airtable, and Telegram delivery.
 */
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { whatsappLink } from "@/lib/site";
import { trackClarityEvent, setClarityTag, upgradeClaritySession } from "@/lib/clarity";
import { captureVercelLead } from "@/lib/vercelAnalytics";

interface IcpLeadFormProps {
  segment: string;           // e.g. "Physiotherapist", "Sports Academy"
  ctaLabel?: string;         // Button text
  whatsappMessage?: string;  // Pre-filled WA message
}

export function IcpLeadForm({
  segment,
  ctaLabel = "Request Free Demo",
  whatsappMessage,
}: IcpLeadFormProps) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setLoading(true);

    // 1. Microsoft Clarity event & session recording priority upgrade
    try {
      trackClarityEvent("lead_submission");
      trackClarityEvent("demo_request");
      setClarityTag("lead_segment", segment);
      upgradeClaritySession(`demo_${segment}`);
    } catch (_) {}

    // 2. Centralized Lead Processing via Vercel:
    // Dispatches single request to /api/leads which coordinates Jira,
    // Google Sheets, Airtable, and Telegram server-side.
    try {
      await captureVercelLead({
        name: name.trim(),
        phone: contact.trim().includes("@") ? undefined : contact.trim(),
        email: contact.trim().includes("@") ? contact.trim() : undefined,
        organization: segment,
        interest: segment,
        lead_type: "demo_request",
        subject: `Demo request for ${segment}`,
      });
    } catch (leadErr) {
      console.warn("[IcpLeadForm] Vercel lead engine notice:", leadErr);
    }

    // 3. WhatsApp handoff
    const waMsg =
      whatsappMessage ||
      `Hi Physiomatics, I'm ${name.trim()} (${segment}) and I'd like a free demo. Contact: ${contact.trim()}`;
    window.open(whatsappLink(waMsg), "_blank", "noopener");

    setLoading(false);
    setDone(true);
    toast.success("Request sent!", {
      description: "Check WhatsApp — your message is ready to send.",
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center space-y-3">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-6 text-primary" />
        </div>
        <h4 className="font-semibold text-base">Request Received!</h4>
        <p className="text-xs text-muted-foreground">
          Check WhatsApp to send your pre-filled message. Our team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor={`icp-name-${segment}`}>Your name</Label>
        <Input
          id={`icp-name-${segment}`}
          required
          placeholder="Dr. Sarah / Coach Mike"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`icp-contact-${segment}`}>Email or phone</Label>
        <Input
          id={`icp-contact-${segment}`}
          required
          placeholder="sarah@clinic.com or +91 98765 43210"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        disabled={loading}
        className="w-full rounded-xl"
      >
        {loading ? "Sending…" : ctaLabel}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        No credit card required. Free 30-min setup.
      </p>
    </form>
  );
}
