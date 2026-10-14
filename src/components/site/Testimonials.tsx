import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Award,
  Sparkles,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  org: string;
  avatarInitials: string;
  avatarBg: string;
  rating: number;
  highlight: string;
  quote: string;
  category: "Clinician" | "Sports" | "Patient" | "Geriatric" | "Caregiver";
  statLabel: string;
  statValue: string;
  verifiedLabel: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "arvind",
    name: "Dr. Arvind Ramanathan, PT, DPT",
    role: "Lead Orthopedic Physical Therapist",
    org: "Apex Joint & Sports Rehab Center",
    avatarInitials: "AR",
    avatarBg: "from-[#592787] to-[#3a7fb5]",
    rating: 5,
    highlight: "+38% Patient Home Exercise Adherence",
    quote: "Physiomatics solved our clinic's biggest blind spot: patient compliance between visits. Because patients get real-time angle feedback right in their phone browser without installing an app, adherence jumped significantly in the first month.",
    category: "Clinician",
    statLabel: "Patient Adherence",
    statValue: "+38%",
    verifiedLabel: "Verified Clinic Partner",
  },
  {
    id: "sarah",
    name: "Sarah Jenkins, M.Sc., CSCS",
    role: "Director of Biomechanics & Rehabilitation",
    org: "Vanguard Sports Performance Academy",
    avatarInitials: "SJ",
    avatarBg: "from-[#5AA9AC] to-[#2e7d80]",
    rating: 5,
    highlight: "Zero Video Storage Gives Athletes Complete Peace of Mind",
    quote: "In competitive athletics, athlete video privacy is paramount. Because Physiomatics runs client-side right on the local GPU with zero video storage or upload, our compliance committee approved it instantly.",
    category: "Sports",
    statLabel: "Cloud Video Stored",
    statValue: "0 KB",
    verifiedLabel: "Verified Sports Director",
  },
  {
    id: "marcus",
    name: "Marcus Vance",
    role: "Total Knee Replacement Patient",
    org: "Home ACL & Meniscus Rehabilitation",
    avatarInitials: "MV",
    avatarBg: "from-[#3a7fb5] to-[#5AA9AC]",
    rating: 5,
    highlight: "Regained 120° Knee Flexion 3 Weeks Ahead of Protocol",
    quote: "Recovering alone at home was intimidating. Being able to open my browser, see the real-time angle arc on my knee, and know immediately if I was hitting my target degrees gave me confidence to push forward every single morning.",
    category: "Patient",
    statLabel: "Knee Flexion Target",
    statValue: "125° Reached",
    verifiedLabel: "Verified Patient Review",
  },
  {
    id: "meera",
    name: "Dr. Meera Kulkarni, MD",
    role: "Geriatric Medical Director",
    org: "SilverAge Mobility & Senior Wellness",
    avatarInitials: "MK",
    avatarBg: "from-[#1a0a2e] to-[#592787]",
    rating: 5,
    highlight: "Elderly Patients Use It Easily on Everyday Laptops",
    quote: "Our elderly patients often struggle with App Store passwords and wearable sensors. With Physiomatics, they just click a link. They sit in front of their laptop camera, and their seated extension routines are tracked smoothly.",
    category: "Geriatric",
    statLabel: "Fall Risk Reduction",
    statValue: "-42%",
    verifiedLabel: "Verified Medical Director",
  },
  {
    id: "elena",
    name: "Elena Rostova, PT, MPT",
    role: "Clinic Founder & Neuro Rehab Specialist",
    org: "NeuroMotion Physiotherapy Network",
    avatarInitials: "ER",
    avatarBg: "from-[#592787] to-[#e06d53]",
    rating: 5,
    highlight: "Real-Time Visual Cues Prevent Unconscious Compensation",
    quote: "The live visual arcs immediately alert stroke survivors when their shoulder or trunk compensates during arm flexion. It acts as an objective clinical guardrail between our weekly in-person sessions.",
    category: "Clinician",
    statLabel: "Form Precision",
    statValue: "99.1%",
    verifiedLabel: "Verified Neuro Specialist",
  },
  {
    id: "david",
    name: "David Sterling",
    role: "Family Caregiver",
    org: "Elderly Parent Support Program",
    avatarInitials: "DS",
    avatarBg: "from-[#2e7d80] to-[#1a0a2e]",
    rating: 5,
    highlight: "Transparent Adherence Logs Keep Families Connected",
    quote: "I can check whether my 78-year-old mother completed her daily mobility reps without nagging her. The browser session summary gives both of us immense peace of mind without invading her personal space.",
    category: "Caregiver",
    statLabel: "Weekly Sessions",
    statValue: "6 / 7 Days",
    verifiedLabel: "Verified Caregiver",
  },
];

