'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PERSONAL } from '@/lib/data';
import { useModKey } from '@/lib/useModKey';

type Phase = 'idle' | 'sending' | 'sent' | 'invalid';

/** Contact form disguised as an HTTP request. Sends through the visitor's own mail app. */
export default function RequestComposer() {
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [ms, setMs] = useState(0);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const mod = useModKey();

  const send = () => {
    if (!message.trim()) {
      setPhase('invalid');
      msgRef.current?.focus();
      return;
    }
    const subject = `Hello from ${from.trim() || 'your portfolio'}`;
    const body = `${message.trim()}\n\n— ${from.trim() || 'sent from spr-three.vercel.app'}`;
    window.location.href = `mailto:${PERSONAL.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setPhase('sending');
    const t0 = performance.now();
    setTimeout(() => {
      setMs(Math.round(performance.now() - t0));
      setPhase('sent');
    }, 650);
  };

  const field =
    'min-w-0 bg-transparent text-accent placeholder:text-ash outline-none caret-accent border-b border-dashed border-white/15 focus:border-accent transition-colors';

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/80 font-mono text-[12px] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:text-[13px]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 text-mute">
        <span>
          <span className="text-emerald-400">POST</span> <span className="text-ink">/v1/shivam/messages</span>
        </span>
        <span className="hidden sm:inline">HTTP/2</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') send();
        }}
        className="space-y-1 px-4 py-4 leading-relaxed"
      >
        <div className="text-mute">
          host: <span className="text-body">spr-three.vercel.app</span>
        </div>
        <div className="text-mute">
          content-type: <span className="text-body">application/json</span>
        </div>
        <div className="pt-2 text-body">{'{'}</div>
        <label className="flex items-baseline gap-2 pl-4">
          <span className="shrink-0 text-sky-300">&quot;from&quot;</span>
          <span className="text-mute">:</span>
          <span className="text-accent">&quot;</span>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="your name / company"
            className={`${field} flex-1`}
            maxLength={80}
          />
          <span className="text-accent">&quot;,</span>
        </label>
        <label className="flex items-start gap-2 pl-4">
          <span className="shrink-0 text-sky-300">&quot;message&quot;</span>
          <span className="text-mute">:</span>
          <span className="text-accent">&quot;</span>
          <textarea
            ref={msgRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (phase === 'invalid') setPhase('idle');
            }}
            placeholder="a hard problem involving APIs, data or correctness under load…"
            rows={3}
            className={`${field} flex-1 resize-none`}
            maxLength={2000}
          />
          <span className="text-accent">&quot;</span>
        </label>
        <div className="text-body">{'}'}</div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="text-[11px] text-ash">{mod} + Enter</span>
          <button
            type="submit"
            data-cursor="Send"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-canvas transition-colors hover:bg-ink"
          >
            Send request <span className="transition-transform group-hover:translate-x-0.5">⏎</span>
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {phase !== 'idle' && (
          <motion.div
            key={phase}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/[0.07] bg-black/30"
          >
            <div className="px-4 py-4 leading-relaxed">
              {phase === 'sending' && <div className="text-mute">awaiting response<span className="animate-blink">_</span></div>}
              {phase === 'invalid' && (
                <>
                  <div className="text-rose-400">HTTP/2 422 Unprocessable Entity</div>
                  <div className="text-mute">{'{ "error": "message must not be empty" }'}</div>
                </>
              )}
              {phase === 'sent' && (
                <>
                  <div>
                    <span className="text-emerald-400">HTTP/2 202 Accepted</span>{' '}
                    <span className="text-ash">· {ms}ms</span>
                  </div>
                  <div className="text-mute">x-queue: human-inbox</div>
                  <div className="mt-1 text-body">
                    {'{ "status": "queued", "eta": "< 24h", "next": "hit send in your mail app" }'}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
