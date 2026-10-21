import React, { useState } from 'react';
import { MacroState, CitizenProfile } from '../types';
import { PensionMathEngine } from '../simulation/pensionEngine';
import { HandDrawnFrame } from './HandDrawnFrame';
import { User, Wallet, PiggyBank, ArrowRight, ShieldCheck } from 'lucide-react';

interface CitizenSimulationProps {
  macro: MacroState;
}

export const CitizenSimulation: React.FC<CitizenSimulationProps> = ({ macro }) => {
  const [profile, setProfile] = useState<CitizenProfile>({
    name: 'Felix / Mia',
    age: 22,
    grossIncome: 42000,
    accumulatedPoints: 1.0,
    monthlyEtfSavings: 150,
    etfPortfolioValue: 4200,
    bavMonthlySavings: 80,
  });

  const [careerYears, setCareerYears] = useState(43); // 22 bis 65

  // Vorausberechneter Zustand im Alter 67
  const projectedPoints = Number((careerYears * (profile.grossIncome / macro.averageGrossSalary)).toFixed(2));
  
  // Zinseszinsrechnung für ETF-Sparplan (6% Realrendite nach Inflation)
  const monthlyRate = 0.06 / 12.0;
  const totalMonths = careerYears * 12;
  const futureEtfPortfolio = Math.round(
    profile.etfPortfolioValue * Math.pow(1 + monthlyRate, totalMonths) +
      profile.monthlyEtfSavings *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
  );

  const futureProfile: CitizenProfile = {
    ...profile,
    accumulatedPoints: projectedPoints,
    etfPortfolioValue: futureEtfPortfolio,
  };

  const results = PensionMathEngine.calculateCitizen(futureProfile, macro);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1 font-mono">
            <span>Persönlicher Vorsorge-Simulator</span>
            <span>·</span>
            <span>Gen Z & Generation Alpha</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Mein Lebenslauf & Das 3-Säulen-Modell
          </h1>
          <p className="text-sm text-[#86868b] max-w-2xl mt-1">
            Wie wirkt sich die Rentenreform auf deinen eigenen Geldbeutel aus? Berechne
            deine persönliche Rentenlücke und schließe sie mit dem 3-Säulen-Modell.
          </p>
        </div>

        {/* Character Portrait Slot */}
        <div className="w-24 h-24 shrink-0">
          <HandDrawnFrame
            assetPath="assets/images/characters/char_worker_young_neutral.png"
            title="Berufseinsteiger"
            designerInstruction="Gen Z/Alpha, 22 J., optimistisch mit Laptop & Rucksack."
            dimensions="512 × 512 px"
            heightClass="h-24 w-24"
          />
        </div>
      </div>

      {/* 3 Pillars Overview (Result Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Säule 1: Gesetzliche Rente */}
        <div className="p-5 rounded-3xl apple-glass-card flex flex-col justify-between">
          <div className="text-xs text-[#86868b] mb-2 flex items-center justify-between">
            <span>1. Säule: Gesetzlich (GRV)</span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {results.statutoryPensionMonthly.toLocaleString('de-DE')} €
          </div>
          <p className="text-[11px] text-[#86868b] mt-2">
            Basierend auf {projectedPoints} Entgeltpunkten und {macro.currentPensionValue.toFixed(2)} € Rentenwert.
          </p>
        </div>

        {/* Säule 2: Betriebsrente (bAV) */}
        <div className="p-5 rounded-3xl apple-glass-card flex flex-col justify-between">
          <div className="text-xs text-[#86868b] mb-2 flex items-center justify-between">
            <span>2. Säule: Betrieblich (bAV)</span>
            <Wallet className="w-3.5 h-3.5 text-white/60" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {results.bavPensionMonthly.toLocaleString('de-DE')} €
          </div>
          <p className="text-[11px] text-[#86868b] mt-2">
            {profile.bavMonthlySavings} € monatliche Entgeltumwandlung inkl. Arbeitgeberzuschuss.
          </p>
        </div>

        {/* Säule 3: Private Aktien/ETF Rente */}
        <div className="p-5 rounded-3xl apple-glass-card flex flex-col justify-between">
          <div className="text-xs text-[#86868b] mb-2 flex items-center justify-between">
            <span>3. Säule: Eigener ETF-Sparplan</span>
            <PiggyBank className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {results.privatePensionMonthly.toLocaleString('de-DE')} €
          </div>
          <p className="text-[11px] text-[#86868b] mt-2">
            Entnahme aus ca. {futureEtfPortfolio.toLocaleString('de-DE')} € Depotvermögen (4% Regel).
          </p>
        </div>

        {/* Gesamt & Rentenlücke */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            results.pensionGapMonthly <= 0
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-red-950/20 border-red-500/30'
          }`}
        >
          <div className="text-xs text-[#86868b] mb-2 flex items-center justify-between">
            <span>Gesamtrente vs. Zielrente</span>
            <span
              className={`font-semibold text-xs ${
                results.pensionGapMonthly <= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {results.pensionGapMonthly <= 0 ? 'Lücke geschlossen!' : 'Rentenlücke!'}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {results.totalPensionMonthly.toLocaleString('de-DE')} €
          </div>
          <p className="text-[11px] text-[#86868b] mt-2">
            Zielrente (75% Netto): {results.targetPensionMonthly.toLocaleString('de-DE')} € · Differenz:{' '}
            <span className={results.pensionGapMonthly <= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {results.pensionGapMonthly <= 0
                ? `+${Math.abs(results.pensionGapMonthly)} € Überschuss`
                : `-${results.pensionGapMonthly} € Lücke`}
            </span>
          </p>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="p-6 rounded-3xl apple-glass shadow-xl">
        <h3 className="text-sm font-bold tracking-wide uppercase text-white mb-6">
          Eigene Karriere- & Sparparameter anpassen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Slider 1: Bruttogehalt */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-white font-medium">Jahresbruttogehalt</span>
              <span className="font-mono text-white font-bold">
                {profile.grossIncome.toLocaleString('de-DE')} €
              </span>
            </div>
            <input
              type="range"
              min="24000"
              max="120000"
              step="2000"
              value={profile.grossIncome}
              onChange={(e) =>
                setProfile({ ...profile, grossIncome: Number(e.target.value) })
              }
              className="w-full accent-white cursor-pointer"
            />
            <p className="text-[11px] text-[#86868b] mt-1">
              Vergleichswert Durchschnittsentgelt 2026: {macro.averageGrossSalary.toLocaleString('de-DE')} €
            </p>
          </div>

          {/* Slider 2: Monatliche Sparrate ETF */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-white font-medium">Monatliche ETF-Sparrate (Weltportfolio)</span>
              <span className="font-mono text-amber-400 font-bold">
                {profile.monthlyEtfSavings} € / Monat
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={profile.monthlyEtfSavings}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  monthlyEtfSavings: Number(e.target.value),
                })
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[11px] text-[#86868b] mt-1">
              Rechnerisch 6 % Realrendite nach Inflation und Kosten.
            </p>
          </div>

          {/* Slider 3: Erwerbsjahre */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-white font-medium">Geplante Beitragsjahre</span>
              <span className="font-mono text-white font-bold">
                {careerYears} Jahre (bis Alter {profile.age + careerYears})
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="50"
              step="1"
              value={careerYears}
              onChange={(e) => setCareerYears(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <p className="text-[11px] text-[#86868b] mt-1">
              Längeres Erwerbsleben steigert Rentenpunkte und Zinseszinseffekte im Depot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
