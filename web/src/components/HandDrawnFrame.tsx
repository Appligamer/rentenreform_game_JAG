import React, { useState } from 'react';
import { AVAILABLE_ARTWORKS } from 'virtual:available-artworks';
import { PenTool } from 'lucide-react';

interface HandDrawnFrameProps {
  assetPath: string;
  title: string;
  designerInstruction: string;
  dimensions: string;
  aspectRatio?: string;
  className?: string;
  heightClass?: string;
  variant?: 'editorial' | 'blueprint';
}

const AVAILABLE_SET = new Set(AVAILABLE_ARTWORKS);

function normalizeAssetKey(assetPath: string): string {
  return assetPath
    .replace(/^\/+/, '')
    .replace(/^assets\/images\//, 'artworks/');
}

const EditorialVectorArtwork: React.FC<{ assetKey: string; title: string }> = ({
  assetKey,
  title,
}) => {
  const filename = assetKey.split('/').pop() || '';

  if (filename.includes('generationenkapital')) {
    return (
      <svg
        viewBox="0 0 240 130"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="gkGlow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="240" height="130" fill="#0d0d10" />
        <rect width="240" height="130" fill="url(#gkGlow)" />
        <path
          d="M24 102 L68 86 L108 92 L152 56 L188 44 L216 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="152" cy="56" r="3.5" fill="#fbbf24" />
        <circle cx="188" cy="44" r="3.5" fill="#fbbf24" />
        <circle cx="216" cy="24" r="4.5" fill="#34d399" />
        <rect
          x="74"
          y="76"
          width="92"
          height="38"
          rx="6"
          fill="#18181b"
          stroke="rgba(245,158,11,0.45)"
          strokeWidth="1.5"
        />
        <circle cx="120" cy="95" r="10" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <line x1="120" y1="88" x2="120" y2="102" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="113" y1="95" x2="127" y2="95" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    );
  }

  if (filename.includes('haltelinie')) {
    return (
      <svg
        viewBox="0 0 240 130"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="hlGlow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="240" height="130" fill="#0c0e14" />
        <rect width="240" height="130" fill="url(#hlGlow)" />
        <path
          d="M12 96 Q48 84 84 96 T156 96 T228 96"
          fill="none"
          stroke="rgba(56,189,248,0.45)"
          strokeWidth="2"
        />
        <path
          d="M12 108 Q52 98 92 108 T172 108 T232 108"
          fill="none"
          stroke="rgba(56,189,248,0.25)"
          strokeWidth="1.5"
        />
        <polygon
          points="106,96 112,38 128,38 134,96"
          fill="#161b26"
          stroke="#38bdf8"
          strokeWidth="1.6"
        />
        <rect x="110" y="28" width="20" height="10" rx="2" fill="#38bdf8" fillOpacity="0.85" />
        <line x1="56" y1="24" x2="108" y2="33" stroke="rgba(56,189,248,0.35)" strokeWidth="6" />
        <line x1="184" y1="24" x2="132" y2="33" stroke="rgba(56,189,248,0.35)" strokeWidth="6" />
        <text
          x="120"
          y="74"
          textAnchor="middle"
          fill="#f5f5f7"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
        >
          48%
        </text>
      </svg>
    );
  }

  if (filename.includes('retirement_age')) {
    return (
      <svg
        viewBox="0 0 240 130"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="240" height="130" fill="#0d0f12" />
        <circle cx="120" cy="65" r="38" fill="#141820" stroke="rgba(245,158,11,0.4)" strokeWidth="1.6" />
        <circle cx="120" cy="65" r="31" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="120" y1="65" x2="120" y2="41" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="120" y1="65" x2="139" y2="75" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="120" cy="65" r="3.5" fill="#f5f5f7" />
        <path d="M168 50 L186 50 L180 44 M186 50 L180 56" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (filename.includes('bav_matching')) {
    return (
      <svg
        viewBox="0 0 240 130"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="240" height="130" fill="#0c1012" />
        <rect x="46" y="76" width="38" height="32" rx="4" fill="#182026" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" />
        <rect x="101" y="56" width="38" height="52" rx="4" fill="#182026" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
        <rect x="156" y="34" width="38" height="74" rx="4" fill="#182026" stroke="rgba(245,158,11,0.65)" strokeWidth="1.6" />
        <line x1="34" y1="108" x2="206" y2="108" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
      </svg>
    );
  }

  if (filename.includes('market_bull')) {
    return (
      <svg
        viewBox="0 0 240 130"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bullLine" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <rect width="240" height="130" fill="#0b1011" />
        <path
          d="M20 105 L66 84 L98 90 L146 46 L174 54 L214 22"
          fill="none"
          stroke="url(#bullLine)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <polygon points="214,22 200,24 211,35" fill="#34d399" />
        <path
          d="M20 105 L66 84 L98 90 L146 46 L174 54 L214 22 L214 118 L20 118 Z"
          fill="#34d399"
          fillOpacity="0.08"
        />
      </svg>
    );
  }

  if (filename.includes('boomer_wave')) {
    return (
      <svg
        viewBox="0 0 240 130"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="240" height="130" fill="#0d0e13" />
        <path
          d="M20 82 Q75 30 130 82 T225 70"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <line x1="28" y1="96" x2="212" y2="96" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="65" y1="96" x2="65" y2="118" stroke="rgba(56,189,248,0.5)" strokeWidth="3" />
        <line x1="120" y1="96" x2="120" y2="118" stroke="rgba(56,189,248,0.5)" strokeWidth="3" />
        <line x1="175" y1="96" x2="175" y2="118" stroke="rgba(56,189,248,0.5)" strokeWidth="3" />
      </svg>
    );
  }

  if (filename.includes('char_')) {
    return (
      <svg
        viewBox="0 0 120 120"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="charBg" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#121216" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="120" height="120" fill="url(#charBg)" />
        <circle cx="60" cy="43" r="17" fill="#1e1e24" stroke="#f59e0b" strokeWidth="2" />
        <path
          d="M28 106 C28 80 42 68 60 68 C78 68 92 80 92 106"
          fill="#1e1e24"
          stroke="#38bdf8"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (filename.includes('trophy_')) {
    return (
      <svg
        viewBox="0 0 120 120"
        aria-label={title}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="trophyBg" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#111114" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="120" height="120" fill="url(#trophyBg)" />
        <circle cx="60" cy="54" r="24" fill="#18181b" stroke="#fbbf24" strokeWidth="2.5" />
        <polygon
          points="60,38 64.5,48.5 76,49.5 67,57 69.8,68 60,62 50.2,68 53,57 44,49.5 55.5,48.5"
          fill="#fbbf24"
        />
        <rect x="44" y="86" width="32" height="8" rx="3" fill="#fbbf24" fillOpacity="0.85" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 130"
      aria-label={title}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="240" height="130" fill="#111114" />
      <circle cx="120" cy="65" r="28" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="2" />
      <circle cx="120" cy="65" r="14" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1.5" />
    </svg>
  );
};

export const HandDrawnFrame: React.FC<HandDrawnFrameProps> = ({
  assetPath,
  title,
  designerInstruction,
  dimensions,
  aspectRatio,
  className = '',
  heightClass = 'h-48',
  variant = 'editorial',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const normalizedKey = normalizeAssetKey(assetPath);
  const hasRealFile = AVAILABLE_SET.has(normalizedKey);
  const imgSrc = `./${normalizedKey}`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#121214] flex flex-col justify-between ${heightClass} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {hasRealFile && !imageFailed && (
        <img
          src={imgSrc}
          alt={title}
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth > 0) {
              setImageLoaded(true);
            } else {
              setImageFailed(true);
            }
          }}
          onError={() => setImageFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {(!hasRealFile || !imageLoaded) &&
        (variant === 'blueprint' ? (
          <div className="absolute inset-0 p-3.5 flex flex-col justify-between bg-gradient-to-br from-[#161619] via-[#111113] to-[#0a0a0c] text-left">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <PenTool className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-white tracking-tight truncate">
                  {title}
                </span>
              </div>
              <span className="font-mono text-[10px] text-amber-400/90 shrink-0 tabular-nums">
                {dimensions}
              </span>
            </div>

            <div className="my-auto py-1.5">
              <p className="text-[11px] text-[#86868b] leading-relaxed line-clamp-3">
                {designerInstruction}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#6e6e73] font-mono">
              <span>Optional · Ersatzgrafik aktiv</span>
              <span className="truncate max-w-[160px]">{normalizedKey.split('/').pop()}</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <EditorialVectorArtwork assetKey={normalizedKey} title={title} />
          </div>
        ))}
    </div>
  );
};
