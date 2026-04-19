import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AiProvidersFeature = defineFeature({
	meta: {
		key: 'libs.ai-providers',
		version: '1.0.0',
		title: 'Ai Providers',
		description: 'Unified AI provider abstraction layer',
		domain: 'ai-providers',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'ai-providers'],
		stability: 'experimental',
	},
});
