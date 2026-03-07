import type {
  HealthActivity,
  HealthBiometric,
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
  HealthNutrition,
  HealthProvider,
  HealthSleep,
  HealthSyncRequest,
  HealthSyncResult,
  HealthWebhookEvent,
  HealthWebhookRequest,
  HealthWorkout,
} from '../../health';
import type { HealthTransportStrategy } from '@contractspec/integration.runtime/runtime';
import {
  asRecord,
  extractList,
  extractPagination,
  toHealthConnectionStatus,
  toHealthWebhookEvent,
} from './provider-normalizers';

type UnknownRecord = Record<string, unknown>;

interface OAuthOptions {
  tokenUrl?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  tokenExpiresAt?: string;
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
  webhookSignatureHeader?: string;
  route?: 'primary' | 'fallback';
  aggregatorKey?: string;
  oauth?: OAuthOptions;
  fetchFn?: typeof fetch;
}

interface DatasetFetchConfig<P, T> {
  apiPath?: string;
  mcpTool: string;
  listKeys?: readonly string[];
  method?: 'GET' | 'POST';
  buildQuery?: (params: P) => UnknownRecord;
  buildBody?: (params: P) => UnknownRecord;
  mapItem: (item: UnknownRecord, params: P) => T | undefined;
}

interface ConnectionStatusConfig {
  apiPath?: string;
  mcpTool: string;
}

interface RefreshTokenPayload {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export class HealthProviderCapabilityError extends Error {
  readonly code = 'NOT_SUPPORTED';

  constructor(message: string) {
    super(message);
    this.name = 'HealthProviderCapabilityError';
  }
}

export class BaseHealthProvider implements HealthProvider {
  protected readonly providerKey: string;
  protected readonly transport: HealthTransportStrategy;
  private readonly apiBaseUrl?: string;
  private readonly mcpUrl?: string;
  private readonly apiKey?: string;
  private accessToken?: string;
  private refreshToken?: string;
  private readonly mcpAccessToken?: string;
  private readonly webhookSecret?: string;
  private readonly webhookSignatureHeader: string;
  private readonly route: 'primary' | 'fallback';
  private readonly aggregatorKey?: string;
  private readonly oauth: OAuthOptions;
  private readonly fetchFn: typeof fetch;
  private mcpRequestId = 0;

  constructor(options: BaseHealthProviderOptions) {
    this.providerKey = options.providerKey;
    this.transport = options.transport;
    this.apiBaseUrl = options.apiBaseUrl;
    this.mcpUrl = options.mcpUrl;
    this.apiKey = options.apiKey;
    this.accessToken = options.accessToken;
    this.refreshToken = options.oauth?.refreshToken;
    this.mcpAccessToken = options.mcpAccessToken;
    this.webhookSecret = options.webhookSecret;
    this.webhookSignatureHeader =
      options.webhookSignatureHeader ?? 'x-webhook-signature';
    this.route = options.route ?? 'primary';
    this.aggregatorKey = options.aggregatorKey;
    this.oauth = options.oauth ?? {};
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async listActivities(
    _params: HealthListActivitiesParams
  ): Promise<HealthListActivitiesResult> {
    throw this.unsupported('activities');
  }

  async listWorkouts(
    _params: HealthListWorkoutsParams
  ): Promise<HealthListWorkoutsResult> {
    throw this.unsupported('workouts');
  }

  async listSleep(
    _params: HealthListSleepParams
  ): Promise<HealthListSleepResult> {
    throw this.unsupported('sleep');
  }

  async listBiometrics(
    _params: HealthListBiometricsParams
  ): Promise<HealthListBiometricsResult> {
    throw this.unsupported('biometrics');
  }

  async listNutrition(
    _params: HealthListNutritionParams
  ): Promise<HealthListNutritionResult> {
    throw this.unsupported('nutrition');
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }): Promise<HealthConnectionStatus> {
    return this.fetchConnectionStatus(params, {
      mcpTool: `${this.providerSlug()}_connection_status`,
    });
  }

  async syncActivities(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.syncFromList(() => this.listActivities(params));
  }

  async syncWorkouts(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.syncFromList(() => this.listWorkouts(params));
  }

  async syncSleep(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.syncFromList(() => this.listSleep(params));
  }

  async syncBiometrics(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.syncFromList(() => this.listBiometrics(params));
  }

