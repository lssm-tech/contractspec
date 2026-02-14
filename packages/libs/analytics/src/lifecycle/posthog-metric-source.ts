import type {
  AnalyticsQueryResult,
  AnalyticsReader,
} from '@contractspec/lib.contracts-integrations';
import type { LifecycleMetricSource } from './metric-collectors';

export interface PosthogLifecycleMetricSourceOptions {
  activityEvents?: string[];
  retentionWindowDays?: number;
  revenueEvent?: string;
  revenueProperty?: string;
  customerEvent?: string;
  customerProperty?: string;
  teamSizeEvent?: string;
  teamSizeProperty?: string;
  burnMultipleEvent?: string;
  burnMultipleProperty?: string;
}

export class PosthogLifecycleMetricSource implements LifecycleMetricSource {
  private readonly reader: AnalyticsReader;
  private readonly activityEvents?: string[];
  private readonly retentionWindowDays: number;
  private readonly revenueEvent?: string;
  private readonly revenueProperty?: string;
  private readonly customerEvent?: string;
  private readonly customerProperty?: string;
  private readonly teamSizeEvent?: string;
  private readonly teamSizeProperty?: string;
  private readonly burnMultipleEvent?: string;
  private readonly burnMultipleProperty?: string;

  constructor(
    reader: AnalyticsReader,
    options: PosthogLifecycleMetricSourceOptions = {}
  ) {
    this.reader = reader;
    this.activityEvents = options.activityEvents;
    this.retentionWindowDays = options.retentionWindowDays ?? 7;
    this.revenueEvent = options.revenueEvent;
    this.revenueProperty = options.revenueProperty ?? 'amount';
    this.customerEvent = options.customerEvent;
    this.customerProperty = options.customerProperty ?? 'is_customer';
    this.teamSizeEvent = options.teamSizeEvent;
    this.teamSizeProperty = options.teamSizeProperty ?? 'team_size';
    this.burnMultipleEvent = options.burnMultipleEvent;
    this.burnMultipleProperty = options.burnMultipleProperty ?? 'burn_multiple';
  }

  async getActiveUsers(): Promise<number | undefined> {
    return this.countDistinctUsers(1);
  }

  async getWeeklyActiveUsers(): Promise<number | undefined> {
    return this.countDistinctUsers(7);
  }

  async getRetentionRate(): Promise<number | undefined> {
    const windowDays = this.retentionWindowDays;
    const now = new Date();
    const prevEnd = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
    const prevStart = new Date(
      now.getTime() - windowDays * 2 * 24 * 60 * 60 * 1000
    );

    const returningUsers = await this.countReturningUsers(
      prevStart,
      prevEnd,
      now
    );
    const prevUsers = await this.countDistinctUsersBetween(prevStart, prevEnd);
    if (prevUsers === undefined || prevUsers === 0) return undefined;
    return returningUsers / prevUsers;
  }

  async getMonthlyRecurringRevenue(): Promise<number | undefined> {
    if (!this.revenueEvent || !this.revenueProperty) return undefined;
    return this.sumMetric(this.revenueEvent, this.revenueProperty);
  }

  async getCustomerCount(): Promise<number | undefined> {
    if (!this.customerEvent || !this.customerProperty) return undefined;
    return this.countDistinctUsersByProperty(
      this.customerEvent,
      this.customerProperty
    );
  }

  async getTeamSize(): Promise<number | undefined> {
    if (!this.teamSizeEvent || !this.teamSizeProperty) return undefined;
    return this.latestMetric(this.teamSizeEvent, this.teamSizeProperty);
  }

  async getBurnMultiple(): Promise<number | undefined> {
    if (!this.burnMultipleEvent || !this.burnMultipleProperty) return undefined;
    return this.latestMetric(this.burnMultipleEvent, this.burnMultipleProperty);
  }

  private async countDistinctUsers(days: number): Promise<number | undefined> {
    const range = buildDateRange(days);
    return this.countDistinctUsersBetween(range.from, range.to);
  }

