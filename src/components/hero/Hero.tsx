'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NetworkGlobe from '@/components/fx/NetworkGlobe';
import { SplitReveal, EASE_OUT_EXPO } from '@/components/fx/Reveal';
import Magnetic from '@/components/fx/Magnetic';
import { useApp } from '@/context/AppProvider';
import { EXPERIENCES, PERSONAL } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';

export default function Hero() {
  const { isLoaded } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 1, delay, ease: EASE_OUT_EXPO },
  });

  const [first, ...rest] = PERSONAL.name.split(' ');

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-6 pt-28 sm:px-8 sm:pb-8"
    >
      <motion.div className="absolute inset-0" style={{ scale: globeScale, opacity: fade }}>
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, ease: EASE_OUT_EXPO }}
        >
          <NetworkGlobe className="h-full w-full" />
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />

      {/* Meta row */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-body md:grid-cols-4">
        <motion.div {...fadeUp(0.2)}>
          <div className="text-mute">Role</div>
          <div className="mt-1 text-ink">{PERSONAL.title}</div>
        </motion.div>
        <motion.div {...fadeUp(0.3)}>
          <div className="text-mute">Currently</div>
          <div className="mt-1 flex items-center gap-2 text-ink">
            <span className="relative flex h-1.5 w-1.5 text-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {EXPERIENCES[0].company}
          </div>
        </motion.div>
        <motion.div {...fadeUp(0.4)} className="hidden md:block">
          <div className="text-mute">Focus</div>
          <div className="mt-1 text-ink">{PERSONAL.subtitle}</div>
        </motion.div>
        <motion.div {...fadeUp(0.5)} className="hidden md:block md:text-right">
          <div className="text-mute">Based in</div>
          <div className="mt-1 text-ink">Bengaluru, India</div>
        </motion.div>
      </div>

      {/* Intro */}
      <div className="relative z-10 mx-auto mt-[38vh] w-full max-w-[1400px] md:mt-0">
        <motion.p
          {...fadeUp(0.9)}
          className="max-w-md text-xl leading-snug text-body sm:text-2xl md:text-[1.7rem]"
        >
          I engineer <span className="font-serif italic text-ink">backends</span> that stay{' '}
          <span className="text-accent">fast</span> &amp;{' '}
          <span className="font-serif italic text-ink">correct</span> under load — APIs, ledgers and
          query paths at scale.
        </motion.p>
        <motion.div {...fadeUp(1.05)} className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <button
              onClick={() => scrollToId('projects')}
              className="group relative overflow-hidden rounded-full bg-accent px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.15em] text-canvas"
            >
              <span className="relative z-10">See the work ↓</span>
              <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href="/Shivam_resume.pdf"
              download="Shivam_resume.pdf"
              className="inline-flex rounded-full border border-hairline bg-canvas/40 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-ink backdrop-blur transition-colors hover:border-ink"
            >
              Résumé ↗
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Giant name */}
      <motion.div style={{ y: nameY }} className="relative z-10 mx-auto mt-10 w-full max-w-[1400px]">
        <h1 className="select-none text-[19vw] md:text-[clamp(3.5rem,15.5vw,15rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-ink">
          <SplitReveal text={first} by="char" play={isLoaded} delay={0.1} className="block" />
          <span className="flex items-end justify-between gap-6">
            <SplitReveal
              text={rest.join(' ')}
              by="char"
              play={isLoaded}
              delay={0.35}
              className="block font-serif font-normal italic tracking-[-0.04em] text-accent"
            />
            <motion.span
              {...fadeUp(1.3)}
              className="mb-[0.6em] hidden shrink-0 text-right font-mono text-[11px] font-normal uppercase leading-relaxed tracking-[0.18em] text-mute lg:block"
            >
              ( click the globe )<br />
              send a request ⟶
            </motion.span>
          </span>
        </h1>
      </motion.div>

      <motion.div
        {...fadeUp(1.4)}
        className="relative z-10 mx-auto mt-6 flex w-full max-w-[1400px] items-center justify-between border-t border-hairline pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
      >
        <span>Open to backend roles</span>
        <span className="flex items-center gap-2">
          Scroll
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
