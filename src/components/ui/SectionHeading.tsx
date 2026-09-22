import BlurFadeIn from './BlurFadeIn';
import GlitchText from './GlitchText';

interface SectionHeadingProps {
  title: string;
  delay?: number;
}

export default function SectionHeading({ title, delay = 0 }: SectionHeadingProps) {
  return (
    <BlurFadeIn delay={delay}>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[var(--color-accent)] font-bold">#</span>
        <GlitchText 
          text={title} 
          className="text-sm sm:text-base font-bold tracking-[0.1em] uppercase text-ink"
        />
      </div>
    </BlurFadeIn>
  );
}
