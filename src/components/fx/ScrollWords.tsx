'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export default function ScrollWords({
  text,
  emphasis = [],
  className,
}: {
  text: string;
  emphasis?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const clean = word.replace(/[^\w-]/g, '').toLowerCase();
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            accent={emphasis.includes(clean)}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span
        style={{ opacity }}
        className={accent ? 'font-serif italic text-accent' : undefined}
      >
        {children}
      </motion.span>
    </span>
  );
}
