import { randomUUID } from 'node:crypto';
import type {
  Job,
  JobHandler,
  JobQueue,
  EnqueueOptions,
  QueueStats,
  RetryPolicy,
} from './types';
import { calculateBackoff, DEFAULT_RETRY_POLICY } from './types';

export interface MemoryQueueOptions {
  /** Poll interval in milliseconds */
  pollIntervalMs?: number;
  /** Maximum concurrent jobs */
  concurrency?: number;
  /** Default retry policy */
  retryPolicy?: RetryPolicy;
}

/**
 * In-memory job queue for development and testing.
 */
export class MemoryJobQueue implements JobQueue {
  private readonly jobs: Map<string, Job> = new Map();
  private readonly handlers = new Map<string, JobHandler>();
  private timer?: ReturnType<typeof setInterval>;
  private activeCount = 0;
  private readonly pollIntervalMs: number;
  private readonly concurrency: number;
  private readonly retryPolicy: RetryPolicy;

  constructor(options: MemoryQueueOptions = {}) {
    this.pollIntervalMs = options.pollIntervalMs ?? 200;
    this.concurrency = options.concurrency ?? 5;
    this.retryPolicy = options.retryPolicy ?? DEFAULT_RETRY_POLICY;
  }

  async enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options: EnqueueOptions = {}
  ): Promise<Job<TPayload>> {
    // Check for duplicate
    if (options.dedupeKey) {
      const existing = Array.from(this.jobs.values()).find(
        (j) => j.dedupeKey === options.dedupeKey && j.status === 'pending'
      );
      if (existing) {
        return existing as Job<TPayload>;
      }
    }

    const now = new Date();
    const scheduledAt = options.delaySeconds
      ? new Date(now.getTime() + options.delaySeconds * 1000)
      : now;

    const job: Job<TPayload> = {
      id: randomUUID(),
      type: jobType,
      version: 1,
      payload,
      status: 'pending',
      priority: options.priority ?? 0,
      attempts: 0,
      maxRetries: options.maxRetries ?? this.retryPolicy.maxRetries,
      createdAt: now,
      updatedAt: now,
      scheduledAt,
      dedupeKey: options.dedupeKey,
      tenantId: options.tenantId,
      userId: options.userId,
      traceId: options.traceId,
      metadata: options.metadata,
    };

    if (options.timeoutMs) {
      job.timeoutAt = new Date(now.getTime() + options.timeoutMs);
    }

    this.jobs.set(job.id, job);
    return job;
  }

  register<TPayload, TResult = void>(
    jobType: string,
    handler: JobHandler<TPayload, TResult>
  ): void {
    this.handlers.set(jobType, handler as JobHandler);
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.processNext();
    }, this.pollIntervalMs);
  }

  async stop(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    // Wait for active jobs to complete
    while (this.activeCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  async getJob(jobId: string): Promise<Job | null> {
    return this.jobs.get(jobId) ?? null;
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'pending') {
      return false;
    }
    job.status = 'cancelled';
    job.updatedAt = new Date();
    return true;
  }

  async getStats(): Promise<QueueStats> {
    const stats: QueueStats = {
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      deadLetter: 0,
    };

    for (const job of this.jobs.values()) {
      switch (job.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'running':
          stats.running++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'failed':
          stats.failed++;
          break;
        case 'dead_letter':
          stats.deadLetter++;
          break;
      }
    }

    return stats;
  }

  private async processNext(): Promise<void> {
    if (this.activeCount >= this.concurrency) return;

    const now = new Date();
    const pendingJobs = Array.from(this.jobs.values())
      .filter(
        (j) =>
          j.status === 'pending' &&
          (!j.scheduledAt || j.scheduledAt <= now)
      )
      .sort((a, b) => {
        // Higher priority first
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        // Earlier scheduled first
        return (a.scheduledAt?.getTime() ?? 0) - (b.scheduledAt?.getTime() ?? 0);
      });

    const job = pendingJobs[0];
    if (!job) return;

    const handler = this.handlers.get(job.type);
    if (!handler) return;

    this.activeCount++;
    job.status = 'running';
    job.startedAt = new Date();
    job.updatedAt = new Date();
    job.attempts += 1;

    try {
      const result = await handler(job);
      job.status = 'completed';
      job.completedAt = new Date();
      job.result = result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      job.lastError = errorMessage;

      if (job.attempts >= job.maxRetries) {
        job.status = 'dead_letter';
      } else {
        // Schedule retry with backoff
        const backoff = calculateBackoff(job.attempts, this.retryPolicy);
        job.status = 'pending';
        job.scheduledAt = new Date(Date.now() + backoff);
      }
    } finally {
      job.updatedAt = new Date();
      this.activeCount--;
    }
  }
}

