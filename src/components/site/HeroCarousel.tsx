import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import hero from '@/assets/hero.jpg';
import rehab from '@/assets/rehab.jpg';

const slides = [
  {
    title: 'Move Better. Recover Smarter.',
    description: 'Explore AI-assisted physiotherapy training and video-based movement monitoring designed to support rehabilitation.',
    cta: 'Explore the Platform',
    link: '/platform',
    image: hero,
  },
  {
    title: 'Supporting Movement at Every Age',
    description: 'Accessible exercise guidance and structured progress monitoring to support elderly individuals following appropriate rehabilitation programs.',
    cta: 'Explore Elderly Care',
    link: '/solutions',
    image: rehab,
  },
  {
    title: 'Make Every Rehabilitation Session Count',
    description: 'Record supported exercise sessions, analyze movement patterns, and track progress over time with physiotherapist oversight.',
    cta: 'Discover Rehabilitation',
    link: '/solutions',
    image: hero,
  },
  {
    title: 'Bring Movement Insights Into Your Practice',
    description: 'Explore video-assisted exercise monitoring, session history, and progress visualization for physiotherapy workflows.',
    cta: 'Request a Demo',
    link: '/contact',
    image: rehab,
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
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
    <section className="relative bg-hero">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div className="min-w-0 flex-[0_0_100%]" key={index}>
              <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
                <div className="animate-rise">
                  <div className="eyebrow">Physiotherapy training online</div>
                  <h1 className="mt-5 text-5xl leading-[1.05] md:text-7xl">{slide.title}</h1>
                  <p className="mt-6 max-w-xl text-lg text-muted-foreground">{slide.description}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild variant="hero" size="lg"><Link to={slide.link}>{slide.cta} <ArrowRight /></Link></Button>
                  </div>
                </div>
                <div className="relative animate-rise [animation-delay:150ms]">
                  <img src={slide.image} alt={slide.title} width={1408} height={1056} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-page pb-12 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all ${index === selectedIndex ? 'w-6 bg-primary' : 'bg-primary/30 hover:bg-primary/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleAutoplay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={scrollPrev} aria-label="Previous slide">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={scrollNext} aria-label="Next slide">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
