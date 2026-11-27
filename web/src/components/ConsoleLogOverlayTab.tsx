import React, { useEffect, useMemo, useState } from 'react';
import {
  Terminal,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  Search,
  Bug,
} from 'lucide-react';
import { consoleLogger, ConsoleLogEntry, ConsoleLogLevel } from '../utils/consoleLogger';

type FilterLevel = 'all' | ConsoleLogLevel;

export const ConsoleLogOverlayTab: React.FC = () => {
  const [entries, setEntries] = useState<readonly ConsoleLogEntry[]>(() => consoleLogger.getEntries());
  const [filter, setFilter] = useState<FilterLevel>('all');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return consoleLogger.subscribe(setEntries);
  }, []);

  const counts = useMemo(() => {
    let errors = 0;
    let warns = 0;
    let infos = 0;
    for (const e of entries) {
      if (e.level === 'error') errors++;
      else if (e.level === 'warn') warns++;
      else if (e.level === 'info') infos++;
    }
    return { total: entries.length, errors, warns, infos };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...entries]
      .reverse()
      .filter((entry) => {
        if (filter !== 'all' && entry.level !== filter) return false;
        if (!q) return true;
        return (
          entry.message.toLowerCase().includes(q) ||
          entry.source.toLowerCase().includes(q) ||
          entry.timestamp.includes(q)
        );
      });
  }, [entries, filter, query]);

  const envSnapshot = useMemo(() => {
    if (typeof window === 'undefined') {
      return { url: 'SSR', ua: 'Node', viewport: '-', rootChildren: 0, storageOk: false };
    }
    let storageOk = false;
    try {
      window.localStorage.setItem('__gz_probe__', '1');
      window.localStorage.removeItem('__gz_probe__');
      storageOk = true;
    } catch {
      storageOk = false;
    }
    return {
      url: window.location.href,
      ua: navigator.userAgent,
      viewport: `${window.innerWidth}×${window.innerHeight} @${window.devicePixelRatio || 1}x`,
      rootChildren: document.getElementById('root')?.childElementCount ?? 0,
      storageOk,
    };
  }, [entries.length]);

  const handleCopyAll = async () => {
    const text = entries
      .map((e) => `[${e.timestamp}] [${e.level.toUpperCase()}] [${e.source}] ${e.message}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTriggerDiagnosticTest = () => {
    console.info('Diagnose-Check: React #root Kinder =', envSnapshot.rootChildren);
    console.warn('Diagnose-Warnung: Test-Eintrag für iOS/macOS WebView-Overlay');
  };

  const levelBadge = (level: ConsoleLogLevel) => {
    switch (level) {
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-mono text-[10px] uppercase">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        );
      case 'warn':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono text-[10px] uppercase">
            <AlertTriangle className="w-3 h-3" />
            Warn
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-400/15 text-sky-300 border border-sky-400/30 font-mono text-[10px] uppercase">
            <Info className="w-3 h-3" />
            Info
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[#f5f5f7] border border-white/15 font-mono text-[10px] uppercase">
            Log
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Diagnose-Übersicht */}
      <div className="p-5 rounded-2xl bg-[#161617] border border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              DevMode · Console Log Overlay
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Laufzeit- &amp; WebView-Fehlerdiagnose
          </h2>
          <p className="text-xs text-[#86868b]">
            Erfasst frühe WKWebView-Skriptfehler, Ressourcen-Ladefehler, Console-Meldungen und React-Fehler direkt in der App.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTriggerDiagnosticTest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#f5f5f7] transition-colors cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span>Test-Log</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#f5f5f7] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopiert</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#86868b]" />
                <span>Logs kopieren</span>
              </>
            )}
          </button>

          <button
            onClick={() => consoleLogger.clear()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs text-red-300 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Leeren</span>
          </button>
        </div>
      </div>

      {/* Laufzeit-Umgebung (hilft bei Weißer-Bildschirm-Analyse) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#161617] border border-white/10">
          <div className="text-[11px] text-[#86868b] mb-1">Bundle-URL</div>
          <div className="text-xs font-mono text-white truncate" title={envSnapshot.url}>
            {envSnapshot.url}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#161617] border border-white/10">
          <div className="text-[11px] text-[#86868b] mb-1">Viewport &amp; DPR</div>
          <div className="text-xs font-mono text-white tabular-nums">{envSnapshot.viewport}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#161617] border border-white/10">
          <div className="text-[11px] text-[#86868b] mb-1">DOM #root Elemente</div>
          <div className="text-xs font-mono text-emerald-400 tabular-nums">
            {envSnapshot.rootChildren} aktiv · Storage {envSnapshot.storageOk ? 'OK' : 'gesperrt'}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#161617] border border-white/10">
          <div className="text-[11px] text-[#86868b] mb-1">Fehler / Warnungen</div>
          <div className="text-xs font-mono tabular-nums">
            <span className={counts.errors > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {counts.errors} Errors
            </span>
            <span className="text-[#86868b]"> · </span>
            <span className={counts.warns > 0 ? 'text-amber-400 font-bold' : 'text-[#f5f5f7]'}>
              {counts.warns} Warns
            </span>
          </div>
        </div>
      </div>

      {/* Filter- & Suchleiste */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {([
            { id: 'all', label: `Alle (${counts.total})` },
            { id: 'error', label: `Errors (${counts.errors})` },
            { id: 'warn', label: `Warnings (${counts.warns})` },
            { id: 'info', label: `Info (${counts.infos})` },
            { id: 'log', label: 'Log' },
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                filter === item.id
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                  : 'bg-[#161617] text-[#86868b] border-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Logs durchsuchen..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#161617] border border-white/10 text-xs text-white placeholder-[#86868b] focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Log-Stream */}
      <div className="rounded-2xl bg-[#0b0b0c] border border-white/10 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/10 bg-[#161617] flex items-center justify-between text-[11px] font-mono text-[#86868b]">
          <span>Console-Ausgabe (neueste zuerst)</span>
          <span className="truncate max-w-[60%]" title={envSnapshot.ua}>
            {envSnapshot.ua}
          </span>
        </div>

        <div className="max-h-[460px] overflow-y-auto divide-y divide-white/5">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#86868b]">
              Keine Log-Einträge für den aktuellen Filter vorhanden.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`px-4 py-2.5 flex flex-col sm:flex-row sm:items-start gap-2 text-xs ${
                  entry.level === 'error'
                    ? 'bg-red-500/[0.06]'
                    : entry.level === 'warn'
                    ? 'bg-amber-400/[0.04]'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] text-[#6e6e73] tabular-nums">
                    {entry.timestamp}
                  </span>
                  {levelBadge(entry.level)}
                  <span className="font-mono text-[11px] text-[#86868b]">
                    [{entry.source}]
                  </span>
                </div>
                <pre className="font-mono text-[11px] text-[#f5f5f7] whitespace-pre-wrap break-words flex-1 leading-relaxed">
                  {entry.message}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
