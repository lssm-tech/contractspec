import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  PROVIDER_RANKING_DOMAIN,
  PROVIDER_RANKING_OWNERS,
  PROVIDER_RANKING_STABILITY,
  PROVIDER_RANKING_TAGS,
} from '../constants';
import { RankingUpdatedEvent } from '../events/rankingUpdated.event';

const RankingRefreshInput = new SchemaModel({
  name: 'RankingRefreshInput',
  fields: {
    dimensions: { type: ScalarTypeEnum.String_unsecure(), isOptional: true, isArray: true },
    weightOverrides: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    forceRecalculate: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const RankingRefreshOutput = new SchemaModel({
  name: 'RankingRefreshOutput',
  fields: {
    modelsRanked: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const RankingRefreshCommand = defineCommand({
  meta: {
    key: 'provider-ranking.ranking.refresh',
    title: 'Refresh Rankings',
    version: '1.0.0',
    description: 'Recompute composite rankings from latest benchmark data.',
    goal: 'Keep the leaderboard current after new benchmark data arrives.',
    context:
      'Triggered after ingestion or on a schedule to update model rankings.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'refresh'],
    stability: PROVIDER_RANKING_STABILITY,
    docId: [docId('docs.tech.provider-ranking.ranking.refresh')],
  },
  capability: {
    key: 'provider-ranking.system',
    version: '1.0.0',
  },
  io: {
    input: RankingRefreshInput,
    output: RankingRefreshOutput,
  },
  policy: {
    auth: 'user',
    pii: [],
  },
  sideEffects: {
    emits: [
      {
        ref: RankingUpdatedEvent.meta,
        when: 'Composite rankings are successfully recomputed.',
      },
    ],
  },
});
