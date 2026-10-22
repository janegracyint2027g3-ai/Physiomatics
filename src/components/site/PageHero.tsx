import type { ReactNode } from "react";

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  description?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  badgeText?: string;
  hideImage?: boolean;
}

function getContextualHeroImage(eyebrow: string): string {
  const e = eyebrow.toLowerCase();
  if (e.includes("platform") || e.includes("analytics") || e.includes("movement") || e.includes("telemetry") || e.includes("training") || e.includes("diagnostic")) {
    return "/images/platform-hero.jpg";
  }
  if (e.includes("how it works") || e.includes("workflow") || e.includes("vision") || e.includes("privacy") || e.includes("security")) {
    return "/images/how-it-works-hero.jpg";
  }
  if (e.includes("resource") || e.includes("library") || e.includes("anatomy") || e.includes("guide") || e.includes("faq")) {
    return "/images/resources-hero.jpg";
  }
  if (e.includes("icp") || e.includes("clinic") || e.includes("physiotherapist") || e.includes("elderly") || e.includes("caregiver") || e.includes("sport") || e.includes("persona")) {
    return "/images/icp-hero.jpg";
  }
  if (e.includes("solution") || e.includes("orthopedic") || e.includes("rehab")) {
    return "/images/solutions/orthopedic.jpg";
  }
  return "/images/about-hero.jpg";
}

function getContextualBadge(eyebrow: string): string {
  const e = eyebrow.toLowerCase();
  if (e.includes("platform") || e.includes("ai")) {
    return "AI Video Kinematics & Joint Angles";
  }
  if (e.includes("how it works") || e.includes("workflow")) {
    return "Clinic-to-Home Live Biofeedback";
  }
  if (e.includes("resource") || e.includes("anatomy")) {
    return "Evidence-Informed Clinical Guides";
  }
  if (e.includes("icp") || e.includes("persona")) {
    return "Multi-Disciplinary Care Personas";
  }
  return "Physiotherapy Movement Intelligence";
}

export function PageHero({
  eyebrow,
  title,
  children,
  description,
  imageSrc,
  imageAlt,
  badgeText,
  hideImage = false,
}: PageHeroProps) {
  const resolvedImage = imageSrc || getContextualHeroImage(eyebrow);
  const resolvedBadge = badgeText || getContextualBadge(eyebrow);
  const content = children ?? description;

  return (
    <section className="bg-hero relative overflow-hidden">
      <div className="container-page py-16 md:py-24 animate-rise">
        {hideImage ? (
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">{title}</h1>
            {content && <div className="mt-6 max-w-2xl text-lg text-muted-foreground">{content}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="eyebrow">{eyebrow}</div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.12]">
                {title}
              </h1>
              {content && (
                <div className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {content}
                </div>
              )}
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full group">
                {/* Ambient Glow */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-primary/25 via-[#5AA9AC]/25 to-primary/20 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main Image Frame */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/80 bg-card shadow-2xl">
                  <img
                    src={resolvedImage}
                    alt={imageAlt || title}
                    className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                  {/* Subtle dark gradient for badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Overlaid Floating Telemetry Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/65 backdrop-blur-md px-3.5 py-2 border border-white/15 text-white">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5AA9AC] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5AA9AC]"></span>
                      </span>
                      <span className="text-[11px] font-semibold tracking-wide truncate">{resolvedBadge}</span>
                    </div>
                    <span className="text-[10px] text-white/70 font-mono shrink-0 ml-2">33 Keypoints • 60 FPS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 text-3xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}
