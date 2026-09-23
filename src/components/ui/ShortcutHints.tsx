'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppProvider';
import { useEffect, useState } from 'react';

export default function ShortcutHints() {
  const { isTerminalOpen, isCommandPaletteOpen, viewMode } = useApp();
  const [mounted, setMounted] = useState(false);

  // Delay mounting to avoid SSR mismatch and give the hero terminal time to type
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || isTerminalOpen || isCommandPaletteOpen || viewMode === 'api') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 right-6 hidden lg:flex flex-col gap-3 text-[10px] text-mute font-mono z-40 items-end pointer-events-none"
    >
      <div className="flex items-center gap-2 bg-surface-soft/80 backdrop-blur-md px-3 py-2 border border-hairline rounded-lg shadow-xl shadow-black/50">
        <span>Command Palette</span>
        <div className="flex gap-1">
          <kbd className="bg-canvas border border-hairline px-1.5 py-0.5 rounded text-ink shadow-[0_2px_0_rgba(38,38,38,1)]">Ctrl</kbd>
          <span className="text-hairline">+</span>
          <kbd className="bg-canvas border border-hairline px-1.5 py-0.5 rounded text-ink shadow-[0_2px_0_rgba(38,38,38,1)]">K</kbd>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-surface-soft/80 backdrop-blur-md px-3 py-2 border border-hairline rounded-lg shadow-xl shadow-black/50">
        <span>Interactive Terminal</span>
        <div className="flex gap-1">
          <kbd className="bg-canvas border border-hairline px-1.5 py-0.5 rounded text-ink shadow-[0_2px_0_rgba(38,38,38,1)]">Ctrl</kbd>
          <span className="text-hairline">+</span>
          <kbd className="bg-canvas border border-hairline px-1.5 py-0.5 rounded text-ink shadow-[0_2px_0_rgba(38,38,38,1)]">`</kbd>
        </div>
      </div>
    </motion.div>
  );
}
