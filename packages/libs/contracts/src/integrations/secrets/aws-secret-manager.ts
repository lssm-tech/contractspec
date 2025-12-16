import { Buffer } from 'node:buffer';

import {
  CreateSecretCommand,
  DeleteSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

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

type AwsSecretsManagerClient = Pick<SecretsManagerClient, 'send'>;

type AwsSecretsManagerClientConfig = ConstructorParameters<
  typeof SecretsManagerClient
>[0];

interface AwsSecretsManagerProviderOptions {
  region?: string;
  client?: AwsSecretsManagerClient;
  clientConfig?: AwsSecretsManagerClientConfig;
}

interface AwsSecretLocation {
  region: string;
  secretId: string;
  version?: string;
  stage?: string;
}

const DEFAULT_DELETE_RECOVERY_DAYS = 7;

export class AwsSecretsManagerProvider implements SecretProvider {
  readonly id = 'aws-secrets-manager';

  private readonly explicitRegion?: string;
  private readonly injectedClient?: AwsSecretsManagerClient;
  private readonly clientConfig?: AwsSecretsManagerClientConfig;
  private readonly clientsByRegion = new Map<string, AwsSecretsManagerClient>();

  constructor(options: AwsSecretsManagerProviderOptions = {}) {
    this.explicitRegion = options.region;
    this.injectedClient = options.client;
    this.clientConfig = options.clientConfig;
  }

  canHandle(reference: SecretReference): boolean {
    try {
      const parsed = parseSecretUri(reference);
      return (
        parsed.provider === 'aws' &&
        (parsed.path === 'secretsmanager' ||
          parsed.path.startsWith('secretsmanager/'))
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
    const client = this.getClient(location.region);

    const requestedVersion =
      options?.version ?? location.stage ?? location.version;
    const input = {
      SecretId: location.secretId,
      ...this.buildVersionSelector(requestedVersion),
    };

    try {
      const result = await client.send(new GetSecretValueCommand(input));
      const data = extractAwsSecretBytes(result, reference, this.id);
      return {
        data,
        version:
          typeof result.VersionId === 'string' && result.VersionId
            ? result.VersionId
            : requestedVersion,
        metadata: {
          region: location.region,
          secretId: location.secretId,
          ...(requestedVersion ? { requestedVersion } : {}),
        },
        retrievedAt: new Date(),
      };
    } catch (error) {
      throw toAwsSecretProviderError({
        error,
        provider: this.id,
        reference,
        operation: 'getSecret',
      });
    }
  }

  async setSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    const location = this.parseReference(reference);
    const client = this.getClient(location.region);
    const bytes = normalizeSecretPayload(payload);

    try {
      const result = await client.send(
        new PutSecretValueCommand({
          SecretId: location.secretId,
          SecretBinary: bytes,
        })
      );

      const versionId =
        typeof result.VersionId === 'string' && result.VersionId
          ? result.VersionId
          : 'latest';

      return {
        reference: this.buildReference(location.region, location.secretId, {
          version: versionId,
        }),
        version: versionId,
      };
    } catch (error) {
      if (!isAwsNotFound(error)) {
        throw toAwsSecretProviderError({
          error,
          provider: this.id,
          reference,
          operation: 'putSecretValue',
        });
      }

      // Secret doesn't exist yet: create it when reference is name-like.
      if (looksLikeAwsArn(location.secretId)) {
        throw new SecretProviderError({
          message: `Secret not found: ${location.secretId}`,
          provider: this.id,
          reference,
          code: 'NOT_FOUND',
          cause: error,
        });
      }

      try {
        const created = await client.send(
          new CreateSecretCommand({
            Name: location.secretId,
            SecretBinary: bytes,
          })
        );

        const versionId =
          typeof created.VersionId === 'string' && created.VersionId
            ? created.VersionId
            : 'latest';

        return {
          reference: this.buildReference(location.region, location.secretId, {
            version: versionId,
          }),
          version: versionId,
        };
      } catch (creationError) {
        throw toAwsSecretProviderError({
          error: creationError,
          provider: this.id,
          reference,
          operation: 'createSecret',
        });
      }
    }
  }

  async rotateSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    return this.setSecret(reference, payload);
  }

  async deleteSecret(reference: SecretReference): Promise<void> {
    const location = this.parseReference(reference);
    const client = this.getClient(location.region);

    try {
      await client.send(
        new DeleteSecretCommand({
          SecretId: location.secretId,
          RecoveryWindowInDays: DEFAULT_DELETE_RECOVERY_DAYS,
        })
      );
    } catch (error) {
      throw toAwsSecretProviderError({
        error,
        provider: this.id,
        reference,
        operation: 'deleteSecret',
      });
    }
  }

  private getClient(region: string): AwsSecretsManagerClient {
    if (this.injectedClient) {
      return this.injectedClient;
    }

    const cached = this.clientsByRegion.get(region);
    if (cached) {
      return cached;
    }

    const client = new SecretsManagerClient({
      ...(this.clientConfig ?? {}),
      region,
    });

    this.clientsByRegion.set(region, client);
    return client;
  }

  private parseReference(reference: SecretReference): AwsSecretLocation {
    const parsed = parseSecretUri(reference);
    if (parsed.provider !== 'aws') {
      throw new SecretProviderError({
        message: `Unsupported secret provider: ${parsed.provider}`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const segments = parsed.path.split('/').filter(Boolean);
    if (segments.length < 3 || segments[0] !== 'secretsmanager') {
      throw new SecretProviderError({
        message:
          'Expected secret reference format aws://secretsmanager/{region}/{secretIdOrArn}[?version=...]',
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const regionCandidate = segments[1];
    const region = this.resolveRegion(regionCandidate);

    const secretId = segments.slice(2).join('/');
    if (!secretId) {
      throw new SecretProviderError({
        message: `Unable to resolve secret id from reference "${parsed.path}"`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    return {
      region,
      secretId,
      version: parsed.extras?.version,
      stage: parsed.extras?.stage,
    };
  }

  private resolveRegion(regionCandidate?: string): string {
    const region =
      regionCandidate ??
      this.explicitRegion ??
      process.env.AWS_REGION ??
      process.env.AWS_DEFAULT_REGION;

    if (!region) {
      throw new SecretProviderError({
        message:
          'AWS region must be provided either in reference (aws://secretsmanager/{region}/...) or via AWS_REGION/AWS_DEFAULT_REGION.',
        provider: this.id,
        reference: 'aws://secretsmanager//',
        code: 'INVALID',
      });
    }

    return region;
  }

  private buildVersionSelector(
    version?: string
  ): { VersionStage?: string; VersionId?: string } | Record<string, never> {
    if (!version) return {};

    if (version === 'latest' || version === 'current') {
      return { VersionStage: 'AWSCURRENT' };
    }

    if (version.startsWith('AWS')) {
      return { VersionStage: version };
    }

    return { VersionId: version };
  }

  private buildReference(
    region: string,
    secretId: string,
    extras?: Record<string, string>
  ): string {
    const base = `aws://secretsmanager/${region}/${secretId}`;
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

function extractAwsSecretBytes(
  result: unknown,
  reference: SecretReference,
  provider: string
): Uint8Array {
  if (!result || typeof result !== 'object') {
    throw new SecretProviderError({
      message: 'Invalid AWS Secrets Manager response',
      provider,
      reference,
      code: 'UNKNOWN',
      cause: result,
    });
  }

  const record = result as {
    SecretBinary?: unknown;
    SecretString?: unknown;
  };

  if (record.SecretBinary instanceof Uint8Array) {
    return record.SecretBinary;
  }

  if (typeof record.SecretBinary === 'string') {
    // Some runtimes may coerce binary payload to base64 string.
    return Buffer.from(record.SecretBinary, 'base64');
  }

  if (typeof record.SecretString === 'string') {
    return Buffer.from(record.SecretString, 'utf-8');
  }

  throw new SecretProviderError({
    message: 'AWS secret value is empty',
    provider,
    reference,
    code: 'NOT_FOUND',
    cause: result,
  });
}

function looksLikeAwsArn(secretId: string): boolean {
  return secretId.startsWith('arn:aws:secretsmanager:');
}

function isAwsNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as {
    name?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };
  if (typeof err.$metadata?.httpStatusCode === 'number') {
    return err.$metadata.httpStatusCode === 404;
  }
  return err.name === 'ResourceNotFoundException';
}

function toAwsSecretProviderError(params: {
  error: unknown;
  provider: string;
  reference: SecretReference;
  operation: string;
}): SecretProviderError {
  const { error, provider, reference, operation } = params;

  if (error instanceof SecretProviderError) {
    return error;
  }

  const httpStatusCode =
    typeof error === 'object' &&
    error !== null &&
    '$metadata' in error &&
    typeof (error as { $metadata?: unknown }).$metadata === 'object' &&
    (error as { $metadata?: { httpStatusCode?: unknown } }).$metadata
      ?.httpStatusCode;

  const code: SecretProviderError['code'] =
    httpStatusCode === 404
      ? 'NOT_FOUND'
      : httpStatusCode === 401 || httpStatusCode === 403
        ? 'FORBIDDEN'
        : httpStatusCode === 400
          ? 'INVALID'
          : 'UNKNOWN';

  const message =
    error instanceof Error
      ? error.message
      : `Unknown error during ${operation}`;

  return new SecretProviderError({
    message,
    provider,
    reference,
    code,
    cause: error,
  });
}



