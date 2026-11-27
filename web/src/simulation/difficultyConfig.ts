import { DifficultyConfig, DifficultyLevel } from '../types';

/**
 * Modulare Schwierigkeitsgrade für die econo=me Kampagne (2026–2045).
 * Normal: Ausgeglichener Einstieg.
 * Schwer: Offizieller Wettbewerbs-Standard — erfordert aktive Reformkarten und Kapital-Management.
 * Hardcore: Stresstest mit harten Rezessionen und minimalen Toleranzen.
 */
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  normal: {
    id: 'normal',
    label: 'Normal',
    shortDescription: 'Einstiegsmodus mit solider Rücklage und moderaten Börsenschwankungen.',
    startingPoliticalCapital: 65,
    startingReserveMonths: 1.6,
    startingYouthSatisfaction: 74,
    startingRetireeSatisfaction: 74,
    maxContributionRate: 22.8,
    minPensionLevel: 46.2,
    ratePenaltyThreshold: 20.6,
    youthPenaltyMultiplier: 6.0,
    retireePenaltyMultiplier: 8.5,
    reserveBurnBase: 0.04,
    capitalRegenGood: 18,
    capitalRegenLow: 12,
    loanInterestRate: 2.4,
    marketShocks: {
      2028: { returnPercent: 3.4, label: 'Zinsdämpfer an den Weltbörsen (+3,4 %)' },
      2033: { returnPercent: -1.0, label: 'Globale Marktkorrektur (-1,0 %)' },
      2037: { returnPercent: 4.0, label: 'Konjunkturabkühlung (+4,0 %)' },
    },
  },
  hard: {
    id: 'hard',
    label: 'Schwer',
    shortDescription: 'econo=me Wettbewerbs-Standard: Enge Budgets, echte Zins-Schocks & Boomer-Druck.',
    startingPoliticalCapital: 50,
    startingReserveMonths: 1.35,
    startingYouthSatisfaction: 68,
    startingRetireeSatisfaction: 70,
    maxContributionRate: 22.3,
    minPensionLevel: 46.8,
    ratePenaltyThreshold: 20.0,
    youthPenaltyMultiplier: 9.0,
    retireePenaltyMultiplier: 11.5,
    reserveBurnBase: 0.08,
    capitalRegenGood: 16,
    capitalRegenLow: 9,
    loanInterestRate: 2.7,
    marketShocks: {
      2028: { returnPercent: 1.6, label: 'Zinsschock: Anleihen drücken Spread (+1,6 %)' },
      2031: { returnPercent: 2.4, label: 'Inflationswelle belastet Märkte (+2,4 %)' },
      2033: { returnPercent: -4.8, label: 'Schwerer Börseneinbruch (-4,8 %)' },
      2037: { returnPercent: 1.8, label: 'Stagflation in Europa (+1,8 %)' },
      2041: { returnPercent: 3.0, label: 'Handelskonflikt bremst Rendite (+3,0 %)' },
    },
  },
  hardcore: {
    id: 'hardcore',
    label: 'Hardcore',
    shortDescription: 'Maximaler Krisen-Stresstest: Tiefe Rezessionen, kaum Fehler-Toleranz.',
    startingPoliticalCapital: 44,
    startingReserveMonths: 1.2,
    startingYouthSatisfaction: 64,
    startingRetireeSatisfaction: 66,
    maxContributionRate: 22.1,
    minPensionLevel: 47.1,
    ratePenaltyThreshold: 20.1,
    youthPenaltyMultiplier: 8.5,
    retireePenaltyMultiplier: 12.0,
    reserveBurnBase: 0.10,
    capitalRegenGood: 14,
    capitalRegenLow: 8,
    loanInterestRate: 3.1,
    marketShocks: {
      2028: { returnPercent: 0.8, label: 'Zinssprung frisst Aktien-Spread auf (+0,8 %)' },
      2029: { returnPercent: 2.0, label: 'Anhaltende Rezession (+2,0 %)' },
      2031: { returnPercent: 1.5, label: 'Energie- & Inflationsschock (+1,5 %)' },
      2033: { returnPercent: -6.8, label: 'Systemischer Marktcrash (-6,8 %)' },
      2034: { returnPercent: 1.5, label: 'Schleppende Erholung (+1,5 %)' },
      2037: { returnPercent: -1.5, label: 'Stagflations-Krise (-1,5 %)' },
      2041: { returnPercent: 2.2, label: 'Geopolitische Marktspannung (+2,2 %)' },
    },
  },
};

export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_CONFIGS[level];
}
