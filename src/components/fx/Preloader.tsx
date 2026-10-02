'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppProvider';
import { EASE_OUT_EXPO } from './Reveal';

const BOOT_LINES = [
  'resolving dependencies',
  'warming caches',
  'migrating schemas',
  'opening connections',
  'ready',
];

/** Boot-sequence intro: counts to 100, then the curtain lifts off the page. */
export default function Preloader() {
  const { isLoaded, setIsLoaded } = useApp();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('spr-booted') === '1';
      sessionStorage.setItem('spr-booted', '1');
    } catch {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = seen || reduced ? 500 : 2200;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-in-out so the counter lingers a beat near the end
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setIsLoaded(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setIsLoaded]);

  const lineIndex = Math.min(BOOT_LINES.length - 1, Math.floor((count / 100) * BOOT_LINES.length));

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10002] flex flex-col justify-between bg-[#0a0a09] p-5 font-mono text-xs text-mute sm:p-8"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
        >
          <div className="flex justify-between uppercase tracking-[0.2em]">
            <span>Shivam Pratap Raj</span>
            <span>Portfolio ©{new Date().getFullYear()}</span>
          </div>

          <div className="space-y-1">
            {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={i === lineIndex ? 'text-ink' : ''}
              >
                <span className="text-accent">›</span> {line}
                {i === lineIndex && <span className="ml-1 inline-block animate-blink">_</span>}
              </motion.div>
            ))}
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 bg-hairline">
              <div className="h-px bg-accent transition-[width] duration-100" style={{ width: `${count}%` }} />
            </div>
            <span className="font-sans text-[22vw] font-semibold leading-[0.8] tracking-tighter text-ink tabular-nums sm:text-[14vw]">
              {count}
              <span className="text-accent">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
