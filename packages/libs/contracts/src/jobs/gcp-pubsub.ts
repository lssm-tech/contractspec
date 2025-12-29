import { randomUUID } from 'node:crypto';

import {
  DEFAULT_RETRY_POLICY,
  type EnqueueOptions,
  type Job,
  type JobHandler,
  type JobQueue,
} from './queue';

interface PubSubClientLike {
  topic(name: string): {
    publishMessage(message: { data: Buffer }): Promise<string>;
  };
}

export interface GcpPubSubQueueOptions {
  client: PubSubClientLike;
  topicName: string;
}

export class GcpPubSubQueue implements JobQueue {
  private readonly handlers = new Map<string, JobHandler>();

  constructor(private readonly options: GcpPubSubQueueOptions) {}

  async enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options: EnqueueOptions = {}
  ): Promise<Job<TPayload>> {
    await this.options.client.topic(this.options.topicName).publishMessage({
      data: Buffer.from(
        JSON.stringify({
          id: randomUUID(),
          type: jobType,
          payload,
        }),
        'utf-8'
      ),
    });

    return {
      id: randomUUID(),
      type: jobType,
      version: '1.0.0',
      payload,
      status: 'pending',
      priority: options.priority ?? 0,
      attempts: 0,
      maxRetries: options.maxRetries ?? DEFAULT_RETRY_POLICY.maxRetries,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  register<TPayload, TResult = void>(
    jobType: string,
    handler: JobHandler<TPayload, TResult>
  ): void {
    this.handlers.set(jobType, handler as JobHandler);
  }

  start(): void {
    // Message consumption handled externally via Pub/Sub subscription.
  }

  async stop(): Promise<void> {
    this.handlers.clear();
  }
}
