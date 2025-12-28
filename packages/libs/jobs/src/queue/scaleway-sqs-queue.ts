import { randomUUID } from 'node:crypto';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Logger } from '@contractspec/lib.logger';
import { DEFAULT_RETRY_POLICY } from './types';
import type { EnqueueOptions, Job, JobHandler, JobQueue } from './types';

export interface ScalewaySqsQueueCredentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface ScalewaySqsQueueConfig {
  queueUrl: string;
  region?: string;
  endpoint?: string;
  waitTimeSeconds?: number;
  maxNumberOfMessages?: number;
  visibilityTimeoutSeconds?: number;
  credentials?: ScalewaySqsQueueCredentials;
  logger?: Logger;
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
  private readonly logger?: Logger;
  private running = false;

  constructor(config: ScalewaySqsQueueConfig) {
    this.logger = config.logger;

    const accessKeyId =
      config.credentials?.accessKeyId ?? process.env.SCALEWAY_ACCESS_KEY_QUEUE;
    const secretAccessKey =
      config.credentials?.secretAccessKey ??
      process.env.SCALEWAY_SECRET_KEY_QUEUE;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'Missing SCALEWAY_ACCESS_KEY_QUEUE / SCALEWAY_SECRET_KEY_QUEUE in env'
      );
    }

    const region = config.region ?? process.env.SCALEWAY_REGION ?? 'par';
    const endpoint = config.endpoint ?? 'https://sqs.mnq.fr-par.scaleway.com';

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
    const scheduledAt = options.delaySeconds
      ? new Date(now.getTime() + options.delaySeconds * 1000)
      : now;

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
      version: '1.0.0',
      payload,
      status: 'pending',
      priority: options.priority ?? 0,
      attempts: 0,
      maxRetries: options.maxRetries ?? DEFAULT_RETRY_POLICY.maxRetries,
      createdAt: now,
      updatedAt: now,
      scheduledAt,
      dedupeKey: options.dedupeKey,
      tenantId: options.tenantId,
      userId: options.userId,
      traceId: options.traceId,
      metadata: options.metadata,
    };
  }

  register<TPayload, TResult = void>(
    jobType: string,
    handler: JobHandler<TPayload, TResult>
  ): void {
    if (this.handlers.has(jobType)) {
      throw new Error(`Handler already registered for job type "${jobType}"`);
    }
    this.handlers.set(jobType, handler as JobHandler);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    void this.pollLoop().catch((error) => {
      this.logger?.error?.('jobs.queue.scaleway_sqs.poll_loop_fatal', {
        error: error instanceof Error ? error.message : String(error),
      });
      this.running = false;
    });
  }

  async stop(): Promise<void> {
    this.running = false;
    // Worst-case we wait for the current ReceiveMessage to finish (<= waitTimeSeconds)
  }

  private async pollLoop(): Promise<void> {
    this.logger?.info?.('jobs.queue.scaleway_sqs.started', {
      queueUrl: this.queueUrl,
    });

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
            this.logger?.warn?.('jobs.queue.scaleway_sqs.invalid_message', {
              messageId: msg.MessageId,
              reason: 'missing_body_or_receipt',
            });
            continue;
          }

          let envelope: RawJobEnvelope;

          try {
            envelope = JSON.parse(msg.Body) as RawJobEnvelope;
          } catch (err) {
            this.logger?.warn?.('jobs.queue.scaleway_sqs.parse_failed', {
              messageId: msg.MessageId,
              error: err instanceof Error ? err.message : String(err),
            });
            await this.deleteMessage(msg.ReceiptHandle);
            continue;
          }

          const handler = this.handlers.get(envelope.type);
          if (!handler) {
            this.logger?.warn?.('jobs.queue.scaleway_sqs.missing_handler', {
              jobType: envelope.type,
              messageId: msg.MessageId,
            });
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
            version: '1.0.0',
            payload: envelope.payload,
            status: 'pending',
            priority: 0,
            attempts,
            maxRetries: DEFAULT_RETRY_POLICY.maxRetries,
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

            this.logger?.error?.('jobs.queue.scaleway_sqs.job_failed', {
              jobType: job.type,
              jobId: job.id,
              error: err instanceof Error ? err.message : String(err),
            });
            // Do NOT delete message on failure:
            // - SQS/Scaleway will redeliver until MaxReceiveCount, then DLQ takes over.
          }
        }
      } catch (err) {
        this.logger?.error?.('jobs.queue.scaleway_sqs.poll_error', {
          error: err instanceof Error ? err.message : String(err),
        });
        await this.sleep(5000);
      }
    }

    this.logger?.info?.('jobs.queue.scaleway_sqs.stopped', {
      queueUrl: this.queueUrl,
    });
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
      this.logger?.warn?.('jobs.queue.scaleway_sqs.delete_failed', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
