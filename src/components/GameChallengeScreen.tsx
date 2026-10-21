import React from 'react';
import {
  MacroState,
  GameStatus,
  GameOverReason,
  GameMetrics,
  AnnualDilemma,
  DilemmaOption,
  DecisionCard,
  DifficultyLevel,
} from '../types';
import { HandDrawnFrame } from './HandDrawnFrame';
import { AppleRadialGauge } from './AppleRadialGauge';
import { soundEngine } from '../utils/soundEffects';
import {
  Heart,
  AlertTriangle,
  Trophy,
  Skull,
  Coins,
  Shield,
  Zap,
  ArrowRight,
  RotateCcw,
  Sliders,
  Flame,
  Radio,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GameChallengeScreenProps {
  macro: MacroState;
  metrics: GameMetrics;
  gameStatus: GameStatus;
  gameOverReason: GameOverReason;
  currentDilemma?: AnnualDilemma;
  onSelectDilemmaOption: (option: DilemmaOption) => void;
  cards: DecisionCard[];
  playedCardIds: string[];
  onPlayCard: (card: DecisionCard) => void;
  onAdvanceYear: () => void;
  onRestartGame: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (diff: DifficultyLevel) => void;
  // Dev sandbox features (only rendered if devMode is true)
  devMode: boolean;
  extraCreditMrd: number;
  onExtraCreditChange: (val: number) => void;
  retirementShiftMonths: number;
  onRetirementShiftChange: (val: number) => void;
  forceHaltelinie: boolean;
  onToggleHaltelinie: () => void;
}

export const GameChallengeScreen: React.FC<GameChallengeScreenProps> = ({
  macro,
  metrics,
  gameStatus,
  gameOverReason,
  currentDilemma,
  onSelectDilemmaOption,
  cards,
  playedCardIds,
  onPlayCard,
  onAdvanceYear,
  onRestartGame,
  difficulty,
  onDifficultyChange,
  devMode,
  extraCreditMrd,
  onExtraCreditChange,
  retirementShiftMonths,
  onRetirementShiftChange,
  forceHaltelinie,
  onToggleHaltelinie,
}) => {
  // Kampagnen-Phasen
  const getPhaseName = (year: number) => {
    if (year <= 2028) return 'Phase 1 · Das Reform-Zeitfenster';
    if (year <= 2034) return 'Phase 2 · Die Boomer-Ruhestandswelle';
    if (year <= 2038) return 'Phase 3 · Demografie-Peak & Kapitalmarkt';
    return 'Phase 4 · Ziellinie & Generationengerechtigkeit';
  };

  const isCritical =
    metrics.youthSatisfaction < 25 ||
    metrics.retireeSatisfaction < 25 ||
    metrics.reserveMonths < 0.4 ||
    macro.contributionRate > 21.6;

  const reservePercent = Math.min(100, (metrics.reserveMonths / 2.0) * 100);
  const fundPercent = Math.min(100, (macro.generationCapitalFund / 200.0) * 100);

  return (
    <div className="space-y-6">
      {/* GAME OVER MODAL MIT DIDAKTISCHER POST-MORTEM-ANALYSE */}
      {gameStatus === 'game_over' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="w-full max-w-xl p-8 rounded-3xl apple-glass border-red-500/50 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Skull className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
                Simulation Gescheitert · Jahr {macro.year} ({difficulty.toUpperCase()})
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {gameOverReason === 'youth_revolt' && 'Generalstreik & Abwanderung der Jugend!'}
                {gameOverReason === 'pensioner_poverty' && 'Massenproteste: Altersarmut!'}
                {gameOverReason === 'state_insolvency' && 'Zahlungsunfähigkeit der Rentenkasse!'}
              </h2>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed">
              {gameOverReason === 'youth_revolt' &&
                `Der Beitragssatz ist auf ${macro.contributionRate.toFixed(1)}% explodiert. Die junge Generation sieht ihre Zukunft geraubt. Sinkende Reallöhne und Streiks haben das Rentensystem lahmgelegt.`}
              {gameOverReason === 'pensioner_poverty' &&
                `Das gesetzliche Rentenniveau ist auf ${macro.pensionLevel.toFixed(1)}% eingebrochen. Millionen Senioren rutschen unter die Armutsgrenze. Die Haltelinie wurde durchbrochen.`}
              {gameOverReason === 'state_insolvency' &&
                'Die Nachhaltigkeitsrücklage ist auf 0 Monate geschmolzen. Die Bundesregierung musste die Notbremse ziehen, weil die Rentenkasse laufende Renten nicht mehr auszahlen konnte.'}
            </p>

            {/* Post-Mortem Audit */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 text-xs text-left font-mono space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>econo=me Post-Mortem Fehleranalyse:</span>
              </div>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                {gameOverReason === 'youth_revolt' &&
                  'Fehler: Du hast das Umlageverfahren nicht rechtzeitig durch das Generationenkapital oder flexible Arbeitsanreize abgefedert. Ohne Kapitalerträge mussten die Beitragszahler die vollen Kosten der 1,35 Mio. Boomer-Rentner tragen.'}
                {gameOverReason === 'pensioner_poverty' &&
                  'Fehler: Du hast die Haltelinie bei 48% vernachlässigt oder Rentenkürzungen beschlossen, um Beiträge künstlich niedrig zu halten. Das verletzt das Rentenpaket-II-Kriterium der Generationengerechtigkeit.'}
                {gameOverReason === 'state_insolvency' &&
                  'Fehler: Du hast zu hohe Steuerzuschüsse ohne solide Gegenfinanzierung beschlossen. Die Nachhaltigkeitsrücklage wurde als Notfallpolster komplett aufgezehrt.'}
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] text-[#6e6e73]">
                Tipp für den nächsten Durchgang: Baue das Generationenkapital vor 2035 konsequent auf, um die 10 Mrd. € Entlastung freizuschalten, und nutze die Aktivrente für Senioren.
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onRestartGame();
              }}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Neuer Versuch: Kampagne 2026 neu starten</span>
            </button>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {gameStatus === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="w-full max-w-xl p-8 rounded-3xl apple-glass border-amber-400/50 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                Bundeswettbewerb econo=me Gewonnen! ({difficulty.toUpperCase()})
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                Generationenvertrag Historisch Gerettet!
              </h2>
              <p className="text-xs text-[#86868b] mt-1">
                Du hast Deutschland erfolgreich durch den gefährlichsten demografischen Flaschenhals der Geschichte manövriert.
              </p>
            </div>

            {/* Hand-Drawn Trophy Slot */}
            <div className="w-28 h-28 mx-auto">
              <HandDrawnFrame
                assetPath="assets/images/awards/trophy_generation_justice.png"
                title="Goldene econo=me Urkunde"
                designerInstruction="Goldmedaille mit zwei ineinandergreifenden Händen."
                dimensions="512 × 512 px"
                heightClass="h-28 w-28"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
              <div>
                <div className="text-[#86868b] text-[10px]">End-Beitrag</div>
                <div className="text-emerald-400 text-sm font-bold">{macro.contributionRate.toFixed(1)} %</div>
              </div>
              <div>
                <div className="text-[#86868b] text-[10px]">Staatsfonds</div>
                <div className="text-amber-400 text-sm font-bold">{macro.generationCapitalFund.toFixed(0)} Mrd. €</div>
              </div>
              <div>
                <div className="text-[#86868b] text-[10px]">Jugend</div>
                <div className="text-white text-sm font-bold">{metrics.youthSatisfaction} %</div>
              </div>
              <div>
                <div className="text-[#86868b] text-[10px]">Highscore</div>
                <div className="text-amber-400 text-sm font-bold">{metrics.score} Pkt.</div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onRestartGame();
              }}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Erneut antreten / Noch höheren Score erzielen</span>
            </button>
          </div>
        </div>
      )}

      {/* TOP COMMAND HUD: Apple VisionOS Glass Strip */}
      <div className="p-5 rounded-3xl apple-glass flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Phase & Orbit status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-xs font-bold shadow-inner">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>JAHR {macro.year} / 2045</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <span>{getPhaseName(macro.year)}</span>
              <span className="text-white/20">·</span>
              <span className="text-[10px] font-mono text-[#86868b]">econo=me Station</span>
            </div>
            <div className="text-[11px] text-[#86868b]">
              Haltelinie 48% sichern · Beitragssatz &lt;21,8% halten · Boomer-Ruhestand abfedern.
            </div>
          </div>
        </div>

        {/* Politisches Kapital & Schwierigkeitsgrad */}
        <div className="flex items-center gap-3">
          {/* Politisches Kapital Meter */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="text-left font-mono text-xs">
              <span className="text-[#86868b] block text-[9px] uppercase tracking-widest font-semibold">
                Politisches Kapital
              </span>
              <span className={`font-bold tabular-nums ${metrics.politicalCapital < 25 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                {metrics.politicalCapital} / 100 ⚡
              </span>
            </div>
          </div>

          {/* Difficulty Segmented Glass Control */}
          <div className="flex items-center gap-1 p-1 bg-black/60 rounded-2xl border border-white/10 text-xs">
            {(['normal', 'hard', 'hardcore'] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  difficulty === d
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                {d === 'normal' && 'Normal'}
                {d === 'hard' && 'Schwer'}
                {d === 'hardcore' && 'Hardcore 🔥'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KRITISCHER ALARMBANNER WENN IN GEFAHRENZONE */}
      {isCritical && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3 backdrop-blur-md animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <div className="flex items-center gap-2 font-medium">
            <Flame className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              KRITISCHE SYSTEMSPANNUNG: Ein Vitalwert steht kurz vor dem Abbruch! Triff entschlossene Gegenmaßnahmen.
            </span>
          </div>
          <span className="font-mono text-[10px] text-red-400 shrink-0 font-bold tracking-widest">
            GAME OVER GEFAHR
          </span>
        </div>
      )}

      {/* DIE 4 FUTURISTISCHEN TELEMETRIE-GAUGES (Apple visionOS Radial Dials) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vitalwert 1: Jugend & Erwerbstätige */}
        <AppleRadialGauge
          value={metrics.youthSatisfaction}
          label="Jugend & Erwerbstätige"
          subtext={`Beitrag: ${macro.contributionRate.toFixed(1)}% (Max 22.3%)`}
          icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
          colorScheme="gold"
          isWarning={metrics.youthSatisfaction < 25 || macro.contributionRate > 21.6}
        />

        {/* Vitalwert 2: Senioren & Rentner */}
        <AppleRadialGauge
          value={metrics.retireeSatisfaction}
          label="Senioren & Rentner"
          subtext={`Rentenniveau: ${macro.pensionLevel.toFixed(1)}% (Haltelinie 48%)`}
          icon={<Heart className="w-3.5 h-3.5 text-rose-400" />}
          colorScheme="rose"
          isWarning={metrics.retireeSatisfaction < 25 || macro.pensionLevel < 47.5}
        />

        {/* Vitalwert 3: Nachhaltigkeitsrücklage */}
        <AppleRadialGauge
          value={reservePercent}
          label="Nachhaltigkeitsreserve"
          subtext={`${metrics.reserveMonths.toFixed(1)} Monate Liquidität (Min 0.2)`}
          icon={<Shield className="w-3.5 h-3.5 text-sky-400" />}
          colorScheme="sky"
          isWarning={metrics.reserveMonths < 0.4}
        />

        {/* Vitalwert 4: Generationenkapital */}
        <AppleRadialGauge
          value={fundPercent}
          label="Generationenkapital"
          subtext={`${macro.generationCapitalFund.toFixed(0)} Mrd. € (Ziel: 200 Mrd. €)`}
          icon={<Coins className="w-3.5 h-3.5 text-emerald-400" />}
          colorScheme="emerald"
        />
      </div>

      {/* HAUPT-GAMEPLAY: DAS JÄHRLICHE POLITISCHE DILEMMA */}
      {currentDilemma ? (
        <div className="p-6 rounded-3xl apple-glass border-amber-400/40 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
                Entscheidung des Jahres {macro.year}
              </span>
            </div>
            <span className="text-[11px] text-[#86868b] font-mono">
              Wähle 1 Reformoption
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentDilemma.title}
            </h2>
            <p className="text-xs text-[#86868b] leading-relaxed mt-1">
              {currentDilemma.context}
            </p>
            <div className="mt-3 p-3 rounded-2xl bg-black/60 border border-white/5 text-[11px] text-[#86868b] font-mono">
              <strong className="text-white">econo=me Hintergrund: </strong>
              {currentDilemma.historicalContext}
            </div>
          </div>

          {/* Dilemma Option Buttons (Holographic Glass Tiles) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {currentDilemma.options.map((opt) => {
              const cost = opt.consequences.capitalCost ?? 0;
              const canAfford = metrics.politicalCapital >= cost;

              return (
                <button
                  key={opt.id}
                  disabled={!canAfford}
                  onClick={() => {
                    soundEngine.playCard();
                    onSelectDilemmaOption(opt);
                  }}
                  className={`p-5 rounded-2xl apple-glass-card border transition-all text-left flex flex-col justify-between group ${
                    canAfford
                      ? 'border-white/10 hover:border-amber-400/80 hover:scale-[1.01] cursor-pointer'
                      : 'border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {opt.label}
                      </div>
                      {cost > 0 && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${canAfford ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          ⚡ {cost}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#86868b] leading-relaxed">
                      {opt.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className={canAfford ? 'text-amber-400/90 font-medium' : 'text-red-400'}>
                      {canAfford ? 'Beschließen' : 'Zu wenig Kapital!'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Kein aktives Dilemma in diesem Zwischenjahr -> Jahr simulieren */
        <div className="p-6 rounded-3xl apple-glass border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white">Laufendes Haushaltsjahr {macro.year}</h3>
            <p className="text-xs text-[#86868b] mt-0.5">
              Kein akutes Reform-Dilemma in dieser Runde. Die beschlossenen Maßnahmen greifen.
            </p>
          </div>
          <button
            onClick={() => {
              soundEngine.playYearTick();
              onAdvanceYear();
            }}
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-300 transition-all flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
          >
            <span>Jahr {macro.year + 1} beginnen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STRATEGISCHE REFORMKARTEN (Sondermaßnahmen) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Strategische Sonder-Reformkarten</span>
            </h3>
            <p className="text-xs text-[#86868b]">
              Kostet Politisches Kapital ⚡. Nutze sie weise, um drohende Kipppunkte zu verhindern.
            </p>
          </div>
          <span className="text-xs text-[#86868b] font-mono">
            {playedCardIds.length}/{cards.length} aktiv
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.slice(0, 3).map((card) => {
            const isPlayed = playedCardIds.includes(card.id);
            const canAfford = metrics.politicalCapital >= card.politicalCapitalCost;

            return (
              <div
                key={card.id}
                className={`p-5 rounded-3xl apple-glass-card border transition-all flex flex-col justify-between ${
                  isPlayed
                    ? 'border-amber-400/60 bg-amber-400/5'
                    : canAfford
                    ? 'border-white/10 hover:border-white/20'
                    : 'border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{card.title}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      ⚡ {card.politicalCapitalCost}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-medium mb-2">{card.subtitle}</div>
                  <p className="text-[11px] text-[#86868b] line-clamp-2">{card.description}</p>
                </div>

                <button
                  disabled={isPlayed || !canAfford}
                  onClick={() => {
                    soundEngine.playCard();
                    onPlayCard(card);
                  }}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isPlayed
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : canAfford
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-md'
                      : 'bg-white/5 text-red-400/60 cursor-not-allowed'
                  }`}
                >
                  {isPlayed
                    ? 'Bereits im Gesetzblatt'
                    : canAfford
                    ? `Aktivieren (⚡ ${card.politicalCapitalCost})`
                    : `Zu wenig Kapital (⚡ ${card.politicalCapitalCost})`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERSTECKTE ENTWICKLER-SCHUBLADE (NUR WENN DEV MODE AKTIV!) */}
      {devMode && (
        <div className="p-6 rounded-3xl apple-glass border-amber-400/40 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sliders className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Geheimes Entwickler-Cockpit & Sandbox-Tools
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-bold">
              DEV MODE AKTIV
            </span>
          </div>

          <p className="text-xs text-[#86868b]">
            Dieses Panel ist für normale Spieler unsichtbar. Hier können Test-Werte direkt
            manipuliert und Simulationseffekte getestet werden.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="flex justify-between text-xs text-white mb-1">
                <span>Zusatzkredit Generationenkapital</span>
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
            </div>

            <div>
              <div className="flex justify-between text-xs text-white mb-1">
                <span>Renteneintrittsalter Hebel</span>
                <span className="font-mono text-white">+{retirementShiftMonths} Mon.</span>
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
              <div className="flex justify-between text-xs text-white mb-1">
                <span>Haltelinie 48% Toggle</span>
                <span className="font-mono text-sky-400">{forceHaltelinie ? 'Aktiv' : 'Frei'}</span>
              </div>
              <button
                onClick={onToggleHaltelinie}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                {forceHaltelinie ? 'Haltelinie deaktivieren' : 'Haltelinie erzwingen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
