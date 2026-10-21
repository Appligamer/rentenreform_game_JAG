import { DecisionCard } from '../types';

export const DECISION_CARDS: DecisionCard[] = [
  {
    id: 'card_gen_turbo',
    title: 'Generationenkapital-Turbo',
    subtitle: 'Kreditvolumen um 25 Mrd. € steigern',
    description:
      'Der Bund nimmt zusätzliche Bundesanleihen auf, um den globalen Aktienstock schneller zu dotieren. Erhöht die zukünftige Beitragsdämpfung ab 2035.',
    category: 'generation_capital',
    artworkAssetPath: 'assets/images/cards/card_generationenkapital_boost.png',
    designerNotes:
      'Handzeichnung: Golden schimmernder Setzling, der aus einem Tresor mit Bundesadler wächst und Kurscharts trägt.',
    dimensions: '600 × 900 px (2:3 Ratio)',
    politicalCapitalCost: 35,
    deltaContributionRate: -0.4,
    deltaPensionLevel: 0.0,
    deltaGenerationFundMrd: 25.0,
    deltaRetirementAgeMonths: 0,
    deltaFederalSubsidyMrd: 0,
  },
  {
    id: 'card_haltelinie_48',
    title: 'Haltelinie 48% garantieren',
    subtitle: 'Rentenpaket II Kernversprechen',
    description:
      'Sichert das gesetzliche Rentenniveau bis mindestens 2039 gesetzlich ab. Verhindert Kaufkraftverlust für Standardrentner, belastet aber den Bundeshaushalt.',
    category: 'macro',
    artworkAssetPath: 'assets/images/cards/card_haltelinie_48.png',
    designerNotes:
      'Handzeichnung: Robuster antiker Leuchtturm mit "48%" Gravur, der tosenden Meereswellen standhält.',
    dimensions: '600 × 900 px (2:3 Ratio)',
    politicalCapitalCost: 30,
    deltaContributionRate: 0.2,
    deltaPensionLevel: 0.8,
    deltaGenerationFundMrd: 0,
    deltaRetirementAgeMonths: 0,
    deltaFederalSubsidyMrd: 5.0,
  },
  {
    id: 'card_retirement_68',
    title: 'Renteneintrittsalter auf 68',
    subtitle: 'Demografischer Ausgleich',
    description:
      'Schrittweise Anhebung des Regelalters um 12 Monate. Erhöht die Zahl aktiver Beitragszahler und verringert die Rentenbezugsdauer, erfordert aber hohen politischen Einsatz.',
    category: 'macro',
    artworkAssetPath: 'assets/images/cards/card_retirement_age_68.png',
    designerNotes:
      'Handzeichnung: Kalenderblatt, das nach vorne geblättert wird, daneben Wanderstock und Wegweiser in die Zukunft.',
    dimensions: '600 × 900 px (2:3 Ratio)',
    politicalCapitalCost: 45,
    deltaContributionRate: -0.7,
    deltaPensionLevel: 0.0,
    deltaGenerationFundMrd: 0,
    deltaRetirementAgeMonths: 12,
    deltaFederalSubsidyMrd: -3.0,
  },
  {
    id: 'card_bav_matching',
    title: 'Betriebsrenten-Pflichtzuschuss',
    subtitle: 'Stärkung der 2. Säule',
    description:
      'Arbeitgeber verdoppeln freiwillige Arbeitnehmerbeiträge bis 150 €/Monat. Schließt effektiv die Rentenlücke der Mittelschicht.',
    category: 'life',
    artworkAssetPath: 'assets/images/cards/card_bav_matching.png',
    designerNotes:
      'Handzeichnung: Vertrauensvoller Handschlag zwischen Arbeitnehmer und Werksleiter vor Fabriksilhouette mit Sparschwein.',
    dimensions: '600 × 900 px (2:3 Ratio)',
    politicalCapitalCost: 25,
    deltaContributionRate: 0.0,
    deltaPensionLevel: 0.0,
    deltaGenerationFundMrd: 0,
    deltaRetirementAgeMonths: 0,
    deltaFederalSubsidyMrd: 0,
  },
  {
    id: 'card_market_bull',
    title: 'Globaler Tech- & KI-Boom',
    subtitle: 'Kapitalmarktrendite springt auf 9.8%',
    description:
      'Starkes weltweites Wirtschaftswachstum lässt das Portfolio des Generationenkapitals rasant anwachsen.',
    category: 'generation_capital',
    artworkAssetPath: 'assets/images/cards/card_market_bull.png',
    designerNotes:
      'Handzeichnung: Dynamischer, eleganter Bulle aus Licht- und Chartlinien, der nach oben stürmt.',
    dimensions: '600 × 900 px (2:3 Ratio)',
    politicalCapitalCost: 20,
    deltaContributionRate: -0.3,
    deltaPensionLevel: 0.0,
    deltaGenerationFundMrd: 15.0,
    deltaRetirementAgeMonths: 0,
    deltaFederalSubsidyMrd: 0,
  },
  {
    id: 'card_demographic_shock',
    title: 'Babyboomer-Ruhestandswelle',
    subtitle: 'Demografischer Kipppunkt',
    description:
      'Der geburtenstärkste Jahrgang 1964 scheidet aus dem Erwerbsleben aus. Der Altenquotient sinkt unter 1.6 Zahler je Rentner.',
    category: 'crisis',
    artworkAssetPath: 'assets/images/cards/card_boomer_wave.png',
    designerNotes:
      'Handzeichnung: Gewaltige Meereswelle aus Jahreszahlen (1960–1965), die auf eine schmale Hängebrücke zurollt.',
    dimensions: '600 × 900 px (2:3 Ratio)',
    politicalCapitalCost: 10,
    deltaContributionRate: 0.5,
    deltaPensionLevel: 0.0,
    deltaGenerationFundMrd: 0,
    deltaRetirementAgeMonths: 0,
    deltaFederalSubsidyMrd: 4.0,
  },
];
