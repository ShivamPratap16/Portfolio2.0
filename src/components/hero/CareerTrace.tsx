'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToId } from '@/lib/scroll';

/** Months since Jan 2022 — the trace's clock. */
const m = (y: number, mo: number) => (y - 2022) * 12 + (mo - 1);
const AXIS_START = m(2022, 7);
const AXIS_END = m(2027, 9);
const pct = (v: number) => ((v - AXIS_START) / (AXIS_END - AXIS_START)) * 100;

interface Span {
  id: string;
  service: string;
  op: string;
  start: number;
  end: number | null; // null = still running
  depth: number;
  kind: 'edu' | 'work' | 'project';
  period: string;
  target: string;
  attrs: [string, string][];
}

const SPANS: Span[] = [
  {
    id: 'nit',
    service: 'nit-kurukshetra',
    op: 'b.tech.information-technology',
    start: m(2022, 8),
    end: m(2026, 6),
    depth: 0,
    kind: 'edu',
    period: '2022 – 2026',
    target: 'about',
    attrs: [
      ['cgpa', '7.80'],
      ['role', 'Tech Head · Antariksh'],
      ['award', 'SIH internal · top 10 / 200'],
      ['workshop', '500+ attendees'],
    ],
  },
  {
    id: 'olcademy',
    service: 'olcademy',
    op: 'backend-intern',
    start: m(2024, 6),
    end: m(2024, 9),
    depth: 1,
    kind: 'work',
    period: 'Jun – Aug 2024',
    target: 'experience',
    attrs: [
      ['shipped', 'admin REST APIs + RBAC'],
      ['perf', 'server-side search & pagination'],
      ['quality', 'centralized validation'],
    ],
  },
  {
    id: 'hireraft',
    service: 'hireraft',
    op: 'placement-portal',
    start: m(2024, 2),
    end: m(2024, 6),
    depth: 1,
    kind: 'project',
    period: '2024',
    target: 'projects',
    attrs: [
      ['users', '1000+ students'],
      ['dashboards', '4 role-based'],
      ['manual_shortlists', '0'],
      ['status', 'live · hireraft.com'],
    ],
  },
  {
    id: 'leap',
    service: 'leap-finance',
    op: 'software-engineer-intern',
    start: m(2026, 1),
    end: m(2026, 7),
    depth: 1,
    kind: 'work',
    period: 'Jan – Jun 2026',
    target: 'experience',
    attrs: [
      ['stack', 'Kotlin · Spring Boot · Postgres'],
      ['search.latency', '−95% → under 1s'],
      ['records', '2M+ via Elasticsearch'],
    ],
  },
  {
    id: 'reckon',
    service: 'reckon',
    op: 'double-entry-ledger',
    start: m(2026, 7),
    end: m(2026, 9),
    depth: 1,
    kind: 'project',
    period: '2026',
    target: 'projects',
    attrs: [
      ['balance_drift', '0'],
      ['writes', '100% idempotent'],
      ['locking', 'FOR NO KEY UPDATE'],
    ],
  },
  {
    id: 'revive',
    service: 'revive',
    op: 'kyc-dropoff-recovery',
    start: m(2026, 9),
    end: m(2026, 11),
    depth: 1,
    kind: 'project',
    period: '2026',
    target: 'projects',
    attrs: [
      ['recovered', '32% of drop-offs'],
      ['tests', '148 on real Postgres + Redis'],
      ['llm', 'Gemini · 6/6 held-out'],
    ],
  },
  {
    id: 'carelon',
    service: 'carelon',
    op: 'associate-software-engineer',
    start: m(2026, 11),
    end: null,
    depth: 0,
    kind: 'work',
    period: 'Nov 2026 – now',
    target: 'experience',
    attrs: [
      ['status', 'RUNNING'],
      ['location', 'Bengaluru'],
      ['org', 'Elevance Health'],
    ],
  },
];

const YEARS = [2023, 2024, 2025, 2026];
const KIND_COLOR: Record<Span['kind'], string> = {
  edu: 'bg-white/25',
  work: 'bg-ink/70',
  project: 'bg-sky-300/60',
};

interface Timing {
  dns: number;
  connect: number;
  ttfb: number;
  load: number;
}

function useNavTiming(play: boolean) {
  const [t, setT] = useState<Timing | null>(null);
  useEffect(() => {
    if (!play) return;
    const read = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (!nav) return;
      const r = (n: number) => Math.max(0, Math.round(n));
      setT({
        dns: r(nav.domainLookupEnd - nav.domainLookupStart),
        connect: r(nav.connectEnd - nav.connectStart),
        ttfb: r(nav.responseStart - nav.requestStart),
        load: r((nav.loadEventEnd || nav.domContentLoadedEventEnd) - nav.startTime),
      });
    };
    read();
    const id = setTimeout(read, 1500);
    return () => clearTimeout(id);
  }, [play]);
  return t;
}

