import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineFormSpec } from '../../forms/forms';
import type { DocBlock } from '../../docs/types';
import { docRef } from '../../docs/registry';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from '../constants';

const ContextPackSearchFormModel = new SchemaModel({
	name: 'ContextPackSearchFormModel',
	fields: {
		query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		tag: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		owner: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		snapshotOnly: { type: ScalarTypeEnum.Boolean(), isOptional: true },
	},
});

export const ContextPackSearchFormDocBlock = {
	id: 'docs.tech.context.pack.search.form',
	title: 'Context pack search form',
	summary: 'Form used to search context packs in UI surfaces.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/context/pack/search-form',
	tags: ['context', 'form', 'search'],
	body: `# context.pack.search.form

Form specification for searching context packs by query, tag, or owner.
`,
} satisfies DocBlock;

export const ContextPackSearchForm = defineFormSpec({
	meta: {
		key: 'context.pack.search.form',
		title: 'Context Pack Search',
		version: '1.0.0',
		description: 'Search form for context packs and snapshots.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'search'],
		stability: CONTEXT_STABILITY,
		docId: [docRef(ContextPackSearchFormDocBlock.id)],
	},
	model: ContextPackSearchFormModel,
	fields: [
		{
			kind: 'text',
			name: 'query',
			labelI18n: 'Search',
			placeholderI18n: 'Search context packs',
		},
		{
			kind: 'text',
			name: 'tag',
			labelI18n: 'Tag',
			placeholderI18n: 'context, database, agent',
		},
		{
			kind: 'text',
			name: 'owner',
			labelI18n: 'Owner',
			placeholderI18n: 'platform.context',
		},
		{
			kind: 'switch',
			name: 'snapshotOnly',
			labelI18n: 'Snapshots only',
		},
	],
	actions: [
		{
			key: 'search',
			labelI18n: 'Search',
			op: { name: 'context.pack.search', version: '1.0.0' },
		},
	],
	policy: {
		flags: [],
		pii: [],
	},
});
