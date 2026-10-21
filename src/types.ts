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
  | 'youth_revolt' // Beitragssatz > 22.4% -> Jugend streikt / wandert ab
  | 'pensioner_poverty' // Haltelinie gebrochen, Rentenniveau < 46.5% -> Massenproteste
  | 'state_insolvency' // Nachhaltigkeitsrücklage auf 0 -> Zahlungsunfähigkeit
  | null;

export type DifficultyLevel = 'normal' | 'hard' | 'hardcore';

export interface GameMetrics {
  youthSatisfaction: number; // 0 - 100 %
  retireeSatisfaction: number; // 0 - 100 %
  reserveMonths: number; // 0.0 - 3.0 Monate Nachhaltigkeitsrücklage
  politicalCapital: number; // 0 - 100 Aktionspunkte
  score: number;
  difficulty: DifficultyLevel;
}

export interface DilemmaOption {
  id: string;
  label: string;
  summary: string;
  consequences: {
    contributionRateDelta?: number;
    pensionLevelDelta?: number;
    generationCapitalDeltaMrd?: number;
    retirementAgeDeltaMonths?: number;
    youthDelta?: number;
    retireeDelta?: number;
    reserveDeltaMonths?: number;
    capitalCost?: number;
  };
}

export interface AnnualDilemma {
  year: number;
  title: string;
  context: string;
  historicalContext: string;
  options: DilemmaOption[];
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
  politicalCapitalCost: number; // Kostet Aktionspunkte!
  deltaContributionRate: number;
  deltaPensionLevel: number;
  deltaGenerationFundMrd: number;
  deltaRetirementAgeMonths: number;
  deltaFederalSubsidyMrd: number;
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
