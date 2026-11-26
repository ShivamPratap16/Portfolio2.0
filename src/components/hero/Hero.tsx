'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SystemCanvas, { type SystemStats } from '@/components/hero/SystemCanvas';
import ProximityText from '@/components/fx/ProximityText';
import Magnetic from '@/components/fx/Magnetic';
import { EASE_OUT_EXPO } from '@/components/fx/Reveal';
import { useApp } from '@/context/AppProvider';
import { PERSONAL } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';

function Hud({ stats, className = '' }: { stats: SystemStats; className?: string }) {
  const cells: [string, string, boolean?][] = [
    ['req/s', String(stats.rps)],
    ['p50', `${stats.p50}ms`],
    ['p99', `${stats.p99}ms`],
    ['errors', '0.00%'],
    ['yours', String(stats.mine), stats.mine > 0],
  ];
  return (
    <div className={`grid grid-cols-5 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.05] font-mono ${className}`}>
      {cells.map(([k, v, hot]) => (
        <div key={k} className="bg-canvas/80 px-3 py-2 backdrop-blur">
          <div className="text-[9px] uppercase tracking-[0.16em] text-mute">{k}</div>
          <div className={`mt-0.5 text-sm tabular-nums ${hot ? 'text-accent' : 'text-ink'}`}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { isLoaded } = useApp();
  const ref = useRef<HTMLElement>(null);
  const deskSlot = useRef<HTMLDivElement>(null);
  const mobileSlot = useRef<HTMLDivElement>(null);
  const slots = useMemo(() => [deskSlot, mobileSlot], []);
  const [stats, setStats] = useState<SystemStats>({ rps: 0, p50: 0, p99: 0, mine: 0 });
  const onStats = useCallback((s: SystemStats) => setStats(s), []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

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
      {/* Faint blueprint grid behind the live system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_70%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div style={{ opacity: fade }} className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        >
          <SystemCanvas hostRef={ref} slotRefs={slots} play={isLoaded} onStats={onStats} />
        </motion.div>
      </motion.div>

      {/* Desktop slot for the system diagram + live metrics */}
      <div
        ref={deskSlot}
        aria-hidden
        className="pointer-events-none absolute right-8 top-[calc(6rem+7svh)] hidden h-[44svh] w-[47%] lg:block"
      />
      <motion.div
        {...fadeUp(0.9)}
        className="absolute right-8 top-[calc(6rem+7svh+44svh+2.75rem)] z-10 hidden w-[min(47%,34rem)] lg:block"
      >
        <Hud stats={stats} />
      </motion.div>

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        {/* Statement */}
        <div className="pointer-events-auto mt-[3svh] max-w-[34rem] lg:mt-[max(1rem,calc(9svh-2.5rem))] lg:max-w-[min(34rem,44vw)]">
          <motion.div
            {...fadeUp(0.3)}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-canvas/60 py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-body backdrop-blur md:mb-7"
          >
            <span className="relative flex h-1.5 w-1.5 text-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {PERSONAL.status}
          </motion.div>
          <motion.p
            {...fadeUp(0.45)}
            className="text-[1.85rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.4rem] md:text-[2.9rem]"
          >
            Backend engineer building systems that stay{' '}
            <span className="font-serif font-normal italic text-accent">fast</span> and{' '}
            <span className="font-serif font-normal italic text-accent">correct</span>{' '}
            <span className="text-mute">at scale.</span>
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
          <motion.p
            {...fadeUp(0.8)}
            className="mt-8 max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-mute sm:text-[11px]"
          >
            <span className="text-accent">●</span> live system —{' '}
            <span className="hidden lg:inline">move your cursor, you&apos;re the client. click anywhere to send traffic.</span>
            <span className="lg:hidden">tap the diagram to send traffic.</span>
            <br />
            <span className="text-ash">simulated traffic · the topology is what I&apos;ve built</span>
          </motion.p>
        </div>

        {/* Mobile slot */}
        <div ref={mobileSlot} aria-hidden className="mt-10 h-[30svh] min-h-[220px] w-full lg:hidden" />
        <motion.div {...fadeUp(0.9)} className="mt-6 lg:hidden">
          <Hud stats={stats} />
        </motion.div>

        {/* Name */}
        <motion.div style={{ y: nameY }} className="mt-auto pt-10 md:pt-6">
          <div className="flex items-end gap-6 md:gap-10">
            <h1 className="select-none leading-[0.78] tracking-[-0.05em] text-ink">
              <span className="sr-only">{PERSONAL.name}</span>
              <span aria-hidden className="pointer-events-auto">
                <ProximityText
                  text="SPR"
                  play={isLoaded}
                  delay={0.1}
                  radius={420}
                  className="block whitespace-nowrap text-[clamp(6rem,36vw,13rem)] md:text-[min(22vw,27svh,19rem)]"
                />
              </span>
            </h1>
            <motion.div {...fadeUp(1)} className="mb-[0.6em] hidden shrink-0 sm:block">
              <div className="text-2xl font-medium tracking-[-0.02em] text-ink md:text-3xl">{PERSONAL.name}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                {PERSONAL.title} · Backend
              </div>
            </motion.div>
          </div>
          <motion.div {...fadeUp(1)} className="mt-3 sm:hidden">
            <div className="text-xl font-medium tracking-[-0.02em] text-ink">{PERSONAL.name}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              {PERSONAL.title} · Backend
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          {...fadeUp(1.2)}
          className="pointer-events-auto mt-6 grid grid-cols-2 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:text-[11px] md:grid-cols-3"
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
