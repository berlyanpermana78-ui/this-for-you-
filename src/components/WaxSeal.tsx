import React from 'react';

interface WaxSealProps {
  color?: 'pink' | 'blue';
  size?: number;
  className?: string;
  withRibbon?: boolean;
  glow?: boolean;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  color = 'blue',
  size = 64,
  className = '',
  withRibbon = false,
  glow = false,
}) => {
  const isPink = color === 'pink';

  // Palette definitions
  const baseGradStart = isPink ? '#fca5a5' : '#93c5fd';
  const baseGradMid = isPink ? '#f43f5e' : '#3b82f6';
  const baseGradEnd = isPink ? '#be123c' : '#1d4ed8';
  const highlight = isPink ? '#ffe4e6' : '#dbeafe';
  const ribbonColor = isPink ? '#f472b6' : '#60a5fa';
  const ribbonDark = isPink ? '#db2777' : '#2563eb';

  const glowShadow = glow
    ? isPink
      ? '0 0 20px rgba(244, 114, 182, 0.75), 0 4px 12px rgba(10, 18, 36, 0.5)'
      : '0 0 20px rgba(96, 165, 250, 0.75), 0 4px 12px rgba(10, 18, 36, 0.5)'
    : '0 4px 8px rgba(10, 18, 36, 0.45)';


  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: withRibbon ? size * 1.5 : size }}
    >
      {/* Optional Hanging Ribbons */}
      {withRibbon && (
        <svg
          viewBox="0 0 100 120"
          className="absolute -top-1 pointer-events-none drop-shadow-sm"
          style={{ width: size * 0.9, height: size * 1.3 }}
          fill="none"
        >
          {/* Left Ribbon streamer */}
          <path
            d="M44 38 Q32 75 22 110 L34 105 L42 114 Q48 75 52 38 Z"
            fill={ribbonColor}
            opacity="0.85"
          />
          <path
            d="M44 38 Q32 75 22 110 L28 107 Q36 78 46 38 Z"
            fill={ribbonDark}
            opacity="0.25"
          />
          {/* Right Ribbon streamer */}
          <path
            d="M56 38 Q68 75 78 110 L68 105 L60 114 Q54 75 48 38 Z"
            fill={ribbonColor}
            opacity="0.85"
          />
          <path
            d="M56 38 Q68 75 78 110 L74 107 Q64 78 52 38 Z"
            fill={ribbonDark}
            opacity="0.25"
          />
        </svg>
      )}

      {/* Wax Seal Medallion */}
      <div
        className="relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95"
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(${glowShadow})`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            {/* Wax gradient */}
            <radialGradient id={`waxGrad-${color}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={highlight} />
              <stop offset="25%" stopColor={baseGradStart} />
              <stop offset="65%" stopColor={baseGradMid} />
              <stop offset="100%" stopColor={baseGradEnd} />
            </radialGradient>

            {/* Inner groove shadow */}
            <radialGradient id={`innerGroove-${color}`} cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor={baseGradMid} />
              <stop offset="95%" stopColor={baseGradEnd} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* Organic Wax Outer Flange (scalloped irregular rim) */}
          <path
            d="M50 4 
               C62 3 74 8 83 17 
               C92 26 97 38 96 50 
               C97 63 91 76 82 85 
               C72 94 59 97 48 96 
               C34 97 22 91 14 81 
               C5 71 3 58 5 46 
               C4 32 11 20 21 12 
               C30 5 40 4 50 4 Z"
            fill={`url(#waxGrad-${color})`}
          />

          {/* Melted wax ripples */}
          <circle cx="50" cy="50" r="38" fill={`url(#innerGroove-${color})`} />
          <circle cx="50" cy="50" r="35" stroke={highlight} strokeWidth="1.5" strokeOpacity="0.55" />
          <circle cx="50" cy="50" r="33" stroke={baseGradEnd} strokeWidth="1.2" strokeOpacity="0.45" />

          {/* Top gloss highlight */}
          <path
            d="M30 18 C42 12 60 12 72 19 C74 20 72 23 69 22 C59 18 43 18 33 22 C30 23 28 20 30 18 Z"
            fill="#FFFFFF"
            opacity="0.55"
          />

          {/* Embossed Center Heart */}
          <path
            d="M50 67 C50 67 34 50 34 39 C34 31 41 25 48 29 C50 30.5 50 31.5 50 31.5 C50 31.5 50 30.5 52 29 C59 25 66 31 66 39 C66 50 50 67 50 67 Z"
            fill={baseGradEnd}
            opacity="0.35"
          />
          <path
            d="M50 65 C50 65 35 48.5 35 38 C35 30.5 41.5 25 48 28.5 C49.5 29.5 50 30.5 50 30.5 C50 30.5 50.5 29.5 52 28.5 C58.5 25 65 30.5 65 38 C65 48.5 50 65 50 65 Z"
            fill={baseGradStart}
          />
          {/* Heart embossed rim */}
          <path
            d="M50 65 C50 65 35 48.5 35 38 C35 30.5 41.5 25 48 28.5"
            stroke={highlight}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M48 28.5 C49.5 29.5 50 30.5 50 30.5 C50 30.5 50.5 29.5 52 28.5 C58.5 25 65 30.5 65 38 C65 48.5 50 65 50 65"
            stroke={baseGradEnd}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};
