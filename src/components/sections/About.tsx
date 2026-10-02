'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import ScrollWords from '@/components/fx/ScrollWords';
import { Reveal } from '@/components/fx/Reveal';
import { ACHIEVEMENTS, EDUCATION, MANIFESTO, METRICS, POSITIONS } from '@/lib/data';

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [display, setDisplay] = useState(0);
  const decimals = Number.isInteger(value) ? 0 : 1;

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(value * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function About() {
  const edu = EDUCATION[0];
  return (
    <div>
      <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        <span className="text-accent">(01)</span>
        <span>About</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <ScrollWords
        text={MANIFESTO}
        emphasis={['fast', 'correct', 'boring', 'milliseconds', 'invariants', 'people']}
        className="max-w-6xl text-[clamp(1.75rem,4.2vw,3.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-ink"
      />

      <div className="mt-24 grid grid-cols-2 border-t border-hairline md:grid-cols-4">
        {METRICS.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 0.08}
            className={`border-b border-hairline py-8 md:border-b-0 ${i % 2 === 0 ? 'border-r' : ''} md:border-r ${
              i === METRICS.length - 1 ? 'md:border-r-0' : ''
            } ${i > 0 ? 'pl-5 md:pl-8' : ''}`}
          >
            <div className="text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.05em] text-ink">
              <Counter value={m.value} suffix={m.suffix} />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{m.label}</div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 grid gap-6 rounded-3xl border border-hairline bg-surface-soft p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent font-serif text-2xl italic text-canvas">
          Ed
        </div>
        <div>
          <div className="text-xl font-medium tracking-tight text-ink sm:text-2xl">{edu.institution}</div>
          <div className="mt-1 text-body">{edu.degree}</div>
        </div>
        <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.15em] text-mute md:flex-col md:gap-1 md:text-right">
          <span>{edu.period}</span>
          <span className="text-accent">{edu.score}</span>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {[
          { heading: 'Leadership', items: POSITIONS },
          { heading: 'Achievements', items: ACHIEVEMENTS },
        ].map((group, g) => (
          <Reveal key={group.heading} delay={g * 0.08} className="rounded-3xl border border-hairline p-6 sm:p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{group.heading}</div>
            <ul className="mt-5 space-y-5">
              {group.items.map((item) => (
                <li key={item.title} className="grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <div className="font-medium text-ink">{item.title}</div>
                    <div className="mt-1 text-sm leading-relaxed text-body">{item.org}</div>
                  </div>
                  <span className="font-mono text-xs text-mute">{item.period}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
