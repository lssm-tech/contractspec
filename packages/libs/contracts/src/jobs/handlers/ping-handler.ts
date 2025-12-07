// jobs/types/ping.ts
import * as z from 'zod';
import type { Job } from '../queue';
import type { DefinedJob } from '../define-job';

export const PING_JOB_TYPE = 'core.ping' as const;

export const PingPayloadSchema = z.object({});

export type PingPayload = z.infer<typeof PingPayloadSchema>;

export const pingJob: DefinedJob<PingPayload> = {
  type: PING_JOB_TYPE,
  schema: PingPayloadSchema,
  handler: async (_payload: PingPayload, job: Job<PingPayload>) => {
    console.log('[ping] job id=%s attempts=%d', job.id, job.attempts);
  },
};
