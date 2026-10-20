import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentTab: 'cockpit' | 'citizen' | 'briefing' | 'export';
  onSelectTab: (tab: 'cockpit' | 'citizen' | 'briefing' | 'export') => void;
  currentYear: number;
  onNextYear: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentYear,
  onNextYear,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-8 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('cockpit')}
          className="text-base font-bold tracking-tight text-[#f5f5f7] hover:text-white transition-colors whitespace-nowrap"
        >
          Generation Zukunft
        </button>
        <span className="hidden sm:inline text-xs text-[#86868b]">·</span>
        <span className="hidden sm:inline text-xs text-amber-400 font-medium tracking-wide">
          econo=me Rente
        </span>
      </div>

      {/* Zone 2: 4 single-line text navigation links */}
      <nav className="flex items-center gap-6 text-sm font-medium text-[#86868b]">
        <button
          onClick={() => onSelectTab('cockpit')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'cockpit'
              ? 'text-white border-b-2 border-amber-400'
              : ''
          }`}
        >
          Reform-Cockpit
        </button>
        <button
          onClick={() => onSelectTab('citizen')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'citizen'
              ? 'text-white border-b-2 border-amber-400'
              : ''
          }`}
        >
          Bürger-Lebenslauf
        </button>
        <button
          onClick={() => onSelectTab('briefing')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'briefing'
              ? 'text-white border-b-2 border-amber-400'
              : ''
          }`}
        >
          Grafik-Briefing
        </button>
        <button
          onClick={() => onSelectTab('export')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'export'
              ? 'text-white border-b-2 border-amber-400'
              : ''
          }`}
        >
          Xcode & Multiplattform
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onReset}
          title="Simulation auf 2026 zurücksetzen"
          className="p-2 text-[#86868b] hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onNextYear}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Jahr {currentYear + 1} simulieren</span>
        </button>
      </div>
    </header>
  );
};
