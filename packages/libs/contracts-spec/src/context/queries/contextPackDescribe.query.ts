import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from '../constants';

const ContextPackDescribeInput = new SchemaModel({
	name: 'ContextPackDescribeInput',
	fields: {
		packKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ContextPackSource = new SchemaModel({
	name: 'ContextPackSource',
	fields: {
		kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		required: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ContextPackSummary = new SchemaModel({
	name: 'ContextPackSummary',
	fields: {
		packKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		owners: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		tags: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		sources: { type: ContextPackSource, isOptional: true, isArray: true },
	},
});

const ContextPackDescribeOutput = new SchemaModel({
	name: 'ContextPackDescribeOutput',
	fields: {
		pack: { type: ContextPackSummary, isOptional: false },
		snapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const ContextPackDescribeQuery = defineQuery({
	meta: {
		key: 'context.pack.describe',
		title: 'Describe Context Pack',
		version: '1.0.0',
		description: 'Describe a context pack and its sources.',
		goal: 'Provide a canonical view of context pack composition.',
		context:
			'Used by Studio and agents to understand what a pack will include before snapshotting.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'pack', 'describe'],
		stability: CONTEXT_STABILITY,
		docId: [docId('docs.tech.context.pack.describe')],
	},
	capability: {
		key: 'context.system',
		version: '1.0.0',
	},
	io: {
		input: ContextPackDescribeInput,
		output: ContextPackDescribeOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
