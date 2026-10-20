import 'dart:math';

/// Berechnung des Generationenkapitals (kreditfinanzierter Kapitalstock der Bundesregierung)
/// gemäß dem Rentenpaket II.
class GenerationCapitalEngine {
  /// Berechnet das Fondsvermögen für das nächste Jahr unter Berücksichtigung von:
  /// - jährlichen Neukrediten des Bundes (Start 12 Mrd. €, +3% p.a.)
  /// - Kapitalmarktrendite (z.B. MSCI World Durchschnitt 6-7%)
  /// - Zinskosten für Bundesanleihen (z.B. 2.5%)
  /// - Ausschüttungen an die gesetzliche Rentenversicherung ab 2035 (ca. 10 Mrd. €/Jahr)
  static double projectNextYearFund({
    required double currentFundMrd,
    required int year,
    required double marketReturnPercent,
    required double extraCreditMrd,
    required double federalLoanRatePercent,
  }) {
    // Gesetzliche Bundeskredite: Start 12 Mrd. € 2024, wächst mit 3% jährlich
    final yearsSince2024 = max(0, year - 2024);
    final plannedAnnualCredit = 12.0 * pow(1.03, yearsSince2024);
    final totalNewInflow = plannedAnnualCredit + extraCreditMrd;

    // Zins-Spread = Marktrendite - Kreditkosten des Bundes
    final netReturnRate = (marketReturnPercent - federalLoanRatePercent) / 100.0;
    final growth = currentFundMrd * netReturnRate;

    // Ausschüttungen zur Beitragsdämpfung greifen planmäßig ab ca. 2035
    double payout = 0.0;
    if (year >= 2035 && currentFundMrd > 80.0) {
      // Gesetzliches Ziel: ca. 10 Mrd. € p.a. zur Rentenkasse
      payout = min(10.0, currentFundMrd * 0.04);
    }

    final newTotal = currentFundMrd + growth + totalNewInflow - payout;
    return max(0.0, newTotal);
  }

  /// Berechnet die jährliche Entlastungssumme für die Rentenversicherung (in Mrd. €)
  static double getAnnualPayoutToGRV({
    required double fundMrd,
    required int year,
  }) {
    if (year < 2035 || fundMrd < 60.0) return 0.0;
    return min(10.0, fundMrd * 0.045);
  }
}
