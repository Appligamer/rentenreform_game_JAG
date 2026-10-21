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

  // 5x Klick-Easter-Egg auf das Logo
  const handleLogoClick = () => {
    soundEngine.playClick();
    const next = logoClicks + 1;
    if (next >= 5) {
      soundEngine.playVictory();
      onToggleDevMode();
      setLogoClicks(0);
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  // Tastenkombination Cmd+Shift+D / Ctrl+Shift+D
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
    } else {
      soundEngine.playAlert();
      alert('Falscher Entwickler-Code.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between gap-6 px-6 py-3.5 apple-glass border-b border-white/10 shadow-lg">
        {/* Zone 1: Logo & Interaktives Easter-Egg */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleLogoClick}
            title={
              devMode
                ? 'Entwickler-Modus aktiv! Klicke zum Deaktivieren.'
                : 'Generation Zukunft (Tipp: 5x klicken)'
            }
            className="flex items-center gap-2 group text-left cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs shadow-sm group-hover:scale-105 transition-transform">
              GZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[#f5f5f7] group-hover:text-white transition-colors whitespace-nowrap">
                  Generation Zukunft
                </span>
                {devMode && (
                  <span className="text-[10px] font-mono font-semibold bg-amber-400 text-black px-1.5 py-0.2 rounded animate-pulse">
                    DEV
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#86868b] -mt-0.5 font-mono">
                Renten-Simulation · econo=me
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Normale vs. Versteckte Dev-Tabs) */}
        <nav className="flex items-center gap-5 text-xs font-medium text-[#86868b] overflow-x-auto py-1">
          <button
            onClick={() => onSelectTab('game')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'game'
                ? 'text-white border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Kampagne {currentYear}
          </button>

          <button
            onClick={() => onSelectTab('citizen')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'citizen'
                ? 'text-white border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Bürger-Lebenslauf
          </button>

          <button
            onClick={() => onSelectTab('rules')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'rules'
                ? 'text-white border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Mission & Regeln
          </button>

          {/* NUR IM ENTWICKLER-MODUS SICHTBAR */}
          {devMode && (
            <>
              <span className="text-white/20">|</span>
              <button
                onClick={() => onSelectTab('briefing')}
                className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  currentTab === 'briefing'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-amber-400/80'
                }`}
              >
                Grafik-Briefing
              </button>
              <button
                onClick={() => onSelectTab('export')}
                className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  currentTab === 'export'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-amber-400/80'
                }`}
              >
                Xcode / Multiplattform
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Score, Sound & Geheimer Zugang */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs font-mono">
            <span className="text-[#86868b]">Score:</span>
            <span className="font-bold text-amber-400 tabular-nums">{score}</span>
          </div>

          <button
            onClick={toggleSound}
            title={muted ? 'Ton aktivieren' : 'Ton stummschalten'}
            className="p-1.5 text-[#86868b] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {devMode ? (
            <button
              onClick={onToggleDevMode}
              title="Entwickler-Modus schließen"
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg hover:bg-amber-400/20"
            >
              <Lock className="w-3 h-3" />
              <span>Dev Schließen</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSecretModal(true)}
              title="Geheimer Entwickler-Zugang"
              className="p-1 text-white/10 hover:text-white/40 transition-colors rounded"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Geheimes Eingabefenster für Passcode */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-[#161617] border border-white/10 text-left shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Shield className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Geheimer Entwickler-Zugang</h3>
            </div>
            <p className="text-xs text-[#86868b] mb-4">
              Gib den Team-Entwicklercode ein oder drücke 5x auf das Logo in der Top-Bar.
            </p>

            <form onSubmit={handlePasscodeSubmit}>
              <input
                type="password"
                placeholder="Passcode eingeben (ECONOME2026)..."
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 text-xs font-mono bg-black rounded-lg border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSecretModal(false)}
                  className="px-3 py-1.5 text-xs text-[#86868b] hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-400 text-black rounded-lg hover:bg-amber-300"
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
