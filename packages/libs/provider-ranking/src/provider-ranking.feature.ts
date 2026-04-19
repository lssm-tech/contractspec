import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProviderRankingFeature = defineFeature({
	meta: {
		key: 'libs.provider-ranking',
		version: '1.0.0',
		title: 'Provider Ranking',
		description:
			'AI provider ranking: benchmark ingestion, scoring, and model comparison',
		domain: 'provider-ranking',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'provider-ranking'],
		stability: 'experimental',
	},
});
