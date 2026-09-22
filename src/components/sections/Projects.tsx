import BlurFadeIn from '@/components/ui/BlurFadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import { PROJECTS } from '@/lib/data';

export default function Projects() {
  return (
    <section id="projects">
      <SectionHeading title="Projects" />

      <div>
        {PROJECTS.map((project, i) => (
          <BlurFadeIn key={project.title} delay={0.1 * i}>
            <div className="py-6 sm:py-7 border-b border-hairline px-2 -mx-2 rounded-sm hover:bg-surface-soft/30 transition-colors">
              {/* Title row */}
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-mono text-ash tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[15px] font-medium text-ink">
                  {project.title}
                </h3>
                <span className="text-[10px] text-ash">{project.year}</span>
              </div>

              {/* Description */}
              <p className="mt-2 text-[13px] sm:text-[14px] leading-[1.6] text-body max-w-2xl ml-[calc(11px+0.75rem)]">
                {project.description}
              </p>

              {/* Tech stack pills */}
              <div className="mt-3 flex flex-wrap gap-1.5 ml-[calc(11px+0.75rem)]">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] tracking-[0.04em] text-mute border border-hairline rounded-full px-2 py-0.5 bg-canvas"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              {(project.liveUrl || project.githubUrl) && (
                <div className="mt-3 flex gap-4 ml-[calc(11px+0.75rem)]">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-mute underline underline-offset-2 hover:text-ink transition-colors inline-flex items-center gap-1"
                    >
                      Live
                      <span className="text-[10px]">↗</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-mute underline underline-offset-2 hover:text-ink transition-colors inline-flex items-center gap-1"
                    >
                      GitHub
                      <span className="text-[10px]">↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </BlurFadeIn>
        ))}
      </div>
    </section>
  );
}
