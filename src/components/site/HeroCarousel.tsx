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
    trust: 'On-Device AI • Zero Video Upload • Clinical Grade Framework',
    image: clinicInterior,
    badgeTop: 'Real-time Telemetry: Active',
    metricLabel: 'Sample Metric: Adherence',
    metricChange: '+28% Trend',
    metricValue: '98.4%',
    metricSub: 'Illustrative session compliance benchmark',
  },
  {
    eyebrow: 'Elderly Care & Home Companionship',
    badgePill: '✨ GERIATRIC MOBILITY & SAFETY',
    title: 'Warm, Dignified Care for Your Loved Ones',
    description: 'Geriatric-certified guidance, gentle companionship routines, medication reminders, and mobility support for safe independent living.',
    ctaPrimary: 'Book Elderly Care',
    linkPrimary: '/icp/elderly-care',
    ctaSecondary: 'Chat on WhatsApp (7845072426)',
    linkSecondary: whatsappLink(WA_MESSAGES.elderly),
    isExternalSecondary: true,
    trust: 'Certified Guidance • Seated Routines • Direct Care Support',
    image: elderlyExercise,
    badgeTop: 'Fall Risk Screening: Guidance',
    metricLabel: 'Sample Metric: Stability',
    metricChange: 'Improving',
    metricValue: '94.2%',
    metricSub: 'Illustrative balance stability score',
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
    trust: 'Joint Angle Tracking • Bilateral Symmetry Comparison',
    image: sportsBio,
    badgeTop: 'Pose Engine: Real-time',
    metricLabel: 'Sample Metric: Symmetry',
    metricChange: 'Clearance Met',
    metricValue: '99.1%',
    metricSub: 'Sample dynamic valgus measurement',
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
    metricLabel: 'Sample Progress: ROM',
    metricChange: '+15° Trend',
    metricValue: '135°',
    metricSub: 'Illustrative knee extension target',
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
    <section className="relative overflow-hidden border-b border-white/5" style={{ background: 'linear-gradient(135deg, #0d0818 0%, #1a0d35 40%, #0f1a2e 70%, #0d1520 100%)' }}>
      {/* ── ANIMATED DARK PURPLE MESH BACKGROUND ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Animated orb 1 — large primary purple, drifts slowly */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: '55rem', height: '55rem',
            top: '-18rem', left: '-12rem',
            background: 'radial-gradient(circle at center, #7c3aed 0%, #592787 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'heroOrbDrift1 18s ease-in-out infinite alternate',
          }}
        />
        {/* Animated orb 2 — mid teal-aqua, drifts from right */}
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: '42rem', height: '42rem',
            top: '-8rem', right: '-14rem',
            background: 'radial-gradient(circle at center, #5AA9AC 0%, #2d6b7a 45%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'heroOrbDrift2 22s ease-in-out infinite alternate',
          }}
        />
        {/* Animated orb 3 — deep indigo, anchored bottom-left */}
        <div
          className="absolute rounded-full opacity-25"
          style={{
            width: '36rem', height: '36rem',
            bottom: '-10rem', left: '15%',
            background: 'radial-gradient(circle at center, #4c1d95 0%, #1e1152 50%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'heroOrbDrift3 26s ease-in-out infinite alternate',
          }}
        />
        {/* Shimmer sweep — slow diagonal gloss */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(115deg, transparent 30%, rgba(168,85,247,0.25) 50%, transparent 70%)',
            animation: 'heroShimmer 8s ease-in-out infinite',
          }}
        />
        {/* Fine purple grid lines (not dots) */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* CSS keyframes injected once via style tag */}
      <style>{`
        @keyframes heroOrbDrift1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.12); }
        }
        @keyframes heroOrbDrift2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, 60px) scale(1.08); }
        }
        @keyframes heroOrbDrift3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -50px) scale(1.15); }
        }
        @keyframes heroShimmer {
          0%, 100% { opacity: 0.06; background-position: -200% 0; }
          50%       { opacity: 0.14; background-position:  200% 0; }
        }
      `}</style>

      {/* ── EMBLA CAROUSEL SLIDES ── */}
      <div className="overflow-hidden relative z-10" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div className="min-w-0 flex-[0_0_100%]" key={index}>
              <div className="container-page grid items-center gap-10 lg:gap-14 py-14 sm:py-20 md:py-24 lg:grid-cols-2">
                
                {/* ── LEFT: Typography & CTA Buttons ── */}
                <div className="animate-rise z-10">
                  {/* Eyebrow badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-500/20 border border-purple-400/30 text-purple-300 backdrop-blur-md shadow-xs">
                    <Sparkles className="size-3.5 text-purple-300" />
                    <span>{slide.eyebrow}</span>
                  </div>

                  {/* Main Headline — white on dark */}
                  <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-[4.15rem] font-serif font-bold text-white leading-[1.08] tracking-tight drop-shadow-[0_2px_24px_rgba(124,58,237,0.35)]">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-6 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed font-sans">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <Button 
                      asChild 
                      size="lg" 
                      className="rounded-full px-7 py-3.5 bg-[#5AA9AC] hover:bg-[#48989b] text-white shadow-lg shadow-[#5AA9AC]/30 font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                        className="rounded-full px-6 py-3.5 bg-white/10 hover:bg-white/20 border-white/25 text-white backdrop-blur-md shadow-xs font-medium text-base transition-all hover:shadow-sm"
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
                        className="rounded-full px-6 py-3.5 bg-white/10 hover:bg-white/20 border-white/25 text-white backdrop-blur-md shadow-xs font-medium text-base transition-all hover:shadow-sm"
                      >
                        <Link to={slide.linkSecondary}>
                          {slide.ctaSecondary}
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/45">
                    <ShieldCheck className="size-4 text-[#5AA9AC] shrink-0" />
                    <span>{slide.trust}</span>
                  </div>
                </div>

                {/* ── RIGHT: Card with photo & telemetry badges ── */}
                <div className="relative animate-rise [animation-delay:150ms] group">
                  {/* Atmospheric glow behind card */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-purple-700/30 via-[#5AA9AC]/20 to-transparent rounded-[3rem] blur-2xl opacity-70 transition duration-500 group-hover:opacity-100" />
                  
                  {/* Rounded card shell */}
                  <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/15 shadow-[0_25px_60px_-15px_rgba(89,39,135,0.5)] bg-white/5 backdrop-blur-md ring-1 ring-purple-500/10">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      width={1408} 
                      height={1056} 
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
                    />
                    
                    {/* Top-left floating badge — translucent dark glass */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-lg px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-2.5">
                      <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] sm:text-xs font-bold text-white/90 tracking-wide">{slide.badgeTop}</span>
                    </div>

                    {/* Bottom-right telemetry micro-card — purple glass */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-2xl backdrop-blur-xl border border-purple-400/25 shadow-xl p-3.5 sm:p-4 max-w-[210px]" style={{ background: 'rgba(30,12,60,0.75)' }}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{slide.metricLabel}</span>
                        <span className="text-[11px] font-black text-emerald-400">{slide.metricChange}</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-display text-purple-300 leading-tight">{slide.metricValue}</div>
                      <div className="text-[10px] sm:text-[11px] text-white/45 mt-0.5">{slide.metricSub}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NAV ARROWS ── */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 size-11 md:size-12 rounded-full bg-white/10 hover:bg-purple-500/30 text-white backdrop-blur-xl border border-white/20 shadow-lg transition-all items-center justify-center hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 size-11 md:size-12 rounded-full bg-white/10 hover:bg-purple-500/30 text-white backdrop-blur-xl border border-white/20 shadow-lg transition-all items-center justify-center hover:scale-105 active:scale-95"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* ── BOTTOM CONTROLS BAR ── */}
      <div className="container-page pb-10 pt-2 flex items-center justify-between relative z-10">
        {/* Progress dashes */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl border border-white/15 shadow-xs" style={{ background: 'rgba(88,39,135,0.35)' }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-8 bg-gradient-to-r from-purple-400 to-[#5AA9AC]'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter + Play/Pause */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl border border-white/15 shadow-xs" style={{ background: 'rgba(88,39,135,0.35)' }}>
          <span className="text-xs font-bold text-white/60 tracking-wider tabular-nums">
            {selectedIndex + 1} / {slides.length}
          </span>
          <div className="h-3 w-px bg-white/20" />
          <button
            onClick={toggleAutoplay}
            aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
            className="size-6 grid place-items-center rounded-full hover:bg-purple-500/30 text-purple-300 transition"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
