import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Activity, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { platformMenu, icpMenu, solutionsMenu, resourcesMenu, howItWorksMenu, aboutMenu, contactMenu } from "@/lib/site";

function Dropdown({ label, to, items }: { label: string; to: string; items: readonly { to: string; label: string; desc: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        {label} <ChevronDown className="size-4" />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[30rem] -translate-x-1/2 pt-2">
          <div className="grid grid-cols-2 gap-1 rounded-2xl border bg-popover p-3 shadow-soft">
            {items.map((i) => (
              <Link key={i.label} to={i.to as any} onClick={() => setOpen(false)} className="rounded-xl p-3 hover:bg-accent">
                <div className="text-sm font-semibold">{i.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{i.desc}</div>
              </Link>
            ))}
            <Link to={to as any} onClick={() => setOpen(false)} className="col-span-2 mt-1 rounded-xl bg-primary-soft p-3 text-sm font-semibold text-accent-foreground">
              View all {label.toLowerCase()} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobile, setMobile] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Activity className="size-4" /></span>
          Physiomatics
        </Link>
        <nav className="hidden items-center lg:flex" aria-label="Main">
          <Dropdown label="About" to="/about" items={aboutMenu} />
          <Dropdown label="Platform" to="/platform" items={platformMenu} />
          <Dropdown label="Solutions" to="/solutions" items={solutionsMenu} />
          <Dropdown label="How It Works" to="/how-it-works" items={howItWorksMenu} />
          <Dropdown label="Resources" to="/resources" items={resourcesMenu} />
          <Dropdown label="ICP Profiles" to="/icp" items={icpMenu} />
          <Dropdown label="Contact" to="/contact" items={contactMenu} />
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm"><Link to="/analyze">Try analysis</Link></Button>
          <Button asChild><Link to="/contact">Book a Demo</Link></Button>
        </div>
        <button className="lg:hidden" aria-label="Toggle menu" aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>
          {mobile ? <X /> : <Menu />}
        </button>
      </div>
      {mobile && (
        <nav className="container-page grid gap-1 border-t py-4 lg:hidden" aria-label="Mobile">
          {[{ to: "/about", label: "About" }, { to: "/platform", label: "Platform" }, { to: "/solutions", label: "Solutions" }, { to: "/how-it-works", label: "How It Works" }, { to: "/resources", label: "Resources" }, { to: "/icp", label: "ICP Profiles" }, { to: "/contact", label: "Contact" }].map((l) => (
            <Link key={l.to} to={l.to as any} onClick={() => setMobile(false)} className="rounded-xl px-3 py-3 text-base font-medium hover:bg-accent">{l.label}</Link>
          ))}
          <Button asChild className="mt-2"><Link to="/contact" onClick={() => setMobile(false)}>Book a Demo</Link></Button>
        </nav>
      )}
    </header>
  );
}
