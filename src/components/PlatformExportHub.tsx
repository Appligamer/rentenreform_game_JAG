import React, { useState } from 'react';
import { Apple, Monitor, Terminal, Copy, Check, FolderGit2, Sparkles } from 'lucide-react';

export const PlatformExportHub: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const xcodeCmd = `cd ~/pension_game_simulation && open macos/Runner.xcodeproj`;
  const windowsCmd = `cd %USERPROFILE%\\pension_game_simulation && flutter run -d windows`;
  const fullGitSyncCmd = `cd ~ && rm -rf pension_game_simulation && git clone https://github.com/JacobGlathe/pension_game_simulation.git pension_game_simulation && cd pension_game_simulation && (open macos/Runner.xcodeproj 2>/dev/null || open .)`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1 font-mono">
          <span>Multiplattform-Architektur</span>
          <span>·</span>
          <span>Flutter (Dart) & Xcode Runner</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Plattform-Export & Xcode Hub
        </h1>
        <p className="text-sm text-[#86868b] max-w-2xl mt-1">
          Das Projekt ist so aufgebaut, dass es nativ auf macOS in Xcode kompiliert,
          auf Windows als Desktop-App gebaut und live im Web getestet werden kann.
        </p>
      </div>

      {/* 2 Platform Cards: macOS (Xcode) vs Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* macOS & Xcode Card */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/10 text-white">
                <Apple className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">macOS & Xcode</h3>
                <span className="text-xs text-[#86868b]">
                  Natives Apple Runner Projekt (Swift / Cocoa)
                </span>
              </div>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed mb-4">
              Das Projekt enthält den vollständig konfigurierten Ordner{' '}
              <code className="text-amber-400 font-mono text-[11px]">macos/Runner.xcodeproj</code>.
              Du kannst das Projekt mit einem Klick in Xcode öffnen, App-Icons einbinden,
              Signieren und als native Mac-App deployen.
            </p>

            <div className="p-3.5 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#f5f5f7] mb-4 flex items-center justify-between">
              <span className="truncate">{xcodeCmd}</span>
              <button
                onClick={() => copyCommand(xcodeCmd, 'xcode')}
                className="ml-2 p-1.5 text-[#86868b] hover:text-white rounded"
              >
                {copiedKey === 'xcode' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#6e6e73] space-y-1">
            <div>1. In Terminal ausführen oder direkt im Finder doppelklicken.</div>
            <div>2. Target "Runner" auswählen und mit <kbd className="text-white">Cmd + R</kbd> starten.</div>
          </div>
        </div>

        {/* Windows Card */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/10 text-white">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Windows Desktop</h3>
                <span className="text-xs text-[#86868b]">
                  C++ Desktop Runner via CMake
                </span>
              </div>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed mb-4">
              Die Windows-Version nutzt den nativen C++-Desktop-Runner unter{' '}
              <code className="text-amber-400 font-mono text-[11px]">windows/CMakeLists.txt</code>.
              Kompiliert für Windows 10/11 mit 60/120 FPS ohne Browser-Overhead.
            </p>

            <div className="p-3.5 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#f5f5f7] mb-4 flex items-center justify-between">
              <span className="truncate">{windowsCmd}</span>
              <button
                onClick={() => copyCommand(windowsCmd, 'win')}
                className="ml-2 p-1.5 text-[#86868b] hover:text-white rounded"
              >
                {copiedKey === 'win' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#6e6e73] space-y-1">
            <div>1. Visual Studio mit C++ Workload installiert.</div>
            <div>2. <code className="text-white">flutter run -d windows</code> ausführen.</div>
          </div>
        </div>
      </div>

      {/* GitHub Sync Command Block */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-amber-400/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Terminal className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">
              One-Click Terminal Sync (Automatisch aktualisieren & öffnen)
            </span>
          </div>
          <button
            onClick={() => copyCommand(fullGitSyncCmd, 'sync')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 text-black hover:bg-amber-300 transition-colors"
          >
            {copiedKey === 'sync' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Befehl kopieren</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-[#86868b] mb-3">
          Löscht den alten lokalen Ordner, lädt den neuesten Stand von GitHub herunter,
          wechselt in den Projektordner und öffnet ihn automatisch in Xcode bzw. VS Code:
        </p>

        <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-amber-400/90 whitespace-pre-wrap break-all select-all">
          {fullGitSyncCmd}
        </pre>
      </div>

      {/* Project Structure Reference */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <FolderGit2 className="w-4 h-4 text-white" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Projektstruktur im Repository
          </h3>
        </div>

        <pre className="font-mono text-xs text-[#86868b] leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5 overflow-x-auto">
{`pension_game_simulation/
├── system_prompt.md                   # Dauerhafter System-Prompt des Teams
├── graphic_designer_briefing.md       # Vollständiges Handzeichnungs-Briefing
├── pubspec.yaml                       # Flutter Multiplattform Dependencies
├── README.md                          # Dokumentation & Quickstart
├── macos/                             # Natives macOS Xcode Projekt
│   └── Runner.xcodeproj               # Direkt mit 'open macos/Runner.xcodeproj' öffenbar
├── windows/                           # C++ Windows Desktop Runner
│   └── CMakeLists.txt
└── lib/                               # Dart Spiel- & Simulationscode
    ├── main.dart                      # Einstiegspunkt
    ├── simulation/                    # Rentenpaket II & Generationenkapital Formeln
    ├── models/                        # MacroState, CitizenProfile, DecisionCards
    └── ui/screens/                    # GameBoardScreen & HandDrawnSlots`}
        </pre>
      </div>
    </div>
  );
};
