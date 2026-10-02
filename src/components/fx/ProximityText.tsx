'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from './Reveal';

/**
 * Variable-font text whose letters thicken as the cursor approaches them.
 * Each letter also rises out of a mask on reveal.
 */
export default function ProximityText({
  text,
  play,
  delay = 0,
  minWeight = 380,
  maxWeight = 820,
  radius = 260,
  className,
}: {
  text: string;
  play: boolean;
  delay?: number;
  minWeight?: number;
  maxWeight?: number;
  radius?: number;
  className?: string;
}) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const current = letters.current.map(() => minWeight);
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;

    const tick = () => {
      letters.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - pointer.x;
        const dy = r.top + r.height / 2 - pointer.y;
        const t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius);
        const target = minWeight + (maxWeight - minWeight) * t * t * (3 - 2 * t);
        current[i] += (target - current[i]) * 0.18;
        el.style.fontVariationSettings = `"wght" ${current[i].toFixed(0)}`;
      });
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [minWeight, maxWeight, radius]);

  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            ref={(el) => {
              letters.current[i] = el;
            }}
            className="inline-block"
            style={{ fontVariationSettings: `"wght" ${minWeight}` }}
            initial={{ y: '105%' }}
            animate={{ y: play ? '0%' : '105%' }}
            transition={{ duration: 1.2, delay: delay + i * 0.035, ease: EASE_OUT_EXPO }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
