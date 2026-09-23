'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PERSONAL, SOCIAL_LINKS } from '@/lib/data';

/* ─── Social icon components ─────────────────────────────────────────────── */

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  email: EmailIcon,
};

const INITIAL_HISTORY = [
  { cmd: 'whoami', output: 'shivam_pratap_raj' },
  { cmd: 'cat role.txt', output: 'Software Engineer @ LEAP Finance' },
  { cmd: 'ls skills/', output: 'kotlin  java  spring-boot  postgresql  elasticsearch  docker' },
];

export default function TerminalHero() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = '';

      if (cmd === 'projects') {
        output = 'Initializing warp drive... scrolling to Projects.';
        setTimeout(() => scrollTo('projects'), 500);
      } else if (cmd === 'experience') {
        output = 'Accessing mainframe... scrolling to Experience.';
        setTimeout(() => scrollTo('experience'), 500);
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'help') {
        output = 'Available commands: projects, experience, clear, help';
      } else if (cmd !== '') {
        output = `Command not found: ${cmd}. Try "projects" or "experience".`;
      }

      if (cmd !== '') {
        setHistory((prev) => [...prev, { cmd, output }]);
      }
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <section className="relative w-full flex flex-col items-center pt-2 sm:pt-6 pb-16">
      
      {/* 1. Identity Block */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full text-center flex flex-col items-center mb-16 px-2"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink font-sans uppercase whitespace-nowrap">
          {"< S H I V A M />"}
        </h1>
        
        <div className="text-sm sm:text-base text-mute tracking-wide font-mono mt-4 flex flex-col items-center">
          <div className="text-center">
            <span className="text-ink font-medium">{PERSONAL.title}</span>
            <br />
            <span className="opacity-80 text-xs sm:text-sm mt-1 inline-block">{PERSONAL.subtitle}</span>
          </div>

          <div className="mt-6 text-xs sm:text-sm text-center max-w-xl mx-auto leading-relaxed py-1">
            <div className="text-[var(--color-accent)] opacity-60 mb-2">{"<p>"}</div>
            <span className="block text-ink">build things for the backend, break them, then make them better.</span>
            <span className="block text-ink mt-1">I like solving tricky problems, simplifying messy systems, and figuring out why things are slow.</span>
            <div className="text-[var(--color-accent)] opacity-60 mt-2">{"</p>"}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mute hover:text-ink transition-all duration-200 hover:scale-110"
                aria-label={link.label}
                title={link.label}
              >
                {Icon && <Icon />}
              </a>
            );
          })}
        </div>
      </motion.div>

      {/* 2. Interactive Terminal Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-3xl flex flex-col gap-8 items-center px-4 sm:px-0"
      >
        
        {/* Interactive Terminal */}
        <div 
          className="w-full rounded-xl border border-hairline bg-surface-soft/40 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col h-[400px] cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-canvas/50">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-mute font-mono">shivam@portfolio ~</span>
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed flex-1 overflow-y-auto">
            {history.map((item, i) => (
              <div key={i} className="mb-5 whitespace-pre-wrap">
                <div>
                  <span className="text-[var(--color-accent)]">$ </span>
                  <span className="text-ink">{item.cmd}</span>
                </div>
                {item.output && <div className="text-mute mt-1.5">{item.output}</div>}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[var(--color-accent)]">$ </span>
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent border-none outline-none text-ink placeholder:text-mute/30"
                placeholder="Type 'projects' or 'experience'..."
                spellCheck={false}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

      </motion.div>
    </section>
  );
}
