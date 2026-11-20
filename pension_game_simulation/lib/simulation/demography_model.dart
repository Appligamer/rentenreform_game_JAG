import 'dart:math';

/// Demografisches Rechenmodell basierend auf Daten des Statistischen Bundesamtes (Destatis)
/// und den Projektionen für den econo=me Wettbewerb.
class DemographyModel {
  /// Berechnet die Anzahl der Beitragszahler (in Millionen) für das gegebene Jahr
  static double getContributors(int year) {
    // 2026: ~45.5 Mio. Erwerbstätige
    // Durch den Renteneintritt der Babyboomer sinkt dies bis ca. 2039, danach leichte Stabilisierung.
    if (year <= 2026) return 45.5;
    final progress = ((year - 2026) / 14.0).clamp(0.0, 1.0);
    final sigmoid = 1 / (1 + exp(-6 * (progress - 0.5)));
    final postPeakRecovery = year > 2040 ? min(0.65, (year - 2040) * 0.13) : 0.0;
    return 45.5 - (4.3 * sigmoid) + (postPeakRecovery * 0.4);
  }

  /// Berechnet die Anzahl der Rentenbezieher (in Millionen) für das gegebene Jahr
  static double getPensioners(int year) {
    // 2026: ~21.2 Mio. Rentner
    // Anstieg durch Boomer bis ca. 2039, danach leichte Abflachung.
    if (year <= 2026) return 21.2;
    final progress = ((year - 2026) / 14.0).clamp(0.0, 1.0);
    final sigmoid = 1 / (1 + exp(-6 * (progress - 0.5)));
    final postPeakRecovery = year > 2040 ? min(0.65, (year - 2040) * 0.13) : 0.0;
    return 21.2 + (4.6 * sigmoid) - (postPeakRecovery * 0.6);
  }

  /// Altenquotient (Beitragszahler je Rentner)
  static double getRatio(int year) {
    final c = getContributors(year);
    final p = getPensioners(year);
    return c / p;
  }
}
