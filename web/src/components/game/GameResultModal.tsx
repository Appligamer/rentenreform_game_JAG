import React from 'react';
import {
  DifficultyLevel,
  GameMetrics,
  GameOverReason,
  GameStatus,
  MacroState,
} from '../../types';
import { calculateAwardTier } from '../../simulation/gameBalanceEngine';
import { HandDrawnFrame } from '../HandDrawnFrame';
import { AlertTriangle, RotateCcw, Skull, Trophy } from 'lucide-react';

interface GameResultModalProps {
  gameStatus: GameStatus;
  gameOverReason: GameOverReason;
  macro: MacroState;
  metrics: GameMetrics;
  difficulty: DifficultyLevel;
  onRestartGame: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  gameStatus,
  gameOverReason,
  macro,
  metrics,
  difficulty,
  onRestartGame,
}) => {
  if (gameStatus === 'playing') return null;

  if (gameStatus === 'game_over') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
        <div className="w-full max-w-xl p-8 rounded-2xl apple-glass border-red-500/40 text-center shadow-2xl space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Skull className="w-7 h-7" />
          </div>

          <div>
            <div className="text-xs font-mono font-semibold text-red-400">
              Simulation gescheitert · Jahr {macro.year} · Modus {difficulty}
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1 text-balance">
              {gameOverReason === 'youth_revolt' && 'Generalstreik & Abwanderung der Jugend'}
              {gameOverReason === 'pensioner_poverty' && 'Massenproteste wegen Altersarmut'}
              {gameOverReason === 'state_insolvency' && 'Zahlungsunfähigkeit der Rentenkasse'}
            </h2>
          </div>

          <p className="text-xs text-[#a1a1a6] leading-relaxed">
            {gameOverReason === 'youth_revolt' &&
              `Der Beitragssatz erreichte ${macro.contributionRate.toFixed(2)} % oder die Jugendzufriedenheit brach ein. Die Abgabenlast überstieg die Belastungsgrenze der Erwerbstätigen.`}
            {gameOverReason === 'pensioner_poverty' &&
              `Das gesetzliche Rentenniveau fiel auf ${macro.pensionLevel.toFixed(1)} % oder das Vertrauen der Senioren kollabierte.`}
            {gameOverReason === 'state_insolvency' &&
              'Die Nachhaltigkeitsrücklage fiel auf 0 Monate. Laufende Rentenzahlungen waren ohne Notkredite nicht mehr gedeckt.'}
          </p>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs text-left space-y-2">
            <div className="text-amber-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>econo=me Post-Mortem Analyse</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              {gameOverReason === 'youth_revolt' &&
                'Ohne rechtzeitige Dämpfung durch das Generationenkapital, Fachkräfte-Zuwanderung oder eine angepasste Lebensarbeitszeit steigt die Beitragslast zwischen 2033 und 2039 ungebremst.'}
              {gameOverReason === 'pensioner_poverty' &&
                'Zu starke Rentenkürzungen ohne ausgleichende Maßnahmen (Haltelinie 48 %, bAV-Pflichtzuschuss) verletzen die Verlässlichkeit des Generationenvertrags.'}
              {gameOverReason === 'state_insolvency' &&
                'Zu viele reine Steuerzuschuss-Versprechen ohne Gegenfinanzierung zehren das Liquiditätspolster der Rentenkasse vor dem Demografie-Peak auf.'}
            </p>
          </div>

          <button
            onClick={onRestartGame}
            className="w-full py-3 px-6 rounded-xl font-bold text-xs bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kampagne 2026 neu starten</span>
          </button>
        </div>
      </div>
    );
  }

  const tier = calculateAwardTier(macro, metrics);
  const tierLabel =
    tier === 'gold' ? 'Gold-Auszeichnung' : tier === 'silver' ? 'Silber-Auszeichnung' : 'Bronze-Auszeichnung';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="w-full max-w-xl p-8 rounded-2xl apple-glass border-amber-400/40 text-center shadow-2xl space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
          <Trophy className="w-7 h-7" />
        </div>

        <div>
          <div className="text-xs font-mono font-semibold text-amber-400">
            econo=me Kampagne abgeschlossen · {tierLabel} · Modus {difficulty}
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 text-balance">
            Generationenvertrag erfolgreich durch den Peak geführt
          </h2>
          <p className="text-xs text-[#86868b] mt-1">
            Deutschland hat das Zieljahr 2045 mit stabiler Altersvorsorge erreicht.
          </p>
        </div>

        <div className="w-28 h-28 mx-auto">
          <HandDrawnFrame
            assetPath="artworks/awards/trophy_generation_justice.png"
            title={tierLabel}
            designerInstruction="Goldmedaille mit zwei ineinandergreifenden Händen."
            dimensions="512 × 512 px"
            heightClass="h-28 w-28"
          />
        </div>

        <div className="grid grid-cols-4 gap-2 p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono tabular-nums">
          <div>
            <div className="text-[#86868b] text-[10px]">Beitragssatz</div>
            <div className="text-emerald-400 text-sm font-bold">{macro.contributionRate.toFixed(1)} %</div>
          </div>
          <div>
            <div className="text-[#86868b] text-[10px]">Fonds 2045</div>
            <div className="text-amber-400 text-sm font-bold">{macro.generationCapitalFund.toFixed(0)} Mrd. €</div>
          </div>
          <div>
            <div className="text-[#86868b] text-[10px]">Rentenniveau</div>
            <div className="text-sky-400 text-sm font-bold">{macro.pensionLevel.toFixed(1)} %</div>
          </div>
          <div>
            <div className="text-[#86868b] text-[10px]">Score</div>
            <div className="text-white text-sm font-bold">{metrics.score}</div>
          </div>
        </div>

        <button
          onClick={onRestartGame}
          className="w-full py-3 px-6 rounded-xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Neuen Durchgang starten</span>
        </button>
      </div>
    </div>
  );
};
