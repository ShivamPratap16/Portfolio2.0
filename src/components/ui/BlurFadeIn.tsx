'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurFadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left';
}

export default function BlurFadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: BlurFadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        filter: 'blur(10px)',
        y: direction === 'up' ? 6 : 0,
        x: direction === 'left' ? -6 : 0,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              x: 0,
            }
          : {}
      }
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
