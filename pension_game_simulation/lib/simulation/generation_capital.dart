import 'dart:math';

class GenerationCapitalStepResult {
  final double nextFundMrd;
  final double payoutToGRVMrd;
  final double netSpreadPercent;

  const GenerationCapitalStepResult({
    required this.nextFundMrd,
    required this.payoutToGRVMrd,
    required this.netSpreadPercent,
  });
}

/// Berechnung des Generationenkapitals (kreditfinanzierter Kapitalstock der Bundesregierung)
/// gemäß dem Rentenpaket II.
class GenerationCapitalEngine {
  static GenerationCapitalStepResult stepFund({
    required double currentFundMrd,
    required int nextYear,
    required double marketReturnPercent,
    required double extraCreditMrd,
    required double federalLoanRatePercent,
  }) {
    final yearsSince2024 = max(0, nextYear - 2024);
    final plannedAnnualCredit = 12.0 * pow(1.03, yearsSince2024);
    final totalNewInflow = plannedAnnualCredit + extraCreditMrd;

    final netSpreadPercent = marketReturnPercent - federalLoanRatePercent;
    final netReturnRate = netSpreadPercent / 100.0;
    final growth = currentFundMrd * netReturnRate;

    final payout = getAnnualPayoutToGRV(fundMrd: currentFundMrd, year: nextYear);
    final newTotal = max(0.0, currentFundMrd + growth + totalNewInflow - payout);

    return GenerationCapitalStepResult(
      nextFundMrd: double.parse(newTotal.toStringAsFixed(1)),
      payoutToGRVMrd: double.parse(payout.toStringAsFixed(2)),
      netSpreadPercent: double.parse(netSpreadPercent.toStringAsFixed(2)),
    );
  }

  static double projectNextYearFund({
    required double currentFundMrd,
    required int year,
    required double marketReturnPercent,
    required double extraCreditMrd,
    required double federalLoanRatePercent,
  }) {
    return stepFund(
      currentFundMrd: currentFundMrd,
      nextYear: year,
      marketReturnPercent: marketReturnPercent,
      extraCreditMrd: extraCreditMrd,
      federalLoanRatePercent: federalLoanRatePercent,
    ).nextFundMrd;
  }

  /// Berechnet die jährliche Entlastungssumme für die Rentenversicherung (in Mrd. €)
  static double getAnnualPayoutToGRV({
    required double fundMrd,
    required int year,
  }) {
    if (year < 2035 || fundMrd < 75.0) return 0.0;
    final cap = fundMrd >= 220.0
        ? 18.0
        : fundMrd >= 160.0
            ? 13.5
            : 10.0;
    return min(cap, fundMrd * 0.055);
  }
}
