import React, { useState } from 'react';
import {
  MacroState,
  GameStatus,
  GameOverReason,
  GameMetrics,
  DilemmaOption,
  DecisionCard,
  DifficultyLevel,
} from './types';
import { PensionMathEngine } from './simulation/pensionEngine';
import { DECISION_CARDS } from './data/cardsData';
import { ANNUAL_DILEMMAS } from './data/dilemmasData';
import { soundEngine } from './utils/soundEffects';
import { Navbar } from './components/Navbar';
import { GameChallengeScreen } from './components/GameChallengeScreen';
import { CitizenSimulation } from './components/CitizenSimulation';
import { RulesMissionView } from './components/RulesMissionView';
import { DesignerAssetExplorer } from './components/DesignerAssetExplorer';
import { PlatformExportHub } from './components/PlatformExportHub';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'game' | 'citizen' | 'rules' | 'briefing' | 'export'>('game');
  
  // VERSTECKTER DEV-MODUS: Standardmäßig FALSE für normale Spieler!
  const [devMode, setDevMode] = useState<boolean>(false);

  // Spielzustand
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);
  const [macro, setMacro] = useState<MacroState>(() => PensionMathEngine.getInitialState());
  const [history, setHistory] = useState<MacroState[]>([PensionMathEngine.getInitialState()]);
  const [cards] = useState<DecisionCard[]>(DECISION_CARDS);
  const [playedCardIds, setPlayedCardIds] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('hard'); // Standard: Schwer (econo=me Wettbewerb)

  // Dynamische Spielmetriken (Vitalwerte)
  const [metrics, setMetrics] = useState<GameMetrics>({
    youthSatisfaction: 68,
    retireeSatisfaction: 72,
    reserveMonths: 1.4,
    politicalCapital: 50,
    score: 100,
    difficulty: 'hard',
  });

  // Stellschrauben
  const [extraCreditMrd, setExtraCreditMrd] = useState<number>(0);
  const [retirementShiftMonths, setRetirementShiftMonths] = useState<number>(0);
  const [forceHaltelinie, setForceHaltelinie] = useState<boolean>(true);

  // Aktuelles jährliches Dilemma
  const currentDilemma = ANNUAL_DILEMMAS[macro.year];

  // Überprüft Verlust- & Siegbedingungen basierend auf Schwierigkeitsgrad
  const checkGameRules = (nextMacro: MacroState, nextMetrics: GameMetrics) => {
    // Schwellenwerte je nach Schwierigkeitsgrad
    const maxContributionRate =
      difficulty === 'hardcore' ? 21.8 : difficulty === 'hard' ? 22.3 : 22.8;
    const minPensionLevel =
      difficulty === 'hardcore' ? 47.4 : difficulty === 'hard' ? 46.8 : 46.2;

    // 1. Jugend-Revolte: Beitragssatz zu hoch oder Jugend-Zufriedenheit kollabiert
    if (nextMetrics.youthSatisfaction <= 0 || nextMacro.contributionRate > maxContributionRate) {
      soundEngine.playAlert();
      setGameStatus('game_over');
      setGameOverReason('youth_revolt');
      return;
    }

    // 2. Altersarmut: Rentenniveau eingebrochen oder Seniorenzufriedenheit kollabiert
    if (nextMetrics.retireeSatisfaction <= 0 || nextMacro.pensionLevel < minPensionLevel) {
      soundEngine.playAlert();
      setGameStatus('game_over');
      setGameOverReason('pensioner_poverty');
      return;
    }

    // 3. Rentenkassen-Insolvenz: Nachhaltigkeitsrücklage aufgebraucht
    if (nextMetrics.reserveMonths <= 0) {
      soundEngine.playAlert();
      setGameStatus('game_over');
      setGameOverReason('state_insolvency');
      return;
    }

    // 4. Sieg: Jahr 2045 überstanden!
    if (nextMacro.year >= 2045) {
      soundEngine.playVictory();
      setGameStatus('victory');
    }
  };

  // Nächstes Jahr simulieren
  const handleAdvanceYear = (dilemmaDelta?: DilemmaOption['consequences']) => {
    // Prüfen ob Kapital für Dilemma ausreicht
    const cost = dilemmaDelta?.capitalCost ?? 0;
    if (cost > metrics.politicalCapital) {
      soundEngine.playAlert();
      alert(`Nicht genügend Politisches Kapital! Du benötigst ${cost} Punkte, hast aber nur ${metrics.politicalCapital}. Wähle eine andere Option oder spare.`);
      return;
    }

    // Realistischer Markt-Volatilitäts-Faktor (econo=me Wettbewerbs-Härtegrad)
    let marketReturn = 6.5;
    if (difficulty !== 'normal') {
      if (macro.year === 2028) marketReturn = 1.8; // Zins-Schock
      if (macro.year === 2033) marketReturn = -3.2; // Globale Marktkorrektur
      if (macro.year === 2037) marketReturn = 2.4; // Stagflation
    }

    const nextMacro = PensionMathEngine.stepYear(macro, {
      extraCapitalCreditMrd: extraCreditMrd + (dilemmaDelta?.generationCapitalDeltaMrd || 0),
      marketReturnOverride: marketReturn,
      retirementAgeShiftMonths: retirementShiftMonths + (dilemmaDelta?.retirementAgeDeltaMonths || 0),
      federalSubsidyDeltaMrd: 0,
      forceHaltelinie48: forceHaltelinie,
    });

    // Manuelle Modifikatoren aus Dilemma
    if (dilemmaDelta?.contributionRateDelta) {
      nextMacro.contributionRate = Number(
        (nextMacro.contributionRate + dilemmaDelta.contributionRateDelta).toFixed(2)
      );
    }
    if (dilemmaDelta?.pensionLevelDelta) {
      nextMacro.pensionLevel = Number(
        (nextMacro.pensionLevel + dilemmaDelta.pensionLevelDelta).toFixed(1)
      );
    }

    // Dynamischer demografischer Druck auf Zufriedenheit
    // Strengere Berechnung im schweren Modus
    const ratePenaltyThreshold = difficulty === 'hardcore' ? 19.0 : difficulty === 'hard' ? 19.5 : 20.0;
    const penaltyMultiplier = difficulty === 'hardcore' ? 18 : difficulty === 'hard' ? 14 : 10;
    let youthChange = (ratePenaltyThreshold - nextMacro.contributionRate) * penaltyMultiplier;
    if (dilemmaDelta?.youthDelta) youthChange += dilemmaDelta.youthDelta;

    // Rentenniveau und Haltelinie
    let retireeChange = (nextMacro.pensionLevel - 48.0) * 12;
    if (dilemmaDelta?.retireeDelta) retireeChange += dilemmaDelta.retireeDelta;

    // Rücklagen-Veränderung (Bundeszuschuss & Defizit)
    let reserveChange = nextMacro.contributionRate >= 21.5 ? 0.05 : -0.12;
    if (dilemmaDelta?.reserveDeltaMonths) reserveChange += dilemmaDelta.reserveDeltaMonths;

    const newYouth = Math.max(0, Math.min(100, Math.round(metrics.youthSatisfaction + youthChange)));
    const newRetiree = Math.max(0, Math.min(100, Math.round(metrics.retireeSatisfaction + retireeChange)));
    const newReserve = Number(Math.max(0, Math.min(3.0, metrics.reserveMonths + reserveChange)).toFixed(2));

    // Politisches Kapital: Regeneriert sich nur, wenn das Volk halbwegs zufrieden ist
    const capitalEarned = (newYouth > 50 && newRetiree > 50) ? 15 : 8;
    const remainingCapital = Math.max(0, Math.min(100, metrics.politicalCapital - cost + capitalEarned));

    const addedScore = Math.round((newYouth + newRetiree) / 2 + nextMacro.generationCapitalFund / 4);

    const nextMetrics: GameMetrics = {
      youthSatisfaction: newYouth,
      retireeSatisfaction: newRetiree,
      reserveMonths: newReserve,
      politicalCapital: remainingCapital,
      score: metrics.score + addedScore,
      difficulty,
    };

    setMacro(nextMacro);
    setHistory((prev) => [...prev, nextMacro]);
    setMetrics(nextMetrics);
    setExtraCreditMrd(0);

    checkGameRules(nextMacro, nextMetrics);
  };

  // Dilemma-Option auswählen
  const handleSelectDilemmaOption = (option: DilemmaOption) => {
    handleAdvanceYear(option.consequences);
  };

  // Strategische Karte ausspielen
  const handlePlayCard = (card: DecisionCard) => {
    if (playedCardIds.includes(card.id)) return;

    if (metrics.politicalCapital < card.politicalCapitalCost) {
      soundEngine.playAlert();
      alert(`Zu wenig Politisches Kapital! Diese Maßnahme erfordert ${card.politicalCapitalCost} Aktionspunkte (Verfügbar: ${metrics.politicalCapital}).`);
      return;
    }

    setPlayedCardIds((prev) => [...prev, card.id]);

    if (card.deltaGenerationFundMrd !== 0) {
      setExtraCreditMrd((prev) => prev + card.deltaGenerationFundMrd);
    }
    if (card.deltaRetirementAgeMonths !== 0) {
      setRetirementShiftMonths((prev) => prev + card.deltaRetirementAgeMonths);
    }

    setMetrics((prev) => ({
      ...prev,
      politicalCapital: prev.politicalCapital - card.politicalCapitalCost,
      score: prev.score + 75,
      youthSatisfaction: Math.min(100, prev.youthSatisfaction + 4),
    }));
  };

  // Spiel neu starten
  const handleRestartGame = () => {
    const initial = PensionMathEngine.getInitialState();
    setMacro(initial);
    setHistory([initial]);
    setPlayedCardIds([]);
    setExtraCreditMrd(0);
    setRetirementShiftMonths(0);
    setForceHaltelinie(true);
    setGameStatus('playing');
    setGameOverReason(null);
    setMetrics({
      youthSatisfaction: 68,
      retireeSatisfaction: 72,
      reserveMonths: 1.4,
      politicalCapital: 50,
      score: 100,
      difficulty,
    });
  };

  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    setDifficulty(newDiff);
    handleRestartGame();
  };

  const handleToggleDevMode = () => {
    setDevMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 3-Zone Top Bar mit verstecktem Dev-Zugang */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentYear={macro.year}
        devMode={devMode}
        onToggleDevMode={handleToggleDevMode}
        score={metrics.score}
      />

      {/* Hauptspielbereich */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'game' && (
          <GameChallengeScreen
            macro={macro}
            metrics={metrics}
            gameStatus={gameStatus}
            gameOverReason={gameOverReason}
            currentDilemma={currentDilemma}
            onSelectDilemmaOption={handleSelectDilemmaOption}
            cards={cards}
            playedCardIds={playedCardIds}
            onPlayCard={handlePlayCard}
            onAdvanceYear={() => handleAdvanceYear()}
            onRestartGame={handleRestartGame}
            devMode={devMode}
            extraCreditMrd={extraCreditMrd}
            onExtraCreditChange={setExtraCreditMrd}
            retirementShiftMonths={retirementShiftMonths}
            onRetirementShiftChange={setRetirementShiftMonths}
            forceHaltelinie={forceHaltelinie}
            onToggleHaltelinie={() => setForceHaltelinie(!forceHaltelinie)}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
        )}

        {currentTab === 'citizen' && (
          <CitizenSimulation macro={macro} />
        )}

        {currentTab === 'rules' && (
          <RulesMissionView />
        )}

        {/* Entwickler- & Designer-Tabs (NUR WENN DEV-MODE AKTIV) */}
        {devMode && currentTab === 'briefing' && (
          <DesignerAssetExplorer />
        )}

        {devMode && currentTab === 'export' && (
          <PlatformExportHub />
        )}
      </main>

      {/* Minimal Footer mit diskretem Entwickler-Hinweis */}
      <footer className="border-t border-white/10 py-5 px-6 text-xs text-[#86868b] flex flex-col sm:flex-row justify-between items-center gap-3 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Generation Zukunft</span>
          <span>·</span>
          <span>Bundeswettbewerb econo=me 2024/2025</span>
          <span>·</span>
          <span>Thema: Rente gut, alles gut?</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#6e6e73]">
          <span>Schwierigkeit: <strong className="text-amber-400 capitalize">{difficulty}</strong></span>
          <span>·</span>
          <a
            href="https://github.com/Appligamer/rentenreform_game_JAG"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors font-mono"
          >
            GitHub: rentenreform_game_JAG
          </a>
        </div>
      </footer>
    </div>
  );
}
