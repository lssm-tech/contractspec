import type {
  AnalyticsReader,
  DateRangeInput,
} from '@contractspec/lib.contracts-integrations';
import type {
  AnalyticsEvent,
  CohortDefinition,
  FunnelDefinition,
  GrowthMetric,
} from '../types';

export interface PosthogAnalyticsEventSourceOptions {
  limitPerEvent?: number;
  tenantPropertyKey?: string;
  defaultRangeDays?: number;
}

export class PosthogAnalyticsEventSource {
  private readonly reader: AnalyticsReader;
  private readonly limitPerEvent: number;
  private readonly tenantPropertyKey: string;
  private readonly defaultRangeDays: number;

  constructor(
    reader: AnalyticsReader,
    options: PosthogAnalyticsEventSourceOptions = {}
  ) {
    this.reader = reader;
    this.limitPerEvent = options.limitPerEvent ?? 1000;
    this.tenantPropertyKey = options.tenantPropertyKey ?? 'tenantId';
    this.defaultRangeDays = options.defaultRangeDays ?? 30;
  }

  async getEventsForFunnel(
    definition: FunnelDefinition,
    dateRange?: DateRangeInput
  ): Promise<AnalyticsEvent[]> {
    const eventNames = definition.steps.map((step) => step.eventName);
    return this.getEventsByNames(eventNames, dateRange);
  }

  async getEventsForCohort(
    definition: CohortDefinition,
    dateRange?: DateRangeInput,
    eventNames?: string[]
  ): Promise<AnalyticsEvent[]> {
    const events = eventNames && eventNames.length > 0 ? eventNames : ['*'];
    if (events[0] === '*') {
      return this.getEventsByNames([], dateRange, definition.periods * 500);
    }
    return this.getEventsByNames(events, dateRange, definition.periods * 500);
  }

  async getUserActivity(
    userId: string,
    dateRange?: DateRangeInput,
    limit = 1000
  ): Promise<AnalyticsEvent[]> {
    if (!this.reader.getEvents) {
      throw new Error('Analytics reader does not support event queries.');
    }
    const response = await this.reader.getEvents({
      distinctId: userId,
      dateRange,
      limit,
    });
    return response.results.map((event) =>
      toAnalyticsEvent(event, this.tenantPropertyKey)
    );
  }

  async getGrowthMetrics(
    metricNames: string[],
    dateRange?: DateRangeInput
  ): Promise<GrowthMetric[]> {
    const range = resolveRange(dateRange, this.defaultRangeDays);
    const previous = shiftRange(range);
    const results: GrowthMetric[] = [];
    for (const metricName of metricNames) {
      const current = await this.countEvents(metricName, range);
      const previousCount = await this.countEvents(metricName, previous);
      results.push({
        name: metricName,
        current,
        previous: previousCount,
      });
    }
    return results;
  }

  private async getEventsByNames(
    eventNames: string[],
    dateRange?: DateRangeInput,
    limitPerEvent = this.limitPerEvent
  ): Promise<AnalyticsEvent[]> {
    if (!this.reader.getEvents) {
      throw new Error('Analytics reader does not support event queries.');
    }
    if (eventNames.length === 0) {
      const response = await this.reader.getEvents({
        dateRange,
        limit: limitPerEvent,
      });
      return response.results.map((event) =>
        toAnalyticsEvent(event, this.tenantPropertyKey)
      );
    }
    const events: AnalyticsEvent[] = [];
    for (const eventName of eventNames) {
      const response = await this.reader.getEvents({
        event: eventName,
        dateRange,
        limit: limitPerEvent,
      });
      response.results.forEach((event) => {
        events.push(toAnalyticsEvent(event, this.tenantPropertyKey));
      });
    }
    return events;
  }

  private async countEvents(
    eventName: string,
    range: { from: Date; to: Date }
  ): Promise<number> {
    if (!this.reader.queryHogQL) {
      throw new Error('Analytics reader does not support HogQL queries.');
    }
    const result = await this.reader.queryHogQL({
      query: [
        'select',
        '  count() as total',
        'from events',
        'where event = {eventName}',
        'and timestamp >= {dateFrom}',
        'and timestamp < {dateTo}',
      ].join('\n'),
      values: {
        eventName,
        dateFrom: range.from.toISOString(),
        dateTo: range.to.toISOString(),
      },
    });
    return readSingleNumber(result) ?? 0;
  }
}

function toAnalyticsEvent(
  event: {
    event: string;
    distinctId: string;
    properties?: Record<string, unknown>;
    timestamp: string;
  },
  tenantPropertyKey: string
): AnalyticsEvent {
  const tenantIdValue =
    event.properties?.[tenantPropertyKey] ?? event.properties?.tenantId;
  return {
    name: event.event,
    userId: event.distinctId,
    tenantId: typeof tenantIdValue === 'string' ? tenantIdValue : undefined,
    timestamp: event.timestamp,
    properties: event.properties,
  };
}

function resolveRange(
  dateRange: DateRangeInput | undefined,
  defaultDays: number
): { from: Date; to: Date } {
  const to =
    dateRange?.to instanceof Date
      ? dateRange.to
      : dateRange?.to
        ? new Date(dateRange.to)
        : new Date();
  const from =
    dateRange?.from instanceof Date
      ? dateRange.from
      : dateRange?.from
        ? new Date(dateRange.from)
        : new Date(to.getTime() - defaultDays * 24 * 60 * 60 * 1000);
  return { from, to };
}

function shiftRange(range: { from: Date; to: Date }): {
  from: Date;
  to: Date;
} {
  const duration = range.to.getTime() - range.from.getTime();
  return {
    from: new Date(range.from.getTime() - duration),
    to: new Date(range.to.getTime() - duration),
  };
}

function readSingleNumber(result: { results: unknown }): number | undefined {
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
