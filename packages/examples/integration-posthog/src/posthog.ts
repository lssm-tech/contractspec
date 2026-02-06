import { PosthogAnalyticsProvider } from '@contractspec/integration.providers-impls/impls/posthog';
import type {
  AnalyticsEventInput,
  AnalyticsProvider,
  AnalyticsQueryResult,
  AnalyticsRequest,
  AnalyticsResponse,
} from '@contractspec/integration.providers-impls/analytics';

export type PosthogExampleMode = 'capture' | 'query' | 'request' | 'all';

export interface PosthogExampleOutput {
  mode: PosthogExampleMode;
  dryRun: boolean;
  allowWrites: boolean;
  capture?: unknown;
  query?: AnalyticsQueryResult | unknown;
  request?: Record<string, unknown>;
  mcp?: unknown;
}

export async function runPosthogExampleFromEnv(): Promise<PosthogExampleOutput> {
  const mode = resolvePosthogMode();
  const dryRun = resolveBooleanEnv('CONTRACTSPEC_POSTHOG_DRY_RUN', true);
  const allowWrites = resolveBooleanEnv(
    'CONTRACTSPEC_POSTHOG_ALLOW_WRITES',
    false
  );
  const output: PosthogExampleOutput = { mode, dryRun, allowWrites };

  if (dryRun) {
    if (mode === 'capture' || mode === 'all') {
      output.capture = buildCapturePreview();
    }
    if (mode === 'query' || mode === 'all') {
      output.query = { query: buildHogQLQuery() };
    }
    if (mode === 'request' || mode === 'all') {
      output.request = buildRequestPreview();
    }
    if (process.env.POSTHOG_MCP_URL) {
      output.mcp = buildMcpPreview();
    }
    return output;
  }

  const provider = createProviderFromEnv();

  if (mode === 'capture' || mode === 'all') {
    output.capture = await runCapture(provider, allowWrites);
  }

  if (mode === 'query' || mode === 'all') {
    output.query = await runHogQLQuery(provider);
  }

  if (mode === 'request' || mode === 'all') {
    output.request = await runApiRequests(provider, allowWrites);
  }

  if (process.env.POSTHOG_MCP_URL) {
    output.mcp = await runMcpToolCall(provider);
  }

  return output;
}

export function resolvePosthogMode(): PosthogExampleMode {
  const raw = (process.env.CONTRACTSPEC_POSTHOG_MODE ?? 'all').toLowerCase();
  if (
    raw === 'capture' ||
    raw === 'query' ||
    raw === 'request' ||
    raw === 'all'
  ) {
    return raw;
  }
  throw new Error(
    `Unsupported CONTRACTSPEC_POSTHOG_MODE: ${raw}. Use capture, query, request, or all.`
  );
}

function createProviderFromEnv(): AnalyticsProvider {
  return new PosthogAnalyticsProvider({
    host: process.env.POSTHOG_HOST,
    projectId: process.env.POSTHOG_PROJECT_ID,
    projectApiKey: process.env.POSTHOG_PROJECT_API_KEY,
    personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
    mcpUrl: process.env.POSTHOG_MCP_URL,
    requestTimeoutMs: 10000,
  });
}

async function runCapture(
  provider: AnalyticsProvider,
  allowWrites: boolean
): Promise<Record<string, unknown>> {
  if (!allowWrites) {
    return {
      skipped: true,
      reason: 'Set CONTRACTSPEC_POSTHOG_ALLOW_WRITES=true to enable capture.',
    };
  }

  const event = buildCaptureEvent();
  if (provider.identify) {
    await provider.identify({
      distinctId: event.distinctId,
      properties: { plan: 'pro', source: 'contractspec-example' },
    });
  }
  await provider.capture(event);
  return { captured: true, event };
}

async function runHogQLQuery(
  provider: AnalyticsProvider
): Promise<AnalyticsQueryResult> {
  if (!provider.queryHogQL) {
    throw new Error('Analytics provider does not support HogQL queries.');
  }
  const query = buildHogQLQuery();
  return provider.queryHogQL({ query });
}

