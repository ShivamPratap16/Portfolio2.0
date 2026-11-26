'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Fades + lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li';
}) {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  );
}

const lineVariants: Variants = {
  hidden: { y: '110%', rotate: 4 },
  show: (i: number) => ({
    y: '0%',
    rotate: 0,
    transition: { duration: 1.1, delay: i * 0.06, ease: EASE_OUT_EXPO },
  }),
};

/**
 * Masked, staggered reveal: each word (or char) slides up from behind a
 * clip. Plays on scroll-into-view, or when `play` is provided and true.
 */
export function SplitReveal({
  text,
  by = 'word',
  play,
  delay = 0,
  className,
  itemClassName,
}: {
  text: string;
  by?: 'word' | 'char';
  play?: boolean;
  delay?: number;
  className?: string;
  itemClassName?: string;
}) {
  const parts = by === 'word' ? text.split(' ') : Array.from(text);
  const controlled = play !== undefined;

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...(controlled
        ? { animate: play ? 'show' : 'hidden' }
        : { whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } })}
    >
      <span className="sr-only">{text}</span>
      {parts.map((part, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block origin-bottom-left ${itemClassName ?? ''}`}
            variants={lineVariants}
            custom={i + delay / 0.06}
          >
            {part === ' ' ? ' ' : part}
          </motion.span>
          {by === 'word' && i < parts.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  );
}
