import React, { useEffect, useState } from 'react';
import { usePensionGame } from './hooks/usePensionGame';
import { getDifficultyConfig } from './simulation/difficultyConfig';
import { Navbar, AppTab } from './components/Navbar';
import { ToastBanner } from './components/ToastBanner';
import { GameChallengeScreen } from './components/GameChallengeScreen';
import { CitizenSimulation } from './components/CitizenSimulation';
import { RulesMissionView } from './components/RulesMissionView';
import { DesignerAssetExplorer } from './components/DesignerAssetExplorer';
import { PlatformExportHub } from './components/PlatformExportHub';
import { ConsoleLogOverlayTab } from './components/ConsoleLogOverlayTab';
import { consoleLogger } from './utils/consoleLogger';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('game');
  const [devMode, setDevMode] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);

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

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentYear={game.macro.year}
        devMode={devMode}
        onToggleDevMode={handleToggleDevMode}
        score={game.metrics.score}
        errorCount={errorCount}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
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
            onRestartGame={game.handleRestartGame}
            difficulty={game.difficulty}
            onDifficultyChange={game.handleDifficultyChange}
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
