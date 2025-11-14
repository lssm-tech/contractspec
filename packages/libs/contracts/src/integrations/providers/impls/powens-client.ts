import { URL } from 'node:url';

export type PowensEnvironment = 'sandbox' | 'production';

const POWENS_BASE_URL: Record<PowensEnvironment, string> = {
  sandbox: 'https://api-sandbox.powens.com/v2',
  production: 'https://api.powens.com/v2',
};

export interface PowensClientOptions {
  clientId: string;
  clientSecret: string;
  apiKey?: string;
  environment: PowensEnvironment;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  defaultTimeoutMs?: number;
  logger?: {
    debug?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
}

interface PowensOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type: string;
}

interface PowensOAuthToken {
  accessToken: string;
  expiresAt: number;
  scope?: string;
}

export interface PowensAccount {
  uuid: string;
  reference: string;
  userUuid: string;
  institution: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  name: string;
  iban?: string;
  bic?: string;
  currency?: string;
  balance?: number;
  availableBalance?: number;
  type?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface PowensAccountListResponse {
  accounts: PowensAccount[];
  pagination?: {
    nextCursor?: string;
    hasMore?: boolean;
  };
}

export interface PowensTransaction {
  uuid: string;
  accountUuid: string;
  amount: number;
  currency: string;
  direction: 'credit' | 'debit';
  description?: string;
  category?: string;
  rawLabel?: string;
  bookingDate?: string;
  valueDate?: string;
  status?: string;
  merchantName?: string;
  merchantCategoryCode?: string;
  counterpartyName?: string;
  counterpartyAccount?: string;
  metadata?: Record<string, unknown>;
}

export interface PowensTransactionListResponse {
  transactions: PowensTransaction[];
  pagination?: {
    nextCursor?: string;
    hasMore?: boolean;
  };
}

export interface PowensBalance {
  accountUuid: string;
  type: string;
  amount: number;
  currency: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PowensConnectionStatusResponse {
  connectionUuid: string;
  status: 'healthy' | 'error' | 'revoked' | 'pending';
  lastAttemptAt?: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export class PowensClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly response?: unknown;

  constructor(message: string, status: number, code?: string, requestId?: string, response?: unknown) {
    super(message);
    this.name = 'PowensClientError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.response = response;
  }
}

interface RequestOptions {
  method: string;
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  body?: Record<string, unknown> | undefined;
  headers?: Record<string, string | undefined>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export class PowensClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly apiKey?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly logger?: PowensClientOptions['logger'];
  private readonly defaultTimeoutMs: number;
  private token?: PowensOAuthToken;
  private readonly baseUrl: string;

  constructor(options: PowensClientOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.apiKey = options.apiKey;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.logger = options.logger;
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? 15000;
    this.baseUrl =
      options.baseUrl ??
      POWENS_BASE_URL[options.environment] ??
      POWENS_BASE_URL.production;
  }

  async listAccounts(params: {
    userUuid: string;
    cursor?: string;
    limit?: number;
    includeBalances?: boolean;
    institutionUuid?: string;
  }): Promise<PowensAccountListResponse> {
    const searchParams: Record<string, string | number | boolean | undefined> = {
      cursor: params.cursor,
      limit: params.limit,
      include_balances: params.includeBalances,
      institution_uuid: params.institutionUuid,
    };
    const response = await this.request<PowensAccountListResponse>({
      method: 'GET',
      path: `/users/${encodeURIComponent(params.userUuid)}/accounts`,
      searchParams,
    });
    return response;
  }

  async getAccount(accountUuid: string): Promise<PowensAccount> {
    return this.request<PowensAccount>({
      method: 'GET',
      path: `/accounts/${encodeURIComponent(accountUuid)}`,
    });
  }

