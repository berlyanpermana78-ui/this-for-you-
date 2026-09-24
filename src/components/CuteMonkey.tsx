import React from 'react';
import { FlowerBucket } from './FlowerBucket';

export type MonkeyPose =
  | 'smiling-flower'    // Monyet tersenyum memegang bunga (Opening)
  | 'sitting-flower'    // Monyet duduk memegang bunga kecil (Memories / Secret)
  | 'shy-peeking'       // Monyet malu menutup sebagian wajah (Letter / Password)
  | 'holding-bucket'    // Monyet membawa / memeluk bucket bunga (Confession & Final Question)
  | 'holding-button'    // Monyet memegang & membawa tombol Tidak (setiap kali dipencet)
  | 'running-button'    // Monyet membawa kabur tombol "Tidak"
  | 'surrendered-yes'   // Monyet menyerah lelah, tombol berubah jadi "IYA ♡" dengan bunga pastel
  | 'super-happy'       // Monyet sangat senang mengangkat bucket bunga (When "IYA")
  | 'sitting-celebrate' // Monyet duduk di samping bucket bunga besar (Final)
  | 'curious';          // Monyet penasaran

interface CuteMonkeyProps {
  pose?: MonkeyPose;
  size?: number;
  className?: string;
  withSparkles?: boolean;
  buttonText?: string;
  onButtonClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const CuteMonkey: React.FC<CuteMonkeyProps> = ({
  pose = 'smiling-flower',
  size = 140,
  className = '',
  withSparkles = true,
  buttonText = 'TIDAK',
  onButtonClick,
}) => {
  // Common Colors & Styles:
  // Primary: Pure warm white (#FFFDFD)
  // Face & Belly Patch: Soft warm pastel cream/peach (#FFF1E8)
  // Inner Ear & Blush: Romantic pastel pink (#FFB6C1 / #FF8FA3)
  // Outlines: Soft charcoal brown (#463B38)
  // Eyes & Nose: Deep warm brown (#2F2624)

  const strokeColor = '#463B38';
  const strokeW = 3.5;

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size * 1.05 }}
    >
      <svg
        viewBox="0 0 200 210"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
          <linearGradient id="pinkBtnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* ========================================================
            TAIL (Back layer)
            ======================================================== */}
        {pose !== 'running-button' && (
          <path
            d="M50 160 C15 155 10 110 35 100 C45 95 50 110 38 115 C25 120 28 145 52 150 Z"
            fill="#FFFDFD"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        )}

        {/* Running tail */}
        {pose === 'running-button' && (
          <path
            d="M45 155 C10 145 0 95 30 85 C42 80 46 95 34 100 C20 108 22 135 48 145 Z"
            fill="#FFFDFD"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        )}

        {/* ========================================================
            BODY
            ======================================================== */}
        <g id="monkey-body">
          {/* Main Body */}
          <path
            d="M65 120 C55 145 55 185 100 185 C145 185 145 145 135 120 Z"
            fill="#FFFDFD"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
          {/* Belly Patch */}
          <ellipse cx="100" cy="155" rx="26" ry="22" fill="#FFF1E8" />

          {/* Little Feet */}
          {pose === 'sitting-flower' || pose === 'sitting-celebrate' || pose === 'surrendered-yes' ? (
            // Sitting Feet (spread to the sides, exhausted / surrendered cute pose)
            <>
              <ellipse cx="58" cy="180" rx="15" ry="10" transform="rotate(-15 58 180)" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
              <ellipse cx="58" cy="180" rx="9" ry="6" fill="#FFF1E8" />
              <ellipse cx="142" cy="180" rx="15" ry="10" transform="rotate(15 142 180)" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
              <ellipse cx="142" cy="180" rx="9" ry="6" fill="#FFF1E8" />
            </>
          ) : pose === 'running-button' ? (
            // Running feet spread wide
            <>
              <ellipse cx="50" cy="185" rx="16" ry="9" transform="rotate(-30 50 185)" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
              <ellipse cx="145" cy="178" rx="16" ry="9" transform="rotate(25 145 178)" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            </>
          ) : (
            // Standing feet
            <>
              <ellipse cx="78" cy="188" rx="13" ry="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
              <ellipse cx="122" cy="188" rx="13" ry="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            </>
          )}
        </g>

        {/* ========================================================
            HEAD & EARS
            ======================================================== */}
        <g id="monkey-head">
          {/* Left Ear */}
          <circle cx="36" cy="78" r="22" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="36" cy="78" r="14" fill="#FFB6C1" />

          {/* Right Ear */}
          <circle cx="164" cy="78" r="22" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="164" cy="78" r="14" fill="#FFB6C1" />

          {/* Main Head Base */}
          <ellipse
            cx="100"
            cy="78"
            rx="56"
            ry="48"
            fill="#FFFDFD"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Heart-shaped / M-shaped Facial Patch (Classic cute monkey mask) */}
          <path
            d="M100 80 C85 52 56 56 56 78 C56 98 75 112 100 112 C125 112 144 98 144 78 C144 56 115 52 100 80 Z"
            fill="#FFF1E8"
          />

          {/* Cheeks Blush - SVG Stars */}
          <ellipse cx="62" cy="94" rx="10" ry="6" fill="#FF8FA3" opacity="0.85" />
          <ellipse cx="138" cy="94" rx="10" ry="6" fill="#FF8FA3" opacity="0.85" />
          {/* SVG sparkle star on cheeks instead of text */}
          <path d="M62 89 Q63.5 92 66 92 Q63.5 92 62 95 Q60.5 92 58 92 Q60.5 92 62 89 Z" fill="#FFFFFF" />
          <path d="M138 89 Q139.5 92 142 92 Q139.5 92 138 95 Q136.5 92 134 92 Q136.5 92 138 89 Z" fill="#FFFFFF" />

          {/* Cute Little Nose */}
          <ellipse cx="100" cy="88" rx="4.5" ry="3.5" fill="#463B38" />

          {/* ====================================================
              EYES & MOUTH (VARIES BY POSE)
              ==================================================== */}
          {pose === 'shy-peeking' ? (
            // Shy squinting eyes ^_^ and small embarrassed mouth
            <>
              <path d="M72 78 Q80 70 88 78" stroke="#2F2624" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M112 78 Q120 70 128 78" stroke="#2F2624" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M96 98 Q100 102 104 98" stroke="#2F2624" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : pose === 'super-happy' ? (
            // Super happy eyes (wide sparkling curved arcs with shine)
            <>
              <path d="M70 76 Q80 66 90 76" stroke="#2F2624" strokeWidth="4" strokeLinecap="round" />
              <path d="M110 76 Q120 66 130 76" stroke="#2F2624" strokeWidth="4" strokeLinecap="round" />
              <path d="M90 94 Q100 90 110 94 Q100 114 90 94 Z" fill="#FF6B8B" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
              <path d="M93 102 Q100 98 107 102" fill="#FFA3B8" />
            </>
          ) : pose === 'running-button' ? (
            // Mischievous / Playful wink & sticking out tongue
            <>
              <circle cx="80" cy="76" r="5" fill="#2F2624" />
              <circle cx="78" cy="74" r="1.8" fill="#FFF" />
              <path d="M114 72 L124 77 L114 82" stroke="#2F2624" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M92 94 Q100 92 108 94" stroke="#2F2624" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M95 94 Q100 106 105 94 Z" fill="#FF6B8B" stroke={strokeColor} strokeWidth="1.8" />
            </>
          ) : pose === 'surrendered-yes' ? (
            // Surrendered / Sweet pleading sparkling starry eyes (Puss in boots puppy eyes)
            <>
              {/* Big starry pleading eyes */}
              <ellipse cx="78" cy="76" rx="7.5" ry="8.5" fill="#2F2624" />
              <circle cx="76" cy="72.5" r="3.2" fill="#FFF" />
              <circle cx="81" cy="79" r="1.8" fill="#FFF" />
              <path d="M78 74 Q79 76 81 76" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />

              <ellipse cx="122" cy="76" rx="7.5" ry="8.5" fill="#2F2624" />
              <circle cx="120" cy="72.5" r="3.2" fill="#FFF" />
              <circle cx="125" cy="79" r="1.8" fill="#FFF" />
              <path d="M122 74 Q123 76 125 76" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />

              {/* Sweet slightly embarrassed happy surrender smile */}
              <path d="M94 97 Q100 104 106 97" stroke="#2F2624" strokeWidth="2.8" strokeLinecap="round" />
              {/* Big sweat drop on temple showing tired / surrender */}
              <path
                d="M145 52 Q150 46 152 52 Q155 60 149 60 Q143 60 145 52 Z"
                fill="#60A5FA"
                stroke="#3B82F6"
                strokeWidth="1.2"
              />
              {/* White surrender flag sticker on head tuft */}
              <g transform="translate(112, 14)">
                <line x1="0" y1="20" x2="0" y2="0" stroke="#78716C" strokeWidth="1.5" />
                <path d="M0 0 L15 5 L0 10 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              </g>
            </>
          ) : pose === 'holding-button' ? (
            // Determined cute monkey clutching the button
            <>
              <ellipse cx="80" cy="76" rx="6" ry="7" fill="#2F2624" />
              <circle cx="78" cy="73.5" r="2.2" fill="#FFF" />
              <ellipse cx="120" cy="76" rx="6" ry="7" fill="#2F2624" />
              <circle cx="118" cy="73.5" r="2.2" fill="#FFF" />
              {/* Cute pouty / determined mouth */}
              <path d="M95 97 Q100 94 105 97" stroke="#2F2624" strokeWidth="2.8" strokeLinecap="round" />
              {/* Small sweat drop */}
              <path
                d="M142 56 Q146 51 148 56 Q150 62 145 62 Q140 62 142 56 Z"
                fill="#60A5FA"
              />
            </>
          ) : pose === 'curious' ? (
            // Curious big round eyes looking sideways
            <>
              <ellipse cx="80" cy="76" rx="6" ry="7" fill="#2F2624" />
              <circle cx="78" cy="74" r="2.2" fill="#FFF" />
              <ellipse cx="120" cy="76" rx="6" ry="7" fill="#2F2624" />
              <circle cx="118" cy="74" r="2.2" fill="#FFF" />
              <ellipse cx="100" cy="98" rx="4" ry="5" fill="#FF8FA3" stroke={strokeColor} strokeWidth={2} />
            </>
          ) : (
            // Default: Big sparkling kind eyes & sweet :3 smile
            <>
              <ellipse cx="80" cy="76" rx="6" ry="7.5" fill="#2F2624" />
              <circle cx="78" cy="73.5" r="2.5" fill="#FFF" />
              <circle cx="82" cy="79" r="1.2" fill="#FFF" />

              <ellipse cx="120" cy="76" rx="6" ry="7.5" fill="#2F2624" />
              <circle cx="118" cy="73.5" r="2.5" fill="#FFF" />
              <circle cx="122" cy="79" r="1.2" fill="#FFF" />

              <path
                d="M92 95 Q96 100 100 95 Q104 100 108 95"
                stroke="#2F2624"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Little hair tuft on top */}
          <path
            d="M95 31 C98 22 105 22 103 31 C108 23 115 25 110 34"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ========================================================
            ARMS & HANDHELD PROPS (VARIES BY POSE)
            ======================================================== */}
        {pose === 'smiling-flower' && (
          // Holding single pink blossom with green stem
          <g id="arms-single-flower">
            <path d="M125 140 Q130 115 135 100" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="130" cy="115" rx="6" ry="3" transform="rotate(-30 130 115)" fill="#A7F3D0" />
            <g transform="translate(135, 96)">
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse key={i} cx="0" cy="-7" rx="5" ry="7" fill="#FBCFE8" stroke="#F472B6" strokeWidth="1.5" transform={`rotate(${angle})`} />
              ))}
              <circle cx="0" cy="0" r="4.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" />
            </g>
            <path d="M125 125 C135 128 135 140 128 142" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
            <circle cx="128" cy="138" r="8" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="75" cy="142" r="8" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {pose === 'sitting-flower' && (
          // Sitting peacefully holding a small pastel blue blossom
          <g id="arms-sitting-flower">
            <path d="M100 148 Q100 135 100 120" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(100, 116)">
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse key={i} cx="0" cy="-6" rx="4.5" ry="6.5" fill="#BAE6FD" stroke="#60A5FA" strokeWidth="1.5" transform={`rotate(${angle})`} />
              ))}
              <circle cx="0" cy="0" r="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" />
            </g>
            <circle cx="92" cy="138" r="7.5" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="108" cy="138" r="7.5" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {pose === 'shy-peeking' && (
          <g id="arms-shy">
            <circle cx="58" cy="98" r="10" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="142" cy="98" r="10" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {pose === 'holding-bucket' && (
          // Holding the Flower Bouquet right at chest level
          <g id="arms-bouquet" transform="translate(50, 95)">
            <foreignObject width="100" height="110">
              <FlowerBucket variant="handheld" size={96} withSparkles={false} />
            </foreignObject>
            <circle cx="16" cy="65" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="84" cy="65" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {pose === 'holding-button' && (
          // The monkey is directly holding and hugging the TIDAK button in its paws!
          <g id="arms-holding-button">
            {/* Embedded interactive button container */}
            <g
              transform="translate(45, 125)"
              className={onButtonClick ? 'pointer-events-auto cursor-pointer' : ''}
              onClick={onButtonClick}
              onTouchStart={onButtonClick}
            >
              <rect
                x="0"
                y="0"
                width="110"
                height="42"
                rx="21"
                fill="#1E293B"
                stroke="#F472B6"
                strokeWidth="2.5"
                filter="url(#softShadow)"
              />
              <text
                x="55"
                y="26"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="14"
                fontWeight="bold"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                {buttonText}
              </text>
            </g>
            {/* Monkey paws hugging the button from both sides */}
            <circle cx="48" cy="146" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="152" cy="146" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {pose === 'surrendered-yes' && (
          // The monkey surrendered! It offers the glowing pink "IYA ♡" button with flower decorations
          <g id="arms-surrendered-yes">
            <g
              transform="translate(40, 120)"
              className={onButtonClick ? 'pointer-events-auto cursor-pointer animate-pulse' : ''}
              onClick={onButtonClick}
              onTouchStart={onButtonClick}
            >
              {/* Golden/Pink glow backdrop */}
              <rect
                x="-4"
                y="-4"
                width="128"
                height="50"
                rx="25"
                fill="none"
                stroke="#F472B6"
                strokeWidth="3"
                opacity="0.6"
              />
              <rect
                x="0"
                y="0"
                width="120"
                height="42"
                rx="21"
                fill="url(#pinkBtnGrad)"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#softShadow)"
              />
              {/* Button text: IYA with SVG Heart */}
              <text
                x="50"
                y="27"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="900"
                fontFamily="sans-serif"
                letterSpacing="1.5"
              >
                {buttonText || 'IYA'}
              </text>
              {/* SVG Heart icon inside surrendered button */}
              <path
                d="M75 22 C75 18 80 15 84 19 C88 15 93 18 93 22 C93 27 84 31 84 31 C84 31 75 27 75 22 Z"
                fill="#FFFFFF"
              />
            </g>
            {/* Little paws offering the IYA button politely */}
            <circle cx="42" cy="142" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="158" cy="142" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />

            {/* Little pastel flower tucked beside button */}
            <g transform="translate(155, 115)">
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse key={i} cx="0" cy="-5" rx="3.5" ry="5.5" fill="#BAE6FD" stroke="#60A5FA" strokeWidth="1" transform={`rotate(${angle})`} />
              ))}
              <circle cx="0" cy="0" r="3" fill="#FEF08A" />
            </g>
          </g>
        )}

        {pose === 'super-happy' && (
          // Arms raised high holding the bouquet up with pride & joy
          <g id="arms-raised-bouquet">
            <path d="M60 120 C40 100 45 70 65 65" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
            <path d="M140 120 C160 100 155 70 135 65" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />

            <g transform="translate(48, 70)">
              <foreignObject width="104" height="115">
                <FlowerBucket variant="handheld" size={100} withSparkles={true} />
              </foreignObject>
            </g>
            <circle cx="62" cy="90" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="138" cy="90" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {pose === 'running-button' && (
          // Running away carrying the "TIDAK" button under arm!
          <g id="arms-running-button">
            <g
              transform="translate(90, 115) rotate(14)"
              className={onButtonClick ? 'pointer-events-auto cursor-pointer' : ''}
              onClick={onButtonClick}
              onTouchStart={onButtonClick}
            >
              <rect
                x="0"
                y="0"
                width="84"
                height="38"
                rx="19"
                fill="#1E293B"
                stroke="#F472B6"
                strokeWidth="2.5"
                filter="url(#softShadow)"
              />
              <text
                x="42"
                y="24"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="13"
                fontWeight="bold"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                {buttonText}
              </text>
              <path d="M-8 10 L-2 19 L-8 28" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
            </g>

            <circle cx="95" cy="132" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="155" cy="142" r="9" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />

            <path
              d="M142 55 Q146 50 148 55 Q150 62 145 62 Q140 62 142 55 Z"
              fill="#60A5FA"
            />
          </g>
        )}

        {pose === 'sitting-celebrate' && (
          <g id="arms-celebrate">
            <circle cx="85" cy="150" r="8.5" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
            <circle cx="115" cy="150" r="8.5" fill="#FFFDFD" stroke={strokeColor} strokeWidth={strokeW} />
          </g>
        )}

        {/* Ambient Little Sparkles around monkey - SVG Path shapes */}
        {withSparkles && (
          <g id="ambient-sparkles">
            <path d="M25 45 Q29 45 29 40 Q29 45 33 45 Q29 45 29 50 Q29 45 25 45 Z" fill="#F472B6" />
            <path d="M175 42 Q179 42 179 38 Q179 42 183 42 Q179 42 179 46 Q179 42 175 42 Z" fill="#60A5FA" />
            {/* SVG Heart instead of text */}
            <path
              d="M168 68 C168 64 172 61 175 64 C178 61 182 64 182 68 C182 72 175 76 175 76 C175 76 168 72 168 68 Z"
              fill="#F472B6"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
