import 'dart:math';
import '../models/macro_state.dart';
import 'demography_model.dart';
import 'generation_capital.dart';

/// Zentraler Simulations- und Rundenmotor für die Gesetzliche Rentenversicherung (GRV).
class PensionEngine {
  /// Erzeugt den offiziellen Initialzustand für das Startjahr 2026
  static MacroState createInitialState() {
    return const MacroState(
      year: 2026,
      contributorsCount: 45.5,
      pensionersCount: 21.2,
      contributionRate: 18.6,
      pensionLevel: 48.0, // Gesetzliche Haltelinie
      generationCapitalFund: 24.5, // Bereits akkumulierte Bundesmittel
      generationCapitalAnnualReturn: 6.5, // Langfristige globale Aktienrendite
      federalSubsidy: 112.0, // Mrd. € Steuerzuschuss Bund
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
    double extraRetirementAgeMonths = 0.0,
    double federalSubsidyDelta = 0.0,
    bool forceHaltelinie48 = true,
  }) {
    final nextYear = current.year + 1;

    // 1. Demografie für das nächste Jahr
    final rawContributors = DemographyModel.getContributors(nextYear);
    final rawPensioners = DemographyModel.getPensioners(nextYear);

    // Effekt durch Verschiebung des Renteneintrittsalters
    final shiftFactor = (extraRetirementAgeMonths / 12.0) * 0.4;
    final contributors = rawContributors + shiftFactor;
    final pensioners = max(18.0, rawPensioners - shiftFactor);

    // 2. Generationenkapital-Wachstum & Ausschüttung
    final nextFund = GenerationCapitalEngine.projectNextYearFund(
      currentFundMrd: current.generationCapitalFund,
      year: nextYear,
      marketReturnPercent: marketReturnOverride,
      extraCreditMrd: extraCapitalCredit,
      federalLoanRatePercent: 2.6,
    );

    final payoutToGRV = GenerationCapitalEngine.getAnnualPayoutToGRV(
      fundMrd: nextFund,
      year: nextYear,
    );

    // 3. Bundeszuschuss (wächst moderat mit Inflation / Haushalt)
    final nextFederalSubsidy = current.federalSubsidy * 1.025 + federalSubsidyDelta;

    // 4. Rentenwert & Durchschnittsgehalt
    final nextSalary = current.averageGrossSalary * 1.022; // +2.2% Lohnwachstum
    final nextPensionValue = current.currentPensionValue * 1.022;

    // 5. Umlage-Bedarf & Beitragssatz
    // Gesamtausgaben der Rentenkasse: ~ Rentner × Durchschnittsrente
    final totalPensionSpend = pensioners * (nextPensionValue * 36.0 * 12.0) / 1000.0;
    // Deckung durch Steuern & Generationenkapital
    final netSpendToCoverByContributions =
        max(100.0, totalPensionSpend - nextFederalSubsidy - payoutToGRV);

    // Gesamte beitragspflichtige Lohnsumme
    final totalWageBase = contributors * nextSalary / 1000.0;

    // Erforderlicher mathematischer Beitragssatz
    final calculatedContributionRate =
        (netSpendToCoverByContributions / totalWageBase) * 100.0;

    // Haltelinie: Rentenniveau bleibt bei mind. 48.0% bis 2039
    double nextPensionLevel = 48.0;
    if (!forceHaltelinie48 && nextYear > 2039) {
      nextPensionLevel = 48.0 - (0.2 * (nextYear - 2039));
    }

    return MacroState(
      year: nextYear,
      contributorsCount: contributors,
      pensionersCount: pensioners,
      contributionRate: double.parse(calculatedContributionRate.toStringAsFixed(2)),
      pensionLevel: nextPensionLevel,
      generationCapitalFund: double.parse(nextFund.toStringAsFixed(1)),
      generationCapitalAnnualReturn: marketReturnOverride,
      federalSubsidy: double.parse(nextFederalSubsidy.toStringAsFixed(1)),
      averageGrossSalary: double.parse(nextSalary.toStringAsFixed(0)),
      currentPensionValue: double.parse(nextPensionValue.toStringAsFixed(2)),
      fundPayoutToGRV: double.parse(payoutToGRV.toStringAsFixed(2)),
    );
  }
}
