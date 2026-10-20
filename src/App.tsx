import React, { useState } from 'react';
import { MacroState, DecisionCard } from './types';
import { PensionMathEngine } from './simulation/pensionEngine';
import { DECISION_CARDS } from './data/cardsData';
import { Navbar } from './components/Navbar';
import { MacroCockpit } from './components/MacroCockpit';
import { CitizenSimulation } from './components/CitizenSimulation';
import { DesignerAssetExplorer } from './components/DesignerAssetExplorer';
import { PlatformExportHub } from './components/PlatformExportHub';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'cockpit' | 'citizen' | 'briefing' | 'export'>('cockpit');
  
  // Simulationsstatus
  const [macro, setMacro] = useState<MacroState>(() => PensionMathEngine.getInitialState());
  const [history, setHistory] = useState<MacroState[]>([PensionMathEngine.getInitialState()]);
  const [cards] = useState<DecisionCard[]>(DECISION_CARDS);
  const [playedCardIds, setPlayedCardIds] = useState<string[]>([]);

  // Stellschrauben
  const [extraCreditMrd, setExtraCreditMrd] = useState<number>(0);
  const [retirementShiftMonths, setRetirementShiftMonths] = useState<number>(0);
  const [forceHaltelinie, setForceHaltelinie] = useState<boolean>(true);

  // Runden-Schritt (+1 Jahr)
  const handleNextYear = () => {
    const next = PensionMathEngine.stepYear(macro, {
      extraCapitalCreditMrd: extraCreditMrd,
      retirementAgeShiftMonths: retirementShiftMonths,
      federalSubsidyDeltaMrd: 0,
      forceHaltelinie48: forceHaltelinie,
    });
    setMacro(next);
    setHistory((prev) => [...prev, next]);
    // Temporäre Hebel zurücksetzen
    setExtraCreditMrd(0);
  };

  // Reset auf 2026
  const handleReset = () => {
    const initial = PensionMathEngine.getInitialState();
    setMacro(initial);
    setHistory([initial]);
    setPlayedCardIds([]);
    setExtraCreditMrd(0);
    setRetirementShiftMonths(0);
    setForceHaltelinie(true);
  };

  // Karte ausspielen
  const handlePlayCard = (card: DecisionCard) => {
    if (playedCardIds.includes(card.id)) return;
    setPlayedCardIds((prev) => [...prev, card.id]);
    
    // Unmittelbare Effekte auf die Stellschrauben
    if (card.deltaGenerationFundMrd !== 0) {
      setExtraCreditMrd((prev) => prev + card.deltaGenerationFundMrd);
    }
    if (card.deltaRetirementAgeMonths !== 0) {
      setRetirementShiftMonths((prev) => prev + card.deltaRetirementAgeMonths);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 3-Zone Apple-Aesthetic Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentYear={macro.year}
        onNextYear={handleNextYear}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {currentTab === 'cockpit' && (
          <MacroCockpit
            macro={macro}
            cards={cards}
            playedCardIds={playedCardIds}
            onPlayCard={handlePlayCard}
            extraCreditMrd={extraCreditMrd}
            onExtraCreditChange={setExtraCreditMrd}
            retirementShiftMonths={retirementShiftMonths}
            onRetirementShiftChange={setRetirementShiftMonths}
            forceHaltelinie={forceHaltelinie}
            onToggleHaltelinie={() => setForceHaltelinie(!forceHaltelinie)}
            onNextYear={handleNextYear}
            history={history}
          />
        )}

        {currentTab === 'citizen' && (
          <CitizenSimulation macro={macro} />
        )}

        {currentTab === 'briefing' && (
          <DesignerAssetExplorer />
        )}

        {currentTab === 'export' && (
          <PlatformExportHub />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-6 px-8 text-center text-xs text-[#86868b] flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span>Generation Zukunft</span>
          <span>·</span>
          <span>Bundeswettbewerb econo=me 2024/2025</span>
          <span>·</span>
          <span>Thema: Rente gut, alles gut?</span>
        </div>
        <div className="text-[11px] text-[#6e6e73]">
          Entwickelt für Jacob Glathe & Team · Flutter macOS (Xcode) & Windows Core
        </div>
      </footer>
    </div>
  );
}
