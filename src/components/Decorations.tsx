import React, { useMemo } from 'react';

// ==========================================
// 1. FLOATING HEARTS (Configurable count and variety)
// ==========================================
export const FloatingHearts: React.FC<{
  count?: number;
  density?: 'low' | 'medium' | 'high';
}> = ({ count = 16, density = 'medium' }) => {
  const actualCount = density === 'low' ? 10 : density === 'high' ? 24 : count;

  const hearts = useMemo(() => {
    const colors = ['#fda4af', '#f472b6', '#fbcfe8', '#e0e7ff', '#ffffff'];

    return Array.from({ length: actualCount }).map((_, i) => ({
      id: i,
      left: `${(i * 9 + (i % 4) * 17) % 94 + 3}%`,
      size: 11 + (i % 5) * 4,
      delay: (i * 0.7) % 8,
      duration: 8 + (i % 4) * 3,
      opacity: 0.2 + (i % 3) * 0.25,
      color: colors[i % colors.length],
      sway: (i % 2 === 0 ? 1 : -1) * (12 + (i % 3) * 10),
    }));
  }, [actualCount]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute select-none will-change-transform flex items-center justify-center"
          style={{
            left: h.left,
            bottom: '-25px',
            width: `${h.size}px`,
            height: `${h.size}px`,
            opacity: h.opacity,
            animation: `floatUpwardHeart ${h.duration}s infinite linear ${h.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill={h.color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes floatUpwardHeart {
          0% {
            transform: translateY(0) translateX(0) scale(0.7) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50vh) translateX(15px) scale(1) rotate(15deg);
          }
          85% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-112vh) translateX(-15px) scale(1.15) rotate(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// 2. PASTEL FLOATING FLOWERS & PETALS DRIFTING
// ==========================================
export const FloatingPastelFlowers: React.FC<{
  count?: number;
  delayStart?: number;
}> = ({ count = 8, delayStart = 0 }) => {
  const flowers = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 13 + 7) % 90 + 5}%`,
      size: 16 + (i % 3) * 7,
      duration: 11 + (i % 4) * 4,
      delay: delayStart + ((i * 1.2) % 6),
      color: i % 3 === 0 ? 'pink' : i % 3 === 1 ? 'white' : 'blue',
      rotateSpeed: 6 + (i % 3) * 4,
    }));
  }, [count, delayStart]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flowers.map((f) => (
        <div
          key={f.id}
          className="absolute select-none will-change-transform"
          style={{
            left: f.left,
            bottom: '-35px',
            animation: `flowerDrift ${f.duration}s infinite linear ${f.delay}s`,
          }}
        >
          <div style={{ animation: `spinSlow ${f.rotateSpeed}s infinite linear` }}>
            <FlowerSticker color={f.color as 'pink' | 'blue' | 'white'} size={f.size} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes flowerDrift {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          12% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-55vh) translateX(25px);
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-115vh) translateX(-20px);
            opacity: 0;
          }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// 2B. GENTLE FALLING FLOWER PETALS (From top to bottom)
