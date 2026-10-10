import { Link } from "@tanstack/react-router";
import { whatsappLink, WA_MESSAGES } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Physiomatics</div>
          <p className="mt-3 max-w-sm text-sm opacity-75">Move Better. Recover Smarter. Age Stronger. Exercise guidance and AI-assisted movement monitoring — not a diagnostic tool or a replacement for professional care.</p>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-semibold">Explore</div>
          <Link to="/platform" className="opacity-75 hover:opacity-100">Platform</Link>
          <Link to="/analyze" className="opacity-75 hover:opacity-100">AI Video Analytics</Link>
          <Link to="/solutions" className="opacity-75 hover:opacity-100">Solutions</Link>
          <Link to="/how-it-works" className="opacity-75 hover:opacity-100">How It Works</Link>
          <Link to="/resources" className="opacity-75 hover:opacity-100">Resources & FAQ</Link>
          <Link to="/blog" className="opacity-75 hover:opacity-100">Blog</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-semibold">Contact</div>
          <Link to="/contact" className="opacity-75 hover:opacity-100">Book a demo</Link>
          <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100">Chat on WhatsApp</a>
          <Link to="/about" className="opacity-75 hover:opacity-100">About</Link>
          <Link to="/privacy" className="opacity-75 hover:opacity-100">Privacy policy</Link>
          <Link to="/terms" className="opacity-75 hover:opacity-100">Terms of use</Link>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-6 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Physiomatics. Videos analyzed on this site are processed in your browser and never uploaded.
      </div>
    </footer>
  );
}
