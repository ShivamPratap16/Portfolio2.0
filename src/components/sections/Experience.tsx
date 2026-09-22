'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BlurFadeIn from '@/components/ui/BlurFadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import { EXPERIENCES } from '@/lib/data';

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setExpandedIndex((prev) => (prev === i ? null : i));

  return (
    <section id="experience">
      <SectionHeading title="Experience" />

      <div>
        {EXPERIENCES.map((exp, i) => (
          <BlurFadeIn key={exp.company} delay={0.1 * i}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              className="group cursor-pointer border-b border-hairline py-5 sm:py-6 px-2 -mx-2 rounded-sm hover:bg-surface-soft/30 transition-colors"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-ink font-medium text-sm sm:text-base">
                      {exp.company}
                    </span>
                    <span className="text-ash text-xs">{exp.location}</span>
                  </div>
                  <p className="text-xs text-mute mt-0.5">{exp.role}</p>
                </div>

                <span className="text-xs text-mute tabular-nums whitespace-nowrap shrink-0">
                  {exp.period}
                </span>
              </div>

              {/* Expandable bullets */}
              <AnimatePresence initial={false}>
                {expandedIndex === i && (
                  <motion.div
                    key="bullets"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-4 space-y-2">
                      {exp.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2 text-xs sm:text-sm text-body leading-relaxed"
                        >
                          <span className="text-ash select-none shrink-0">
                            –
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BlurFadeIn>
        ))}
      </div>
    </section>
  );
}
