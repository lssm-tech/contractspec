import { defineFeature } from '../features';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from './constants';

export const ProviderRankingFeature = defineFeature({
	meta: {
		key: 'platform.provider-ranking',
		version: '1.0.0',
		title: 'Provider Ranking',
		description:
			'Benchmark ingestion, custom benchmark runs, and AI model ranking with leaderboards',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS],
		stability: PROVIDER_RANKING_STABILITY,
	},

	operations: [
		{ key: 'provider-ranking.benchmark.ingest', version: '1.0.0' },
		{ key: 'provider-ranking.benchmark.run-custom', version: '1.0.0' },
		{ key: 'provider-ranking.ranking.refresh', version: '1.0.0' },
		{ key: 'provider-ranking.ranking.get', version: '1.0.0' },
		{ key: 'provider-ranking.benchmark.results.list', version: '1.0.0' },
		{ key: 'provider-ranking.model.profile.get', version: '1.0.0' },
	],

	events: [
		{ key: 'provider-ranking.benchmark.ingested', version: '1.0.0' },
		{ key: 'provider-ranking.benchmark.custom.completed', version: '1.0.0' },
		{ key: 'provider-ranking.ranking.updated', version: '1.0.0' },
	],

	presentations: [
		{ key: 'provider-ranking.model.comparison', version: '1.0.0' },
	],

	capabilities: {
		provides: [{ key: 'provider-ranking.system', version: '1.0.0' }],
	},

	dataViews: [
		{ key: 'provider-ranking.ranking.index', version: '1.0.0' },
		{ key: 'provider-ranking.benchmark.results.index', version: '1.0.0' },
	],

	forms: [
		{ key: 'provider-ranking.benchmark.ingest.form', version: '1.0.0' },
		{ key: 'provider-ranking.benchmark.run-custom.form', version: '1.0.0' },
	],
});
