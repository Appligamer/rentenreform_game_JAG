/// Makroökonomischer Zustand der Rentenversicherung in einem bestimmten Simulationsjahr.
class MacroState {
  final int year;
  final double contributorsCount; // In Millionen (z.B. 45.8)
  final double pensionersCount;   // In Millionen (z.B. 21.4)
  final double contributionRate;  // In Prozent (z.B. 18.6 %)
  final double pensionLevel;      // In Prozent (Haltelinie bei 48.0 %)
  final double generationCapitalFund; // In Mrd. € (Kapitalstock Generationenkapital)
  final double generationCapitalAnnualReturn; // In Prozent (z.B. 6.2 %)
  final double federalSubsidy;    // In Mrd. € Steuerzuschuss des Bundes
  final double averageGrossSalary; // In € brutto / Jahr (z.B. 45358 €)
  final double currentPensionValue; // Aktueller Rentenwert in € (z.B. 39.32 €)
  final double fundPayoutToGRV;   // Jährliche Entlastungsausschüttung in Mrd. €

  const MacroState({
    required this.year,
    required this.contributorsCount,
    required this.pensionersCount,
    required this.contributionRate,
    required this.pensionLevel,
    required this.generationCapitalFund,
    required this.generationCapitalAnnualReturn,
    required this.federalSubsidy,
    required this.averageGrossSalary,
    required this.currentPensionValue,
    required this.fundPayoutToGRV,
  });

  /// Altenquotient bzw. Verhältnis von Beitragszahlern je Rentner (z.B. 2.14 -> 1.50)
  double get dependencyRatio =>
      pensionersCount > 0 ? contributorsCount / pensionersCount : 0.0;

  MacroState copyWith({
    int? year,
    double? contributorsCount,
    double? pensionersCount,
    double? contributionRate,
    double? pensionLevel,
    double? generationCapitalFund,
    double? generationCapitalAnnualReturn,
    double? federalSubsidy,
    double? averageGrossSalary,
    double? currentPensionValue,
    double? fundPayoutToGRV,
  }) {
    return MacroState(
      year: year ?? this.year,
      contributorsCount: contributorsCount ?? this.contributorsCount,
      pensionersCount: pensionersCount ?? this.pensionersCount,
      contributionRate: contributionRate ?? this.contributionRate,
      pensionLevel: pensionLevel ?? this.pensionLevel,
      generationCapitalFund: generationCapitalFund ?? this.generationCapitalFund,
      generationCapitalAnnualReturn:
          generationCapitalAnnualReturn ?? this.generationCapitalAnnualReturn,
      federalSubsidy: federalSubsidy ?? this.federalSubsidy,
      averageGrossSalary: averageGrossSalary ?? this.averageGrossSalary,
      currentPensionValue: currentPensionValue ?? this.currentPensionValue,
      fundPayoutToGRV: fundPayoutToGRV ?? this.fundPayoutToGRV,
    );
  }
}
