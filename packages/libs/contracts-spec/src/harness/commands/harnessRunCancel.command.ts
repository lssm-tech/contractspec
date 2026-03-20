import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';

const HarnessRunCancelInput = new SchemaModel({
	name: 'HarnessRunCancelInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const HarnessRunCancelOutput = new SchemaModel({
	name: 'HarnessRunCancelOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		cancelledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const HarnessRunCancelCommand = defineCommand({
	meta: {
		key: 'harness.run.cancel',
		title: 'Cancel Harness Run',
		version: '1.0.0',
		description: 'Cancel an in-flight harness run.',
		goal: 'Stop execution while preserving evidence and audit state.',
		context: 'Used when operators or agents abort a harness session.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'run', 'cancel'],
		stability: HARNESS_STABILITY,
	},
	capability: { key: 'harness.execution', version: '1.0.0' },
	io: {
		input: HarnessRunCancelInput,
		output: HarnessRunCancelOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
