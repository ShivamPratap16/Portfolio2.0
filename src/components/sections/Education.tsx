import BlurFadeIn from '@/components/ui/BlurFadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import { EDUCATION, ACHIEVEMENTS, POSITIONS } from '@/lib/data';

export default function EducationSection() {
  return (
    <section id="education">
      <SectionHeading title="Education" />

      {/* Education cards */}
      <div>
        {EDUCATION.map((edu, i) => (
          <BlurFadeIn key={edu.institution} delay={0.1 * i}>
            <div className="py-4 border-b border-hairline">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-ink">
                    {edu.institution}
                  </h3>
                  <p className="text-xs text-body mt-0.5">{edu.degree}</p>
                </div>
                <span className="text-xs text-mute tabular-nums whitespace-nowrap shrink-0">
                  {edu.period}
                </span>
              </div>
              <p className="text-xs text-mute mt-1">{edu.score}</p>
            </div>
          </BlurFadeIn>
        ))}
      </div>

      {/* Positions of Responsibility */}
      {POSITIONS.length > 0 && (
        <div className="mt-10">
          <BlurFadeIn delay={0.1 * EDUCATION.length}>
            <h3 className="text-xs uppercase tracking-wider text-mute mb-4">
              Leadership
            </h3>
          </BlurFadeIn>

          <div className="space-y-3">
            {POSITIONS.map((pos, i) => (
              <BlurFadeIn
                key={pos.title + pos.org}
                delay={0.1 * (EDUCATION.length + 1 + i)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{pos.title}</p>
                    <p className="text-xs text-body">{pos.org}</p>
                  </div>
                  <span className="text-xs text-ash whitespace-nowrap shrink-0">
                    {pos.period}
                  </span>
                </div>
              </BlurFadeIn>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {ACHIEVEMENTS.length > 0 && (
        <div className="mt-10">
          <BlurFadeIn
            delay={0.1 * (EDUCATION.length + POSITIONS.length + 1)}
          >
            <h3 className="text-xs uppercase tracking-wider text-mute mb-4">
              Achievements
            </h3>
          </BlurFadeIn>

          <ul className="space-y-2">
            {ACHIEVEMENTS.map((achievement, i) => (
              <BlurFadeIn
                key={achievement}
                delay={
                  0.1 * (EDUCATION.length + POSITIONS.length + 2 + i)
                }
              >
                <li className="flex gap-2 text-xs sm:text-sm text-body leading-relaxed">
                  <span className="text-ash select-none shrink-0">–</span>
                  <span>{achievement}</span>
                </li>
              </BlurFadeIn>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
