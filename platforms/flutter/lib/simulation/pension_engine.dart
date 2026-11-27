import 'dart:math';
import '../models/macro_state.dart';
import 'demography_model.dart';
import 'generation_capital.dart';

/// Zentraler Simulations- und Rundenmotor für die Gesetzliche Rentenversicherung (GRV).
/// Kalibriert auf Startjahr 2026 (18,6 % Beitragssatz, 48,0 % Rentenniveau).
class PensionEngine {
  static const double grvExpenseCalibration = 1.215;
  static const double effectiveWageShare = 0.846;

  /// Erzeugt den offiziellen Initialzustand für das Startjahr 2026
  static MacroState createInitialState() {
    return const MacroState(
      year: 2026,
      contributorsCount: 45.5,
      pensionersCount: 21.2,
      contributionRate: 18.6,
      pensionLevel: 48.0,
      generationCapitalFund: 24.5,
      generationCapitalAnnualReturn: 6.5,
      federalSubsidy: 112.0,
      averageGrossSalary: 45358.0,
      currentPensionValue: 39.32,
      fundPayoutToGRV: 0.0,
    );
  }

  /// Berechnet den nächsten Runden-Schritt (1 Jahr in die Zukunft)
  static MacroState stepNextYear({
    required MacroState current,
    double extraCapitalCredit = 0.0,
    double marketReturnOverride = 6.5,
    double loanInterestRatePercent = 2.6,
    double extraRetirementAgeMonths = 0.0,
    double federalSubsidyDelta = 0.0,
    double structuralContributionDelta = 0.0,
    double structuralPensionLevelDelta = 0.0,
    bool forceHaltelinie48 = true,
  }) {
    final nextYear = current.year + 1;

    // 1. Demografie für das nächste Jahr
    final rawContributors = DemographyModel.getContributors(nextYear);
    final rawPensioners = DemographyModel.getPensioners(nextYear);

    // Effekt durch Verschiebung des Renteneintrittsalters
    final shiftFactor = (extraRetirementAgeMonths / 12.0) * 0.55;
    final contributors = max(36.0, rawContributors + shiftFactor);
    final pensioners = max(18.0, rawPensioners - shiftFactor);

    // 2. Generationenkapital-Wachstum & Ausschüttung
    final fundStep = GenerationCapitalEngine.stepFund(
      currentFundMrd: current.generationCapitalFund,
      nextYear: nextYear,
      marketReturnPercent: marketReturnOverride,
      extraCreditMrd: extraCapitalCredit,
      federalLoanRatePercent: loanInterestRatePercent,
    );

    // 3. Bundeszuschuss (§ 213 SGB VI, +3.0 % p.a. plus Einmalstufe)
    final nextFederalSubsidy =
        max(80.0, current.federalSubsidy * 1.030 + federalSubsidyDelta);

    // 4. Rentenwert & Durchschnittsgehalt (+2.2 % Lohnwachstum)
    final nextSalary = (current.averageGrossSalary * 1.022).roundToDouble();
    final nextPensionValue =
        double.parse((current.currentPensionValue * 1.022).toStringAsFixed(2));

    // 5. Kalibrierte Gesamtausgaben der Rentenkasse (in Mrd. €)
    final rawPensionSpendMrd =
        pensioners * (nextPensionValue * 36.0 * 12.0) / 1000.0;
    final annualSpendMrd = rawPensionSpendMrd * grvExpenseCalibration;

    final netSpendToCoverByContributions =
        max(120.0, annualSpendMrd - nextFederalSubsidy - fundStep.payoutToGRVMrd);

    // Beitragspflichtige Lohnsumme
    final totalWageBase =
        (contributors * nextSalary * effectiveWageShare) / 1000.0;

    final rawContributionRate =
        (netSpendToCoverByContributions / totalWageBase) * 100.0;

    // 6. Haltelinie & Rentenniveau
    double basePensionLevel = 48.0;
    if (!forceHaltelinie48) {
      final yearsWithoutLock = max(1, nextYear - 2026);
      basePensionLevel =
          max(44.5, 48.0 - 0.16 * min(12, yearsWithoutLock));
    } else if (nextYear > 2039) {
      basePensionLevel = max(45.5, 48.0 - 0.15 * (nextYear - 2039));
    }

    final finalPensionLevel = double.parse(
      (basePensionLevel + structuralPensionLevelDelta)
          .clamp(42.0, 52.0)
          .toStringAsFixed(1),
    );

    final haltelinieSavingsRate = (48.0 - finalPensionLevel) * 0.38;
    final calculatedContributionRate = max(
      16.0,
      rawContributionRate + structuralContributionDelta - haltelinieSavingsRate,
    );

    return MacroState(
      year: nextYear,
      contributorsCount: double.parse(contributors.toStringAsFixed(2)),
      pensionersCount: double.parse(pensioners.toStringAsFixed(2)),
      contributionRate:
          double.parse(calculatedContributionRate.toStringAsFixed(2)),
      pensionLevel: finalPensionLevel,
      generationCapitalFund: fundStep.nextFundMrd,
      generationCapitalAnnualReturn:
          double.parse(marketReturnOverride.toStringAsFixed(1)),
      federalSubsidy: double.parse(nextFederalSubsidy.toStringAsFixed(1)),
      averageGrossSalary: nextSalary,
      currentPensionValue: nextPensionValue,
      fundPayoutToGRV: fundStep.payoutToGRVMrd,
    );
  }
}
