import type { OwnerShipMeta } from '../ownership';
import { SpecContractRegistry } from '../registry';
import type { VersionedSpecRef } from '../versioning';
import type { RetryPolicy } from './queue';

export type JobMeta = OwnerShipMeta;

export interface JobSchedule {
	/** Cron expression (e.g., "0 * * * *" for hourly). */
	cron?: string;
	/** Fixed interval in milliseconds between runs. */
	intervalMs?: number;
}

export interface JobSpec {
	meta: JobMeta;
	/** Zod schema or JSON Schema describing the job payload. */
	payload: { schema: unknown };
	/** Retry policy overrides for this job type. */
	retry?: Partial<RetryPolicy>;
	/** Maximum execution time before the job is considered timed out. */
	timeoutMs?: number;
	/** Optional scheduling configuration for recurring jobs. */
	schedule?: JobSchedule;
}

/** Reference to a job spec by key and version. */
export type JobRef = VersionedSpecRef;

export class JobSpecRegistry extends SpecContractRegistry<'job', JobSpec> {
	constructor(items?: JobSpec[]) {
		super('job', items);
	}
}

/**
 * Helper to define a Job spec.
 */
export const defineJob = (spec: JobSpec): JobSpec => spec;
