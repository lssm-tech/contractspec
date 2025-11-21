import dayjs from 'dayjs';
import type { AnalyticsEvent, CohortAnalysis, CohortDefinition, CohortStats } from '../types';

export class CohortTracker {
  analyze(events: AnalyticsEvent[], definition: CohortDefinition): CohortAnalysis {
    const groupedByUser = groupBy(events, (event) => event.userId);
    const cohorts = new Map<string, CohortStatsBuilder>();

    for (const [userId, userEvents] of groupedByUser.entries()) {
      userEvents.sort((a, b) => dateMs(a) - dateMs(b));
      const signup = userEvents[0];
      if (!signup) continue;
      const cohortKey = bucketKey(signup.timestamp, definition.bucket);
      const builder = cohorts.get(cohortKey) ?? new CohortStatsBuilder(cohortKey, definition);
      builder.addUser(userId);
      for (const event of userEvents) {
        builder.addEvent(userId, event);
      }
      cohorts.set(cohortKey, builder);
    }

    return {
      definition,
      cohorts: [...cohorts.values()].map((builder) => builder.build()),
    };
  }
}

class CohortStatsBuilder {
  private readonly users = new Set<string>();
  private readonly retentionMap = new Map<number, Set<string>>();
  private ltv = 0;
  constructor(private readonly key: string, private readonly definition: CohortDefinition) {}

  addUser(userId: string) {
    this.users.add(userId);
  }

  addEvent(userId: string, event: AnalyticsEvent) {
    const period = bucketDiff(this.key, event.timestamp, this.definition.bucket);
    if (period < 0 || period >= this.definition.periods) return;
    const bucket = this.retentionMap.get(period) ?? new Set<string>();
    bucket.add(userId);
    this.retentionMap.set(period, bucket);
    const amount = typeof event.properties?.amount === 'number' ? event.properties.amount : 0;
    this.ltv += amount;
  }

  build(): CohortStats {
    const totalUsers = this.users.size || 1;
    const retention: number[] = [];
    for (let period = 0; period < this.definition.periods; period++) {
      const active = this.retentionMap.get(period)?.size ?? 0;
      retention.push(Number((active / totalUsers).toFixed(3)));
    }
    return {
      cohortKey: this.key,
      users: this.users.size,
      retention,
      ltv: Number(this.ltv.toFixed(2)),
    };
  }
}

function groupBy<T>(items: T[], selector: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = selector(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

function bucketKey(timestamp: string | Date, bucket: CohortDefinition['bucket']): string {
  const dt = dayjs(timestamp);
  switch (bucket) {
    case 'day':
      return dt.startOf('day').format('YYYY-MM-DD');
    case 'week':
      return dt.startOf('week').format('YYYY-[W]WW');
    case 'month':
    default:
      return dt.startOf('month').format('YYYY-MM');
  }
}

function bucketDiff(
  cohortKey: string,
  timestamp: string | Date,
  bucket: CohortDefinition['bucket']
): number {
  const start = parseBucketKey(cohortKey, bucket);
  const target = dayjs(timestamp);
  switch (bucket) {
    case 'day':
      return target.diff(start, 'day');
    case 'week':
      return target.diff(start, 'week');
    case 'month':
    default:
      return target.diff(start, 'month');
  }
}

function parseBucketKey(key: string, bucket: CohortDefinition['bucket']) {
  switch (bucket) {
    case 'day':
      return dayjs(key, 'YYYY-MM-DD');
    case 'week':
      return dayjs(key.replace('W', ''), 'YYYY-ww');
    case 'month':
    default:
      return dayjs(key, 'YYYY-MM');
  }
}

function dateMs(event: AnalyticsEvent) {
  return new Date(event.timestamp).getTime();
}
