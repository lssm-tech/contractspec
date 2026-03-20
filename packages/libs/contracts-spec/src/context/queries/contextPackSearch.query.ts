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

const ContextPackSearchInput = new SchemaModel({
	name: 'ContextPackSearchInput',
	fields: {
		query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		tag: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		owner: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		snapshotOnly: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const ContextPackSearchItem = new SchemaModel({
	name: 'ContextPackSearchItem',
	fields: {
		packKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		packVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		snapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
		snapshotCreatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		tags: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		owners: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		sourceCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const ContextPackSearchOutput = new SchemaModel({
	name: 'ContextPackSearchOutput',
	fields: {
		items: { type: ContextPackSearchItem, isOptional: false, isArray: true },
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const ContextPackSearchQuery = defineQuery({
	meta: {
		key: 'context.pack.search',
		title: 'Search Context Packs',
		version: '1.0.0',
		description: 'Search and filter context packs and snapshots.',
		goal: 'Provide discovery of context packs and their latest snapshots.',
		context:
			'Used by Studio and agent surfaces to find relevant context packs and snapshot entries.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'pack', 'search'],
		stability: CONTEXT_STABILITY,
		docId: [docId('docs.tech.context.pack.search')],
	},
	capability: {
		key: 'context.system',
		version: '1.0.0',
	},
	io: {
		input: ContextPackSearchInput,
		output: ContextPackSearchOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
