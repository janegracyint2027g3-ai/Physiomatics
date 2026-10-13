import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles, ShieldCheck, Activity, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { whatsappLink, WA_MESSAGES } from '@/lib/site';
import clinicInterior from '@/assets/clinic_interior.jpg';
import elderlyExercise from '@/assets/elderly_exercise.jpg';
import sportsBio from '@/assets/sports_biomechanics.jpg';
import rehabMirror from '@/assets/rehab_patient_mirror.jpg';

interface SlideItem {
  eyebrow: string;
  badgePill: string;
  title: string;
  description: string;
  ctaPrimary: string;
  linkPrimary: string;
  ctaSecondary: string;
  linkSecondary: string;
  isExternalSecondary?: boolean;
  trust: string;
  image: string;
  badgeTop: string;
  metricLabel: string;
  metricChange: string;
  metricValue: string;
  metricSub: string;
}

const slides: SlideItem[] = [
  {
    eyebrow: 'Physiotherapy Training Online',
    badgePill: '✨ CLINICAL AI WORKFLOWS',
    title: 'Bring Movement Insights Into Your Practice',
    description: 'Explore video-assisted exercise monitoring, session history, and practice retention for modern physiotherapy clinics.',
    ctaPrimary: 'Request Clinic Demo',
    linkPrimary: '/icp/clinics',
    ctaSecondary: 'Explore Platform',
    linkSecondary: '/platform',
    trust: 'Active in 500+ Clinics • On-Device AI • Zero Video Upload',
    image: clinicInterior,
    badgeTop: 'Real-time Telemetry: Active',
    metricLabel: 'Kinematic Compliance',
    metricChange: '+28% YoY',
    metricValue: '98.4%',
    metricSub: 'Session accuracy across 32 clinics',
  },
  {
    eyebrow: 'Elderly Care & Home Companionship',
    badgePill: '✨ GERIATRIC MOBILITY & SAFETY',
    title: 'Warm, Dignified Care for Your Loved Ones',
    description: 'Geriatric-certified guidance, gentle companionship routines, medication reminders, and mobility support for safe independent living.',
    ctaPrimary: 'Book Elderly Care',
    linkPrimary: '/icp/elderly-care',
    ctaSecondary: 'Chat on WhatsApp',
    linkSecondary: whatsappLink(WA_MESSAGES.elderly),
    isExternalSecondary: true,
    trust: 'Certified Guidance • Seated Routines • < 20m Dispatch Support',
    image: elderlyExercise,
    badgeTop: 'Fall Prevention: Active',
    metricLabel: 'Fall Risk Reduction',
    metricChange: '+42% safer',
    metricValue: '94.2%',
    metricSub: 'Balance stability score',
  },
  {
    eyebrow: 'High-Performance Biomechanics',
    badgePill: '⚡ KINEMATIC AI FOR ATHLETES',
    title: 'Precision Kinematic AI for Athletes',
    description: 'Real-time joint symmetry tracking, valgus angles, and return-to-sport clearance metrics on any device camera without sensors.',
    ctaPrimary: 'Discover Sports Performance',
    linkPrimary: '/icp/sports-academies',
    ctaSecondary: 'Try Live AI Demo',
    linkSecondary: '/analyze',
    trust: 'Sub-degree Joint Precision • Bilateral Symmetry Comparison',
    image: sportsBio,
    badgeTop: 'Pose Engine: 60 FPS',
    metricLabel: 'Bilateral Symmetry',
    metricChange: 'Clearance Met',
    metricValue: '99.1%',
    metricSub: 'Dynamic valgus deviation < 3°',
  },
  {
    eyebrow: 'Rehabilitation & Recovery',
    badgePill: '🌱 EVIDENCE-BASED REHAB',
    title: 'Move Better. Recover Smarter.',
    description: 'Accessible exercise guidance and structured progress monitoring designed to support rehabilitation from home to clinical recovery.',
    ctaPrimary: 'Explore the Platform',
    linkPrimary: '/platform',
    ctaSecondary: 'How It Works',
    linkSecondary: '/how-it-works',
    trust: '100% On-Device Pose AI • Complete Patient Privacy',
    image: rehabMirror,
    badgeTop: 'Form Guidance: On Track',
    metricLabel: 'Range of Motion',
    metricChange: '+15° this week',
    metricValue: '135°',
    metricSub: 'Knee extension target reached',
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5500, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  
  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-soft/25 to-background border-b border-border/40">
      {/* ── TRANSLUCENT NEAT AMBIENT BACKGROUND & DOTTED GRID (Sample 1 Match) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft atmospheric lavender/purple glow on top-left */}
        <div className="absolute -top-32 -left-32 size-[32rem] rounded-full bg-[#592787]/[0.08] blur-[110px]" />
        {/* Soft atmospheric aqua/teal glow on top-right */}
        <div className="absolute -top-28 -right-28 size-[34rem] rounded-full bg-[#5AA9AC]/[0.14] blur-[120px]" />
        {/* Soft pearl-blue ambient glow in lower-center */}
        <div className="absolute bottom-0 left-1/3 size-[28rem] rounded-full bg-[#3a7fb5]/[0.06] blur-[100px]" />
        
        {/* Technical Translucent Dotted Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: 'radial-gradient(circle, #592787 1.25px, transparent 1.25px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Gentle diagonal shine line */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(90, 169, 172, 0.15) 50%, transparent 60%)',
          }}
        />
      </div>

      {/* ── EMBLA CAROUSEL SLIDES ── */}
      <div className="overflow-hidden relative z-10" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div className="min-w-0 flex-[0_0_100%]" key={index}>
              <div className="container-page grid items-center gap-10 lg:gap-14 py-14 sm:py-20 md:py-24 lg:grid-cols-2">
                
                {/* ── LEFT: Typography & CTA Buttons ── */}
                <div className="animate-rise z-10">
                  {/* Eyebrow badge with icon */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary backdrop-blur-md shadow-xs">
                    <Sparkles className="size-3.5 text-primary" />
                    <span>{slide.eyebrow}</span>
                  </div>

                  {/* Main Display Headline (Sample 1) */}
                  <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-[4.15rem] font-serif font-bold text-[#3b1d60] leading-[1.08] tracking-tight">
                    {slide.title}
                  </h1>

                  {/* Description Paragraph */}
                  <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground/90 leading-relaxed font-sans">
                    {slide.description}
                  </p>

                  {/* Dual Action Buttons (Sample 1 & Sample 2) */}
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <Button 
                      asChild 
                      size="lg" 
                      className="rounded-full px-7 py-3.5 bg-[#5AA9AC] hover:bg-[#48989b] text-white shadow-lg shadow-[#5AA9AC]/25 font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Link to={slide.linkPrimary}>
                        {slide.ctaPrimary} <ArrowRight className="size-4 ml-1.5" />
                      </Link>
                    </Button>

                    {slide.isExternalSecondary ? (
                      <Button 
                        asChild 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-6 py-3.5 bg-white/80 hover:bg-white border-border/80 text-foreground backdrop-blur-md shadow-xs font-medium text-base transition-all hover:shadow-sm"
                      >
                        <a href={slide.linkSecondary} target="_blank" rel="noreferrer">
                          {slide.ctaSecondary}
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        asChild 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-6 py-3.5 bg-white/80 hover:bg-white border-border/80 text-foreground backdrop-blur-md shadow-xs font-medium text-base transition-all hover:shadow-sm"
                      >
                        <Link to={slide.linkSecondary}>
                          {slide.ctaSecondary}
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Trust Badge under buttons (Sample 2) */}
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ShieldCheck className="size-4 text-[#5AA9AC] shrink-0" />
                    <span>{slide.trust}</span>
                  </div>
                </div>

                {/* ── RIGHT: Translucent Card with rounded photo & telemetry badges (Sample 1) ── */}
                <div className="relative animate-rise [animation-delay:150ms] group">
                  {/* Atmospheric glow behind the card */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/15 via-[#5AA9AC]/20 to-transparent rounded-[3rem] blur-2xl opacity-60 transition duration-500 group-hover:opacity-85" />
                  
                  {/* Clean rounded card shell */}
                  <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/90 shadow-[0_25px_60px_-15px_rgba(89,39,135,0.18)] bg-card/60 backdrop-blur-md ring-1 ring-black/[0.04]">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      width={1408} 
                      height={1056} 
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
                    />
                    
                    {/* Top-left floating translucent pill badge */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-lg px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-2.5">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] sm:text-xs font-bold text-foreground tracking-wide">{slide.badgeTop}</span>
                    </div>

                    {/* Bottom-right floating translucent telemetry micro-card */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-2xl bg-white/92 backdrop-blur-xl border border-white/80 shadow-xl p-3.5 sm:p-4 max-w-[210px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{slide.metricLabel}</span>
                        <span className="text-[11px] font-black text-emerald-600">{slide.metricChange}</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-display text-primary leading-tight">{slide.metricValue}</div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground/85 mt-0.5">{slide.metricSub}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FLOATING CIRCULAR ARROWS ON LEFT & RIGHT (Sample 2 Match) ── */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 size-11 md:size-12 rounded-full bg-white/80 hover:bg-white text-foreground/80 hover:text-foreground backdrop-blur-xl border border-white/80 shadow-lg transition-all items-center justify-center hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 size-11 md:size-12 rounded-full bg-white/80 hover:bg-white text-foreground/80 hover:text-foreground backdrop-blur-xl border border-white/80 shadow-lg transition-all items-center justify-center hover:scale-105 active:scale-95"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* ── BOTTOM DOCKED CONTROLS BAR (Sample 2 Match) ── */}
      <div className="container-page pb-10 pt-2 flex items-center justify-between relative z-10">
        {/* Progress dashes dock (Sample 2) */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 backdrop-blur-xl border border-white/70 shadow-xs">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-8 bg-gradient-to-r from-primary to-[#5AA9AC]'
                  : 'w-2.5 bg-primary/20 hover:bg-primary/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter + Play/Pause dock */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/75 backdrop-blur-xl border border-white/70 shadow-xs">
          <span className="text-xs font-bold text-muted-foreground/90 tracking-wider tabular-nums">
            {selectedIndex + 1} / {slides.length}
          </span>
          <div className="h-3 w-px bg-border/80" />
          <button
            onClick={toggleAutoplay}
            aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
            className="size-6 grid place-items-center rounded-full hover:bg-primary/10 text-primary transition"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
