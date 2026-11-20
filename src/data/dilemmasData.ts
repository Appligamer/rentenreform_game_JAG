import { AnnualDilemma } from '../types';

export const ANNUAL_DILEMMAS: Record<number, AnnualDilemma> = {
  2026: {
    year: 2026,
    isMilestone: true,
    title: 'Auftakt: Das Generationenkapital im Haushaltsstreit',
    context:
      'Die Bundesregierung debattiert die Startdotierung für den kreditfinanzierten Aktienfonds. Wie stark soll der Bund investieren, bevor die Boomer-Welle anrollt?',
    historicalContext:
      'Im Rentenpaket II sind initial 12 Mrd. € Kredite pro Jahr vorgesehen, mit 3 % Steigerung, um bis Mitte der 2030er ~200 Mrd. € anzusammeln.',
    options: [
      {
        id: 'opt_gen_turbo',
        label: 'A: Turbo-Start (24 Mrd. € Kredit)',
        summary: 'Höheres Anfangsvolumen für maximale Zinseszins-Wirkung ab 2035, kostet aber Reserve & Kapital.',
        consequences: {
          generationCapitalDeltaMrd: 24,
          youthDelta: 6,
          retireeDelta: -4,
          reserveDeltaMonths: -0.15,
          capitalCost: 20,
        },
      },
      {
        id: 'opt_gen_standard',
        label: 'B: Gesetzlicher Pfad (12 Mrd. €)',
        summary: 'Der offizielle Rentenpaket-II-Kompromiss. Moderater Aufbau, ausgewogene Belastung.',
        consequences: {
          generationCapitalDeltaMrd: 12,
          youthDelta: 2,
          retireeDelta: 0,
          capitalCost: 10,
        },
      },
      {
        id: 'opt_gen_cautious',
        label: 'C: Sparvariante (Nur 6 Mrd. €)',
        summary: 'Schont die Staatsverschuldung kurzfristig, schwächt aber das Fondsvolumen spürbar.',
        consequences: {
          generationCapitalDeltaMrd: 6,
          youthDelta: -6,
          retireeDelta: 2,
          reserveDeltaMonths: 0.1,
          capitalCost: 0,
        },
      },
    ],
  },
  2027: {
    year: 2027,
    title: 'Tarifrunde & Erwerbsbeteiligung: Teilzeitfalle lösen?',
    context:
      'Millionen Fachkräfte arbeiten unfreiwillig in Teilzeit, weil Kinderbetreuung und Steuerklasse V Arbeit unattraktiv machen.',
    historicalContext:
      'Steigt die Zahl der Vollzeitäquivalente, wachsen die Beitragseinnahmen ohne Anhebung des Beitragssatzes.',
    options: [
      {
        id: 'opt_2027_kita',
        label: 'A: Kita- & Vollzeit-Offensive starten',
        summary: 'Kostet Rücklage für Anlaufkosten, bringt aber dauerhaft mehr Beitragszahler ins System.',
        consequences: {
          contributionRateDelta: -0.25,
          youthDelta: 7,
          reserveDeltaMonths: -0.15,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_2027_wait',
        label: 'B: Tarifautonomie wahren (Status Quo)',
        summary: 'Keine zusätzlichen Haushaltskosten, verpasst aber einen wichtigen Demografie-Puffer.',
        consequences: {
          youthDelta: -3,
          retireeDelta: 2,
          capitalCost: 0,
        },
      },
    ],
  },
  2028: {
    year: 2028,
    isMilestone: true,
    title: 'Zinswende & Geopolitischer Börsenknick',
    context:
      'Die Zinsen für Bundesanleihen klettern, während die Weltbörsen korrigieren. Der Zins-Spread des Generationenkapitals schrumpft.',
    historicalContext:
      'Das Generationenkapital ist marktgebunden: Fällt die globale Rendite nahe an die Kreditkosten, braucht es politischen Rückhalt.',
    options: [
      {
        id: 'opt_spread_defense',
        label: 'A: Volle Aktienquote halten (Antizyklisch kaufen)',
        summary: 'Kein Panikverkauf! Langfristige Rendite sichern, kostet jedoch politisches Kapital.',
        consequences: {
          generationCapitalDeltaMrd: 8,
          youthDelta: 4,
          retireeDelta: -5,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_spread_hedge',
        label: 'B: Sicherheits-Hedge: In Anleihen umschichten',
        summary: 'Begrenzt kurzfristiges Risiko, dämpft aber das Fondsvolumen.',
        consequences: {
          generationCapitalDeltaMrd: -4,
          youthDelta: -5,
          retireeDelta: 5,
          capitalCost: 5,
        },
      },
      {
        id: 'opt_spread_freeze',
        label: 'C: Kreditaufnahme für 1 Jahr pausieren',
        summary: 'Verhindert Neuverschuldung, reißt aber eine Lücke in den Zinseszinseffekt.',
        consequences: {
          generationCapitalDeltaMrd: -10,
          youthDelta: -9,
          reserveDeltaMonths: 0.12,
          capitalCost: 0,
        },
      },
    ],
  },
  2029: {
    year: 2029,
    title: 'Mindestlohn & Rentenpunkte-Anpassung',
    context:
      'Die Lohnuntergrenze steigt deutlich. Höhere Löhne stützen kurzfristig die Kasse, erhöhen aber langfristige Rentenansprüche.',
    historicalContext:
      'In der deutschen Rentenformel folgen Renten mit einem Jahr Verzögerung der allgemeinen Lohnentwicklung.',
    options: [
      {
        id: 'opt_2029_growth',
        label: 'A: Produktivitäts-Bonus & Weiterbildung fördern',
        summary: 'Stärkt Lohnbasis und Zufriedenheit der Erwerbstätigen gegen moderate Kapitalkosten.',
        consequences: {
          contributionRateDelta: -0.2,
          youthDelta: 6,
          retireeDelta: 3,
          reserveDeltaMonths: -0.08,
          capitalCost: 12,
        },
      },
      {
        id: 'opt_2029_neutral',
        label: 'B: Reguläre Rentenanpassung ohne Zusatzprogramm',
        summary: 'Vermeidet Haushaltsrisiken, hält aber den Beitragssatzdruck hoch.',
        consequences: {
          contributionRateDelta: 0.15,
          youthDelta: -4,
          retireeDelta: 4,
          capitalCost: 0,
        },
      },
    ],
  },
  2030: {
    year: 2030,
    isMilestone: true,
    title: 'Die Boomer-Welle bricht los: Jahrgang 1964 scheidet aus',
    context:
      'Der geburtenreichste Jahrgang der deutschen Geschichte geht in Rente. Über 1,35 Millionen Neurentner treffen auf schrumpfende Erwerbsjahrgänge.',
    historicalContext:
      'Ab 2030 kippt der Altenquotient rapide Richtung 1,6 Erwerbstätige je Rentner. Die Rentenkasse gerät unter akuten Ausgabendruck.',
    options: [
      {
        id: 'opt_boomer_tax',
        label: 'A: Bundeszuschuss dauerhaft um 10 Mrd. € erhöhen',
        summary: 'Dämpft den Beitragssatz spürbar, belastet aber die Nachhaltigkeitsreserve deutlich.',
        consequences: {
          federalSubsidyDeltaMrd: 10,
          contributionRateDelta: -0.35,
          youthDelta: 8,
          retireeDelta: 4,
          reserveDeltaMonths: -0.3,
          capitalCost: 22,
        },
      },
      {
        id: 'opt_boomer_rate_hike',
        label: 'B: Reines Umlageverfahren (Beitrag steigt)',
        summary: 'Schont die Staatskasse, aber junge Arbeitnehmer reagieren verärgert auf Netto-Verluste.',
        consequences: {
          contributionRateDelta: 0.45,
          youthDelta: -14,
          retireeDelta: 3,
          reserveDeltaMonths: 0.18,
          capitalCost: 0,
        },
      },
      {
        id: 'opt_boomer_work',
        label: 'C: Aktivrente (Steuerfreie Weiterarbeit ab 65)',
        summary: 'Hält erfahrene Fachkräfte länger im Arbeitsmarkt und entlastet beide Seiten.',
        consequences: {
          retirementAgeDeltaMonths: 4,
          contributionRateDelta: -0.25,
          youthDelta: 5,
          retireeDelta: 5,
          capitalCost: 18,
        },
      },
    ],
  },
  2031: {
    year: 2031,
    title: 'Pflege- & Gesundheitskosten im Alter',
    context:
      'Steigende Beiträge zur Pflege- und Krankenversicherung fressen einen Teil des Netto-Einkommens auf. Die Gesamt-Abgabenlast steht im Fokus.',
    historicalContext:
      'Die Gesamtsozialabgaben (Rente + Pflege + Gesundheit + Arbeit) gelten als psychologische Belastungsgrenze für Erwerbstätige.',
    options: [
      {
        id: 'opt_2031_kvdr',
        label: 'A: Reha vor Rente & Präventions-Fonds',
        summary: 'Verringert Frühverrentungen und stabilisiert den Arbeitsmarkt langfristig.',
        consequences: {
          contributionRateDelta: -0.2,
          youthDelta: 4,
          retireeDelta: 4,
          reserveDeltaMonths: -0.1,
          capitalCost: 14,
        },
      },
      {
        id: 'opt_2031_cut',
        label: 'B: Erwerbsminderungs-Zuschläge deckeln',
        summary: 'Spart Geld in der Kasse, verärgert aber Senioren und Sozialverbände.',
        consequences: {
          contributionRateDelta: -0.15,
          retireeDelta: -10,
          reserveDeltaMonths: 0.12,
          capitalCost: 0,
        },
      },
    ],
  },
  2032: {
    year: 2032,
    isMilestone: true,
    title: 'Streit um das Renteneintrittsalter: Rente mit 68?',
    context:
      'Wirtschaftsweise warnen: Ohne Anpassung der Lebensarbeitszeit droht der Beitragssatz in den nächsten Jahren die kritische Schwelle zu reißen.',
    historicalContext:
      'Jedes Jahr längere Lebensarbeitszeit spart der Rentenversicherung mehrere Milliarden Euro und erhöht gleichzeitig das Beitragsaufkommen.',
    options: [
      {
        id: 'opt_age_68',
        label: 'A: Regelaltersgrenze auf 68 anheben (+12 Mon.)',
        summary: 'Massive Entlastung für die Jugend, löst aber heftigen Protest bei älteren Jahrgängen aus.',
        consequences: {
          retirementAgeDeltaMonths: 12,
          contributionRateDelta: -0.6,
          youthDelta: 14,
          retireeDelta: -18,
          capitalCost: 28,
        },
      },
      {
        id: 'opt_age_hold',
        label: 'B: Bei Rente mit 67 bleiben',
        summary: 'Ruhe bei Senioren und Gewerkschaften, aber steigender Beitragsdruck für Erwerbstätige.',
        consequences: {
          contributionRateDelta: 0.35,
          youthDelta: -12,
          retireeDelta: 8,
          capitalCost: 0,
        },
      },
      {
        id: 'opt_age_flex',
        label: 'C: Flexibler Korridor (+6 Monate im Schnitt)',
        summary: 'Höhere Abschläge bei Frührente, attraktive Zuschläge für Freiwillige.',
        consequences: {
          retirementAgeDeltaMonths: 6,
          contributionRateDelta: -0.3,
          youthDelta: 5,
          retireeDelta: -7,
          capitalCost: 14,
        },
      },
    ],
  },
  2033: {
    year: 2033,
    title: 'Börsen-Stresstest & Staatsverschuldung',
    context:
      'Weltweite Wachstumssorgen drücken die Aktienkurse. Kritiker fordern das sofortige Ende des kreditfinanzierten Generationenkapitals.',
    historicalContext:
      'Langfristige Staatsfonds wie der norwegische Ölfonds erzielen ihre Überrendite gerade durch das Durchstehen von Crash-Jahren.',
    options: [
      {
        id: 'opt_2033_stay',
        label: 'A: Kurs halten & günstige Aktien nachkaufen',
        summary: 'Nutzt tiefe Kurse für zukünftige Gewinne, kostet aber spürbar politisches Vertrauen.',
        consequences: {
          generationCapitalDeltaMrd: 10,
          youthDelta: -4,
          retireeDelta: -6,
          capitalCost: 16,
        },
      },
      {
        id: 'opt_2033_buffer',
        label: 'B: Reserve zur Beruhigung anzapfen',
        summary: 'Stabilisiert die Stimmung, verringert aber den Liquiditätspuffer der Rentenkasse.',
        consequences: {
          youthDelta: 4,
          retireeDelta: 5,
          reserveDeltaMonths: -0.22,
          capitalCost: 5,
        },
      },
    ],
  },
  2034: {
    year: 2034,
    isMilestone: true,
    title: 'Haltelinie-Krise: Das 48 %-Versprechen wackelt',
    context:
      'Die Ausgaben für Standardrenten erreichen Rekordhöhen. Um das Rentenniveau bei 48,0 % zu halten, fehlen Milliarden in der Kasse.',
    historicalContext:
      'Rentenpaket II garantiert mindestens 48 % bis 2039. Ein Unterschreiten gilt als sozialpolitischer Tabubruch.',
    options: [
      {
        id: 'opt_haltelinie_eisen',
        label: 'A: 48 %-Haltelinie eisern garantieren',
        summary: 'Sichert das Seniorenvertrauen, zehrt aber an der Nachhaltigkeitsrücklage.',
        consequences: {
          pensionLevelDelta: 0.3,
          retireeDelta: 12,
          youthDelta: -5,
          reserveDeltaMonths: -0.32,
          capitalCost: 24,
        },
      },
      {
        id: 'opt_haltelinie_weich',
        label: 'B: Niveau moderat auf 47,3 % abfedern',
        summary: 'Entlastet die Beiträge deutlich, sorgt aber für scharfe Kritik der Seniorenverbände.',
        consequences: {
          pensionLevelDelta: -0.7,
          contributionRateDelta: -0.35,
          youthDelta: 9,
          retireeDelta: -16,
          capitalCost: 8,
        },
      },
    ],
  },
  2035: {
    year: 2035,
    isMilestone: true,
    title: 'Der Tag der Wahrheit: Erste Auszahlung Generationenkapital',
    context:
      'Planmäßig sollen ab diesem Jahr die Erträge des Generationenkapitals an die GRV fließen, um die Beitragssätze auf dem Höhepunkt zu dämpfen.',
    historicalContext:
      'Ab 2035 soll das Sondervermögen rund 10 Mrd. € jährlich zur Beitragsstabilisierung beisteuern.',
    options: [
      {
        id: 'opt_payout_full',
        label: 'A: Volle Ertrags-Ausschüttung zur Beitragsdämpfung',
        summary: 'Senkt den Beitragssatz spürbar und stärkt die Rücklage im entscheidenden Moment.',
        consequences: {
          contributionRateDelta: -0.4,
          youthDelta: 12,
          retireeDelta: 6,
          reserveDeltaMonths: 0.22,
          capitalCost: 12,
        },
      },
      {
        id: 'opt_payout_reinvest',
        label: 'B: Teil-Thesaurierung für noch stärkeres 2040',
        summary: 'Erhöht das Fondsvermögen nachhaltig, wirkt im Hier und Jetzt aber schwächer.',
        consequences: {
          contributionRateDelta: -0.15,
          generationCapitalDeltaMrd: 14,
          youthDelta: 4,
          retireeDelta: 3,
          capitalCost: 5,
        },
      },
    ],
  },
  2036: {
    year: 2036,
    title: 'KI & Automatisierung im Arbeitsmarkt',
    context:
      'Produktivitätsschübe durch Automatisierung gleichen einen Teil des Fachkräftemangels aus — doch weniger klassische Arbeitsstunden zahlen Beiträge.',
    historicalContext:
      'Ökonomen diskutieren eine breitere Finanzierungsbasis für Sozialsysteme im digitalen Zeitalter.',
    options: [
      {
        id: 'opt_2036_ai',
        label: 'A: Digital-Dividende in den Bundeszuschuss lenken',
        summary: 'Nutzt Produktivitätsgewinne für stabile Rentenbeiträge.',
        consequences: {
          federalSubsidyDeltaMrd: 6,
          contributionRateDelta: -0.25,
          youthDelta: 6,
          capitalCost: 16,
        },
      },
      {
        id: 'opt_2036_taxcut',
        label: 'B: Standort-Entlastung ohne neue Abgaben',
        summary: 'Fördert Investitionen, verschiebt die Rentenlast aber leicht nach hinten.',
        consequences: {
          youthDelta: -3,
          reserveDeltaMonths: 0.08,
          capitalCost: 0,
        },
      },
    ],
  },
  2037: {
    year: 2037,
    title: 'Stagflations-Druck & Kaufkraft-Debatte',
    context:
      'Schwaches Wachstum bei zäher Inflation setzt sowohl Reallöhne als auch Rentenkaufkraft unter Druck.',
    historicalContext:
      'In Stagflationsphasen geraten Umlage- und Kapitaldeckung gleichzeitig unter politischen Rechtfertigungsdruck.',
    options: [
      {
        id: 'opt_2037_balance',
        label: 'A: Sozialpartner-Pakt für Kaufkraft',
        summary: 'Balanciert Einmalhilfen und Lohnzurückhaltung aus, kostet etwas Reserve.',
        consequences: {
          youthDelta: 5,
          retireeDelta: 5,
          reserveDeltaMonths: -0.16,
          capitalCost: 14,
        },
      },
      {
        id: 'opt_2037_austerity',
        label: 'B: Strikte Ausgabendisziplin',
        summary: 'Hält die Kasse liquide, drückt aber auf die Stimmung beider Generationen.',
        consequences: {
          youthDelta: -6,
          retireeDelta: -6,
          reserveDeltaMonths: 0.16,
          capitalCost: 0,
        },
      },
    ],
  },
  2038: {
    year: 2038,
    isMilestone: true,
    title: 'Der Altenquotient auf historischem Tiefstand',
    context:
      'Der Höhepunkt der demografischen Transformation ist erreicht: So wenige Erwerbstätige pro Rentner wie noch nie in der Bundesrepublik.',
    historicalContext:
      'Die Jahre 2037–2039 gelten in Prognosen als der engste Flaschenhals des Generationenvertrags.',
    options: [
      {
        id: 'opt_peak_emergency',
        label: 'A: Notfall-Puffer aus Bundesmitteln freigeben',
        summary: 'Verhindert Beitragssprünge am Peak, bringt die Rücklage aber ans Limit.',
        consequences: {
          contributionRateDelta: -0.45,
          youthDelta: 8,
          retireeDelta: 6,
          reserveDeltaMonths: -0.35,
          capitalCost: 24,
        },
      },
      {
        id: 'opt_peak_shared_burden',
        label: 'B: Paritätische Lastenteilung',
        summary: 'Beide Generationen tragen einen maßvollen Teil der Spitzenlast mit.',
        consequences: {
          contributionRateDelta: 0.25,
          pensionLevelDelta: -0.25,
          youthDelta: -7,
          retireeDelta: -7,
          reserveDeltaMonths: 0.14,
          capitalCost: 8,
        },
      },
    ],
  },
  2039: {
    year: 2039,
    title: 'Stresstest kurz vor Auslaufen der Haltelinie',
    context:
      'Das letzte Jahr der gesetzlich festgeschriebenen 48 %-Garantie. Alle Parteien ringen um den Anschlussvertrag.',
    historicalContext:
      'Im Rentenpaket II war die feste Haltelinie zunächst bis 2039 befristet.',
    options: [
      {
        id: 'opt_2039_prepare',
        label: 'A: Betriebsrenten- & ETF-Zuschuss ausbauen',
        summary: 'Stärkt die 2. und 3. Säule als Vorbereitung auf die Zeit nach 2039.',
        consequences: {
          youthDelta: 8,
          retireeDelta: 2,
          reserveDeltaMonths: -0.1,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_2039_consolidate',
        label: 'B: Rücklage für die 2040er auffüllen',
        summary: 'Sichert Liquidität für den Übergang, bringt aber leichte Beitragslast.',
        consequences: {
          contributionRateDelta: 0.15,
          reserveDeltaMonths: 0.2,
          youthDelta: -4,
          capitalCost: 0,
        },
      },
    ],
  },
  2040: {
    year: 2040,
    isMilestone: true,
    title: 'Gesetzliches Auslaufen der Haltelinie 48 %',
    context:
      'Die Befristung bis 2039 ist ausgelaufen. Der Bundestag muss den Kurs bis 2045 neu festlegen.',
    historicalContext:
      'Nach 2039 stehen Politik und Gesellschaft vor der Wahl zwischen fester Haltelinie und gezielter kapitalgedeckter Ergänzung.',
    options: [
      {
        id: 'opt_haltelinie_extend',
        label: 'A: Haltelinie bis 2045 verlängern',
        summary: 'Garantiert volle gesetzliche Rente, fordert aber höchste fiskalische Disziplin.',
        consequences: {
          pensionLevelDelta: 0.6,
          retireeDelta: 12,
          youthDelta: -6,
          reserveDeltaMonths: -0.22,
          capitalCost: 26,
        },
      },
      {
        id: 'opt_haltelinie_reform',
        label: 'B: Modernes 3-Säulen-Modell mit ETF-Förderung',
        summary: 'Leicht abgesenktes Niveau wird durch staatlich bezuschusste Privatvorsorge ausgeglichen.',
        consequences: {
          pensionLevelDelta: -0.4,
          contributionRateDelta: -0.3,
          youthDelta: 12,
          retireeDelta: -5,
          capitalCost: 16,
        },
      },
    ],
  },
  2041: {
    year: 2041,
    title: 'Erste Entspannung bei den Neurentner-Zahlen',
    context:
      'Die geburtenstarken Jahrgänge sind größtenteils im Ruhestand. Der Arbeitsmarkt verzeichnet wieder leicht steigende Produktivität.',
    historicalContext:
      'Ab Anfang der 2040er Jahre flacht der demografische Anstieg spürbar ab.',
    options: [
      {
        id: 'opt_2041_fund',
        label: 'A: Überschüsse ins Generationenkapital lenken',
        summary: 'Baut den langfristigen Staatsfonds für Generation Alpha weiter aus.',
        consequences: {
          generationCapitalDeltaMrd: 12,
          youthDelta: 6,
          capitalCost: 12,
        },
      },
      {
        id: 'opt_2041_relief',
        label: 'B: Sofortige Beitragsentlastung durchziehen',
        summary: 'Senkt Beiträge für junge Haushalte unmittelbar.',
        consequences: {
          contributionRateDelta: -0.25,
          youthDelta: 8,
          reserveDeltaMonths: -0.08,
          capitalCost: 10,
        },
      },
    ],
  },
  2042: {
    year: 2042,
    title: 'Bilanz der Generationengerechtigkeit',
    context:
      'Junge Berufseinsteiger vergleichen ihre Nettobelastung mit den Rentenzusagen der älteren Generation.',
    historicalContext:
      'Nachhaltige Akzeptanz entsteht nur, wenn keine Generation das Gefühl hat, einseitig die Rechnung zu zahlen.',
    options: [
      {
        id: 'opt_2042_dialogue',
        label: 'A: Transparenz- & Vorsorgekonto für alle ab 18',
        summary: 'Stärkt Eigenverantwortung und Akzeptanz des 3-Säulen-Modells.',
        consequences: {
          youthDelta: 8,
          retireeDelta: 4,
          capitalCost: 10,
        },
      },
      {
        id: 'opt_2042_hold',
        label: 'B: Kapital für das Finale aufsparen',
        summary: 'Keine neue Ausgabe, hält politischen Spielraum für 2043/44 frei.',
        consequences: {
          reserveDeltaMonths: 0.08,
          capitalCost: 0,
        },
      },
    ],
  },
  2043: {
    year: 2043,
    isMilestone: true,
    title: 'Das Finale der Boomer-Welle',
    context:
      'Die Ziellinie ist in Sicht: Die demografische Kurve dreht langsam. Gelingt der dauerhafte Durchbruch?',
    historicalContext:
      'Mitte der 2040er Jahre normalisiert sich das Verhältnis von Erwerbstätigen und Rentnern allmählich.',
    options: [
      {
        id: 'opt_victory_lap',
        label: 'A: Volle Rendite zur Beitragsstabilisierung nutzen',
        summary: 'Drückt den Beitragssatz auf den Zielpfad und sichert breite Zufriedenheit.',
        consequences: {
          contributionRateDelta: -0.45,
          youthDelta: 10,
          retireeDelta: 8,
          reserveDeltaMonths: 0.18,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_victory_reserve',
        label: 'B: Staatsfonds für Generation Alpha zementieren',
        summary: 'Schreibt das Generationenkapital als unantastbares Sondervermögen fest.',
        consequences: {
          generationCapitalDeltaMrd: 22,
          youthDelta: 9,
          retireeDelta: 4,
          capitalCost: 18,
        },
      },
    ],
  },
  2044: {
    year: 2044,
    title: 'Abschluss-Haushalt 2044: Übergang in die Stabilität',
    context:
      'Das letzte Reformjahr vor dem historischen Ziel 2045. Sichere das Erreichte gegen letzte Turbulenzen ab.',
    historicalContext:
      'Ein verlässliches Rentensystem schafft Planungs- und Investitionssicherheit über Generationen hinweg.',
    options: [
      {
        id: 'opt_2044_gold',
        label: 'A: Generationenpakt final besiegeln',
        summary: 'Stärkt Rücklage und Vertrauen beider Generationen für die Zielgerade.',
        consequences: {
          youthDelta: 6,
          retireeDelta: 6,
          reserveDeltaMonths: 0.15,
          capitalCost: 12,
        },
      },
      {
        id: 'opt_2044_lean',
        label: 'B: Stabilen Kurs ohne Zusatzkosten halten',
        summary: 'Solide Fortführung der bisherigen Strategie bis ins Zieljahr 2045.',
        consequences: {
          youthDelta: 2,
          retireeDelta: 2,
          capitalCost: 0,
        },
      },
    ],
  },
};

export function getDilemmaForYear(year: number): AnnualDilemma | undefined {
  return ANNUAL_DILEMMAS[year];
}
