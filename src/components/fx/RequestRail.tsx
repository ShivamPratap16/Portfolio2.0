'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useApp } from '@/context/AppProvider';
import { scrollToId } from '@/lib/scroll';

/** Sections as hops of one request travelling down the page. */
const HOPS = [
  { id: 'top', label: 'client' },
  { id: 'about', label: 'handshake' },
  { id: 'experience', label: 'upstream' },
  { id: 'projects', label: 'services' },
  { id: 'skills', label: 'deps' },
  { id: 'contact', label: '200 ok' },
];
const TOTAL_MS = 248;

export default function RequestRail() {
  const { isLoaded, viewMode } = useApp();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const top = useTransform(p, (v) => `${v * 100}%`);
  const [marks, setMarks] = useState<number[]>([]);
  const [hop, setHop] = useState(0);
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setMarks(
        HOPS.map((h) => {
          const el = document.getElementById(h.id);
          return el ? Math.min(1, Math.max(0, (el.offsetTop - window.innerHeight * 0.35) / max)) : 0;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(p, 'change', (v) => {
    setMs(Math.round(v * TOTAL_MS));
    let h = 0;
    marks.forEach((m, i) => {
      if (v >= m - 0.001) h = i;
    });
    setHop(h);
  });

  if (viewMode === 'api') return null;
  const done = hop === HOPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ delay: 1.2, duration: 1 }}
      className="pointer-events-none fixed left-3 top-1/2 z-40 hidden h-[64vh] -translate-y-1/2 xl:block"
      aria-hidden
    >
      <div className="relative h-full w-px bg-white/[0.08]">
        <motion.div className="absolute left-0 top-0 w-px bg-accent/60" style={{ height: top }} />
        {marks.map((m, i) => (
          <button
            key={HOPS[i].id}
            onClick={() => scrollToId(HOPS[i].id)}
            className={`pointer-events-auto absolute -left-[3px] h-[7px] w-[7px] rounded-[2px] border transition-colors ${
              i <= hop ? 'border-accent bg-accent' : 'border-white/25 bg-canvas'
            }`}
            style={{ top: `calc(${m * 100}% - 3px)` }}
            title={HOPS[i].label}
          />
        ))}
        <motion.div className="absolute -left-[5px]" style={{ top }}>
          <span className={`block h-[11px] w-[11px] -translate-y-1/2 rounded-full ${done ? 'bg-emerald-400' : 'bg-accent'} shadow-[0_0_18px_4px_var(--color-accent)]`} />
          <span
            className={`absolute left-4 top-0 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] [writing-mode:vertical-rl] ${
              done ? 'text-emerald-400' : 'text-mute'
            }`}
            style={{ transform: 'translateY(-50%) rotate(180deg)' }}
          >
            {HOPS[hop].label} · t+{ms}ms
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
