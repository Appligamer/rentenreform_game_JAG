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
  final String artworkAssetPath; // z.B. assets/images/cards/card_generationenkapital_boost.png
  final String requiredSketchNotes; // Anweisung für den Illustrator solange Handzeichnung fehlt

  // Mathematische Effekte auf die Simulation
  final double deltaContributionRate; // Veränderung Beitragssatz (z.B. -0.4 %)
  final double deltaPensionLevel;     // Veränderung Rentenniveau (z.B. +0.5 %)
  final double deltaGenerationFundMrd; // Einzahlung in Mrd. € ins Generationenkapital
  final double deltaRetirementAge;    // Verschiebung Rentenalter
  final double deltaFederalSubsidyMrd; // Bundeszuschuss-Änderung in Mrd. €

  const DecisionCard({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.category,
    required this.artworkAssetPath,
    required this.requiredSketchNotes,
    this.deltaContributionRate = 0.0,
    this.deltaPensionLevel = 0.0,
    this.deltaGenerationFundMrd = 0.0,
    this.deltaRetirementAge = 0.0,
    this.deltaFederalSubsidyMrd = 0.0,
  });
}
