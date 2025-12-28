import { performance } from 'node:perf_hooks';
import type {
  ResolvedAppConfig,
  ResolvedIntegration,
} from '../app-config/runtime';
import type { ConnectionStatus, IntegrationConnection } from './connection';
import type { IntegrationSpec } from './spec';
import type { SecretProvider, SecretValue } from './secrets/provider';

export interface IntegrationTraceMetadata {
  blueprintName: string;
  blueprintVersion: string;
  configVersion: string;
}

export interface IntegrationTelemetryEvent {
  tenantId: string;
  appId: string;
  environment?: string;
  slotId?: string;
  integrationKey: string;
  integrationVersion: string;
  connectionId: string;
  status: 'success' | 'error';
  durationMs?: number;
  errorCode?: string;
  errorMessage?: string;
  occurredAt: Date;
  metadata?: Record<string, string | number | boolean>;
}

export interface IntegrationTelemetryEmitter {
  record(event: IntegrationTelemetryEvent): Promise<void> | void;
}

export type IntegrationInvocationStatus = 'success' | 'error';

export interface IntegrationContext {
  tenantId: string;
  appId: string;
  environment?: string;
  slotId?: string;
  spec: IntegrationSpec;
  connection: IntegrationConnection;
  secretProvider: SecretProvider;
  secretReference: string;
  trace: IntegrationTraceMetadata;
  config?: Record<string, unknown>;
}

export interface IntegrationCallContext {
  tenantId: string;
  appId: string;
  environment?: string;
  blueprintName: string;
  blueprintVersion: string;
  configVersion: string;
  slotId: string;
  operation: string;
}

export interface IntegrationCallError {
  code: string;
  message: string;
  retryable: boolean;
  cause?: unknown;
}

export interface IntegrationCallResult<T> {
  success: boolean;
  data?: T;
  error?: IntegrationCallError;
  metadata: {
    latencyMs: number;
    connectionId: string;
    ownershipMode: IntegrationConnection['ownershipMode'];
    attempts: number;
  };
}

export interface IntegrationCallGuardOptions {
  telemetry?: IntegrationTelemetryEmitter;
  maxAttempts?: number;
  backoffMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  sleep?: (ms: number) => Promise<void>;
  now?: () => Date;
}

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BACKOFF_MS = 250;

export class IntegrationCallGuard {
  private readonly telemetry?: IntegrationTelemetryEmitter;
  private readonly maxAttempts: number;
  private readonly backoffMs: number;
  private readonly shouldRetry: (error: unknown, attempt: number) => boolean;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly now: () => Date;

  constructor(
    private readonly secretProvider: SecretProvider,
    options: IntegrationCallGuardOptions = {}
  ) {
    this.telemetry = options.telemetry;
    this.maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
    this.backoffMs = options.backoffMs ?? DEFAULT_BACKOFF_MS;
    this.shouldRetry =
      options.shouldRetry ??
      ((error: unknown) =>
        typeof error === 'object' &&
        error !== null &&
        'retryable' in error &&
        Boolean((error as { retryable?: unknown }).retryable));
    this.sleep =
      options.sleep ??
      ((ms: number) =>
        ms <= 0
          ? Promise.resolve()
          : new Promise((resolve) => setTimeout(resolve, ms)));
    this.now = options.now ?? (() => new Date());
  }

