import { defineJob } from '@contractspec/lib.contracts-spec/jobs/spec';
import {
	OwnersEnum,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const PowensSyncDispatchPayloadModel = defineSchemaModel({
	name: 'PowensSyncDispatchPayload',
	description:
		'Payload enqueued from Powens OAuth callbacks or webhooks before dispatching sync workflows.',
	fields: {
		tenantId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		eventType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		userUuid: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		accountUuid: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

export const PowensSyncDispatchJob = defineJob({
	meta: {
		key: 'openbanking-powens.job.sync-dispatch',
		version: '1.0.0',
		title: 'Powens Sync Dispatch Job',
		description:
			'Queues the canonical open banking sync workflows after Powens callbacks and webhooks are verified.',
		domain: 'open-banking',
		owners: [OwnersEnum.PlatformFinance],
		tags: ['openbanking', 'powens', 'job', 'webhook'],
		stability: StabilityEnum.Experimental,
	},
	payload: {
		schema: PowensSyncDispatchPayloadModel,
	},
	retry: {
		maxRetries: 5,
		initialBackoffMs: 30_000,
		maxBackoffMs: 300_000,
		multiplier: 2,
		jitter: true,
	},
	timeoutMs: 60_000,
});
