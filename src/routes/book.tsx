import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight, ArrowLeft, CheckCircle2, CalendarCheck, Clock, Stethoscope,
  Bandage, Dumbbell, Users, HeartHandshake, Building2, GraduationCap,
  Brain, ScanLine, HelpCircle, Loader2, Phone, Mail, Globe, Shield,
  MapPin, ChevronRight, CalendarDays, UserCheck, Star
} from "lucide-react";
import { whatsappLink, PHONE_NUMBER_DISPLAY, PHONE_TEL } from "@/lib/site";
import { trackClarityEvent } from "@/lib/clarity";
import { openGoogleCalendarAppointment } from "@/lib/calendar";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Physiotherapy Consultation — Physiomatics" },
      {
        name: "description",
        content:
          "Book your physiotherapy consultation, rehabilitation assessment, or AI movement analysis demo. Select your consultation type and schedule a session with the Physiomatics team.",
      },
      { property: "og:title", content: "Book a Consultation — Physiomatics" },
      { property: "og:description", content: "AI-powered physiotherapy consultation booking for clinics, patients, and organisations." },
    ],
  }),
  component: BookPage,
});

// ─── Consultation categories ──────────────────────────────────────────────────
const CONSULTATION_TYPES = [
  {
    id: "physiotherapy_consultation",
    label: "Physiotherapy Consultation",
    desc: "General physiotherapy assessment and treatment planning.",
    icon: Stethoscope,
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-200",
    iconColor: "text-violet-600",
  },
  {
    id: "post_injury_rehab",
    label: "Post-Injury Rehabilitation",
    desc: "Recovery support for sprains, strains, fractures and soft-tissue injuries.",
    icon: Bandage,
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-200",
    iconColor: "text-rose-600",
  },
  {
    id: "post_operative_rehab",
    label: "Post-Operative Rehabilitation",
    desc: "Guided recovery after TKA, ACL reconstruction, rotator cuff repair and similar procedures.",
    icon: HeartHandshake,
    color: "from-red-500/20 to-rose-500/10",
    border: "border-red-200",
    iconColor: "text-red-600",
  },
  {
    id: "mobility_balance",
    label: "Mobility & Balance Support",
    desc: "Balance, gait and functional mobility improvement programmes.",
    icon: UserCheck,
    color: "from-teal-500/20 to-cyan-500/10",
    border: "border-teal-200",
    iconColor: "text-teal-600",
  },
  {
    id: "elderly_mobility",
    label: "Elderly Mobility Support",
    desc: "Safe, accessible exercise guidance for older adults and fall prevention.",
    icon: Users,
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-200",
    iconColor: "text-orange-600",
  },
  {
    id: "sports_injury",
    label: "Sports Injury Rehabilitation",
    desc: "Return-to-sport assessment and bilateral symmetry analysis for athletes.",
    icon: Dumbbell,
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    id: "progress_review",
    label: "Exercise & Recovery Progress Review",
    desc: "Review your movement data, range-of-motion progress and exercise adherence.",
    icon: CalendarDays,
    color: "from-green-500/20 to-emerald-500/10",
    border: "border-green-200",
    iconColor: "text-green-600",
  },
  {
    id: "ai_movement_demo",
    label: "AI Movement Analysis Demo",
    desc: "Live 25-minute demonstration of browser-based pose detection and biofeedback.",
    icon: ScanLine,
    color: "from-fuchsia-500/20 to-pink-500/10",
    border: "border-fuchsia-200",
    iconColor: "text-fuchsia-600",
  },
  {
    id: "clinic_demo",
    label: "Clinic / Healthcare Organisation Demo",
    desc: "Tailored platform walkthrough for clinic directors, lead PTs, and health network managers.",
    icon: Building2,
    color: "from-indigo-500/20 to-violet-500/10",
    border: "border-indigo-200",
    iconColor: "text-indigo-600",
  },
  {
    id: "institutional_enquiry",
    label: "Corporate / Institutional Enquiry",
    desc: "Partnership, licensing, or academic integration enquiry for organisations.",
    icon: GraduationCap,
    color: "from-sky-500/20 to-blue-500/10",
    border: "border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    id: "other",
    label: "Other / Not Sure",
    desc: "Describe your situation — we will recommend the most suitable consultation for you.",
    icon: HelpCircle,
    color: "from-slate-400/20 to-gray-400/10",
    border: "border-slate-200",
    iconColor: "text-slate-500",
  },
];

