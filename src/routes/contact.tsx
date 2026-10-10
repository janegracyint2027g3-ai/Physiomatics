import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Demo — Physiomatics" },
      { name: "description", content: "Book a Physiomatics demo, send a quick enquiry, or request a detailed consultation for your clinic or organization." },
      { property: "og:title", content: "Book a Physiomatics Demo" },
      { property: "og:description", content: "Quick enquiry or full consultation request." },
    ],
  }),
  component: Contact,
});

const roles = ["Physiotherapist / clinic", "Elderly individual / caregiver", "Injury rehabilitation", "Educator / institution", "Partner / organization"];

function leadRow(formType: string, data: FormData) {
  const get = (k: string) => String(data.get(k) ?? "").trim();
  return {
    form_type: formType,
    full_name: get("Full name"),
    contact: get("Email or phone"),
    email: get("Work email"),
    phone: get("Phone"),
    job_title: get("Role / job title"),
    organization: get("Organization name"),
    country: get("Country"),
    organization_type: get("Organization type") || get("I am a…"),
    audience_size: get("Number of patients / students"),
    message: get("How can we help?"),
    challenge: get("Main challenge"),
    requirements: get("Requirements & timeline"),
  };
}

async function saveLead(formType: string, data: FormData) {
  const { error } = await supabase.from("leads").insert(leadRow(formType, data));
  if (error) console.error("Failed to save enquiry:", error.message);
  return !error;
}

function sendViaWhatsApp(title: string, data: FormData) {
  const lines = [title, ...[...data.entries()].filter(([, v]) => String(v).trim()).map(([k, v]) => `${k}: ${v}`)];
  window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <Input id={name} name={label} type={type} required={required} className="h-11 rounded-xl bg-background" />
    </div>
  );
}

function Contact() {
  const [mode, setMode] = useState<"quick" | "long">("quick");
  const submit = (formType: string, title: string) => async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const saved = await saveLead(formType, data);
    sendViaWhatsApp(title, data);
    form.reset();
    if (saved) toast.success("Your enquiry is saved — and ready in WhatsApp. Press send to deliver it.");
    else toast.warning("We couldn't save your enquiry right now, but WhatsApp is open — press send to deliver it.");
  };
  return (
    <>
      <PageHero eyebrow="Contact" title="Book a demo or ask a question">
        Choose a quick enquiry or a detailed consultation. Your message opens in WhatsApp so you can review it before sending.
      </PageHero>
      <section className="container-page max-w-3xl py-12">
        <div className="mb-6 inline-flex rounded-full border bg-card p-1" role="tablist">
          {(["quick", "long"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {m === "quick" ? "Quick enquiry" : "Consultation request"}
            </button>
          ))}
        </div>

        {mode === "quick" ? (
          <form onSubmit={submit("quick_enquiry", "Physiomatics — Quick enquiry")} className="grid gap-4 rounded-3xl border bg-card p-8 shadow-soft">
            <Field name="name" label="Full name" required />
            <Field name="contact" label="Email or phone" required />
            <div className="grid gap-1.5">
              <Label htmlFor="role">I am a…</Label>
              <select id="role" name="Role" className="h-11 rounded-xl border bg-background px-3">{roles.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="msg">How can we help?</Label>
              <Textarea id="msg" name="Message" rows={4} className="rounded-xl bg-background" />
            </div>
            <p className="text-xs text-muted-foreground">Please don't include detailed medical history. This form is not for emergencies.</p>
            <Button type="submit" variant="hero" size="lg">Send enquiry</Button>
          </form>
        ) : (
          <form onSubmit={submit("consultation", "Physiomatics — Consultation request")} className="grid gap-8 rounded-3xl border bg-card p-8 shadow-soft">
            <fieldset className="grid gap-4 md:grid-cols-2">
              <legend className="mb-3 font-display text-xl">Contact details</legend>
              <Field name="lname" label="Full name" required />
              <Field name="email" label="Work email" type="email" required />
              <Field name="phone" label="Phone" type="tel" />
              <Field name="jobtitle" label="Role / job title" />
            </fieldset>
            <fieldset className="grid gap-4 md:grid-cols-2">
              <legend className="mb-3 font-display text-xl">Organization</legend>
              <Field name="org" label="Organization name" />
              <Field name="country" label="Country" />
              <div className="grid gap-1.5">
                <Label htmlFor="type">Organization type</Label>
                <select id="type" name="Organization type" className="h-11 rounded-xl border bg-background px-3">{roles.map((r) => <option key={r}>{r}</option>)}</select>
              </div>
              <Field name="size" label="Number of patients / students" />
            </fieldset>
            <fieldset className="grid gap-4">
              <legend className="mb-3 font-display text-xl">Your needs</legend>
              <div className="grid gap-1.5"><Label htmlFor="challenge">Main challenge</Label><Textarea id="challenge" name="Main challenge" rows={3} className="rounded-xl bg-background" /></div>
              <div className="grid gap-1.5"><Label htmlFor="req">Requirements & timeline</Label><Textarea id="req" name="Requirements and timeline" rows={3} className="rounded-xl bg-background" /></div>
            </fieldset>
            <label className="flex gap-3 text-sm"><input type="checkbox" required className="mt-1 size-4 accent-primary" /> I agree to be contacted about my request.</label>
            <Button type="submit" variant="hero" size="lg">Request consultation</Button>
          </form>
        )}
      </section>
    </>
  );
}
