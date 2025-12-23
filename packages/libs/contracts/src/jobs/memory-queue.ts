import { randomUUID } from 'node:crypto';

import {
  DEFAULT_RETRY_POLICY,
  type EnqueueOptions,
  type Job,
  type JobHandler,
  type JobQueue,
} from './queue';

export class MemoryJobQueue implements JobQueue {
  private readonly jobs: Job[] = [];
  private readonly handlers = new Map<string, JobHandler>();
  private timer?: NodeJS.Timeout;
  private processing = false;

  constructor(private readonly pollIntervalMs = 200) {}

  async enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options: EnqueueOptions = {}
  ): Promise<Job<TPayload>> {
    const job: Job<TPayload> = {
      id: randomUUID(),
      type: jobType,
      version: 1,
      payload,
      status: 'pending',
      priority: options.priority ?? 0,
      attempts: 0,
      maxRetries: options.maxRetries ?? DEFAULT_RETRY_POLICY.maxRetries,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (options.delaySeconds) {
      job.updatedAt = new Date(Date.now() + options.delaySeconds * 1000);
    }
    this.jobs.push(job);
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
    while (this.processing) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  private async processNext() {
    if (this.processing) return;
    const job = this.jobs.find(
      (j) => j.status === 'pending' && j.updatedAt <= new Date()
    );
    if (!job) return;
    const handler = this.handlers.get(job.type);
    if (!handler) return;

    this.processing = true;
    job.status = 'running';
    job.updatedAt = new Date();
    job.attempts += 1;

    try {
      await handler(job);
      job.status = 'completed';
      job.updatedAt = new Date();
    } catch (error) {
      job.status = 'failed';
      job.lastError =
        error instanceof Error ? error.message : 'Unknown job error';
      job.updatedAt = new Date();
    } finally {
      this.processing = false;
    }
  }
}
