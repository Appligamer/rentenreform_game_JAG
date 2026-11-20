import React, { useState } from 'react';
import { PenTool } from 'lucide-react';

interface HandDrawnFrameProps {
  assetPath: string;
  title: string;
  designerInstruction: string;
  dimensions: string;
  aspectRatio?: string;
  className?: string;
  heightClass?: string;
}

export const HandDrawnFrame: React.FC<HandDrawnFrameProps> = ({
  assetPath,
  title,
  designerInstruction,
  dimensions,
  aspectRatio,
  className = '',
  heightClass = 'h-48',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const normalizedSrc = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#121214] flex flex-col justify-between ${heightClass} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!imageFailed && (
        <img
          src={normalizedSrc}
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

      {/* Blueprint-Wireframe-Skizze solange die Handzeichnung noch entsteht */}
      {!imageLoaded && (
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
            <span>Blueprint-Slot</span>
            <span className="truncate max-w-[140px]">{assetPath.split('/').pop()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
