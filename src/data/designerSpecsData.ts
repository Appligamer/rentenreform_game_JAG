import { DesignerAssetSpec } from '../types';

export const DESIGNER_ASSET_SPECS: DesignerAssetSpec[] = [
  {
    id: 'bg_berlin',
    title: 'Szenario: Berlin Zukunfts-Skyline',
    category: 'background',
    filePath: 'assets/images/backgrounds/bg_berlin_future_skyline.png',
    dimensions: '2560 × 1440 px (16:9)',
    aspectRatio: '16:9',
    format: 'PNG-24 / WebP (max. 1.5 MB)',
    mood: 'Futuristisch, staatsmännisch, warmes Abendlicht auf Solarglas',
    instruction:
      'Reichstagsgebäude und Spree im Vordergrund. Dahinter moderne gläserne Finanz- und Zukunfts-Türme mit Solardächern. Untere 30% dunkel für UI-Lesbarkeit.',
  },
  {
    id: 'char_young_worker',
    title: 'Charakter: Berufseinsteiger (Gen Z/Alpha)',
    category: 'character',
    filePath: 'assets/images/characters/char_worker_young_neutral.png',
    dimensions: '512 × 512 px (1:1 Quadrat)',
    aspectRatio: '1:1',
    format: 'PNG-32 mit transparentem Alpha-Kanal',
    mood: 'Motiviert, nachdenklich, mit Laptop & Rucksack',
    instruction:
      'Brustbild eines jungen Menschen (ca. 22 Jahre), der 2026 ins Berufsleben startet. Klare Tusche-Outlines, moderne Kleidung.',
  },
  {
    id: 'char_boomer',
    title: 'Charakter: Babyboomer vor Ruhestand',
    category: 'character',
    filePath: 'assets/images/characters/char_boomer_satisfied.png',
    dimensions: '512 × 512 px (1:1 Quadrat)',
    aspectRatio: '1:1',
    format: 'PNG-32 mit transparentem Alpha-Kanal',
    mood: 'Entspannt, wanderbereit, lebensfroh',
    instruction:
      'Jahrgang 1962, genießt die Aussicht auf die wohlverdiente Rente. Trägt Outdoor-Weste oder Lesebrille.',
  },
  {
    id: 'char_minister',
    title: 'Charakter: Reform-Architekt / Minister',
    category: 'character',
    filePath: 'assets/images/characters/char_minister_visionary.png',
    dimensions: '512 × 512 px (1:1 Quadrat)',
    aspectRatio: '1:1',
    format: 'PNG-32 mit transparentem Alpha-Kanal',
    mood: 'Fokussiert, souverän, Aktenmappe Rentenpaket II',
    instruction:
      'Wirtschafts- und Finanzexperte am Konferenztisch mit stylischer Brille und Entwurfsmappe.',
  },
  {
    id: 'card_gen_kapital',
    title: 'Entscheidungskarte: Generationenkapital',
    category: 'card',
    filePath: 'assets/images/cards/card_generationenkapital_boost.png',
    dimensions: '600 × 900 px (2:3 Hochformat)',
    aspectRatio: '2:3',
    format: 'PNG-32, abgerundete Ecken',
    mood: 'Golden, wachsend, hoffnungsvoll',
    instruction:
      'Aus einem antiken Tresor mit Bundesadler wächst ein lebendiger Bonsai-Baum, der goldene Münzen und Kurscharts trägt.',
  },
  {
    id: 'card_haltelinie',
    title: 'Entscheidungskarte: Haltelinie 48%',
    category: 'card',
    filePath: 'assets/images/cards/card_haltelinie_48.png',
    dimensions: '600 × 900 px (2:3 Hochformat)',
    aspectRatio: '2:3',
    format: 'PNG-32, abgerundete Ecken',
    mood: 'Standhaft, blau-azurne Meeresgischt',
    instruction:
      'Mächtiger Leuchtturm mit eingemeißelter "48%", der gewaltigen Meereswogen trotzt.',
  },
  {
    id: 'badge_demography',
    title: 'Metrik-Badge: Altenquotient',
    category: 'badge',
    filePath: 'assets/images/icons/icon_demography_ratio.png',
    dimensions: '256 × 256 px',
    aspectRatio: '1:1',
    format: 'PNG-32 transparent',
    mood: 'Symbolisch, solidarisch',
    instruction:
      'Zwei junge Erwerbstätige tragen gemeinsam einen lächelnden Senior auf einer leichten Trage (Generationenvertrag).',
  },
  {
    id: 'badge_gold_fund',
    title: 'Metrik-Badge: Generationenkapital-Gold',
    category: 'badge',
    filePath: 'assets/images/icons/icon_generation_capital.png',
    dimensions: '256 × 256 px',
    aspectRatio: '1:1',
    format: 'PNG-32 transparent',
    mood: 'Edel, glänzend, warmes Gold',
    instruction:
      'Stilisierte Goldmünze mit Gravur eines Welt-Aktienindex und feinem Pfeil nach oben.',
  },
  {
    id: 'award_justice',
    title: 'Urkunde: Generationengerechtigkeit',
    category: 'award',
    filePath: 'assets/images/awards/trophy_generation_justice.png',
    dimensions: '512 × 512 px',
    aspectRatio: '1:1',
    format: 'PNG-32 transparent',
    mood: 'Glorreich, handgraviert, Medaille',
    instruction:
      'Goldmedaille mit zwei ineinandergreifenden Händen, umschlungen von Lorbeerzweigen.',
  },
];
