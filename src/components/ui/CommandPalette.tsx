'use client';

import { useEffect } from 'react';
import { Command } from 'cmdk';
import { useApp } from '@/context/AppProvider';
import { Download, Monitor, Code, Palette, X, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setViewMode, 
    setAccentColor,
    setIsTerminalOpen 
  } = useApp();

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

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={() => setIsCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-lg z-[100]"
          >
            <Command
              className="bg-canvas border border-hairline rounded-xl shadow-2xl overflow-hidden font-mono text-sm"
              loop
            >
              <div className="flex items-center border-b border-hairline px-3">
                <Command.Input 
                  placeholder="Type a command or search..." 
                  className="w-full bg-transparent p-3 outline-none text-ink placeholder:text-mute"
                />
                <button onClick={() => setIsCommandPaletteOpen(false)} className="text-mute hover:text-ink p-1">
                  <X size={16} />
                </button>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="p-4 text-center text-mute text-xs">No results found.</Command.Empty>

                <Command.Group heading={<span className="text-[10px] text-mute uppercase px-2 py-1 block">Navigation</span>}>
                  <Command.Item 
                    onSelect={() => runCommand(() => scrollTo('experience'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft aria-selected:text-[var(--color-accent)] text-body"
                  >
                    <Monitor size={14} /> Go to Experience
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => scrollTo('projects'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft aria-selected:text-[var(--color-accent)] text-body"
                  >
                    <Code size={14} /> Go to Projects
                  </Command.Item>
                </Command.Group>

                <Command.Group heading={<span className="text-[10px] text-mute uppercase px-2 py-1 block mt-2">Actions</span>}>
                  <Command.Item 
                    onSelect={() => runCommand(() => setViewMode('api'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft aria-selected:text-[var(--color-accent)] text-body"
                  >
                    <TerminalSquare size={14} /> Toggle API Mode
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => {
                      const a = document.createElement('a');
                      a.href = '/resume.pdf';
                      a.download = 'resume.pdf';
                      a.click();
                    })}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft aria-selected:text-[var(--color-accent)] text-body"
                  >
                    <Download size={14} /> Download Resume
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setIsTerminalOpen(true))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft aria-selected:text-[var(--color-accent)] text-body"
                  >
                    <TerminalSquare size={14} /> Open Interactive Terminal (Ctrl + `)
                  </Command.Item>
                </Command.Group>

                <Command.Group heading={<span className="text-[10px] text-mute uppercase px-2 py-1 block mt-2">Theme Accent</span>}>
                  <Command.Item 
                    onSelect={() => runCommand(() => setAccentColor('green'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft text-body"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#4ade80]" /> Green (Default)
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setAccentColor('amber'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft text-body"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]" /> Amber
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setAccentColor('cyan'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft text-body"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#22d3ee]" /> Cyan
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setAccentColor('magenta'))}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer aria-selected:bg-surface-soft text-body"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#e879f9]" /> Magenta
                  </Command.Item>
                </Command.Group>

              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
