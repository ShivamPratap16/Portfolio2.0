import { SplitReveal } from '@/components/fx/Reveal';

/** "(02) — Experience" style header with a big title that reveals word by word. */
export default function SectionLabel({
  index,
  label,
  title,
  aside,
}: {
  index: string;
  label: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-16 md:mb-24">
      <div className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        <span className="text-accent">({index})</span>
        <span>{label}</span>
        <span className="h-px flex-1 bg-hairline" />
        {aside}
      </div>
      <h2 className="max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
        <SplitReveal text={title} />
      </h2>
    </div>
  );
}
