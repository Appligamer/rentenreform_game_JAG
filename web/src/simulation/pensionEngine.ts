import { MacroState, CitizenProfile, PolicyModifiers } from '../types';
import { DemographyModel } from './demographyModel';
import { GenerationCapitalEngine } from './generationCapitalEngine';

/**
 * Kalibrierungsfaktoren für die Deutsche Rentenversicherung (2026):
 * - Erwerbstätige gesamt (45,5 Mio.) vs. beitragspflichtiges Entgeltvolumen (~84,6 % Anteil)
 * - Gesamtausgaben GRV inkl. KVdR, Reha und Hinterbliebenenrenten (~1,215x Standardrenten-Basis)
 * Damit startet 2026 exakt bei 18,6 % Beitragssatz und steigt ohne Reformen bis Mitte 2030er auf > 22,3 %.
 */
const GRV_EXPENSE_CALIBRATION = 1.215;
const EFFECTIVE_WAGE_SHARE = 0.846;

export class PensionMathEngine {
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

  static getInitialModifiers(): PolicyModifiers {
    return {
      extraCapitalCreditMrd: 0,
      retirementShiftMonths: 0,
      structuralContributionDelta: 0,
      structuralPensionLevelDelta: 0,
      recurringFederalSubsidyDeltaMrd: 0,
      marketBoostYearsRemaining: 0,
      marketBoostPercent: 0,
      forceHaltelinie48: true,
    };
  }

  static getDemography(year: number): { contributors: number; pensioners: number } {
    const d = DemographyModel.getDemography(year);
    return { contributors: d.contributors, pensioners: d.pensioners };
  }

  static stepYear(
    current: MacroState,
    options: {
      extraCapitalCreditMrd: number;
      marketReturnOverride?: number;
      loanInterestRatePercent?: number;
      retirementAgeShiftMonths: number;
      federalSubsidyDeltaMrd: number;
      structuralContributionDelta?: number;
      structuralPensionLevelDelta?: number;
      forceHaltelinie48: boolean;
    }
  ): MacroState {
    const nextYear = current.year + 1;
    const rawDemo = DemographyModel.getDemography(nextYear);

    // Anhebung des Rentenalters erhöht Beitragszahler und reduziert Rentenbezieher
    const shiftEffect = (options.retirementAgeShiftMonths / 12.0) * 0.55;
    const contributors = Math.max(36.0, rawDemo.contributors + shiftEffect);
    const pensioners = Math.max(18.0, rawDemo.pensioners - shiftEffect);

    const marketReturn = options.marketReturnOverride ?? current.marketReturnPercent;
    const loanRate = options.loanInterestRatePercent ?? 2.6;

    const fundResult = GenerationCapitalEngine.stepFund({
      currentFundMrd: current.generationCapitalFund,
      nextYear,
      marketReturnPercent: marketReturn,
      loanInterestRatePercent: loanRate,
      extraCreditMrd: options.extraCapitalCreditMrd,
    });

    // Lohn- und Rentenwertentwicklung (+2,2 % p.a.)
    const nextSalary = Math.round(current.averageGrossSalary * 1.022);
    const nextPensionValue = Number((current.currentPensionValue * 1.022).toFixed(2));

    // Bundeszuschuss folgt gemäß § 213 SGB VI (~3,0 % p.a.) plus einmalige gesetzliche Erhöhungsstufe
    const nextFederalSubsidy = Number(
      Math.max(80.0, current.federalSubsidy * 1.030 + options.federalSubsidyDeltaMrd).toFixed(1)
    );

    // Gesamtausgaben der GRV (in Mrd. €)
    const rawPensionSpendMrd =
      (pensioners * (nextPensionValue * 36.0 * 12.0)) / 1000.0;
    const annualSpendMrd = rawPensionSpendMrd * GRV_EXPENSE_CALIBRATION;

    // Zu deckende Ausgaben über Beiträge
    const neededContributionSpend = Math.max(
      120.0,
      annualSpendMrd - nextFederalSubsidy - fundResult.payoutToGRVMrd
    );

    // Beitragspflichtige Lohnsumme (in Mrd. €)
    const wageBaseMrd = (contributors * nextSalary * EFFECTIVE_WAGE_SHARE) / 1000.0;

    // Basis-Beitragssatz + strukturelle politische Modifikatoren
    const rawRate = (neededContributionSpend / wageBaseMrd) * 100.0;
    const structuralRateDelta = options.structuralContributionDelta ?? 0;

    // Haltelinie & Niveau-Berechnung
    let basePensionLevel = 48.0;
    if (!options.forceHaltelinie48) {
      // Ohne Haltelinie wirkt der Nachhaltigkeitsfaktor ab sofort leicht dämpfend auf das Niveau (senkt Beitragssatz)
      const yearsWithoutLock = Math.max(1, nextYear - 2026);
      basePensionLevel = Math.max(44.5, 48.0 - 0.16 * Math.min(12, yearsWithoutLock));
    } else if (nextYear > 2039) {
      basePensionLevel = Math.max(45.5, 48.0 - 0.15 * (nextYear - 2039));
    }

    const finalPensionLevel = Number(
      Math.max(
        42.0,
        Math.min(52.0, basePensionLevel + (options.structuralPensionLevelDelta ?? 0))
      ).toFixed(1)
    );

    // Wenn Haltelinie deaktiviert ist, dämpft das sinkende Rentenniveau den Beitragssatz
    const haltelinieSavingsRate = (48.0 - finalPensionLevel) * 0.38;
    const calculatedRate = Math.max(
      16.0,
      rawRate + structuralRateDelta - haltelinieSavingsRate
    );

    return {
      year: nextYear,
      contributorsCount: Number(contributors.toFixed(2)),
      pensionersCount: Number(pensioners.toFixed(2)),
      contributionRate: Number(calculatedRate.toFixed(2)),
      pensionLevel: finalPensionLevel,
      generationCapitalFund: fundResult.nextFundMrd,
      marketReturnPercent: Number(marketReturn.toFixed(1)),
      federalSubsidy: nextFederalSubsidy,
      averageGrossSalary: nextSalary,
      currentPensionValue: nextPensionValue,
      fundPayoutToGRV: fundResult.payoutToGRVMrd,
    };
  }

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
    // Gesetzliche Rente berücksichtigt auch aktuelles Rentenniveau relativ zu 48%
    const levelAdjustment = macro.pensionLevel / 48.0;
    const statutoryPensionMonthly = Math.round(
      profile.accumulatedPoints * macro.currentPensionValue * levelAdjustment
    );

    const privatePensionMonthly = Math.round(
      (profile.etfPortfolioValue * 0.04) / 12.0
    );

    const bavPensionMonthly = Math.round(profile.bavMonthlySavings * 3.2);

    const totalPensionMonthly =
      statutoryPensionMonthly + privatePensionMonthly + bavPensionMonthly;

    const targetPensionMonthly = Math.round((profile.grossIncome * 0.58) / 12.0);
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