async function runApiRequests(
  provider: AnalyticsProvider,
  allowWrites: boolean
): Promise<Record<string, unknown>> {
  const projectId = requireEnv('POSTHOG_PROJECT_ID');
  const listRequest: AnalyticsRequest = {
    method: 'GET',
    path: `/api/projects/${projectId}/feature_flags/`,
    query: { limit: 5 },
  };
  const listResponse = await provider.request(listRequest);
  const output: Record<string, unknown> = {
    list: listResponse.data,
  };

  if (!allowWrites) {
    output.writeGuard =
      'Set CONTRACTSPEC_POSTHOG_ALLOW_WRITES=true to create/delete feature flags.';
    return output;
  }

  const flagKey = `contractspec-example-${Date.now()}`;
  const createResponse = await provider.request({
    method: 'POST',
    path: `/api/projects/${projectId}/feature_flags/`,
    body: {
      name: 'ContractSpec Example Flag',
      key: flagKey,
      active: true,
      filters: {
        groups: [
          {
            properties: [],
            rollout_percentage: 100,
          },
        ],
      },
    },
  });
  output.created = createResponse.data;

  const createdId = extractId(createResponse);
  if (createdId) {
    const deleteResponse = await provider.request({
      method: 'DELETE',
      path: `/api/projects/${projectId}/feature_flags/${createdId}`,
    });
    output.deleted = deleteResponse.status;
  } else {
    output.deleted = 'Skipped delete: response did not include an id.';
  }

  return output;
}

async function runMcpToolCall(provider: AnalyticsProvider): Promise<unknown> {
  if (!provider.callMcpTool) {
    throw new Error('Analytics provider does not support MCP tool calls.');
  }
  const name = process.env.POSTHOG_MCP_TOOL_NAME ?? 'posthog.query';
  const argumentsValue = parseOptionalJsonEnv('POSTHOG_MCP_TOOL_ARGS', {
    query: buildHogQLQuery(),
  });
  return provider.callMcpTool({ name, arguments: argumentsValue });
}

function buildCaptureEvent(): AnalyticsEventInput {
  const distinctId = process.env.POSTHOG_DISTINCT_ID ?? 'contractspec-demo';
  const event = process.env.POSTHOG_EVENT_NAME ?? 'contractspec.example.event';
  return {
    distinctId,
    event,
    properties: {
      source: 'contractspec-example',
      environment: process.env.NODE_ENV ?? 'development',
    },
    timestamp: new Date(),
  };
}

function buildHogQLQuery(): string {
  return (
    'select event, count() as count ' +
    'from events ' +
    'where timestamp >= now() - interval 1 day ' +
    'group by event ' +
    'order by count desc ' +
    'limit 5'
  );
}

function buildCapturePreview(): Record<string, unknown> {
  return {
    event: buildCaptureEvent(),
    hint: 'Dry run enabled. Set CONTRACTSPEC_POSTHOG_DRY_RUN=false.',
  };
}

function buildRequestPreview(): Record<string, unknown> {
  const projectId = process.env.POSTHOG_PROJECT_ID ?? 'PROJECT_ID';
  return {
    listRequest: {
      method: 'GET',
      path: `/api/projects/${projectId}/feature_flags/`,
      query: { limit: 5 },
    },
    writeRequests: {
      create: {
        method: 'POST',
        path: `/api/projects/${projectId}/feature_flags/`,
      },
      delete: {
        method: 'DELETE',
        path: `/api/projects/${projectId}/feature_flags/{id}`,
      },
    },
  };
}

function buildMcpPreview(): Record<string, unknown> {
  return {
    url: process.env.POSTHOG_MCP_URL,
    toolName: process.env.POSTHOG_MCP_TOOL_NAME ?? 'posthog.query',
    arguments: parseOptionalJsonEnv('POSTHOG_MCP_TOOL_ARGS', {
      query: buildHogQLQuery(),
    }),
  };
}

function extractId(
  response: AnalyticsResponse<unknown>
): string | number | null {
  if (!response || typeof response !== 'object') return null;
  const data = response.data as { id?: string | number } | null | undefined;
  if (data && (typeof data.id === 'string' || typeof data.id === 'number')) {
    return data.id;
  }
  return null;
}

function resolveBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function parseOptionalJsonEnv(
  key: string,
  fallback: Record<string, unknown>
): Record<string, unknown> {
  const raw = process.env[key];
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    throw new Error(`Invalid JSON in ${key}`);
  }
  return fallback;
}
