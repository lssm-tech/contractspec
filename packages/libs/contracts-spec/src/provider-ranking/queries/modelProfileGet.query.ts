import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import { docId } from '../../docs/registry';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';

const ModelProfileGetInput = new SchemaModel({
	name: 'ModelProfileGetInput',
	fields: {
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
	},
});

const ModelProfileOutput = new SchemaModel({
	name: 'ModelProfileOutput',
	fields: {
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		displayName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		contextWindow: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		costPerMillionInput: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: true,
		},
		costPerMillionOutput: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: true,
		},
		capabilities: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
			isArray: true,
		},
		compositeScore: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
		rank: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		dimensionScores: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		benchmarkResultsCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: false,
		},
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const ModelProfileGetQuery = defineQuery({
	meta: {
		key: 'provider-ranking.model.profile.get',
		title: 'Get Model Profile',
		version: '1.0.0',
		description:
			'Get detailed profile for a single model including all scores, metadata, cost, and capabilities.',
		goal: 'Provide a comprehensive view of a single model for comparison.',
		context: 'Used by Studio model detail pages and comparison views.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'model', 'profile'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.model.profile.get')],
	},
	capability: {
		key: 'provider-ranking.system',
		version: '1.0.0',
	},
	io: {
		input: ModelProfileGetInput,
		output: ModelProfileOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
