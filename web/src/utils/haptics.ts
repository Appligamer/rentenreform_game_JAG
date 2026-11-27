// Haptisches Feedback: Navigator Vibrate API (Web/Android) + Apple WKWebView Swift Bridge (iOS/iPadOS/macOS)
export type HapticStyle =
  | 'selection'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

type WebkitMessageHandler = {
  postMessage: (message: { style: HapticStyle }) => void;
};

type WebkitWindow = Window & {
  webkit?: {
    messageHandlers?: {
      haptics?: WebkitMessageHandler;
    };
  };
};

const WEB_VIBRATION_PATTERNS: Record<HapticStyle, number | number[]> = {
  selection: 8,
  light: 12,
  medium: 24,
  heavy: [30, 20, 45],
  success: [18, 35, 28],
  warning: [25, 40, 25],
  error: [40, 30, 40, 30, 60],
};

class HapticFeedbackEngine {
  private enabled: boolean = true;
  private lastTriggeredAt: number = 0;

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  toggleEnabled(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  trigger(style: HapticStyle = 'light'): boolean {
    if (!this.enabled || typeof window === 'undefined') {
      return false;
    }

    let dispatched = false;

    // 1. Native Apple WKWebView Bridge (UIImpactFeedbackGenerator / NSHapticFeedbackManager)
    try {
      const webkitWin = window as WebkitWindow;
      const handler = webkitWin.webkit?.messageHandlers?.haptics;
      if (handler && typeof handler.postMessage === 'function') {
        handler.postMessage({ style });
        dispatched = true;
      }
    } catch {
      // WKWebView bridge unavailable
    }

    // 2. Web Standard Navigator Vibrate API (Android / Mobile Browser)
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        const pattern = WEB_VIBRATION_PATTERNS[style] ?? 12;
        if (navigator.vibrate(pattern)) {
          dispatched = true;
        }
      }
    } catch {
      // Navigator vibrate unsupported or blocked before user gesture
    }

    return dispatched;
  }

  triggerThrottled(style: HapticStyle = 'selection', minIntervalMs: number = 70): boolean {
    const now = Date.now();
    if (now - this.lastTriggeredAt < minIntervalMs) {
      return false;
    }
    this.lastTriggeredAt = now;
    return this.trigger(style);
  }

  selection() {
    return this.trigger('selection');
  }

  light() {
    return this.trigger('light');
  }

  medium() {
    return this.trigger('medium');
  }

  heavy() {
    return this.trigger('heavy');
  }

  success() {
    return this.trigger('success');
  }

  warning() {
    return this.trigger('warning');
  }

  error() {
    return this.trigger('error');
  }
}

export const hapticEngine = new HapticFeedbackEngine();
