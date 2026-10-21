import { AnnualDilemma } from '../types';

export const ANNUAL_DILEMMAS: Record<number, AnnualDilemma> = {
  2026: {
    year: 2026,
    title: 'Auftakt: Das Generationenkapital im Haushaltsstreit',
    context:
      'Die Bundesregierung debattiert die Startdotierung für den kreditfinanzierten Aktienfonds. Wie viele Schulden soll der Bund aufnehmen, um in globale Aktienmärkte zu investieren?',
    historicalContext:
      'Im Rentenpaket II sind initial 12 Mrd. € Kredite pro Jahr vorgesehen, mit 3% Steigerung, um bis Mitte der 2030er ~200 Mrd. € anzusammeln.',
    options: [
      {
        id: 'opt_gen_turbo',
        label: 'A: Turbo-Start (24 Mrd. € Kredit)',
        summary: 'Höheres Anfangsvolumen und maximale spätere Beitragsdämpfung, aber starker Widerstand der Haushaltsprüfer.',
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
        summary: 'Der offizielle Rentenpaket-II-Kompromiss. Moderater Aufbau, tragbare Zinslast.',
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
        summary: 'Schont die Staatsverschuldung, schwächt aber das Fondsvolumen für die 2030er Jahre massiv.',
        consequences: {
          generationCapitalDeltaMrd: 6,
          youthDelta: -8,
          retireeDelta: 2,
          reserveDeltaMonths: 0.1,
          capitalCost: 0,
        },
      },
    ],
  },
  2028: {
    year: 2028,
    title: 'Zinswende & Geopolitischer Börsenknick',
    context:
      'Die Zinsen für Bundesanleihen klettern auf 3,4%, während die Weltbörsen eine Korrektur durchleben. Der Zins-Spread des Generationenkapitals schrumpft temporär zusammen.',
    historicalContext:
      'Das Generationenkapital ist marktgebunden: Fällt die globale Rendite unter die Kreditkosten des Bundes, droht kurzfristig ein Defizit.',
    options: [
      {
        id: 'opt_spread_defense',
        label: 'A: Volle Aktienquote beibehalten (Risiko wagen)',
        summary: 'Kein Panikverkauf! Langfristige Rendite sichern, erfordert aber Nerven bei den Wählern.',
        consequences: {
          youthDelta: 4,
          retireeDelta: -6,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_spread_hedge',
        label: 'B: Sicherheits-Hedge: In Anleihen umschichten',
        summary: 'Begrenzt das Risiko, drosselt jedoch das langfristige Renditepotenzial auf 4,2%.',
        consequences: {
          generationCapitalDeltaMrd: -5,
          youthDelta: -6,
          retireeDelta: 5,
          capitalCost: 5,
        },
      },
      {
        id: 'opt_spread_freeze',
        label: 'C: Kreditaufnahme für 1 Jahr pausieren',
        summary: 'Verhindert Neuverschuldung, reißt aber eine spürbare Lücke in den Zinseszinseffekt.',
        consequences: {
          generationCapitalDeltaMrd: -12,
          youthDelta: -12,
          reserveDeltaMonths: 0.1,
          capitalCost: 0,
        },
      },
    ],
  },
  2030: {
    year: 2030,
    title: 'Die Boomer-Welle bricht los: Jahrgang 1964 scheidet aus',
    context:
      'Der geburtenreichste Jahrgang der deutschen Geschichte geht in Rente. Über 1,35 Millionen Neurentner treffen auf einen schrumpfenden Jahrgang an Berufseinsteigern.',
    historicalContext:
      'Ab 2030 kippt der Altenquotient rapide von 2,0 auf unter 1,6 Erwerbstätige je Rentner. Die Rentenkasse gerät unter akuten Ausgabendruck.',
    options: [
      {
        id: 'opt_boomer_tax',
        label: 'A: Bundeszuschuss aus Steuermitteln um 12 Mrd. € erhöhen',
        summary: 'Dämpft den Beitragssatz sofort, belastet aber die Nachhaltigkeitsreserve des Bundeshaushalts.',
        consequences: {
          contributionRateDelta: -0.4,
          youthDelta: 8,
          retireeDelta: 4,
          reserveDeltaMonths: -0.35,
          capitalCost: 25,
        },
      },
      {
        id: 'opt_boomer_rate_hike',
        label: 'B: Beitragssatz steigen lassen (+0.6%)',
        summary: 'Reines Umlageverfahren. Schont den Staatshaushalt, aber junge Arbeitnehmer revoltieren wegen Kaufkraftverlust.',
        consequences: {
          contributionRateDelta: 0.6,
          youthDelta: -18,
          retireeDelta: 4,
          reserveDeltaMonths: 0.15,
          capitalCost: 5,
        },
      },
      {
        id: 'opt_boomer_work',
        label: 'C: Freiwillige Weiterarbeit (Aktivrente steuerfrei)',
        summary: 'Steuerbefreiung für Weiterarbeit nach 65 Jahren hält 250.000 Fachkräfte im System.',
        consequences: {
          contributionRateDelta: -0.25,
          youthDelta: 5,
          retireeDelta: 6,
          capitalCost: 20,
        },
      },
    ],
  },
  2032: {
    year: 2032,
    title: 'Streit um das Renteneintrittsalter: Rente mit 68?',
    context:
      'Wirtschaftsweise und Arbeitgeberverbände warnen: Ohne Erhöhung der Regelaltersgrenze wird der Beitragssatz 2035 die 23%-Mauer durchbrechen.',
    historicalContext:
      'Jedes Jahr längere Lebensarbeitszeit spart der Rentenversicherung rechnerisch rund 5 Mrd. € Ausgaben und bringt 3 Mrd. € Beiträge.',
    options: [
      {
        id: 'opt_age_68',
        label: 'A: Rente schrittweise auf 68 anheben (+12 Monate)',
        summary: 'Enorme Entlastung für Beitragszahler, führt jedoch zu landesweiten Senioren- und Gewerkschaftsprotesten.',
        consequences: {
          retirementAgeDeltaMonths: 12,
          contributionRateDelta: -0.7,
          youthDelta: 16,
          retireeDelta: -22,
          capitalCost: 35,
        },
      },
      {
        id: 'opt_age_hold',
        label: 'B: Bei Rente mit 67 bleiben (Keine Anhebung)',
        summary: 'Senioren sind zufrieden, aber die gesamte Finanzierungslast wandert ungedämpft auf die Schultern der Jugend.',
        consequences: {
          contributionRateDelta: 0.4,
          youthDelta: -14,
          retireeDelta: 8,
          capitalCost: 0,
        },
      },
      {
        id: 'opt_age_flex',
        label: 'C: Flexibler Korridor mit Rentenabschlägen',
        summary: 'Wer früher geht, verliert 0,4% Rente pro Monat; wer länger bleibt, bekommt 0,6% Zuschlag.',
        consequences: {
          retirementAgeDeltaMonths: 6,
          contributionRateDelta: -0.3,
          youthDelta: 6,
          retireeDelta: -8,
          capitalCost: 15,
        },
      },
    ],
  },
  2034: {
    year: 2034,
    title: 'Haltelinie-Krise: Das 48%-Versprechen wackelt',
    context:
      'Die Ausgaben für Standardrenten erreichen 360 Mrd. €. Um das gesetzliche Rentenniveau bei mindestens 48% zu halten, fehlen 15 Mrd. € in der Kasse.',
    historicalContext:
      'Rentenpaket II garantiert mindestens 48% bis 2039. Fällt das Niveau darunter, droht Massenarmut unter Rentnern.',
    options: [
      {
        id: 'opt_haltelinie_eisen',
        label: 'A: 48%-Haltelinie eisern durch Steuerzuschuss garantieren',
        summary: 'Seniorenvertrauen gerettet, aber die Staatsreserve schmilzt dramatisch ab.',
        consequences: {
          pensionLevelDelta: 0.4,
          retireeDelta: 15,
          youthDelta: -4,
          reserveDeltaMonths: -0.4,
          capitalCost: 30,
        },
      },
      {
        id: 'opt_haltelinie_weich',
        label: 'B: Haltelinie temporär auf 47,2% absenken',
        summary: 'Schont Beiträge und Haushalt, löst aber Empörung bei den Rentnern aus.',
        consequences: {
          pensionLevelDelta: -0.8,
          contributionRateDelta: -0.4,
          youthDelta: 10,
          retireeDelta: -20,
          capitalCost: 10,
        },
      },
    ],
  },
  2035: {
    year: 2035,
    title: 'Der Tag der Wahrheit: Erste Auszahlung aus dem Generationenkapital',
    context:
      'Das Generationenkapital soll ab heute planmäßig die Rentenbeiträge dämpfen. 10 Mrd. € Fondsausschüttung stehen bereit!',
    historicalContext:
      'Ab 2035 soll die gesetzliche Aktienrente nach Rentenpaket II Erträge an die Rentenversicherung überweisen, um den Beitragssatz zu stabilisieren.',
    options: [
      {
        id: 'opt_payout_full',
        label: 'A: Volle Ausschüttung (10 Mrd. €) zur Beitragsdämpfung',
        summary: 'Senkt den Beitragssatz sofort um 0,4 Prozentpunkte. Die Reform beweist ihren Wert!',
        consequences: {
          contributionRateDelta: -0.4,
          youthDelta: 14,
          retireeDelta: 8,
          reserveDeltaMonths: 0.2,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_payout_reinvest',
        label: 'B: Nur 5 Mrd. € entnehmen, Rest weiter thesaurieren',
        summary: 'Stärkt den Fonds für 2040, dämpft aber die Beiträge im Hier und Jetzt nur halb so stark.',
        consequences: {
          contributionRateDelta: -0.2,
          generationCapitalDeltaMrd: 15,
          youthDelta: 4,
          retireeDelta: 4,
          capitalCost: 5,
        },
      },
    ],
  },
  2038: {
    year: 2038,
    title: 'Der Altenquotient auf historischem Tiefstand: 1,48 : 1',
    context:
      'Ein historischer Tiefpunkt: Auf 100 Rentner kommen nur noch 148 Erwerbstätige. Jeder Schock droht das System kippen zu lassen.',
    historicalContext:
      '2038 gilt in allen demografischen Modellen als der gefährlichste Punkt des Generationenvertrags.',
    options: [
      {
        id: 'opt_peak_emergency',
        label: 'A: Not-Fonds des Bundes aktivieren (15 Mrd. €)',
        summary: 'Verhindert den Kollaps der Rentenkasse, bringt die Haushaltsreserve aber an den Rand der Zahlungsunfähigkeit.',
        consequences: {
          contributionRateDelta: -0.5,
          youthDelta: 8,
          retireeDelta: 6,
          reserveDeltaMonths: -0.5,
          capitalCost: 30,
        },
      },
      {
        id: 'opt_peak_shared_burden',
        label: 'B: Paritätische Lastenteilung (Beitrag +0.3%, Rente -0.3%)',
        summary: 'Ein harter Kompromiss: Jugend und Senioren müssen gleichermaßen bluten.',
        consequences: {
          contributionRateDelta: 0.3,
          pensionLevelDelta: -0.3,
          youthDelta: -8,
          retireeDelta: -8,
          reserveDeltaMonths: 0.1,
          capitalCost: 10,
        },
      },
    ],
  },
  2040: {
    year: 2040,
    title: 'Gesetzliches Auslaufen der Haltelinie 48%',
    context:
      'Die im Rentenpaket II festgeschriebene Befristung bis 2039 ist abgelaufen. Der Bundestag muss über die Zukunft bis 2045 entscheiden.',
    historicalContext:
      'Rentenpaket II legte die Haltelinie bis mindestens 2039 fest. Ab 2040 muss eine neue gesetzliche Regelung greifen.',
    options: [
      {
        id: 'opt_haltelinie_extend',
        label: 'A: Haltelinie bis 2045 verlängern',
        summary: 'Zementiert das Niveau, erfordert aber höchste Disziplin bei anderen Staatsausgaben.',
        consequences: {
          pensionLevelDelta: 0.8,
          retireeDelta: 16,
          youthDelta: -6,
          reserveDeltaMonths: -0.25,
          capitalCost: 35,
        },
      },
      {
        id: 'opt_haltelinie_reform',
        label: 'B: Flexibles 3-Säulen-Modell mit steuerfreiem ETF-Sparplan',
        summary: 'Gesetzliches Niveau sinkt leicht auf 47,4%, aber private Aktienrente wird mit 20% staatlicher Zulage gefördert.',
        consequences: {
          pensionLevelDelta: -0.6,
          contributionRateDelta: -0.3,
          youthDelta: 14,
          retireeDelta: -6,
          capitalCost: 20,
        },
      },
    ],
  },
  2043: {
    year: 2043,
    title: 'Das Finale der Boomer-Welle',
    context:
      'Die Ziellinie ist in Sicht: Erste Jahrgänge der Boomer verlassen die Statistik, die demografische Kurve entspannt sich langsam. Gelingt der Durchbruch?',
    historicalContext:
      'Ab Mitte der 2040er Jahre stabilisiert sich das Verhältnis von Beitragszahlern zu Rentnern wieder.',
    options: [
      {
        id: 'opt_victory_lap',
        label: 'A: Generationenkapital-Rendite voll ausschütten',
        summary: 'Erfolgreicher Abschluss: Beitragssatz wird unter 21,5% gedrückt, Haltelinie bleibt gewahrt.',
        consequences: {
          contributionRateDelta: -0.6,
          youthDelta: 14,
          retireeDelta: 10,
          reserveDeltaMonths: 0.2,
          capitalCost: 15,
        },
      },
      {
        id: 'opt_victory_reserve',
        label: 'B: Dauerhaften Staatsfonds für Generation Alpha verankern',
        summary: 'Das Generationenkapital wird als unantastbares Sondervermögen für die nächsten 50 Jahre festgeschrieben.',
        consequences: {
          generationCapitalDeltaMrd: 25,
          youthDelta: 12,
          retireeDelta: 4,
          capitalCost: 20,
        },
      },
    ],
  },
};