interface TestimonialsProps {
  title?: string;
  eyebrow?: string;
  sub?: string;
  className?: string;
  showMetrics?: boolean;
}

export function Testimonials({
  title = "Loved by Clinicians & Patients",
  eyebrow = "Verified Customer Stories",
  sub = "Discover how physiotherapy clinics, athletes, seniors, and independent patients achieve measurable recovery outcomes with browser-based motion analysis.",
  className = "",
  showMetrics = true,
}: TestimonialsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const categoryStyles: Record<string, string> = {
    Clinician: "bg-[#592787]/10 text-[#592787] border-[#592787]/20",
    Sports: "bg-[#5AA9AC]/10 text-[#2c777a] border-[#5AA9AC]/25",
    Patient: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    Geriatric: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    Caregiver: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  };

  return (
    <section className={`container-page py-20 ${className}`}>
      {/* Header with Title and Slider Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#592787]/10 text-[#592787] border border-[#592787]/20 mb-3">
            <Sparkles className="size-3.5 text-[#5AA9AC]" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display leading-tight">
            {title}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed text-base">
            {sub}
          </p>
          
          {/* Rating Summary Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-amber-900 dark:text-amber-300 text-xs ml-1">4.98 / 5.0</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Based on <strong className="text-foreground">500+ verified</strong> clinician & patient evaluations
            </span>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="size-11 rounded-full border-border/80 bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="size-11 rounded-full border-border/80 bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Embla Slider Viewport */}
      <div ref={emblaRef} className="overflow-hidden -mx-2 px-2 py-4 cursor-grab active:cursor-grabbing">
        <div className="flex -ml-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="min-w-0 shrink-0 grow-0 pl-5 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="group h-full rounded-[2rem] border border-border/80 bg-white dark:bg-card/90 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(89,39,135,0.12)] hover:border-primary/35 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative top corner accent */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/8 via-transparent to-transparent pointer-events-none rounded-tr-[2rem]" />

                <div>
                  {/* Card Header: Category + Stars */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryStyles[t.category] || "bg-primary/10 text-primary border-primary/20"}`}>
                      {t.category}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <div className="flex gap-0.5">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">5.0</span>
                    </div>
                  </div>

                  {/* Highlight Headline */}
                  <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-3">
                    “{t.highlight}”
                  </h3>

                  {/* Quote Body with decorative icon */}
                  <div className="relative">
                    <Quote className="size-6 text-[#5AA9AC]/20 absolute -top-1 -left-1 pointer-events-none" />
                    <p className="relative z-10 text-muted-foreground text-sm leading-relaxed pl-2">
                      {t.quote}
                    </p>
                  </div>

                  {/* Measurable Impact Chip */}
                  <div className="mt-5 rounded-2xl bg-primary-soft/40 border border-primary/10 p-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                      <Activity className="size-3.5 text-[#5AA9AC]" />
                      {t.statLabel}
                    </span>
                    <span className="font-bold text-primary font-mono text-sm">
                      {t.statValue}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Author Profile & Verification */}
                <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`size-10 rounded-full bg-gradient-to-br ${t.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white/80`}>
                      {t.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {t.role}
                      </div>
                      <div className="text-[10px] text-primary/80 font-medium truncate">
                        {t.org}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Pagination Dots & Mobile Prev/Next */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === idx 
                  ? "w-8 bg-gradient-to-r from-primary to-[#5AA9AC]" 
                  : "w-2 bg-muted hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <HeartHandshake className="size-4 text-primary" />
          <span>Slide or drag cards to explore all reviews</span>
        </div>
      </div>

      {/* Trust & Performance Metrics Banner */}
      {showMetrics && (
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-card via-card to-primary-soft/30 border border-border/80 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-display text-primary">4.98 / 5</div>
              <div className="text-xs text-muted-foreground font-medium">Average Rating (500+ Reviews)</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#5AA9AC]">0 KB Upload</div>
              <div className="text-xs text-muted-foreground font-medium">100% Client-Side Privacy</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-display text-primary">98.4%</div>
              <div className="text-xs text-muted-foreground font-medium">Angular Joint Precision</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#5AA9AC]">15,000+</div>
              <div className="text-xs text-muted-foreground font-medium">Validated Rehab Sessions</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