  async syncNutrition(params: HealthSyncRequest): Promise<HealthSyncResult> {
    return this.syncFromList(() => this.listNutrition(params));
  }

  async parseWebhook(
    request: HealthWebhookRequest
  ): Promise<HealthWebhookEvent> {
    const payload = request.parsedBody ?? safeJsonParse(request.rawBody);
    const verified = await this.verifyWebhook(request);
    return toHealthWebhookEvent(payload, this.providerKey, verified);
  }

  async verifyWebhook(request: HealthWebhookRequest): Promise<boolean> {
    if (!this.webhookSecret) return true;
    const signature = readHeader(request.headers, this.webhookSignatureHeader);
    return signature === this.webhookSecret;
  }

  protected async fetchActivities(
    params: HealthListActivitiesParams,
    config: DatasetFetchConfig<HealthListActivitiesParams, HealthActivity>
  ): Promise<HealthListActivitiesResult> {
    const response = await this.fetchList(params, config);
    return {
      activities: response.items,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
      source: this.currentSource(),
    };
  }

  protected async fetchWorkouts(
    params: HealthListWorkoutsParams,
    config: DatasetFetchConfig<HealthListWorkoutsParams, HealthWorkout>
  ): Promise<HealthListWorkoutsResult> {
    const response = await this.fetchList(params, config);
    return {
      workouts: response.items,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
      source: this.currentSource(),
    };
  }

  protected async fetchSleep(
    params: HealthListSleepParams,
    config: DatasetFetchConfig<HealthListSleepParams, HealthSleep>
  ): Promise<HealthListSleepResult> {
    const response = await this.fetchList(params, config);
    return {
      sleep: response.items,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
      source: this.currentSource(),
    };
  }

  protected async fetchBiometrics(
    params: HealthListBiometricsParams,
    config: DatasetFetchConfig<HealthListBiometricsParams, HealthBiometric>
  ): Promise<HealthListBiometricsResult> {
    const response = await this.fetchList(params, config);
    return {
      biometrics: response.items,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
      source: this.currentSource(),
    };
  }

  protected async fetchNutrition(
    params: HealthListNutritionParams,
    config: DatasetFetchConfig<HealthListNutritionParams, HealthNutrition>
  ): Promise<HealthListNutritionResult> {
    const response = await this.fetchList(params, config);
    return {
      nutrition: response.items,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
      source: this.currentSource(),
    };
  }

  protected async fetchConnectionStatus(
    params: { tenantId: string; connectionId: string },
    config: ConnectionStatusConfig
  ): Promise<HealthConnectionStatus> {
    const payload = await this.fetchPayload(config, params);
    return toHealthConnectionStatus(payload, params, this.currentSource());
  }

  protected currentSource(): HealthDataSource {
    return {
      providerKey: this.providerKey,
      transport: this.transport,
      route: this.route,
      aggregatorKey: this.aggregatorKey,
    };
  }

  protected providerSlug(): string {
    return this.providerKey.replace('health.', '').replace(/-/g, '_');
  }

  protected unsupported(capability: string): HealthProviderCapabilityError {
    return new HealthProviderCapabilityError(
      `${this.providerKey} does not support ${capability}`
    );
  }

  private async syncFromList<T>(
    executor: () => Promise<
      { hasMore?: boolean; source?: HealthDataSource } & T
    >
  ): Promise<HealthSyncResult> {
    const result = await executor();
    const records = countResultRecords(result);
    return {
      synced: records,
      failed: 0,
      nextCursor: undefined,
      source: result.source,
    };
  }

  private async fetchList<P, T>(
    params: P,
    config: DatasetFetchConfig<P, T>
  ): Promise<{ items: T[]; nextCursor?: string; hasMore?: boolean }> {
    const payload = await this.fetchPayload(config, params);
    const items = extractList(payload, config.listKeys)
      .map((item) => config.mapItem(item, params))
      .filter((item): item is T => Boolean(item));
    const pagination = extractPagination(payload);
    return {
      items,
      nextCursor: pagination.nextCursor,
      hasMore: pagination.hasMore,
    };
  }

