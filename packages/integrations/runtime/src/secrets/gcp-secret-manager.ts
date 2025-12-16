import {
  protos,
  SecretManagerServiceClient,
} from '@google-cloud/secret-manager';
import type { CallOptions } from 'google-gax';

import {
  normalizeSecretPayload,
  parseSecretUri,
  SecretProviderError,
} from './provider';
import type {
  SecretProvider,
  SecretReference,
  SecretRotationResult,
  SecretValue,
  SecretWritePayload,
} from './provider';

type SecretManagerClient = SecretManagerServiceClient;

interface GcpSecretManagerProviderOptions {
  projectId?: string;
  client?: SecretManagerClient;
  clientOptions?: ConstructorParameters<typeof SecretManagerServiceClient>[0];
  defaultReplication?: protos.google.cloud.secretmanager.v1.IReplication;
}

interface GcpSecretLocation {
  projectId: string;
  secretId: string;
  version?: string;
}

const DEFAULT_REPLICATION: protos.google.cloud.secretmanager.v1.IReplication = {
  automatic: {},
};

export class GcpSecretManagerProvider implements SecretProvider {
  readonly id = 'gcp-secret-manager';
  private readonly client: SecretManagerClient;
  private readonly explicitProjectId?: string;
  private readonly replication: protos.google.cloud.secretmanager.v1.IReplication;

  constructor(options: GcpSecretManagerProviderOptions = {}) {
    this.client =
      options.client ??
      new SecretManagerServiceClient(options.clientOptions ?? {});
    this.explicitProjectId = options.projectId;
    this.replication = options.defaultReplication ?? DEFAULT_REPLICATION;
  }

  canHandle(reference: SecretReference): boolean {
    try {
      const parsed = parseSecretUri(reference);
      return parsed.provider === 'gcp';
    } catch {
      return false;
    }
  }

  async getSecret(
    reference: SecretReference,
    options?: { version?: string },
    callOptions?: CallOptions
  ): Promise<SecretValue> {
    const location = this.parseReference(reference);
    const secretVersionName = this.buildVersionName(location, options?.version);
    try {
      const response = await this.client.accessSecretVersion(
        {
          name: secretVersionName,
        },
        callOptions ?? {}
      );
      const [result] = response;
      const payload = result.payload;
      if (!payload?.data) {
        throw new SecretProviderError({
          message: `Secret payload empty for ${secretVersionName}`,
          provider: this.id,
          reference,
          code: 'UNKNOWN',
        });
      }

      const version = extractVersionFromName(result.name ?? secretVersionName);
      return {
        data: payload.data as Uint8Array,
        version,
        metadata: payload.dataCrc32c
          ? { crc32c: payload.dataCrc32c.toString() }
          : undefined,
        retrievedAt: new Date(),
      };
    } catch (error) {
      throw toSecretProviderError({
        error,
        provider: this.id,
        reference,
        operation: 'access',
      });
    }
  }

  async setSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    const location = this.parseReference(reference);
    const { secretName } = this.buildNames(location);
    const data = normalizeSecretPayload(payload);
    await this.ensureSecretExists(location, payload);

    try {
      const response = await this.client.addSecretVersion({
        parent: secretName,
        payload: {
          data,
        },
      });
      if (!response) {
        throw new SecretProviderError({
          message: `No version returned when adding secret version for ${secretName}`,
          provider: this.id,
          reference,
          code: 'UNKNOWN',
        });
      }
      const [version] = response;
      const versionName = version?.name ?? `${secretName}/versions/latest`;
      return {
        reference: `gcp://${versionName}`,
        version: extractVersionFromName(versionName) ?? 'latest',
      };
    } catch (error) {
      throw toSecretProviderError({
        error,
        provider: this.id,
        reference,
        operation: 'addSecretVersion',
      });
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
    const { secretName } = this.buildNames(location);
    try {
      await this.client.deleteSecret({
        name: secretName,
      });
    } catch (error) {
      throw toSecretProviderError({
        error,
        provider: this.id,
        reference,
        operation: 'delete',
      });
    }
  }

