import { useState, useCallback, useRef } from 'react';
import {
  DecisionCard,
  DifficultyLevel,
  DilemmaOption,
  GameMetrics,
  GameOverReason,
  GameStatus,
  MacroState,
  PolicyModifiers,
  ToastNotice,
  TurnFeedback,
} from '../types';
import { PensionMathEngine } from '../simulation/pensionEngine';
import { DECISION_CARDS } from '../data/cardsData';
import { getDilemmaForYear } from '../data/dilemmasData';
import {
  applyDecisionCardModifiers,
  createInitialMetrics,
  resolveTurn,
} from '../simulation/gameBalanceEngine';
import { soundEngine } from '../utils/soundEffects';
import { hapticEngine } from '../utils/haptics';

export function usePensionGame() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('hard');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);
  const [macro, setMacro] = useState<MacroState>(() => PensionMathEngine.getInitialState());
  const [history, setHistory] = useState<MacroState[]>(() => [PensionMathEngine.getInitialState()]);
  const [modifiers, setModifiers] = useState<PolicyModifiers>(() =>
    PensionMathEngine.getInitialModifiers()
  );
  const [metrics, setMetrics] = useState<GameMetrics>(() => createInitialMetrics('hard'));
  const [playedCardIds, setPlayedCardIds] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<TurnFeedback | null>(null);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const toastIdRef = useRef(1);

  const pushToast = useCallback((message: string, type: ToastNotice['type'] = 'info') => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentDilemma = getDilemmaForYear(macro.year);

  const resetWithDifficulty = useCallback(
    (targetDiff: DifficultyLevel) => {
      const initial = PensionMathEngine.getInitialState();
      setDifficulty(targetDiff);
      setMacro(initial);
      setHistory([initial]);
      setModifiers(PensionMathEngine.getInitialModifiers());
      setPlayedCardIds([]);
      setGameStatus('playing');
      setGameOverReason(null);
      setLastFeedback(null);
      setMetrics(createInitialMetrics(targetDiff));
    },
    []
  );

  const handleRestartGame = useCallback(() => {
    soundEngine.playClick();
    hapticEngine.light();
    resetWithDifficulty(difficulty);
    pushToast('Kampagne 2026 neu gestartet.', 'info');
  }, [difficulty, pushToast, resetWithDifficulty]);

  const handleDifficultyChange = useCallback(
    (newDiff: DifficultyLevel) => {
      if (newDiff === difficulty) return;
      soundEngine.playClick();
      hapticEngine.selection();
      resetWithDifficulty(newDiff);
      const label =
        newDiff === 'hardcore' ? 'Hardcore' : newDiff === 'hard' ? 'Schwer' : 'Normal';
      pushToast(`Schwierigkeitsgrad auf „${label}“ umgestellt.`, 'info');
    },
    [difficulty, pushToast, resetWithDifficulty]
  );

  const handleSelectDilemmaOption = useCallback(
    (option?: DilemmaOption) => {
      if (gameStatus !== 'playing') return;

      const cost = option?.consequences.capitalCost ?? 0;
      if (cost > metrics.politicalCapital) {
        soundEngine.playAlert();
        hapticEngine.warning();
        pushToast(
          `Nicht genügend Politisches Kapital (${metrics.politicalCapital} von ${cost} benötigt).`,
          'warning'
        );
        return;
      }

      if (option) {
        soundEngine.playCard();
        hapticEngine.medium();
      } else {
        soundEngine.playYearTick();
        hapticEngine.light();
      }

      const result = resolveTurn({
        macro,
        metrics,
        modifiers,
        difficulty,
        option,
      });

      setMacro(result.nextMacro);
      setHistory((prev) => [...prev, result.nextMacro]);
      setMetrics(result.nextMetrics);
      setModifiers(result.nextModifiers);
      setLastFeedback(result.feedback);

      if (result.nextStatus === 'game_over') {
        soundEngine.playAlert();
        hapticEngine.error();
        setGameStatus('game_over');
        setGameOverReason(result.gameOverReason);
      } else if (result.nextStatus === 'victory') {
        soundEngine.playVictory();
        hapticEngine.success();
        setGameStatus('victory');
        setGameOverReason(null);
      }
    },
    [difficulty, gameStatus, macro, metrics, modifiers, pushToast]
  );

  const handlePlayCard = useCallback(
    (card: DecisionCard) => {
      if (gameStatus !== 'playing') return;
      if (playedCardIds.includes(card.id)) return;

      if (metrics.politicalCapital < card.politicalCapitalCost) {
        soundEngine.playAlert();
        hapticEngine.warning();
        pushToast(
          `Für „${card.title}“ werden ${card.politicalCapitalCost} Kapitalpunkte benötigt (verfügbar: ${metrics.politicalCapital}).`,
          'warning'
        );
        return;
      }

      soundEngine.playCard();
      hapticEngine.heavy();
      const { nextModifiers, nextMetrics } = applyDecisionCardModifiers(
        card,
        modifiers,
        metrics
      );

      setPlayedCardIds((prev) => [...prev, card.id]);
      setModifiers(nextModifiers);
      setMetrics(nextMetrics);
      pushToast(`Reformkarte „${card.title}“ im Gesetzblatt verankert.`, 'success');
    },
    [gameStatus, metrics, modifiers, playedCardIds, pushToast]
  );

  // Dev Sandbox Controls
  const setExtraCreditMrd = useCallback((val: number) => {
    setModifiers((prev) => ({ ...prev, extraCapitalCreditMrd: val }));
  }, []);

  const setRetirementShiftMonths = useCallback((val: number) => {
    setModifiers((prev) => ({ ...prev, retirementShiftMonths: val }));
  }, []);

  const toggleHaltelinie = useCallback(() => {
    setModifiers((prev) => ({ ...prev, forceHaltelinie48: !prev.forceHaltelinie48 }));
  }, []);

  return {
    difficulty,
    gameStatus,
    gameOverReason,
    macro,
    history,
    metrics,
    modifiers,
    cards: DECISION_CARDS,
    playedCardIds,
    currentDilemma,
    lastFeedback,
    toasts,
    dismissToast,
    pushToast,
    handleRestartGame,
    handleDifficultyChange,
    handleSelectDilemmaOption,
    handlePlayCard,
    setExtraCreditMrd,
    setRetirementShiftMonths,
    toggleHaltelinie,
  };
}
