import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const KnowledgeFeature = defineFeature({
	meta: {
		key: 'libs.knowledge',
		version: '1.0.0',
		title: 'Knowledge',
		description: 'RAG and knowledge base primitives',
		domain: 'knowledge',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'knowledge'],
		stability: 'experimental',
	},
});
