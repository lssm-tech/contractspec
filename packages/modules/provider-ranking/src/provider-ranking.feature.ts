import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProviderRankingFeature = defineFeature({
	meta: {
		key: 'modules.provider-ranking',
		version: '1.0.0',
		title: 'Provider Ranking',
		description:
			'AI provider ranking module with persistence and pipeline orchestration',
		domain: 'provider-ranking',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'provider-ranking'],
		stability: 'experimental',
	},
});
