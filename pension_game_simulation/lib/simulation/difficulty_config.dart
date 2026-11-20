enum DifficultyLevel {
  normal,
  hard,
  hardcore,
}

class MarketShock {
  final double returnPercent;
  final String label;

  const MarketShock({
    required this.returnPercent,
    required this.label,
  });
}

class DifficultyConfig {
  final DifficultyLevel id;
  final String label;
  final String shortDescription;
  final int startingPoliticalCapital;
  final double startingReserveMonths;
  final int startingYouthSatisfaction;
  final int startingRetireeSatisfaction;
  final double maxContributionRate;
  final double minPensionLevel;
  final double ratePenaltyThreshold;
  final double youthPenaltyMultiplier;
  final double retireePenaltyMultiplier;
  final double reserveBurnBase;
  final int capitalRegenGood;
  final int capitalRegenLow;
  final double loanInterestRate;
  final Map<int, MarketShock> marketShocks;

  const DifficultyConfig({
    required this.id,
    required this.label,
    required this.shortDescription,
    required this.startingPoliticalCapital,
    required this.startingReserveMonths,
    required this.startingYouthSatisfaction,
    required this.startingRetireeSatisfaction,
    required this.maxContributionRate,
    required this.minPensionLevel,
    required this.ratePenaltyThreshold,
    required this.youthPenaltyMultiplier,
    required this.retireePenaltyMultiplier,
    required this.reserveBurnBase,
    required this.capitalRegenGood,
    required this.capitalRegenLow,
    required this.loanInterestRate,
    required this.marketShocks,
  });
}

/// Modulare Schwierigkeitsgrade für die econo=me Kampagne (2026–2045).
class DifficultyConfigs {
  static const Map<DifficultyLevel, DifficultyConfig> all = {
    DifficultyLevel.normal: DifficultyConfig(
      id: DifficultyLevel.normal,
      label: 'Normal',
      shortDescription:
          'Einstiegsmodus mit solider Rücklage und moderaten Börsenschwankungen.',
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
        2028: MarketShock(
          returnPercent: 3.4,
          label: 'Zinsdämpfer an den Weltbörsen (+3,4 %)',
        ),
        2033: MarketShock(
          returnPercent: -1.0,
          label: 'Globale Marktkorrektur (-1,0 %)',
        ),
        2037: MarketShock(
          returnPercent: 4.0,
          label: 'Konjunkturabkühlung (+4,0 %)',
        ),
      },
    ),
    DifficultyLevel.hard: DifficultyConfig(
      id: DifficultyLevel.hard,
      label: 'Schwer',
      shortDescription:
          'econo=me Wettbewerbs-Standard: Enge Budgets, echte Zins-Schocks & Boomer-Druck.',
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
        2028: MarketShock(
          returnPercent: 1.6,
          label: 'Zinsschock: Anleihen drücken Spread (+1,6 %)',
        ),
        2031: MarketShock(
          returnPercent: 2.4,
          label: 'Inflationswelle belastet Märkte (+2,4 %)',
        ),
        2033: MarketShock(
          returnPercent: -4.8,
          label: 'Schwerer Börseneinbruch (-4,8 %)',
        ),
        2037: MarketShock(
          returnPercent: 1.8,
          label: 'Stagflation in Europa (+1,8 %)',
        ),
        2041: MarketShock(
          returnPercent: 3.0,
          label: 'Handelskonflikt bremst Rendite (+3,0 %)',
        ),
      },
    ),
    DifficultyLevel.hardcore: DifficultyConfig(
      id: DifficultyLevel.hardcore,
      label: 'Hardcore',
      shortDescription:
          'Maximaler Krisen-Stresstest: Tiefe Rezessionen, kaum Fehler-Toleranz.',
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
        2028: MarketShock(
          returnPercent: 0.8,
          label: 'Zinssprung frisst Aktien-Spread auf (+0,8 %)',
        ),
        2029: MarketShock(
          returnPercent: 2.0,
          label: 'Anhaltende Rezession (+2,0 %)',
        ),
        2031: MarketShock(
          returnPercent: 1.5,
          label: 'Energie- & Inflationsschock (+1,5 %)',
        ),
        2033: MarketShock(
          returnPercent: -6.8,
          label: 'Systemischer Marktcrash (-6,8 %)',
        ),
        2034: MarketShock(
          returnPercent: 1.5,
          label: 'Schleppende Erholung (+1,5 %)',
        ),
        2037: MarketShock(
          returnPercent: -1.5,
          label: 'Stagflations-Krise (-1,5 %)',
        ),
        2041: MarketShock(
          returnPercent: 2.2,
          label: 'Geopolitische Marktspannung (+2,2 %)',
        ),
      },
    ),
  };

  static DifficultyConfig get(DifficultyLevel level) => all[level]!;
}
