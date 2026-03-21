import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineFormSpec } from '../../forms/forms';
import { docId } from '../../docs/registry';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';

const BenchmarkRunCustomFormModel = new SchemaModel({
	name: 'BenchmarkRunCustomFormModel',
	fields: {
		evalSuiteKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		maxConcurrency: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const BenchmarkRunCustomForm = defineFormSpec({
	meta: {
		key: 'provider-ranking.benchmark.run-custom.form',
		title: 'Run Custom Benchmark',
		version: '1.0.0',
		description:
			'Form to launch a custom benchmark evaluation against a model.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'custom', 'eval'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.benchmark.run-custom.form')],
	},
	model: BenchmarkRunCustomFormModel,
	fields: [
		{
			kind: 'text',
			name: 'evalSuiteKey',
			labelI18n: 'Eval Suite',
			placeholderI18n: 'coding, reasoning, agentic...',
			required: true,
		},
		{
			kind: 'text',
			name: 'modelId',
			labelI18n: 'Model',
			placeholderI18n: 'claude-sonnet-4-6',
			required: true,
		},
		{
			kind: 'text',
			name: 'providerKey',
			labelI18n: 'Provider',
			placeholderI18n: 'anthropic, openai, mistral...',
			required: true,
		},
		{
			kind: 'text',
			name: 'maxConcurrency',
			labelI18n: 'Max Concurrency',
			placeholderI18n: '5',
		},
	],
	actions: [
		{
			key: 'run',
			labelI18n: 'Run benchmark',
			op: { name: 'provider-ranking.benchmark.run-custom', version: '1.0.0' },
		},
	],
	policy: {
		flags: [],
		pii: [],
	},
});
