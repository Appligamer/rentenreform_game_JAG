/**
 * Demografisches Rechenmodell basierend auf Daten des Statistischen Bundesamtes (Destatis)
 * und den Projektionen für den Bundeswettbewerb econo=me.
 */
export class DemographyModel {
  static getDemography(year: number): {
    contributors: number;
    pensioners: number;
    dependencyRatio: number;
  } {
    if (year <= 2026) {
      return {
        contributors: 45.5,
        pensioners: 21.2,
        dependencyRatio: Number((45.5 / 21.2).toFixed(2)),
      };
    }

    // S-förmiger Ruhestandsübergang der geburtenstarken Jahrgänge (1955–1969) bis ~2039,
    // gefolgt von einer leichten Stabilisierung ab 2041.
    const progress = Math.min(1.0, Math.max(0.0, (year - 2026) / 14.0));
    const sigmoid = 1 / (1 + Math.exp(-6 * (progress - 0.5)));

    let postPeakRecovery = 0;
    if (year > 2040) {
      postPeakRecovery = Math.min(0.65, (year - 2040) * 0.13);
    }

    const contributors = 45.5 - 4.3 * sigmoid + postPeakRecovery * 0.4;
    const pensioners = 21.2 + 4.6 * sigmoid - postPeakRecovery * 0.6;

    return {
      contributors: Number(contributors.toFixed(2)),
      pensioners: Number(pensioners.toFixed(2)),
      dependencyRatio: Number((contributors / pensioners).toFixed(2)),
    };
  }
}
