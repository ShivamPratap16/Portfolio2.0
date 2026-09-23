'use client';

import TerminalHero from "@/components/hero/TerminalHero";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import ApiView from "@/components/views/ApiView";
import { useApp } from "@/context/AppProvider";

export default function Home() {
  const { viewMode } = useApp();

  if (viewMode === 'api') {
    return <ApiView />;
  }

  return (
    <>
      {/* Hero */}
      <section id="hero" className="relative bg-transparent font-mono overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16 lg:px-24 pt-4 sm:pt-6 md:pt-10 pb-4 sm:pb-6 md:pb-8">
          <TerminalHero />
        </div>
      </section>

      {/* Metrics (Hidden for now) */}
      {/* 
      <section className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-8 md:py-12">
          <MetricsStrip />
        </div>
      </section>
      */}

      {/* About (Hidden for now) */}
      {/* 
      <section id="about" className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <About />
        </div>
      </section>
      */}

      {/* Experience */}
      <section id="experience" className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Experience />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Projects />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Skills />
        </div>
      </section>

      {/* Education */}
      <section id="education" className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Education />
        </div>
      </section>

      {/* Contact (Hidden for now) */}
      {/* 
      <section id="contact" className="bg-transparent">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-24">
          <Contact />
        </div>
      </section>
      */}

    </>
  );
}
