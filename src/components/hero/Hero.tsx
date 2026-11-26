'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CareerTrace from '@/components/hero/CareerTrace';
import ProximityText from '@/components/fx/ProximityText';
import Magnetic from '@/components/fx/Magnetic';
import { EASE_OUT_EXPO } from '@/components/fx/Reveal';
import { useApp } from '@/context/AppProvider';
import { PERSONAL } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';

export default function Hero() {
  const { isLoaded } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const artY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 1.1, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-5 pt-24 sm:px-8 sm:pb-6 lg:pt-28"
    >
      {/* Career, rendered as a distributed trace (desktop) */}
      <motion.div
        style={{ y: artY, opacity: fade }}
        className="absolute right-8 top-[calc(5rem+4svh)] z-20 hidden w-[min(46%,40rem)] lg:block"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE_OUT_EXPO }}
        >
          <CareerTrace play={isLoaded} />
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        {/* Statement */}
        <div className="mt-[3svh] max-w-[34rem] lg:mt-[max(1rem,calc(9svh-2.5rem))]">
          <motion.div
            {...fadeUp(0.3)}
            className="mb-5 inline-flex md:mb-7 items-center gap-2.5 rounded-full border border-white/10 bg-canvas/60 py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-body backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5 text-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {PERSONAL.status}
          </motion.div>
          <motion.p
            {...fadeUp(0.45)}
            className="text-[1.65rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[2.1rem] md:text-[2.4rem]"
          >
            Backend engineer building APIs &amp; systems that stay{' '}
            <span className="text-mute">fast and correct at scale.</span>
          </motion.p>
          <motion.div {...fadeUp(0.6)} className="mt-7 flex items-center gap-7 md:mt-9">
            <Magnetic>
              <button
                onClick={() => scrollToId('projects')}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-sm font-medium text-canvas"
              >
                <span className="relative z-10">View selected work</span>
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-45deg]">
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

          {/* Career trace (mobile / tablet), in the flow */}
          <motion.div {...fadeUp(0.75)} className="mt-10 lg:hidden">
            <CareerTrace play={isLoaded} compact />
          </motion.div>
        </div>

        {/* Name */}
        <motion.div style={{ y: nameY }} className="mt-auto pt-8 md:pt-6">
          <div className="flex items-end justify-between gap-6">
            <h1 className="select-none leading-[0.78] tracking-[-0.05em] text-ink">
              <span className="sr-only">{PERSONAL.name}</span>
              <span aria-hidden>
                <ProximityText
                  text="SPR"
                  play={isLoaded}
                  delay={0.1}
                  radius={420}
                  className="block whitespace-nowrap text-[clamp(6rem,36vw,13rem)] md:text-[min(25vw,31svh,22rem)]"
                />
              </span>
            </h1>
            <motion.div {...fadeUp(1)} className="mb-[0.6em] hidden shrink-0 text-right sm:block">
              <div className="text-2xl font-medium tracking-[-0.02em] text-ink md:text-3xl">{PERSONAL.name}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                {PERSONAL.title} · Backend
              </div>
            </motion.div>
          </div>
          {/* Small screens: full name under the monogram */}
          <motion.div {...fadeUp(1)} className="mt-3 sm:hidden">
            <div className="text-xl font-medium tracking-[-0.02em] text-ink">{PERSONAL.name}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              {PERSONAL.title} · Backend
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          {...fadeUp(1.2)}
          className="mt-6 grid grid-cols-2 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:text-[11px] md:grid-cols-3"
        >
          <span>Bengaluru, India</span>
          <span className="hidden text-center md:block">Portfolio ©{new Date().getFullYear()}</span>
          <button onClick={() => scrollToId('about')} className="text-right uppercase transition-colors hover:text-ink">
            Scroll to explore ↓
          </button>
        </motion.div>
      </div>
    </section>
  );
}
