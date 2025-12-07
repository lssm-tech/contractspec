// jobs/define-job.ts
import type { ZodSchema } from 'zod';
import type { Job, JobHandler, JobQueue } from './queue';

export interface DefinedJob<TPayload> {
  type: string;
  schema: ZodSchema<TPayload>;
  handler: (payload: TPayload, job: Job<TPayload>) => Promise<void>;
}

export function registerDefinedJob<TPayload>(
  queue: JobQueue,
  def: DefinedJob<TPayload>
): void {
  const wrapped: JobHandler<unknown> = async (job) => {
    const payload = def.schema.parse(job.payload);
    const typedJob: Job<TPayload> = {
      ...(job as Job<unknown>),
      payload,
    } as Job<TPayload>;

    await def.handler(payload, typedJob);
  };

  queue.register<TPayload>(def.type, wrapped as JobHandler<TPayload>);
}
