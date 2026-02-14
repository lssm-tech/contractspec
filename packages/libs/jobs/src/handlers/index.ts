export * from './ping-job';
export * from './gmail-sync-handler';
export * from './storage-document-handler';
import type { JobQueue } from '@contractspec/lib.contracts-spec/jobs/queue';
import { registerDefinedJob } from '../queue/register-defined-job';

import { pingJob } from './ping-job';
// import { equityaRecomputePlanJob } from './types/equitya.recompute-plan';
// import { artisanosGenerateQuoteJob } from './types/artisanos.generate-quote';

export function registerAllJobs(queue: JobQueue): void {
  registerDefinedJob(queue, pingJob);
  // registerDefinedJob(queue, equityaRecomputePlanJob);
  // registerDefinedJob(queue, artisanosGenerateQuoteJob);
}
