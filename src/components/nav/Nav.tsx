'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { NAV_SECTIONS, PERSONAL, SOCIAL_LINKS } from '@/lib/data';
import { useApp } from '@/context/AppProvider';
import { scrollToId } from '@/lib/scroll';
import ScrambleText from '@/components/fx/ScrambleText';
import Magnetic from '@/components/fx/Magnetic';
import { EASE_OUT_EXPO } from '@/components/fx/Reveal';

function useLocalTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Nav() {
  const { isLoaded, setIsCommandPaletteOpen } = useApp();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const time = useLocalTime();

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open);
  });

  // Track which section is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // let the menu close before scrolling
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isLoaded && !hidden ? 0 : -100 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: isLoaded && !hidden ? 0.1 : 0 }}
        className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/[0.06] bg-[#0a0a09]/60 py-2 pl-5 pr-2 backdrop-blur-xl">
          <button
            onClick={() => go('top')}
            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ink"
            aria-label="Back to top"
          >
            <span className="relative flex h-2 w-2 text-accent">
              <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
            </span>
            <ScrambleText text="Shivam.dev" onHover />
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    active === s.id ? 'text-canvas' : 'text-body hover:text-ink'
                  }`}
                >
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    <span className="mr-1 opacity-50">0{i + 1}</span>
                    <ScrambleText text={s.label} onHover duration={400} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] tabular-nums tracking-wider text-mute lg:inline">
              BLR {time}
            </span>
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden items-center gap-1.5 rounded-full border border-hairline px-3 py-2 font-mono text-[11px] text-body transition-colors hover:border-accent hover:text-ink sm:flex"
              aria-label="Open command palette"
            >
              <kbd className="font-sans">⌘</kbd>K
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 items-center gap-2 rounded-full bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-canvas md:hidden"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? 'Close' : 'Menu'}
            </button>
            <a
              href={`mailto:${PERSONAL.email}`}
              className="hidden h-9 items-center rounded-full bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-canvas transition-colors hover:bg-accent md:flex"
            >
              Let&apos;s talk
            </a>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#0a0a09] px-6 pb-10 pt-28 md:hidden"
            initial={{ clipPath: 'circle(0% at 90% 40px)' }}
            animate={{ clipPath: 'circle(150% at 90% 40px)' }}
            exit={{ clipPath: 'circle(0% at 90% 40px)' }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <ul className="space-y-2">
              {NAV_SECTIONS.map((s, i) => (
                <li key={s.id} className="overflow-hidden">
                  <motion.button
                    onClick={() => go(s.id)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: EASE_OUT_EXPO }}
                    className="flex items-baseline gap-4 text-6xl font-semibold tracking-tighter text-ink"
                  >
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    {s.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.15em] text-body">
              {SOCIAL_LINKS.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {l.label} ↗
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating ⌘K on mobile, since there is no keyboard */}
      <AnimatePresence>
        {isLoaded && !open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-5 right-5 z-40 sm:hidden"
          >
            <Magnetic>
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-mono text-sm font-semibold text-canvas shadow-[0_10px_40px_-10px_var(--color-accent)]"
                aria-label="Open command palette"
              >
                ⌘
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
