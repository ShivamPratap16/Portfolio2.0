import BlurFadeIn from '../ui/BlurFadeIn';
import SectionHeading from '../ui/SectionHeading';
import SpotlightCard from '../ui/SpotlightCard';
import { EDUCATION } from '@/lib/data';

export default function Education() {
  return (
    <section id="education" className="w-full">
      <SectionHeading title="Education" />
      <div className="max-w-3xl">
        {EDUCATION.map((edu, index) => (
          <BlurFadeIn key={edu.degree} delay={0.1 * index}>
            <SpotlightCard>
              <h4 className="text-lg font-bold text-ink">{edu.degree}</h4>
              <div className="text-sm text-mute mt-1">{edu.institution}</div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-hairline/50">
                <span className="text-sm text-[var(--color-accent)] font-mono">{edu.score}</span>
                <span className="text-sm text-mute font-mono">{edu.period}</span>
              </div>
            </SpotlightCard>
          </BlurFadeIn>
        ))}
      </div>
    </section>
  );
}
