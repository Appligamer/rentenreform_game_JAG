import React from 'react';

interface AppleRadialGaugeProps {
  value: number; // 0 - 100
  label: string;
  subtext: string;
  icon: React.ReactNode;
  colorScheme: 'gold' | 'rose' | 'sky' | 'emerald';
  unit?: string;
  isWarning?: boolean;
}

export const AppleRadialGauge: React.FC<AppleRadialGaugeProps> = ({
  value,
  label,
  subtext,
  icon,
  colorScheme,
  unit = '%',
  isWarning = false,
}) => {
  // SVG Circle Math (Radius = 36 -> Circumference = 2 * PI * 36 ≈ 226.2)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  const colorStyles = {
    gold: {
      stroke: '#f59e0b',
      text: 'text-amber-400',
      glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      bgRing: 'stroke-amber-400/10',
    },
    rose: {
      stroke: '#f43f5e',
      text: 'text-rose-400',
      glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      bgRing: 'stroke-rose-400/10',
    },
    sky: {
      stroke: '#38bdf8',
      text: 'text-sky-400',
      glow: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]',
      bgRing: 'stroke-sky-400/10',
    },
    emerald: {
      stroke: '#10b981',
      text: 'text-emerald-400',
      glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      bgRing: 'stroke-emerald-400/10',
    },
  }[colorScheme];

  return (
    <div
      className={`relative p-5 rounded-3xl apple-glass-card transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isWarning ? 'border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.2)]' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 text-white/80">
            {icon}
          </div>
          <span className="text-xs font-semibold text-[#f5f5f7] tracking-tight">
            {label}
          </span>
        </div>
        {isWarning && (
          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
            ALARM
          </span>
        )}
      </div>

      {/* Center Radial Arc & Readout */}
      <div className="flex items-center justify-center gap-4 my-2 z-10">
        {/* SVG Arc Gauge */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
            {/* Background Track */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="transparent"
              strokeWidth="6"
              className={colorStyles.bgRing}
            />
            {/* Active Glow Arc */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="transparent"
              stroke={colorStyles.stroke}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-700 ease-out ${colorStyles.glow}`}
            />
          </svg>

          {/* Central Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-xl font-extrabold font-mono tabular-nums tracking-tighter ${colorStyles.text}`}>
              {Math.round(value)}
            </span>
            <span className="text-[9px] font-mono text-[#86868b] -mt-1">{unit}</span>
          </div>
        </div>

        {/* Telemetry Details */}
        <div className="flex flex-col justify-center text-left space-y-1">
          <span className="text-[10px] font-mono text-[#86868b] uppercase tracking-widest">
            Telemetry
          </span>
          <div className="text-xs font-medium text-[#f5f5f7] leading-snug">
            {subtext}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#86868b]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-ping" />
            <span>Active Feed</span>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Line */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#86868b] z-10">
        <span>Toleranz: Min. 25%</span>
        <span className="text-white/40">HUD v4.2</span>
      </div>

      {/* Ambient background reflection */}
      <div
        className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: colorStyles.stroke }}
      />
    </div>
  );
};
