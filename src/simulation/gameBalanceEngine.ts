import {
  AwardTier,
  DecisionCard,
  DifficultyLevel,
  DilemmaOption,
  GameMetrics,
  GameOverReason,
  GameStatus,
  MacroState,
  PolicyModifiers,
  TurnFeedback,
} from '../types';
import { getDifficultyConfig } from './difficultyConfig';
import { PensionMathEngine } from './pensionEngine';

export interface TurnResolutionResult {
  nextMacro: MacroState;
  nextMetrics: GameMetrics;
  nextModifiers: PolicyModifiers;
  nextStatus: GameStatus;
  gameOverReason: GameOverReason;
  feedback: TurnFeedback;
}

export function createInitialMetrics(difficulty: DifficultyLevel): GameMetrics {
  const cfg = getDifficultyConfig(difficulty);
  return {
    youthSatisfaction: cfg.startingYouthSatisfaction,
    retireeSatisfaction: cfg.startingRetireeSatisfaction,
    reserveMonths: cfg.startingReserveMonths,
    politicalCapital: cfg.startingPoliticalCapital,
    score: 100,
    difficulty,
  };
}

export function evaluateGameStatus(
  nextMacro: MacroState,
  nextMetrics: GameMetrics,
  difficulty: DifficultyLevel
): { status: GameStatus; reason: GameOverReason } {
  const cfg = getDifficultyConfig(difficulty);

  if (nextMetrics.youthSatisfaction <= 0 || nextMacro.contributionRate > cfg.maxContributionRate) {
    return { status: 'game_over', reason: 'youth_revolt' };
  }

  if (nextMetrics.retireeSatisfaction <= 0 || nextMacro.pensionLevel < cfg.minPensionLevel) {
    return { status: 'game_over', reason: 'pensioner_poverty' };
  }

  if (nextMetrics.reserveMonths <= 0) {
    return { status: 'game_over', reason: 'state_insolvency' };
  }

  if (nextMacro.year >= 2045) {
    return { status: 'victory', reason: null };
  }

  return { status: 'playing', reason: null };
}

export function calculateAwardTier(macro: MacroState, metrics: GameMetrics): AwardTier {
  const avgSatisfaction = (metrics.youthSatisfaction + metrics.retireeSatisfaction) / 2;
  if (
    macro.contributionRate <= 21.2 &&
    macro.generationCapitalFund >= 180 &&
    macro.pensionLevel >= 47.5 &&
    avgSatisfaction >= 55
  ) {
    return 'gold';
  }
  if (macro.contributionRate <= 21.8 && avgSatisfaction >= 40) {
    return 'silver';
  }
  return 'bronze';
}

export function applyDecisionCardModifiers(
  card: DecisionCard,
  modifiers: PolicyModifiers,
  metrics: GameMetrics
): { nextModifiers: PolicyModifiers; nextMetrics: GameMetrics } {
  const nextModifiers: PolicyModifiers = {
    ...modifiers,
    extraCapitalCreditMrd: modifiers.extraCapitalCreditMrd + card.deltaGenerationFundMrd,
    retirementShiftMonths: modifiers.retirementShiftMonths + card.deltaRetirementAgeMonths,
    structuralContributionDelta: Number(
      (modifiers.structuralContributionDelta + card.deltaContributionRate).toFixed(2)
    ),
    structuralPensionLevelDelta: Number(
      (modifiers.structuralPensionLevelDelta + card.deltaPensionLevel).toFixed(2)
    ),
    recurringFederalSubsidyDeltaMrd:
      modifiers.recurringFederalSubsidyDeltaMrd + card.deltaFederalSubsidyMrd,
    marketBoostYearsRemaining: card.marketBoostYears
      ? Math.max(modifiers.marketBoostYearsRemaining, card.marketBoostYears)
      : modifiers.marketBoostYearsRemaining,
    marketBoostPercent: card.marketBoostPercent ?? modifiers.marketBoostPercent,
  };

  const nextMetrics: GameMetrics = {
    ...metrics,
    politicalCapital: Math.max(0, metrics.politicalCapital - card.politicalCapitalCost),
    score: metrics.score + 85,
    youthSatisfaction: Math.max(
      0,
      Math.min(100, metrics.youthSatisfaction + (card.deltaYouthSatisfaction ?? 4))
    ),
    retireeSatisfaction: Math.max(
      0,
      Math.min(100, metrics.retireeSatisfaction + (card.deltaRetireeSatisfaction ?? 0))
    ),
  };

  return { nextModifiers, nextMetrics };
}

