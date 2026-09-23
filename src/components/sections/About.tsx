import BlurFadeIn from '../ui/BlurFadeIn';
import SectionHeading from '../ui/SectionHeading';
import { PERSONAL } from '@/lib/data';

export default function About() {
  return (
    <div className="w-full">
      <SectionHeading title="About" />
      <BlurFadeIn delay={0.1}>
        <p className="text-sm sm:text-base text-body leading-relaxed max-w-3xl">
          I am a backend-focused Software Engineer with a passion for designing scalable systems, 
          optimizing performance bottlenecks, and writing clean, reliable APIs. 
          Currently based in {PERSONAL.location}, I specialize in building robust enterprise 
          solutions using Kotlin, Spring Boot, and PostgreSQL. When I am not optimizing 
          SQL queries, I enjoy organizing tech events and participating in hackathons.
        </p>
      </BlurFadeIn>
    </div>
  );
}
