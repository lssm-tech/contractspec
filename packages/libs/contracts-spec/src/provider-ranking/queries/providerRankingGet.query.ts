import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import { docId } from '../../docs/registry';
import {
	PROVIDER_RANKING_DOMAIN,
	PROVIDER_RANKING_OWNERS,
	PROVIDER_RANKING_STABILITY,
	PROVIDER_RANKING_TAGS,
} from '../constants';

const ProviderRankingGetInput = new SchemaModel({
	name: 'ProviderRankingGetInput',
	fields: {
		dimension: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		providerKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const _DimensionScoreModel = new SchemaModel({
	name: 'DimensionScoreModel',
	fields: {
		score: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
		confidence: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
		sources: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
			isArray: true,
		},
	},
});

const RankedModelSummary = new SchemaModel({
	name: 'RankedModelSummary',
	fields: {
		modelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		compositeScore: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		rank: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		previousRank: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		dimensionScores: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

const ProviderRankingGetOutput = new SchemaModel({
	name: 'ProviderRankingGetOutput',
	fields: {
		rankings: { type: RankedModelSummary, isOptional: false, isArray: true },
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const ProviderRankingGetQuery = defineQuery({
	meta: {
		key: 'provider-ranking.ranking.get',
		title: 'Get Provider Rankings',
		version: '1.0.0',
		description:
			'Get ranked list of providers/models with composite scores, filterable by dimension.',
		goal: 'Provide a leaderboard view of AI model performance.',
		context: 'Used by Studio and API clients to compare model rankings.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'leaderboard'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.ranking.get')],
	},
	capability: {
		key: 'provider-ranking.system',
		version: '1.0.0',
	},
	io: {
		input: ProviderRankingGetInput,
		output: ProviderRankingGetOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
