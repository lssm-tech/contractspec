import { describe, expect, it, vi } from 'bun:test';

import { MemoryJobQueue } from './memory-queue';
import { GcpCloudTasksQueue } from './gcp-cloud-tasks';
import { GcpPubSubQueue } from './gcp-pubsub';

describe('Job queues', () => {
  it('processes jobs in memory queue', async () => {
    const queue = new MemoryJobQueue(10);
    const handler = vi.fn(async () => {});
    queue.register('test', handler);
    queue.start();

    await queue.enqueue('test', { foo: 'bar' });
    await new Promise((resolve) => setTimeout(resolve, 30));
    await queue.stop();

    expect(handler).toHaveBeenCalled();
  });

  it('enqueues tasks to Cloud Tasks', async () => {
    const client = {
      createTask: vi.fn(async () => ({})),
    };
    const queue = new GcpCloudTasksQueue({
      client,
      projectId: 'proj',
      location: 'us-central1',
      queue: 'jobs',
      resolveUrl: () => 'https://example.com/job',
    });
    await queue.enqueue('test', { foo: 'bar' }, { delaySeconds: 5 });
    expect(client.createTask).toHaveBeenCalled();
  });

  it('publishes messages to Pub/Sub', async () => {
    const publishMessage = vi.fn(async () => 'id');
    const client = {
      topic: vi.fn(() => ({
        publishMessage,
      })),
    };
    const queue = new GcpPubSubQueue({
      client,
      topicName: 'projects/test/topics/jobs',
    });
    await queue.enqueue('test', { foo: 'bar' });
    expect(client.topic).toHaveBeenCalled();
    expect(publishMessage).toHaveBeenCalled();
  });
});
