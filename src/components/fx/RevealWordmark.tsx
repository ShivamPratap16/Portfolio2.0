'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

/** Outlined wordmark; a soft spotlight under the pointer fills it with the accent colour. */
export default function RevealWordmark({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(-500), { stiffness: 200, damping: 30 });
  const y = useSpring(useMotionValue(-500), { stiffness: 200, damping: 30 });
  const mask = useMotionTemplate`radial-gradient(circle 220px at ${x}px ${y}px, black 30%, transparent 100%)`;

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const onLeave = () => {
    x.set(-500);
    y.set(-500);
  };

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative select-none ${className ?? ''}`}
    >
      <div className="text-outline">{text}</div>
      <motion.div
        className="absolute inset-0 text-accent"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {text}
      </motion.div>
    </div>
  );
}
