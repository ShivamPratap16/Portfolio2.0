'use client';

import { motion } from 'framer-motion';

export default function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-[2px] -z-10 text-[var(--color-accent)] opacity-70"
        animate={{
          x: [-2, 2, -1, 0],
          y: [1, -1, 0, 0],
          opacity: [0, 0.8, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.1, 0.2, 1],
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 -left-[2px] -z-10 text-[#e879f9] opacity-70"
        animate={{
          x: [2, -2, 1, 0],
          y: [-1, 1, 0, 0],
          opacity: [0, 0.8, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.1, 0.2, 1],
          delay: 0.05,
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}
