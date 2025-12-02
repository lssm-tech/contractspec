import { MNQ } from '@scaleway/sdk';
import type { ScalewayClient } from '../clients/scaleway-client.js';
import type { ResourceNames } from '../config/resources.js';
import { createResourceTags } from '../utils/tags.js';
import type { Environment } from '../config/index.js';

export interface QueueResources {
  queueNames: string[];
}

export class QueueStack {
  private apiMnq: any;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string
  ) {
    this.apiMnq = new (MNQ.v1beta1 as any).API(client);
  }

  async plan(): Promise<{
    queues: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[];
  }> {
    const queues = await Promise.all(
      this.resourceNames.queues.map(async (queueName) => {
        const existing = await this.findQueue(queueName);
        return {
          name: queueName,
          action: (existing ? 'no-op' : 'create') as 'create' | 'update' | 'no-op',
          current: existing,
        };
      })
    );

    return { queues };
  }

  async apply(): Promise<QueueResources> {
    const tags = createResourceTags(this.env, this.org);
    const queueNames: string[] = [];

    for (const queueName of this.resourceNames.queues) {
      await this.ensureQueue(queueName, tags);
      queueNames.push(queueName);
    }

    return { queueNames };
  }

  private async findQueue(name: string) {
    try {
      const response = await this.apiMnq.listQueues({
        name,
      });
      return response.queues?.[0];
    } catch {
      return null;
    }
  }

  private async ensureQueue(name: string, tags: Record<string, string>) {
    const existing = await this.findQueue(name);
    if (existing) {
      return existing;
    }

    const queue = await this.apiMnq.createQueue({
      name,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
    });

    // Create DLQ if needed
    const dlqName = `${name}-dlq`;
    await this.ensureQueue(dlqName, tags);

    return queue;
  }
}
