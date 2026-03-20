import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';

export const HarnessStepBlockedPayload = new SchemaModel({
	name: 'HarnessStepBlockedPayload',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
		blockedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const HarnessStepBlockedEvent = defineEvent({
	meta: {
		key: 'harness.step.blocked',
		version: '1.0.0',
		description: 'Emitted when a harness step is blocked by policy.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'step', 'blocked'],
		stability: HARNESS_STABILITY,
	},
	payload: HarnessStepBlockedPayload,
});
