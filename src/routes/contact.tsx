import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/PageHero";
import { 
  whatsappLink, 
  WA_MESSAGES, 
  PHONE_TEL, 
  PHONE_NUMBER_DISPLAY, 
  YOUTUBE_URL, 
  LINKEDIN_URL 
} from "@/lib/site";
import { CheckCircle2, ChevronRight, ChevronLeft, Star, MessageSquarePlus, CalendarCheck, Calendar, Paperclip, FileText, UploadCloud, X, Loader2 } from "lucide-react";
import { sendToGoogleSheet, uploadReportDocument } from "@/lib/googleSheets";
import { trackClarityEvent, setClarityTag, upgradeClaritySession } from "@/lib/clarity";
import { captureVercelLead } from "@/lib/vercelAnalytics";
import { recordMeaningfulActivity } from "@/lib/visitorSession";
import { GoogleCalendarButton } from "@/components/site/GoogleCalendarButton";
import { supabase } from "@/integrations/supabase/client";

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

export interface AttachedReportData {
  file: File;
  name: string;
  size: number;
  type: string;
  base64: string;
  driveUrl?: string;
}

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

async function saveLead(formType: string, data: FormData, attachedFile?: AttachedReportData | null) {
  const row = leadRow(formType, data);
  let reportDriveUrl = attachedFile?.driveUrl || "";

  // If a clinical report was attached, upload to Google Drive first to obtain shareable link
  if (attachedFile && !reportDriveUrl) {
    try {
      const uploadRes = await uploadReportDocument({
        name: attachedFile.name,
        type: attachedFile.type,
        base64: attachedFile.base64,
      });
      if (uploadRes?.fileUrl) {
        reportDriveUrl = uploadRes.fileUrl;
      }
    } catch (uploadErr) {
      console.warn("Report upload to Drive warning:", uploadErr);
    }
  }

  // Microsoft Clarity event & session recording priority upgrade
  try {
    trackClarityEvent("lead_submission");
    trackClarityEvent(`lead_${formType}`);
    setClarityTag("lead_type", formType);
    upgradeClaritySession(`lead_${formType}`);
  } catch (_) {}

  const leadName = row.full_name || "Anonymous";
  const leadEmail = row.email || (row.contact && row.contact.includes("@") ? row.contact : "");
  const leadPhone = row.phone || (row.contact && !row.contact.includes("@") ? row.contact : "");
  const leadRole = row.job_title || row.organization_type || "";
  const leadInterest = row.organization_type || "";
  const leadSubject = row.challenge || "";

  // Centralized Lead Processing via Vercel Serverless Backend:
  // Vercel coordinates server-side Jira (Parent + 8 Subtasks), Google Sheets,
  // Airtable, and Telegram alert delivery with server-side credentials.
  const result = await captureVercelLead({
    name: leadName,
    email: leadEmail,
    phone: leadPhone,
    organization: row.organization,
    role: leadRole,
    interest: leadInterest,
    subject: leadSubject,
    message: row.message,
    lead_type: formType,
    country: row.country,
    document_name: attachedFile?.name,
    document_url: reportDriveUrl,
  });

  return result.success;
}

