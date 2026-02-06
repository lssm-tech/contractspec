import { PostHog } from 'posthog-node';
import type {
  AnalyticsEventInput,
  AnalyticsIdentifyInput,
  AnalyticsMcpToolCall,
  AnalyticsProvider,
  AnalyticsQueryInput,
  AnalyticsQueryResult,
  AnalyticsRequest,
  AnalyticsResponse,
} from '../analytics';

export interface PosthogAnalyticsProviderOptions {
  host?: string;
  projectId?: string | number;
  projectApiKey?: string;
  personalApiKey?: string;
  mcpUrl?: string;
  requestTimeoutMs?: number;
  fetch?: typeof fetch;
  client?: PostHog;
}

const DEFAULT_POSTHOG_HOST = 'https://app.posthog.com';

export class PosthogAnalyticsProvider implements AnalyticsProvider {
  private readonly host: string;
  private readonly projectId?: string | number;
  private readonly projectApiKey?: string;
  private readonly personalApiKey?: string;
  private readonly mcpUrl?: string;
  private readonly fetchFn: typeof fetch;
  private readonly client?: PostHog;

  constructor(options: PosthogAnalyticsProviderOptions) {
    this.host = normalizeHost(options.host ?? DEFAULT_POSTHOG_HOST);
    this.projectId = options.projectId;
    this.projectApiKey = options.projectApiKey;
    this.personalApiKey = options.personalApiKey;
    this.mcpUrl = options.mcpUrl;
    this.fetchFn = options.fetch ?? fetch;
    this.client =
      options.client ??
      (options.projectApiKey
        ? new PostHog(options.projectApiKey, {
            host: this.host,
            requestTimeout: options.requestTimeoutMs ?? 10000,
          })
        : undefined);
  }

  async capture(event: AnalyticsEventInput): Promise<void> {
    if (!this.client) {
      throw new Error('PostHog projectApiKey is required for capture.');
    }
    await this.client.capture({
      distinctId: event.distinctId,
      event: event.event,
      properties: event.properties,
      timestamp: event.timestamp,
      groups: event.groups,
    });
  }

  async identify(input: AnalyticsIdentifyInput): Promise<void> {
    if (!this.client) {
      throw new Error('PostHog projectApiKey is required for identify.');
    }
    await this.client.identify({
      distinctId: input.distinctId,
      properties: {
        ...(input.properties ? { $set: input.properties } : {}),
        ...(input.setOnce ? { $set_once: input.setOnce } : {}),
      },
    });
  }

  async queryHogQL(input: AnalyticsQueryInput): Promise<AnalyticsQueryResult> {
    if (!this.projectId) {
      throw new Error('PostHog projectId is required for HogQL queries.');
    }
    const response = await this.request<AnalyticsQueryResult>({
      method: 'POST',
      path: `/api/projects/${this.projectId}/query`,
      body: {
        query: {
          kind: 'HogQLQuery',
          query: input.query,
          values: input.values,
        },
      },
    });
    return response.data;
  }

  async request<T = unknown>(
    request: AnalyticsRequest
  ): Promise<AnalyticsResponse<T>> {
    if (!this.personalApiKey) {
      throw new Error('PostHog personalApiKey is required for API requests.');
    }
    const url = buildUrl(this.host, request.path, request.query);
    const response = await this.fetchFn(url, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${this.personalApiKey}`,
        'Content-Type': 'application/json',
        ...(request.headers ?? {}),
      },
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    const text = await response.text();
    const data = parseJson<T>(text);
    return {
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  async callMcpTool(call: AnalyticsMcpToolCall): Promise<unknown> {
    if (!this.mcpUrl) {
      throw new Error('PostHog MCP URL is not configured.');
    }
    const response = await this.fetchFn(this.mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: call.name,
          arguments: call.arguments ?? {},
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`PostHog MCP error (${response.status}): ${body}`);
    }
    const result = (await response.json()) as {
      error?: { message?: string };
      result?: unknown;
    };
    if (result.error) {
      throw new Error(result.error.message ?? 'PostHog MCP error');
    }
    return result.result ?? null;
  }
}

function normalizeHost(host: string): string {
  return host.replace(/\/$/, '');
}

function buildUrl(
  host: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  if (/^https?:\/\//.test(path)) {
    return appendQuery(path, query);
  }
  const normalizedPath = path.replace(/^\/+/, '');
  return appendQuery(`${host}/${normalizedPath}`, query);
}

function appendQuery(
  url: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    params.set(key, String(value));
  });
  const suffix = params.toString();
  return suffix ? `${url}?${suffix}` : url;
}

function parseJson<T>(value: string): T {
  if (!value) return {} as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}
