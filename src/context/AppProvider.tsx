'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ViewMode = 'ui' | 'api';
type AccentColor = 'green' | 'amber' | 'cyan' | 'magenta';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ACCENT_MAP: Record<AccentColor, string> = {
  green: '#4ade80',
  amber: '#fbbf24',
  cyan: '#22d3ee',
  magenta: '#e879f9',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('ui');
  const [accentColor, setAccentColor] = useState<AccentColor>('green');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Apply accent color to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', ACCENT_MAP[accentColor]);
  }, [accentColor]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette (Ctrl+K or Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      
      // Toggle Terminal (Ctrl+` or Cmd+`)
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        accentColor,
        setAccentColor,
        isTerminalOpen,
        setIsTerminalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
