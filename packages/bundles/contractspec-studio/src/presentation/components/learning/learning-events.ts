export interface LearningEvent {
  name: string;
  ts: number;
  payload?: Record<string, unknown>;
}

const STORAGE_KEY = 'contractspec.learning.events.v1';
const MAX_EVENTS = 200;

export function recordLearningEvent(event: LearningEvent): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = readLearningEvents();
    const next = [...existing, event].slice(-MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort; ignore storage errors
  }
}

export function readLearningEvents(): LearningEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLearningEvent);
  } catch {
    return [];
  }
}

function isLearningEvent(value: unknown): value is LearningEvent {
  if (!value || typeof value !== 'object') return false;
  const record = value as { name?: unknown; ts?: unknown; payload?: unknown };
  return typeof record.name === 'string' && typeof record.ts === 'number';
}



