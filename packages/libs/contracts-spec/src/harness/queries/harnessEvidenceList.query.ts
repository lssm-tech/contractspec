import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';
import { EvidenceArtifactModel } from '../models';

const HarnessEvidenceListInput = new SchemaModel({
	name: 'HarnessEvidenceListInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		stepId: { type: ScalarTypeEnum.ID(), isOptional: true },
		kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const HarnessEvidenceListOutput = new SchemaModel({
	name: 'HarnessEvidenceListOutput',
	fields: {
		artifacts: {
			type: EvidenceArtifactModel,
			isOptional: false,
			isArray: true,
		},
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const HarnessEvidenceListQuery = defineQuery({
	meta: {
		key: 'harness.evidence.list',
		title: 'List Harness Evidence',
		version: '1.0.0',
		description: 'List normalized evidence artifacts for one run.',
		goal: 'Expose proof of what happened during execution.',
		context: 'Used in audit and evaluation surfaces.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'evidence', 'list'],
		stability: HARNESS_STABILITY,
	},
	capability: { key: 'harness.evidence', version: '1.0.0' },
	io: {
		input: HarnessEvidenceListInput,
		output: HarnessEvidenceListOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
