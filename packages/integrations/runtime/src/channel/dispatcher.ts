import type { ChannelOutboxActionRecord } from './types';
import type { ChannelRuntimeStore } from './store';
import type { ChannelTelemetryEmitter } from './telemetry';

export interface DispatchSendResult {
  providerMessageId?: string;
  responseStatus?: number;
  responseBody?: string;
}

export interface ChannelMessageSender {
  send(action: ChannelOutboxActionRecord): Promise<DispatchSendResult>;
}

export interface ChannelOutboxDispatcherOptions {
  batchSize?: number;
  maxRetries?: number;
  baseBackoffMs?: number;
  jitter?: boolean;
  now?: () => Date;
  telemetry?: ChannelTelemetryEmitter;
}

export interface ChannelDispatchSummary {
  claimed: number;
  sent: number;
  retried: number;
  deadLettered: number;
}

export class ChannelOutboxDispatcher {
  private readonly batchSize: number;
  private readonly maxRetries: number;
  private readonly baseBackoffMs: number;
  private readonly jitter: boolean;
  private readonly now: () => Date;
  private readonly telemetry?: ChannelTelemetryEmitter;

  constructor(
    private readonly store: ChannelRuntimeStore,
    options: ChannelOutboxDispatcherOptions = {}
  ) {
    this.batchSize = Math.max(1, options.batchSize ?? 20);
    this.maxRetries = Math.max(1, options.maxRetries ?? 3);
    this.baseBackoffMs = Math.max(100, options.baseBackoffMs ?? 1000);
    this.jitter = options.jitter ?? true;
    this.now = options.now ?? (() => new Date());
    this.telemetry = options.telemetry;
  }

  async dispatchBatch(
    resolveSender: (
      providerKey: string
    ) => ChannelMessageSender | null | Promise<ChannelMessageSender | null>,
    limit?: number
  ): Promise<ChannelDispatchSummary> {
    const actions = await this.store.claimPendingOutboxActions(
      Math.max(1, limit ?? this.batchSize),
      this.now()
    );

    const summary: ChannelDispatchSummary = {
      claimed: actions.length,
      sent: 0,
      retried: 0,
      deadLettered: 0,
    };

    for (const action of actions) {
      const startedAtMs = Date.now();
      try {
        const sender = await resolveSender(action.providerKey);
        if (!sender) {
          throw Object.assign(new Error('No sender configured for provider'), {
            code: 'SENDER_NOT_CONFIGURED',
          });
        }

        const sendResult = await sender.send(action);
        const latencyMs = Date.now() - startedAtMs;
        await this.store.recordDeliveryAttempt({
          actionId: action.id,
          attempt: action.attemptCount,
          responseStatus: sendResult.responseStatus,
          responseBody: sendResult.responseBody,
          latencyMs,
        });
        await this.store.markOutboxSent(
          action.id,
          sendResult.providerMessageId
        );
        summary.sent += 1;
        this.telemetry?.record({
          stage: 'dispatch',
          status: 'sent',
          workspaceId: action.workspaceId,
          providerKey: action.providerKey,
          actionId: action.id,
          attempt: action.attemptCount,
          latencyMs,
        });
      } catch (error) {
        const latencyMs = Date.now() - startedAtMs;
        const errorCode = getErrorCode(error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        await this.store.recordDeliveryAttempt({
          actionId: action.id,
          attempt: action.attemptCount,
          responseBody: errorMessage,
          latencyMs,
        });

        if (action.attemptCount >= this.maxRetries) {
          await this.store.markOutboxDeadLetter({
            actionId: action.id,
            lastErrorCode: errorCode,
            lastErrorMessage: errorMessage,
          });
          summary.deadLettered += 1;
          this.telemetry?.record({
            stage: 'dispatch',
            status: 'dead_letter',
            workspaceId: action.workspaceId,
            providerKey: action.providerKey,
            actionId: action.id,
            attempt: action.attemptCount,
            latencyMs,
            metadata: {
              errorCode,
            },
          });
        } else {
          const nextAttemptAt = new Date(
            this.now().getTime() + this.calculateBackoffMs(action.attemptCount)
          );
          await this.store.markOutboxRetry({
            actionId: action.id,
            nextAttemptAt,
            lastErrorCode: errorCode,
            lastErrorMessage: errorMessage,
          });
          summary.retried += 1;
          this.telemetry?.record({
            stage: 'dispatch',
            status: 'retry',
            workspaceId: action.workspaceId,
            providerKey: action.providerKey,
            actionId: action.id,
            attempt: action.attemptCount,
            latencyMs,
            metadata: {
              errorCode,
            },
          });
        }
      }
    }

    return summary;
  }

  private calculateBackoffMs(attempt: number): number {
    const exponent = Math.max(0, attempt - 1);
    const base = this.baseBackoffMs * Math.pow(2, exponent);
    if (!this.jitter) {
      return Math.round(base);
    }
    const jitterFactor = 0.8 + Math.random() * 0.4;
    return Math.round(base * jitterFactor);
  }
}

function getErrorCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }
  return 'DISPATCH_FAILED';
}
