import React from 'react';
import { DifficultyLevel, GameMetrics, MacroState, TurnFeedback } from '../../types';
import { getDifficultyConfig } from '../../simulation/difficultyConfig';
import { Flame, RotateCcw, Zap } from 'lucide-react';

interface CampaignHudProps {
  macro: MacroState;
  metrics: GameMetrics;
  difficulty: DifficultyLevel;
  onDifficultyChange: (diff: DifficultyLevel) => void;
  onRestartGame: () => void;
  lastFeedback: TurnFeedback | null;
}

export const CampaignHud: React.FC<CampaignHudProps> = ({
  macro,
  metrics,
  difficulty,
  onDifficultyChange,
  onRestartGame,
  lastFeedback,
}) => {
  const cfg = getDifficultyConfig(difficulty);

  const getPhaseName = (year: number) => {
    if (year <= 2028) return 'Phase 1 · Das Reform-Zeitfenster';
    if (year <= 2034) return 'Phase 2 · Die Boomer-Ruhestandswelle';
    if (year <= 2039) return 'Phase 3 · Demografie-Peak & Kapitalmarkt';
    return 'Phase 4 · Ziellinie & Generationengerechtigkeit';
  };

  const isCritical =
    metrics.youthSatisfaction < 25 ||
    metrics.retireeSatisfaction < 25 ||
    metrics.reserveMonths < 0.35 ||
    macro.contributionRate > cfg.maxContributionRate - 0.45;

  const dependencyRatio = (macro.contributorsCount / macro.pensionersCount).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl apple-glass flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Linke Seite: Jahr, Phase & Schwellenwerte */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#86868b]">
            <span className="font-bold text-amber-400 tabular-nums">
              Jahr {macro.year} / 2045
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-semibold">{getPhaseName(macro.year)}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Altenquotient {dependencyRatio} : 1</span>
          </div>
          <p className="text-xs text-[#86868b] tabular-nums">
            Zielkorridor ({cfg.label}): Beitrag max. {cfg.maxContributionRate.toFixed(1)} % ·
            Rentenniveau min. {cfg.minPensionLevel.toFixed(1)} % · Rücklage &gt; 0,0 Mon.
          </p>
          {lastFeedback && (
            <p
              className={`text-xs ${
                lastFeedback.severity === 'warning'
                  ? 'text-amber-300'
                  : lastFeedback.severity === 'positive'
                  ? 'text-emerald-300'
                  : 'text-[#a1a1a6]'
              }`}
            >
              {lastFeedback.headline}
              {lastFeedback.marketNote ? ` — ${lastFeedback.marketNote}` : ''}
            </p>
          )}
        </div>

        {/* Rechte Seite: Politisches Kapital, Schwierigkeitsgrad & Neustart */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-left font-mono text-xs">
              <span className="text-[#86868b] block text-[10px]">Politisches Kapital</span>
              <span
                className={`font-bold tabular-nums ${
                  metrics.politicalCapital < 20 ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                {metrics.politicalCapital} / 100
              </span>
            </div>
          </div>

          <div
            role="group"
            aria-label="Schwierigkeitsgrad"
            className="flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-white/10 text-xs"
          >
            {(['normal', 'hard', 'hardcore'] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficulty === d
                    ? 'bg-amber-400 text-black'
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                {d === 'normal' ? 'Normal' : d === 'hard' ? 'Schwer' : 'Hardcore'}
              </button>
            ))}
          </div>

          <button
            onClick={onRestartGame}
            title="Kampagne neu starten"
            aria-label="Kampagne neu starten"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#86868b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isCritical && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 font-medium">
            <Flame className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              Kritische Systemspannung: Ein Vitalwert oder Grenzwert steht kurz vor dem Abbruch.
              Nutze gezielt Reformkarten oder entlastende Entscheidungen.
            </span>
          </div>
          <span className="font-mono text-[11px] text-red-400 shrink-0 font-bold">
            Warnung
          </span>
        </div>
      )}
    </div>
  );
};
