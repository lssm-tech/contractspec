import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import { docId } from '../../docs/registry';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';
import { BenchmarkCustomCompletedEvent } from '../events/benchmarkCustomCompleted.event';

const BenchmarkRunCustomInput = new SchemaModel({
	name: 'BenchmarkRunCustomInput',
	fields: {
		evalSuiteKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		parameters: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		maxConcurrency: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const BenchmarkRunCustomOutput = new SchemaModel({
	name: 'BenchmarkRunCustomOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		evalSuiteKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const BenchmarkRunCustomCommand = defineCommand({
	meta: {
		key: 'provider-ranking.benchmark.run-custom',
		title: 'Run Custom Benchmark',
		version: '1.0.0',
		description:
			'Launch a custom benchmark evaluation against a specific model.',
		goal: 'Evaluate model performance using internal eval suites.',
		context:
			'Used by operators to run proprietary benchmarks and compare models.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'custom', 'eval'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.benchmark.run-custom')],
	},
	capability: {
		key: 'provider-ranking.system',
		version: '1.0.0',
	},
	io: {
		input: BenchmarkRunCustomInput,
		output: BenchmarkRunCustomOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
	sideEffects: {
		emits: [
			{
				ref: BenchmarkCustomCompletedEvent.meta,
				when: 'Custom benchmark evaluation finishes execution.',
			},
		],
	},
});
