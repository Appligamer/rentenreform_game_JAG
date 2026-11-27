import React, { useEffect, useRef, useState } from 'react';
import { usePensionGame } from './hooks/usePensionGame';
import { getDifficultyConfig } from './simulation/difficultyConfig';
import { calculateAwardTier } from './simulation/gameBalanceEngine';
import { Navbar, AppTab } from './components/Navbar';
import { ToastBanner } from './components/ToastBanner';
import { GameChallengeScreen } from './components/GameChallengeScreen';
import { CitizenSimulation } from './components/CitizenSimulation';
import { RulesMissionView } from './components/RulesMissionView';
import { DesignerAssetExplorer } from './components/DesignerAssetExplorer';
import { PlatformExportHub } from './components/PlatformExportHub';
import { ConsoleLogOverlayTab } from './components/ConsoleLogOverlayTab';
import { WelcomeScreen } from './components/WelcomeScreen';
import { consoleLogger } from './utils/consoleLogger';
import {
  clearScoreHistory,
  createRunId,
  loadScoreHistory,
  SavedRunScore,
  upsertRunScore,
} from './utils/scoreHistory';
import { DifficultyLevel } from './types';

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<AppTab>('game');
  const [devMode, setDevMode] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<SavedRunScore[]>(() => loadScoreHistory());
  const runIdRef = useRef<string>(createRunId());

  useEffect(() => {
    return consoleLogger.subscribe((entries) => {
      let count = 0;
      for (const e of entries) {
        if (e.level === 'error') count++;
      }
      setErrorCount(count);
    });
  }, []);

  const handleToggleDevMode = () => {
    setDevMode((prev) => {
      const next = !prev;
      if (!next && (currentTab === 'briefing' || currentTab === 'export' || currentTab === 'console')) {
        setCurrentTab('game');
      }
      return next;
    });
  };

  const game = usePensionGame();
  const diffConfig = getDifficultyConfig(game.difficulty);

  // Laufende und abgeschlossene Scores automatisch für den nächsten Boot speichern
  useEffect(() => {
    if (game.macro.year <= 2026 && game.gameStatus === 'playing') return;
    const entry: SavedRunScore = {
      id: runIdRef.current,
      updatedAt: new Date().toISOString(),
      difficulty: game.difficulty,
      status: game.gameStatus,
      year: game.macro.year,
      score: game.metrics.score,
      contributionRate: game.macro.contributionRate,
      pensionLevel: game.macro.pensionLevel,
      generationCapitalFund: game.macro.generationCapitalFund,
      awardTier:
        game.gameStatus === 'victory'
          ? calculateAwardTier(game.macro, game.metrics)
          : undefined,
    };
    setScoreHistory(upsertRunScore(entry));
  }, [
    game.difficulty,
    game.gameStatus,
    game.macro.contributionRate,
    game.macro.generationCapitalFund,
    game.macro.pensionLevel,
    game.macro.year,
    game.metrics.score,
    game.macro,
    game.metrics,
  ]);

  const handleRestartWithNewRun = () => {
    runIdRef.current = createRunId();
    game.handleRestartGame();
  };

  const handleDifficultyChangeWithNewRun = (newDiff: DifficultyLevel) => {
    if (newDiff !== game.difficulty) {
      runIdRef.current = createRunId();
    }
    game.handleDifficultyChange(newDiff);
  };

  const handleStartFromWelcome = () => {
    setCurrentTab('game');
    setShowWelcome(false);
  };

  const handleClearScores = () => {
    setScoreHistory(clearScoreHistory());
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {!showWelcome && (
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenWelcome={() => setShowWelcome(true)}
          currentYear={game.macro.year}
          devMode={devMode}
          onToggleDevMode={handleToggleDevMode}
          score={game.metrics.score}
          errorCount={errorCount}
        />
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {showWelcome ? (
          <WelcomeScreen
            scores={scoreHistory}
            onStartGame={handleStartFromWelcome}
            onClearScores={handleClearScores}
          />
        ) : (
          <>
            {currentTab === 'game' && (
              <GameChallengeScreen
                macro={game.macro}
                history={game.history}
                metrics={game.metrics}
                gameStatus={game.gameStatus}
                gameOverReason={game.gameOverReason}
                currentDilemma={game.currentDilemma}
                lastFeedback={game.lastFeedback}
                onSelectDilemmaOption={game.handleSelectDilemmaOption}
                cards={game.cards}
                playedCardIds={game.playedCardIds}
                onPlayCard={game.handlePlayCard}
                onRestartGame={handleRestartWithNewRun}
                difficulty={game.difficulty}
                onDifficultyChange={handleDifficultyChangeWithNewRun}
                devMode={devMode}
                extraCreditMrd={game.modifiers.extraCapitalCreditMrd}
                onExtraCreditChange={game.setExtraCreditMrd}
                retirementShiftMonths={game.modifiers.retirementShiftMonths}
                onRetirementShiftChange={game.setRetirementShiftMonths}
                forceHaltelinie={game.modifiers.forceHaltelinie48}
                onToggleHaltelinie={game.toggleHaltelinie}
              />
            )}

            {currentTab === 'citizen' && <CitizenSimulation macro={game.macro} />}

            {currentTab === 'rules' && <RulesMissionView />}

            {devMode && currentTab === 'briefing' && <DesignerAssetExplorer />}

            {devMode && currentTab === 'export' && <PlatformExportHub />}

            {devMode && currentTab === 'console' && <ConsoleLogOverlayTab />}
          </>
        )}
      </main>

      <ToastBanner toasts={game.toasts} onDismiss={game.dismissToast} />

      <footer className="border-t border-white/10 py-5 px-6 text-xs text-[#86868b] flex flex-col sm:flex-row justify-between items-center gap-3 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="font-semibold text-white">Generation Zukunft</span>
          <span aria-hidden="true">·</span>
          <span>Bundeswettbewerb econo=me</span>
          <span aria-hidden="true">·</span>
          <span>Rente gut, alles gut?</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#6e6e73]">
          <span>
            Modus: <strong className="text-amber-400">{diffConfig.label}</strong>
          </span>
          <span aria-hidden="true">·</span>
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
