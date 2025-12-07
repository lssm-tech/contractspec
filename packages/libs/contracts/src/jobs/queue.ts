export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Job<TPayload = unknown> {
  id: string;
  type: string;
  payload: TPayload;
  status: JobStatus;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
  lastError?: string;
}

export interface EnqueueOptions {
  delaySeconds?: number;
  dedupeKey?: string; // only effective if using FIFO queues
  maxAttempts?: number; // advisory; DLQ is enforced at queue level
}

export type JobHandler<TPayload = unknown> = (
  job: Job<TPayload>
) => Promise<void>;

export interface JobQueue {
  enqueue<TPayload>(
    jobType: string,
    payload: TPayload,
    options?: EnqueueOptions
  ): Promise<Job<TPayload>>;
  register<TPayload>(jobType: string, handler: JobHandler<TPayload>): void;
  start(): void;
  stop(): Promise<void>;
}
