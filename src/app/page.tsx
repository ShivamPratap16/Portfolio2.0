import TerminalHero from "@/components/hero/TerminalHero";
import MetricsStrip from "@/components/ui/MetricsStrip";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section id="hero" className="relative bg-canvas font-mono overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16 lg:px-24 pt-8 sm:pt-12 pb-4 sm:pb-6 md:pt-16 md:pb-8">
          <TerminalHero />
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-8 md:py-12">
          <MetricsStrip />
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <About />
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Experience />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Projects />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Skills />
        </div>
      </section>

      {/* Education */}
      <section id="education" className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <Education />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-canvas">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 md:px-16 lg:px-24 py-12 md:py-24">
          <Contact />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline py-8 text-center">
        <p className="text-xs text-ash">
          Built with Next.js & Tailwind CSS · Deployed on Vercel
        </p>
        <p className="text-[10px] text-ash/60 mt-1">
          © {new Date().getFullYear()} Shivam Pratap Raj
        </p>
      </footer>
    </>
  );
}
