import React, { useState } from 'react';
import { Apple, Monitor, Terminal, Copy, Check, FolderGit2, Play, Sparkles } from 'lucide-react';

export const PlatformExportHub: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const macCommand = `./START_GAME_MAC.command`;
  const winCommand = `START_GAME_WINDOWS.exe`;
  const fullGitSyncCmd = `cd ~ && rm -rf rentenreform_game_JAG && git clone https://github.com/Appligamer/rentenreform_game_JAG.git rentenreform_game_JAG && cd rentenreform_game_JAG && (open macos/Runner.xcodeproj 2>/dev/null || open .)`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1 font-mono">
          <span>Multiplattform-Architektur</span>
          <span>·</span>
          <span>1-Klick Executables im Überordner</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Direktstart für Apple macOS & Windows
        </h1>
        <p className="text-sm text-[#86868b] max-w-2xl mt-1">
          Im Hauptordner des Projekts liegen sofort ausführbare Starter für beide Betriebssysteme.
          Einfach doppelklicken, um das Spiel sofort zu booten.
        </p>
      </div>

      {/* Prominent Launchers Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apple Executable */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1c1f] via-[#161617] to-[#111113] border border-amber-400/40 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 text-white">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Apple macOS Starter</h3>
                  <span className="text-xs text-amber-400 font-mono">
                    START_GAME_MAC.command & .app
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-bold">
                Nativ macOS
              </span>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed mb-4">
              Liegt direkt im Hauptverzeichnis. Durch Doppelklick im macOS Finder wird
              automatisch das korrigierte Xcode-Projekt <code className="text-white font-mono text-[11px]">macos/Runner.xcodeproj</code> geöffnet
              oder das Spiel im Desktop-Modus gestartet.
            </p>

            <div className="p-3.5 rounded-xl bg-black border border-white/10 font-mono text-xs text-amber-400 mb-4 flex items-center justify-between">
              <span className="truncate">{macCommand}</span>
              <button
                onClick={() => copyCommand(macCommand, 'mac')}
                className="ml-2 p-1.5 text-[#86868b] hover:text-white rounded"
              >
                {copiedKey === 'mac' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#6e6e73] space-y-1">
            <div>· Doppelklick auf <strong className="text-white">START_GAME_MAC.command</strong> im Finder.</div>
            <div>· Alternativ: <strong className="text-white">GenerationZukunft.app</strong> direkt starten.</div>
          </div>
        </div>

        {/* Windows Executable */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1c1f] via-[#161617] to-[#111113] border border-sky-400/40 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 text-white">
                  <Monitor className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Windows Starter</h3>
                  <span className="text-xs text-sky-400 font-mono">
                    START_GAME_WINDOWS.exe & .bat
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-sky-400/10 text-sky-400 px-2 py-0.5 rounded font-bold">
                Nativ Windows .exe
              </span>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed mb-4">
              Liegt als eigenständige Binärdatei <code className="text-white font-mono text-[11px]">START_GAME_WINDOWS.exe</code> direkt
              im Hauptverzeichnis. Ein Doppelklick bootet das Spiel auf Windows 10/11 sofort.
            </p>

            <div className="p-3.5 rounded-xl bg-black border border-white/10 font-mono text-xs text-sky-400 mb-4 flex items-center justify-between">
              <span className="truncate">{winCommand}</span>
              <button
                onClick={() => copyCommand(winCommand, 'win')}
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
            <div>· Doppelklick auf <strong className="text-white">START_GAME_WINDOWS.exe</strong> in Windows.</div>
            <div>· Alternativ: <strong className="text-white">start_game_windows.bat</strong> ausführen.</div>
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
            Projektstruktur im Hauptordner (Root)
          </h3>
        </div>

        <pre className="font-mono text-xs text-[#86868b] leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5 overflow-x-auto">
{`rentenreform_game_JAG/
├── START_GAME_MAC.command             # 🍎 Apple macOS 1-Klick-Starter (Doppelklickbar)
├── GenerationZukunft.app              # 🍎 Nativer macOS App-Bundle Ordner
├── START_GAME_WINDOWS.exe             # 🪟 Windows PE 1-Klick-Starter (Nativ .exe)
├── start_game_windows.bat             # 🪟 Windows Batch Starter
├── macos/                             # 🍎 Xcode Runner Projekt (MACOSX_DEPLOYMENT_TARGET 11.0 & Info.plist)
│   └── Runner.xcodeproj
├── windows/                           # 🪟 C++ Windows Desktop Runner
│   └── runner/
├── system_prompt.md                   # Dauerhafter System-Prompt des Teams
├── graphic_designer_briefing.md       # Vollständiges Handzeichnungs-Briefing
└── pension_game_simulation/           # Flutter Multiplattform Quellcode`}
        </pre>
      </div>
    </div>
  );
};
