import type {
  HealthActivity,
  HealthConnectionStatus,
  HealthDataSource,
  HealthListActivitiesParams,
  HealthListActivitiesResult,
  HealthListBiometricsParams,
  HealthListBiometricsResult,
  HealthListNutritionParams,
  HealthListNutritionResult,
  HealthListSleepParams,
  HealthListSleepResult,
  HealthListWorkoutsParams,
  HealthListWorkoutsResult,
  HealthProvider,
  HealthSyncRequest,
  HealthSyncResult,
  HealthWebhookEvent,
  HealthWebhookRequest,
  HealthBiometric,
  HealthNutrition,
  HealthSleep,
  HealthWorkout,
} from '../../health';
import type { HealthTransportStrategy } from '@contractspec/integration.runtime/runtime';

interface BaseHealthListResponse {
  items: unknown[];
  nextCursor?: string;
  hasMore?: boolean;
}

export interface BaseHealthProviderOptions {
  providerKey: string;
  transport: HealthTransportStrategy;
  apiBaseUrl?: string;
  mcpUrl?: string;
  apiKey?: string;
  accessToken?: string;
  mcpAccessToken?: string;
  webhookSecret?: string;
  fetchFn?: typeof fetch;
}

export class BaseHealthProvider implements HealthProvider {
  private readonly providerKey: string;
  private readonly transport: HealthTransportStrategy;
  private readonly apiBaseUrl: string;
  private readonly mcpUrl?: string;
  private readonly apiKey?: string;
  private readonly accessToken?: string;
  private readonly mcpAccessToken?: string;
  private readonly webhookSecret?: string;
  private readonly fetchFn: typeof fetch;
  private mcpRequestId = 0;

  constructor(options: BaseHealthProviderOptions) {
    this.providerKey = options.providerKey;
    this.transport = options.transport;
    this.apiBaseUrl = options.apiBaseUrl ?? 'https://api.example-health.local';
    this.mcpUrl = options.mcpUrl;
    this.apiKey = options.apiKey;
    this.accessToken = options.accessToken;
    this.mcpAccessToken = options.mcpAccessToken;
    this.webhookSecret = options.webhookSecret;
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async listActivities(
    params: HealthListActivitiesParams
  ): Promise<HealthListActivitiesResult> {
    const result = await this.fetchList('activities', params);
    return {
      activities: result.items as HealthActivity[],
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      source: this.currentSource(),
    };
  }

  async listWorkouts(
    params: HealthListWorkoutsParams
  ): Promise<HealthListWorkoutsResult> {
    const result = await this.fetchList('workouts', params);
    return {
      workouts: result.items as HealthWorkout[],
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      source: this.currentSource(),
    };
  }

  async listSleep(
    params: HealthListSleepParams
  ): Promise<HealthListSleepResult> {
    const result = await this.fetchList('sleep', params);
    return {
      sleep: result.items as HealthSleep[],
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      source: this.currentSource(),
    };
  }

  async listBiometrics(
    params: HealthListBiometricsParams
  ): Promise<HealthListBiometricsResult> {
    const result = await this.fetchList('biometrics', params);
    return {
      biometrics: result.items as HealthBiometric[],
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      source: this.currentSource(),
    };
  }

  async listNutrition(
    params: HealthListNutritionParams
  ): Promise<HealthListNutritionResult> {
    const result = await this.fetchList('nutrition', params);
    return {
      nutrition: result.items as HealthNutrition[],
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      source: this.currentSource(),
    };
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }): Promise<HealthConnectionStatus> {
    const payload = await this.fetchRecord('connection/status', params);
    const status = readString(payload, 'status') ?? 'healthy';
    return {
      tenantId: params.tenantId,
      connectionId: params.connectionId,
      status:
        status === 'healthy' ||
        status === 'degraded' ||
        status === 'error' ||
        status === 'disconnected'
          ? status
          : 'healthy',
      source: this.currentSource(),
      lastCheckedAt:
        readString(payload, 'lastCheckedAt') ?? new Date().toISOString(),
      errorCode: readString(payload, 'errorCode'),
      errorMessage: readString(payload, 'errorMessage'),
      metadata: asRecord(payload.metadata),
    };
  }

  async syncActivities(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.sync('activities', params);
  }

  async syncWorkouts(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.sync('workouts', params);
  }

  async syncSleep(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.sync('sleep', params);
  }

  async syncBiometrics(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.sync('biometrics', params);
  }

  async syncNutrition(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.sync('nutrition', params);
  }

  async parseWebhook(
    request: HealthWebhookRequest
  ): Promise<HealthWebhookEvent> {
    const payload = request.parsedBody ?? safeJsonParse(request.rawBody);
    const body = asRecord(payload);
    return {
      providerKey: this.providerKey,
      eventType: readString(body, 'eventType') ?? readString(body, 'event'),
      externalEntityId:
        readString(body, 'externalEntityId') ?? readString(body, 'entityId'),
      entityType: normalizeEntityType(
        readString(body, 'entityType') ?? readString(body, 'type')
      ),
      receivedAt: new Date().toISOString(),
      verified: await this.verifyWebhook(request),
      payload,
    };
  }

