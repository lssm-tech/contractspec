import { Buffer } from 'node:buffer';

import {
  normalizeSecretPayload,
  parseSecretUri,
  SecretProviderError,
} from './provider';
import type {
  SecretFetchOptions,
  SecretProvider,
  SecretReference,
  SecretRotationResult,
  SecretValue,
  SecretWritePayload,
} from './provider';

interface ScalewaySecretManagerProviderOptions {
  /**
   * Scaleway API token (SCW secret key). If omitted, uses env vars.
   * Header: X-Auth-Token
   */
  token?: string;
  /** Default region when not present in reference (e.g. fr-par). */
  defaultRegion?: string;
  /** Default project id used when creating secrets by name. */
  defaultProjectId?: string;
  /** Override API base url (defaults to https://api.scaleway.com). */
  baseUrl?: string;
  /** Inject fetch for tests. */
  fetch?: typeof fetch;
}

interface ScalewaySecretLocation {
  region: string;
  secretIdOrName: string;
  revision?: string;
}

const UUID_V4_LIKE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class ScalewaySecretManagerProvider implements SecretProvider {
  readonly id = 'scaleway-secret-manager';

  private readonly token: string;
  private readonly defaultRegion?: string;
  private readonly defaultProjectId?: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(options: ScalewaySecretManagerProviderOptions = {}) {
    this.token =
      options.token ??
      process.env.SCW_SECRET_KEY ??
      process.env.SCALEWAY_SECRET_KEY ??
      '';
    this.defaultRegion =
      options.defaultRegion ??
      process.env.SCW_DEFAULT_REGION ??
      process.env.SCW_REGION;
    this.defaultProjectId =
      options.defaultProjectId ??
      process.env.SCW_DEFAULT_PROJECT_ID ??
      process.env.SCW_PROJECT_ID;
    this.baseUrl = options.baseUrl ?? 'https://api.scaleway.com';
    this.fetchFn = options.fetch ?? fetch;
  }

  canHandle(reference: SecretReference): boolean {
    try {
      const parsed = parseSecretUri(reference);
      return (
        parsed.provider === 'scw' &&
        (parsed.path === 'secret-manager' ||
          parsed.path.startsWith('secret-manager/'))
      );
    } catch {
      return false;
    }
  }

  async getSecret(
    reference: SecretReference,
    options?: SecretFetchOptions
  ): Promise<SecretValue> {
    const location = this.parseReference(reference);

    if (!this.token) {
      throw new SecretProviderError({
        message:
          'Scaleway secret manager token is missing (set SCW_SECRET_KEY / SCALEWAY_SECRET_KEY).',
        provider: this.id,
        reference,
        code: 'FORBIDDEN',
      });
    }

    if (!UUID_V4_LIKE.test(location.secretIdOrName)) {
      throw new SecretProviderError({
        message:
          'Scaleway getSecret requires a secretId (uuid) reference, not a secret name.',
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const revision = options?.version ?? location.revision ?? 'latest';

    const url = `${this.baseUrl}/secret-manager/v1beta1/regions/${encodeURIComponent(location.region)}/secrets/${encodeURIComponent(location.secretIdOrName)}/versions/${encodeURIComponent(revision)}/access`;

    const response = await this.fetchFn(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': this.token,
      },
    });

    if (!response.ok) {
      throw await toScalewayError({
        response,
        provider: this.id,
        reference,
        operation: 'getSecret',
      });
    }

    const payload = (await response.json()) as unknown;
    const dataB64 = extractScalewayData(payload);

    return {
      data: Buffer.from(dataB64, 'base64'),
      version: revision,
      metadata: {
        region: location.region,
        secretId: location.secretIdOrName,
      },
      retrievedAt: new Date(),
    };
  }

  async setSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    const location = this.parseReference(reference);

    if (!this.token) {
      throw new SecretProviderError({
        message:
          'Scaleway secret manager token is missing (set SCW_SECRET_KEY / SCALEWAY_SECRET_KEY).',
        provider: this.id,
        reference,
        code: 'FORBIDDEN',
      });
    }

    const bytes = normalizeSecretPayload(payload);
    const encoded = Buffer.from(bytes).toString('base64');

    const secretId = UUID_V4_LIKE.test(location.secretIdOrName)
      ? location.secretIdOrName
      : await this.createSecret({
          region: location.region,
          name: location.secretIdOrName,
          reference,
        });

    const version = await this.createSecretVersion({
      region: location.region,
      secretId,
      dataB64: encoded,
      reference,
    });

    return {
      reference: this.buildReference(location.region, secretId, {
        version,
      }),
      version,
    };
  }

  async rotateSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    return this.setSecret(reference, payload);
  }

  async deleteSecret(reference: SecretReference): Promise<void> {
    const location = this.parseReference(reference);

    if (!this.token) {
      throw new SecretProviderError({
        message:
          'Scaleway secret manager token is missing (set SCW_SECRET_KEY / SCALEWAY_SECRET_KEY).',
        provider: this.id,
        reference,
        code: 'FORBIDDEN',
      });
    }

    if (!UUID_V4_LIKE.test(location.secretIdOrName)) {
      throw new SecretProviderError({
        message:
          'Scaleway deleteSecret requires a secretId (uuid) reference, not a secret name.',
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const url = `${this.baseUrl}/secret-manager/v1beta1/regions/${encodeURIComponent(location.region)}/secrets/${encodeURIComponent(location.secretIdOrName)}`;

    const response = await this.fetchFn(url, {
      method: 'DELETE',
      headers: {
        'X-Auth-Token': this.token,
      },
    });

    if (!response.ok) {
      throw await toScalewayError({
        response,
        provider: this.id,
        reference,
        operation: 'deleteSecret',
      });
    }
  }

  private parseReference(reference: SecretReference): ScalewaySecretLocation {
    const parsed = parseSecretUri(reference);
    if (parsed.provider !== 'scw') {
      throw new SecretProviderError({
        message: `Unsupported secret provider: ${parsed.provider}`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const segments = parsed.path.split('/').filter(Boolean);
    if (segments.length < 2 || segments[0] !== 'secret-manager') {
      throw new SecretProviderError({
        message:
          'Expected secret reference format scw://secret-manager/{region}/{secretIdOrName}[?version=...]',
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const region = segments[1] ?? this.defaultRegion;
    if (!region) {
      throw new SecretProviderError({
        message:
          'Scaleway region must be provided either in reference (scw://secret-manager/{region}/...) or via SCW_DEFAULT_REGION/SCW_REGION.',
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const secretIdOrName = segments.slice(2).join('/');
    if (!secretIdOrName) {
      throw new SecretProviderError({
        message: `Unable to resolve secret id/name from reference "${parsed.path}"`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    return {
      region,
      secretIdOrName,
      revision: parsed.extras?.version,
    };
  }

  private async createSecret(params: {
    region: string;
    name: string;
    reference: SecretReference;
  }): Promise<string> {
    const projectId = this.defaultProjectId;
    if (!projectId) {
      throw new SecretProviderError({
        message:
          'Scaleway project id is required to create secrets by name (set SCW_DEFAULT_PROJECT_ID/SCW_PROJECT_ID).',
        provider: this.id,
        reference: params.reference,
        code: 'INVALID',
      });
    }

    const url = `${this.baseUrl}/secret-manager/v1beta1/regions/${encodeURIComponent(params.region)}/secrets`;

    const response = await this.fetchFn(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.token,
      },
      body: JSON.stringify({
        name: params.name,
        project_id: projectId,
      }),
    });

    if (!response.ok) {
      throw await toScalewayError({
        response,
        provider: this.id,
        reference: params.reference,
        operation: 'createSecret',
      });
    }

    const payload = (await response.json()) as unknown;
    const secretId = extractScalewaySecretId(payload);
    return secretId;
  }

  private async createSecretVersion(params: {
    region: string;
    secretId: string;
    dataB64: string;
    reference: SecretReference;
  }): Promise<string> {
    const url = `${this.baseUrl}/secret-manager/v1beta1/regions/${encodeURIComponent(params.region)}/secrets/${encodeURIComponent(params.secretId)}/versions`;

    const response = await this.fetchFn(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.token,
      },
      body: JSON.stringify({
        data: params.dataB64,
      }),
    });

    if (!response.ok) {
      throw await toScalewayError({
        response,
        provider: this.id,
        reference: params.reference,
        operation: 'createSecretVersion',
      });
    }

    const payload = (await response.json()) as unknown;
    return extractScalewayRevision(payload) ?? 'latest';
  }

  private buildReference(
    region: string,
    secretId: string,
    extras?: Record<string, string>
  ): string {
    const base = `scw://secret-manager/${region}/${secretId}`;
    const query = extras
      ? Object.entries(extras)
          .filter(([, value]) => Boolean(value))
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join('&')
      : '';

    return query ? `${base}?${query}` : base;
  }
}

function extractScalewayData(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid scaleway secret payload');
  }

  const record = payload as { data?: unknown };
  if (typeof record.data === 'string' && record.data) {
    return record.data;
  }

  throw new Error('Scaleway secret payload is missing data');
}

function extractScalewaySecretId(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid scaleway createSecret payload');
  }

  const record = payload as { id?: unknown };
  if (typeof record.id === 'string' && record.id) {
    return record.id;
  }

  throw new Error('Scaleway createSecret response is missing id');
}

function extractScalewayRevision(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const record = payload as { revision?: unknown; id?: unknown };
  if (typeof record.revision === 'number') {
    return String(record.revision);
  }
  if (typeof record.revision === 'string' && record.revision) {
    return record.revision;
  }
  if (typeof record.id === 'string' && record.id) {
    // Some API shapes may return "id" for the version.
    return record.id;
  }

  return undefined;
}

async function toScalewayError(params: {
  response: Response;
  provider: string;
  reference: SecretReference;
  operation: string;
}): Promise<SecretProviderError> {
  const { response, provider, reference, operation } = params;

  const code: SecretProviderError['code'] =
    response.status === 404
      ? 'NOT_FOUND'
      : response.status === 401 || response.status === 403
        ? 'FORBIDDEN'
        : response.status >= 400 && response.status < 500
          ? 'INVALID'
          : 'UNKNOWN';

  const bodyText = await safeReadBody(response);
  const message = bodyText
    ? `Scaleway Secret Manager ${operation} failed (${response.status}): ${bodyText}`
    : `Scaleway Secret Manager ${operation} failed (${response.status})`;

  return new SecretProviderError({
    message,
    provider,
    reference,
    code,
  });
}

async function safeReadBody(response: Response): Promise<string | undefined> {
  try {
    const text = await response.text();
    const trimmed = text.trim();
    return trimmed.length ? trimmed : undefined;
  } catch {
    return undefined;
  }
}




