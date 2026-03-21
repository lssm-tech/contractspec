import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';

export const tech_providerRanking_system_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.provider-ranking.system',
		title: 'AI Provider Ranking',
		summary:
			'Benchmark ingestion, scoring, and ranking for AI providers and models.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/system',
		tags: ['ai', 'ranking', 'benchmark'],
		body: `# AI Provider Ranking

Defines the core operations, events, and UI surfaces for ingesting benchmark data, computing composite rankings, and comparing AI models across dimensions (coding, reasoning, agentic, cost, latency, context, safety, custom).
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.ingest',
		title: 'Ingest benchmark data',
		summary: 'Trigger ingestion of external benchmark data.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/ingest',
		tags: ['ai', 'ranking', 'ingest'],
		body: `# provider-ranking.benchmark.ingest

Imports and normalizes benchmark scores from external leaderboards (Chatbot Arena, SWE-bench, Artificial Analysis, HuggingFace Open LLM Leaderboard).
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.ingest.form',
		title: 'Benchmark ingest form',
		summary: 'Form specification for triggering benchmark ingestion.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/ingest/form',
		tags: ['ai', 'ranking', 'form'],
		body: `# provider-ranking.benchmark.ingest.form

Form surface used by Studio to trigger benchmark data ingestion.
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.run-custom',
		title: 'Run custom benchmark',
		summary: 'Launch a custom benchmark evaluation against a model.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/run-custom',
		tags: ['ai', 'ranking', 'custom', 'eval'],
		body: `# provider-ranking.benchmark.run-custom

Evaluates model performance using internal eval suites with configurable parameters.
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.run-custom.form',
		title: 'Custom benchmark form',
		summary: 'Form specification for launching custom benchmarks.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/run-custom/form',
		tags: ['ai', 'ranking', 'form'],
		body: `# provider-ranking.benchmark.run-custom.form

Form surface used by Studio to launch custom benchmark evaluations.
`,
	},
	{
		id: 'docs.tech.provider-ranking.ranking.refresh',
		title: 'Refresh rankings',
		summary: 'Recompute composite rankings from latest benchmark data.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/ranking/refresh',
		tags: ['ai', 'ranking', 'refresh'],
		body: `# provider-ranking.ranking.refresh

Recomputes weighted composite scores across all dimensions and updates the leaderboard.
`,
	},
	{
		id: 'docs.tech.provider-ranking.ranking.get',
		title: 'Get provider rankings',
		summary: 'Get ranked list of providers/models.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/ranking/get',
		tags: ['ai', 'ranking', 'leaderboard'],
		body: `# provider-ranking.ranking.get

Returns a paginated, filterable leaderboard of AI models ranked by composite or per-dimension scores.
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.results.list',
		title: 'List benchmark results',
		summary: 'List raw benchmark results.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/results/list',
		tags: ['ai', 'ranking', 'results'],
		body: `# provider-ranking.benchmark.results.list

Returns individual benchmark data points filterable by source, model, and dimension.
`,
	},
	{
		id: 'docs.tech.provider-ranking.model.profile.get',
		title: 'Get model profile',
		summary: 'Get detailed profile for a single model.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/model/profile/get',
		tags: ['ai', 'ranking', 'model', 'profile'],
		body: `# provider-ranking.model.profile.get

Returns comprehensive model information including all scores, metadata, cost, context window, and capabilities.
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.ingested',
		title: 'Benchmark ingested event',
		summary: 'Emitted after external benchmark data is ingested.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/ingested',
		tags: ['ai', 'ranking', 'event'],
		body: `# provider-ranking.benchmark.ingested

Emitted when external benchmark data is successfully imported and stored.
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.custom.completed',
		title: 'Custom benchmark completed event',
		summary: 'Emitted when a custom benchmark run finishes.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/custom/completed',
		tags: ['ai', 'ranking', 'event', 'custom'],
		body: `# provider-ranking.benchmark.custom.completed

Emitted when a custom evaluation run completes execution.
`,
	},
	{
		id: 'docs.tech.provider-ranking.ranking.updated',
		title: 'Ranking updated event',
		summary: 'Emitted when composite rankings are recomputed.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/ranking/updated',
		tags: ['ai', 'ranking', 'event'],
		body: `# provider-ranking.ranking.updated

Emitted when the leaderboard is refreshed with new composite scores.
`,
	},
	{
		id: 'docs.tech.provider-ranking.ranking.index',
		title: 'Provider rankings view',
		summary: 'Data view for the model leaderboard.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/ranking/index',
		tags: ['ai', 'ranking', 'data-view'],
		body: `# provider-ranking.ranking.index

List view over ranked models with composite and per-dimension scores.
`,
	},
	{
		id: 'docs.tech.provider-ranking.benchmark.results.index',
		title: 'Benchmark results view',
		summary: 'Data view for raw benchmark results.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/benchmark/results/index',
		tags: ['ai', 'ranking', 'data-view'],
		body: `# provider-ranking.benchmark.results.index

List view over individual benchmark data points from all sources.
`,
	},
	{
		id: 'docs.tech.provider-ranking.model.comparison',
		title: 'Model comparison presentation',
		summary: 'Presentation spec for side-by-side model comparison.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/provider-ranking/model/comparison',
		tags: ['ai', 'ranking', 'presentation', 'comparison'],
		body: `# provider-ranking.model.comparison

Presentation surface for comparing two or more models across all ranking dimensions.
`,
	},
];

