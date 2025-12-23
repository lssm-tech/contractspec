import type { ZodSchema } from 'zod';
import type { Job } from './queue';
import type { JobQueue } from './queue';

export interface DefinedJob<TPayload> {
  type: string;
  schema: ZodSchema<TPayload>;
  handler: (payload: TPayload, job: Job<TPayload>) => Promise<void>;
}

/**
 * Register a `DefinedJob` on a queue with payload validation.
 *
 * - Parses and validates payload via the job's Zod schema
 * - Invokes the defined handler with the validated payload
 */
export function registerDefinedJob<TPayload>(
  queue: JobQueue,
  job: DefinedJob<TPayload>
): void {
  queue.register<TPayload>(job.type, async (queuedJob) => {
    const parsed = job.schema.parse(queuedJob.payload);
    await job.handler(parsed, queuedJob as Job<TPayload>);
  });
}
