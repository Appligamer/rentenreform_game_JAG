export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error';

export interface ConsoleLogEntry {
  id: number;
  timestamp: string;
  level: ConsoleLogLevel;
  source: string;
  message: string;
}

type LogListener = (entries: readonly ConsoleLogEntry[]) => void;

interface EarlyLogItem {
  timestamp?: string;
  level?: string;
  source?: string;
  message?: string;
}

declare global {
  interface Window {
    __EARLY_LOGS__?: EarlyLogItem[];
  }
}

const MAX_LOG_ENTRIES = 300;

function formatTimestamp(date = new Date()): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

function serializeArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) {
    return `${arg.name}: ${arg.message}${arg.stack ? `\n${arg.stack}` : ''}`;
  }
  if (typeof arg === 'object' && arg !== null) {
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return Object.prototype.toString.call(arg);
    }
  }
  return String(arg);
}

class ConsoleLoggerStore {
  private entries: ConsoleLogEntry[] = [];
  private listeners = new Set<LogListener>();
  private nextId = 1;
  private initialized = false;
  private isNotifying = false;

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Drain any early logs captured before the JS module loaded (e.g. WKWebView UserScript)
    if (Array.isArray(window.__EARLY_LOGS__)) {
      for (const item of window.__EARLY_LOGS__) {
        const level: ConsoleLogLevel =
          item.level === 'error' || item.level === 'warn' || item.level === 'info'
            ? item.level
            : 'log';
        this.pushEntry(
          level,
          item.source || 'early-boot',
          item.message || '',
          item.timestamp
        );
      }
      window.__EARLY_LOGS__ = [];
    }

    const origLog = console.log.bind(console);
    const origInfo = console.info.bind(console);
    const origWarn = console.warn.bind(console);
    const origError = console.error.bind(console);

    console.log = (...args: unknown[]) => {
      this.pushEntry('log', 'console', args.map(serializeArg).join(' '));
      origLog(...args);
    };
    console.info = (...args: unknown[]) => {
      this.pushEntry('info', 'console', args.map(serializeArg).join(' '));
      origInfo(...args);
    };
    console.warn = (...args: unknown[]) => {
      this.pushEntry('warn', 'console', args.map(serializeArg).join(' '));
      origWarn(...args);
    };
    console.error = (...args: unknown[]) => {
      this.pushEntry('error', 'console', args.map(serializeArg).join(' '));
      origError(...args);
    };

    window.addEventListener(
      'error',
      (event: Event) => {
        if (typeof ErrorEvent !== 'undefined' && event instanceof ErrorEvent) {
          const loc = event.filename ? ` (${event.filename}:${event.lineno}:${event.colno})` : '';
          const errDetail = event.error instanceof Error ? `\n${event.error.stack ?? event.error.message}` : '';
          this.pushEntry('error', 'window.onerror', `${event.message || 'Unbekannter Script-Fehler'}${loc}${errDetail}`);
          return;
        }
        const target = event.target as HTMLElement | null;
        if (target && 'tagName' in target) {
          const src = (target as HTMLScriptElement).src || (target as HTMLLinkElement).href || '';
          this.pushEntry('error', 'resource', `Ressource konnte nicht geladen werden: <${target.tagName.toLowerCase()}> ${src}`);
        }
      },
      true
    );

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.pushEntry('error', 'promise', `Unhandled Rejection: ${serializeArg(event.reason)}`);
    });

    this.pushEntry(
      'info',
      'boot',
      `App gestartet | URL: ${window.location.href} | Viewport: ${window.innerWidth}x${window.innerHeight} | Online: ${navigator.onLine}`
    );
  }

  pushEntry(level: ConsoleLogLevel, source: string, message: string, customTimestamp?: string): void {
    const entry: ConsoleLogEntry = {
      id: this.nextId++,
      timestamp: customTimestamp || formatTimestamp(),
      level,
      source,
      message,
    };
    this.entries = [...this.entries.slice(-(MAX_LOG_ENTRIES - 1)), entry];
    if (this.isNotifying) return;
    this.isNotifying = true;
    try {
      for (const listener of this.listeners) {
        listener(this.entries);
      }
    } finally {
      this.isNotifying = false;
    }
  }

  getEntries(): readonly ConsoleLogEntry[] {
    return this.entries;
  }

  clear(): void {
    this.entries = [];
    this.pushEntry('info', 'dev-console', 'Log-Puffer geleert.');
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener(this.entries);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const consoleLogger = new ConsoleLoggerStore();
