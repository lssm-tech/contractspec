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

export const RankingUpdatedPayload = new SchemaModel({
	name: 'RankingUpdatedPayload',
	fields: {
		modelsRanked: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		topModelId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const RankingUpdatedEvent = defineEvent({
	meta: {
		key: 'provider-ranking.ranking.updated',
		version: '1.0.0',
		description: 'Emitted when composite rankings are recomputed.',
		domain: PROVIDER_RANKING_DOMAIN,
		owners: PROVIDER_RANKING_OWNERS,
		tags: [...PROVIDER_RANKING_TAGS, 'refresh'],
		stability: PROVIDER_RANKING_STABILITY,
		docId: [docId('docs.tech.provider-ranking.ranking.updated')],
	},
	capability: {
		key: 'provider-ranking.system',
		version: '1.0.0',
	},
	pii: [],
	payload: RankingUpdatedPayload,
});
