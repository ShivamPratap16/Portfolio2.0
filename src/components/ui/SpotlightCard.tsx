'use client';

import { useRef, useState, MouseEvent } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SpotlightCard({ children, className = '', onClick }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-surface-soft/20 transition-colors duration-500 hover:bg-surface-soft/40 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Outer border glow mask */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.15), transparent 40%)`,
        }}
      />
      
      {/* Inner background blocking the center of the glow to leave only a glowing border and subtle inner glow */}
      <div className="absolute inset-[1px] rounded-[11px] bg-canvas/80 backdrop-blur-xl" />
      
      {/* Subtle inner spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition duration-300 mix-blend-overlay"
        style={{
          opacity: opacity * 0.4,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.4), transparent 40%)`,
        }}
      />

      <div className="relative z-10 p-6 h-full">{children}</div>
    </div>
  );
}
