import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Lock, Terminal } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface NavbarProps {
  currentTab: 'game' | 'citizen' | 'rules' | 'briefing' | 'export';
  onSelectTab: (tab: 'game' | 'citizen' | 'rules' | 'briefing' | 'export') => void;
  currentYear: number;
  devMode: boolean;
  onToggleDevMode: () => void;
  score: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentYear,
  devMode,
  onToggleDevMode,
  score,
}) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [muted, setMuted] = useState(soundEngine.isMuted());
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleLogoClick = () => {
    soundEngine.playClick();
    const next = logoClicks + 1;
    if (next >= 5) {
      soundEngine.playVictory();
      onToggleDevMode();
      setLogoClicks(0);
    } else {
      setLogoClicks(next);
      window.setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        soundEngine.playVictory();
        onToggleDevMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleDevMode]);

  const toggleSound = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundEngine.playClick();
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim().toUpperCase() === 'ECONOME2026') {
      soundEngine.playVictory();
      onToggleDevMode();
      setShowSecretModal(false);
      setPasscodeInput('');
      setPasscodeError(false);
    } else {
      soundEngine.playAlert();
      setPasscodeError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 apple-glass">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Wortmarke (einzelnes Markenelement) */}
          <button
            onClick={handleLogoClick}
            title={
              devMode
                ? 'Entwickler-Modus aktiv (Klick zum Beenden)'
                : 'Generation Zukunft'
            }
            className="flex items-center gap-2.5 text-left cursor-pointer select-none whitespace-nowrap shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-black font-extrabold text-xs">
              GZ
            </div>
            <span className="text-sm font-bold tracking-tight text-[#f5f5f7]">
              Generation Zukunft
            </span>
          </button>

          {/* Zone 2: Navigationslinks */}
          <nav className="flex items-center gap-6 text-xs font-medium text-[#86868b] overflow-x-auto">
            <button
              onClick={() => onSelectTab('game')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                currentTab === 'game'
                  ? 'text-white border-b border-amber-400 font-semibold'
                  : ''
              }`}
            >
              Kampagne {currentYear}
            </button>

            <button
              onClick={() => onSelectTab('citizen')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                currentTab === 'citizen'
                  ? 'text-white border-b border-amber-400 font-semibold'
                  : ''
              }`}
            >
              Bürger-Lebenslauf
            </button>

            <button
              onClick={() => onSelectTab('rules')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                currentTab === 'rules'
                  ? 'text-white border-b border-amber-400 font-semibold'
                  : ''
              }`}
            >
              Regeln
            </button>

            {devMode && (
              <>
                <button
                  onClick={() => onSelectTab('briefing')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                    currentTab === 'briefing'
                      ? 'text-amber-400 border-b border-amber-400 font-semibold'
                      : 'text-amber-400/80'
                  }`}
                >
                  Grafik-Briefing
                </button>
                <button
                  onClick={() => onSelectTab('export')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                    currentTab === 'export'
                      ? 'text-amber-400 border-b border-amber-400 font-semibold'
                      : 'text-amber-400/80'
                  }`}
                >
                  Multiplattform
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Kompakte Aktionsleiste */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline text-xs font-mono tabular-nums text-[#86868b]">
              Score <strong className="text-amber-400">{score}</strong>
            </span>

            <button
              onClick={toggleSound}
              aria-label={muted ? 'Ton aktivieren' : 'Ton stummschalten'}
              className="p-2 text-[#86868b] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {devMode ? (
              <button
                onClick={onToggleDevMode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg hover:bg-amber-400/20 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Dev beenden</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setPasscodeError(false);
                  setShowSecretModal(true);
                }}
                aria-label="Entwickler-Zugang"
                className="p-2 text-white/20 hover:text-white/60 transition-colors rounded-lg cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {showSecretModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-[#161617] border border-white/10 text-left shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Shield className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Entwickler-Zugang</h3>
            </div>
            <p className="text-xs text-[#86868b] mb-4">
              Gib den Team-Code ein oder nutze Cmd/Ctrl+Shift+D.
            </p>

            <form onSubmit={handlePasscodeSubmit}>
              <input
                type="password"
                placeholder="Code eingeben (ECONOME2026)..."
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError(false);
                }}
                autoFocus
                className="w-full px-3 py-2 text-xs font-mono bg-black rounded-lg border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 mb-2"
              />
              {passcodeError && (
                <p className="text-[11px] text-red-400 mb-3">
                  Ungültiger Entwickler-Code.
                </p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowSecretModal(false)}
                  className="px-3 py-1.5 text-xs text-[#86868b] hover:text-white cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-400 text-black rounded-lg hover:bg-amber-300 cursor-pointer"
                >
                  Entsperren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
