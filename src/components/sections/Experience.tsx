'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/fx/Reveal';
import { EXPERIENCES, type Experience as ExperienceItem } from '@/lib/data';

// Wrap standout numbers in bullets with the accent colour
function highlight(text: string) {
  const parts = text.split(/((?<![\w+])\d+(?:\.\d+)?[%M+]*|under \d+s)/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-medium text-accent">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function Role({ item, index }: { item: ExperienceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const current = item.period.includes('Present');

  return (
    <div ref={ref} className="grid gap-10 border-t border-hairline py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-20">
      <div className="md:sticky md:top-32 md:self-start">
        <Reveal>
          <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
            <span>0{index + 1}</span>
            <span className="h-px w-8 bg-hairline" />
            <span>{item.period}</span>
            {current && (
              <span className="ml-1 rounded-full border border-accent/40 px-2 py-0.5 text-accent">Now</span>
            )}
          </div>
          <h3 className="text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
            {item.company}
          </h3>
          <p className="mt-4 font-serif text-2xl italic text-body">{item.role}</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-mute">{item.location}</p>
        </Reveal>
      </div>

      <div className="relative pl-8">
        <div className="absolute bottom-0 left-0 top-0 w-px bg-hairline">
          <motion.div className="w-px bg-accent" style={{ height: lineHeight }} />
        </div>
        <ul className="space-y-8">
          {item.bullets.map((b, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <li className="group relative text-lg leading-relaxed text-body transition-colors duration-300 hover:text-ink md:text-xl">
                <span className="absolute -left-[37px] top-[0.6em] h-2 w-2 rounded-full border border-ash bg-canvas transition-colors duration-300 group-hover:border-accent group-hover:bg-accent" />
                {highlight(b)}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <div>
      <SectionLabel index="02" label="Experience" title="Where I've shipped to production." />
      {EXPERIENCES.map((item, i) => (
        <Role key={item.company} item={item} index={i} />
      ))}
    </div>
  );
}
