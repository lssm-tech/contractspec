import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';

export const BenchmarkCustomCompletedPayload = new SchemaModel({
	name: 'BenchmarkCustomCompletedPayload',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		evalSuiteKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		resultsCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const BenchmarkCustomCompletedEvent = defineEvent({
	meta: {
		key: 'provider-ranking.benchmark.custom.completed',
		version: '1.0.0',
		description: 'Emitted when a custom benchmark run finishes.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'custom', 'eval'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.benchmark.custom.completed')],
	},
	capability: {
		key: 'provider-ranking.system',
		version: '1.0.0',
	},
	pii: [],
	payload: BenchmarkCustomCompletedPayload,
});
