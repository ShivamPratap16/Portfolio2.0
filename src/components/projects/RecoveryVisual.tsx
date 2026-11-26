'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const STAGES = ['dropped', 'nudged', 'calling', 'analyzed', 'recovered'] as const;
type Stage = (typeof STAGES)[number] | 'dnd' | 'callback';

interface Lead {
  id: number;
  name: string;
  step: string;
  stage: Stage;
  note?: string;
}

const NAMES = ['Aarav', 'Diya', 'Kabir', 'Isha', 'Rohan', 'Meera', 'Vivaan', 'Anaya', 'Arjun', 'Saanvi'];
const STEPS = ['aadhaar_otp', 'pan_verify', 'video_kyc', 'bank_link'];
const OUTCOMES: { stage: Stage; note: string }[] = [
  { stage: 'recovered', note: 'completed KYC' },
  { stage: 'recovered', note: 'completed KYC' },
  { stage: 'callback', note: '"shaam 6 baje ke baad" → 18:00' },
  { stage: 'dnd', note: '"dobara call mat karna" → DND' },
];
const ROWS = 9;

const STAGE_STYLE: Record<Stage, string> = {
  dropped: 'text-rose-400',
  nudged: 'text-amber-300',
  calling: 'text-sky-300',
  analyzed: 'text-violet-300',
  recovered: 'text-accent',
  callback: 'text-amber-300',
  dnd: 'text-mute',
};

/** KYC drop-offs flowing through nudge → AI call → Gemini analysis → action. */
export default function RecoveryVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const [leads, setLeads] = useState<Lead[]>([
    { id: -1, name: 'Ritika', step: 'pan_verify', stage: 'dropped' },
    { id: -2, name: 'Kunal', step: 'aadhaar_otp', stage: 'nudged' },
    { id: -3, name: 'Pooja', step: 'video_kyc', stage: 'calling' },
    { id: -4, name: 'Neha', step: 'aadhaar_otp', stage: 'recovered', note: 'completed KYC' },
    { id: -5, name: 'Dev', step: 'video_kyc', stage: 'callback', note: '"kal subah" → 10:00' },
    { id: -6, name: 'Sahil', step: 'bank_link', stage: 'recovered', note: 'completed KYC' },
  ]);
  const [stats, setStats] = useState({ dropped: 118, recovered: 38 });
  const counter = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      const n = ++counter.current;
      setLeads((prev) => {
        // advance every in-flight lead one stage
        const advanced = prev.map((l) => {
          const i = STAGES.indexOf(l.stage as (typeof STAGES)[number]);
          if (i < 0 || l.stage === 'recovered') return l;
          if (l.stage === 'analyzed') {
            const o = OUTCOMES[Math.abs(l.id + n) % OUTCOMES.length];
            if (o.stage === 'recovered') setStats((s) => ({ ...s, recovered: s.recovered + 1 }));
            return { ...l, stage: o.stage, note: o.note };
          }
          return { ...l, stage: STAGES[i + 1] };
        });
        // new drop-off every other tick
        if (n % 2 === 1) {
          setStats((s) => ({ ...s, dropped: s.dropped + 1 }));
          return [
            {
              id: n,
              name: NAMES[n % NAMES.length],
              step: STEPS[n % STEPS.length],
              stage: 'dropped' as Stage,
            },
            ...advanced,
          ].slice(0, ROWS);
        }
        return advanced;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [inView]);

  const rate = Math.round((stats.recovered / stats.dropped) * 100);

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 font-mono text-[11px] sm:text-xs">
      {/* Pipeline */}
      <div className="grid grid-cols-5 gap-1.5">
        {STAGES.map((s) => (
          <div key={s} className="rounded-lg border border-white/[0.06] bg-black/40 px-2 py-2 text-center">
            <div className={`truncate ${STAGE_STYLE[s]}`}>{s}</div>
            <div className="mt-1 text-sm tabular-nums text-ink">{leads.filter((l) => l.stage === s).length}</div>
          </div>
        ))}
      </div>

      {/* Event stream */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
        <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 border-b border-white/[0.06] px-3 py-2 text-mute">
          <span>user</span>
          <span>stuck at</span>
          <span className="text-right">status</span>
        </div>
        <AnimatePresence initial={false}>
          {leads.map((l) => (
            <motion.div
              key={l.id}
              layout
              initial={{ opacity: 0, y: -16, backgroundColor: 'rgba(255,255,255,0.07)' }}
              animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 px-3 py-1.5"
            >
              <span className="truncate text-body">{l.name}</span>
              <span className="truncate text-mute">{l.step}</span>
              <span className={`truncate text-right ${STAGE_STYLE[l.stage]}`}>
                {l.note ?? `${l.stage}${l.stage === 'calling' ? ' ☎' : ''}`}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2.5">
        <span className="text-body">
          recovered {stats.recovered}/{stats.dropped}
        </span>
        <span className="text-accent">{rate}% won back ✓</span>
      </div>
    </div>
  );
}