function sendViaWhatsApp(title: string, data: FormData, reportName?: string, reportUrl?: string) {
  const lines = [title, ...[...data.entries()].filter(([, v]) => String(v).trim()).map(([k, v]) => `${k}: ${v}`)];
  if (reportName) {
    lines.push(`Attached Report: ${reportName}${reportUrl ? ` (${reportUrl})` : ""}`);
  }
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
      trackClarityEvent("feedback_submitted");
      setClarityTag("feedback_category", category);
    } catch (_) {}

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
  const [mode, setMode] = useState<"appointment" | "quick" | "long">("appointment");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState<"enquiry" | "consultation">("enquiry");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [attachedReport, setAttachedReport] = useState<AttachedReportData | null>(null);
  const [isSubmittingLong, setIsSubmittingLong] = useState(false);
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  const totalSteps = 4; // Grouped the 7 steps into 4 for better UX

  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    recordMeaningfulActivity({
      type: "form_interaction",
      description: "consultation_form",
      path: "/contact",
    });
  };

  const handleReportUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 15MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedReport({
        file,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        base64: reader.result as string,
      });
      toast.success(`Attached report: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedReport = () => {
    setAttachedReport(null);
    toast.info("Report removed");
  };

  const nextStep = () => {
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const submitQuick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingQuick(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    let saved = false;
    try {
      saved = await Promise.race([
        saveLead("quick_enquiry", data),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 4000)),
      ]);
    } catch (err) {
      console.warn("saveLead error in quick enquiry:", err);
    } finally {
      setIsSubmittingQuick(false);
    }

    try {
      sendViaWhatsApp("Physiomatics — Quick enquiry", data);
    } catch (err) {
      console.warn("WhatsApp open error:", err);
    }

    try {
      form.reset();
    } catch (_) {}

    setSubmittedType("enquiry");
    setSubmitted(true);
    recordMeaningfulActivity({
      type: "page_view",
      description: "enquiry_submitted",
      path: "/contact",
    });

    if (saved) {
      toast.success("Enquiry sent successfully!");
    } else {
      toast.info("Enquiry received and WhatsApp draft opened.");
    }
  };

  const submitLong = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingLong(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (attachedReport) {
      data.append("Attached Report", attachedReport.name);
    }
    
    let saved = false;
    try {
      saved = await saveLead("consultation", data, attachedReport);
    } catch (err) {
      console.warn("saveLead error (form will still submit):", err);
    } finally {
      setIsSubmittingLong(false);
    }

    // Always open WhatsApp and show success — even if backend had an issue
    try {
      sendViaWhatsApp("Physiomatics — Consultation request", data, attachedReport?.name);
    } catch (_) {}

    setFormData({});
    setAttachedReport(null);
    setStep(1);
    setSubmittedType("consultation");
    setSubmitted(true);
    recordMeaningfulActivity({
      type: "page_view",
      description: "consultation_submitted",
      path: "/contact",
    });

    if (!saved) {
      toast.warning("Saved to WhatsApp. Our server had a brief hiccup — your request is still delivered via WhatsApp.");
    } else {
      toast.success("Consultation request submitted successfully!");
    }
  };

  if (submitted) {
    const isEnquiry = submittedType === "enquiry" || mode === "quick";
    return (
      <div className="container-page py-16 max-w-xl mx-auto">
        <div className="rounded-3xl border bg-card shadow-soft p-10 text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Animated success icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/10">
            <CheckCircle2 className="size-10 text-primary" />
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground">
            {isEnquiry ? "Enquiry Sent! 🎉" : "Request Received! 🎉"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Thank you for reaching out to Physiomatics.<br />
            Your {isEnquiry ? "enquiry" : "consultation request"} has been{" "}
            <strong>received and logged in our system</strong>, and your WhatsApp draft is ready to send.
          </p>

          {/* What happens next */}
          <div className="mt-8 text-left rounded-2xl bg-muted/50 border p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">What happens next</p>
            {(isEnquiry
              ? [
                  { icon: "📋", text: "Your enquiry is recorded in our system and team CRM" },
                  { icon: "⚡", text: "Our specialists review inquiries within a few hours" },
                  { icon: "💬", text: "We'll follow up directly via WhatsApp or email" },
                ]
              : [
                  { icon: "📋", text: "Your request is logged in our CRM and Jira pipeline" },
                  { icon: "📊", text: "Our team reviews it within 1–2 business days" },
                  { icon: "📅", text: "We'll reach out to schedule your demo session" },
                ]
            ).map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 text-sm text-foreground">
                <span className="text-lg leading-none">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" onClick={() => { setSubmitted(false); setMode("appointment"); }}>
              <CalendarCheck className="mr-2 size-4" /> Book a calendar slot
            </Button>
            <Button variant="outline" size="lg" onClick={() => setSubmitted(false)}>
              {isEnquiry ? "Send another enquiry" : "Submit another request"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero eyebrow="Contact & Scheduling" title="Book an appointment or ask a question">
        Select a date and time directly on our live Google Calendar, or send an enquiry.
      </PageHero>
      <section className="container-page max-w-3xl py-12">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border bg-card p-1 shadow-sm flex-wrap justify-center gap-1" role="tablist">
            {(["appointment", "quick", "long"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); setStep(1); }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "appointment" ? "📅 Book an appointment" : m === "quick" ? "Quick enquiry" : "Consultation request"}
              </button>
            ))}
          </div>
        </div>

        {mode === "appointment" && (
          <div className="rounded-3xl border bg-card p-8 md:p-10 shadow-soft text-center animate-in fade-in">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
              <CalendarCheck className="size-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Google Calendar Appointment Scheduling
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Pick your preferred date and time from our live calendar. A Google Meet link and calendar invitation will be issued to you instantly.
            </p>

            <div className="py-4 flex justify-center">
              <GoogleCalendarButton
                label="Book an appointment"
                source="contact_appointment_tab"
                useNativeGoogleWidget={false}
                size="lg"
                className="px-8 py-6 text-base font-bold shadow-lg"
              />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6 text-left">
              <div className="rounded-xl bg-muted/40 p-3">
                <span className="font-semibold text-xs text-primary uppercase block mb-1">⏱ Duration</span>
                <span className="text-sm text-foreground">30-minute tailored session</span>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <span className="font-semibold text-xs text-primary uppercase block mb-1">💻 Format</span>
                <span className="text-sm text-foreground">Google Meet video call</span>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <span className="font-semibold text-xs text-primary uppercase block mb-1">⚡ Instant Sync</span>
                <span className="text-sm text-foreground">Times allocated in calendar</span>
              </div>
            </div>
          </div>
        )}

        {mode === "quick" && (
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
            <Button type="submit" variant="hero" size="lg" disabled={isSubmittingQuick}>
              {isSubmittingQuick ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending enquiry…
                </>
              ) : (
                "Send enquiry"
              )}
            </Button>
          </form>
        )}

        {mode === "long" && (
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
                <legend className="mb-4 font-display text-2xl">Your Needs & Clinical Information</legend>
                <div className="grid gap-1.5">
                  <Label htmlFor="challenge">Current challenges</Label>
                  <Textarea id="challenge" rows={3} className="rounded-xl bg-background" value={formData["Main challenge"] || ""} onChange={(e) => updateField("Main challenge", e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="req">Required features & timeline</Label>
                  <Textarea id="req" rows={3} className="rounded-xl bg-background" value={formData["Requirements and timeline"] || ""} onChange={(e) => updateField("Requirements and timeline", e.target.value)} />
                </div>

                {/* ── Upload Report Area ── */}
                <div className="grid gap-2 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                      <Paperclip className="size-4 text-primary" />
                      Upload Clinical Report or Diagnostic Document
                    </Label>
                    <span className="text-xs text-muted-foreground font-medium">Optional</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Attach clinical assessment, biomechanics notes, or diagnostic report (PDF, DOCX, PNG, JPG). Will sync automatically to Jira, Google Sheets, and Airtable.
                  </p>
                  
                  {!attachedReport ? (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors text-center group">
                      <UploadCloud className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm text-foreground">Click to upload report or drag and drop</span>
                      <span className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG (up to 15MB)</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleReportUpload}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-2xl border bg-card shadow-xs border-primary/30">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{attachedReport.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(attachedReport.size / (1024 * 1024)).toFixed(2)} MB • Ready to sync to Jira, Sheets & Airtable
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeAttachedReport}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <X className="size-4 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                </div>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset className="grid gap-5 animate-in fade-in slide-in-from-right-4">
                <legend className="mb-4 font-display text-2xl">Review & Submit</legend>
                <div className="rounded-xl bg-muted p-4 text-sm space-y-1">
                  <p><strong>Name:</strong> {formData["Full name"]}</p>
                  <p><strong>Email:</strong> {formData["Work email"]}</p>
                  <p><strong>Organization:</strong> {formData["Organization name"]}</p>
                  {formData["Role / job title"] && <p><strong>Role:</strong> {formData["Role / job title"]}</p>}
                </div>

                {/* ── Attached Report in Step 4 ── */}
                <div className="rounded-2xl border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5 font-semibold text-sm">
                      <Paperclip className="size-4 text-primary" />
                      Attached Clinical Report
                    </Label>
                    {!attachedReport && (
                      <span className="text-xs text-muted-foreground">Optional</span>
                    )}
                  </div>

                  {!attachedReport ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-dashed">
                      <div className="text-xs text-muted-foreground">
                        Have an assessment, referral letter, or patient report? Attach it here.
                      </div>
                      <label className="cursor-pointer shrink-0">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <UploadCloud className="size-4 mr-1.5 text-primary" />
                            Upload Report
                          </span>
                        </Button>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={handleReportUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="size-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">{attachedReport.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {(attachedReport.size / (1024 * 1024)).toFixed(2)} MB • Syncing to Jira, Google Sheets & Airtable
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeAttachedReport}
                        className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2 shrink-0"
                      >
                        <X className="size-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                </div>

                <label className="flex gap-3 text-sm">
                  <input type="checkbox" required className="mt-1 size-4 accent-primary" /> 
                  <span>I agree to be contacted about my request and confirm that all submitted documents comply with clinical data privacy practices.</span>
                </label>
              </fieldset>
            )}

            <div className="mt-8 flex justify-between pt-4 border-t">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmittingLong}>
                  <ChevronLeft className="mr-2 size-4"/> Back
                </Button>
              ) : <div></div>}
              
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="ml-2 size-4"/>
                </Button>
              ) : (
                <Button type="submit" variant="hero" disabled={isSubmittingLong}>
                  {isSubmittingLong ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Uploading Report & Submitting…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 size-4" />
                      Submit Consultation Request
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        )}
      </section>

      {/* Connect with us */}
      <section className="container-page max-w-3xl pb-6">
        <div className="rounded-3xl border bg-card p-8 shadow-soft">
          <h2 className="font-display text-2xl font-semibold mb-1">Connect with us</h2>
          <p className="text-sm text-muted-foreground mb-6">Find us across platforms or give us a call — we'd love to hear from you.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" id="contact-youtube-link" className="group flex flex-col items-center gap-2 rounded-2xl border p-4 hover:border-primary hover:bg-primary/5 transition-colors text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-red-100 text-red-600 group-hover:scale-110 transition-transform">
                <svg className="size-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </span>
              <span className="text-xs font-semibold text-foreground">YouTube</span>
              <span className="text-[10px] text-muted-foreground">@JaneGracyDavid</span>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" id="contact-linkedin-link" className="group flex flex-col items-center gap-2 rounded-2xl border p-4 hover:border-primary hover:bg-primary/5 transition-colors text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
                <svg className="size-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </span>
              <span className="text-xs font-semibold text-foreground">LinkedIn</span>
              <span className="text-[10px] text-muted-foreground">Physiomatics</span>
            </a>
            <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer" id="contact-whatsapp-link" className="group flex flex-col items-center gap-2 rounded-2xl border p-4 hover:border-primary hover:bg-primary/5 transition-colors text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition-transform">
                <svg className="size-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </span>
              <span className="text-xs font-semibold text-foreground">WhatsApp</span>
              <span className="text-[10px] text-muted-foreground">{PHONE_NUMBER_DISPLAY}</span>
            </a>
            <a href={PHONE_TEL} id="contact-phone-link" className="group flex flex-col items-center gap-2 rounded-2xl border p-4 hover:border-primary hover:bg-primary/5 transition-colors text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <svg className="size-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </span>
              <span className="text-xs font-semibold text-foreground">Phone</span>
              <span className="text-[10px] text-muted-foreground">{PHONE_NUMBER_DISPLAY}</span>
            </a>
          </div>
        </div>
      </section>

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
