import dayjs from 'dayjs';
import type { AnalyticsEvent, ChurnSignal } from '../types';

export interface ChurnPredictorOptions {
  recencyWeight?: number;
  frequencyWeight?: number;
  errorWeight?: number;
  decayDays?: number;
}

export class ChurnPredictor {
  private readonly recencyWeight: number;
  private readonly frequencyWeight: number;
  private readonly errorWeight: number;
  private readonly decayDays: number;

  constructor(options?: ChurnPredictorOptions) {
    this.recencyWeight = options?.recencyWeight ?? 0.5;
    this.frequencyWeight = options?.frequencyWeight ?? 0.3;
    this.errorWeight = options?.errorWeight ?? 0.2;
    this.decayDays = options?.decayDays ?? 14;
  }

  score(events: AnalyticsEvent[]): ChurnSignal[] {
    const grouped = groupBy(events, (event) => event.userId);
    const signals: ChurnSignal[] = [];
    for (const [userId, userEvents] of grouped.entries()) {
      const score = this.computeScore(userEvents);
      signals.push({
        userId,
        score,
        bucket: score >= 0.7 ? 'high' : score >= 0.4 ? 'medium' : 'low',
        drivers: this.drivers(userEvents),
      });
    }
    return signals.sort((a, b) => b.score - a.score);
  }

  private computeScore(events: AnalyticsEvent[]): number {
    if (!events.length) return 0;
    const sorted = events.sort((a, b) => dateMs(a) - dateMs(b));
    const lastEvent = sorted[sorted.length - 1];
    if (!lastEvent) return 0;
    const daysSinceLast = dayjs().diff(dayjs(lastEvent.timestamp), 'day');
    const recencyScore = Math.max(0, 1 - daysSinceLast / this.decayDays);

    const windowStart = dayjs().subtract(this.decayDays, 'day');
    const recentEvents = sorted.filter((event) =>
      dayjs(event.timestamp).isAfter(windowStart)
    );
    const averagePerDay = recentEvents.length / Math.max(this.decayDays, 1);
    const frequencyScore = Math.min(1, averagePerDay * 5);

    const errorEvents = recentEvents.filter(
      (event) =>
        typeof event.properties?.error !== 'undefined' ||
        /error|failed/i.test(event.name)
    ).length;
    const errorScore = Math.min(1, errorEvents / 3);

    const score =
      recencyScore * this.recencyWeight +
      frequencyScore * this.frequencyWeight +
      (1 - errorScore) * this.errorWeight;
    return Number(score.toFixed(3));
  }

  private drivers(events: AnalyticsEvent[]): string[] {
    const drivers: string[] = [];
    const sorted = events.sort((a, b) => dateMs(a) - dateMs(b));
    const lastEvent = sorted[sorted.length - 1];
    if (lastEvent) {
      const days = dayjs().diff(dayjs(lastEvent.timestamp), 'day');
      if (days > this.decayDays) drivers.push(`Inactive for ${days} days`);
    }
    const errorEvents = events.filter(
      (event) =>
        typeof event.properties?.error !== 'undefined' ||
        /error|failed/i.test(event.name)
    );
    if (errorEvents.length) drivers.push(`${errorEvents.length} errors logged`);
    return drivers;
  }
}

function groupBy<T>(
  items: T[],
  selector: (item: T) => string
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = selector(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

function dateMs(event: AnalyticsEvent) {
  return new Date(event.timestamp).getTime();
}