  async executeWithGuards<T>(
    slotId: string,
    operation: string,
    _input: unknown,
    resolvedConfig: ResolvedAppConfig,
    executor: (
      connection: IntegrationConnection,
      secrets: Record<string, string>
    ) => Promise<T>
  ): Promise<IntegrationCallResult<T>> {
    const integration = this.findIntegration(slotId, resolvedConfig);
    if (!integration) {
      return this.failure(
        {
          tenantId: resolvedConfig.tenantId,
          appId: resolvedConfig.appId,
          environment: resolvedConfig.environment,
          blueprintName: resolvedConfig.blueprintName,
          blueprintVersion: resolvedConfig.blueprintVersion,
          configVersion: resolvedConfig.configVersion,
          slotId,
          operation,
        },
        undefined,
        {
          code: 'SLOT_NOT_BOUND',
          message: `Integration slot "${slotId}" is not bound for tenant "${resolvedConfig.tenantId}".`,
          retryable: false,
        },
        0
      );
    }

    const status = integration.connection.status;
    if (status === 'disconnected' || status === 'error') {
      return this.failure(
        this.makeContext(slotId, operation, resolvedConfig),
        integration,
        {
          code: 'CONNECTION_NOT_READY',
          message: `Integration connection "${integration.connection.meta.label}" is in status "${status}".`,
          retryable: false,
        },
        0
      );
    }

    const secrets = await this.fetchSecrets(integration.connection);

    let attempt = 0;
    const started = performance.now();
    while (attempt < this.maxAttempts) {
      attempt += 1;
      try {
        const data = await executor(integration.connection, secrets);
        const duration = performance.now() - started;
        this.emitTelemetry(
          this.makeContext(slotId, operation, resolvedConfig),
          integration,
          'success',
          duration
        );
        return {
          success: true,
          data,
          metadata: {
            latencyMs: duration,
            connectionId: integration.connection.meta.id,
            ownershipMode: integration.connection.ownershipMode,
            attempts: attempt,
          },
        };
      } catch (error) {
        const duration = performance.now() - started;
        this.emitTelemetry(
          this.makeContext(slotId, operation, resolvedConfig),
          integration,
          'error',
          duration,
          this.errorCodeFor(error),
          error instanceof Error ? error.message : String(error)
        );
        const retryable = this.shouldRetry(error, attempt);
        if (!retryable || attempt >= this.maxAttempts) {
          return {
            success: false,
            error: {
              code: this.errorCodeFor(error),
              message: error instanceof Error ? error.message : String(error),
              retryable,
              cause: error,
            },
            metadata: {
              latencyMs: duration,
              connectionId: integration.connection.meta.id,
              ownershipMode: integration.connection.ownershipMode,
              attempts: attempt,
            },
          };
        }
        await this.sleep(this.backoffMs);
      }
    }

    // Should never reach here due to loop logic.
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Integration call failed after retries.',
        retryable: false,
      },
      metadata: {
        latencyMs: performance.now() - started,
        connectionId: integration.connection.meta.id,
        ownershipMode: integration.connection.ownershipMode,
        attempts: this.maxAttempts,
      },
    };
  }

  private findIntegration(
    slotId: string,
    config: ResolvedAppConfig
  ): ResolvedIntegration | undefined {
    return config.integrations.find(
      (integration) => integration.slot.slotId === slotId
    );
  }

  private async fetchSecrets(
    connection: IntegrationConnection
  ): Promise<Record<string, string>> {
    if (!this.secretProvider.canHandle(connection.secretRef)) {
      throw new Error(
        `Secret provider "${this.secretProvider.id}" cannot handle reference "${connection.secretRef}".`
      );
    }
    const secret = await this.secretProvider.getSecret(connection.secretRef);
    return this.parseSecret(secret);
  }

  private parseSecret(secret: SecretValue): Record<string, string> {
    const text = new TextDecoder().decode(secret.data);
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const entries = Object.entries(parsed).filter(
          ([, value]) =>
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        );
        return Object.fromEntries(
          entries.map(([key, value]) => [key, String(value)])
        );
      }
    } catch {
      // Fall through to raw secret.
    }
    return { secret: text };
  }

  private emitTelemetry(
    context: IntegrationCallContext,
    integration: ResolvedIntegration | undefined,
    status: 'success' | 'error',
    durationMs: number,
    errorCode?: string,
    errorMessage?: string
  ) {
    if (!this.telemetry || !integration) return;
    this.telemetry.record({
      tenantId: context.tenantId,
      appId: context.appId,
      environment: context.environment,
      slotId: context.slotId,
      integrationKey: integration.connection.meta.integrationKey,
      integrationVersion: integration.connection.meta.integrationVersion,
      connectionId: integration.connection.meta.id,
      status,
      durationMs,
      errorCode,
      errorMessage,
      occurredAt: this.now(),
      metadata: {
        blueprint: `${context.blueprintName}.v${context.blueprintVersion}`,
        configVersion: context.configVersion,
        operation: context.operation,
      },
    });
  }

  private failure<T>(
    context: IntegrationCallContext,
    integration: ResolvedIntegration | undefined,
    error: IntegrationCallError,
    attempts: number
  ): IntegrationCallResult<T> {
    if (integration) {
      this.emitTelemetry(
        context,
        integration,
        'error',
        0,
        error.code,
        error.message
      );
    }
    return {
      success: false,
      error,
      metadata: {
        latencyMs: 0,
        connectionId: integration?.connection.meta.id ?? 'unknown',
        ownershipMode: integration?.connection.ownershipMode ?? 'managed',
        attempts,
      },
    };
  }

  private makeContext(
    slotId: string,
    operation: string,
    config: ResolvedAppConfig
  ): IntegrationCallContext {
    return {
      tenantId: config.tenantId,
      appId: config.appId,
      environment: config.environment,
      blueprintName: config.blueprintName,
      blueprintVersion: config.blueprintVersion,
      configVersion: config.configVersion,
      slotId,
      operation,
    };
  }

  private errorCodeFor(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string'
    ) {
      return (error as { code: string }).code;
    }
    return 'PROVIDER_ERROR';
  }
}

export function ensureConnectionReady(integration: ResolvedIntegration): void {
  const status = integration.connection.status;
  if (status === 'disconnected' || status === 'error') {
    throw new Error(
      `Integration connection "${integration.connection.meta.label}" is in status "${status}".`
    );
  }
}

export function connectionStatusLabel(status: ConnectionStatus): string {
  switch (status) {
    case 'connected':
      return 'connected';
    case 'disconnected':
      return 'disconnected';
    case 'error':
      return 'error';
    case 'unknown':
    default:
      return 'unknown';
  }
}
