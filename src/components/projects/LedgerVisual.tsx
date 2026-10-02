'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const ACCOUNTS = ['alice', 'bob', 'carol', 'store'] as const;
type Account = (typeof ACCOUNTS)[number];

interface Entry {
  id: number;
  txn: string;
  account: Account;
  amount: number; // negative = debit
  replay?: boolean;
}

const START: Record<Account, number> = { alice: 1200, bob: 800, carol: 650, store: 350 };
const TOTAL = Object.values(START).reduce((a, b) => a + b, 0);
const ROWS = 8;

// A few settled transfers so the journal never starts empty (net zero per txn)
const SEED: Entry[] = [
  { id: -1, txn: 'tx_19f2', account: 'carol', amount: 120 },
  { id: -2, txn: 'tx_19f2', account: 'bob', amount: -120 },
  { id: -3, txn: 'tx_18a7', account: 'store', amount: 64 },
  { id: -4, txn: 'tx_18a7', account: 'alice', amount: -64 },
  { id: -5, txn: 'tx_1771', account: 'alice', amount: 210 },
  { id: -6, txn: 'tx_1771', account: 'carol', amount: -210 },
];

/** A live, self-balancing double-entry ledger with idempotent retries. */
export default function LedgerVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const [balances, setBalances] = useState(START);
  const [entries, setEntries] = useState<Entry[]>(SEED);
  const counter = useRef(0);
  const lastTxn = useRef<string | null>(null);
  const balancesRef = useRef(START);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      const n = ++counter.current;
      // Every few ticks, replay the previous request with the same idempotency key
      if (n % 5 === 0 && lastTxn.current) {
        const txn = lastTxn.current;
        setEntries((prev) => [{ id: n * 10, txn, account: 'alice' as Account, amount: 0, replay: true }, ...prev].slice(0, ROWS));
        return;
      }
      const prev = balancesRef.current;
      const from = ACCOUNTS[Math.floor(Math.random() * 4)];
      let to = ACCOUNTS[Math.floor(Math.random() * 4)];
      if (to === from) to = ACCOUNTS[(ACCOUNTS.indexOf(from) + 1) % 4];
      const amount = Math.min(prev[from], 25 + Math.floor(Math.random() * 180));
      const txn = `tx_${(0x1a3f + n * 97).toString(16)}`;
      lastTxn.current = txn;
      const next = { ...prev, [from]: prev[from] - amount, [to]: prev[to] + amount };
      balancesRef.current = next;
      setBalances(next);
      setEntries((e) =>
        [
          { id: n * 10 + 1, txn, account: to, amount },
          { id: n * 10, txn, account: from, amount: -amount },
          ...e,
        ].slice(0, ROWS),
      );
    }, 1500);
    return () => clearInterval(id);
  }, [inView]);

  const sum = Object.values(balances).reduce((a, b) => a + b, 0);

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 font-mono text-[11px] sm:text-xs">
      {/* Balances */}
      <div className="grid grid-cols-4 gap-2">
        {ACCOUNTS.map((a) => (
          <div key={a} className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
            <div className="text-mute">{a}</div>
            <motion.div
              key={balances[a]}
              initial={{ color: 'var(--color-accent)' }}
              animate={{ color: 'var(--color-ink)' }}
              transition={{ duration: 1 }}
              className="mt-1 text-sm tabular-nums sm:text-base"
            >
              ₹{balances[a]}
            </motion.div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${(balances[a] / TOTAL) * 100 * 2}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Journal */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 border-b border-white/[0.06] px-3 py-2 text-mute">
          <span>txn</span>
          <span>account</span>
          <span className="text-right">amount</span>
        </div>
        <div className="relative">
          <AnimatePresence initial={false}>
            {entries.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -16, backgroundColor: 'rgba(212,255,63,0.12)' }}
                animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 px-3 py-1.5"
              >
                <span className="truncate text-mute">{e.txn}</span>
                {e.replay ? (
                  <span className="col-span-2 text-right text-amber-300">↺ retry · replayed, no double-spend</span>
                ) : (
                  <>
                    <span className="text-body">{e.account}</span>
                    <span className={`text-right tabular-nums ${e.amount < 0 ? 'text-rose-400' : 'text-accent'}`}>
                      {e.amount < 0 ? '−' : '+'}
                      {Math.abs(e.amount)}
                    </span>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2.5">
        <span className="text-body">Σ debits + Σ credits</span>
        <span className="text-accent">
          {sum - TOTAL === 0 ? '0.00 ✓ invariant holds' : 'drift!'}
        </span>
      </div>
    </div>
  );
}
