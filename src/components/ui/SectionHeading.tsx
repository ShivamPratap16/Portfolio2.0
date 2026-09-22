import BlurFadeIn from './BlurFadeIn';

interface SectionHeadingProps {
  title: string;
  delay?: number;
}

export default function SectionHeading({ title, delay = 0 }: SectionHeadingProps) {
  return (
    <BlurFadeIn delay={delay}>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-ink font-bold">#</span>
        <span className="text-sm sm:text-base font-bold tracking-[0.1em] uppercase text-ink">
          {title}
        </span>
      </div>
    </BlurFadeIn>
  );
}
