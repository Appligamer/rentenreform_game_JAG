import React from 'react';
import { AnnualDilemma, DilemmaOption } from '../../types';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface DilemmaPanelProps {
  year: number;
  dilemma?: AnnualDilemma;
  politicalCapital: number;
  onSelectOption: (option?: DilemmaOption) => void;
}

function formatConsequenceTags(opt: DilemmaOption): string[] {
  const c = opt.consequences;
  const tags: string[] = [];
  if (c.contributionRateDelta) {
    tags.push(`Beitrag ${c.contributionRateDelta > 0 ? '+' : ''}${c.contributionRateDelta.toFixed(2)} %`);
  }
  if (c.pensionLevelDelta) {
    tags.push(`Niveau ${c.pensionLevelDelta > 0 ? '+' : ''}${c.pensionLevelDelta.toFixed(1)} %`);
  }
  if (c.generationCapitalDeltaMrd) {
    tags.push(`Fonds ${c.generationCapitalDeltaMrd > 0 ? '+' : ''}${c.generationCapitalDeltaMrd} Mrd. €`);
  }
  if (c.youthDelta) {
    tags.push(`Jugend ${c.youthDelta > 0 ? '+' : ''}${c.youthDelta}`);
  }
  if (c.retireeDelta) {
    tags.push(`Senioren ${c.retireeDelta > 0 ? '+' : ''}${c.retireeDelta}`);
  }
  if (c.reserveDeltaMonths) {
    tags.push(`Rücklage ${c.reserveDeltaMonths > 0 ? '+' : ''}${c.reserveDeltaMonths.toFixed(2)} M.`);
  }
  return tags;
}

export const DilemmaPanel: React.FC<DilemmaPanelProps> = ({
  year,
  dilemma,
  politicalCapital,
  onSelectOption,
}) => {
  if (!dilemma) {
    return (
      <div className="p-6 rounded-2xl apple-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Haushaltsjahr {year}</h2>
          <p className="text-xs text-[#86868b] mt-1">
            Führe die laufende Finanzplanung ins nächste Jahr fort.
          </p>
        </div>
        <button
          onClick={() => onSelectOption(undefined)}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-amber-400 text-black hover:bg-amber-300 transition-colors flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
        >
          <span>Jahr {year + 1} beginnen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <section className="p-6 rounded-2xl apple-glass border-amber-400/30 space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {dilemma.isMilestone ? `Schlüsselentscheidung ${year}` : `Jahresdilemma ${year}`}
          </span>
        </div>
        <span className="text-xs text-[#86868b] font-mono whitespace-nowrap">
          1 Option beschließen
        </span>
      </div>

      <div className="space-y-2.5">
        <h2 className="text-xl font-bold text-white tracking-tight text-balance">
          {dilemma.title}
        </h2>
        <p className="text-sm text-[#a1a1a6] leading-relaxed max-w-3xl">
          {dilemma.context}
        </p>
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 text-xs text-[#86868b]">
          <strong className="text-white">Ökonomischer Hintergrund: </strong>
          {dilemma.historicalContext}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {dilemma.options.map((opt) => {
          const cost = opt.consequences.capitalCost ?? 0;
          const canAfford = politicalCapital >= cost;
          const impactTags = formatConsequenceTags(opt);

          return (
            <button
              key={opt.id}
              disabled={!canAfford}
              onClick={() => onSelectOption(opt)}
              className={`p-5 rounded-xl apple-glass-card border transition-all text-left flex flex-col justify-between group ${
                canAfford
                  ? 'border-white/10 hover:border-amber-400/70 cursor-pointer'
                  : 'border-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {opt.label}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-semibold shrink-0 tabular-nums ${
                      cost === 0
                        ? 'text-emerald-400'
                        : canAfford
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {cost === 0 ? '0 Kapital' : `-${cost} Kapital`}
                  </span>
                </div>

                <p className="text-xs text-[#86868b] leading-relaxed">{opt.summary}</p>

                {impactTags.length > 0 && (
                  <p className="text-[11px] font-mono text-[#a1a1a6] tabular-nums pt-1">
                    {impactTags.join(' · ')}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className={canAfford ? 'text-amber-400 font-medium' : 'text-red-400'}>
                  {canAfford ? 'Beschließen' : 'Zu wenig Kapital'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
