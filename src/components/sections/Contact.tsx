'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitReveal, Reveal } from '@/components/fx/Reveal';
import Magnetic from '@/components/fx/Magnetic';
import ScrambleText from '@/components/fx/ScrambleText';
import RevealWordmark from '@/components/fx/RevealWordmark';
import { PERSONAL, SOCIAL_LINKS } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';
import { useModKey } from '@/lib/useModKey';
import RequestComposer from '@/components/sections/RequestComposer';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const mod = useModKey();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PERSONAL.email}`;
    }
  };

  return (
    <div className="relative">
      <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        <span className="text-accent">(05)</span>
        <span>Contact</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <h2 className="text-[clamp(3rem,11vw,10.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-ink">
        <SplitReveal text="Let's build" className="block" />
        <span className="flex flex-wrap items-center gap-x-[0.25em]">
          <SplitReveal text="something" className="font-serif font-normal italic text-accent" delay={0.15} />
          <SplitReveal text="that scales." delay={0.25} />
        </span>
      </h2>

      <div className="mt-16 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <p className="max-w-lg text-xl leading-snug text-body">
            Currently building at Carelon Global Solutions. If you have a hard problem involving APIs, data or
            correctness under load — I&apos;d love to hear about it.
          </p>
          <button
            onClick={copy}
            data-cursor={copied ? 'Copied' : 'Copy'}
            className="group mt-8 flex items-center gap-3 border-b border-hairline pb-2 text-left text-2xl font-medium tracking-tight text-ink transition-colors hover:border-accent sm:text-3xl"
          >
            <span className="break-all">{PERSONAL.email}</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? 'y' : 'n'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="shrink-0 font-mono text-xs uppercase tracking-[0.15em] text-accent"
              >
                {copied ? 'copied ✓' : 'copy'}
              </motion.span>
            </AnimatePresence>
          </button>
        </Reveal>

        <Reveal delay={0.1}>
          <RequestComposer />
        </Reveal>
      </div>

      <div className="mt-24 grid gap-10 border-t border-hairline pt-10 md:grid-cols-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Socials</div>
          <ul className="mt-4 space-y-2">
            {SOCIAL_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-lg text-body transition-colors hover:text-accent"
                >
                  <ScrambleText text={l.label} onHover duration={450} />
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Shortcuts</div>
          <ul className="mt-4 space-y-2 text-body">
            <li>
              <kbd className="rounded border border-hairline px-1.5 py-0.5 font-mono text-xs text-ink">{mod} K</kbd>{' '}
              command palette
            </li>
            <li>
              <kbd className="rounded border border-hairline px-1.5 py-0.5 font-mono text-xs text-ink">{mod} `</kbd>{' '}
              interactive terminal
            </li>
            <li className="text-mute">try `sudo hire shivam`</li>
          </ul>
        </div>
        <div className="md:text-right">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Résumé</div>
          <a
            href="/Shivam_resume.pdf"
            download="Shivam_resume.pdf"
            className="mt-4 inline-block text-lg text-body transition-colors hover:text-accent"
          >
            Download PDF ↓
          </a>
        </div>
      </div>

      <footer className="mt-24">
        <RevealWordmark
          text="SPR"
          className="whitespace-nowrap text-center text-[min(24vw,21rem)] font-semibold leading-[0.8] tracking-[-0.07em]"
        />
        <div className="mt-8 flex flex-col gap-3 border-t border-hairline py-6 font-mono text-[11px] uppercase tracking-[0.15em] text-mute sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {PERSONAL.name}</span>
          <span>Designed &amp; engineered from scratch</span>
          <button onClick={() => scrollToId('top')} className="text-left uppercase text-ink transition-colors hover:text-accent">
            Back to top ↑
          </button>
        </div>
      </footer>
    </div>
  );
}
