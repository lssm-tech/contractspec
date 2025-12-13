import * as z from 'zod';
import type { DefinedJob } from '@lssm/lib.contracts/jobs/define-job';
import type { Job } from '@lssm/lib.contracts/jobs/queue';

export const PING_JOB_TYPE = 'core.ping' as const;

export const PingPayloadSchema = z.object({});

export type PingPayload = z.infer<typeof PingPayloadSchema>;

export const pingJob: DefinedJob<PingPayload> = {
  type: PING_JOB_TYPE,
  schema: PingPayloadSchema,
  handler: async (_payload: PingPayload, _job: Job<PingPayload>) => {},
};
