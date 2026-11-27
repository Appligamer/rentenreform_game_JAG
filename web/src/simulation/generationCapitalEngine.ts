/**
 * Generationenkapital (Aktienrente) nach Rentenpaket II:
 * - Jährlicher Bundeskredit: Start 12 Mrd. € (2024), +3 % p.a.
 * - Zins-Spread = Globale Kapitalmarktrendite minus Bundesanleihe-Refinanzierung
 * - Dämpfungs-Ausschüttung an die GRV ab 2035 (bis zu 10–14 Mrd. € p.a. je nach Fondsgröße)
 */
export class GenerationCapitalEngine {
  static stepFund(params: {
    currentFundMrd: number;
    nextYear: number;
    marketReturnPercent: number;
    loanInterestRatePercent: number;
    extraCreditMrd: number;
  }): {
    nextFundMrd: number;
    payoutToGRVMrd: number;
    netSpreadPercent: number;
  } {
    const yearsSince2024 = Math.max(0, params.nextYear - 2024);
    const legalCredit = 12.0 * Math.pow(1.03, yearsSince2024);
    const totalCreditInflow = legalCredit + params.extraCreditMrd;

    const netSpreadPercent = params.marketReturnPercent - params.loanInterestRatePercent;
    const netReturnRate = netSpreadPercent / 100.0;
    const fundGrowth = params.currentFundMrd * netReturnRate;

    // Ausschüttung zur Beitragsdämpfung greift ab 2035, sobald Mindestvolumen erreicht ist
    let payoutToGRVMrd = 0.0;
    if (params.nextYear >= 2035 && params.currentFundMrd >= 75.0) {
      // Belohnt starken Fondsaufbau vor 2035 mit spürbar höherer Beitragsentlastung
      const cap =
        params.currentFundMrd >= 220.0
          ? 18.0
          : params.currentFundMrd >= 160.0
          ? 13.5
          : 10.0;
      payoutToGRVMrd = Math.min(cap, params.currentFundMrd * 0.055);
    }

    const nextFundMrd = Math.max(
      0.0,
      params.currentFundMrd + fundGrowth + totalCreditInflow - payoutToGRVMrd
    );

    return {
      nextFundMrd: Number(nextFundMrd.toFixed(1)),
      payoutToGRVMrd: Number(payoutToGRVMrd.toFixed(2)),
      netSpreadPercent: Number(netSpreadPercent.toFixed(2)),
    };
  }
}
