import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';

export const HarnessEvaluationCompletedPayload = new SchemaModel({
	name: 'HarnessEvaluationCompletedPayload',
	fields: {
		evaluationId: { type: ScalarTypeEnum.ID(), isOptional: false },
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		scenarioKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const HarnessEvaluationCompletedEvent = defineEvent({
	meta: {
		key: 'harness.evaluation.completed',
		version: '1.0.0',
		description: 'Emitted when a harness evaluation completes.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'evaluation', 'completed'],
		stability: HARNESS_STABILITY,
	},
	payload: HarnessEvaluationCompletedPayload,
});
