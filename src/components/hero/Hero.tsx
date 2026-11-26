'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '@/components/fx/Magnetic';
import { EASE_OUT_EXPO } from '@/components/fx/Reveal';
import { useApp } from '@/context/AppProvider';
import { PERSONAL } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';

export default function Hero() {
  const { isLoaded } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 1.2, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center px-5 pb-6 pt-24 text-center sm:px-8"
    >
      <h1 className="sr-only">{PERSONAL.name} — Backend Software Engineer</h1>

      <motion.div style={{ opacity: fade, y: lift }} className="flex w-full max-w-[1400px] flex-1 flex-col items-center">
        <motion.div
          {...fadeUp(2.2)}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-canvas/50 py-1.5 pl-2.5 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-body backdrop-blur sm:text-[11px]"
        >
          <span className="relative flex h-1.5 w-1.5 text-accent">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {PERSONAL.status}
        </motion.div>

        {/* the particle name lives here, rendered by the WebGL layer */}
        <div className="flex-1" />

        <motion.p
          {...fadeUp(2.4)}
          className="max-w-2xl text-xl leading-snug text-ink sm:text-2xl md:text-[1.75rem]"
        >
          Backend engineer building systems that stay{' '}
          <span className="font-serif text-[1.15em] italic text-accent">fast</span> and{' '}
          <span className="font-serif text-[1.15em] italic text-accent">correct</span> at scale.
        </motion.p>

        <motion.div {...fadeUp(2.55)} className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Magnetic>
            <button
              onClick={() => scrollToId('projects')}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-sm font-medium text-canvas"
            >
              <span className="relative z-10">View selected work</span>
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90">
                →
              </span>
              <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </button>
          </Magnetic>
          <a
            href="/Shivam_resume.pdf"
            download="Shivam_resume.pdf"
            className="group relative text-sm font-medium text-body transition-colors hover:text-ink"
          >
            Résumé
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
          </a>
        </motion.div>

        <motion.div
          {...fadeUp(2.8)}
          className="mt-12 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:text-[11px]"
        >
          <span>{PERSONAL.name}</span>
          <span className="hidden md:inline">move your cursor through the particles</span>
          <button onClick={() => scrollToId('about')} className="uppercase transition-colors hover:text-ink">
            Scroll ↓
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
