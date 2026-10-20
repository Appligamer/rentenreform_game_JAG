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
