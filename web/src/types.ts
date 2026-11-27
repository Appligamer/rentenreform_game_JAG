export interface MacroState {
  year: number;
  contributorsCount: number; // In Mio.
  pensionersCount: number; // In Mio.
  contributionRate: number; // In %
  pensionLevel: number; // In % (Haltelinie 48%)
  generationCapitalFund: number; // In Mrd. €
  marketReturnPercent: number; // In %
  federalSubsidy: number; // In Mrd. €
  averageGrossSalary: number; // In €/Jahr
  currentPensionValue: number; // In € (Rentenwert)
  fundPayoutToGRV: number; // In Mrd. €
}

export type GameStatus = 'playing' | 'victory' | 'game_over';

export type GameOverReason =
  | 'youth_revolt'
  | 'pensioner_poverty'
  | 'state_insolvency'
  | null;

export type DifficultyLevel = 'normal' | 'hard' | 'hardcore';

export type AwardTier = 'gold' | 'silver' | 'bronze';

export interface DifficultyConfig {
  id: DifficultyLevel;
  label: string;
  shortDescription: string;
  startingPoliticalCapital: number;
  startingReserveMonths: number;
  startingYouthSatisfaction: number;
  startingRetireeSatisfaction: number;
  maxContributionRate: number;
  minPensionLevel: number;
  ratePenaltyThreshold: number;
  youthPenaltyMultiplier: number;
  retireePenaltyMultiplier: number;
  reserveBurnBase: number;
  capitalRegenGood: number;
  capitalRegenLow: number;
  loanInterestRate: number;
  marketShocks: Record<number, { returnPercent: number; label: string }>;
}

export interface PolicyModifiers {
  extraCapitalCreditMrd: number; // Einmaliger Zusatzkredit für die nächste Runde
  retirementShiftMonths: number; // Kumulierte Erhöhung Renteneintrittsalter (Monate)
  structuralContributionDelta: number; // Dauerhafte Entlastung/Belastung (%-Punkte)
  structuralPensionLevelDelta: number; // Dauerhafte Niveau-Verschiebung (%-Punkte)
  recurringFederalSubsidyDeltaMrd: number; // Jährlicher Zusatz-Bundeszuschuss
  marketBoostYearsRemaining: number; // Temporärer Rendite-Boost (z. B. Tech-Boom)
  marketBoostPercent: number;
  forceHaltelinie48: boolean;
}

export interface GameMetrics {
  youthSatisfaction: number; // 0 - 100 %
  retireeSatisfaction: number; // 0 - 100 %
  reserveMonths: number; // 0.0 - 3.0 Monate Nachhaltigkeitsrücklage
  politicalCapital: number; // 0 - 100 Aktionspunkte
  score: number;
  difficulty: DifficultyLevel;
}

export interface DilemmaConsequences {
  contributionRateDelta?: number; // Strukturell wirksam über Folgejahre (abgeschwächt) + Soforteffekt
  pensionLevelDelta?: number;
  generationCapitalDeltaMrd?: number;
  retirementAgeDeltaMonths?: number;
  federalSubsidyDeltaMrd?: number;
  youthDelta?: number;
  retireeDelta?: number;
  reserveDeltaMonths?: number;
  capitalCost?: number;
}

export interface DilemmaOption {
  id: string;
  label: string;
  summary: string;
  consequences: DilemmaConsequences;
}

export interface AnnualDilemma {
  year: number;
  title: string;
  context: string;
  historicalContext: string;
  isMilestone?: boolean;
  options: DilemmaOption[];
}

export interface TurnFeedback {
  year: number;
  headline: string;
  marketNote?: string;
  severity: 'info' | 'warning' | 'positive';
}

export interface CitizenProfile {
  name: string;
  age: number;
  grossIncome: number;
  accumulatedPoints: number;
  monthlyEtfSavings: number;
  etfPortfolioValue: number;
  bavMonthlySavings: number;
}

export type CardCategory = 'macro' | 'generation_capital' | 'life' | 'crisis';

export interface DecisionCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: CardCategory;
  artworkAssetPath: string;
  designerNotes: string;
  dimensions: string;
  politicalCapitalCost: number;
  deltaContributionRate: number;
  deltaPensionLevel: number;
  deltaGenerationFundMrd: number;
  deltaRetirementAgeMonths: number;
  deltaFederalSubsidyMrd: number;
  deltaYouthSatisfaction?: number;
  deltaRetireeSatisfaction?: number;
  marketBoostYears?: number;
  marketBoostPercent?: number;
}

export interface DesignerAssetSpec {
  id: string;
  title: string;
  category: 'background' | 'character' | 'card' | 'badge' | 'award';
  filePath: string;
  dimensions: string;
  aspectRatio: string;
  format: string;
  mood: string;
  instruction: string;
}

export interface ToastNotice {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
}
