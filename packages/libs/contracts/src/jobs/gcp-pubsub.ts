import { randomUUID } from 'node:crypto';

import type { EnqueueOptions, Job, JobHandler, JobQueue } from './queue';

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
    _options: EnqueueOptions = {}
  ): Promise<Job<TPayload>> {
    await this.options.client
      .topic(this.options.topicName)
      .publishMessage({
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
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  register(jobType: string, handler: JobHandler): void {
    this.handlers.set(jobType, handler);
  }

  start(): void {
    // Message consumption handled externally via Pub/Sub subscription.
  }

  async stop(): Promise<void> {
    this.handlers.clear();
  }
}


