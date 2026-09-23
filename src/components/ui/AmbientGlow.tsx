'use client';

import { useApp } from '@/context/AppProvider';

export default function AmbientGlow() {
  const { viewMode } = useApp();

  if (viewMode === 'api') return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-2]">
      <div 
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] mix-blend-screen opacity-[0.15] animate-pulse"
        style={{ backgroundColor: 'var(--color-accent)', animationDuration: '8s' }}
      />
      <div 
        className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-600 blur-[120px] mix-blend-screen opacity-[0.12] animate-pulse"
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />
    </div>
  );
}
