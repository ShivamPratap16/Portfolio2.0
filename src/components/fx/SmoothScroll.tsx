'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { getLenis, setLenis } from '@/lib/scroll';
import { useApp } from '@/context/AppProvider';

export default function SmoothScroll() {
  const { isLoaded, isTerminalOpen, isCommandPaletteOpen } = useApp();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(lenis);

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Freeze the page while the preloader or a modal is open
  useEffect(() => {
    const locked = !isLoaded || isTerminalOpen || isCommandPaletteOpen;
    const lenis = getLenis();
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }, [isLoaded, isTerminalOpen, isCommandPaletteOpen]);

  return null;
}