const PATIENT_TYPES = [
  "Patient / Individual",
  "Caregiver / Family member",
  "Physiotherapist / Therapist",
  "Clinic owner / Clinical director",
  "Healthcare organisation representative",
  "Sports coach / Academy",
  "Academic / Researcher",
  "Corporate / Institutional",
];

const FORMATS = ["Online (Google Meet)", "In-person (if available)", "Either — flexible"];
const TIMEZONES = [
  "Asia/Kolkata (IST — UTC+5:30)",
  "UTC",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "Europe/London (GMT)",
  "Australia/Sydney (AEDT)",
  "Asia/Singapore (SGT)",
];
const LANGUAGES = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Other"];

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Consultation type",
  "Requirements",
  "Your details",
  "Preferred time",
  "Review & book",
];

// ─── Component ────────────────────────────────────────────────────────────────
function BookPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [confirmDetails, setConfirmDetails] = useState<Record<string, any>>({});

  // Form state
  const [selectedType, setSelectedType] = useState("");
  const [goal, setGoal] = useState("");
  const [patientType, setPatientType] = useState(PATIENT_TYPES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");

  const [requirements, setRequirements] = useState("");
  const [existingWorkflow, setExistingWorkflow] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [preferredContact, setPreferredContact] = useState("Email");
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const selectedTypeObj = CONSULTATION_TYPES.find((t) => t.id === selectedType);

  // ── Step navigation ──────────────────────────────────────────────────────
  function canProceed(): boolean {
    if (step === 1) return Boolean(selectedType);
    if (step === 2) return Boolean(goal.trim());
    if (step === 3)
      return Boolean(name.trim() && email.trim() && email.includes("@") && privacyConsent);
    return true;
  }

  function next() {
    if (!canProceed()) {
      toast.error("Please complete the required fields before proceeding.");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Submission ────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!privacyConsent) {
      toast.error("Please agree to the privacy and consent terms.");
      return;
    }

    setSubmitting(true);
    trackClarityEvent("booking_form_submit", { consultation_type: selectedType });

    const payload = {
      name,
      email,
      phone,
      organization,
      job_title: jobTitle,
      country,
      city,
      preferred_contact: preferredContact,
      consultation_type:
        selectedTypeObj?.label || selectedType,
      goal,
      patient_type: patientType,
      format: format.replace(" (Google Meet)", "").replace(" (if available)", "").replace(" — flexible", ""),
      language,
      requirements,
      existing_workflow: existingWorkflow,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      timezone: timezone.split(" ")[0],
      message: description,
      notes: additionalNotes,
      page_path: "/book",
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setBookingRef(data.booking_ref || "PHY-REF");
        setConfirmDetails(data.details || payload);
        setSubmitted(true);
        trackClarityEvent("booking_confirmed", {
          booking_ref: data.booking_ref,
          consultation_type: selectedType,
        });
        toast.success("Booking enquiry submitted successfully!");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success confirmation screen ───────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
        <div className="container-page max-w-2xl py-20">
          <div className="rounded-[2.5rem] border border-primary/20 bg-white p-10 md:p-14 shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="size-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="size-10 text-green-600" />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#3b1d60] mb-3">
              Booking Enquiry Received!
            </h1>
            <p className="text-muted-foreground text-base mb-8">
              Thank you, <strong>{name}</strong>. Our team will review your enquiry and confirm within 24 hours.
            </p>

            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-8 text-left">
              <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Your Booking Reference
              </div>
              <div className="text-3xl font-mono font-bold text-[#3b1d60] mb-4">
                {bookingRef}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Consultation</span>
                  <div className="font-semibold text-foreground">
                    {confirmDetails.consultation_type || selectedTypeObj?.label}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Format</span>
                  <div className="font-semibold text-foreground">
                    {confirmDetails.format || format}
                  </div>
                </div>
                {preferredDate && (
                  <div>
                    <span className="text-muted-foreground">Preferred Date</span>
                    <div className="font-semibold text-foreground">{preferredDate}</div>
                  </div>
                )}
                {preferredTime && (
                  <div>
                    <span className="text-muted-foreground">Preferred Time</span>
                    <div className="font-semibold text-foreground">{preferredTime}</div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Confirmation sent to</span>
                  <div className="font-semibold text-foreground">{email}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Timezone</span>
                  <div className="font-semibold text-foreground">{timezone.split(" ")[0]}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-sm font-medium mb-6">
              <Mail className="size-4 text-purple-600 shrink-0" />
              <span>Confirmation email sent to <strong>{email}</strong></span>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground mb-8">
              {[
                `An email confirmation with your booking reference (${bookingRef}) has been sent to ${email}.`,
                "Our clinical team will review your consultation request within 24 hours.",
                "If you selected a preferred date & time, a calendar meeting invite is being prepared.",
                "Quote reference " + bookingRef + " for all follow-ups.",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                variant="whatsapp"
                size="lg"
              >
                <a
                  href={whatsappLink(
                    `Hi Physiomatics, I submitted a booking enquiry. My reference is ${bookingRef}. Consultation: ${selectedTypeObj?.label || selectedType}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Confirm via WhatsApp
                </a>
              </Button>
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">Back to Contact</Link>
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
              <p>
                Need to speak immediately?{" "}
                <a href={PHONE_TEL} className="text-primary font-semibold hover:underline">
                  Call {PHONE_NUMBER_DISPLAY}
                </a>
              </p>
              <p className="mt-1">
                This is an appointment enquiry. Your booking is confirmed once you receive a written confirmation from our team.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink py-16 md:py-20 text-ink-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-ink to-ink" />
        <div className="container-page relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 mb-6 backdrop-blur-sm">
            <CalendarCheck className="size-3.5" />
            Appointment Booking
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Book a Physiotherapy Consultation
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Select your consultation type, share your goals, and our team will confirm your appointment within 24 hours.
          </p>
          <p className="mt-3 text-xs text-white/50">
            This service provides physiotherapy consultation guidance. It does not constitute a medical diagnosis.
          </p>
        </div>
      </section>

      {/* Progress bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border/50 shadow-sm">
        <div className="container-page max-w-3xl py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Step {step} of {TOTAL_STEPS}: {STEP_LABELS[step - 1]}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round((step / TOTAL_STEPS) * 100)}% complete
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[#5AA9AC] transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex gap-1.5">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i + 1 < step
                      ? "bg-green-500"
                      : i + 1 === step
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <span className="hidden sm:block text-[10px] text-muted-foreground truncate">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container-page max-w-3xl py-10">
        <form onSubmit={handleSubmit}>

          {/* ── Step 1: Consultation Type ─────────────────────────────────── */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold text-[#3b1d60] mb-2">
                What type of consultation do you need?
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Select the category that best matches your situation. If unsure, choose "Other / Not Sure" and describe your needs.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {CONSULTATION_TYPES.map((type) => {
                  const Icon = type.icon;
                  const selected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`group relative w-full rounded-2xl border-2 bg-gradient-to-br p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                        selected
                          ? `${type.border} ${type.color} shadow-lg ring-2 ring-primary/30`
                          : "border-border/60 from-white to-white hover:border-primary/30 hover:from-primary/5"
                      }`}
                      aria-pressed={selected}
                    >
                      {selected && (
                        <CheckCircle2 className="absolute top-3 right-3 size-5 text-primary" />
                      )}
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                          selected ? "bg-white/60 shadow-sm" : "bg-muted"
                        }`}
                      >
                        <Icon className={`size-5 ${selected ? type.iconColor : "text-muted-foreground"}`} />
                      </div>
                      <div className="font-semibold text-sm text-[#3b1d60] mb-1">
                        {type.label}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {type.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  onClick={next}
                  disabled={!selectedType}
                  className="px-8"
                >
                  Continue <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Requirements ──────────────────────────────────────── */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#3b1d60] mb-2">
                  Tell us about your goals
                </h2>
                <p className="text-muted-foreground text-sm">
                  Help us prepare the right resources for your{" "}
                  <strong>{selectedTypeObj?.label}</strong> session.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <div className="grid gap-1.5">
                  <Label htmlFor="goal" className="font-semibold">
                    Main goal or reason for booking <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. I had a TKA 3 months ago and want to improve my knee flexion range at home..."
                    rows={4}
                    className="rounded-xl bg-background"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Please do not include detailed medical records or sensitive personal health information.
                  </p>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="patient_type" className="font-semibold">
                    I am a…
                  </Label>
                  <select
                    id="patient_type"
                    value={patientType}
                    onChange={(e) => setPatientType(e.target.value)}
                    className="h-11 rounded-xl border bg-background px-3 text-sm"
                  >
                    {PATIENT_TYPES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="requirements" className="font-semibold">
                    Specific requirements <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. I need exercises adapted for limited shoulder range; our clinic has 30 patients per day..."
                    rows={3}
                    className="rounded-xl bg-background"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="format" className="font-semibold">
                      Preferred format
                    </Label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="h-11 rounded-xl border bg-background px-3 text-sm"
                    >
                      {FORMATS.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="language" className="font-semibold">
                      Preferred language
                    </Label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-11 rounded-xl border bg-background px-3 text-sm"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="description" className="font-semibold">
                    Additional description <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Anything else you'd like us to know before the session..."
                    rows={3}
                    className="rounded-xl bg-background"
                  />
                </div>
              </div>

              <NavigationButtons step={step} onBack={back} onNext={next} canProceed={canProceed()} />
            </div>
          )}

          {/* ── Step 3: Contact Information ───────────────────────────────── */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#3b1d60] mb-2">Your contact details</h2>
                <p className="text-muted-foreground text-sm">
                  We will use these details to confirm your appointment. Only the fields marked * are required.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="name">
                      Full name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="email">
                      Email address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="phone">
                      Phone (with country code)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="preferred_contact">Preferred contact method</Label>
                    <select
                      id="preferred_contact"
                      value={preferredContact}
                      onChange={(e) => setPreferredContact(e.target.value)}
                      className="h-11 rounded-xl border bg-background px-3 text-sm"
                    >
                      {["Email", "Phone call", "WhatsApp", "Any"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="organization">Organization / clinic name</Label>
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Sunrise Physiotherapy Clinic"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="job_title">Job title / role</Label>
                    <Input
                      id="job_title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Clinical Director"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Chennai"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border accent-primary"
                      required
                      aria-required="true"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I consent to Physiomatics collecting and storing the information provided above
                      to process this booking enquiry and contact me about my appointment.
                      I understand this platform provides physiotherapy consultation guidance and
                      does not provide medical diagnoses.
                      See our{" "}
                      <Link to="/privacy" className="text-primary underline">
                        Privacy Policy
                      </Link>
                      .{" "}
                      <span className="text-destructive">*</span>
                    </span>
                  </label>
                </div>
              </div>

              <NavigationButtons step={step} onBack={back} onNext={next} canProceed={canProceed()} />
            </div>
          )}

          {/* ── Step 4: Preferred Appointment Time ───────────────────────── */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#3b1d60] mb-2">
                  When would you like to meet?
                </h2>
                <p className="text-muted-foreground text-sm">
                  Tell us your preference — these are not guaranteed slots. Our team will
                  confirm a time that works for both parties within 24 hours.
                </p>
              </div>

              {/* Google Calendar instant booking option */}
              <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <CalendarCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3b1d60]">
                      Book instantly via Google Calendar
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Pick a real available slot — confirmed immediately
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Use our live appointment scheduling calendar to pick a confirmed slot.
                  A Google Meet link will be issued automatically.
                </p>
                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => openGoogleCalendarAppointment("book_page_step4")}
                >
                  <CalendarCheck className="mr-2 size-4" />
                  Open Scheduling Calendar
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Opens in a new tab. After booking in Google Calendar, return here and submit this form so we have your consultation details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or specify a preferred time below</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="preferred_date">
                      <CalendarDays className="inline size-4 mr-1 opacity-70" />
                      Preferred date
                    </Label>
                    <Input
                      id="preferred_date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="preferred_time">
                      <Clock className="inline size-4 mr-1 opacity-70" />
                      Preferred time
                    </Label>
                    <Input
                      id="preferred_time"
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="timezone">
                    <Globe className="inline size-4 mr-1 opacity-70" />
                    Your timezone
                  </Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-11 rounded-xl border bg-background px-3 text-sm"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Default timezone: Asia/Kolkata (IST UTC+5:30). Our team will adjust to your timezone.
                  </p>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="additional_notes">Additional notes</Label>
                  <Textarea
                    id="additional_notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="e.g. I am only available evenings IST; I need a session with a Tamil-speaking therapist..."
                    rows={3}
                    className="rounded-xl bg-background"
                  />
                </div>
              </div>

              <NavigationButtons step={step} onBack={back} onNext={next} canProceed={canProceed()} />
            </div>
          )}

          {/* ── Step 5: Review & Submit ───────────────────────────────────── */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#3b1d60] mb-2">
                  Review your booking
                </h2>
                <p className="text-muted-foreground text-sm">
                  Please review the details below before submitting. You can go back to edit any step.
                </p>
              </div>

              <div className="space-y-4">
                {/* Consultation type */}
                <ReviewSection
                  title="Consultation Type"
                  onEdit={() => setStep(1)}
                  items={[
                    { label: "Type", value: selectedTypeObj?.label || selectedType },
                    { label: "I am a", value: patientType },
                    { label: "Format", value: format },
                    { label: "Language", value: language },
                  ]}
                />

                {/* Requirements */}
                <ReviewSection
                  title="Goals & Requirements"
                  onEdit={() => setStep(2)}
                  items={[
                    { label: "Main goal", value: goal },
                    requirements ? { label: "Requirements", value: requirements } : null,
                    description ? { label: "Additional notes", value: description } : null,
                  ].filter(Boolean) as any}
                />

                {/* Contact */}
                <ReviewSection
                  title="Contact Details"
                  onEdit={() => setStep(3)}
                  items={[
                    { label: "Name", value: name },
                    { label: "Email", value: email },
                    phone ? { label: "Phone", value: phone } : null,
                    organization ? { label: "Organization", value: organization } : null,
                    jobTitle ? { label: "Role", value: jobTitle } : null,
                    country ? { label: "Country", value: country } : null,
                    { label: "Contact method", value: preferredContact },
                  ].filter(Boolean) as any}
                />

                {/* Timing */}
                <ReviewSection
                  title="Preferred Time"
                  onEdit={() => setStep(4)}
                  items={[
                    {
                      label: "Date",
                      value: preferredDate || "Flexible — to be confirmed",
                    },
                    {
                      label: "Time",
                      value: preferredTime || "Flexible",
                    },
                    { label: "Timezone", value: timezone.split(" ")[0] },
                    additionalNotes
                      ? { label: "Notes", value: additionalNotes }
                      : null,
                  ].filter(Boolean) as any}
                />
              </div>

              <div className="rounded-2xl bg-purple-50/80 border border-purple-200 p-4 flex gap-3">
                <Mail className="size-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-900 leading-relaxed">
                  <strong>Email Notification:</strong> Submitting this booking will send an instant confirmation email with your booking reference to <strong>{email || "your email address"}</strong>. An administrative notification and Google Calendar invite will also be issued.
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                <Shield className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <strong>Important:</strong> Submitting this form sends a booking enquiry.
                  Your appointment is confirmed only after our team sends a written confirmation.
                  This platform provides physiotherapy consultation guidance and does not constitute a medical diagnosis.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={back}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={submitting || !privacyConsent}
                  className="flex-1 sm:flex-none px-10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Submitting booking…
                    </>
                  ) : (
                    <>
                      Submit Booking Enquiry <CheckCircle2 className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* WhatsApp fallback */}
              <div className="text-center text-sm text-muted-foreground">
                Prefer to book directly?{" "}
                <a
                  href={whatsappLink(
                    `Hi Physiomatics, I'd like to book a ${selectedTypeObj?.label || selectedType} consultation. Name: ${name}, Email: ${email}`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Send via WhatsApp ({PHONE_NUMBER_DISPLAY})
                </a>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Trust bar */}
      <section className="container-page max-w-3xl pb-16">
        <div className="rounded-2xl border border-border/50 bg-card p-6 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">Privacy First</div>
              <div className="text-xs text-muted-foreground">Your data is handled securely</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">24-hour response</div>
              <div className="text-xs text-muted-foreground">Our team replies within a day</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="size-5 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">No commitment needed</div>
              <div className="text-xs text-muted-foreground">Free initial consultation enquiry</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function NavigationButtons({
  step,
  onBack,
  onNext,
  canProceed,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {step > 1 && (
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
      )}
      <Button
        type="button"
        variant="hero"
        size="lg"
        onClick={onNext}
        disabled={!canProceed}
        className="flex-1 sm:flex-none px-8"
      >
        Continue <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}

function ReviewSection({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: { label: string; value: string }[];
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#3b1d60]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary hover:underline font-medium"
        >
          Edit
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(({ label, value }) => (
          <div key={label}>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium text-foreground">{value || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
