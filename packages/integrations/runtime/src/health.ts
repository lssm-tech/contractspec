import type { IntegrationConnectionHealth } from '@contractspec/lib.contracts/integrations/connection';

import type {
  IntegrationContext,
  IntegrationInvocationStatus,
  IntegrationTelemetryEmitter,
} from './runtime';

export interface IntegrationHealthCheckResult extends IntegrationConnectionHealth {
  metadata?: Record<string, string>;
}

export type IntegrationHealthCheckExecutor = (
  context: IntegrationContext
) => Promise<void>;

export interface IntegrationHealthServiceOptions {
  telemetry?: IntegrationTelemetryEmitter;
  now?: () => Date;
}

export class IntegrationHealthService {
  private readonly telemetry?: IntegrationTelemetryEmitter;
  private readonly nowFn: () => Date;

  constructor(options: IntegrationHealthServiceOptions = {}) {
    this.telemetry = options.telemetry;
    this.nowFn = options.now ?? (() => new Date());
  }

  async check(
    context: IntegrationContext,
    executor: IntegrationHealthCheckExecutor
  ): Promise<IntegrationHealthCheckResult> {
    const start = this.nowFn();
    try {
      await executor(context);
      const end = this.nowFn();
      const result: IntegrationHealthCheckResult = {
        status: 'connected',
        checkedAt: end,
        latencyMs: end.getTime() - start.getTime(),
      };
      this.emitTelemetry(context, result, 'success');
      return result;
    } catch (error) {
      const end = this.nowFn();
      const message = error instanceof Error ? error.message : 'Unknown error';
      const code = extractErrorCode(error);
      const result: IntegrationHealthCheckResult = {
        status: 'error',
        checkedAt: end,
        latencyMs: end.getTime() - start.getTime(),
        errorMessage: message,
        errorCode: code,
      };
      this.emitTelemetry(context, result, 'error', code, message);
      return result;
    }
  }

  private emitTelemetry(
    context: IntegrationContext,
    result: IntegrationHealthCheckResult,
    status: IntegrationInvocationStatus,
    errorCode?: string,
    errorMessage?: string
  ) {
    if (!this.telemetry) return;
    this.telemetry.record({
      tenantId: context.tenantId,
      appId: context.appId,
      environment: context.environment,
      slotId: context.slotId,
      integrationKey: context.spec.meta.key,
      integrationVersion: context.spec.meta.version,
      connectionId: context.connection.meta.id,
      status,
      durationMs: result.latencyMs,
      errorCode,
      errorMessage,
      occurredAt: result.checkedAt ?? this.nowFn(),
      metadata: {
        ...(context.trace
          ? {
              blueprint: `${context.trace.blueprintName}.v${context.trace.blueprintVersion}`,
              configVersion: context.trace.configVersion,
            }
          : {}),
        status: result.status,
      },
    });
  }
}

function extractErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const candidate = error as { code?: string | number };
  if (candidate.code == null) return undefined;
  return String(candidate.code);
}
