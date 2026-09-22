'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TERMINAL_COMMANDS, PERSONAL, SOCIAL_LINKS } from '@/lib/data';
import BlurFadeIn from '@/components/ui/BlurFadeIn';
import ServerCluster from '@/components/ui/ServerCluster';

/* ─── Typing engine ──────────────────────────────────────────────────────── */

interface TerminalLine {
  type: 'command' | 'response';
  text: string;
}

function useTypingEngine() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [done, setDone] = useState(false);

  const runSequence = useCallback(async () => {
    for (let i = 0; i < TERMINAL_COMMANDS.length; i++) {
      const { cmd, response } = TERMINAL_COMMANDS[i];

      // Type command character by character
      for (let j = 0; j <= cmd.length; j++) {
        await new Promise((r) => setTimeout(r, 35));
        setCurrentTyping(cmd.slice(0, j));
      }

      // Commit command line + response
      await new Promise((r) => setTimeout(r, 150));
      setCurrentTyping('');
      setLines((prev) => [
        ...prev,
        { type: 'command', text: cmd },
        { type: 'response', text: response },
      ]);

      // Pause before next command
      if (i < TERMINAL_COMMANDS.length - 1) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    setIsTyping(false);
    await new Promise((r) => setTimeout(r, 300));
    setDone(true);
  }, []);

  useEffect(() => {
    runSequence();
  }, [runSequence]);

  return { lines, currentTyping, isTyping, done };
}

/* ─── Blinking cursor ────────────────────────────────────────────────────── */

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      className="text-ink"
    >
      ▌
    </motion.span>
  );
}

/* ─── Social icon components ─────────────────────────────────────────────── */

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
};

/* ─── ASCII art name ─────────────────────────────────────────────────────── */

const ASCII_NAME = `███████╗██╗  ██╗██╗██╗   ██╗ █████╗ ███╗   ███╗
██╔════╝██║  ██║██║██║   ██║██╔══██╗████╗ ████║
███████╗███████║██║██║   ██║███████║██╔████╔██║
╚════██║██╔══██║██║╚██╗ ██╔╝██╔══██║██║╚██╔╝██║
███████║██║  ██║██║ ╚████╔╝ ██║  ██║██║ ╚═╝ ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝     ╚═╝`;

const ASCII_LINES = ASCII_NAME.split('\n');

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function TerminalHero() {
  const { lines, currentTyping, isTyping, done } = useTypingEngine();

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:py-24">
      {/* Terminal window */}
      <div className="w-full max-w-2xl rounded-lg border border-hairline bg-surface-soft overflow-hidden shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-canvas">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-mute font-mono select-none">
            shivam@portfolio ~
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed min-h-[180px]">
          {/* Committed lines */}
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line.type === 'command' ? (
                <span>
                  <span className="text-[#4ade80]">$ </span>
                  <span className="text-ink">{line.text}</span>
                </span>
              ) : (
                <span className="text-mute">{line.text}</span>
              )}
            </div>
          ))}

          {/* Currently typing line */}
          {isTyping && (
            <div className="whitespace-pre-wrap">
              <span className="text-[#4ade80]">$ </span>
              <span className="text-ink">{currentTyping}</span>
              <Cursor />
            </div>
          )}

          {/* Final idle prompt */}
          {!isTyping && (
            <div className="whitespace-pre-wrap">
              <span className="text-[#4ade80]">$ </span>
              <Cursor />
            </div>
          )}
        </div>
      </div>

      {/* Hero content — fades in after terminal finishes */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-12 sm:mt-16 flex flex-col items-center gap-6 sm:gap-8 w-full"
          >
            {/* ASCII art name via SVG for responsiveness */}
            <div className="w-full max-w-2xl px-2">
              <svg
                viewBox="0 0 600 120"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-auto"
                role="img"
                aria-label="SHIVAM"
              >
                {ASCII_LINES.map((line, i) => (
                  <text
                    key={i}
                    x="300"
                    y={18 + i * 18}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#e5e5e5"
                    fontFamily="monospace"
                    fontSize="12"
                    letterSpacing="0"
                  >
                    {line}
                  </text>
                ))}
              </svg>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-mute tracking-wide text-center font-mono">
              {PERSONAL.title} · {PERSONAL.subtitle}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map((link) => {
                const Icon = ICON_MAP[link.icon];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mute hover:text-ink transition-colors duration-200"
                    aria-label={link.label}
                  >
                    {Icon && <Icon />}
                  </a>
                );
              })}
            </div>

            {/* Quick links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm font-mono">
              <a
                href="#experience"
                className="text-mute hover:text-ink transition-colors"
              >
                Experience
              </a>
              <span className="text-hairline">·</span>
              <a
                href="#projects"
                className="text-mute hover:text-ink transition-colors"
              >
                Projects
              </a>
              <span className="text-hairline">·</span>
              <a
                href="/resume.pdf"
                download
                className="text-mute hover:text-ink transition-colors"
              >
                Resume ↓
              </a>
            </nav>
            
            <ServerCluster />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
