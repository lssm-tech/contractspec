import type {
  AnalyticsReader,
  AnalyticsQueryResult,
  DateRangeInput,
} from '@contractspec/lib.contracts-integrations';
import type { EvidenceChunk } from '@contractspec/lib.contracts-spec/product-intent/types';
import { FunnelAnalyzer } from '@contractspec/lib.analytics/funnel';
import type {
  AnalyticsEvent,
  FunnelDefinition,
} from '@contractspec/lib.analytics';
import { PosthogAnalyticsProvider } from '@contractspec/integration.providers-impls/impls/posthog';

export interface PosthogEvidenceOptions {
  reader: AnalyticsReader;
  dateRange?: DateRangeInput;
  eventNames?: string[];
  limit?: number;
  funnel?: FunnelDefinition;
  includeFeatureFlags?: boolean;
}

export interface PosthogEvidenceEnvOptions {
  defaultLookbackDays?: number;
  defaultLimit?: number;
}

export async function loadPosthogEvidenceChunks(
  options: PosthogEvidenceOptions
): Promise<EvidenceChunk[]> {
  const chunks: EvidenceChunk[] = [];
  const range = resolveRange(options.dateRange);

  const eventSummary = await loadEventSummary(options, range);
  if (eventSummary) {
    chunks.push(eventSummary);
  }

  const funnelEvidence = await loadFunnelEvidence(options, range);
  if (funnelEvidence) {
    chunks.push(funnelEvidence);
  }

  const featureFlags = await loadFeatureFlagEvidence(options);
  if (featureFlags) {
    chunks.push(featureFlags);
  }

  return chunks;
}

async function loadEventSummary(
  options: PosthogEvidenceOptions,
  range: { from: Date; to: Date }
): Promise<EvidenceChunk | null> {
  if (!options.reader.queryHogQL) return null;
  const eventFilter = buildEventFilter(options.eventNames);
  const limit = options.limit ?? 10;
  const result = await options.reader.queryHogQL({
    query: [
      'select',
      '  event as eventName,',
      '  count() as total',
      'from events',
      'where timestamp >= {dateFrom} and timestamp < {dateTo}',
      eventFilter.clause ? `and ${eventFilter.clause}` : '',
      'group by eventName',
      'order by total desc',
      `limit ${limit}`,
    ]
      .filter(Boolean)
      .join('\n'),
    values: {
      dateFrom: range.from.toISOString(),
      dateTo: range.to.toISOString(),
      ...eventFilter.values,
    },
  });
  const rows = mapRows(result);
  if (rows.length === 0) return null;
  const lines = rows.map((row) => {
    const name = asString(row.eventName) ?? 'unknown';
    const total = asNumber(row.total);
    return `- ${name}: ${total}`;
  });
  return {
    chunkId: `posthog:event_summary:${range.from.toISOString()}`,
    text: [
      `PostHog event summary (${range.from.toISOString()} → ${range.to.toISOString()}):`,
      ...lines,
    ].join('\n'),
    meta: {
      source: 'posthog',
      kind: 'event_summary',
      dateFrom: range.from.toISOString(),
      dateTo: range.to.toISOString(),
    },
  };
}

async function loadFunnelEvidence(
  options: PosthogEvidenceOptions,
  range: { from: Date; to: Date }
): Promise<EvidenceChunk | null> {
  if (!options.funnel) return null;
  if (!options.reader.getEvents) return null;
  const events: AnalyticsEvent[] = [];
  const eventNames = options.funnel.steps.map((step) => step.eventName);
  for (const eventName of eventNames) {
    const response = await options.reader.getEvents({
      event: eventName,
      dateRange: {
        from: range.from,
        to: range.to,
      },
      limit: options.limit ?? 500,
    });
    response.results.forEach((event) => {
      events.push({
        name: event.event,
        userId: event.distinctId,
        tenantId:
          typeof event.properties?.tenantId === 'string'
            ? event.properties.tenantId
            : undefined,
        timestamp: event.timestamp,
        properties: event.properties,
      });
    });
  }
  if (events.length === 0) return null;
  const analyzer = new FunnelAnalyzer();
  const analysis = analyzer.analyze(events, options.funnel);
  const lines = analysis.steps.map((step) => {
    return `- ${step.step.eventName}: ${step.count} (conversion ${step.conversionRate}, drop-off ${step.dropOffRate})`;
  });
  return {
    chunkId: `posthog:funnel:${options.funnel.name}`,
    text: [`PostHog funnel analysis — ${options.funnel.name}:`, ...lines].join(
      '\n'
    ),
    meta: {
      source: 'posthog',
      kind: 'funnel',
      funnelName: options.funnel.name,
      dateFrom: range.from.toISOString(),
      dateTo: range.to.toISOString(),
    },
  };
}

