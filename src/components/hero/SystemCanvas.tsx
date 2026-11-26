'use client';

import { useEffect, useRef } from 'react';

/* ─── Topology: the systems I've actually built ─────────────────────────── */

interface GNode {
  id: string;
  label: string;
  short: string;
  desc: string;
  x: number; // 0..1 inside the slot
  y: number;
}

const NODES: GNode[] = [
  { id: 'edge', label: 'edge', short: 'edge', desc: 'tls termination', x: 0, y: 0.5 },
  { id: 'gateway', label: 'gateway', short: 'gw', desc: 'routing · rate limits', x: 0.17, y: 0.5 },
  { id: 'auth', label: 'auth', short: 'auth', desc: 'jwt · role-based access', x: 0.17, y: 0.1 },
  { id: 'ledger', label: 'reckon/ledger', short: 'ledger', desc: 'double-entry · zero drift', x: 0.43, y: 0.02 },
  { id: 'search', label: 'leap/search', short: 'search', desc: '2M+ records · under 1s', x: 0.43, y: 0.34 },
  { id: 'placement', label: 'hireraft/api', short: 'hireraft', desc: '1000+ students · live', x: 0.43, y: 0.66 },
  { id: 'kyc', label: 'revive/ingest', short: 'revive', desc: 'idempotent event ingest', x: 0.43, y: 0.98 },
  { id: 'postgres', label: 'postgres', short: 'pg', desc: 'source of truth · row locks', x: 0.71, y: 0.02 },
  { id: 'elastic', label: 'elasticsearch', short: 'es', desc: 'multi-filter search', x: 0.71, y: 0.34 },
  { id: 'mongo', label: 'mongodb', short: 'mongo', desc: 'placement data', x: 0.71, y: 0.66 },
  { id: 'redis', label: 'redis/queue', short: 'redis', desc: 'jobs · shared rate limit', x: 0.71, y: 0.98 },
  { id: 'gemini', label: 'gemini', short: 'llm', desc: 'reads redacted transcripts', x: 0.97, y: 0.74 },
  { id: 'voice', label: 'voice-agent', short: 'voice', desc: 'HMAC-signed webhooks', x: 0.97, y: 0.98 },
];

interface Route {
  path: string[];
  weight: number;
  async?: boolean;
}

const ROUTES: Route[] = [
  { path: ['edge', 'gateway', 'ledger', 'postgres'], weight: 3 },
  { path: ['edge', 'gateway', 'search', 'elastic'], weight: 3 },
  { path: ['edge', 'gateway', 'placement', 'mongo'], weight: 2 },
  { path: ['edge', 'gateway', 'auth'], weight: 1.5 },
  { path: ['edge', 'gateway', 'kyc', 'redis', 'gemini'], weight: 1.2, async: true },
  { path: ['edge', 'gateway', 'kyc', 'redis', 'voice'], weight: 1, async: true },
];
const TOTAL_WEIGHT = ROUTES.reduce((a, r) => a + r.weight, 0);

const LINKS: [string, string][] = [];
for (const r of ROUTES)
  for (let i = 0; i < r.path.length - 1; i++) {
    const k: [string, string] = [r.path[i], r.path[i + 1]];
    if (!LINKS.some(([a, b]) => a === k[0] && b === k[1])) LINKS.push(k);
  }

const ARRIVAL_NOTES: Record<string, string[]> = {
  postgres: ['COMMIT', 'Σ = 0 ✓', 'row lock ✓'],
  elastic: ['hits in 0.4s', '2.1M scanned', 'p99 < 1s'],
  mongo: ['eligible ✓', 'shortlisted'],
  gemini: ['callback 18:00', 'reason: OTP', 'DND ✓'],
  voice: ['☎ ringing', '☎ answered'],
  auth: ['jwt ✓'],
};

/* ─── Geometry helpers ──────────────────────────────────────────────────── */

interface Pt {
  x: number;
  y: number;
}

function elbow(a: Pt, b: Pt): Pt[] {
  if (Math.abs(a.x - b.x) < 1 || Math.abs(a.y - b.y) < 1) return [a, b];
  const mx = a.x + (b.x - a.x) * 0.5;
  return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
}

interface Path {
  pts: Pt[];
  cum: number[];
  len: number;
  marks: { d: number; id: string }[];
}

