enum CardCategory {
  macroReform,
  generationCapital,
  lifeChoice,
  externalEvent,
}

/// Spielbare Reform-, Ereignis- und Entscheidungskarte.
class DecisionCard {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final CardCategory category;
  final String artworkAssetPath;
  final String requiredSketchNotes;

  // Kosten & strategische Wirkung
  final int politicalCapitalCost;
  final double deltaContributionRate;
  final double deltaPensionLevel;
  final double deltaGenerationFundMrd;
  final double deltaRetirementAge;
  final double deltaFederalSubsidyMrd;
  final int deltaYouthSatisfaction;
  final int deltaRetireeSatisfaction;
  final int marketBoostYears;
  final double marketBoostPercent;

  const DecisionCard({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.category,
    required this.artworkAssetPath,
    required this.requiredSketchNotes,
    this.politicalCapitalCost = 20,
    this.deltaContributionRate = 0.0,
    this.deltaPensionLevel = 0.0,
    this.deltaGenerationFundMrd = 0.0,
    this.deltaRetirementAge = 0.0,
    this.deltaFederalSubsidyMrd = 0.0,
    this.deltaYouthSatisfaction = 0,
    this.deltaRetireeSatisfaction = 0,
    this.marketBoostYears = 0,
    this.marketBoostPercent = 0.0,
  });
}