  async verifyWebhook(request: HealthWebhookRequest): Promise<boolean> {
    if (!this.webhookSecret) {
      return true;
    }
    const signature = readHeader(request.headers, 'x-webhook-signature');
    return signature === this.webhookSecret;
  }

  private async fetchList(
    resource: string,
    params: object
  ): Promise<BaseHealthListResponse> {
    const payload = await this.fetchRecord(resource, params);
    const items =
      asArray(payload.items) ??
      asArray(payload[resource]) ??
      asArray(payload.records) ??
      [];
    return {
      items,
      nextCursor:
        readString(payload, 'nextCursor') ?? readString(payload, 'cursor'),
      hasMore: readBoolean(payload, 'hasMore'),
    };
  }

  private async sync(
    resource: string,
    params: HealthSyncRequest
  ): Promise<HealthSyncResult> {
    const payload = await this.fetchRecord(`sync/${resource}`, params, 'POST');
    return {
      synced: readNumber(payload, 'synced') ?? 0,
      failed: readNumber(payload, 'failed') ?? 0,
      nextCursor: readString(payload, 'nextCursor'),
      errors: asArray(payload.errors)?.map((item) => String(item)),
      source: this.currentSource(),
    };
  }

  private async fetchRecord(
    resource: string,
    params: object,
    method: 'GET' | 'POST' = 'GET'
  ): Promise<Record<string, unknown>> {
    if (this.transport.endsWith('mcp')) {
      return this.callMcpTool(resource, params);
    }

    const url = new URL(`${this.apiBaseUrl.replace(/\/$/, '')}/${resource}`);
    if (method === 'GET') {
      for (const [key, value] of Object.entries(
        params as Record<string, unknown>
      )) {
        if (value == null) continue;
        if (Array.isArray(value)) {
          value.forEach((item) => {
            url.searchParams.append(key, String(item));
          });
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }

    const response = await this.fetchFn(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken || this.apiKey
          ? { Authorization: `Bearer ${this.accessToken ?? this.apiKey}` }
          : {}),
      },
      body: method === 'POST' ? JSON.stringify(params) : undefined,
    });
    if (!response.ok) {
      const errorBody = await safeResponseText(response);
      throw new Error(
        `${this.providerKey} ${resource} failed (${response.status}): ${errorBody}`
      );
    }
    const data = (await response.json()) as unknown;
    return asRecord(data) ?? {};
  }

  private async callMcpTool(
    resource: string,
    params: object
  ): Promise<Record<string, unknown>> {
    if (!this.mcpUrl) {
      return {};
    }
    const response = await this.fetchFn(this.mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.mcpAccessToken
          ? { Authorization: `Bearer ${this.mcpAccessToken}` }
          : {}),
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: ++this.mcpRequestId,
        method: 'tools/call',
        params: {
          name: `${this.providerKey.replace('health.', '')}_${resource.replace(/\//g, '_')}`,
          arguments: params,
        },
      }),
    });
    if (!response.ok) {
      const errorBody = await safeResponseText(response);
      throw new Error(
        `${this.providerKey} MCP ${resource} failed (${response.status}): ${errorBody}`
      );
    }
    const rpcPayload = (await response.json()) as unknown;
    const rpc = asRecord(rpcPayload);
    const result = asRecord(rpc?.result) ?? {};
    const structured = asRecord(result.structuredContent);
    if (structured) return structured;
    const data = asRecord(result.data);
    if (data) return data;
    return result;
  }

  protected currentSource(): HealthDataSource {
    return {
      providerKey: this.providerKey,
      transport: this.transport,
      route: 'primary',
    };
  }
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return { rawBody: raw };
  }
}

function readHeader(
  headers: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const match = Object.entries(headers).find(
    ([headerKey]) => headerKey.toLowerCase() === key.toLowerCase()
  );
  if (!match) return undefined;
  const value = match[1];
  return Array.isArray(value) ? value[0] : value;
}

function normalizeEntityType(
  value?: string
): 'activity' | 'workout' | 'sleep' | 'biometric' | 'nutrition' | undefined {
  if (!value) return undefined;
  if (
    value === 'activity' ||
    value === 'workout' ||
    value === 'sleep' ||
    value === 'biometric' ||
    value === 'nutrition'
  ) {
    return value;
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function readString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];
  return typeof value === 'string' ? value : undefined;
}

function readBoolean(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];
  return typeof value === 'boolean' ? value : undefined;
}

function readNumber(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

async function safeResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return response.statusText;
  }
}