// ==========================================
export const FallingPetals: React.FC<{ count?: number }> = ({ count = 12 }) => {
  const petals = useMemo(() => {
    const colors = ['#FBCFE8', '#F472B6', '#FFFFFF', '#BAE6FD', '#FDA4AF'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 11 + 5) % 94 + 3}%`,
      size: 10 + (i % 4) * 4,
      duration: 7 + (i % 3) * 3,
      delay: (i * 0.8) % 6,
      color: colors[i % colors.length],
      rotate: (i * 35) % 360,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute select-none will-change-transform"
          style={{
            left: p.left,
            top: '-25px',
            animation: `fallingPetalDrift ${p.duration}s infinite linear ${p.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 20 20"
            style={{
              width: p.size,
              height: p.size * 1.3,
              transform: `rotate(${p.rotate}deg)`,
            }}
            fill="none"
          >
            <path
              d="M10 2 C16 4 18 12 10 18 C2 12 4 4 10 2 Z"
              fill={p.color}
              opacity="0.8"
            />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes fallingPetalDrift {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(180deg);
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(105vh) translateX(-15px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// 3. AMBIENT SPARKLE PARTICLES
// ==========================================
export const SparkleParticles: React.FC<{ count?: number }> = ({ count = 10 }) => {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 19 + 5) % 92 + 4}%`,
      top: `${(i * 23 + 8) % 88 + 6}%`,
      size: 8 + (i % 3) * 4,
      delay: (i * 0.9) % 5,
      duration: 2.4 + (i % 3) * 0.8,
      color: i % 2 === 0 ? '#fbcfe8' : '#ffffff',
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute will-change-transform select-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `twinkleSparkle ${s.duration}s infinite ease-in-out ${s.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
            <path
              d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"
              fill={s.color}
              opacity="0.8"
            />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes twinkleSparkle {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.3) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// 4. BURST PARTICLES EFFECT (Sparkles + Hearts + Petals)
// ==========================================
export const BurstEffect: React.FC<{ active: boolean; onDone?: () => void }> = ({
  active,
  onDone,
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => {
      const angle = (i / 26) * 2 * Math.PI;
      const dist = 55 + Math.random() * 95;
      return {
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        size: 12 + Math.random() * 12,
        type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'sparkle' : 'petal',
        color: ['#f472b6', '#fda4af', '#93c5fd', '#ffffff', '#fed7aa'][i % 5],
      };
    });
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute will-change-transform animate-burst-particle select-none flex items-center justify-center"
          style={
            {
              '--target-x': `${p.dx}px`,
              '--target-y': `${p.dy}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            } as React.CSSProperties
          }
        >
          {p.type === 'heart' ? (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : p.type === 'sparkle' ? (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
              <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
              {[0, 72, 144, 216, 288].map((angle, k) => (
                <ellipse
                  key={k}
                  cx="12"
                  cy="6"
                  rx="4.5"
                  ry="6"
                  fill={p.color}
                  transform={`rotate(${angle} 12 12)`}
                />
              ))}
              <circle cx="12" cy="12" r="3.5" fill="#FEF08A" />
            </svg>
          )}
        </span>
      ))}
      <style>{`
        @keyframes burstFly {
          0% {
            transform: translate(0, 0) scale(0.2);
            opacity: 1;
          }
          70% {
            opacity: 0.95;
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(1.2);
            opacity: 0;
          }
        }
        .animate-burst-particle {
          animation: burstFly 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

// ==========================================
// 5. PASTEL FLOWER STICKER (Pink, Blue, White)
// ==========================================
export const FlowerSticker: React.FC<{
  color?: 'pink' | 'blue' | 'white';
  size?: number;
  className?: string;
}> = ({ color = 'pink', size = 32, className = '' }) => {
  const isWhite = color === 'white';
  const isBlue = color === 'blue';

  const petalColor = isWhite ? '#FFFFFF' : isBlue ? '#BAE6FD' : '#FBCFE8';
  const petalBorder = isWhite ? '#E2E8F0' : isBlue ? '#60A5FA' : '#F472B6';
  const centerColor = '#FEF08A';

  return (
    <div
      className={`inline-block select-none pointer-events-none drop-shadow-xs ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 50 50" className="w-full h-full" fill="none">
        {/* 5 Petals */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <ellipse
            key={i}
            cx="25"
            cy="15"
            rx="7"
            ry="11"
            fill={petalColor}
            stroke={petalBorder}
            strokeWidth="0.9"
            transform={`rotate(${angle} 25 25)`}
          />
        ))}
        {/* Flower Center */}
        <circle cx="25" cy="25" r="5" fill={centerColor} stroke="#EAB308" strokeWidth="0.8" />
      </svg>
    </div>
  );
};

// ==========================================
// 6. CUTE PINK PAPER AIRPLANE
// ==========================================
export const PaperAirplane: React.FC<{
  direction?: 'left' | 'right';
  className?: string;
  size?: number;
}> = ({ direction = 'right', className = '', size = 110 }) => {
  const isRight = direction === 'right';

  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size * 0.7,
        transform: isRight ? 'none' : 'scaleX(-1)',
      }}
    >
      <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
        {/* Looping Dotted Flight Trail with small hearts */}
        <path
          d="M10 80 C30 95 45 40 60 55 C70 65 65 85 80 80 C95 75 105 50 120 45"
          stroke="#F472B6"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* SVG Little Hearts on trail */}
        <path
          d="M33 55 C33 52 35.5 50 38 52.5 C40.5 50 43 52 43 55 C43 58 38 61 38 61 C38 61 33 58 33 55 Z"
          fill="#F472B6"
          opacity="0.65"
        />
        <path
          d="M68 85 C68 82.5 70 81 72 83 C74 81 76 82.5 76 85 C76 87.5 72 90 72 90 C72 90 68 87.5 68 85 Z"
          fill="#F472B6"
          opacity="0.65"
        />

        {/* Paper Airplane Body */}
        <g transform="translate(100, 20) rotate(15)">
          <polygon
            points="0,15 45,0 35,35"
            fill="#FBCFE8"
            stroke="#F472B6"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points="0,15 45,0 20,25"
            fill="#F472B6"
            stroke="#DB2777"
            strokeWidth="1.2"
            opacity="0.8"
            strokeLinejoin="round"
          />
          <polygon
            points="20,25 45,0 28,30"
            fill="#F9A8D4"
            stroke="#F472B6"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

// ==========================================
// 7. QUILL FEATHER PEN
// ==========================================
export const QuillPen: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 75,
}) => {
  return (
    <div
      className={`inline-block select-none pointer-events-none ${className}`}
      style={{ width: size, height: size * 1.1 }}
    >
      <svg viewBox="0 0 90 100" className="w-full h-full" fill="none">
        <path
          d="M48 76 C55 86 65 92 72 88 C79 84 74 72 62 70 C42 66 32 82 40 92 C48 99 68 98 78 88"
          stroke="#475569"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <g transform="translate(28, 12) rotate(-28)">
          <path d="M22 68 L22 5" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M22 15 C10 18 5 35 7 50 C9 57 14 62 22 64"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          <path
            d="M22 8 C30 12 34 26 33 42 C32 50 28 58 22 62"
            fill="#475569"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          <path d="M12 35 L22 38" stroke="#F1F5F9" strokeWidth="1" opacity="0.6" />
          <path d="M10 46 L22 48" stroke="#F1F5F9" strokeWidth="1" opacity="0.6" />
          <path d="M30 28 L22 32" stroke="#F1F5F9" strokeWidth="1" opacity="0.6" />
          <polygon points="20,68 24,68 22,76" fill="#1E293B" />
        </g>
      </svg>
    </div>
  );
};

// ==========================================
// 8. POSTAGE STAMP
// ==========================================
export const PostageStamp: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 52 }) => {
  return (
    <div
      className={`inline-block select-none pointer-events-none p-1 bg-white border border-dashed border-pink-300 rounded shadow-xs ${className}`}
      style={{ width: size, height: size * 1.2 }}
    >
      <div className="w-full h-full bg-pink-50/70 rounded-xs flex flex-col items-center justify-center p-1 border border-pink-200">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-pink-500 text-pink-500">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-[7px] font-sans-clean tracking-wider text-pink-400 font-semibold uppercase mt-0.5">
          LOVE
        </span>
        <span className="text-[6px] text-pink-300 font-mono">08.YRS</span>
      </div>
    </div>
  );
};
