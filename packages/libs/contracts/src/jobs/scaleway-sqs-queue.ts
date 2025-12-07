// jobs/scaleway-sqs-queue.ts
import { randomUUID } from 'crypto';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { EnqueueOptions, Job, JobHandler, JobQueue } from './queue';

interface ScalewaySqsQueueConfig {
  queueUrl: string;
  region?: string;
  endpoint?: string;
  waitTimeSeconds?: number;
  maxNumberOfMessages?: number;
  visibilityTimeoutSeconds?: number;
}

interface RawJobEnvelope<TPayload = unknown> {
  id: string;
  type: string;
  payload: TPayload;
}

export class ScalewaySqsJobQueue implements JobQueue {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;
  private readonly waitTimeSeconds: number;
  private readonly maxNumberOfMessages: number;
  private readonly visibilityTimeoutSeconds: number;
  private readonly handlers = new Map<string, JobHandler>();
  private running = false;

  constructor(config: ScalewaySqsQueueConfig) {
    const accessKeyId = process.env.SCALEWAY_ACCESS_KEY_QUEUE;
    const secretAccessKey = process.env.SCALEWAY_SECRET_KEY_QUEUE;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'Missing SCALEWAY_ACCESS_KEY / SCALEWAY_SECRET_KEY in env'
      );
    }

    const region = config.region ?? process.env.SCALEWAY_REGION ?? 'par';
    const endpoint = 'https://sqs.mnq.fr-par.scaleway.com';

    this.sqs = new SQSClient({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.queueUrl = config.queueUrl;
    this.waitTimeSeconds = config.waitTimeSeconds ?? 20;
    this.maxNumberOfMessages = config.maxNumberOfMessages ?? 5;
    this.visibilityTimeoutSeconds = config.visibilityTimeoutSeconds ?? 60;
  }

  async enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options: EnqueueOptions = {}
  ): Promise<Job<TPayload>> {
    const id = randomUUID();
    const now = new Date();

    const envelope: RawJobEnvelope<TPayload> = {
      id,
      type: jobType,
      payload,
    };

    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(envelope),
        DelaySeconds: options.delaySeconds ?? 0,
        // If you use FIFO queues later, you'd set MessageGroupId / MessageDeduplicationId here.
      })
    );

    return {
      id,
      type: jobType,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  register<TPayload>(jobType: string, handler: JobHandler<TPayload>): void {
    if (this.handlers.has(jobType)) {
      throw new Error(`Handler already registered for job type "${jobType}"`);
    }
    this.handlers.set(jobType, handler as JobHandler);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.pollLoop().catch((err) => {
      console.error('[queue] Fatal error in poll loop', err);
      // Let systemd restart the process if needed.
      process.exit(1);
    });
  }

  async stop(): Promise<void> {
    this.running = false;
    // Worst-case we wait for the current ReceiveMessage to finish (<= waitTimeSeconds)
  }

  private async pollLoop(): Promise<void> {
    console.log('[queue] SQS worker started for queue:', this.queueUrl);

    while (this.running) {
      try {
        const res = await this.sqs.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: this.maxNumberOfMessages,
            WaitTimeSeconds: this.waitTimeSeconds,
            VisibilityTimeout: this.visibilityTimeoutSeconds,
            MessageSystemAttributeNames: ['ApproximateReceiveCount'],
          })
        );

        const messages = res.Messages ?? [];

        if (messages.length === 0) {
          continue;
        }

        for (const msg of messages) {
          if (!msg.Body || !msg.ReceiptHandle) {
            console.warn(
              '[queue] Message missing Body or ReceiptHandle',
              msg.MessageId
            );
            continue;
          }

          let envelope: RawJobEnvelope;

          try {
            envelope = JSON.parse(msg.Body) as RawJobEnvelope;
          } catch (err) {
            console.error(
              `[queue] Failed to parse message body (id=${msg.MessageId}), deleting`,
              err
            );
            await this.deleteMessage(msg.ReceiptHandle);
            continue;
          }

          const handler = this.handlers.get(envelope.type);
          if (!handler) {
            console.error(
              `[queue] No handler registered for type "${envelope.type}", deleting message`
            );
            await this.deleteMessage(msg.ReceiptHandle);
            continue;
          }

          const now = new Date();
          const attempts = parseInt(
            (msg.Attributes?.ApproximateReceiveCount as string | undefined) ??
              '1',
            10
          );

          const job: Job = {
            id: envelope.id,
            type: envelope.type,
            payload: envelope.payload,
            status: 'pending',
            attempts,
            createdAt: now,
            updatedAt: now,
          };

          job.status = 'running';
          job.updatedAt = new Date();

          try {
            await handler(job);
            job.status = 'completed';
            job.updatedAt = new Date();
            await this.deleteMessage(msg.ReceiptHandle);
          } catch (err) {
            job.status = 'failed';
            job.lastError =
              err instanceof Error ? err.message : 'Unknown job error';
            job.updatedAt = new Date();

            console.error(
              `[queue] Error while handling job type=${job.type} id=${job.id}`,
              err
            );
            // Do NOT delete message on failure:
            // - SQS/Scaleway will redeliver until MaxReceiveCount, then DLQ takes over.
          }
        }
      } catch (err) {
        console.error('[queue] Error while polling SQS', err, err.$response);
        await this.sleep(5000);
      }
    }

    console.log('[queue] SQS worker stopped');
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      await this.sqs.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: receiptHandle,
        })
      );
    } catch (err) {
      console.error('[queue] Failed to delete message', err);
    }
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
