import type { KnowledgeSpaceSpec } from '@contractspec/lib.contracts-spec/knowledge/spec';
import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';

export const ProductCanonKnowledgeSpace: KnowledgeSpaceSpec = {
	meta: {
		key: 'knowledge.product-canon',
		version: '1.0.0',
		title: 'Product Canon Knowledge Space',
		description:
			'Canonical product knowledge space bound to agents and workflows for trusted retrieval.',
		domain: 'knowledge',
		category: 'canonical',
		owners: [OwnersEnum.PlatformContent],
		tags: ['knowledge', 'canon', TagsEnum.Guide],
		stability: StabilityEnum.Experimental,
	},
	retention: {
		ttlDays: null,
		archiveAfterDays: 365,
	},
	access: {
		trustLevel: 'high',
		automationWritable: false,
	},
	indexing: {
		embeddingModel: 'text-embedding-3-large',
		chunkSize: 1200,
		vectorDbIntegration: 'knowledge.vector.primary',
	},
	description:
		'Use this space for reviewed product canon content that agents may cite directly in answers.',
};
