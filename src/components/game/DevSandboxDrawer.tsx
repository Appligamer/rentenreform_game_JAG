import React from 'react';
import { Sliders } from 'lucide-react';

interface DevSandboxDrawerProps {
  extraCreditMrd: number;
  onExtraCreditChange: (val: number) => void;
  retirementShiftMonths: number;
  onRetirementShiftChange: (val: number) => void;
  forceHaltelinie: boolean;
  onToggleHaltelinie: () => void;
}

export const DevSandboxDrawer: React.FC<DevSandboxDrawerProps> = ({
  extraCreditMrd,
  onExtraCreditChange,
  retirementShiftMonths,
  onRetirementShiftChange,
  forceHaltelinie,
  onToggleHaltelinie,
}) => {
  return (
    <section className="p-6 rounded-2xl apple-glass border-amber-400/30 text-left space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Sliders className="w-4 h-4" />
          <span className="text-xs font-mono font-bold">
            Entwickler-Sandbox & Parameter-Steuerung
          </span>
        </div>
        <span className="text-xs font-mono text-amber-400">Dev aktiv</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex justify-between text-xs text-white mb-1.5">
            <span>Zusatzkredit Generationenkapital</span>
            <span className="font-mono text-amber-400 tabular-nums">+{extraCreditMrd} Mrd. €</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={extraCreditMrd}
            onChange={(e) => onExtraCreditChange(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-white mb-1.5">
            <span>Renteneintrittsalter Hebel</span>
            <span className="font-mono text-white tabular-nums">+{retirementShiftMonths} Mon.</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            step="6"
            value={retirementShiftMonths}
            onChange={(e) => onRetirementShiftChange(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-white mb-1.5">
            <span>Haltelinie 48 %</span>
            <span className="font-mono text-sky-400">{forceHaltelinie ? 'Aktiv' : 'Frei'}</span>
          </div>
          <button
            onClick={onToggleHaltelinie}
            className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white/10 text-white hover:bg-white/15 cursor-pointer"
          >
            {forceHaltelinie ? 'Haltelinie deaktivieren' : 'Haltelinie erzwingen'}
          </button>
        </div>
      </div>
    </section>
  );
};
