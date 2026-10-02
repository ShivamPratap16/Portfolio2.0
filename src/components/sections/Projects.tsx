'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import LedgerVisual from '@/components/projects/LedgerVisual';
import PlacementVisual from '@/components/projects/PlacementVisual';
import Magnetic from '@/components/fx/Magnetic';
import { PROJECTS, type Project } from '@/lib/data';
import { useMediaQuery } from '@/lib/useMediaQuery';

const VISUALS = {
  ledger: LedgerVisual,
  placement: PlacementVisual,
};

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const stacked = useMediaQuery('(min-width: 1024px) and (min-height: 760px)');
  // Cards further back in the stack shrink & dim as later ones slide over them
  const targetScale = 1 - (total - 1 - index) * 0.06;
  const scale = useTransform(progress, [index / total, 1], [1, stacked ? targetScale : 1]);
  const dim = useTransform(progress, [index / total, 1], [0, stacked ? (total - 1 - index) * 0.35 : 0]);

  // Pointer-driven tilt + spotlight
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [3, -3]), { stiffness: 120, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-3, 3]), { stiffness: 120, damping: 20 });
  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX} ${spotY}, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 60%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const Visual = VISUALS[project.visual];
  const href = project.liveUrl ?? project.githubUrl ?? undefined;

  return (
    <div className={`flex items-start justify-center ${stacked ? 'sticky top-[11vh]' : ''}`} style={{ perspective: 1400 }}>
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ scale, rotateX: rotX, rotateY: rotY, top: stacked ? `${index * 24}px` : 0 }}
        className="relative w-full origin-top overflow-hidden rounded-[28px] border border-white/[0.07] bg-surface shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
        <motion.div className="pointer-events-none absolute inset-0 z-20 bg-black" style={{ opacity: dim }} />

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-10">
          <div className="flex flex-col">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
              <span>
                <span className="text-accent">0{index + 1}</span> / 0{total}
              </span>
              <span>{project.year}</span>
            </div>

            <h3 className="mt-6 text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
              {project.title.split(' — ')[0]}
            </h3>
            {project.title.includes(' — ') && (
              <p className="mt-2 text-lg text-body">{project.title.split(' — ')[1]}</p>
            )}
            <p className="mt-5 font-serif text-3xl italic text-accent sm:text-4xl">{project.tagline}</p>
            <p className="mt-5 max-w-xl leading-relaxed text-body">{project.description}</p>

            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-white/[0.07] py-4">
              {project.highlights.map((h) => (
                <div key={h.label}>
                  <div className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{h.value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{h.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-body"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-6">
              {project.liveUrl && (
                <Magnetic>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-canvas transition-colors hover:bg-accent"
                  >
                    Live site ↗
                  </a>
                </Magnetic>
              )}
              {project.githubUrl && (
                <Magnetic>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/15 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
                  >
                    Source ↗
                  </a>
                </Magnetic>
              )}
            </div>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            data-cursor={project.liveUrl ? 'Visit' : 'Code'}
            className="relative block min-h-[420px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_60%)] p-4 sm:p-5"
            aria-label={`Open ${project.title}`}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 truncate font-mono text-[10px] text-mute">
                {project.visual === 'ledger' ? 'reckon://ledger/live' : 'tnp-nitkkr.vercel.app/dashboard'}
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                live
              </span>
            </div>
            <div className="h-[calc(100%-2rem)]">
              <Visual />
            </div>
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <div>
      <SectionLabel
        index="03"
        label="Selected work"
        title="Systems I've designed end to end."
        aside={<span>{String(PROJECTS.length).padStart(2, '0')} projects</span>}
      />
      <div ref={ref} className="relative space-y-8 lg:space-y-[10vh]">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}
