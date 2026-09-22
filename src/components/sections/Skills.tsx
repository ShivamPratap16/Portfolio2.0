import BlurFadeIn from '@/components/ui/BlurFadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import { SKILLS } from '@/lib/data';

const CATEGORY_ORDER = ['languages', 'frameworks', 'databases', 'tools', 'core'] as const;

export default function Skills() {
  return (
    <section id="skills">
      <SectionHeading title="Skills" />

      <div className="space-y-0">
        {CATEGORY_ORDER.map((category, i) => {
          const items = SKILLS[category];
          if (!items || items.length === 0) return null;

          return (
            <BlurFadeIn key={category} delay={0.1 * i}>
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-wider text-mute mb-2">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="bg-ink/10 text-ink border border-hairline rounded-md px-2.5 py-0.5 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </BlurFadeIn>
          );
        })}
      </div>
    </section>
  );
}
