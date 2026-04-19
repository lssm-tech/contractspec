import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const JobsFeature = defineFeature({
	meta: {
		key: 'libs.jobs',
		version: '1.0.0',
		title: 'Jobs',
		description:
			'Background jobs and scheduler module for ContractSpec applications',
		domain: 'jobs',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'jobs'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'jobs.enqueue', version: '1.0.0' },
		{ key: 'jobs.get', version: '1.0.0' },
		{ key: 'jobs.cancel', version: '1.0.0' },
		{ key: 'jobs.stats', version: '1.0.0' },
		{ key: 'jobs.schedule.create', version: '1.0.0' },
		{ key: 'jobs.schedule.list', version: '1.0.0' },
		{ key: 'jobs.schedule.toggle', version: '1.0.0' },
	],
	events: [
		{ key: 'job.enqueued', version: '1.0.0' },
		{ key: 'job.started', version: '1.0.0' },
		{ key: 'job.completed', version: '1.0.0' },
		{ key: 'job.failed', version: '1.0.0' },
		{ key: 'job.retrying', version: '1.0.0' },
		{ key: 'job.dead_lettered', version: '1.0.0' },
		{ key: 'job.cancelled', version: '1.0.0' },
		{ key: 'scheduler.job_triggered', version: '1.0.0' },
	],
});