  private async countDistinctUsersBetween(
    from: Date,
    to: Date
  ): Promise<number | undefined> {
    const eventFilter = buildEventFilter(this.activityEvents, 'activityEvent');
    const result = await this.queryHogQL({
      query: [
        'select',
        '  countDistinct(distinct_id) as total',
        'from events',
        `where timestamp >= {dateFrom} and timestamp < {dateTo}`,
        eventFilter.clause ? `and ${eventFilter.clause}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      values: {
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        ...eventFilter.values,
      },
    });
    return readSingleNumber(result);
  }

  private async countReturningUsers(
    previousStart: Date,
    previousEnd: Date,
    currentEnd: Date
  ): Promise<number> {
    const eventFilter = buildEventFilter(this.activityEvents, 'activityEvent');
    const result = await this.queryHogQL({
      query: [
        'select',
        '  countDistinct(distinct_id) as total',
        'from events',
        `where timestamp >= {currentFrom} and timestamp < {currentTo}`,
        eventFilter.clause ? `and ${eventFilter.clause}` : '',
        'and distinct_id in (',
        '  select distinct_id from events',
        '  where timestamp >= {previousFrom} and timestamp < {previousTo}',
        eventFilter.clause ? `and ${eventFilter.clause}` : '',
        ')',
      ].join('\n'),
      values: {
        currentFrom: previousEnd.toISOString(),
        currentTo: currentEnd.toISOString(),
        previousFrom: previousStart.toISOString(),
        previousTo: previousEnd.toISOString(),
        ...eventFilter.values,
      },
    });
    return readSingleNumber(result) ?? 0;
  }

  private async sumMetric(
    eventName: string,
    propertyKey: string
  ): Promise<number | undefined> {
    const result = await this.queryHogQL({
      query: [
        'select',
        `  sum(properties.${propertyKey}) as total`,
        'from events',
        'where event = {eventName}',
      ].join('\n'),
      values: { eventName },
    });
    return readSingleNumber(result);
  }

  private async countDistinctUsersByProperty(
    eventName: string,
    propertyKey: string
  ): Promise<number | undefined> {
    const result = await this.queryHogQL({
      query: [
        'select',
        '  countDistinct(distinct_id) as total',
        'from events',
        'where event = {eventName}',
        `and properties.${propertyKey} = {propertyValue}`,
      ].join('\n'),
      values: { eventName, propertyValue: true },
    });
    return readSingleNumber(result);
  }

  private async latestMetric(
    eventName: string,
    propertyKey: string
  ): Promise<number | undefined> {
    const result = await this.queryHogQL({
      query: [
        'select',
        `  properties.${propertyKey} as value`,
        'from events',
        'where event = {eventName}',
        'order by timestamp desc',
        'limit 1',
      ].join('\n'),
      values: { eventName },
    });
    return readSingleNumber(result);
  }

  private async queryHogQL(input: {
    query: string;
    values: Record<string, unknown>;
  }): Promise<AnalyticsQueryResult> {
    if (!this.reader.queryHogQL) {
      throw new Error('Analytics reader does not support HogQL queries.');
    }
    return this.reader.queryHogQL(input);
  }
}

function buildDateRange(days: number): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
}

function buildEventFilter(
  events: string[] | undefined,
  prefix: string
): { clause?: string; values?: Record<string, unknown> } {
  if (!events || events.length === 0) return {};
  if (events.length === 1) {
    return {
      clause: `event = {${prefix}0}`,
      values: { [`${prefix}0`]: events[0] },
    };
  }
  const clauses = events.map((_event, index) => `event = {${prefix}${index}}`);
  const values: Record<string, unknown> = {};
  events.forEach((event, index) => {
    values[`${prefix}${index}`] = event;
  });
  return {
    clause: `(${clauses.join(' or ')})`,
    values,
  };
}

function readSingleNumber(result: AnalyticsQueryResult): number | undefined {
  if (!Array.isArray(result.results) || result.results.length === 0) {
    return undefined;
  }
  const firstRow = result.results[0];
  if (Array.isArray(firstRow) && firstRow.length > 0) {
    const value = firstRow[0];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}
