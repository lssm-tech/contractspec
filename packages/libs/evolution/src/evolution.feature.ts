import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const EvolutionFeature = defineFeature({
	meta: {
		key: 'libs.evolution',
		version: '1.0.0',
		title: 'Evolution',
		description: 'AI-powered contract evolution engine',
		domain: 'evolution',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'evolution'],
		stability: 'experimental',
	},
});
