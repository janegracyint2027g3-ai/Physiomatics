/**
 * IcpLeadForm – compact inline lead capture used in ICP page sidebars.
 * Saves to Google Sheets (fire-and-forget) and Supabase `leads` table, then
 * opens a WhatsApp pre-filled message so the visitor can send with one tap.
 */
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { sendToGoogleSheet } from "@/lib/googleSheets";
import { whatsappLink } from "@/lib/site";
import { trackClarityEvent, setClarityTag, upgradeClaritySession } from "@/lib/clarity";
import { saveLeadToAirtable } from "@/lib/airtable";
import { createJiraLeadWithSubtasks } from "@/lib/jira";
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

    const payload = {
      form_type: "icp_lead",
      full_name: name.trim(),
      contact: contact.trim(),
      organization_type: segment,
    };

    // 1. Google Sheets (fire-and-forget)
    sendToGoogleSheet({
      action: "icp_lead",
      form_name: "icp_lead",
      form_status: "submitted",
      conversion_name: "demo_request",
      conversion_value: 1,
      ...payload,
    }).catch((err) => console.error("IcpLeadForm Sheets error:", err));

    // 1b. Microsoft Clarity event & session recording priority upgrade
    try {
      trackClarityEvent("lead_submission");
      trackClarityEvent("demo_request");
      setClarityTag("lead_segment", segment);
      upgradeClaritySession(`demo_${segment}`);
    } catch (_) {}

    // 1c. Sync to Airtable
    saveLeadToAirtable({
      name: name.trim(),
      phone: contact.trim(),
      organization: segment,
      interest: segment,
      lead_type: "demo_request",
    }).catch(() => {});

    // 1d. Sync to Jira (Parent Task + 8 Subtasks)
    createJiraLeadWithSubtasks({
      name: name.trim(),
      phone: contact.trim().includes("@") ? undefined : contact.trim(),
      email: contact.trim().includes("@") ? contact.trim() : undefined,
      organization: segment,
      interest: segment,
      lead_type: "demo_request",
      subject: `Demo request for ${segment}`,
    }).catch(() => {});

    // 1e. Sync to Vercel (Web Analytics & Serverless Lead Engine)
    captureVercelLead({
      name: name.trim(),
      phone: contact.trim().includes("@") ? undefined : contact.trim(),
      email: contact.trim().includes("@") ? contact.trim() : undefined,
      organization: segment,
      interest: segment,
      lead_type: "demo_request",
      subject: `Demo request for ${segment}`,
    }).catch(() => {});

    // 2. Supabase
    const { error } = await supabase.from("leads").insert(payload);
    if (error) console.error("IcpLeadForm Supabase error:", error.message);

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
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-semibold">We've received your request!</p>
        <p className="text-xs text-muted-foreground">
          Complete the WhatsApp message that just opened to confirm your demo.
        </p>
        <button
          className="mt-2 text-xs underline text-muted-foreground hover:text-primary transition-colors"
          onClick={() => { setDone(false); setName(""); setContact(""); }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor={`icp-name-${segment}`}>Your name *</Label>
        <Input
          id={`icp-name-${segment}`}
          placeholder="e.g. Dr. Priya Nair"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-10 rounded-xl bg-background text-sm"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`icp-contact-${segment}`}>Email or phone *</Label>
        <Input
          id={`icp-contact-${segment}`}
          placeholder="email or +91 …"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="h-10 rounded-xl bg-background text-sm"
        />
      </div>
      <Button
        type="submit"
        variant="hero"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Sending…" : ctaLabel}
      </Button>
      <p className="text-[10px] text-muted-foreground text-center leading-tight">
        No spam. Your info is stored securely and only used to schedule your demo.
      </p>
    </form>
  );
}
