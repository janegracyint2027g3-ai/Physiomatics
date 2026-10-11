import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink } from "@/lib/site";
import { CheckCircle2, ChevronRight, ChevronLeft, Star, MessageSquarePlus } from "lucide-react";
import { sendToGoogleSheet } from "@/lib/googleSheets";

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
    organization_type: get("Organization type") || get("Role"),
    audience_size: get("Number of patients / students"),
    message: get("Message"),
    challenge: get("Main challenge"),
    requirements: get("Requirements and timeline"),
  };
}

async function saveLead(formType: string, data: FormData) {
  const row = leadRow(formType, data);
  
  // 1. Sync to Google Sheets
  sendToGoogleSheet({
    action: "lead_submission",
    form_type: formType,
    form_name: formType,
    form_status: "submitted",
    conversion_name: formType,
    conversion_value: 1,
    ...row,
  }).catch((err) => console.error("Google Sheets sync warning:", err));

  // 2. Save to Supabase leads table
  const { error } = await supabase.from("leads").insert(row);
  if (error) console.error("Failed to save enquiry to Supabase:", error.message);
  return !error;
}

function sendViaWhatsApp(title: string, data: FormData) {
  const lines = [title, ...[...data.entries()].filter(([, v]) => String(v).trim()).map(([k, v]) => `${k}: ${v}`)];
  window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
}

function Field({ name, label, type = "text", required, value, onChange }: { name: string; label: string; type?: string; required?: boolean; value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="grid gap-1.5 w-full">
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <Input id={name} name={label} type={type} required={required} value={value} onChange={onChange} className="h-11 rounded-xl bg-background" />
    </div>
  );
}

const FEEDBACK_CATEGORIES = ["General", "Feature Request", "Bug Report", "Partnership", "Pricing", "Other"];