  private parseReference(reference: SecretReference): GcpSecretLocation {
    const parsed = parseSecretUri(reference);
    if (parsed.provider !== 'gcp') {
      throw new SecretProviderError({
        message: `Unsupported secret provider: ${parsed.provider}`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const segments = parsed.path.split('/').filter(Boolean);
    if (segments.length < 4 || segments[0] !== 'projects') {
      throw new SecretProviderError({
        message: `Expected secret reference format gcp://projects/{project}/secrets/{secret}[(/versions/{version})] but received "${parsed.path}"`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const projectIdCandidate = segments[1] ?? this.explicitProjectId;
    if (!projectIdCandidate) {
      throw new SecretProviderError({
        message: `Unable to resolve project or secret from reference "${parsed.path}"`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const indexOfSecrets = segments.indexOf('secrets');
    if (indexOfSecrets === -1 || indexOfSecrets + 1 >= segments.length) {
      throw new SecretProviderError({
        message: `Unable to resolve project or secret from reference "${parsed.path}"`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const resolvedProjectId = projectIdCandidate;
    const secretIdCandidate = segments[indexOfSecrets + 1];
    if (!secretIdCandidate) {
      throw new SecretProviderError({
        message: `Unable to resolve secret ID from reference "${parsed.path}"`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }
    const secretId = secretIdCandidate;
    const indexOfVersions = segments.indexOf('versions');
    const version =
      parsed.extras?.version ??
      (indexOfVersions !== -1 && indexOfVersions + 1 < segments.length
        ? segments[indexOfVersions + 1]
        : undefined);

    return {
      projectId: resolvedProjectId,
      secretId,
      version,
    };
  }

  private buildNames(location: GcpSecretLocation): {
    secretName: string;
    projectParent: string;
  } {
    const projectId = location.projectId ?? this.explicitProjectId;
    if (!projectId) {
      throw new SecretProviderError({
        message:
          'Project ID must be provided either in reference or provider configuration',
        provider: this.id,
        reference: `gcp://projects//secrets/${location.secretId}`,
        code: 'INVALID',
      });
    }

    const projectParent = `projects/${projectId}`;
    const secretName = `${projectParent}/secrets/${location.secretId}`;
    return {
      projectParent,
      secretName,
    };
  }

  private buildVersionName(
    location: GcpSecretLocation,
    explicitVersion?: string
  ): string {
    const { secretName } = this.buildNames(location);
    const version = explicitVersion ?? location.version ?? 'latest';
    return `${secretName}/versions/${version}`;
  }

  private async ensureSecretExists(
    location: GcpSecretLocation,
    payload: SecretWritePayload
  ): Promise<void> {
    const { secretName, projectParent } = this.buildNames(location);
    try {
      await this.client.getSecret({ name: secretName });
    } catch (error) {
      const providerError = toSecretProviderError({
        error,
        provider: this.id,
        reference: `gcp://${secretName}`,
        operation: 'getSecret',
        suppressThrow: true,
      });
      if (!providerError || providerError.code !== 'NOT_FOUND') {
        if (providerError) {
          throw providerError;
        }
        throw error;
      }
      try {
        await this.client.createSecret({
          parent: projectParent,
          secretId: location.secretId,
          secret: {
            replication: this.replication,
            labels: payload.labels,
          },
        });
      } catch (creationError) {
        const creationProviderError = toSecretProviderError({
          error: creationError,
          provider: this.id,
          reference: `gcp://${secretName}`,
          operation: 'createSecret',
        });
        throw creationProviderError;
      }
    }
  }
}

function extractVersionFromName(name: string): string | undefined {
  const segments = name.split('/').filter(Boolean);
  const index = segments.indexOf('versions');
  if (index === -1 || index + 1 >= segments.length) {
    return undefined;
  }
  return segments[index + 1];
}

function toSecretProviderError(params: {
  error: unknown;
  provider: string;
  reference: SecretReference;
  operation: string;
  suppressThrow?: boolean;
}): SecretProviderError {
  const { error, provider, reference, operation, suppressThrow } = params;
  if (error instanceof SecretProviderError) {
    return error;
  }

  const code = deriveErrorCode(error);
  const message =
    error instanceof Error
      ? error.message
      : `Unknown error during ${operation}`;

  const providerError = new SecretProviderError({
    message,
    provider,
    reference,
    code,
    cause: error,
  });

  if (suppressThrow) {
    return providerError;
  }

  throw providerError;
}

function deriveErrorCode(error: unknown): SecretProviderError['code'] {
  if (typeof error !== 'object' || error === null) {
    return 'UNKNOWN';
  }

  const errorAny = error as { code?: number | string };
  const code = errorAny.code;
  if (code === 5 || code === 'NOT_FOUND') return 'NOT_FOUND';
  if (code === 6 || code === 'ALREADY_EXISTS') return 'INVALID';
  if (code === 7 || code === 'PERMISSION_DENIED' || code === 403) {
    return 'FORBIDDEN';
  }
  if (code === 3 || code === 'INVALID_ARGUMENT') return 'INVALID';
  return 'UNKNOWN';
}

