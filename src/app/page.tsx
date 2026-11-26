'use client';

import Hero from '@/components/hero/Hero';
import CityScene from '@/components/three/CityScene';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import Marquee from '@/components/fx/Marquee';
import ApiView from '@/components/views/ApiView';
import { useApp } from '@/context/AppProvider';
import { SKILLS } from '@/lib/data';

const MARQUEE_WORDS = [...SKILLS.LANGUAGES.slice(0, 2), ...SKILLS.BACKEND.slice(0, 1), ...SKILLS.DATA, ...SKILLS.INFRA.slice(0, 2)];

function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative px-5 sm:px-8 ${className}`}>
      <div className="mx-auto max-w-[1400px]">{children}</div>
    </section>
  );
}

export default function Home() {
  const { viewMode } = useApp();

  if (viewMode === 'api') {
    return <ApiView />;
  }

  return (
    <>
      <CityScene />
      <div className="relative z-10">
      <Hero />

      <div className="border-y border-hairline py-6 md:py-8">
        <Marquee baseVelocity={-2.5}>
          {MARQUEE_WORDS.map((w, i) => (
            <span key={w} className="flex items-center">
              <span
                className={`px-6 text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.04em] md:px-10 ${
                  i % 2 ? 'text-outline' : 'text-ink'
                }`}
              >
                {w}
              </span>
              <span className="text-[clamp(1.5rem,3vw,2.5rem)] text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Section id="about" className="py-24 md:py-28">
        <About />
      </Section>

      <Section id="experience" className="py-16 md:py-24">
        <Experience />
      </Section>

      <Section id="projects" className="py-16 md:py-24">
        <Projects />
      </Section>

      <Section id="skills" className="py-16 md:py-24">
        <Skills />
      </Section>

      <Section id="contact" className="pt-24 md:pt-28">
        <Contact />
      </Section>
      </div>
    </>
  );
}
