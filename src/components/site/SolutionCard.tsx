import React from "react";
import { Link } from "@tanstack/react-router";
import { 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  Bandage, 
  Trophy, 
  HeartHandshake, 
  Gauge, 
  Layers, 
  Users, 
  UserCheck, 
  Sparkles 
} from "lucide-react";
import type { PhysiotherapySolution } from "@/data/physiotherapySolutions";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Bandage,
  Trophy,
  HeartHandshake,
  Gauge,
  Layers,
  Users,
  UserCheck,
};

interface SolutionCardProps {
  solution: PhysiotherapySolution;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const IconComponent = iconMap[solution.iconName] || Activity;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#592787]/40 hover:shadow-[0_20px_50px_-12px_rgba(89,39,135,0.18)]">
      {/* Thumbnail Header */}
      <div className="relative h-56 w-full overflow-hidden bg-muted/40">
        <img
          src={solution.image}
          alt={solution.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Soft overlay gradient with purple/teal tints */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Tag Pill */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold tracking-wider text-[#592787] uppercase shadow-md backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[#5AA9AC]" />
            {solution.tag}
          </span>
        </div>

        {/* Floating Category Icon Badge */}
        <div className="absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-2xl bg-white/95 text-[#592787] shadow-lg backdrop-blur-md ring-1 ring-white/50">
          <IconComponent className="size-6" />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div className="space-y-3.5">
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {solution.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {solution.shortDesc}
          </p>

          {/* Focus Areas Chips */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
              Primary Focus Areas
            </div>
            <div className="flex flex-wrap gap-1.5">
              {solution.focusAreas.slice(0, 3).map((area, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80 font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card CTA Footer */}
        <div className="mt-6 pt-5 border-t border-border/70 flex items-center justify-between">
          <Link
            to={`/solutions/${solution.slug}` as any}
            className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#592787] dark:text-[#a78bfa] hover:text-primary transition-colors"
          >
            <span>Explore Solution</span>
            <div className="flex size-7 items-center justify-center rounded-full bg-[#592787]/10 text-[#592787] dark:bg-white/10 dark:text-white transition-transform group-hover/link:translate-x-1">
              <ArrowRight className="size-3.5" />
            </div>
          </Link>
          <span className="text-[11px] font-mono text-muted-foreground">
            Phased Guide
          </span>
        </div>
      </div>
    </article>
  );
}
