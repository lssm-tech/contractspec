import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';

export const HarnessRunFailedPayload = new SchemaModel({
	name: 'HarnessRunFailedPayload',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		failedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		problem: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

export const HarnessRunFailedEvent = defineEvent({
	meta: {
		key: 'harness.run.failed',
		version: '1.0.0',
		description: 'Emitted when a harness run fails.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'run', 'failed'],
		stability: HARNESS_STABILITY,
	},
	payload: HarnessRunFailedPayload,
});
