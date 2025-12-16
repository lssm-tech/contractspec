import { Buffer } from 'node:buffer';

export type SecretReference = string;

export interface SecretValue {
  data: Uint8Array;
  version?: string;
  metadata?: Record<string, string>;
  retrievedAt: Date;
}

export interface SecretFetchOptions {
  version?: string;
}

export type SecretPayloadEncoding = 'utf-8' | 'base64' | 'binary';

export interface SecretWritePayload {
  data: string | Uint8Array;
  encoding?: SecretPayloadEncoding;
  contentType?: string;
  labels?: Record<string, string>;
}

export interface SecretRotationResult {
  reference: SecretReference;
  version: string;
}

export interface SecretProvider {
  readonly id: string;
  canHandle(reference: SecretReference): boolean;
  getSecret(
    reference: SecretReference,
    options?: SecretFetchOptions
  ): Promise<SecretValue>;
  setSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult>;
  rotateSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult>;
  deleteSecret(reference: SecretReference): Promise<void>;
}

export interface ParsedSecretUri {
  provider: string;
  path: string;
  extras?: Record<string, string>;
}

export class SecretProviderError extends Error {
  readonly provider: string;
  readonly reference: SecretReference;
  readonly code: 'NOT_FOUND' | 'FORBIDDEN' | 'INVALID' | 'UNKNOWN';
  readonly cause?: unknown;

  constructor(params: {
    message: string;
    provider: string;
    reference: SecretReference;
    code?: SecretProviderError['code'];
    cause?: unknown;
  }) {
    super(params.message);
    this.name = 'SecretProviderError';
    this.provider = params.provider;
    this.reference = params.reference;
    this.code = params.code ?? 'UNKNOWN';
    this.cause = params.cause;
  }
}

export function parseSecretUri(reference: SecretReference): ParsedSecretUri {
  if (!reference) {
    throw new SecretProviderError({
      message: 'Secret reference cannot be empty',
      provider: 'unknown',
      reference,
      code: 'INVALID',
    });
  }

  const [scheme, rest] = reference.split('://');
  if (!scheme || !rest) {
    throw new SecretProviderError({
      message: `Invalid secret reference: ${reference}`,
      provider: 'unknown',
      reference,
      code: 'INVALID',
    });
  }

  const queryIndex = rest.indexOf('?');
  if (queryIndex === -1) {
    return {
      provider: scheme,
      path: rest,
    };
  }

  const path = rest.slice(0, queryIndex);
  const query = rest.slice(queryIndex + 1);
  const extras = Object.fromEntries(
    query
      .split('&')
      .filter(Boolean)
      .map((pair) => {
        const [keyRaw, valueRaw] = pair.split('=');
        const key = keyRaw ?? '';
        const value = valueRaw ?? '';
        return [decodeURIComponent(key), decodeURIComponent(value)];
      })
  );

  return {
    provider: scheme,
    path,
    extras,
  };
}

export function normalizeSecretPayload(
  payload: SecretWritePayload
): Uint8Array {
  if (payload.data instanceof Uint8Array) {
    return payload.data;
  }

  if (payload.encoding === 'base64') {
    return Buffer.from(payload.data, 'base64');
  }

  if (payload.encoding === 'binary') {
    return Buffer.from(payload.data, 'binary');
  }

  return Buffer.from(payload.data, 'utf-8');
}



