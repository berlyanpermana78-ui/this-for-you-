import React, { useState, useEffect, useCallback } from 'react';

interface TapHeart {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotate: number;
}

const COLORS = ['#f472b6', '#fb7185', '#fda4af', '#f9a8d4', '#e0e7ff', '#ffffff'];

export const ClickHeartCanvas: React.FC = () => {
  const [tapHearts, setTapHearts] = useState<TapHeart[]>([]);

  const handleGlobalPointerDown = useCallback((e: PointerEvent) => {
    // Check if clicked element or its ancestors are interactive buttons, inputs, or interactive seals
    const target = e.target as HTMLElement | null;
    if (target?.closest('button') || target?.closest('input') || target?.closest('a') || target?.closest('.no-click-heart')) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    // Spawn 1 to 2 small romantic hearts at tap location
    const count = Math.random() > 0.4 ? 2 : 1;
    const newItems: TapHeart[] = [];

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 24;
      const offsetY = (Math.random() - 0.5) * 16;
      newItems.push({
        id: Date.now() + Math.random(),
        x: x + offsetX,
        y: y + offsetY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 14 + Math.floor(Math.random() * 8),
        rotate: (Math.random() - 0.5) * 36,
      });
    }

    setTapHearts((prev) => [...prev.slice(-14), ...newItems]);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
    };
  }, [handleGlobalPointerDown]);

  // Cleanup aged hearts
  useEffect(() => {
    if (tapHearts.length === 0) return;
    const timer = setTimeout(() => {
      setTapHearts((prev) => prev.filter((h) => Date.now() - h.id < 1200));
    }, 400);
    return () => clearTimeout(timer);
  }, [tapHearts]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {tapHearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute select-none will-change-transform animate-tap-heart flex items-center justify-center pointer-events-none"
          style={{
            left: heart.x,
            top: heart.y,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            transform: `translate(-50%, -50%) rotate(${heart.rotate}deg)`,
            filter: 'drop-shadow(0 2px 6px rgba(244,114,182,0.45))',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill={heart.color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes tapHeartFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6) translateY(0);
          }
          40% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(1.2) translateY(-22px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.4) translateY(-54px);
          }
        }
        .animate-tap-heart {
          animation: tapHeartFloat 1.1s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
