'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurFadeIn from '../ui/BlurFadeIn';
import SectionHeading from '../ui/SectionHeading';
import SpotlightCard from '../ui/SpotlightCard';
import { EXPERIENCES } from '@/lib/data';

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="w-full">
      <SectionHeading title="Experience" />
      <div className="flex flex-col gap-4">
        {EXPERIENCES.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <BlurFadeIn key={`${exp.company}-${exp.role}`} delay={0.1 * index}>
              <SpotlightCard 
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      {exp.role}
                    </h3>
                    <div className="text-sm text-[var(--color-accent)] font-mono mt-1">
                      {exp.company} <span className="text-mute px-1">·</span> {exp.location}
                    </div>
                  </div>
                  <div className="text-xs text-mute font-mono flex items-center gap-3">
                    {exp.period}
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </motion.svg>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 space-y-3 font-sans">
                        {exp.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="text-sm text-body leading-relaxed flex items-start gap-3"
                          >
                            <span className="text-[var(--color-accent)] mt-1.5 text-[8px] opacity-60">
                              ■
                            </span>
                            <span className="flex-1">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            </BlurFadeIn>
          );
        })}
      </div>
    </section>
  );
}
