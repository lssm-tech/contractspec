import { randomUUID } from 'node:crypto';

import type { EnqueueOptions, Job, JobHandler, JobQueue } from './queue';

interface CloudTasksClientLike {
  createTask(request: {
    parent: string;
    task: {
      httpRequest: {
        httpMethod: number | string;
        url: string;
        body: Buffer;
        headers?: Record<string, string>;
        oidcToken?: { serviceAccountEmail: string };
      };
      scheduleTime?: { seconds: number };
    };
  }): Promise<unknown>;
}

export interface GcpCloudTasksQueueOptions {
  client: CloudTasksClientLike;
  projectId: string;
  location: string;
  queue: string;
  resolveUrl(jobType: string): string;
  serviceAccountEmail?: string;
}

export class GcpCloudTasksQueue implements JobQueue {
  private readonly handlers = new Map<string, JobHandler>();

  constructor(private readonly options: GcpCloudTasksQueueOptions) {}

  async enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options: EnqueueOptions = {}
  ): Promise<Job<TPayload>> {
    const enqueueTime =
      options.delaySeconds != null
        ? { seconds: Math.floor(Date.now() / 1000) + options.delaySeconds }
        : undefined;
    const body = Buffer.from(
      JSON.stringify({
        id: randomUUID(),
        type: jobType,
        payload,
      }),
      'utf-8'
    );
    await this.options.client.createTask({
      parent: `projects/${this.options.projectId}/locations/${this.options.location}/queues/${this.options.queue}`,
      task: {
        httpRequest: {
          httpMethod: 'POST',
          url: this.options.resolveUrl(jobType),
          body,
          headers: { 'Content-Type': 'application/json' },
          oidcToken: this.options.serviceAccountEmail
            ? { serviceAccountEmail: this.options.serviceAccountEmail }
            : undefined,
        },
        scheduleTime: enqueueTime,
      },
    });

    return {
      id: randomUUID(),
      type: jobType,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  register<TPayload>(jobType: string, handler: JobHandler<TPayload>): void {
    this.handlers.set(jobType, handler as JobHandler);
  }

  start(): void {
    // Execution is handled by Cloud Tasks via HTTP callbacks.
  }

  async stop(): Promise<void> {
    this.handlers.clear();
  }
}


