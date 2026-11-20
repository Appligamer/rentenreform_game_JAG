import '../models/decision_card.dart';

/// Vordefinierte strategische Reformkarten für den Spielverlauf (econo=me Kampagne).
class GameEventsCatalog {
  static List<DecisionCard> getAvailableCards() {
    return const [
      DecisionCard(
        id: 'card_gen_turbo',
        title: 'Generationenkapital-Turbo',
        subtitle: '+25 Mrd. € Fondsvolumen sofort',
        description:
            'Zusätzliche Bundesanleihen dotieren den globalen Aktienfonds frühzeitig. Maximiert die Entlastungs-Ausschüttung ab 2035.',
        category: CardCategory.generationCapital,
        artworkAssetPath: 'assets/images/cards/card_generationenkapital_boost.png',
        requiredSketchNotes:
            'Handzeichnung: Stilisierter Baum aus Bundesadler-Tresor mit wachsenden Goldmünzen/Charts.',
        politicalCapitalCost: 24,
        deltaGenerationFundMrd: 25.0,
        deltaContributionRate: -0.25,
        deltaYouthSatisfaction: 5,
      ),
      DecisionCard(
        id: 'card_haltelinie_48',
        title: 'Haltelinie 48 % absichern',
        subtitle: 'Rentenpaket II Kernversprechen',
        description:
            'Garantiert Kaufkraftschutz für Standardrentner durch gezielten Bundeszuschuss (+6 Mrd. €/Jahr) und +0,6 % Niveau-Puffer.',
        category: CardCategory.macroReform,
        artworkAssetPath: 'assets/images/cards/card_haltelinie_48.png',
        requiredSketchNotes:
            'Handzeichnung: Majestätischer Leuchtturm mit 48%-Markierung, der Wellen trotzt.',
        politicalCapitalCost: 22,
        deltaContributionRate: 0.1,
        deltaPensionLevel: 0.6,
        deltaFederalSubsidyMrd: 6.0,
        deltaYouthSatisfaction: -2,
        deltaRetireeSatisfaction: 10,
      ),
      DecisionCard(
        id: 'card_retirement_68',
        title: 'Lebensarbeitszeit koppeln',
        subtitle: '+12 Monate Eintrittsalter & -0,55 % Beitrag',
        description:
            'Schrittweise Anpassung der Regelaltersgrenze an die steigende Lebenserwartung. Enorme Entlastung der Beitragszahler.',
        category: CardCategory.macroReform,
        artworkAssetPath: 'assets/images/cards/card_retirement_age_68.png',
        requiredSketchNotes:
            'Handzeichnung: Kalender mit Jahreszahlen 2030+ und Wegweiser zu längerem Erwerbsleben.',
        politicalCapitalCost: 30,
        deltaRetirementAge: 12.0,
        deltaContributionRate: -0.55,
        deltaYouthSatisfaction: 9,
        deltaRetireeSatisfaction: -10,
      ),
      DecisionCard(
        id: 'card_bav_matching',
        title: 'Betriebsrenten-Pflichtzuschuss',
        subtitle: 'Stärkung der 2. & 3. Säule',
        description:
            'Arbeitgeber verdoppeln freiwillige Vorsorgebeiträge bis 150 €/Monat. Senkt den Druck auf die gesetzliche Rente spürbar.',
        category: CardCategory.lifeChoice,
        artworkAssetPath: 'assets/images/cards/card_bav_matching.png',
        requiredSketchNotes:
            'Handzeichnung: Solider Handschlag vor Werkstoren mit Sparschwein.',
        politicalCapitalCost: 18,
        deltaContributionRate: -0.2,
        deltaPensionLevel: 0.2,
        deltaYouthSatisfaction: 7,
        deltaRetireeSatisfaction: 5,
      ),
      DecisionCard(
        id: 'card_market_bull',
        title: 'Globale Wachstums-Offensive',
        subtitle: '3 Jahre mind. 9,8 % Fondsrendite',
        description:
            'Öffnung des Generationenkapitals für internationale Wachstums- & Infrastrukturfonds. Hebelt den Zinseszinseffekt enorm.',
        category: CardCategory.generationCapital,
        artworkAssetPath: 'assets/images/cards/card_market_bull.png',
        requiredSketchNotes:
            'Handzeichnung: Leuchtender Bulle aus Kurven und Datenpunkten.',
        politicalCapitalCost: 20,
        deltaGenerationFundMrd: 12.0,
        deltaContributionRate: -0.15,
        deltaYouthSatisfaction: 4,
        deltaRetireeSatisfaction: 2,
        marketBoostYears: 3,
        marketBoostPercent: 9.8,
      ),
      DecisionCard(
        id: 'card_skilled_migration',
        title: 'Fachkräfte- & Erwerbspakt',
        subtitle: 'Stabile Beitragsbasis durch Zuwanderung',
        description:
            'Schnellere Anerkennung von Abschlüssen und höhere Erwerbsbeteiligung federn die Boomer-Ruhestandswelle aktiv ab (-0,45 % Beitrag).',
        category: CardCategory.macroReform,
        artworkAssetPath: 'assets/images/cards/card_boomer_wave.png',
        requiredSketchNotes:
            'Handzeichnung: Meereswelle aus Jahreszahlen (1960–1965), abgefangen durch eine stabile Brücke.',
        politicalCapitalCost: 24,
        deltaContributionRate: -0.45,
        deltaRetirementAge: 4.0,
        deltaFederalSubsidyMrd: 2.0,
        deltaYouthSatisfaction: 6,
        deltaRetireeSatisfaction: 3,
      ),
    ];
  }
}
