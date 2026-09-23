'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppProvider';
import * as DATA from '@/lib/data';

export default function InteractiveTerminal() {
  const { isTerminalOpen, setIsTerminalOpen, setAccentColor, setViewMode } = useApp();
  const [history, setHistory] = useState<{ command: string; output: React.ReactNode }[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTerminalOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const args = trimmed.split(' ');
    const baseCmd = args[0];

    let output: React.ReactNode = '';

    switch (baseCmd) {
      case 'help':
        output = (
          <div className="text-mute">
            Available commands:
            <br />- <span className="text-[var(--color-accent)]">help</span> : show this message
            <br />- <span className="text-[var(--color-accent)]">clear</span> : clear terminal history
            <br />- <span className="text-[var(--color-accent)]">whoami</span> : prints current user
            <br />- <span className="text-[var(--color-accent)]">cat [file]</span> : view file contents (try: cat projects.txt, cat skills.json)
            <br />- <span className="text-[var(--color-accent)]">theme [color]</span> : change theme (green, cyan, amber, magenta)
            <br />- <span className="text-[var(--color-accent)]">download resume</span> : trigger PDF download
            <br />- <span className="text-[var(--color-accent)]">sudo hire shivam</span> : highly recommended
            <br />- <span className="text-[var(--color-accent)]">api mode</span> : toggle raw API view
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        output = DATA.PERSONAL.name;
        break;
      case 'theme':
        const color = args[1];
        if (['green', 'cyan', 'amber', 'magenta'].includes(color)) {
          setAccentColor(color as any);
          output = `Theme updated to ${color}.`;
        } else {
          output = `Invalid color. Available: green, cyan, amber, magenta.`;
        }
        break;
      case 'api':
        if (args[1] === 'mode') {
          setViewMode('api');
          setIsTerminalOpen(false);
          output = 'Switching to API mode...';
        } else {
          output = 'Command not found. Did you mean "api mode"?';
        }
        break;
      case 'download':
        if (args[1] === 'resume') {
          const a = document.createElement('a');
          a.href = '/Shivam_resume.pdf';
          a.download = 'Shivam_resume.pdf';
          a.click();
          output = 'Downloading Shivam_resume.pdf...';
        } else {
          output = 'File not found.';
        }
        break;
      case 'sudo':
        if (args[1] === 'hire' && args[2] === 'shivam') {
          output = <span className="text-[var(--color-accent)] font-bold animate-pulse">🎉 Excellent decision! Redirecting to email...</span>;
          setTimeout(() => window.location.href = `mailto:${DATA.PERSONAL.email}`, 1500);
        } else {
          output = 'shivam is not in the sudoers file. This incident will be reported.';
        }
        break;
      case 'cat':
        if (args[1] === 'projects.txt') {
          output = DATA.PROJECTS.map(p => `${p.title} (${p.year})`).join('\n');
        } else if (args[1] === 'skills.json') {
          output = JSON.stringify(DATA.SKILLS, null, 2);
        } else {
          output = `cat: ${args[1] || ''}: No such file or directory`;
        }
        break;
      case '':
        output = '';
        break;
      default:
        output = `Command not found: ${baseCmd}. Type "help" for a list of commands.`;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'Escape') {
      setIsTerminalOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isTerminalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={() => setIsTerminalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-2xl bg-canvas border border-hairline rounded-lg shadow-2xl z-[100] font-mono text-xs sm:text-sm overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-hairline bg-surface-soft">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-mute text-xs">interactive_terminal</span>
              <button onClick={() => setIsTerminalOpen(false)} className="text-mute hover:text-ink">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="text-mute mb-4">
                Welcome to Shivam OS v2.0. Type <span className="text-[var(--color-accent)]">help</span> to see available commands.
                <br />Press ESC or <kbd className="border border-hairline rounded px-1">Ctrl + `</kbd> to close.
              </div>

              {history.map((entry, i) => (
                <div key={i} className="mb-3 whitespace-pre-wrap">
                  <div className="flex gap-2">
                    <span className="text-[var(--color-accent)]">~</span>
                    <span className="text-ink">{entry.command}</span>
                  </div>
                  {entry.output && <div className="text-body mt-1 ml-4">{entry.output}</div>}
                </div>
              ))}

              <div className="flex gap-2 items-center">
                <span className="text-[var(--color-accent)]">~</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-ink caret-[var(--color-accent)]"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
