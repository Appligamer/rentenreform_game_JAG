import React, { useState } from 'react';
import { PenTool, Image as ImageIcon } from 'lucide-react';

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
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#121214] flex flex-col justify-between ${heightClass} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!imageFailed ? (
        <img
          src={assetPath}
          alt={title}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}

      {/* Blueprint Fallback & Hand-Drawn Spec View */}
      {imageFailed && (
        <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-br from-[#161619] via-[#111113] to-[#0a0a0c] text-left">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-white tracking-tight">
                {title}
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-400/90 tracking-wider">
              {dimensions}
            </span>
          </div>

          {/* Blueprint Wireframe Center */}
          <div className="my-auto py-2">
            <p className="text-[11px] text-[#86868b] leading-relaxed line-clamp-3">
              {designerInstruction}
            </p>
          </div>

          {/* Bottom Status Marker */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#6e6e73]">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3 text-white/40" />
              <span>Handzeichnung ausstehend</span>
            </span>
            <span className="font-mono text-[9px] text-white/40 truncate max-w-[150px]">
              {assetPath.split('/').pop()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
