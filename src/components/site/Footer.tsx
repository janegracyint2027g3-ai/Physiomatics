import { Link } from "@tanstack/react-router";
import { 
  whatsappLink, 
  WA_MESSAGES, 
  PHONE_TEL, 
  PHONE_NUMBER_DISPLAY, 
  YOUTUBE_URL, 
  LINKEDIN_URL 
} from "@/lib/site";

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
          <Link to="/resources" className="opacity-75 hover:opacity-100">Resources &amp; FAQ</Link>
          <Link to="/blog" className="opacity-75 hover:opacity-100">Blog</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-semibold">Contact &amp; Connect</div>
          <Link to="/contact" className="opacity-75 hover:opacity-100">Book an appointment</Link>
          <a href={whatsappLink(WA_MESSAGES.general)} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100">WhatsApp: {PHONE_NUMBER_DISPLAY}</a>
          <a href={PHONE_TEL} className="opacity-75 hover:opacity-100">Call: {PHONE_NUMBER_DISPLAY}</a>
          <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100">YouTube Channel</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100">LinkedIn Page</a>
          <Link to="/about" className="opacity-75 hover:opacity-100">About</Link>
          <Link to="/feedback" className="opacity-75 hover:opacity-100">Submit feedback</Link>
          <Link to="/safety" className="opacity-75 hover:opacity-100">Safety &amp; responsible AI</Link>
          <Link to="/privacy" className="opacity-75 hover:opacity-100">Privacy policy</Link>
          <Link to="/terms" className="opacity-75 hover:opacity-100">Terms of use</Link>
          <Link to="/inbox" className="opacity-75 hover:opacity-100">Team sign in</Link>
        </div>
      </div>

      {/* ── Social links + copyright ── */}
      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          {/* Social icons row */}
          <div className="flex flex-wrap items-center gap-5">
            {/* YouTube */}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Physiomatics on YouTube"
              className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
            {/* LinkedIn */}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Physiomatics on LinkedIn"
              className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            {/* WhatsApp */}
            <a
              href={whatsappLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              WhatsApp ({PHONE_NUMBER_DISPLAY})
            </a>
            {/* Phone */}
            <a
              href={PHONE_TEL}
              aria-label="Call Physiomatics"
              className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {PHONE_NUMBER_DISPLAY}
            </a>
          </div>
          <div className="text-xs opacity-50">
            &copy; {new Date().getFullYear()} Physiomatics. Videos analyzed on this site are processed in your browser and never uploaded.
          </div>
        </div>
      </div>
    </footer>
  );
}
