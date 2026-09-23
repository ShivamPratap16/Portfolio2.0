'use client';

/* ─── Download icon ──────────────────────────────────────────────────────── */

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-3.5 h-3.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

const MOBILE_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
] as const;

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center backdrop-blur-xl bg-canvas/60 border border-hairline rounded-full px-2 py-2"
      aria-label="Mobile navigation"
    >
      {MOBILE_LINKS.map((link, i) => (
        <div key={link.label} className="flex items-center">
          <a
            href={link.href}
            className="px-3 py-1.5 text-[10px] sm:text-[11px] tracking-wide text-mute hover:text-ink transition-colors font-mono uppercase"
          >
            {link.label}
          </a>
          {/* Hairline separator */}
          <span className="w-px h-4 bg-hairline" />
        </div>
      ))}

      {/* Resume download button — inverted style */}
      <a
        href="/Shivam_resume.pdf"
        download
        className="flex items-center gap-1.5 ml-1 px-3 py-1.5 bg-ink text-canvas rounded-full text-[10px] sm:text-[11px] tracking-wide font-mono uppercase hover:bg-ink/90 transition-colors"
        aria-label="Download resume"
      >
        <DownloadIcon />
        <span>Resume</span>
      </a>
    </nav>
  );
}