function FeedbackSection() {
  const [category, setCategory] = useState("General");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    sendToGoogleSheet({
      action: "user_feedback",
      form_type: "feedback",
      category,
      rating,
      message: message.trim(),
    }).catch(() => {});

    try {
      await supabase.from("feedback").insert({ category, message: message.trim() } as any);
    } catch (_) {}

    setLoading(false);
    setDone(true);
    toast.success("Thank you for your feedback!", { description: "Our team reads every submission." });
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-semibold text-lg">Feedback received — thank you!</p>
        <button className="text-xs underline text-muted-foreground hover:text-primary" onClick={() => { setDone(false); setMessage(""); setRating(0); }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {/* Category */}
      <div className="grid gap-1.5">
        <Label htmlFor="fb-category">Category</Label>
        <select
          id="fb-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-xl border bg-background px-3 text-sm"
        >
          {FEEDBACK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Star rating */}
      <div className="grid gap-1.5">
        <Label>How would you rate Physiomatics?</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`size-7 ${
                  (hovered || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="grid gap-1.5">
        <Label htmlFor="fb-msg">Your message *</Label>
        <Textarea
          id="fb-msg"
          rows={4}
          required
          placeholder="Share your thoughts, suggestions or issues…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-xl bg-background"
        />
      </div>

      <Button type="submit" variant="hero" size="lg" disabled={loading}>
        <MessageSquarePlus className="mr-2 size-4" />
        {loading ? "Sending…" : "Send feedback"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Your feedback is stored securely and only used to improve Physiomatics. No spam.
      </p>
    </form>
  );
}

function Contact() {
  const [mode, setMode] = useState<"quick" | "long">("quick");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const totalSteps = 4; // Grouped the 7 steps into 4 for better UX

  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Basic validation could be added here
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const submitQuick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const saved = await saveLead("quick_enquiry", data);
    sendViaWhatsApp("Physiomatics — Quick enquiry", data);
    form.reset();
    setSubmitted(true);
    if (!saved) toast.warning("We couldn't save your enquiry right now, but WhatsApp is open — press send to deliver it.");
  };

  const submitLong = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    
    const saved = await saveLead("consultation", data);
    sendViaWhatsApp("Physiomatics — Consultation request", data);
    setFormData({});
    setStep(1);
    setSubmitted(true);
    if (!saved) toast.warning("We couldn't save your enquiry right now, but WhatsApp is open — press send to deliver it.");
  };

  if (submitted) {
    return (
      <div className="container-page py-24 text-center max-w-lg">
        <CheckCircle2 className="size-16 text-primary mx-auto" />
        <h2 className="mt-6 text-3xl font-bold">Request Received</h2>
        <p className="mt-4 text-muted-foreground">Thank you for your interest in Physiomatics. Your request has been saved and your WhatsApp draft is ready.</p>
        <Button className="mt-8" onClick={() => setSubmitted(false)}>Submit another request</Button>
      </div>
    );
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="Book a demo or ask a question">
        Choose a quick enquiry or a detailed consultation. Your message opens in WhatsApp so you can review it before sending.
      </PageHero>
      <section className="container-page max-w-3xl py-12">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border bg-card p-1" role="tablist">
            {(["quick", "long"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setStep(1); }}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {m === "quick" ? "Quick enquiry" : "Consultation request"}
              </button>
            ))}
          </div>
        </div>

        {mode === "quick" ? (
          <form onSubmit={submitQuick} className="grid gap-4 rounded-3xl border bg-card p-8 shadow-soft">
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
          <form onSubmit={submitLong} className="rounded-3xl border bg-card p-8 shadow-soft">
            <div className="mb-8 flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Step {step} of {totalSteps}</div>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full ${step > i ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
            </div>

            {step === 1 && (
              <fieldset className="grid gap-5 animate-in fade-in slide-in-from-right-4">
                <legend className="mb-4 font-display text-2xl">Contact & Role</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="lname" label="Full name" required value={formData["Full name"] || ""} onChange={(e) => updateField("Full name", e.target.value)} />
                  <Field name="email" label="Work email" type="email" required value={formData["Work email"] || ""} onChange={(e) => updateField("Work email", e.target.value)} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="phone" label="Phone" type="tel" value={formData["Phone"] || ""} onChange={(e) => updateField("Phone", e.target.value)} />
                  <Field name="jobtitle" label="Role / job title" value={formData["Role / job title"] || ""} onChange={(e) => updateField("Role / job title", e.target.value)} />
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="grid gap-5 animate-in fade-in slide-in-from-right-4">
                <legend className="mb-4 font-display text-2xl">Organization</legend>
                <Field name="org" label="Organization name" value={formData["Organization name"] || ""} onChange={(e) => updateField("Organization name", e.target.value)} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="country" label="Country" value={formData["Country"] || ""} onChange={(e) => updateField("Country", e.target.value)} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="type">Organization type</Label>
                    <select id="type" className="h-11 rounded-xl border bg-background px-3" value={formData["Organization type"] || ""} onChange={(e) => updateField("Organization type", e.target.value)}>
                      <option value="">Select...</option>
                      {roles.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <Field name="size" label="Number of patients / students" value={formData["Number of patients / students"] || ""} onChange={(e) => updateField("Number of patients / students", e.target.value)} />
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="grid gap-5 animate-in fade-in slide-in-from-right-4">
                <legend className="mb-4 font-display text-2xl">Your Needs</legend>
                <div className="grid gap-1.5">
                  <Label htmlFor="challenge">Current challenges</Label>
                  <Textarea id="challenge" rows={3} className="rounded-xl bg-background" value={formData["Main challenge"] || ""} onChange={(e) => updateField("Main challenge", e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="req">Required features & timeline</Label>
                  <Textarea id="req" rows={3} className="rounded-xl bg-background" value={formData["Requirements and timeline"] || ""} onChange={(e) => updateField("Requirements and timeline", e.target.value)} />
                </div>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset className="grid gap-5 animate-in fade-in slide-in-from-right-4">
                <legend className="mb-4 font-display text-2xl">Review & Submit</legend>
                <div className="rounded-xl bg-muted p-4 text-sm mb-4">
                  <p><strong>Name:</strong> {formData["Full name"]}</p>
                  <p><strong>Email:</strong> {formData["Work email"]}</p>
                  <p><strong>Organization:</strong> {formData["Organization name"]}</p>
                </div>
                <label className="flex gap-3 text-sm">
                  <input type="checkbox" required className="mt-1 size-4 accent-primary" /> 
                  <span>I agree to be contacted about my request and confirm that I have not included sensitive patient medical records.</span>
                </label>
              </fieldset>
            )}

            <div className="mt-8 flex justify-between pt-4 border-t">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}><ChevronLeft className="mr-2 size-4"/> Back</Button>
              ) : <div></div>}
              
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>Next <ChevronRight className="ml-2 size-4"/></Button>
              ) : (
                <Button type="submit" variant="hero">Submit Request</Button>
              )}
            </div>
          </form>
        )}
      </section>

      {/* ── Feedback section ──────────────────────────────────────── */}
      <section className="container-page max-w-3xl pb-20">
        <div className="rounded-3xl border bg-card p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10">
              <MessageSquarePlus className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Share your feedback</h2>
              <p className="text-sm text-muted-foreground">Help us make Physiomatics better for everyone.</p>
            </div>
          </div>
          <FeedbackSection />
        </div>
      </section>
    </>
  );
}
