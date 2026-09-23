import BlurFadeIn from '@/components/ui/BlurFadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { PROJECTS } from '@/lib/data';

export default function Projects() {
  return (
    <section id="projects" className="w-full">
      <SectionHeading title="Projects" />
      <div className="flex flex-col gap-6">
        {PROJECTS.map((project, index) => (
          <BlurFadeIn key={project.title} delay={0.1 * index}>
            <SpotlightCard className="group">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[var(--color-accent)] font-mono tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{project.title}</h3>
                </div>
                <span className="text-xs text-mute font-mono">{project.year}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[10px] tracking-wide text-ink font-mono bg-canvas border border-hairline rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="text-sm text-body leading-relaxed mb-6 font-sans">
                {project.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-mute hover:text-ink transition-colors"
                  >
                    GitHub ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-mute hover:text-ink transition-colors"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </SpotlightCard>
          </BlurFadeIn>
        ))}
      </div>
    </section>
  );
}
