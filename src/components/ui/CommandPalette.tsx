'use client';

import { useEffect } from 'react';
import { Command } from 'cmdk';
import { useApp, ACCENT_MAP, type AccentColor } from '@/context/AppProvider';
import { ArrowRight, Download, Code, Mail, Copy, TerminalSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_SECTIONS, PERSONAL, SOCIAL_LINKS } from '@/lib/data';
import { scrollToId } from '@/lib/scroll';

const itemClass =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-body aria-selected:bg-white/[0.06] aria-selected:text-ink transition-colors';
const groupHeading = (label: string) => (
  <span className="block px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</span>
);

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setViewMode, accentColor, setAccentColor, setIsTerminalOpen } =
    useApp();

  // Close on Escape is handled by cmdk, but we need to sync state
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsCommandPaletteOpen]);

  const runCommand = (command: () => void) => {
    setIsCommandPaletteOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-md"
            onClick={() => setIsCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, scale: 0.97, filter: 'blur(6px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[14%] z-[100] w-[92vw] max-w-xl -translate-x-1/2"
          >
            <Command
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0b]/95 text-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              loop
            >
              <div className="flex items-center border-b border-white/[0.06] px-4">
                <span className="font-mono text-accent">›</span>
                <Command.Input
                  autoFocus
                  placeholder="Jump to a section, run an action…"
                  className="w-full bg-transparent p-4 text-ink outline-none placeholder:text-mute"
                />
                <button
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="p-1 text-mute hover:text-ink"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <Command.List data-lenis-prevent className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
                <Command.Empty className="p-6 text-center text-xs text-mute">No results found.</Command.Empty>

                <Command.Group heading={groupHeading('Navigate')}>
                  {NAV_SECTIONS.map((s) => (
                    <Command.Item key={s.id} onSelect={() => runCommand(() => scrollToId(s.id))} className={itemClass}>
                      <ArrowRight size={14} /> Go to {s.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={groupHeading('Actions')}>
                  <Command.Item
                    onSelect={() => runCommand(() => navigator.clipboard?.writeText(PERSONAL.email))}
                    className={itemClass}
                  >
                    <Copy size={14} /> Copy email address
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => (window.location.href = `mailto:${PERSONAL.email}`))}
                    className={itemClass}
                  >
                    <Mail size={14} /> Send an email
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => {
                        const a = document.createElement('a');
                        a.href = '/Shivam_resume.pdf';
                        a.download = 'Shivam_resume.pdf';
                        a.click();
                      })
                    }
                    className={itemClass}
                  >
                    <Download size={14} /> Download résumé
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => setIsTerminalOpen(true))} className={itemClass}>
                    <TerminalSquare size={14} /> Open interactive terminal
                    <kbd className="ml-auto font-mono text-[10px] text-mute">⌘ `</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => {
                        setViewMode('api');
                        window.scrollTo(0, 0);
                      })
                    }
                    className={itemClass}
                  >
                    <Code size={14} /> View portfolio as JSON API
                  </Command.Item>
                </Command.Group>

                <Command.Group heading={groupHeading('Elsewhere')}>
                  {SOCIAL_LINKS.filter((l) => !l.href.startsWith('mailto')).map((l) => (
                    <Command.Item
                      key={l.label}
                      onSelect={() => runCommand(() => window.open(l.href, '_blank', 'noopener'))}
                      className={itemClass}
                    >
                      <ArrowRight size={14} className="-rotate-45" /> {l.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={groupHeading('Accent colour')}>
                  {(Object.keys(ACCENT_MAP) as AccentColor[]).map((c) => (
                    <Command.Item
                      key={c}
                      value={`theme accent ${c}`}
                      onSelect={() => runCommand(() => setAccentColor(c))}
                      className={itemClass}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ background: ACCENT_MAP[c] }} />
                      <span className="capitalize">{c}</span>
                      {accentColor === c && <span className="ml-auto font-mono text-[10px] text-accent">active</span>}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
                <span>↑↓ navigate · ↵ select</span>
                <span>esc to close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
