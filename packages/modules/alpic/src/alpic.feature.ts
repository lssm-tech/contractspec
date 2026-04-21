import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AlpicFeature = defineFeature({
	meta: {
		key: 'modules.alpic',
		version: '1.0.0',
		title: 'Alpic',
		description: 'Alpic MCP and ChatGPT App hosting helpers',
		domain: 'alpic',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'alpic'],
		stability: 'experimental',
	},
});
