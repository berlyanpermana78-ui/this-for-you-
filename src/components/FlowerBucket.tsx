import React from 'react';

export type FlowerBucketVariant = 'handheld' | 'small' | 'medium' | 'large';

interface FlowerBucketProps {
  variant?: FlowerBucketVariant;
  size?: number;
  className?: string;
  withSparkles?: boolean;
}

export const FlowerBucket: React.FC<FlowerBucketProps> = ({
  variant = 'medium',
  size,
  className = '',
  withSparkles = true,
}) => {
  // Determine default sizing based on variant
  const defaultSize =
    variant === 'large'
      ? 180
      : variant === 'handheld'
      ? 90
      : variant === 'small'
      ? 75
      : 125;

  const actualSize = size || defaultSize;

  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{ width: actualSize, height: actualSize * 1.15 }}
    >
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Kraft / Pastel Blue-White paper wrap gradient */}
          <linearGradient id="kraftWrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDFC" />
            <stop offset="50%" stopColor="#F7EFE5" />
            <stop offset="100%" stopColor="#E9DDCB" />
          </linearGradient>

          {/* Inner shade for flower depth */}
          <radialGradient id="wrapShadow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#836D55" stopOpacity="0.25" />
          </radialGradient>

          {/* Pink ribbon gradient */}
          <linearGradient id="pinkRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* Back green foliage/leaves */}
        <g id="foliage-back">
          <ellipse cx="60" cy="85" rx="22" ry="12" transform="rotate(-35 60 85)" fill="#A7F3D0" stroke="#34D399" strokeWidth="2.5" />
          <ellipse cx="140" cy="85" rx="22" ry="12" transform="rotate(35 140 85)" fill="#A7F3D0" stroke="#34D399" strokeWidth="2.5" />
          <ellipse cx="100" cy="65" rx="25" ry="14" fill="#6EE7B7" stroke="#059669" strokeWidth="2.5" />
          <ellipse cx="40" cy="100" rx="18" ry="10" transform="rotate(-50 40 100)" fill="#86EFAC" stroke="#22C55E" strokeWidth="2" />
          <ellipse cx="160" cy="100" rx="18" ry="10" transform="rotate(50 160 100)" fill="#86EFAC" stroke="#22C55E" strokeWidth="2" />
        </g>

        {/* Dense Romantic Flower Cluster: Soft Pink, Pure White, Pastel Blue, with Yellow Centers */}
        <g id="flowers">
          {/* Flower 1 - Left Pink Blossom */}
          <g transform="translate(48, 80)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx="20"
                cy="10"
                rx="9"
                ry="13"
                fill="#FBCFE8"
                stroke="#F472B6"
                strokeWidth="2"
                transform={`rotate(${angle} 20 20)`}
              />
            ))}
            <circle cx="20" cy="20" r="7" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
          </g>

          {/* Flower 2 - Right Soft Blue Blossom */}
          <g transform="translate(112, 80)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx="20"
                cy="10"
                rx="9"
                ry="13"
                fill="#BAE6FD"
                stroke="#60A5FA"
                strokeWidth="2"
                transform={`rotate(${angle} 20 20)`}
              />
            ))}
            <circle cx="20" cy="20" r="7" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
          </g>

          {/* Flower 3 - Top Center Pure White Blossom */}
          <g transform="translate(80, 50)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx="20"
                cy="10"
                rx="9.5"
                ry="14"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="2"
                transform={`rotate(${angle} 20 20)`}
              />
            ))}
            <circle cx="20" cy="20" r="7" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
          </g>

          {/* Flower 4 - Center Rose / Pink Full Blossom */}
          <g transform="translate(78, 88)">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <ellipse
                key={i}
                cx="22"
                cy="10"
                rx="10"
                ry="15"
                fill="#F472B6"
                stroke="#DB2777"
                strokeWidth="2"
                transform={`rotate(${angle} 22 22)`}
              />
            ))}
            <circle cx="22" cy="22" r="9" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1.5" />
            <circle cx="22" cy="22" r="5" fill="#FEF08A" />
          </g>

          {/* Mini baby's breath / small pastel stars */}
          <circle cx="45" cy="70" r="4.5" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
          <circle cx="155" cy="70" r="4.5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="1.5" />
          <circle cx="100" cy="40" r="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="70" cy="55" r="3.5" fill="#BAE6FD" />
          <circle cx="130" cy="55" r="3.5" fill="#FBCFE8" />
        </g>

        {/* Kraft Bouquet Wrapper Cone / Envelope */}
        <g id="wrapper">
          {/* Back Paper Flap */}
          <polygon
            points="35,115 165,115 130,215 70,215"
            fill="url(#wrapShadow)"
          />

          {/* Outer Wrapped Paper Cone (diagonal folding like real bouquet) */}
          <path
            d="M30 115 C55 125 75 140 100 220 L72 220 C50 160 38 135 30 115 Z"
            fill="#EADBC8"
            stroke="#5A4A3A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M170 115 C145 125 125 140 100 220 L128 220 C150 160 162 135 170 115 Z"
            fill="#F3E7D8"
            stroke="#5A4A3A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Main front triangular wrap */}
          <path
            d="M40 112 Q100 132 160 112 L120 220 Q100 224 80 220 Z"
            fill="url(#kraftWrapGrad)"
            stroke="#4A3B2C"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Front cute label sticker on the wrapper */}
          <g transform="translate(75, 142)">
            <rect
              x="0"
              y="0"
              width="50"
              height="26"
              rx="4"
              fill="#FFFFFF"
              stroke="#F472B6"
              strokeWidth="1.8"
            />
            <text
              x="25"
              y="14"
              textAnchor="middle"
              fill="#EC4899"
              fontSize="8"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              FOR YOU
            </text>
            {/* Three small decorative vector hearts */}
            <g transform="translate(14, 16)">
              <path d="M0 3 C0 1.5 2 0.5 3.5 2 C5 0.5 7 1.5 7 3 C7 5 3.5 7 3.5 7 C3.5 7 0 5 0 3 Z" fill="#F472B6" />
            </g>
            <g transform="translate(22, 15)">
              <path d="M0 3.5 C0 1.8 2.3 0.6 4 2.3 C5.7 0.6 8 1.8 8 3.5 C8 6 4 8.5 4 8.5 C4 8.5 0 6 0 3.5 Z" fill="#F472B6" />
            </g>
            <g transform="translate(32, 16)">
              <path d="M0 3 C0 1.5 2 0.5 3.5 2 C5 0.5 7 1.5 7 3 C7 5 3.5 7 3.5 7 C3.5 7 0 5 0 3 Z" fill="#F472B6" />
            </g>
          </g>
        </g>

        {/* Cute Pink Ribbon Bow & Hanging Streamers */}
        <g id="ribbon" transform="translate(100, 185)">
          {/* Hanging tails */}
          <path
            d="M-5 4 C-15 18 -20 30 -22 38 L-14 36 L-10 40 C-8 28 -2 15 -2 5 Z"
            fill="#F472B6"
            stroke="#4A3B2C"
            strokeWidth="2"
          />
          <path
            d="M5 4 C15 18 20 30 22 38 L14 36 L10 40 C8 28 2 15 2 5 Z"
            fill="#F472B6"
            stroke="#4A3B2C"
            strokeWidth="2"
          />

          {/* Left Bow Loop */}
          <path
            d="M0 0 C-18 -15 -32 -2 -22 10 C-14 18 -2 4 0 0 Z"
            fill="url(#pinkRibbonGrad)"
            stroke="#4A3B2C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Bow Loop */}
          <path
            d="M0 0 C18 -15 32 -2 22 10 C14 18 2 4 0 0 Z"
            fill="url(#pinkRibbonGrad)"
            stroke="#4A3B2C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Knot */}
          <ellipse
            cx="0"
            cy="2"
            rx="6.5"
            ry="6"
            fill="#FF85A2"
            stroke="#4A3B2C"
            strokeWidth="3"
          />
        </g>

        {/* Optional floating sparkles & falling petal */}
        {withSparkles && (
          <g id="sparkles-and-petals">
            {/* Sparkle 1 */}
            <path
              d="M30 65 Q35 65 35 60 Q35 65 40 65 Q35 65 35 70 Q35 65 30 65 Z"
              fill="#F472B6"
              className="animate-pulse"
            />
            {/* Sparkle 2 */}
            <path
              d="M165 60 Q170 60 170 55 Q170 60 175 60 Q170 60 170 65 Q170 60 165 60 Z"
              fill="#60A5FA"
              className="animate-pulse"
            />
            {/* Drifting Petal */}
            <path
              d="M175 125 C182 120 190 128 185 135 C180 140 170 135 175 125 Z"
              fill="#FBCFE8"
              stroke="#F472B6"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