  async listTransactions(params: {
    accountUuid: string;
    cursor?: string;
    limit?: number;
    from?: string;
    to?: string;
    includePending?: boolean;
  }): Promise<PowensTransactionListResponse> {
    const searchParams: Record<string, string | number | boolean | undefined> = {
      cursor: params.cursor,
      limit: params.limit,
      from: params.from,
      to: params.to,
      include_pending: params.includePending,
    };
    return this.request<PowensTransactionListResponse>({
      method: 'GET',
      path: `/accounts/${encodeURIComponent(params.accountUuid)}/transactions`,
      searchParams,
    });
  }

  async getBalances(accountUuid: string): Promise<PowensBalance[]> {
    return this.request<PowensBalance[]>({
      method: 'GET',
      path: `/accounts/${encodeURIComponent(accountUuid)}/balances`,
    });
  }

  async getConnectionStatus(
    connectionUuid: string
  ): Promise<PowensConnectionStatusResponse> {
    return this.request<PowensConnectionStatusResponse>({
      method: 'GET',
      path: `/connections/${encodeURIComponent(connectionUuid)}`,
    });
  }

  private async request<T>(options: RequestOptions): Promise<T> {
    const url = new URL(options.path, this.baseUrl);
    if (options.searchParams) {
      for (const [key, value] of Object.entries(options.searchParams)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    if (!options.skipAuth) {
      const token = await this.ensureAccessToken();
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      options.timeoutMs ?? this.defaultTimeoutMs
    );

    try {
      const response = await this.fetchImpl(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      const requestId: string | undefined =
        response.headers.get('x-request-id') ?? undefined;

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          // ignore parsing errors
        }
        const errorObject =
          typeof errorBody === 'object' && errorBody !== null
            ? (errorBody as Record<string, unknown>)
            : undefined;
        const message: string =
          typeof errorObject?.message === 'string'
            ? errorObject.message
            : `Powens API request failed with status ${response.status}`;
        const code =
          typeof errorObject?.code === 'string' ? errorObject.code : undefined;
        throw new PowensClientError(
          message,
          response.status,
          code,
          requestId,
          errorBody
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      try {
        return (await response.json()) as T;
      } catch (error) {
        this.logger?.error?.(
          '[PowensClient] Failed to parse JSON response',
          error
        );
        throw new PowensClientError(
          'Failed to parse Powens response payload as JSON',
          response.status,
          undefined,
          requestId
        );
      }
    } catch (error) {
      if (error instanceof PowensClientError) {
        throw error;
      }
      if ((error as Error).name === 'AbortError') {
        throw new PowensClientError(
          `Powens API request timed out after ${options.timeoutMs ?? this.defaultTimeoutMs}ms`,
          408
        );
      }
      this.logger?.error?.('[PowensClient] Request failed', error);
      throw new PowensClientError(
        (error as Error).message ?? 'Powens API request failed',
        500
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private async ensureAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - 5000) {
      return this.token.accessToken;
    }
    this.token = await this.fetchAccessToken();
    return this.token.accessToken;
  }

  private async fetchAccessToken(): Promise<PowensOAuthToken> {
    const url = new URL('/oauth/token', this.baseUrl);
    const basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
      'utf-8'
    ).toString('base64');

    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        // ignore
      }
      const errorObject =
        typeof errorBody === 'object' && errorBody !== null
          ? (errorBody as Record<string, unknown>)
          : undefined;
      const message: string =
        typeof errorObject?.error_description === 'string'
          ? errorObject.error_description
          : 'Failed to obtain Powens access token';
      throw new PowensClientError(
        message,
        response.status,
        undefined,
        undefined,
        errorBody
      );
    }

    const payload = (await response.json()) as PowensOAuthTokenResponse;
    const expiresAt = Date.now() + payload.expires_in * 1000;
    this.logger?.debug?.(
      '[PowensClient] Received access token',
      { expiresIn: payload.expires_in }
    );
    return {
      accessToken: payload.access_token,
      expiresAt,
      scope: payload.scope,
    };
  }
}

