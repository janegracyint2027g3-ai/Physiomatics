import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Activity, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight,
  ScanLine,
  Gauge,
  LineChart,
  BarChart3,
  Building2,
  Stethoscope,
  UserCheck,
  HeartHandshake,
  Users,
  Trophy,
  Bandage,
  GraduationCap,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Workflow,
  Eye,
  ShieldCheck,
  Target,
  Sparkles,
  Calendar,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  platformMenu, 
  icpCategories, 
  solutionsCategories, 
  resourcesMenu, 
  howItWorksMenu, 
  aboutMenu, 
  contactMenu,
  MenuItem 
} from "@/lib/site";

// Icon mapping helper
const iconMap: Record<string, any> = {
  ScanLine,
  Activity,
  Gauge,
  LineChart,
  BarChart3,
  Building2,
  Stethoscope,
  UserCheck,
  HeartHandshake,
  Users,
  Trophy,
  Bandage,
  GraduationCap,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Workflow,
  Eye,
  ShieldCheck,
  Target,
  Sparkles,
  Calendar,
  Mail,
};

function renderIcon(name?: string, className: string = "size-5") {
  const IconComponent = name ? iconMap[name] : Activity;
  return IconComponent ? <IconComponent className={className} /> : <Activity className={className} />;
}

/* 
  Contrasting Luxury Megamenu:
  - Supports 'align': "left" | "center" | "right" so items near the viewport edges don't overflow!
  - Left Panel: Deep black (#0a0a0c) with warm gold/purple subtle accents and selected tab styling
  - Right Panel: Clean off-white/cream luxury background with purple borders and badge tags
  - Bottom Bar: Contrasting call-to-action strip with direct action button
*/
function ContrastMegamenu({
  label,
  to,
  sidebarEyebrow = "PRACTICE AREAS & CAPABILITIES",
  sidebarTitle,
  categories,
  ctaText = "Need help identifying the right solution?",
  ctaButtonText = "Talk to a Specialist →",
  ctaLink = "/contact",
  align = "center"
}: {
  label: string;
  to: string;
  sidebarEyebrow?: string;
  sidebarTitle?: string;
  categories: readonly { id: string; label: string; description?: string; items: readonly MenuItem[] }[];
  ctaText?: string;
  ctaButtonText?: string;
  ctaLink?: string;
  align?: "left" | "center" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const activeCategory = categories[activeTab] || categories[0];

  const positionClasses = 
    align === "left" 
      ? "left-0 translate-x-0" 
      : align === "right" 
      ? "right-0 translate-x-0" 
      : "left-1/2 -translate-x-1/2";

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setOpen(true)} 
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/85 hover:text-foreground hover:bg-primary/5 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        {label} <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>

      {open && (
        <div className={`absolute ${positionClasses} top-full z-50 w-[54rem] max-w-[calc(100vw-2rem)] pt-3 animate-in fade-in-0 slide-in-from-top-2 duration-200`}>
          <div className="overflow-hidden rounded-[2rem] border border-border/80 bg-[#fbfaf8] text-foreground shadow-2xl ring-1 ring-black/10">
            {/* Top Grid: Contrast Split */}
            <div className="grid grid-cols-[240px_1fr] min-h-[360px]">
              
              {/* LEFT COLUMN: Premium Black & Purple Velvet Panel */}
              <div className="bg-[#0f0b15] p-6 text-white flex flex-col justify-between border-r border-[#261d33]">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#c4a572] uppercase font-sans">
                    {sidebarEyebrow}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-white mb-6">
                    {sidebarTitle || label}
                  </h3>

                  {/* Navigation Category Items (Left Sidebar) */}
                  <div className="space-y-1.5">
                    {categories.map((cat, idx) => {
                      const isActive = activeTab === idx;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setActiveTab(idx)}
                          onClick={() => setActiveTab(idx)}
                          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-medium transition-all ${
                            isActive
                              ? "bg-[#251838] text-white shadow-inner font-semibold border border-purple-500/30"
                              : "text-zinc-400 hover:bg-[#1a1326] hover:text-white"
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          <ChevronRight className={`size-3.5 transition-transform ${isActive ? "text-[#c4a572] translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Left Bottom Link */}
                <div className="pt-6 border-t border-[#261d33]">
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                  >
                    <span>View all {label.toLowerCase()}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Light Crisp Panel With Contrasting Cards */}
              <div className="p-7 bg-[#fdfcf9] flex flex-col justify-between">
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-200/80">
                    <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7336ad] font-sans">
                      {activeCategory.label.toUpperCase()}
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">
                      {activeCategory.items.length} items
                    </span>
                  </div>

                  {/* Grid of Cards */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {activeCategory.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to as any}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:ring-1 hover:ring-primary/20"
                      >
                        <div className="mt-0.5 shrink-0 rounded-xl bg-purple-50 p-2.5 text-[#592787] border border-purple-100 group-hover:bg-[#592787] group-hover:text-white transition-colors duration-200">
                          {renderIcon(item.icon, "size-4.5")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-zinc-900 group-hover:text-[#592787] transition-colors leading-snug">
                            {item.label}
                          </div>
                          {item.tag && (
                            <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mt-0.5 font-sans">
                              {item.tag}
                            </div>
                          )}
                          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right Bottom Footer Link */}
                <div className="pt-5 mt-5 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
                  <span>Direct practice access</span>
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="font-medium text-[#592787] hover:underline flex items-center gap-1 group"
                  >
                    <span>Browse all {label}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* BOTTOM FOOTER BAR: Contrasting Light Sand Strip */}
            <div className="flex items-center justify-between px-8 py-3.5 bg-[#f5f1ea] border-t border-zinc-200/80">
              <span className="text-xs text-zinc-700 font-medium">
                {ctaText}
              </span>
              <Button asChild size="sm" className="rounded-full bg-[#3d2719] hover:bg-[#2c1b10] text-[#fbf7f0] text-xs h-8 px-4 font-semibold shadow-sm">
                <Link to={ctaLink as any} onClick={() => setOpen(false)}>
                  {ctaButtonText}
                </Link>
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Compact Megamenu for Single-category lists (Platform, Resources, About, How It Works)
function CompactMegamenu({
  label,
  to,
  sidebarEyebrow = "OVERVIEW",
  items,
  ctaText = "Ready to explore live?",
  ctaButtonText = "Try Free Live Demo →",
  ctaLink = "/analyze",
  align = "center"
}: {
  label: string;
  to: string;
  sidebarEyebrow?: string;
  items: readonly MenuItem[];
  ctaText?: string;
  ctaButtonText?: string;
  ctaLink?: string;
  align?: "left" | "center" | "right";
}) {
  const [open, setOpen] = useState(false);

  // When align is "left", align directly under button or left edge of navbar
  const positionClasses = 
    align === "left" 
      ? "left-0 translate-x-0" 
      : align === "right" 
      ? "right-0 translate-x-0" 
      : "left-1/2 -translate-x-1/2";

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setOpen(true)} 
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/85 hover:text-foreground hover:bg-primary/5 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        {label} <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>

      {open && (
        <div className={`absolute ${positionClasses} top-full z-50 w-[50rem] max-w-[calc(100vw-2rem)] pt-3 animate-in fade-in-0 slide-in-from-top-2 duration-200`}>
          <div className="overflow-hidden rounded-[2rem] border border-border/80 bg-[#fbfaf8] text-foreground shadow-2xl ring-1 ring-black/10">
            {/* Top Grid: Split Panel */}
            <div className="grid grid-cols-[220px_1fr] min-h-[320px]">
              {/* Left Dark Purple / Black Panel */}
              <div className="bg-[#0f0b15] p-6 text-white flex flex-col justify-between border-r border-[#261d33]">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#c4a572] uppercase font-sans">
                    {sidebarEyebrow}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-white mb-4">
                    {label}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    AI-assisted video kinematics, precision angular tracking, and structured recovery guidance.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#261d33]">
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                  >
                    <span>View all {label.toLowerCase()}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* Right Crisp Panel */}
              <div className="p-7 bg-[#fdfcf9] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200/80">
                    <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7336ad] font-sans">
                      CORE CAPABILITIES
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">{items.length} items</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to as any}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                      >
                        <div className="mt-0.5 shrink-0 rounded-xl bg-purple-50 p-2 text-[#592787] border border-purple-100 group-hover:bg-[#592787] group-hover:text-white transition-colors duration-200">
                          {renderIcon(item.icon, "size-4")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-zinc-900 group-hover:text-[#592787] transition-colors leading-snug">
                            {item.label}
                          </div>
                          {item.tag && (
                            <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mt-0.5 font-sans">
                              {item.tag}
                            </div>
                          )}
                          <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
                  <span>Client-side pose telemetry</span>
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="font-medium text-[#592787] hover:underline flex items-center gap-1 group"
                  >
                    <span>Browse all</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="flex items-center justify-between px-8 py-3.5 bg-[#f5f1ea] border-t border-zinc-200/80">
              <span className="text-xs text-zinc-700 font-medium">
                {ctaText}
              </span>
              <Button asChild size="sm" className="rounded-full bg-[#3d2719] hover:bg-[#2c1b10] text-[#fbf7f0] text-xs h-8 px-4 font-semibold shadow-sm">
                <Link to={ctaLink as any} onClick={() => setOpen(false)}>
                  {ctaButtonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight shrink-0" aria-label="Physiomatics home">
          <img
            src="/logo-64.png"
            alt="Physiomatics"
            className="size-8 rounded-full object-cover shadow-sm ring-1 ring-border/40"
            loading="eager"
          />
          <span>Physiomatics</span>
        </Link>

        {/* Desktop Navigation with Proper Alignments to stay in frame */}
        <nav className="hidden items-center lg:flex" aria-label="Main">
          {/* About Menu: Align "left" so it stays neatly within the screen and doesn't get clipped on the left! */}
          <CompactMegamenu 
            label="About" 
            to="/about" 
            sidebarEyebrow="WHO WE ARE" 
            items={aboutMenu}
            ctaText="Interested in our clinical research and mission?"
            ctaButtonText="Read Mission →"
            ctaLink="/about/mission"
            align="left"
          />

          {/* Platform Menu: Align "left" */}
          <CompactMegamenu 
            label="Platform" 
            to="/platform" 
            sidebarEyebrow="CORE ARCHITECTURE" 
            items={platformMenu}
            ctaText="Try our browser-based AI video analysis instantly."
            ctaButtonText="Test in Browser →"
            ctaLink="/analyze"
            align="left"
          />

          {/* Solutions Menu: Center */}
          <ContrastMegamenu 
            label="Solutions" 
            to="/solutions" 
            sidebarEyebrow="CLINICAL USE CASES" 
            sidebarTitle="Solutions"
            categories={solutionsCategories}
            ctaText="Need guidance designing your clinic's remote rehabilitation program?"
            ctaButtonText="Talk to a Specialist →"
            ctaLink="/contact"
            align="center"
          />

          {/* How It Works Menu: Center */}
          <CompactMegamenu 
            label="How It Works" 
            to="/how-it-works" 
            sidebarEyebrow="HOW IT WORKS" 
            items={howItWorksMenu}
            ctaText="Learn how on-device AI safeguards patient privacy."
            ctaButtonText="View Security Whitepaper →"
            ctaLink="/how-it-works/privacy"
            align="center"
          />

          {/* Resources Menu: Center / Right */}
          <CompactMegamenu 
            label="Resources" 
            to="/resources" 
            sidebarEyebrow="KNOWLEDGE BASE" 
            items={resourcesMenu}
            ctaText="Explore our verified clinical exercises and goniometric angles."
            ctaButtonText="Browse Library →"
            ctaLink="/resources/library"
            align="center"
          />

          {/* ICP Profiles Menu: Align "right" so it never overflows off the right edge */}
          <ContrastMegamenu 
            label="ICP Profiles" 
            to="/icp" 
            sidebarEyebrow="IDEAL CUSTOMER PROFILES" 
            sidebarTitle="Target Personas"
            categories={icpCategories}
            ctaText="Looking for a custom plan tailored to your specific organization?"
            ctaButtonText="Book Custom Demo →"
            ctaLink="/contact/demo"
            align="right"
          />

          {/* Contact Menu: Align "right" */}
          <CompactMegamenu 
            label="Contact" 
            to="/contact" 
            sidebarEyebrow="GET IN TOUCH" 
            items={contactMenu}
            ctaText="Want an immediate response on WhatsApp?"
            ctaButtonText="Chat on WhatsApp →"
            ctaLink="/contact/enquiry"
            align="right"
          />
        </nav>

        {/* Desktop Quick Actions */}
        <div className="hidden items-center gap-2 lg:flex shrink-0">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-xs">
            <Link to="/analyze">Try analysis</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-5 text-xs font-semibold shadow-sm">
            <Link to="/contact">Book a Demo</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden p-2 text-foreground" 
          aria-label="Toggle menu" 
          aria-expanded={mobile} 
          onClick={() => setMobile((m) => !m)}
        >
          {mobile ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobile && (
        <nav className="container-page grid gap-1 border-t py-4 lg:hidden max-h-[80vh] overflow-y-auto bg-background" aria-label="Mobile">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 pt-2">Menu</div>
          {[
            { to: "/about", label: "About" },
            { to: "/platform", label: "Platform" },
            { to: "/solutions", label: "Solutions" },
            { to: "/how-it-works", label: "How It Works" },
            { to: "/resources", label: "Resources" },
            { to: "/icp", label: "ICP Profiles" },
            { to: "/contact", label: "Contact" },
          ].map((l) => (
            <Link 
              key={l.to} 
              to={l.to as any} 
              onClick={() => setMobile(false)} 
              className="rounded-xl px-3 py-2.5 text-base font-medium hover:bg-accent flex items-center justify-between"
            >
              <span>{l.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
          <div className="pt-2">
            <Button asChild className="w-full rounded-full">
              <Link to="/contact" onClick={() => setMobile(false)}>Book a Demo</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