function buildPath(pts: Pt[], marks: { d: number; id: string }[] = []): Path {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, len: cum[cum.length - 1], marks };
}

function pointAt(p: Path, d: number): Pt {
  if (d <= 0) return p.pts[0];
  if (d >= p.len) return p.pts[p.pts.length - 1];
  let i = 1;
  while (i < p.cum.length && p.cum[i] < d) i++;
  const a = p.pts[i - 1];
  const b = p.pts[i];
  const seg = p.cum[i] - p.cum[i - 1] || 1;
  const t = (d - p.cum[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function reversePath(p: Path): Path {
  const pts = [...p.pts].reverse();
  const marks = p.marks.map((m) => ({ d: p.len - m.d, id: m.id })).reverse();
  return buildPath(pts, marks);
}

/* ─── Simulation types ──────────────────────────────────────────────────── */

interface Packet {
  path: Path;
  d: number;
  speed: number; // px per ms
  mine: boolean;
  phase: 'req' | 'res';
  route: Route;
  born: number;
}

interface Note {
  x: number;
  y: number;
  text: string;
  born: number;
  mine: boolean;
}

export interface SystemStats {
  rps: number;
  p50: number;
  p99: number;
  mine: number;
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function SystemCanvas({
  hostRef,
  slotRefs,
  play,
  onStats,
}: {
  hostRef: React.RefObject<HTMLElement | null>;
  slotRefs: React.RefObject<HTMLDivElement | null>[];
  play: boolean;
  onStats: (s: SystemStats) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef(play);
  const statsRef = useRef(onStats);

  useEffect(() => {
    playRef.current = play;
  }, [play]);
  useEffect(() => {
    statsRef.current = onStats;
  }, [onStats]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono').trim() ||
      'ui-monospace, monospace';

    let W = 0;
    let H = 0;
    let slot = { x: 0, y: 0, w: 1, h: 1 };
    let small = false;
    const pos: Record<string, Pt> = {};
    const linkPaths = new Map<string, Path>();

    const layout = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const hr = host.getBoundingClientRect();
      W = hr.width;
      H = hr.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const el = slotRefs.map((r) => r.current).find((s) => s && s.offsetParent !== null && s.offsetWidth > 0);
      if (el) {
        const r = el.getBoundingClientRect();
        slot = { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height };
      }
      small = slot.w < 560;
      // keep labels inside the slot: reserve room on the right for the last column's labels
      const usableW = slot.w - (small ? 44 : 96);
      for (const n of NODES) pos[n.id] = { x: slot.x + n.x * usableW, y: slot.y + n.y * slot.h };
      linkPaths.clear();
      for (const [a, b] of LINKS) {
        linkPaths.set(`${a}>${b}`, buildPath(elbow(pos[a], pos[b])));
      }
    };

    const routePath = (route: Route, from?: Pt): Path => {
      const pts: Pt[] = [];
      const marks: { d: number; id: string }[] = [];
      let acc = 0;
      if (from) {
        pts.push(from);
        acc = Math.hypot(pos.edge.x - from.x, pos.edge.y - from.y);
      }
      pts.push(pos[route.path[0]]);
      marks.push({ d: acc, id: route.path[0] });
      for (let i = 0; i < route.path.length - 1; i++) {
        const lp = linkPaths.get(`${route.path[i]}>${route.path[i + 1]}`)!;
        for (let j = 1; j < lp.pts.length; j++) pts.push(lp.pts[j]);
        acc += lp.len;
        marks.push({ d: acc, id: route.path[i + 1] });
      }
      return buildPath(pts, marks);
    };

    const pickRoute = () => {
      let r = Math.random() * TOTAL_WEIGHT;
      for (const route of ROUTES) {
        r -= route.weight;
        if (r <= 0) return route;
      }
      return ROUTES[0];
    };

    /* state */
    const packets: Packet[] = [];
    const notes: Note[] = [];
    const pulses = new Map<string, number>();
    const latencies: number[] = [];
    const spawns: number[] = [];
    let mineCount = 0;
    let pointer: Pt | null = null;
    let pointerSeen = 0;
    let lastMineSpawn = 0;
    let hovered: string | null = null;

    const spawn = (now: number, mine: boolean, from?: Pt) => {
      const route = pickRoute();
      const speedBase = small ? 0.16 : 0.24;
      packets.push({
        path: routePath(route, from),
        d: 0,
        speed: speedBase * (0.75 + Math.random() * 0.6) * (mine ? 1.25 : 1),
        mine,
        phase: 'req',
        route,
        born: now,
      });
      spawns.push(now);
      if (mine) mineCount++;
    };

    const burst = (at: Pt) => {
      const now = performance.now();
      for (let i = 0; i < 14; i++) setTimeout(() => spawn(performance.now(), true, at), i * 45);
      pulses.set('edge', now);
    };

    /* input */
    const local = (e: PointerEvent): Pt => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      pointer = local(e);
      pointerSeen = performance.now();
      hovered = null;
      if (e.pointerType === 'mouse') {
        let best = 22;
        for (const n of NODES) {
          const p = pos[n.id];
          const dd = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (dd < best) {
            best = dd;
            hovered = n.id;
          }
        }
      }
    };
    const onLeave = () => {
      pointer = null;
      hovered = null;
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a,button,input,textarea')) return;
      const at = local(e);
      pointer = at;
      pointerSeen = performance.now();
      burst(at);
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);

    /* render loop */
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(host);
    const ro = new ResizeObserver(layout);
    ro.observe(host);
    layout();

    let raf = 0;
    let last = performance.now();
    let nextAmbient = 0;
    let lastStats = 0;

    const accent = () =>
      document.documentElement.style.getPropertyValue('--theme-accent').trim() || '#ff5b1f';

    const rgba = (hex: string, a: number) => {
      const h = hex.replace('#', '');
      const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, now - last);
      last = now;
      if (!visible || document.hidden) return;
      const ACC = accent();
      const running = playRef.current;

      /* spawn */
      if (running && !reduced && now > nextAmbient && packets.length < 70) {
        spawn(now, false);
        nextAmbient = now + 140 + Math.random() * 260;
      }
      if (running && pointer && now - pointerSeen < 1200 && now - lastMineSpawn > 420) {
        spawn(now, true, pointer);
        lastMineSpawn = now;
      }

      /* advance */
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const prev = p.d;
        p.d += p.speed * dt;
        for (const m of p.path.marks) {
          if (m.d > prev && m.d <= p.d) pulses.set(m.id, now);
        }
        if (p.d >= p.path.len) {
          const endId = p.phase === 'req' ? p.route.path[p.route.path.length - 1] : null;
          if (endId) {
            const pool = ARRIVAL_NOTES[endId];
            if (pool && (p.mine || Math.random() < 0.18)) {
              const at = pos[endId];
              notes.push({ x: at.x, y: at.y, text: pool[Math.floor(Math.random() * pool.length)], born: now, mine: p.mine });
            }
            if (endId === 'postgres' && Math.random() < 0.15) {
              const at = pos.ledger;
              notes.push({ x: at.x, y: at.y, text: '↺ retry · deduped', born: now, mine: false });
              pulses.set('ledger', now);
            }
          }
          if (p.phase === 'req' && !p.route.async) {
            p.path = reversePath(p.path);
            p.d = 0;
            p.phase = 'res';
          } else {
            if (p.phase === 'res' || p.route.async) {
              const ms = (now - p.born) * 0.02 + Math.random() * 5;
              latencies.push(ms);
              if (latencies.length > 300) latencies.shift();
            }
            packets.splice(i, 1);
          }
        }
      }

      /* draw */
      ctx.clearRect(0, 0, W, H);
      const hl = hovered;

      // links
      ctx.lineWidth = 1;
      for (const [a, b] of LINKS) {
        const lp = linkPaths.get(`${a}>${b}`)!;
        const on = hl && (a === hl || b === hl);
        ctx.strokeStyle = on ? rgba(ACC, 0.55) : 'rgba(242,240,234,0.09)';
        ctx.beginPath();
        ctx.moveTo(lp.pts[0].x, lp.pts[0].y);
        for (let j = 1; j < lp.pts.length; j++) ctx.lineTo(lp.pts[j].x, lp.pts[j].y);
        ctx.stroke();
      }

      // client line
      const clientOn = pointer && now - pointerSeen < 2500;
      if (clientOn && pointer) {
        ctx.save();
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = rgba(ACC, 0.28);
        ctx.beginPath();
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(pos.edge.x, pos.edge.y);
        ctx.stroke();
        ctx.restore();
      }

      // packets
      for (const p of packets) {
        const res = p.phase === 'res';
        const col = p.mine ? ACC : '#f2f0ea';
        const steps = res ? 4 : 7;
        for (let k = steps; k >= 0; k--) {
          const pt = pointAt(p.path, p.d - k * 5);
          const f = 1 - k / (steps + 1);
          ctx.fillStyle = rgba(col, (res ? 0.35 : 0.85) * f * f);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (res ? 1.3 : 2) * (0.5 + f * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
        if (!res) {
          const head = pointAt(p.path, p.d);
          ctx.fillStyle = rgba(col, 0.12);
          ctx.beginPath();
          ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes
      ctx.font = `${small ? 9 : 10}px ${mono}`;
      ctx.textBaseline = 'middle';
      for (const n of NODES) {
        const p = pos[n.id];
        const since = now - (pulses.get(n.id) ?? -1e9);
        const heat = Math.max(0, 1 - since / 700);
        const on = n.id === hl;
        if (heat > 0) {
          ctx.strokeStyle = rgba(ACC, heat * 0.6);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5 + (1 - heat) * 14, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = '#0c0c0b';
        ctx.strokeStyle = on ? ACC : `rgba(242,240,234,${0.35 + heat * 0.5})`;
        ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
        ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
        if (heat > 0.2 || on) {
          ctx.fillStyle = on ? ACC : rgba(ACC, heat);
          ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        }
        ctx.fillStyle = on ? '#f2f0ea' : `rgba(168,166,160,${0.65 + heat * 0.35})`;
        ctx.fillText(small ? n.short : n.label, p.x + 9, p.y + (n.y > 0.9 ? -11 : 11));
      }

      // floating notes
      for (let i = notes.length - 1; i >= 0; i--) {
        const nt = notes[i];
        const age = (now - nt.born) / 1400;
        if (age >= 1) {
          notes.splice(i, 1);
          continue;
        }
        ctx.fillStyle = nt.mine ? rgba(ACC, 1 - age) : `rgba(242,240,234,${0.75 * (1 - age)})`;
        const tw = ctx.measureText(nt.text).width;
        const tx = nt.x + 9 + tw > W - 6 ? nt.x - 9 - tw : nt.x + 9;
        ctx.fillText(nt.text, tx, nt.y - 14 - age * 18);
      }

      // client marker
      if (clientOn && pointer) {
        ctx.strokeStyle = ACC;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = rgba(ACC, 0.9);
        const cw = ctx.measureText('you · client').width;
        ctx.fillText('you · client', pointer.x + 12 + cw > W - 6 ? pointer.x - 12 - cw : pointer.x + 12, pointer.y + 14);
      }

      // tooltip
      if (hl) {
        const n = NODES.find((x) => x.id === hl)!;
        const p = pos[hl];
        const t1 = n.label;
        const t2 = n.desc;
        ctx.font = `11px ${mono}`;
        const w = Math.max(ctx.measureText(t1).width, ctx.measureText(t2).width) + 20;
        const bx = Math.min(p.x + 12, W - w - 8);
        const by = p.y + 16;
        ctx.fillStyle = 'rgba(12,12,11,0.94)';
        ctx.strokeStyle = rgba(ACC, 0.5);
        ctx.beginPath();
        ctx.roundRect(bx, by, w, 42, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f2f0ea';
        ctx.fillText(t1, bx + 10, by + 14);
        ctx.fillStyle = 'rgba(168,166,160,1)';
        ctx.fillText(t2, bx + 10, by + 29);
      }

      /* stats */
      if (now - lastStats > 500) {
        lastStats = now;
        while (spawns.length && now - spawns[0] > 2000) spawns.shift();
        const sorted = [...latencies].sort((a, b) => a - b);
        const q = (f: number) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(f * sorted.length))] : 0);
        statsRef.current({ rps: Math.round(spawns.length / 2), p50: Math.round(q(0.5)), p99: Math.round(q(0.99)), mine: mineCount });
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
    };
  }, [hostRef, slotRefs]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />;
}
