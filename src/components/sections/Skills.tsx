import React from 'react';
import BlurFadeIn from '../ui/BlurFadeIn';
import SectionHeading from '../ui/SectionHeading';
import { SKILLS } from '@/lib/data';

export default function Skills() {
  const categories = Object.entries(SKILLS);

  return (
    <section id="skills" className="w-full">
      <SectionHeading title="Skills" />
      
      <div className="flex flex-col mt-10 max-w-3xl">
        {categories.map(([category, items], idx) => (
          <BlurFadeIn key={category} delay={0.1 * idx}>
            <div className="mb-10 last:mb-0">
              
              {/* Category Header */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[13px] text-[var(--color-accent)] font-mono font-medium">
                  {String(idx + 1).padStart(2, '0')} <span className="opacity-50 ml-1">/</span>
                </span>
                <h3 className="text-sm font-mono tracking-[0.15em] text-mute font-bold uppercase">
                  {category}
                </h3>
              </div>

              {/* Skills Inline List */}
              <div 
                className={`flex flex-wrap items-center gap-y-3 gap-x-3 sm:gap-x-4 pl-11 text-[15px] sm:text-base font-sans ${
                  category === 'ENGINEERING' ? 'text-ink font-medium tracking-wide' : 'text-ink/80'
                }`}
              >
                {items.map((skill, i) => (
                  <React.Fragment key={skill}>
                    <span 
                      className="relative group cursor-default hover:text-ink transition-colors duration-300"
                      title={skill}
                    >
                      {skill}
                      {/* Subtle hover underline */}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-accent)] opacity-60 group-hover:w-full transition-all duration-300" />
                    </span>
                    {i < items.length - 1 && (
                      <span className="text-hairline select-none">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </BlurFadeIn>
        ))}
      </div>
    </section>
  );
}
