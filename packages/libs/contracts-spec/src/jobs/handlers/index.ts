export * from './ping-handler';
export * from './gmail-sync-handler';
export * from './storage-document-handler';
import type { JobQueue } from '../queue';
import { registerDefinedJob } from '../define-job';

import { pingJob } from './ping-handler';
// import { equityaRecomputePlanJob } from './types/equitya.recompute-plan';
// import { artisanosGenerateQuoteJob } from './types/artisanos.generate-quote';

export function registerAllJobs(queue: JobQueue): void {
  registerDefinedJob(queue, pingJob);
  // registerDefinedJob(queue, equityaRecomputePlanJob);
  // registerDefinedJob(queue, artisanosGenerateQuoteJob);
}
