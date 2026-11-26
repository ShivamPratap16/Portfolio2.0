'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '@/components/fx/Magnetic';
import { EASE_OUT_EXPO } from '@/components/fx/Reveal';
import { useApp } from '@/context/AppProvider';
import { PERSONAL } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';

const NAME_LINES = ['Shivam', 'Pratap Raj'];

export default function Hero() {
  const { isLoaded } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const lift = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1.2, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-5 pt-24 sm:px-8 sm:pb-6 lg:pt-28"
    >
      {/* legibility: darken the bottom-left where the name sits */}
      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />

      <motion.div style={{ y: lift, opacity: fade }} className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <div className="flex items-start justify-between gap-6">
          <motion.div
            {...fadeUp(0.3)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-canvas/60 py-1.5 pl-2.5 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-body backdrop-blur sm:text-[11px]"
          >
            <span className="relative flex h-1.5 w-1.5 text-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {PERSONAL.status}
          </motion.div>
          <motion.p
            {...fadeUp(0.5)}
            className="hidden max-w-[17rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-mute md:block"
          >
            A city built from everything I&apos;ve shipped.
            <br />
            <span className="text-body">move to look · click to send traffic · scroll to fly in</span>
          </motion.p>
        </div>

        <div className="mt-auto">
          <motion.p
            {...fadeUp(0.55)}
            className="mb-6 max-w-xl text-lg leading-snug text-body sm:text-xl md:mb-8 md:text-2xl"
          >
            Backend engineer building systems that stay{' '}
            <span className="font-serif text-[1.2em] italic text-accent">fast</span> and{' '}
            <span className="font-serif text-[1.2em] italic text-accent">correct</span> at scale.
          </motion.p>

          <h1 className="select-none text-[clamp(3.6rem,15vw,15rem)] font-semibold leading-[0.82] tracking-[-0.055em] text-ink">
            {NAME_LINES.map((line, li) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: isLoaded ? '0%' : '105%' }}
                  transition={{ duration: 1.4, delay: 0.15 + li * 0.12, ease: EASE_OUT_EXPO }}
                >
                  {li === 1 ? (
                    <>
                      Pratap <span className="font-serif font-normal italic text-accent">Raj</span>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div {...fadeUp(0.9)} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-10">
            <Magnetic>
              <button
                onClick={() => scrollToId('about')}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-sm font-medium text-canvas"
              >
                <span className="relative z-10">Fly through the city</span>
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90">
                  →
                </span>
                <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              </button>
            </Magnetic>
            <button
              onClick={() => scrollToId('projects')}
              className="group relative text-sm font-medium text-body transition-colors hover:text-ink"
            >
              Skip to work
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </button>
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
            {...fadeUp(1.1)}
            className="mt-8 grid grid-cols-2 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:text-[11px] md:grid-cols-3"
          >
            <span>Bengaluru, India</span>
            <span className="hidden text-center md:block">{PERSONAL.title} · Backend</span>
            <span className="text-right md:hidden">tap to send traffic</span>
            <button onClick={() => scrollToId('about')} className="hidden text-right uppercase transition-colors hover:text-ink md:block">
              Scroll to explore ↓
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