async function loadFeatureFlagEvidence(
  options: PosthogEvidenceOptions
): Promise<EvidenceChunk | null> {
  if (!options.includeFeatureFlags) return null;
  if (!options.reader.getFeatureFlags) return null;
  const response = await options.reader.getFeatureFlags({ limit: 10 });
  if (!response.results.length) return null;
  const lines = response.results.map((flag) => {
    const key = flag.key ?? 'unknown';
    const active = flag.active ? 'active' : 'inactive';
    return `- ${key}: ${active}`;
  });
  return {
    chunkId: 'posthog:feature_flags',
    text: ['PostHog feature flags:', ...lines].join('\n'),
    meta: {
      source: 'posthog',
      kind: 'feature_flags',
    },
  };
}

function resolveRange(dateRange: DateRangeInput | undefined): {
  from: Date;
  to: Date;
} {
  const now = new Date();
  const from =
    dateRange?.from instanceof Date
      ? dateRange.from
      : dateRange?.from
        ? new Date(dateRange.from)
        : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const to =
    dateRange?.to instanceof Date
      ? dateRange.to
      : dateRange?.to
        ? new Date(dateRange.to)
        : now;
  return { from, to };
}

function buildEventFilter(eventNames?: string[]): {
  clause?: string;
  values?: Record<string, unknown>;
} {
  if (!eventNames || eventNames.length === 0) return {};
  if (eventNames.length === 1) {
    return {
      clause: 'event = {event0}',
      values: { event0: eventNames[0] },
    };
  }
  const values: Record<string, unknown> = {};
  const clauses = eventNames.map((eventName, index) => {
    values[`event${index}`] = eventName;
    return `event = {event${index}}`;
  });
  return {
    clause: `(${clauses.join(' or ')})`,
    values,
  };
}

function mapRows(result: AnalyticsQueryResult): Record<string, unknown>[] {
  if (!Array.isArray(result.results) || !Array.isArray(result.columns)) {
    return [];
  }
  const columns = result.columns;
  return result.results.flatMap((row) => {
    if (!Array.isArray(row)) return [];
    const record: Record<string, unknown> = {};
    columns.forEach((column, index) => {
      record[column] = row[index];
    });
    return [record];
  });
}

function asString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function resolvePosthogEvidenceOptionsFromEnv(
  options: PosthogEvidenceEnvOptions = {}
): PosthogEvidenceOptions | null {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!projectId || !personalApiKey) return null;

  const lookbackDays = resolveNumberEnv(
    'POSTHOG_EVIDENCE_LOOKBACK_DAYS',
    options.defaultLookbackDays ?? 30
  );
  const limit = resolveNumberEnv(
    'POSTHOG_EVIDENCE_LIMIT',
    options.defaultLimit ?? 10
  );

  const now = new Date();
  const from = new Date(now.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
  const eventNames = resolveCsvEnv('POSTHOG_EVIDENCE_EVENTS');
  const funnelSteps = resolveCsvEnv('POSTHOG_EVIDENCE_FUNNEL_STEPS');
  const funnel =
    funnelSteps && funnelSteps.length
      ? {
          name: 'posthog-evidence-funnel',
          steps: funnelSteps.map((eventName, index) => ({
            id: `step_${index + 1}`,
            eventName,
          })),
        }
      : undefined;

  const reader = new PosthogAnalyticsProvider({
    host: process.env.POSTHOG_HOST,
    projectId,
    personalApiKey,
  });

  return {
    reader,
    dateRange: { from, to: now },
    eventNames,
    limit,
    funnel,
    includeFeatureFlags: resolveBooleanEnv(
      'POSTHOG_EVIDENCE_FEATURE_FLAGS',
      true
    ),
  };
}

function resolveCsvEnv(key: string): string[] | undefined {
  const value = process.env[key];
  if (!value) return undefined;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveNumberEnv(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveBooleanEnv(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}
