import type {
  SecretProvider,
  SecretReference,
  SecretRotationResult,
  SecretValue,
  SecretWritePayload,
} from './provider';
import { parseSecretUri, SecretProviderError } from './provider';

interface EnvSecretProviderOptions {
  /**
   * Optional map to alias secret references to environment variable names.
   * Useful when referencing secrets from other providers (e.g. gcp://...)
   * while still allowing local overrides.
   */
  aliases?: Record<string, string>;
}

/**
 * Environment-variable backed secret provider. Read-only by design.
 * Allows overriding other secret providers by deriving environment variable
 * names from secret references (or by using explicit aliases).
 */
export class EnvSecretProvider implements SecretProvider {
  readonly id = 'env';

  private readonly aliases: Record<string, string>;

  constructor(options: EnvSecretProviderOptions = {}) {
    this.aliases = options.aliases ?? {};
  }

  canHandle(reference: SecretReference): boolean {
    const envKey = this.resolveEnvKey(reference);
    return envKey !== undefined && process.env[envKey] !== undefined;
  }

  async getSecret(reference: SecretReference): Promise<SecretValue> {
    const envKey = this.resolveEnvKey(reference);
    if (!envKey) {
      throw new SecretProviderError({
        message: `Unable to resolve environment variable for reference "${reference}".`,
        provider: this.id,
        reference,
        code: 'INVALID',
      });
    }

    const value = process.env[envKey];
    if (value === undefined) {
      throw new SecretProviderError({
        message: `Environment variable "${envKey}" not found for reference "${reference}".`,
        provider: this.id,
        reference,
        code: 'NOT_FOUND',
      });
    }

    return {
      data: Buffer.from(value, 'utf-8'),
      version: 'current',
      metadata: {
        source: 'env',
        envKey,
      },
      retrievedAt: new Date(),
    };
  }

  async setSecret(
    reference: SecretReference,
    _payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    throw this.forbiddenError('setSecret', reference);
  }

  async rotateSecret(
    reference: SecretReference,
    _payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    throw this.forbiddenError('rotateSecret', reference);
  }

  async deleteSecret(reference: SecretReference): Promise<void> {
    throw this.forbiddenError('deleteSecret', reference);
  }

  private resolveEnvKey(reference: SecretReference): string | undefined {
    if (!reference) {
      return undefined;
    }

    if (this.aliases[reference]) {
      return this.aliases[reference];
    }

    if (!reference.includes('://')) {
      return reference;
    }

    try {
      const parsed = parseSecretUri(reference);
      if (parsed.provider === 'env') {
        return parsed.path;
      }

      if (parsed.extras?.env) {
        return parsed.extras.env;
      }

      return this.deriveEnvKey(parsed.path);
    } catch {
      return reference;
    }
  }

  private deriveEnvKey(path: string): string | undefined {
    if (!path) return undefined;
    return path
      .split(/[/:\-.]/)
      .filter(Boolean)
      .map((segment) =>
        segment
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_{2,}/g, '_')
          .toUpperCase()
      )
      .join('_');
  }

  private forbiddenError(
    operation: string,
    reference: SecretReference
  ): SecretProviderError {
    return new SecretProviderError({
      message: `EnvSecretProvider is read-only. "${operation}" is not allowed for ${reference}.`,
      provider: this.id,
      reference,
      code: 'FORBIDDEN',
    });
  }
}

