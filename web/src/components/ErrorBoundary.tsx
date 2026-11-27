import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { consoleLogger } from '../utils/consoleLogger';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Unbekannter Laufzeitfehler',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    consoleLogger.pushEntry(
      'error',
      'ErrorBoundary',
      `${error.name}: ${error.message}\n${info.componentStack || error.stack || ''}`
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#161617] border border-white/10 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Simulations-Wiederherstellung</h2>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Ein Modul hat einen Fehler gemeldet ({this.state.errorMessage}). Die Sitzung kann
              ohne Neuladen der Seite zurückgesetzt werden.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ansicht wiederherstellen</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
