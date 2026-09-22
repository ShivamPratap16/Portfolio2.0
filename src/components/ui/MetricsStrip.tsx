'use client';

import { useEffect, useRef } from 'react';
import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
  motion,
} from 'framer-motion';
import { METRICS } from '@/lib/data';
import BlurFadeIn from './BlurFadeIn';

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    if (Number.isInteger(value)) return Math.round(v).toString();
    return v.toFixed(1);
  });

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: 'easeOut' });
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref} className="text-2xl sm:text-3xl font-bold text-ink">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function MetricsStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 border border-hairline">
      {METRICS.map((m, i) => (
        <BlurFadeIn key={i} delay={0.1 * i}>
          <div className="p-4 sm:p-6 text-center border-hairline [&:not(:last-child)]:border-r">
            <Counter value={m.value} suffix={m.suffix} />
            <p className="mt-1 text-[10px] sm:text-xs text-mute uppercase tracking-wider">
              {m.label}
            </p>
          </div>
        </BlurFadeIn>
      ))}
    </div>
  );
}
