'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  z: number;
  neighbors: number[];
  heat: number;
}

interface Packet {
  from: number;
  to: number;
  t: number;
  speed: number;
  hops: number;
}

interface Projected {
  sx: number;
  sy: number;
  scale: number;
  depth: number;
}

/**
 * A slowly rotating sphere of "services" wired into a mesh, with glowing
 * packets hopping between them like requests through a distributed system.
 * The pointer tilts the globe and warms nearby nodes; clicking fires a burst
 * of requests from the closest node.
 */
export default function NetworkGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let radius = 0;
    let cx = 0;
    let cy = 0;

    const nodes: Node[] = [];
    const packets: Packet[] = [];
    let projected: Projected[] = [];

    let accent = '#d4ff3f';
    const readAccent = () => {
      accent =
        getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || accent;
    };
    readAccent();
    const accentTimer = window.setInterval(readAccent, 400);

    const pointer = { x: -9999, y: -9999, active: false };
    let tiltX = 0;
    let tiltY = 0;
    let rotation = 0;

    const build = () => {
      nodes.length = 0;
      packets.length = 0;
      const count = width < 640 ? 90 : 170;
      // Fibonacci sphere with a little jitter so it reads as organic
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const j = 1 + (Math.random() - 0.5) * 0.12;
        nodes.push({
          x: Math.cos(theta) * r * j,
          y: y * j,
          z: Math.sin(theta) * r * j,
          neighbors: [],
          heat: 0,
        });
      }
      // Distances are rotation-invariant, so wire the mesh once.
      for (let i = 0; i < nodes.length; i++) {
        const dists: [number, number][] = [];
        for (let k = 0; k < nodes.length; k++) {
          if (k === i) continue;
          const dx = nodes[i].x - nodes[k].x;
          const dy = nodes[i].y - nodes[k].y;
          const dz = nodes[i].z - nodes[k].z;
          dists.push([dx * dx + dy * dy + dz * dz, k]);
        }
        dists.sort((a, b) => a[0] - b[0]);
        for (let n = 0; n < 3; n++) {
          const k = dists[n][1];
          if (!nodes[i].neighbors.includes(k)) nodes[i].neighbors.push(k);
          if (!nodes[k].neighbors.includes(i)) nodes[k].neighbors.push(i);
        }
      }
      for (let p = 0; p < (width < 640 ? 18 : 36); p++) spawn(Math.floor(Math.random() * nodes.length));
    };

    const spawn = (from: number, hops = 6 + Math.floor(Math.random() * 10)) => {
      const node = nodes[from];
      if (!node || node.neighbors.length === 0) return;
      packets.push({
        from,
        to: node.neighbors[Math.floor(Math.random() * node.neighbors.length)],
        t: 0,
        speed: 0.6 + Math.random() * 0.9,
        hops,
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = width < 768;
      radius = mobile ? Math.min(width, height) * 0.42 : Math.min(width * 0.27, height * 0.36);
      cx = mobile ? width / 2 : width * 0.68;
      cy = mobile ? height * 0.38 : height * 0.52;
      const wantCount = width < 640 ? 90 : 170;
      if (nodes.length !== wantCount) build();
    };

    const project = (n: Node): Projected => {
      // rotate around Y (spin + pointer), then X (pointer tilt)
      const ry = rotation + tiltY;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = n.x * cosY - n.z * sinY;
      const z1 = n.x * sinY + n.z * cosY;
      const cosX = Math.cos(tiltX + 0.25);
      const sinX = Math.sin(tiltX + 0.25);
      const y2 = n.y * cosX - z1 * sinX;
      const z2 = n.y * sinX + z1 * cosX;
      const fov = 2.6;
      const scale = fov / (fov + z2);
      return { sx: cx + x1 * radius * scale, sy: cy + y2 * radius * scale, scale, depth: z2 };
    };

    const hexToRgb = (hex: string) => {
      const h = hex.replace('#', '');
      const v = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`;
    };

    let last = performance.now();
    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) rotation += dt * 0.08;

      const targetTiltY = pointer.active ? ((pointer.x - cx) / width) * 0.6 : 0;
      const targetTiltX = pointer.active ? ((pointer.y - cy) / height) * -0.5 : 0;
      tiltY += (targetTiltY - tiltY) * 0.04;
      tiltX += (targetTiltX - tiltX) * 0.04;

      projected = nodes.map(project);
      const rgb = hexToRgb(accent);

      ctx.clearRect(0, 0, width, height);

      // soft halo behind the globe
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.5);
      halo.addColorStop(0, `rgba(${rgb}, 0.07)`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      // edges
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = projected[i];
        for (const k of nodes[i].neighbors) {
          if (k < i) continue;
          const b = projected[k];
          const depth = (a.depth + b.depth) / 2;
          const front = 1 - (depth + 1) / 2; // 1 = nearest
          const heat = Math.max(nodes[i].heat, nodes[k].heat);
          const alpha = 0.04 + front * 0.16 + heat * 0.5;
          ctx.strokeStyle = heat > 0.05 ? `rgba(${rgb}, ${alpha})` : `rgba(242, 240, 234, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = projected[i];
        const n = nodes[i];
        const dx = p.sx - pointer.x;
        const dy = p.sy - pointer.y;
        const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 140);
        n.heat = Math.max(n.heat * 0.94, near);
        const front = 1 - (p.depth + 1) / 2;
        const size = (1 + front * 1.6) * p.scale + n.heat * 2.5;
        ctx.fillStyle =
          n.heat > 0.05 ? `rgba(${rgb}, ${0.5 + n.heat * 0.5})` : `rgba(242, 240, 234, ${0.15 + front * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // packets
      ctx.globalCompositeOperation = 'lighter';
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        if (!reduced) pk.t += dt * pk.speed;
        if (pk.t >= 1) {
          nodes[pk.to].heat = Math.max(nodes[pk.to].heat, 0.35);
          pk.hops -= 1;
          if (pk.hops <= 0) {
            packets.splice(i, 1);
            spawn(Math.floor(Math.random() * nodes.length));
            continue;
          }
          const options = nodes[pk.to].neighbors.filter((k) => k !== pk.from);
          pk.from = pk.to;
          pk.to = options[Math.floor(Math.random() * options.length)] ?? nodes[pk.to].neighbors[0];
          pk.t = 0;
        }
        const a = projected[pk.from];
        const b = projected[pk.to];
        const x = a.sx + (b.sx - a.sx) * pk.t;
        const y = a.sy + (b.sy - a.sy) * pk.t;
        const front = 1 - ((a.depth + b.depth) / 2 + 1) / 2;
        const r = 1.5 + front * 2.5;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
        glow.addColorStop(0, `rgba(${rgb}, ${0.5 + front * 0.5})`);
        glow.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      if (running) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (py < 0 || py > rect.height) return;
      let best = 0;
      let bestD = Infinity;
      projected.forEach((p, i) => {
        const d = (p.sx - px) ** 2 + (p.sy - py) ** 2;
        if (d < bestD && p.depth < 0.2) {
          bestD = d;
          best = i;
        }
      });
      if (bestD > 200 ** 2) return;
      nodes[best].heat = 1;
      for (let i = 0; i < 14; i++) spawn(best, 4 + Math.floor(Math.random() * 6));
    };

    // Pause the render loop while the hero is off-screen
    const io = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });

    resize();
    raf = requestAnimationFrame(frame);
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onClick);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearInterval(accentTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