export function resolveTurn(params: {
  macro: MacroState;
  metrics: GameMetrics;
  modifiers: PolicyModifiers;
  difficulty: DifficultyLevel;
  option?: DilemmaOption;
}): TurnResolutionResult {
  const { macro, metrics, modifiers, difficulty, option } = params;
  const cfg = getDifficultyConfig(difficulty);
  const delta = option?.consequences;
  const cost = delta?.capitalCost ?? 0;

  // Markt-Rendite bestimmen (Schock-Kalender + eventueller Tech-Boom-Boost)
  const targetYear = macro.year + 1;
  const shock = cfg.marketShocks[targetYear];
  let marketReturn = shock ? shock.returnPercent : 6.5;

  if (modifiers.marketBoostYearsRemaining > 0) {
    marketReturn = Math.max(marketReturn, modifiers.marketBoostPercent || 9.8);
  }

  // Strukturelle Nachwirkung aus Dilemma-Optionen (wirkt maßvoll dauerhaft fort, ohne ins Extrem zu kippen)
  const optionStructRate = (delta?.contributionRateDelta ?? 0) * 0.45;
  const optionStructPension = (delta?.pensionLevelDelta ?? 0) * 0.45;

  const updatedStructuralRate = Number(
    Math.max(-1.6, Math.min(1.6, modifiers.structuralContributionDelta + optionStructRate)).toFixed(2)
  );
  const updatedStructuralPension = Number(
    Math.max(-2.0, Math.min(2.0, modifiers.structuralPensionLevelDelta + optionStructPension)).toFixed(2)
  );
  const updatedRetirementShift =
    modifiers.retirementShiftMonths + (delta?.retirementAgeDeltaMonths ?? 0);
  const oneTimeSubsidyBump =
    modifiers.recurringFederalSubsidyDeltaMrd + (delta?.federalSubsidyDeltaMrd ?? 0);

  const nextMacro = PensionMathEngine.stepYear(macro, {
    extraCapitalCreditMrd:
      modifiers.extraCapitalCreditMrd + (delta?.generationCapitalDeltaMrd ?? 0),
    marketReturnOverride: marketReturn,
    loanInterestRatePercent: cfg.loanInterestRate,
    retirementAgeShiftMonths: updatedRetirementShift,
    federalSubsidyDeltaMrd: oneTimeSubsidyBump,
    structuralContributionDelta: updatedStructuralRate,
    structuralPensionLevelDelta: updatedStructuralPension,
    forceHaltelinie48: modifiers.forceHaltelinie48,
  });

  // Einmalige Sofort-Spitze des Dilemmas on top (für das Entscheidungsjahr)
  if (delta?.contributionRateDelta) {
    nextMacro.contributionRate = Number(
      Math.max(16.5, nextMacro.contributionRate + delta.contributionRateDelta * 0.55).toFixed(2)
    );
  }
  if (delta?.pensionLevelDelta) {
    nextMacro.pensionLevel = Number(
      Math.max(42.0, nextMacro.pensionLevel + delta.pensionLevelDelta * 0.55).toFixed(1)
    );
  }

  // Dynamischer demografischer Druck auf Jugend & Rentner
  const rateDiff = cfg.ratePenaltyThreshold - nextMacro.contributionRate;
  // Rückenwind wird bei hoher Zufriedenheit gedämpft (Sättigung), Überlastung schlägt voll durch
  const rateEffect =
    rateDiff >= 0
      ? Math.min(2.5, rateDiff * 2.0) * (metrics.youthSatisfaction > 75 ? 0.35 : 1.0)
      : rateDiff * cfg.youthPenaltyMultiplier;

  const youthChange = rateEffect + (delta?.youthDelta ?? 0);

  const pensionDiff = nextMacro.pensionLevel - 48.0;
  const pensionEffect =
    pensionDiff >= 0
      ? Math.min(2.0, pensionDiff * 3.0) * (metrics.retireeSatisfaction > 75 ? 0.35 : 1.0)
      : pensionDiff * cfg.retireePenaltyMultiplier;

  const retireeChange = pensionEffect + (delta?.retireeDelta ?? 0);

  // Nachhaltigkeitsrücklage: Boomer-Welle (2030–2039) zehrt an der Kasse; Generationenkapital ab 2035 entlastet sie
  const isBoomerWave = nextMacro.year >= 2030 && nextMacro.year <= 2039;
  let reserveChange = isBoomerWave ? -cfg.reserveBurnBase : -cfg.reserveBurnBase * 0.25;
  if (nextMacro.fundPayoutToGRV >= 6.0) {
    reserveChange += 0.09;
  }
  if (nextMacro.contributionRate >= 21.5) {
    reserveChange += 0.05;
  }
  if (delta?.reserveDeltaMonths) {
    reserveChange += delta.reserveDeltaMonths;
  }

  const newYouth = Math.max(0, Math.min(100, Math.round(metrics.youthSatisfaction + youthChange)));
  const newRetiree = Math.max(
    0,
    Math.min(100, Math.round(metrics.retireeSatisfaction + retireeChange))
  );
  const newReserve = Number(
    Math.max(0, Math.min(3.0, metrics.reserveMonths + reserveChange)).toFixed(2)
  );

  // Politisches Kapital regeneriert nach Schwierigkeitsgrad & Zufriedenheit
  const capitalEarned =
    newYouth >= 50 && newRetiree >= 50 ? cfg.capitalRegenGood : cfg.capitalRegenLow;
  const remainingCapital = Math.max(
    0,
    Math.min(100, metrics.politicalCapital - cost + capitalEarned)
  );

  const diffMultiplier = difficulty === 'hardcore' ? 1.5 : difficulty === 'hard' ? 1.25 : 1.0;
  const addedScore = Math.round(
    ((newYouth + newRetiree) / 2 + nextMacro.generationCapitalFund / 5) * diffMultiplier
  );

  const nextMetrics: GameMetrics = {
    youthSatisfaction: newYouth,
    retireeSatisfaction: newRetiree,
    reserveMonths: newReserve,
    politicalCapital: remainingCapital,
    score: metrics.score + addedScore,
    difficulty,
  };

  const nextModifiers: PolicyModifiers = {
    ...modifiers,
    extraCapitalCreditMrd: 0, // Einmal-Kredit verbraucht
    recurringFederalSubsidyDeltaMrd: 0, // Einmal-Erhöhungsstufe im Bundeszuschuss verbucht
    retirementShiftMonths: updatedRetirementShift,
    structuralContributionDelta: updatedStructuralRate,
    structuralPensionLevelDelta: updatedStructuralPension,
    marketBoostYearsRemaining: Math.max(0, modifiers.marketBoostYearsRemaining - 1),
  };

  const { status: nextStatus, reason: gameOverReason } = evaluateGameStatus(
    nextMacro,
    nextMetrics,
    difficulty
  );

  const severity: TurnFeedback['severity'] =
    nextMacro.contributionRate > cfg.maxContributionRate - 0.5 ||
    newYouth < 30 ||
    newRetiree < 30 ||
    newReserve < 0.35
      ? 'warning'
      : shock && shock.returnPercent < 3
      ? 'warning'
      : nextMacro.fundPayoutToGRV > 0 || (delta?.generationCapitalDeltaMrd ?? 0) > 10
      ? 'positive'
      : 'info';

  const feedback: TurnFeedback = {
    year: nextMacro.year,
    headline: option
      ? `${macro.year}: „${option.label}“ beschlossen.`
      : `Haushaltsjahr ${nextMacro.year} fortgeschrieben.`,
    marketNote: shock
      ? shock.label
      : modifiers.marketBoostYearsRemaining > 0
      ? `KI- & Tech-Boom hebt Fondsrendite auf ${marketReturn.toFixed(1)} %`
      : undefined,
    severity,
  };

  return {
    nextMacro,
    nextMetrics,
    nextModifiers,
    nextStatus,
    gameOverReason,
    feedback,
  };
}
