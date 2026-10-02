'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const STAGES = ['Applied', 'Eligible', 'Shortlisted', 'Placed'] as const;
const COLS = 12;
const ROWS = 6;
const N = COLS * ROWS;
const NAMES = ['Aarav', 'Diya', 'Kabir', 'Isha', 'Rohan', 'Meera', 'Arjun', 'Sana', 'Vivaan', 'Anika'];
const COMPANIES = ['Atlassian', 'Razorpay', 'Zomato', 'Adobe', 'Cred', 'Swiggy'];

// stage: -1 = not applied, 0..3 = pipeline stage, 9 = filtered out by eligibility
type Stage = number;

/** A placement drive in fast-forward: students flow through the automated pipeline. */
export default function PlacementVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const [stages, setStages] = useState<Stage[]>(() => Array(N).fill(-1));
  const [feed, setFeed] = useState<{ id: number; text: string; ok: boolean }[]>([]);
  const tick = useRef(0);
  const stagesRef = useRef<Stage[]>(stages);
  const feedId = useRef(0);

  const pushFeed = (text: string, ok: boolean) => {
    const id = ++feedId.current;
    setFeed((f) => [{ id, text, ok }, ...f].slice(0, 4));
  };

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      tick.current += 1;
      const prev = stagesRef.current;
      let next = [...prev];
      const settled = next.every((st) => st === 3 || st === 9 || st === 2);
      if (settled && tick.current % 6 === 0) {
        next = Array(N).fill(-1);
      } else {
        const events: [string, boolean][] = [];
        for (let k = 0; k < 5; k++) {
          const i = Math.floor(Math.random() * N);
          const st = next[i];
          const name = NAMES[i % NAMES.length];
          const company = COMPANIES[i % COMPANIES.length];
          if (st === -1) next[i] = 0;
          else if (st === 0) {
            const ok = Math.random() > 0.25;
            next[i] = ok ? 1 : 9;
            events.push([ok ? `${name} · eligibility ✓ auto-verified` : `${name} · below cutoff → filtered`, ok]);
          } else if (st === 1 && Math.random() > 0.4) {
            next[i] = 2;
            events.push([`${name} · shortlisted by ${company}`, true]);
          } else if (st === 2 && Math.random() > 0.6) {
            next[i] = 3;
            events.push([`🎉 ${name} placed at ${company}`, true]);
          }
        }
        if (events.length && tick.current % 3 === 0) pushFeed(...events[events.length - 1]);
      }
      stagesRef.current = next;
      setStages(next);
    }, 260);
    return () => clearInterval(id);
  }, [inView]);

  const counts = STAGES.map((_, i) =>
    stages.filter((st) => (i === 0 ? st !== -1 : st >= i && st !== 9)).length,
  );

  const color = (s: Stage) =>
    s === 9
      ? 'bg-rose-500/30'
      : s === 3
        ? 'bg-accent shadow-[0_0_10px_var(--color-accent)]'
        : s === 2
          ? 'bg-accent/60'
          : s === 1
            ? 'bg-ink/50'
            : s === 0
              ? 'bg-ink/20'
              : 'bg-white/[0.04]';

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 font-mono text-[11px] sm:text-xs">
      <div className="grid grid-cols-4 gap-2">
        {STAGES.map((s, i) => (
          <div key={s} className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
            <div className="truncate text-mute">{s}</div>
            <div className={`mt-1 text-lg tabular-nums sm:text-xl ${i === 3 ? 'text-accent' : 'text-ink'}`}>
              {counts[i]}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 rounded-xl border border-white/[0.06] bg-black/40 p-4">
        <div className="mb-3 flex justify-between text-mute">
          <span>students</span>
          <span>role: coordinator · jwt ✓</span>
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {stages.map((s, i) => (
            <motion.div
              key={i}
              className={`aspect-square rounded-[4px] transition-colors duration-500 ${color(s)}`}
              animate={{ scale: s === 3 ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </div>

      <div className="h-[92px] overflow-hidden rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2">
        <AnimatePresence initial={false}>
          {feed.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`truncate py-0.5 ${f.ok ? 'text-body' : 'text-rose-400/80'}`}
            >
              <span className="text-mute">›</span> {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
