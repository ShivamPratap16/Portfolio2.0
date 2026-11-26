'use client';

import { useEffect, useState } from 'react';

/** "⌘" on Apple devices, "Ctrl" everywhere else. Starts as "⌘" so SSR markup matches. */
export function useModKey() {
  const [key, setKey] = useState('⌘');
  useEffect(() => {
    if (!/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)) setKey('Ctrl');
  }, []);
  return key;
}
