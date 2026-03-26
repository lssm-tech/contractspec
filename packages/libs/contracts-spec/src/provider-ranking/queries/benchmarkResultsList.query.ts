import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docId } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineQuery } from '../../operations';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';

const BenchmarkResultsListInput = new SchemaModel({
	name: 'BenchmarkResultsListInput',
	fields: {
		source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		modelId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		dimension: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		providerKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const BenchmarkResultSummary = new SchemaModel({
	name: 'BenchmarkResultSummary',
	fields: {
		id: { type: ScalarTypeEnum.ID(), isOptional: false },
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		source: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		dimension: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		score: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
		measuredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		ingestedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

const BenchmarkResultsListOutput = new SchemaModel({
	name: 'BenchmarkResultsListOutput',
	fields: {
		results: { type: BenchmarkResultSummary, isOptional: false, isArray: true },
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const BenchmarkResultsListDocBlock = {
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
} satisfies DocBlock;

export const BenchmarkResultsListQuery = defineQuery({
	meta: {
		key: 'provider-ranking.benchmark.results.list',
		title: 'List Benchmark Results',
		version: '1.0.0',
		description:
			'List raw benchmark results with pagination, filterable by source, model, and dimension.',
		goal: 'Provide granular access to individual benchmark data points.',
		context: 'Used by Studio to drill into specific benchmark results.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'results'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.benchmark.results.list')],
	},
	capability: {
		key: 'provider-ranking.system',
		version: '1.0.0',
	},
	io: {
		input: BenchmarkResultsListInput,
		output: BenchmarkResultsListOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
