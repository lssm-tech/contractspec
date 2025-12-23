import type { DefinedJob } from '@lssm/lib.contracts/jobs/define-job';
import type { Job, JobHandler, JobQueue } from '@lssm/lib.contracts/jobs/queue';

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
