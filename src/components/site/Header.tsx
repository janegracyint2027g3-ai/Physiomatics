import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  Mail,
  Phone,
  Zap,
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
  MenuItem,
  whatsappLink,
  WA_MESSAGES
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
  Phone,
  Zap,
};

function renderIcon(name?: string, className: string = "size-5") {
  const IconComponent = name ? iconMap[name] : Activity;
  return IconComponent ? <IconComponent className={className} /> : <Activity className={className} />;
}

/* ─── CONTRAST MEGAMENU (multi-category) ─────────────────────────────────── */
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

  const activeCategory = categories[activeTab] ?? categories[0];
  if (!activeCategory) return null;

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
      {/* Trigger button */}
      <button
        className={`group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold tracking-wide transition-all duration-200 ${
          open 
            ? "bg-white/20 text-white shadow-inner ring-1 ring-white/30" 
            : "text-white/90 hover:text-white hover:bg-white/12"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        <span>{label}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180 text-[#5AA9AC]" : "text-white/70 group-hover:text-white"}`} />
      </button>
      {/* Animated underline */}
      <span className={`absolute bottom-0 left-3.5 right-3.5 h-[2.5px] rounded-full bg-gradient-to-r from-[#5AA9AC] via-white to-[#5AA9AC] transition-all duration-200 ${open ? "opacity-100 scale-x-100 shadow-[0_0_8px_rgba(90,169,172,0.8)]" : "opacity-0 scale-x-0"}`} />

      {open && (
        <div className={`absolute ${positionClasses} top-full z-50 w-[56rem] max-w-[calc(100vw-2rem)] pt-3.5 animate-in fade-in-0 slide-in-from-top-2 duration-200`}>
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_80px_-12px_rgba(89,39,135,0.25)] ring-1 ring-[#592787]/12">
            
            {/* Top Grid: Contrast Split */}
            <div className="grid grid-cols-[250px_1fr] min-h-[380px]">
              
              {/* LEFT COLUMN: Deep Purple-Black Panel */}
              <div
                className="flex flex-col justify-between p-6 text-white border-r border-[#592787]/20"
                style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #0d0520 60%, #061020 100%)" }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="size-1.5 rounded-full bg-[#5AA9AC] animate-pulse" />
                    <div className="text-[9px] font-bold tracking-[0.22em] text-[#5AA9AC]/80 uppercase">
                      {sidebarEyebrow}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
                    {sidebarTitle || label}
                  </h3>
                  <p className="text-[11px] text-white/40 leading-relaxed mb-6">
                    Choose a category to explore
                  </p>

                  {/* Navigation Category Items */}
                  <div className="space-y-1">
                    {categories.map((cat, idx) => {
                      const isActive = activeTab === idx;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setActiveTab(idx)}
                          onClick={() => setActiveTab(idx)}
                          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-medium transition-all duration-150 ${
                            isActive
                              ? "bg-gradient-to-r from-[#592787]/80 to-[#3a7fb5]/60 text-white font-semibold shadow-inner border border-[#592787]/40"
                              : "text-white/50 hover:bg-white/8 hover:text-white/80"
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          <ChevronRight className={`size-3 transition-all ${isActive ? "text-[#5AA9AC] translate-x-0.5" : "text-white/20 group-hover:text-white/40"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Left Bottom Link */}
                <div className="pt-5 border-t border-white/10">
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors group"
                  >
                    <span>View all {label.toLowerCase()}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Clean White Panel */}
              <div className="p-7 bg-white flex flex-col justify-between">
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#592787]/10">
                    <div className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-[#592787]" />
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#592787] font-sans">
                        {activeCategory.label}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium bg-zinc-50 border border-zinc-100 rounded-full px-2 py-0.5">
                      {activeCategory.items.length} options
                    </span>
                  </div>

                  {/* Grid of Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeCategory.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to as any}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#592787]/30 hover:shadow-[0_8px_24px_-4px_rgba(89,39,135,0.15)] hover:ring-1 hover:ring-[#592787]/15"
                      >
                        <div className="mt-0.5 shrink-0 rounded-xl bg-[#592787]/8 p-2.5 text-[#592787] border border-[#592787]/12 group-hover:bg-[#592787] group-hover:text-white group-hover:border-[#592787] transition-all duration-200">
                          {renderIcon(item.icon, "size-4")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-zinc-900 group-hover:text-[#592787] transition-colors leading-snug">
                            {item.label}
                          </div>
                          {item.tag && (
                            <div className="inline-flex items-center text-[9px] font-bold tracking-wider text-[#5AA9AC] uppercase mt-0.5 font-sans bg-[#5AA9AC]/8 border border-[#5AA9AC]/20 rounded-full px-1.5 py-px">
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

                {/* Right Bottom Footer */}
                <div className="pt-5 mt-5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Direct practice access</span>
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="font-semibold text-[#592787] hover:text-[#3d1860] flex items-center gap-1 group transition-colors"
                  >
                    <span>Browse all {label}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* BOTTOM FOOTER BAR */}
            <div
              className="flex items-center justify-between px-8 py-3.5 border-t border-[#592787]/10"
              style={{ background: "linear-gradient(90deg, #faf8ff 0%, #f0f9fb 100%)" }}
            >
              <span className="text-xs text-zinc-600 font-medium">
                {ctaText}
              </span>
              <Button asChild size="sm" className="rounded-full text-xs h-8 px-5 font-semibold shadow-sm bg-gradient-to-r from-[#592787] to-[#3a7fb5] hover:from-[#3d1860] hover:to-[#2a5f8a] text-white border-0">
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

/* ─── COMPACT MEGAMENU (single-category) ─────────────────────────────────── */
function CompactMegamenu({
  label,
  to,
  sidebarEyebrow = "OVERVIEW",
  sidebarDesc,
  items,
  ctaText = "Ready to explore live?",
  ctaButtonText = "Try Free Live Demo →",
  ctaLink = "/analyze",
  align = "center"
}: {
  label: string;
  to: string;
  sidebarEyebrow?: string;
  sidebarDesc?: string;
  items: readonly MenuItem[];
  ctaText?: string;
  ctaButtonText?: string;
  ctaLink?: string;
  align?: "left" | "center" | "right";
}) {
  const [open, setOpen] = useState(false);

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
      {/* Trigger button */}
      <button
        className={`group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold tracking-wide transition-all duration-200 ${
          open 
            ? "bg-white/20 text-white shadow-inner ring-1 ring-white/30" 
            : "text-white/90 hover:text-white hover:bg-white/12"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        <span>{label}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180 text-[#5AA9AC]" : "text-white/70 group-hover:text-white"}`} />
      </button>
      {/* Animated underline */}
      <span className={`absolute bottom-0 left-3.5 right-3.5 h-[2.5px] rounded-full bg-gradient-to-r from-[#5AA9AC] via-white to-[#5AA9AC] transition-all duration-200 ${open ? "opacity-100 scale-x-100 shadow-[0_0_8px_rgba(90,169,172,0.8)]" : "opacity-0 scale-x-0"}`} />

      {open && (
        <div className={`absolute ${positionClasses} top-full z-50 w-[52rem] max-w-[calc(100vw-2rem)] pt-3.5 animate-in fade-in-0 slide-in-from-top-2 duration-200`}>
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_80px_-12px_rgba(89,39,135,0.25)] ring-1 ring-[#592787]/12">
            
            {/* Top Grid */}
            <div className="grid grid-cols-[230px_1fr] min-h-[320px]">
              
              {/* Left Dark Purple-Black Panel */}
              <div
                className="flex flex-col justify-between p-6 text-white border-r border-[#592787]/20"
                style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #0d0520 60%, #061020 100%)" }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="size-1.5 rounded-full bg-[#5AA9AC] animate-pulse" />
                    <div className="text-[9px] font-bold tracking-[0.22em] text-[#5AA9AC]/80 uppercase">
                      {sidebarEyebrow}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-3">
                    {label}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {sidebarDesc || "AI-assisted video kinematics, precision angular tracking, and structured recovery guidance."}
                  </p>

                  {/* Decorative dots */}
                  <div className="mt-6 flex gap-1.5">
                    {[0,1,2].map(i => (
                      <div key={i} className="size-1.5 rounded-full" style={{ background: i === 0 ? "#592787" : i === 1 ? "#5AA9AC" : "#592787", opacity: i === 2 ? 0.3 : 0.7 }} />
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10">
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors group"
                  >
                    <span>View all {label.toLowerCase()}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* Right Panel */}
              <div className="p-6 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#592787]/10">
                    <div className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-[#592787]" />
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#592787] font-sans">
                        CORE CAPABILITIES
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium bg-zinc-50 border border-zinc-100 rounded-full px-2 py-px">{items.length} items</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to as any}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#592787]/30 hover:shadow-[0_8px_24px_-4px_rgba(89,39,135,0.15)] hover:ring-1 hover:ring-[#592787]/15"
                      >
                        <div className="mt-0.5 shrink-0 rounded-xl bg-[#592787]/8 p-2 text-[#592787] border border-[#592787]/12 group-hover:bg-[#592787] group-hover:text-white group-hover:border-[#592787] transition-all duration-200">
                          {renderIcon(item.icon, "size-3.5")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-zinc-900 group-hover:text-[#592787] transition-colors leading-snug">
                            {item.label}
                          </div>
                          {item.tag && (
                            <div className="inline-flex items-center text-[9px] font-bold tracking-wider text-[#5AA9AC] uppercase mt-0.5 font-sans bg-[#5AA9AC]/8 border border-[#5AA9AC]/20 rounded-full px-1.5 py-px">
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

                <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Client-side pose telemetry</span>
                  <Link 
                    to={to as any} 
                    onClick={() => setOpen(false)}
                    className="font-semibold text-[#592787] hover:text-[#3d1860] flex items-center gap-1 group transition-colors"
                  >
                    <span>Browse all</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div
              className="flex items-center justify-between px-7 py-3.5 border-t border-[#592787]/10"
              style={{ background: "linear-gradient(90deg, #faf8ff 0%, #f0f9fb 100%)" }}
            >
              <span className="text-xs text-zinc-600 font-medium">{ctaText}</span>
              <Button asChild size="sm" className="rounded-full text-xs h-8 px-5 font-semibold shadow-sm bg-gradient-to-r from-[#592787] to-[#3a7fb5] hover:from-[#3d1860] hover:to-[#2a5f8a] text-white border-0">
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

/* ─── MAIN HEADER ─────────────────────────────────────────────────────────── */
export function Header() {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#150526]/95 backdrop-blur-xl shadow-[0_12px_40px_-10px_rgba(10,2,20,0.65)]"
          : "border-b border-white/10 bg-gradient-to-r from-[#17072a] via-[#260e40] to-[#1a082e] backdrop-blur-md shadow-[0_4px_25px_rgba(15,3,28,0.4)]"
      }`}
    >
      {/* Top gradient accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#592787] via-[#5AA9AC] to-[#3a7fb5]" />

      <div className="container-page flex h-[3.85rem] items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight shrink-0 group"
          aria-label="Physiomatics home"
        >
          <div className="relative">
            <img
              src="/logo-64.png"
              alt="Physiomatics"
              className="size-8 rounded-full object-cover shadow-md ring-2 ring-white/30 group-hover:ring-[#5AA9AC] transition-all duration-200"
              loading="eager"
            />
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-gradient-to-br from-[#5AA9AC] to-white border-[1.5px] border-[#1a082e]" />
          </div>
          <span className="font-display font-bold tracking-tight text-white group-hover:text-[#5AA9AC] transition-colors duration-200 text-xl">
            Physiomatics
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          
          <CompactMegamenu 
            label="About" 
            to="/about" 
            sidebarEyebrow="WHO WE ARE" 
            sidebarDesc="Our mission, team, and clinical research behind precision physiotherapy."
            items={aboutMenu}
            ctaText="Interested in our clinical research and mission?"
            ctaButtonText="Read Mission →"
            ctaLink="/about/mission"
            align="left"
          />

          <CompactMegamenu 
            label="Platform" 
            to="/platform" 
            sidebarEyebrow="CORE ARCHITECTURE" 
            sidebarDesc="AI-powered video analysis infrastructure built for clinical-grade accuracy."
            items={platformMenu}
            ctaText="Try our browser-based AI video analysis instantly."
            ctaButtonText="Test in Browser →"
            ctaLink="/analyze"
            align="left"
          />

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

          <CompactMegamenu 
            label="How It Works" 
            to="/how-it-works" 
            sidebarEyebrow="HOW IT WORKS"
            sidebarDesc="On-device AI, goniometric tracking, and secure data pipelines explained."
            items={howItWorksMenu}
            ctaText="Learn how on-device AI safeguards patient privacy."
            ctaButtonText="View Security Whitepaper →"
            ctaLink="/how-it-works/privacy"
            align="center"
          />

          <CompactMegamenu 
            label="Resources" 
            to="/resources" 
            sidebarEyebrow="KNOWLEDGE BASE"
            sidebarDesc="Clinical exercise library, goniometric standards, and research papers."
            items={resourcesMenu}
            ctaText="Explore our verified clinical exercises and goniometric angles."
            ctaButtonText="Browse Library →"
            ctaLink="/resources/library"
            align="center"
          />

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

          <CompactMegamenu 
            label="Contact" 
            to="/contact" 
            sidebarEyebrow="GET IN TOUCH"
            sidebarDesc="Multiple ways to reach our clinical and technical teams."
            items={contactMenu}
            ctaText="Want an immediate response on WhatsApp (7845072426)?"
            ctaButtonText="WhatsApp: 7845072426 →"
            ctaLink="/contact/enquiry"
            align="right"
          />
        </nav>

        {/* Desktop Quick Actions */}
        <div className="hidden items-center gap-2.5 lg:flex shrink-0">
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="rounded-full text-xs font-bold text-white/90 hover:text-white hover:bg-white/12 border border-white/20 px-4 h-9 transition-all"
          >
            <Link to="/analyze">Try analysis</Link>
          </Button>
          <Button 
            asChild 
            size="sm" 
            className="rounded-full px-5 text-xs font-bold text-white border-0 shadow-lg shadow-[#5AA9AC]/25 bg-gradient-to-r from-[#5AA9AC] to-[#409194] hover:from-[#67babb] hover:to-[#4aa2a5] hover:shadow-[0_4px_20px_rgba(90,169,172,0.5)] hover:scale-105 transition-all duration-200 h-9"
          >
            <Link to="/contact">Book a Demo</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors" 
          aria-label="Toggle menu" 
          aria-expanded={mobile} 
          onClick={() => setMobile((m) => !m)}
        >
          {mobile 
            ? <X className="size-5" /> 
            : <Menu className="size-5" />
          }
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobile && (
        <nav
          className="container-page border-t border-white/10 py-4 lg:hidden max-h-[80vh] overflow-y-auto bg-[#18082b] text-white shadow-2xl"
          aria-label="Mobile"
        >
          {/* Section Label */}
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="size-1 rounded-full bg-[#5AA9AC]" />
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Navigation</div>
          </div>

          <div className="space-y-0.5">
            {[
              { to: "/about", label: "About", icon: "Users" },
              { to: "/platform", label: "Platform", icon: "ScanLine" },
              { to: "/solutions", label: "Solutions", icon: "Layers" },
              { to: "/how-it-works", label: "How It Works", icon: "Workflow" },
              { to: "/resources", label: "Resources", icon: "BookOpen" },
              { to: "/icp", label: "ICP Profiles", icon: "Target" },
              { to: "/contact", label: "Contact", icon: "Mail" },
            ].map((l) => (
              <Link 
                key={l.to} 
                to={l.to as any} 
                onClick={() => setMobile(false)} 
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white/90 hover:bg-white/10 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#5AA9AC] group-hover:bg-[#5AA9AC] group-hover:text-white transition-all">
                    {renderIcon(l.icon, "size-3.5")}
                  </div>
                  <span>{l.label}</span>
                </div>
                <ChevronRight className="size-4 text-white/40 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-white/10 space-y-2">
            <Button asChild variant="outline-inverse" className="w-full rounded-xl text-sm font-bold">
              <Link to="/analyze" onClick={() => setMobile(false)}>Try Live Analysis</Link>
            </Button>
            <Button asChild className="w-full rounded-xl text-sm font-bold bg-[#5AA9AC] hover:bg-[#48989b] text-white border-0 shadow-md">
              <Link to="/contact" onClick={() => setMobile(false)}>Book a Demo</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
