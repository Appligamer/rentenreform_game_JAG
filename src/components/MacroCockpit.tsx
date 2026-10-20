import React from 'react';
import { MacroState, DecisionCard } from '../types';
import { HandDrawnFrame } from './HandDrawnFrame';
import { Sparkles, TrendingUp, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

interface MacroCockpitProps {
  macro: MacroState;
  cards: DecisionCard[];
  playedCardIds: string[];
  onPlayCard: (card: DecisionCard) => void;
  extraCreditMrd: number;
  onExtraCreditChange: (val: number) => void;
  retirementShiftMonths: number;
  onRetirementShiftChange: (val: number) => void;
  forceHaltelinie: boolean;
  onToggleHaltelinie: () => void;
  onNextYear: () => void;
  history: MacroState[];
}

export const MacroCockpit: React.FC<MacroCockpitProps> = ({
  macro,
  cards,
  playedCardIds,
  onPlayCard,
  extraCreditMrd,
  onExtraCreditChange,
  retirementShiftMonths,
  onRetirementShiftChange,
  forceHaltelinie,
  onToggleHaltelinie,
  onNextYear,
  history,
}) => {
  const dependencyRatio = Number(
    (macro.contributorsCount / macro.pensionersCount).toFixed(2)
  );

  return (
    <div className="space-y-8">
      {/* Top Hero & Scenario Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#86868b] mb-2 font-mono">
              <span>Bundeswettbewerb econo=me</span>
              <span>·</span>
              <span>Rentenpaket II Reform-Sandbox</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">Jahr {macro.year}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#f5f5f7] mb-3">
              Steuerungszentrale: Generationenvertrag im Wandel
            </h1>
            <p className="text-sm text-[#86868b] leading-relaxed max-w-2xl">
              Justiere die staatlichen Hebel der Rentenversicherung. Balanciere den
              demografischen Ruhestand der Babyboomer aus, ohne die junge Generation
              mit untragbaren Beitragssätzen zu überfordern.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNextYear}
              className="px-5 py-2.5 text-xs font-semibold bg-white text-black rounded-lg hover:bg-[#e5e5e7] transition-colors shadow-sm"
            >
              Runde abschließen & 1 Jahr vorrücken
            </button>
            <div className="text-xs text-[#86868b] flex items-center gap-2">
              <span>Bisher simuliert: {history.length} Jahre</span>
              <span>·</span>
              <span>Aktiver Rentenwert: {macro.currentPensionValue.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Hand-Drawn Artwork Slot for Berlin Skyline / Horizon */}
        <div className="lg:col-span-4">
          <HandDrawnFrame
            assetPath="assets/images/backgrounds/bg_berlin_future_skyline.png"
            title="Szenario: Berlin Zukunfts-Skyline"
            designerInstruction="Reichstagskuppel, Spree & moderne Solar-/Finanztürme. Stimmung reflektiert Rentenstabilität."
            dimensions="2560 × 1440 px (16:9)"
            heightClass="h-56 lg:h-full"
          />
        </div>
      </div>

      {/* 4 Macro Key Metrics (Apple-Bento, Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Beitragssatz */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#86868b] mb-3">
            <span>Beitragssatz (GRV)</span>
            {macro.contributionRate >= 22.0 ? (
              <span className="flex items-center gap-1 text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Kritisch</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Gedämpft</span>
              </span>
            )}
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              {macro.contributionRate.toFixed(1)} %
            </div>
            <p className="mt-2 text-xs text-[#86868b]">
              Start 2026: 18,6 % · Ohne Reformen drohen &gt; 22,3 % bis 2035.
            </p>
          </div>
        </div>

        {/* Metric 2: Generationenkapital */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#86868b] mb-3">
            <span>Generationenkapital</span>
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aktienfonds</span>
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-amber-400 font-mono tabular-nums">
              {macro.generationCapitalFund.toFixed(1)} Mrd. €
            </div>
            <p className="mt-2 text-xs text-[#86868b]">
              {macro.year >= 2035
                ? `Ausschüttung an GRV: ${macro.fundPayoutToGRV.toFixed(1)} Mrd. €/Jahr`
                : 'Aufbauphase mit Bundeskrediten bis ca. 2035 (Ziel: ~200 Mrd. €)'}
            </p>
          </div>
        </div>

        {/* Metric 3: Demografie & Altenquotient */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#86868b] mb-3">
            <span>Altenquotient</span>
            <span className="text-xs text-[#86868b] font-mono">
              {macro.contributorsCount.toFixed(1)}M / {macro.pensionersCount.toFixed(1)}M
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              {dependencyRatio} : 1
            </div>
            <p className="mt-2 text-xs text-[#86868b]">
              Beitragszahler je Rentner. Sinkt von 2,14 (1990er) in Richtung 1,5.
            </p>
          </div>
        </div>

        {/* Metric 4: Rentenniveau */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#86868b] mb-3">
            <span>Rentenniveau vor Steuern</span>
            <span className="flex items-center gap-1 text-sky-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Haltelinie</span>
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-sky-400 font-mono tabular-nums">
              {macro.pensionLevel.toFixed(1)} %
            </div>
            <p className="mt-2 text-xs text-[#86868b]">
              Rentenpaket II garantiert mindestens 48,0 % bis mindestens 2039.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Reform Sliders & Controls */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-white/10">
        <h3 className="text-sm font-bold tracking-wide uppercase text-white mb-4">
          Staatliche Stellschrauben & Reformoptionen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Control A: Generationenkapital Hebel */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-white font-medium">Zusatz-Kredit Generationenkapital</span>
              <span className="font-mono text-amber-400">+{extraCreditMrd} Mrd. €</span>
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
            <p className="text-[11px] text-[#86868b] mt-1">
              Erhöht das Fondsvolumen und die spätere Beitragsentlastung.
            </p>
          </div>

          {/* Control B: Renteneintrittsalter */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-white font-medium">Renteneintrittsalter anpassen</span>
              <span className="font-mono text-white">
                +{retirementShiftMonths} Monate ({67 + retirementShiftMonths / 12} J.)
              </span>
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
            <p className="text-[11px] text-[#86868b] mt-1">
              Kopplung an Lebenserwartung erhöht Zahler und senkt Rentenjahre.
            </p>
          </div>

          {/* Control C: Haltelinie Toggle */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-white font-medium">Gesetzliche Haltelinie 48%</span>
              <span
                className={`font-semibold ${
                  forceHaltelinie ? 'text-sky-400' : 'text-[#86868b]'
                }`}
              >
                {forceHaltelinie ? 'Aktiv (Rentenpaket II)' : 'Aufgehoben'}
              </span>
            </div>
            <button
              onClick={onToggleHaltelinie}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                forceHaltelinie
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20'
                  : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
              }`}
            >
              {forceHaltelinie ? 'Haltelinie 48% aktiv' : 'Haltelinie deaktivieren'}
            </button>
            <p className="text-[11px] text-[#86868b] mt-1">
              Ohne Haltelinie sinkt das Niveau ab 2040 zur Beitragsbegrenzung.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Cards Deck with Hand-Drawn Frame placeholders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Ausspielbare Reform- & Ereigniskarten
            </h2>
            <p className="text-xs text-[#86868b]">
              Klicke auf eine Karte, um sie in der aktuellen Runde anzuwenden.
            </p>
          </div>
          <span className="text-xs text-[#86868b] font-mono">
            {playedCardIds.length} von {cards.length} aktiv
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const isPlayed = playedCardIds.includes(card.id);
            return (
              <div
                key={card.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden bg-[#161617] ${
                  isPlayed
                    ? 'border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Hand-Drawn Card Artwork Slot */}
                <HandDrawnFrame
                  assetPath={card.artworkAssetPath}
                  title={card.title}
                  designerInstruction={card.designerNotes}
                  dimensions={card.dimensions}
                  heightClass="h-44"
                />

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {card.title}
                      </h3>
                      {isPlayed && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          Aktiv
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-400/90 font-medium mb-2">
                      {card.subtitle}
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed line-clamp-3 mb-4">
                      {card.description}
                    </p>
                  </div>

                  <button
                    disabled={isPlayed}
                    onClick={() => onPlayCard(card)}
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors ${
                      isPlayed
                        ? 'bg-white/5 text-[#6e6e73] cursor-not-allowed border border-white/5'
                        : 'bg-white text-black hover:bg-[#e5e5e7]'
                    }`}
                  >
                    {isPlayed ? 'Bereits ausgespielt' : 'Karte anwenden'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Trend Table */}
      {history.length > 1 && (
        <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Simulations-Verlauf (2026 bis {macro.year})
            </h3>
          </div>

          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead>
              <tr className="border-b border-white/10 text-[#86868b]">
                <th className="py-2">Jahr</th>
                <th className="py-2">Beitragssatz</th>
                <th className="py-2">Generationenkapital</th>
                <th className="py-2">Altenquotient</th>
                <th className="py-2">Rentenniveau</th>
                <th className="py-2">Bundeszuschuss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#f5f5f7]">
              {history.map((row) => (
                <tr key={row.year} className="hover:bg-white/5">
                  <td className="py-2 font-bold text-white">{row.year}</td>
                  <td
                    className={`py-2 ${
                      row.contributionRate >= 22.0
                        ? 'text-red-400 font-semibold'
                        : 'text-white'
                    }`}
                  >
                    {row.contributionRate.toFixed(1)} %
                  </td>
                  <td className="py-2 text-amber-400">
                    {row.generationCapitalFund.toFixed(1)} Mrd. €
                  </td>
                  <td className="py-2">
                    {(row.contributorsCount / row.pensionersCount).toFixed(2)} : 1
                  </td>
                  <td className="py-2 text-sky-400">{row.pensionLevel.toFixed(1)} %</td>
                  <td className="py-2 text-[#86868b]">{row.federalSubsidy.toFixed(1)} Mrd. €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
