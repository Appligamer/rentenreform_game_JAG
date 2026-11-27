import { AwardTier, DifficultyLevel, GameStatus } from '../types';

export interface SavedRunScore {
  id: string;
  updatedAt: string;
  difficulty: DifficultyLevel;
  status: GameStatus;
  year: number;
  score: number;
  contributionRate: number;
  pensionLevel: number;
  generationCapitalFund: number;
  awardTier?: AwardTier;
}

const STORAGE_KEY = 'gz_score_history_v1';
const MAX_ENTRIES = 20;

export function createRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadScoreHistory(): SavedRunScore[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storage = window.localStorage;
    if (!storage) return [];
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedRunScore =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.score === 'number' &&
        typeof item.year === 'number'
    );
  } catch {
    return [];
  }
}

export function upsertRunScore(entry: SavedRunScore): SavedRunScore[] {
  const existing = loadScoreHistory();
  const filtered = existing.filter((item) => item.id !== entry.id);
  const next = [entry, ...filtered]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_ENTRIES);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota / private mode / WebView restrictions
    }
  }
  return next;
}

export function clearScoreHistory(): SavedRunScore[] {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return [];
}
