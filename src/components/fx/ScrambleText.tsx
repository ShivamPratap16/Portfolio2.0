'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ';

/**
 * Text that "decodes" itself from random glyphs. Runs once when `trigger`
 * becomes true, and again on every hover of the parent when `onHover` is set.
 */
export default function ScrambleText({
  text,
  trigger = true,
  onHover = false,
  duration = 700,
  className,
}: {
  text: string;
  trigger?: boolean;
  onHover?: boolean;
  duration?: number;
  className?: string;
}) {
  const [output, setOutput] = useState(text);
  const frame = useRef<number>(0);

  const run = () => {
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(progress * text.length);
      let next = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < revealed || ch === ' ') next += ch;
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(next);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger) run();
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text]);

  return (
    <span
      className={className}
      onPointerEnter={onHover ? run : undefined}
      aria-label={text}
    >
      <span aria-hidden>{output}</span>
    </span>
  );
}
