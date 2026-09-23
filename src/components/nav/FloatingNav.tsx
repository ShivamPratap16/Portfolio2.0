'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_SECTIONS } from '@/lib/data';

/* ─── Download icon ──────────────────────────────────────────────────────── */

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
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

/* ─── Arrow annotation SVG ───────────────────────────────────────────────── */

function ArrowAnnotation() {
  return (
    <svg
      viewBox="0 0 24 36"
      fill="none"
      className="w-6 h-8 text-mute/60"
      aria-hidden="true"
    >
      <path
        d="M12 32 C 18 22, 18 14, 12 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
      <path
        d="M7 9 L 12 4 L 17 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Tooltip ────────────────────────────────────────────────────────────── */

function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-full mr-3 whitespace-nowrap text-[10px] font-mono text-mute bg-canvas border border-hairline rounded px-2 py-1 pointer-events-none"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [resumeHover, setResumeHover] = useState(false);

  /* IntersectionObserver for active section detection */
  const observeSections = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observeSections();
    return cleanup;
  }, [observeSections]);

  return (
    <nav
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center"
      aria-label="Section navigation"
    >
      <div className="flex flex-col items-center gap-4 backdrop-blur-xl bg-canvas/60 border border-hairline rounded-full px-3 py-6">
        {/* Section dots */}
        {NAV_SECTIONS.map(({ id, label }) => (
          <div key={id} className="relative flex items-center">
            <NavTooltip label={label} visible={hoveredId === id} />
            <a
              href={`#${id}`}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group flex items-center justify-center"
              aria-label={`Go to ${label}`}
            >
              <span
                className={`block w-[6px] h-[6px] rounded-full transition-all duration-200 group-hover:scale-125 group-hover:opacity-100 ${
                  activeSection === id
                    ? 'bg-ink opacity-100 scale-125'
                    : 'bg-ash opacity-60'
                }`}
              />
            </a>
          </div>
        ))}

        {/* Divider */}
        <span className="w-px h-4 bg-hairline" />

        {/* Command Palette Trigger */}
        <div className="relative flex items-center">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="flex items-center justify-center text-mute hover:text-[var(--color-accent)] transition-colors duration-200"
            aria-label="Open command palette"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </div>

        {/* Resume download button */}
        <div className="relative flex items-center">
          <NavTooltip label="Resume" visible={resumeHover} />
          <a
            href="/Shivam_resume.pdf"
            download="Shivam_resume.pdf"
            onMouseEnter={() => setResumeHover(true)}
            onMouseLeave={() => setResumeHover(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-hairline/80 text-mute hover:text-ink hover:border-mute transition-all duration-200"
            aria-label="Download resume"
          >
            <DownloadIcon />
          </a>
        </div>
      </div>

      {/* Hand-drawn annotation */}
      <div className="mt-1 flex flex-col items-center pointer-events-none select-none opacity-80">
        <ArrowAnnotation />
        <span className="text-sm text-mute font-sans -mt-1 -mr-2 rotate-2">
          grab my cv
        </span>
      </div>
    </nav>
  );
}
