import React from 'react';
import { ToastNotice } from '../types';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastBannerProps {
  toasts: ToastNotice[];
  onDismiss: (id: number) => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const style =
          toast.type === 'warning'
            ? 'border-red-500/40 bg-[#1c1315] text-red-200'
            : toast.type === 'success'
            ? 'border-emerald-500/40 bg-[#111c17] text-emerald-200'
            : 'border-white/15 bg-[#161617] text-[#f5f5f7]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs backdrop-blur-xl ${style}`}
          >
            <div className="flex items-start gap-2.5 leading-snug">
              {toast.type === 'warning' && (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Hinweis schließen"
              className="text-white/40 hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
