export * from './gmail-sync-handler';
export * from './ping-handler';
export * from './storage-document-handler';

import { registerDefinedJob } from '../define-job';
import type { JobQueue } from '../queue';

import { pingJob } from './ping-handler';
// import { equityaRecomputePlanJob } from './types/equitya.recompute-plan';
// import { artisanosGenerateQuoteJob } from './types/artisanos.generate-quote';

export function registerAllJobs(queue: JobQueue): void {
	registerDefinedJob(queue, pingJob);
	// registerDefinedJob(queue, equityaRecomputePlanJob);
	// registerDefinedJob(queue, artisanosGenerateQuoteJob);
}
