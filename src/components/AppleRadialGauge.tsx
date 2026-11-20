import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface AppleRadialGaugeProps {
  value: number; // 0 - 100
  label: string;
  subtext: string;
  footerLabel: string;
  icon: React.ReactNode;
  colorScheme: 'gold' | 'rose' | 'sky' | 'emerald';
  unit?: string;
  statusLevel?: 'nominal' | 'elevated' | 'critical';
}

export const AppleRadialGauge: React.FC<AppleRadialGaugeProps> = ({
  value,
  label,
  subtext,
  footerLabel,
  icon,
  colorScheme,
  unit = '%',
  statusLevel = 'nominal',
}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const colorStyles = {
    gold: {
      stroke: '#f59e0b',
      text: 'text-amber-400',
      bgRing: 'stroke-amber-400/15',
    },
    rose: {
      stroke: '#f43f5e',
      text: 'text-rose-400',
      bgRing: 'stroke-rose-400/15',
    },
    sky: {
      stroke: '#38bdf8',
      text: 'text-sky-400',
      bgRing: 'stroke-sky-400/15',
    },
    emerald: {
      stroke: '#10b981',
      text: 'text-emerald-400',
      bgRing: 'stroke-emerald-400/15',
    },
  }[colorScheme];

  const statusText =
    statusLevel === 'critical'
      ? 'Kritisch'
      : statusLevel === 'elevated'
      ? 'Angespannt'
      : 'Stabil';

  const statusColor =
    statusLevel === 'critical'
      ? 'text-red-400'
      : statusLevel === 'elevated'
      ? 'text-amber-400'
      : 'text-emerald-400';

  return (
    <div
      className={`relative p-5 rounded-2xl apple-glass-card transition-colors duration-200 flex flex-col justify-between overflow-hidden ${
        statusLevel === 'critical' ? 'border-red-500/45' : ''
      }`}
    >
      {/* Kopfzeile mit Titel und explizitem Zustandstext */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 shrink-0">
            {icon}
          </div>
          <span className="text-xs font-semibold text-[#f5f5f7] tracking-tight truncate">
            {label}
          </span>
        </div>

        <span className={`inline-flex items-center gap-1 text-[11px] font-medium shrink-0 ${statusColor}`}>
          {statusLevel === 'critical' && <AlertTriangle className="w-3 h-3" />}
          {statusLevel === 'elevated' && <Info className="w-3 h-3" />}
          {statusLevel === 'nominal' && <CheckCircle2 className="w-3 h-3" />}
          <span>{statusText}</span>
        </span>
      </div>

      {/* Radialanzeige & Kennzahl */}
      <div className="flex items-center gap-4 my-1">
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="transparent"
              strokeWidth="6"
              className={colorStyles.bgRing}
            />
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
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-lg font-bold font-mono tabular-nums tracking-tight ${colorStyles.text}`}>
              {Math.round(clampedValue)}
            </span>
            <span className="text-[10px] font-mono text-[#86868b] -mt-1">{unit}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center text-left space-y-1 min-w-0">
          <div className="text-xs font-medium text-[#f5f5f7] leading-snug tabular-nums">
            {subtext}
          </div>
          <div className="text-[11px] font-mono text-[#86868b] tabular-nums">
            {footerLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
