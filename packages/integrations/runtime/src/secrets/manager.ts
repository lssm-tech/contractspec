import { SecretProviderError } from './provider';
import type {
  SecretProvider,
  SecretReference,
  SecretRotationResult,
  SecretValue,
  SecretWritePayload,
} from './provider';

interface ProviderRegistration {
  readonly provider: SecretProvider;
  readonly priority: number;
  readonly order: number;
}

interface RegisterOptions {
  /**
   * Larger priority values are attempted first. Defaults to 0.
   */
  priority?: number;
}

export interface SecretProviderManagerOptions {
  /**
   * Override manager identifier. Defaults to "secret-provider-manager".
   */
  id?: string;
  /**
   * Providers to pre-register. They are registered in array order with
   * descending priority (first entry wins ties).
   */
  providers?: { provider: SecretProvider; priority?: number }[];
}

/**
 * Composite secret provider that delegates to registered providers.
 * Providers are attempted in order of descending priority, respecting the
 * registration order for ties. This enables privileged overrides (e.g.
 * environment variables) while still supporting durable backends like GCP
 * Secret Manager.
 */
export class SecretProviderManager implements SecretProvider {
  readonly id: string;
  private readonly providers: ProviderRegistration[] = [];
  private registrationCounter = 0;

  constructor(options: SecretProviderManagerOptions = {}) {
    this.id = options.id ?? 'secret-provider-manager';
    const initialProviders = options.providers ?? [];
    for (const entry of initialProviders) {
      this.register(entry.provider, { priority: entry.priority });
    }
  }

  register(provider: SecretProvider, options: RegisterOptions = {}): this {
    this.providers.push({
      provider,
      priority: options.priority ?? 0,
      order: this.registrationCounter++,
    });
    this.providers.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.order - b.order;
    });
    return this;
  }

  canHandle(reference: SecretReference): boolean {
    return this.providers.some(({ provider }) =>
      safeCanHandle(provider, reference)
    );
  }

  async getSecret(
    reference: SecretReference,
    options?: SecretFetchOptions
  ): Promise<SecretValue> {
    const errors: SecretProviderError[] = [];

    for (const { provider } of this.providers) {
      if (!safeCanHandle(provider, reference)) {
        continue;
      }
      try {
        return await provider.getSecret(reference, options);
      } catch (error) {
        if (error instanceof SecretProviderError) {
          errors.push(error);
          if (error.code !== 'NOT_FOUND') {
            break;
          }
          continue;
        }
        throw error;
      }
    }

    throw this.composeError('getSecret', reference, errors, options?.version);
  }

  async setSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    return this.delegateToFirst('setSecret', reference, (provider) =>
      provider.setSecret(reference, payload)
    );
  }

  async rotateSecret(
    reference: SecretReference,
    payload: SecretWritePayload
  ): Promise<SecretRotationResult> {
    return this.delegateToFirst('rotateSecret', reference, (provider) =>
      provider.rotateSecret(reference, payload)
    );
  }

  async deleteSecret(reference: SecretReference): Promise<void> {
    await this.delegateToFirst('deleteSecret', reference, (provider) =>
      provider.deleteSecret(reference)
    );
  }

  private async delegateToFirst<T>(
    operation: 'setSecret' | 'rotateSecret' | 'deleteSecret',
    reference: SecretReference,
    invoker: (provider: SecretProvider) => Promise<T>
  ): Promise<T> {
    const errors: SecretProviderError[] = [];

    for (const { provider } of this.providers) {
      if (!safeCanHandle(provider, reference)) {
        continue;
      }
      try {
        return await invoker(provider);
      } catch (error) {
        if (error instanceof SecretProviderError) {
          errors.push(error);
          continue;
        }
        throw error;
      }
    }

    throw this.composeError(operation, reference, errors);
  }

  private composeError(
    operation: string,
    reference: SecretReference,
    errors: SecretProviderError[],
    version?: string
  ): SecretProviderError {
    if (errors.length === 1) {
      const [singleError] = errors;
      if (singleError) {
        return singleError;
      }
    }

    const messageParts = [
      `No registered secret provider could ${operation}`,
      `reference "${reference}"`,
    ];
    if (version) {
      messageParts.push(`(version: ${version})`);
    }
    if (errors.length > 1) {
      messageParts.push(
        `Attempts: ${errors
          .map((error) => `${error.provider}:${error.code}`)
          .join(', ')}`
      );
    }

    return new SecretProviderError({
      message: messageParts.join(' '),
      provider: this.id,
      reference,
      code: errors.length > 0 ? errors[errors.length - 1]!.code : 'UNKNOWN',
      cause: errors,
    });
  }
}

function safeCanHandle(provider: SecretProvider, reference: SecretReference) {
  try {
    return provider.canHandle(reference);
  } catch {
    return false;
  }
}

type SecretFetchOptions = Parameters<SecretProvider['getSecret']>[1];



