'use client';

import Hero from '@/components/hero/Hero';
import ParticleScene from '@/components/three/ParticleScene';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import ApiView from '@/components/views/ApiView';
import { useApp } from '@/context/AppProvider';


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
      <ParticleScene />
      <div className="relative z-10">
      <Hero />


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
