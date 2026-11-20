import React from 'react';
import {
  AnnualDilemma,
  DecisionCard,
  DifficultyLevel,
  DilemmaOption,
  GameMetrics,
  GameOverReason,
  GameStatus,
  MacroState,
  TurnFeedback,
} from '../types';
import { getDifficultyConfig } from '../simulation/difficultyConfig';
import { AppleRadialGauge } from './AppleRadialGauge';
import { CampaignHud } from './game/CampaignHud';
import { DilemmaPanel } from './game/DilemmaPanel';
import { ReformCardDeck } from './game/ReformCardDeck';
import { TrajectoryChart } from './game/TrajectoryChart';
import { GameResultModal } from './game/GameResultModal';
import { DevSandboxDrawer } from './game/DevSandboxDrawer';
import { Coins, Heart, Shield, Zap } from 'lucide-react';

interface GameChallengeScreenProps {
  macro: MacroState;
  history: MacroState[];
  metrics: GameMetrics;
  gameStatus: GameStatus;
  gameOverReason: GameOverReason;
  currentDilemma?: AnnualDilemma;
  lastFeedback: TurnFeedback | null;
  onSelectDilemmaOption: (option?: DilemmaOption) => void;
  cards: DecisionCard[];
  playedCardIds: string[];
  onPlayCard: (card: DecisionCard) => void;
  onRestartGame: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (diff: DifficultyLevel) => void;
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
  history,
  metrics,
  gameStatus,
  gameOverReason,
  currentDilemma,
  lastFeedback,
  onSelectDilemmaOption,
  cards,
  playedCardIds,
  onPlayCard,
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
  const cfg = getDifficultyConfig(difficulty);
  const reservePercent = Math.min(100, (metrics.reserveMonths / 2.0) * 100);
  const fundPercent = Math.min(100, (macro.generationCapitalFund / 250.0) * 100);

  const youthStatus =
    metrics.youthSatisfaction < 25 || macro.contributionRate > cfg.maxContributionRate - 0.5
      ? 'critical'
      : metrics.youthSatisfaction < 50 || macro.contributionRate > cfg.ratePenaltyThreshold + 0.5
      ? 'elevated'
      : 'nominal';

  const retireeStatus =
    metrics.retireeSatisfaction < 25 || macro.pensionLevel < cfg.minPensionLevel + 0.3
      ? 'critical'
      : metrics.retireeSatisfaction < 50 || macro.pensionLevel < 47.8
      ? 'elevated'
      : 'nominal';

  const reserveStatus =
    metrics.reserveMonths < 0.35
      ? 'critical'
      : metrics.reserveMonths < 0.75
      ? 'elevated'
      : 'nominal';

  const fundStatus =
    macro.year >= 2035 && macro.generationCapitalFund < 140
      ? 'elevated'
      : 'nominal';

  return (
    <div className="space-y-6">
      <GameResultModal
        gameStatus={gameStatus}
        gameOverReason={gameOverReason}
        macro={macro}
        metrics={metrics}
        difficulty={difficulty}
        onRestartGame={onRestartGame}
      />

      <CampaignHud
        macro={macro}
        metrics={metrics}
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
        onRestartGame={onRestartGame}
        lastFeedback={lastFeedback}
      />

      {/* 4 Makro-Vitalwerte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppleRadialGauge
          value={metrics.youthSatisfaction}
          label="Jugend & Zahler"
          subtext={`Beitragssatz ${macro.contributionRate.toFixed(1)} %`}
          footerLabel={`Grenze max. ${cfg.maxContributionRate.toFixed(1)} %`}
          icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
          colorScheme="gold"
          statusLevel={youthStatus}
        />

        <AppleRadialGauge
          value={metrics.retireeSatisfaction}
          label="Senioren & Rentner"
          subtext={`Rentenniveau ${macro.pensionLevel.toFixed(1)} %`}
          footerLabel={`Grenze min. ${cfg.minPensionLevel.toFixed(1)} %`}
          icon={<Heart className="w-3.5 h-3.5 text-rose-400" />}
          colorScheme="rose"
          statusLevel={retireeStatus}
        />

        <AppleRadialGauge
          value={reservePercent}
          label="Rentenrücklage"
          subtext={`${metrics.reserveMonths.toFixed(2)} Monatsausgaben`}
          footerLabel="Insolvenz ab 0,00 Mon."
          icon={<Shield className="w-3.5 h-3.5 text-sky-400" />}
          colorScheme="sky"
          statusLevel={reserveStatus}
        />

        <AppleRadialGauge
          value={fundPercent}
          label="Generationenkapital"
          subtext={`${macro.generationCapitalFund.toFixed(1)} Mrd. € Bestand`}
          footerLabel={
            macro.year >= 2035
              ? `GRV-Entlastung ${macro.fundPayoutToGRV.toFixed(1)} Mrd. €`
              : `Rendite ${macro.marketReturnPercent.toFixed(1)} % p.a.`
          }
          icon={<Coins className="w-3.5 h-3.5 text-emerald-400" />}
          colorScheme="emerald"
          statusLevel={fundStatus}
        />
      </div>

      <DilemmaPanel
        year={macro.year}
        dilemma={currentDilemma}
        politicalCapital={metrics.politicalCapital}
        onSelectOption={onSelectDilemmaOption}
      />

      <ReformCardDeck
        cards={cards}
        playedCardIds={playedCardIds}
        politicalCapital={metrics.politicalCapital}
        onPlayCard={onPlayCard}
      />

      <TrajectoryChart history={history} difficulty={difficulty} />

      {devMode && (
        <DevSandboxDrawer
          extraCreditMrd={extraCreditMrd}
          onExtraCreditChange={onExtraCreditChange}
          retirementShiftMonths={retirementShiftMonths}
          onRetirementShiftChange={onRetirementShiftChange}
          forceHaltelinie={forceHaltelinie}
          onToggleHaltelinie={onToggleHaltelinie}
        />
      )}
    </div>
  );
};
