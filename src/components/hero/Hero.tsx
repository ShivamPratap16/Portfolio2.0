'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AsciiDonut from '@/components/fx/AsciiDonut';
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

  const [first, second, ...rest] = PERSONAL.name.split(' ');

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-5 pt-24 sm:px-8 sm:pb-6 md:pt-28"
    >
      {/* ASCII art */}
      <motion.div
        style={{ y: artY, opacity: fade }}
        className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-[36svh] md:inset-x-auto md:right-0 md:top-[8svh] md:h-[62svh] md:w-[56%]"
      >
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        >
          <AsciiDonut className="h-full w-full" play={isLoaded} />
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        {/* Statement */}
        <div className="mt-[33svh] max-w-[34rem] md:mt-[7svh] lg:mt-[9svh]">
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
        </div>

        {/* Name */}
        <motion.div style={{ y: nameY }} className="mt-auto pt-8 md:pt-12">
          <motion.div
            {...fadeUp(1)}
            className="mb-3 hidden items-end justify-end font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ash md:flex"
          >
            <span className="text-right">
              donut.c · rendered live in ascii
              <br />
              move your cursor ↘
            </span>
          </motion.div>
          <h1 className="select-none leading-[0.8] tracking-[-0.065em] text-ink">
            {/* Desktop: single full-bleed line */}
            <ProximityText
              text={PERSONAL.name}
              play={isLoaded}
              delay={0.1}
              className="hidden whitespace-nowrap text-[clamp(4rem,10.6vw,10.25rem)] md:block"
            />
            {/* Mobile: stacked */}
            <span className="block whitespace-nowrap text-[16.5vw] md:hidden">
              <ProximityText text={first} play={isLoaded} delay={0.1} className="block" />
              <ProximityText text={[second, ...rest].join(' ')} play={isLoaded} delay={0.3} className="block" />
            </span>
          </h1>
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
