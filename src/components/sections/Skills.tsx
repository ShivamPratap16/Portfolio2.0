'use client';

import SectionLabel from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/fx/Reveal';
import { SKILLS } from '@/lib/data';

const BLURBS: Record<string, string> = {
  LANGUAGES: 'What I think in',
  BACKEND: 'What I build with',
  DATA: 'Where the state lives',
  INFRA: 'How it ships',
  ENGINEERING: 'What I obsess over',
};

export default function Skills() {
  const categories = Object.entries(SKILLS);

  return (
    <div>
      <SectionLabel index="04" label="Toolkit" title="The stack behind the systems." />
      <ul className="border-t border-hairline">
        {categories.map(([category, items], i) => (
          <Reveal key={category} delay={i * 0.04} y={20}>
            <li className="group relative overflow-hidden border-b border-hairline">
              {/* accent wipe on hover */}
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <div className="relative grid items-center gap-4 px-2 py-7 transition-colors duration-500 group-hover:text-canvas md:grid-cols-[80px_minmax(0,1fr)_minmax(0,1.3fr)] md:py-9">
                <span className="hidden font-mono text-xs text-mute transition-colors duration-500 group-hover:text-canvas/60 md:block">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-3xl font-semibold capitalize tracking-[-0.03em] text-ink transition-all duration-500 group-hover:translate-x-3 group-hover:text-canvas md:text-5xl">
                    {category.toLowerCase()}
                  </h3>
                  <p className="mt-1 font-serif text-lg italic text-mute transition-colors duration-500 group-hover:text-canvas/70">
                    {BLURBS[category]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-hairline px-3.5 py-1.5 font-mono text-xs text-body transition-colors duration-500 group-hover:border-canvas/25 group-hover:text-canvas"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