/** The career, rendered as a distributed trace. */
export default function CareerTrace({ play, compact = false }: { play: boolean; compact?: boolean }) {
  const [active, setActive] = useState('carelon');
  const timing = useNavTiming(play);
  const span = SPANS.find((s) => s.id === active)!;
  const nowPct = pct(m(2026, 11) + 0.9);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-surface/70 font-mono text-[10px] text-body shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur sm:text-[11px]">
      {/* Header: the visitor's own request, timed for real */}
      <div className="border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-mute">
          <span className="truncate">
            <span className="text-accent">trace</span> · GET /shivam-pratap-raj · <span className="text-ash">hover a span</span>
          </span>
          <span className="shrink-0 text-emerald-400">200 OK</span>
        </div>
        <div className="mt-1.5 truncate text-mute">
          {timing ? (
            <>
              your request
              {timing.dns > 0 && (
                <>
                  {' '}· dns <span className="text-ink">{timing.dns}ms</span>
                </>
              )}
              {timing.connect > 0 && (
                <>
                  {' '}· tls <span className="text-ink">{timing.connect}ms</span>
                </>
              )}
              {' '}· ttfb <span className="text-ink">{timing.ttfb}ms</span>
              {timing.load > 0 && (
                <>
                  {' '}
                  · rendered <span className="text-ink">{timing.load}ms</span>
                </>
              )}
            </>
          ) : (
            'your request · timing…'
          )}
        </div>
      </div>

      {/* Waterfall */}
      <div className="relative flex-1 px-4 pb-2 pt-3">
        <div className="relative ml-[34%] h-4 text-ash">
          {YEARS.map((y) => (
            <span key={y} className="absolute -translate-x-1/2" style={{ left: `${pct(m(y, 1))}%` }}>
              {String(y).slice(2)}
            </span>
          ))}
        </div>

        <div className="relative">
          {/* year gridlines + "now" marker live in the bar column */}
          <div className="pointer-events-none absolute inset-y-0 left-[34%] right-0">
            {YEARS.map((y) => (
              <span key={y} className="absolute inset-y-0 w-px bg-white/[0.05]" style={{ left: `${pct(m(y, 1))}%` }} />
            ))}
            <span className="absolute inset-y-0 w-px bg-accent/50" style={{ left: `${nowPct}%` }}>
              <span className="absolute -top-4 -translate-x-1/2 text-accent">now</span>
            </span>
          </div>

          {SPANS.map((s, i) => {
            const left = pct(s.start);
            const width = (s.end === null ? 100 : pct(s.end)) - left;
            const on = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onClick={() => (compact && !on ? setActive(s.id) : scrollToId(s.target))}
                className={`group relative flex w-full items-center rounded-md py-[5px] text-left transition-colors ${
                  on ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                } ${compact ? 'py-1' : ''}`}
                aria-label={`${s.service} ${s.op}, ${s.period}`}
              >
                <span
                  className="w-[34%] truncate pr-2"
                  style={{ paddingLeft: s.depth * 12 }}
                >
                  {s.depth > 0 && <span className="text-ash">└ </span>}
                  <span className={on ? 'text-ink' : 'text-body'}>{s.service}</span>
                </span>
                <span className="relative block h-4 flex-1">
                  <motion.span
                    className={`absolute inset-y-0 rounded-[3px] ${
                      s.end === null ? 'bg-accent' : on ? 'bg-accent/80' : KIND_COLOR[s.kind]
                    }`}
                    style={{ left: `${left}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: play ? `${s.end === null ? nowPct - left : width}%` : 0 }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {s.end === null && (
                    <motion.span
                      className="trace-running absolute inset-y-0 rounded-r-[3px]"
                      style={{ left: `${nowPct}%`, width: `${100 - nowPct}%` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: play ? 1 : 0 }}
                      transition={{ delay: 0.5 + i * 0.12 + 0.8 }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Span details */}
      <div className="border-t border-white/[0.07] px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={span.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">
                <span className="text-ink">{span.service}</span>
                <span className="text-ash"> / {span.op}</span>
              </span>
              <span className={`shrink-0 ${span.end === null ? 'text-accent' : 'text-mute'}`}>
                {span.end === null && <span className="pulse-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent text-accent align-middle" />}
                {span.period}
              </span>
            </div>
            <div className={`mt-2 grid gap-x-4 gap-y-1 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {span.attrs.map(([k, v]) => (
                <div key={k} className="flex min-w-0 gap-2">
                  <span className="shrink-0 text-mute">{k}</span>
                  <span className="truncate text-ink">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
