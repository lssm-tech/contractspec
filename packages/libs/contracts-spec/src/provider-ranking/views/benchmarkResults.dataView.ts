import { defineDataView } from '../../data-views';
import type { DocBlock } from '../../docs/types';
import { docId } from '../../docs/registry';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';
import { BenchmarkResultsListQuery } from '../queries/benchmarkResultsList.query';

export const BenchmarkResultsDataViewDocBlock = {
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
} satisfies DocBlock;

export const BenchmarkResultsDataView = defineDataView({
	meta: {
		key: 'provider-ranking.benchmark.results.index',
		title: 'Benchmark Results',
		version: '1.0.0',
		description: 'Raw benchmark results from external and custom sources.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'results', 'index'],
		stability: PROVIDER_RANKING_STABILITY,
		entity: 'benchmark_result',
		docId: [docId('docs.tech.provider-ranking.benchmark.results.index')],
	},
	source: {
		primary: {
			key: BenchmarkResultsListQuery.meta.key,
			version: BenchmarkResultsListQuery.meta.version,
		},
	},
	view: {
		kind: 'list',
		fields: [
			{ key: 'id', label: 'ID', dataPath: 'id' },
			{ key: 'modelId', label: 'Model', dataPath: 'modelId' },
			{ key: 'providerKey', label: 'Provider', dataPath: 'providerKey' },
			{ key: 'source', label: 'Source', dataPath: 'source' },
			{ key: 'dimension', label: 'Dimension', dataPath: 'dimension' },
			{ key: 'score', label: 'Score', dataPath: 'score' },
			{ key: 'measuredAt', label: 'Measured', dataPath: 'measuredAt' },
			{ key: 'ingestedAt', label: 'Ingested', dataPath: 'ingestedAt' },
		],
		primaryField: 'id',
		secondaryFields: ['modelId', 'source', 'score'],
		filters: [
			{ key: 'source', label: 'Source', field: 'source', type: 'search' },
			{ key: 'modelId', label: 'Model', field: 'modelId', type: 'search' },
			{
				key: 'dimension',
				label: 'Dimension',
				field: 'dimension',
				type: 'search',
			},
			{
				key: 'providerKey',
				label: 'Provider',
				field: 'providerKey',
				type: 'search',
			},
		],
	},
	policy: {
		flags: [],
		pii: [],
	},
});
