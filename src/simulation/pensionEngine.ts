import { MacroState, CitizenProfile } from '../types';

export class PensionMathEngine {
  /**
   * Startzustand für 2026 basierend auf Daten der Deutschen Rentenversicherung
   * und den Annahmen des Bundesfinanzministeriums zum Rentenpaket II.
   */
  static getInitialState(): MacroState {
    return {
      year: 2026,
      contributorsCount: 45.5,
      pensionersCount: 21.2,
      contributionRate: 18.6,
      pensionLevel: 48.0,
      generationCapitalFund: 24.5,
      marketReturnPercent: 6.5,
      federalSubsidy: 112.0,
      averageGrossSalary: 45358,
      currentPensionValue: 39.32,
      fundPayoutToGRV: 0.0,
    };
  }

  /**
   * Berechnet den demografischen Verlauf für Beitragszahler & Rentner
   */
  static getDemography(year: number): { contributors: number; pensioners: number } {
    if (year <= 2026) return { contributors: 45.5, pensioners: 21.2 };
    const progress = Math.min(1.0, Math.max(0.0, (year - 2026) / 14.0));
    // Sigmoider Übergang durch den Ruhestand der geburtenstarken Jahrgänge 1955-1969
    const sigmoid = 1 / (1 + Math.exp(-6 * (progress - 0.5)));
    const contributors = 45.5 - 4.3 * sigmoid;
    const pensioners = 21.2 + 4.6 * sigmoid;
    return { contributors, pensioners };
  }

  /**
   * Führt einen Runden-Schritt um 1 Jahr aus
   */
  static stepYear(
    current: MacroState,
    options: {
      extraCapitalCreditMrd: number;
      marketReturnOverride?: number;
      retirementAgeShiftMonths: number;
      federalSubsidyDeltaMrd: number;
      forceHaltelinie48: boolean;
    }
  ): MacroState {
    const nextYear = current.year + 1;
    const { contributors: rawContributors, pensioners: rawPensioners } =
      this.getDemography(nextYear);

    // Auswirkung einer Anhebung des Rentenalters
    const shiftEffect = (options.retirementAgeShiftMonths / 12.0) * 0.45;
    const contributors = rawContributors + shiftEffect;
    const pensioners = Math.max(18.0, rawPensioners - shiftEffect);

    // Generationenkapital Berechnung
    const yearsSince2024 = Math.max(0, nextYear - 2024);
    // Gesetzliche 12 Mrd. € + 3% Dynamik
    const legalCredit = 12.0 * Math.pow(1.03, yearsSince2024);
    const totalCreditInflow = legalCredit + options.extraCapitalCreditMrd;

    const marketReturn = options.marketReturnOverride ?? current.marketReturnPercent;
    const loanInterestRate = 2.6; // Refinanzierung Bund
    const netReturnRate = (marketReturn - loanInterestRate) / 100.0;
    const fundGrowth = current.generationCapitalFund * netReturnRate;

    // Ausschüttung an die GRV zur Beitragsdämpfung ab 2035
    let payoutToGRV = 0.0;
    if (nextYear >= 2035 && current.generationCapitalFund > 70.0) {
      payoutToGRV = Math.min(10.0, current.generationCapitalFund * 0.045);
    }

    const nextFund = Math.max(
      0.0,
      current.generationCapitalFund + fundGrowth + totalCreditInflow - payoutToGRV
    );

    // Lohn- und Rentenwertentwicklung (+2.2% p.a.)
    const nextSalary = Math.round(current.averageGrossSalary * 1.022);
    const nextPensionValue = Number((current.currentPensionValue * 1.022).toFixed(2));

    // Bundeszuschuss
    const nextFederalSubsidy = Number(
      (current.federalSubsidy * 1.025 + options.federalSubsidyDeltaMrd).toFixed(1)
    );

    // Gesamtausgaben der Rentenversicherung (in Mrd. €)
    const annualSpendMrd =
      (pensioners * (nextPensionValue * 36.0 * 12.0)) / 1000.0;

    // Zu deckende Ausgaben über Beiträge
    const neededContributionSpend = Math.max(
      100.0,
      annualSpendMrd - nextFederalSubsidy - payoutToGRV
    );

    // Beitragsbemessungsgrundlage
    const wageBaseMrd = (contributors * nextSalary) / 1000.0;

    // Erforderlicher mathematischer Beitragssatz
    let calculatedRate = (neededContributionSpend / wageBaseMrd) * 100.0;

    // Haltelinie Rentenniveau
    let nextPensionLevel = 48.0;
    if (!options.forceHaltelinie48 && nextYear > 2039) {
      nextPensionLevel = Number((48.0 - 0.2 * (nextYear - 2039)).toFixed(1));
    }

    return {
      year: nextYear,
      contributorsCount: Number(contributors.toFixed(2)),
      pensionersCount: Number(pensioners.toFixed(2)),
      contributionRate: Number(calculatedRate.toFixed(2)),
      pensionLevel: nextPensionLevel,
      generationCapitalFund: Number(nextFund.toFixed(1)),
      marketReturnPercent: marketReturn,
      federalSubsidy: nextFederalSubsidy,
      averageGrossSalary: nextSalary,
      currentPensionValue: nextPensionValue,
      fundPayoutToGRV: Number(payoutToGRV.toFixed(2)),
    };
  }

  /**
   * Berechnet den individuellen Rentenstatus für einen Bürger
   */
  static calculateCitizen(
    profile: CitizenProfile,
    macro: MacroState
  ): {
    statutoryPensionMonthly: number;
    privatePensionMonthly: number;
    bavPensionMonthly: number;
    totalPensionMonthly: number;
    targetPensionMonthly: number;
    pensionGapMonthly: number;
  } {
    // Gesetzliche Rente = Entgeltpunkte × Rentenwert
    const statutoryPensionMonthly = Math.round(
      profile.accumulatedPoints * macro.currentPensionValue
    );

    // Privatrente aus Depot (4% Entnahmerate)
    const privatePensionMonthly = Math.round(
      (profile.etfPortfolioValue * 0.04) / 12.0
    );

    // Betriebsrente
    const bavPensionMonthly = Math.round(
      profile.bavMonthlySavings * 3.2
    );

    const totalPensionMonthly =
      statutoryPensionMonthly + privatePensionMonthly + bavPensionMonthly;

    // Ziel: 75% des aktuellen Nettogehalts (ca. 60% vom Brutto)
    const targetPensionMonthly = Math.round(
      (profile.grossIncome * 0.58) / 12.0
    );

    const pensionGapMonthly = targetPensionMonthly - totalPensionMonthly;

    return {
      statutoryPensionMonthly,
      privatePensionMonthly,
      bavPensionMonthly,
      totalPensionMonthly,
      targetPensionMonthly,
      pensionGapMonthly,
    };
  }
}
