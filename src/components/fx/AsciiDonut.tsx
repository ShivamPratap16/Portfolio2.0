'use client';

import { useEffect, useRef } from 'react';

const RAMP = '.,-~:;=!*#$@';
const NOISE = '01<>/\\{}[]#$%&*+=?';

/**
 * A real-time ASCII torus — a homage to Andy Sloane's donut.c — drawn on a
 * canvas character grid. The pointer steers its rotation, and characters
 * near the cursor "decode" into glyphs in the accent colour. On first play
 * the shape resolves out of random noise.
 */
export default function AsciiDonut({ className, play = true }: { className?: string; play?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef(play);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let fontSize = 12;
    let lum = new Float32Array(0);
    let zbuf = new Float32Array(0);

    let accent = '#ff5b1f';
    const readAccent = () => {
      accent = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || accent;
    };
    readAccent();
    const accentTimer = window.setInterval(readAccent, 400);

    const pointer = { x: -1, y: -1, inside: false };
    let A = 0.6;
    let B = 0.2;
    let spinA = 0;
    let spinB = 0;
    let resolveStart = -1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = width < 640 ? 9 : width < 1200 ? 11 : 12;
      ctx.font = `${fontSize}px ui-monospace, "Geist Mono", monospace`;
      cellW = ctx.measureText('M').width;
      cellH = fontSize * 1.15;
      cols = Math.max(1, Math.floor(width / cellW));
      rows = Math.max(1, Math.floor(height / cellH));
      lum = new Float32Array(cols * rows);
      zbuf = new Float32Array(cols * rows);
    };

    const render = (now: number) => {
      if (resolveStart < 0 && playRef.current) resolveStart = now;
      // 0 → pure noise, 1 → fully resolved
      const resolved = resolveStart < 0 ? 0 : Math.min(1, (now - resolveStart) / 1600);

      zbuf.fill(0);

      const cosA = Math.cos(A), sinA = Math.sin(A);
      const cosB = Math.cos(B), sinB = Math.sin(B);
      const R1 = 1, R2 = 2, K2 = 5;
      // Project so the torus's outer radius spans ~44% of the shorter side, in pixels
      const target = Math.min(width, height) * 0.36;
      const K1x = (target / cellW) * (K2 / (R1 + R2));
      const K1y = (target / cellH) * (K2 / (R1 + R2));
      const cx = cols / 2;
      const cy = rows / 2;

      for (let theta = 0; theta < Math.PI * 2; theta += 0.045) {
        const ct = Math.cos(theta), st = Math.sin(theta);
        for (let phi = 0; phi < Math.PI * 2; phi += 0.015) {
          const cp = Math.cos(phi), sp = Math.sin(phi);
          const circleX = R2 + R1 * ct;
          const circleY = R1 * st;
          const x = circleX * (cosB * cp + sinA * sinB * sp) - circleY * cosA * sinB;
          const y = circleX * (sinB * cp - sinA * cosB * sp) + circleY * cosA * cosB;
          const z = K2 + cosA * circleX * sp + circleY * sinA;
          const ooz = 1 / z;
          const xp = Math.floor(cx + K1x * ooz * x);
          const yp = Math.floor(cy - K1y * ooz * y);
          if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;
          const L = cp * ct * sinB - cosA * ct * sp - sinA * st + cosB * (cosA * st - ct * sinA * sp);
          const idx = xp + yp * cols;
          if (ooz > zbuf[idx]) {
            zbuf[idx] = ooz;
            lum[idx] = L;
          }
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = 'top';
      const radius = width < 640 ? 70 : 120;

      // Draw in brightness buckets to minimise fillStyle changes
      const buckets: [number, number, string][][] = [[], [], [], [], []];
      const hot: [number, number, string][] = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          if (zbuf[i + j * cols] === 0) continue;
          const L = lum[i + j * cols];
          const n = Math.max(0, Math.min(RAMP.length - 1, Math.floor(((L + 1) / 2.4) * RAMP.length)));
          let ch = RAMP[n];
          const px = i * cellW;
          const py = j * cellH;
          if (resolved < 1 && Math.random() > resolved) ch = NOISE[(Math.random() * NOISE.length) | 0];
          if (pointer.inside) {
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < radius) {
              if (Math.random() < 1 - d / radius) {
                hot.push([px, py, NOISE[(Math.random() * NOISE.length) | 0]]);
                continue;
              }
            }
          }
          const b = Math.min(4, Math.floor((n / RAMP.length) * 5));
          buckets[b].push([px, py, ch]);
        }
      }
      const shades = [0.07, 0.13, 0.22, 0.34, 0.5];
      buckets.forEach((list, b) => {
        ctx.fillStyle = `rgba(242, 240, 234, ${shades[b] * (0.4 + 0.6 * resolved)})`;
        for (const [x, y, ch] of list) ctx.fillText(ch, x, y);
      });
      ctx.fillStyle = accent;
      for (const [x, y, ch] of hot) ctx.fillText(ch, x, y);
    };

    let raf = 0;
    let last = 0;
    let running = true;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      // ~40fps is plenty for ASCII and saves battery
      if (now - last > 24) {
        last = now;
        const targetA = pointer.inside ? ((pointer.y / height) - 0.5) * 1.2 : 0;
        const targetB = pointer.inside ? ((pointer.x / width) - 0.5) * 1.2 : 0;
        spinA += (targetA - spinA) * 0.05;
        spinB += (targetB - spinB) * 0.05;
        if (!reduced) {
          A += dt * 0.9;
          B += dt * 0.45;
        }
        const a0 = A, b0 = B;
        A += spinA;
        B += spinB;
        render(now);
        A = a0;
        B = b0;
      }
      if (running) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });

    resize();
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener('pointermove', onMove);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearInterval(accentTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