  private async fetchPayload<P>(
    config: {
      apiPath?: string;
      mcpTool: string;
      method?: 'GET' | 'POST';
      buildQuery?: (params: P) => UnknownRecord;
      buildBody?: (params: P) => UnknownRecord;
    },
    params: P
  ): Promise<unknown> {
    const method = config.method ?? 'GET';
    const query = config.buildQuery?.(params);
    const body = config.buildBody?.(params);

    if (this.isMcpTransport()) {
      return this.callMcpTool(config.mcpTool, {
        ...(query ?? {}),
        ...(body ?? {}),
      });
    }

    if (!config.apiPath || !this.apiBaseUrl) {
      throw new Error(`${this.providerKey} transport is missing an API path.`);
    }

    if (method === 'POST') {
      return this.requestApi(config.apiPath, 'POST', undefined, body);
    }
    return this.requestApi(config.apiPath, 'GET', query, undefined);
  }

  private isMcpTransport(): boolean {
    return this.transport.endsWith('mcp') || this.transport === 'unofficial';
  }

  private async requestApi(
    path: string,
    method: 'GET' | 'POST',
    query?: UnknownRecord,
    body?: UnknownRecord
  ): Promise<unknown> {
    const url = new URL(path, ensureTrailingSlash(this.apiBaseUrl ?? ''));
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value == null) continue;
        if (Array.isArray(value)) {
          value.forEach((entry) => {
            if (entry != null) url.searchParams.append(key, String(entry));
          });
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }

    const response = await this.fetchFn(url, {
      method,
      headers: this.authorizationHeaders(),
      body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
    });

    if (response.status === 401 && (await this.refreshAccessToken())) {
      const retryResponse = await this.fetchFn(url, {
        method,
        headers: this.authorizationHeaders(),
        body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
      });
      return this.readResponsePayload(retryResponse, path);
    }

    return this.readResponsePayload(response, path);
  }

  private async callMcpTool(
    toolName: string,
    args: UnknownRecord
  ): Promise<unknown> {
    if (!this.mcpUrl) {
      throw new Error(`${this.providerKey} MCP URL is not configured.`);
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
          name: toolName,
          arguments: args,
        },
      }),
    });
    const payload = await this.readResponsePayload(response, toolName);
    const rpcEnvelope = asRecord(payload);
    if (!rpcEnvelope) return payload;
    const rpcResult = asRecord(rpcEnvelope.result);
    if (rpcResult) {
      return rpcResult.structuredContent ?? rpcResult.data ?? rpcResult;
    }
    return rpcEnvelope.structuredContent ?? rpcEnvelope.data ?? rpcEnvelope;
  }

  private authorizationHeaders(): Record<string, string> {
    const token = this.accessToken ?? this.apiKey;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.oauth.tokenUrl || !this.refreshToken) {
      return false;
    }

    const tokenUrl = new URL(this.oauth.tokenUrl);
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      ...(this.oauth.clientId ? { client_id: this.oauth.clientId } : {}),
      ...(this.oauth.clientSecret
        ? { client_secret: this.oauth.clientSecret }
        : {}),
    });

    const response = await this.fetchFn(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as RefreshTokenPayload;
    this.accessToken = payload.access_token;
    this.refreshToken = payload.refresh_token ?? this.refreshToken;
    if (typeof payload.expires_in === 'number') {
      this.oauth.tokenExpiresAt = new Date(
        Date.now() + payload.expires_in * 1000
      ).toISOString();
    }
    return Boolean(this.accessToken);
  }

  private async readResponsePayload(
    response: Response,
    context: string
  ): Promise<unknown> {
    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(
        `${this.providerKey} request ${context} failed (${response.status}): ${message}`
      );
    }
    if (response.status === 204) {
      return {};
    }
    return response.json();
  }
}

function readHeader(
  headers: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const target = key.toLowerCase();
  const entry = Object.entries(headers).find(
    ([headerKey]) => headerKey.toLowerCase() === target
  );
  if (!entry) return undefined;
  const value = entry[1];
  return Array.isArray(value) ? value[0] : value;
}

function countResultRecords(result: Record<string, unknown>): number {
  const listKeys = [
    'activities',
    'workouts',
    'sleep',
    'biometrics',
    'nutrition',
  ];
  for (const key of listKeys) {
    const value = result[key];
    if (Array.isArray(value)) {
      return value.length;
    }
  }
  return 0;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return { rawBody: raw };
  }
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return response.statusText;
  }
}
