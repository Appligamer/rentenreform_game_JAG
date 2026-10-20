import '../models/decision_card.dart';

/// Vordefinierte Ereignis-, Reform- und Stresstest-Karten für den Spielverlauf.
class GameEventsCatalog {
  static List<DecisionCard> getAvailableCards() {
    return [
      const DecisionCard(
        id: 'gen_kapital_turbo',
        title: 'Generationenkapital-Turbo',
        subtitle: 'Kreditvolumen verdoppeln',
        description:
            'Der Bund nimmt zusätzliche 20 Mrd. € Kredite auf, um den globalen Aktienstock rascher aufzubauen.',
        category: CardCategory.generationCapital,
        artworkAssetPath: 'assets/images/cards/card_generationenkapital_boost.png',
        requiredSketchNotes:
            'Handzeichnung: Stilisierter Baum aus Bundesadler-Tresor mit wachsenden Goldmünzen/Charts.',
        deltaGenerationFundMrd: 20.0,
        deltaContributionRate: -0.3,
      ),
      const DecisionCard(
        id: 'haltelinie_garantie',
        title: 'Haltelinie 48% zementieren',
        subtitle: 'Rentenpaket II Kernversprechen',
        description:
            'Verhindert Absinken des Rentenniveaus unter 48%. Schützt Rentner vor Kaufkraftverlust, erfordert aber höhere Deckung.',
        category: CardCategory.macroReform,
        artworkAssetPath: 'assets/images/cards/card_haltelinie_48.png',
        requiredSketchNotes:
            'Handzeichnung: Majestätischer Leuchtturm mit 48%-Markierung, der Wellen trotzt.',
        deltaPensionLevel: 0.5,
      ),
      const DecisionCard(
        id: 'rente_mit_68',
        title: 'Renteneintrittsalter auf 68',
        subtitle: 'Demografische Anpassung',
        description:
            'Kopplung der Lebensarbeitszeit an die steigende Lebenserwartung entlastet die Rentenkasse spürbar.',
        category: CardCategory.macroReform,
        artworkAssetPath: 'assets/images/cards/card_retirement_age_68.png',
        requiredSketchNotes:
            'Handzeichnung: Kalender mit Jahreszahlen 2030+ und Wegweiser zu längerem Erwerbsleben.',
        deltaRetirementAge: 12.0,
        deltaContributionRate: -0.6,
      ),
      const DecisionCard(
        id: 'boersen_rallye',
        title: 'Globaler Tech-Boom',
        subtitle: 'Kapitalmarktrendite springt auf 9.5%',
        description:
            'Hohe Kursgewinne an den Weltbörsen lassen das Generationenkapital überdurchschnittlich stark wachsen.',
        category: CardCategory.externalEvent,
        artworkAssetPath: 'assets/images/cards/card_market_bull.png',
        requiredSketchNotes:
            'Handzeichnung: Leuchtender Bulle aus Kurven und Datenpunkten.',
        deltaContributionRate: -0.2,
      ),
      const DecisionCard(
        id: 'finanzkrise_stresstest',
        title: 'Börsen-Korrektur (-4.0% Rendite)',
        subtitle: 'Stresstest für Aktienrente',
        description:
            'Geopolitische Spannungen dämpfen die Aktienrendite für 2 Jahre. Beweist die Notwendigkeit breiter Diversifikation.',
        category: CardCategory.externalEvent,
        artworkAssetPath: 'assets/images/cards/card_market_bear.png',
        requiredSketchNotes:
            'Handzeichnung: Trotziger Bär im Sturm vor abwärts zeigenden Diagrammen.',
        deltaContributionRate: 0.2,
      ),
      const DecisionCard(
        id: 'bav_offensive',
        title: 'Betriebsrenten-Offensive',
        subtitle: '2. Säule verpflichtend bezuschussen',
        description:
            'Arbeitgeber zahlen 20% Pflichtzuschuss zur bAV. Schließt individuelle Rentenlücken breiter Bevölkerungsschichten.',
        category: CardCategory.lifeChoice,
        artworkAssetPath: 'assets/images/cards/card_bav_matching.png',
        requiredSketchNotes:
            'Handzeichnung: Solider Handschlag vor Werkstoren mit Sparschwein.',
        deltaContributionRate: 0.0,
      ),
    ];
  }
}
