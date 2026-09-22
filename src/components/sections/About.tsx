import BlurFadeIn from '@/components/ui/BlurFadeIn';
import SectionHeading from '@/components/ui/SectionHeading';

export default function About() {
  return (
    <section id="about">
      <SectionHeading title="About" />

      <BlurFadeIn delay={0.1}>
        <p className="text-sm sm:text-base leading-relaxed text-body max-w-2xl">
          Backend engineer who ships production APIs in Kotlin and Spring Boot.
          I&apos;ve cut API response times by 95%, tamed N+1 queries across
          million-row datasets, and built systems that handle real traffic.
          Currently at LEAP Finance, previously Olcademy. I think in schemas,
          indexes, and failure modes.
        </p>
      </BlurFadeIn>
    </section>
  );
}
