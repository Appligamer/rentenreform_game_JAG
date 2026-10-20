/// Individueller Lebenslauf und Rentenanspruch eines Bürgers (Gen Z / Alpha).
class CitizenProfile {
  final String name;
  final int age;
  final double currentGrossIncome; // Jahresbrutto in €
  final double accumulatedPoints;  // Gesammelte Renten-Entgeltpunkte
  final double privateEtfSavingsMonthly; // Eigene monatliche Sparrate in €
  final double privatePortfolioValue; // Angespartes privates Aktiendepot in €
  final double bavMonthlyContribution; // Betriebliche Altersvorsorge in €

  const CitizenProfile({
    required this.name,
    required this.age,
    required this.currentGrossIncome,
    required this.accumulatedPoints,
    required this.privateEtfSavingsMonthly,
    required this.privatePortfolioValue,
    required this.bavMonthlyContribution,
  });

  /// Berechnet die voraussichtliche monatliche gesetzliche Rente (brutto)
  double projectedMonthlyStatutoryPension(double currentPensionValue) {
    return accumulatedPoints * currentPensionValue;
  }

  /// Berechnet die voraussichtliche monatliche Privatrente bei 4% Entnahmerate
  double projectedMonthlyPrivatePension() {
    return (privatePortfolioValue * 0.04) / 12.0;
  }

  CitizenProfile copyWith({
    String? name,
    int? age,
    double? currentGrossIncome,
    double? accumulatedPoints,
    double? privateEtfSavingsMonthly,
    double? privatePortfolioValue,
    double? bavMonthlyContribution,
  }) {
    return CitizenProfile(
      name: name ?? this.name,
      age: age ?? this.age,
      currentGrossIncome: currentGrossIncome ?? this.currentGrossIncome,
      accumulatedPoints: accumulatedPoints ?? this.accumulatedPoints,
      privateEtfSavingsMonthly:
          privateEtfSavingsMonthly ?? this.privateEtfSavingsMonthly,
      privatePortfolioValue:
          privatePortfolioValue ?? this.privatePortfolioValue,
      bavMonthlyContribution:
          bavMonthlyContribution ?? this.bavMonthlyContribution,
    );
  }
}
