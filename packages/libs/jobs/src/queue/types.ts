import { z } from 'zod';

/**
 * Job status values.
 */
export type JobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'dead_letter';

/**
 * A job in the queue.
 */
export interface Job<TPayload = unknown> {
  id: string;
  type: string;
  version: number;
  payload: TPayload;
  status: JobStatus;
  priority: number;
  attempts: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  timeoutAt?: Date;
  lastError?: string;
  dedupeKey?: string;
  tenantId?: string;
  userId?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
  result?: unknown;
}

/**
 * Options for enqueueing a job.
 */
export interface EnqueueOptions {
  /** Delay execution by this many seconds */
  delaySeconds?: number;
  /** Key for deduplication (only one job with this key can be pending) */
  dedupeKey?: string;
  /** Maximum retry attempts (overrides job type default) */
  maxRetries?: number;
  /** Job priority (higher = more urgent) */
  priority?: number;
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** Tenant context */
  tenantId?: string;
  /** User who enqueued */
  userId?: string;
  /** Trace ID for distributed tracing */
  traceId?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Job handler function.
 */
export type JobHandler<TPayload = unknown, TResult = void> = (
  job: Job<TPayload>
) => Promise<TResult>;

/**
 * Job queue interface.
 */
export interface JobQueue {
  /** Enqueue a new job */
  enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options?: EnqueueOptions
  ): Promise<Job<TPayload>>;

  /** Register a handler for a job type */
  register<TPayload, TResult = void>(
    jobType: string,
    handler: JobHandler<TPayload, TResult>
  ): void;

  /** Start processing jobs */
  start(): void;

  /** Stop processing jobs gracefully */
  stop(): Promise<void>;

  /** Get job by ID */
  getJob?(jobId: string): Promise<Job | null>;

  /** Cancel a pending job */
  cancelJob?(jobId: string): Promise<boolean>;

  /** Get queue stats */
  getStats?(): Promise<QueueStats>;
}

/**
 * Queue statistics.
 */
export interface QueueStats {
  pending: number;
  running: number;
  completed: number;
  failed: number;
  deadLetter: number;
}

/**
 * Retry policy configuration.
 */
export interface RetryPolicy {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial backoff in milliseconds */
  initialBackoffMs: number;
  /** Maximum backoff in milliseconds */
  maxBackoffMs: number;
  /** Backoff multiplier (exponential) */
  multiplier: number;
  /** Add jitter to backoff */
  jitter: boolean;
}

/**
 * Default retry policy.
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  initialBackoffMs: 1000,
  maxBackoffMs: 60000,
  multiplier: 2,
  jitter: true,
};

/**
 * Calculate backoff delay for a retry attempt.
 */
export function calculateBackoff(
  attempt: number,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY
): number {
  const baseDelay = Math.min(
    policy.initialBackoffMs * Math.pow(policy.multiplier, attempt - 1),
    policy.maxBackoffMs
  );

  if (policy.jitter) {
    // Add up to 20% jitter
    const jitterFactor = 0.8 + Math.random() * 0.4;
    return Math.floor(baseDelay * jitterFactor);
  }

  return baseDelay;
}

/**
 * Job type definition.
 */
export interface JobTypeDef<TPayload = unknown> {
  type: string;
  version: number;
  payload: z.ZodType<TPayload>;
  options?: Partial<RetryPolicy & { timeoutMs: number }>;
  description?: string;
}

/**
 * Define a typed job type.
 */
export function defineJobType<TPayload>(
  def: JobTypeDef<TPayload>
): JobTypeDef<TPayload> {
  return def;
}
