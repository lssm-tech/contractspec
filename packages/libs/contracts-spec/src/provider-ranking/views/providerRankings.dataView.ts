import { defineDataView } from '../../data-views';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  PROVIDER_RANKING_DOMAIN,
  PROVIDER_RANKING_OWNERS,
  PROVIDER_RANKING_STABILITY,
  PROVIDER_RANKING_TAGS,
} from '../constants';
import { ProviderRankingGetQuery } from '../queries/providerRankingGet.query';

export const ProviderRankingsDataView = defineDataView({
  meta: {
    key: 'provider-ranking.ranking.index',
    title: 'Provider Rankings',
    version: '1.0.0',
    description: 'Ranked leaderboard of AI models with composite and per-dimension scores.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'leaderboard', 'index'],
    stability: PROVIDER_RANKING_STABILITY,
    entity: 'model_ranking',
    docId: [docId('docs.tech.provider-ranking.ranking.index')],
  },
  source: {
    primary: {
      key: ProviderRankingGetQuery.meta.key,
      version: ProviderRankingGetQuery.meta.version,
    },
  },
  view: {
    kind: 'list',
    fields: [
      { key: 'rank', label: 'Rank', dataPath: 'rank' },
      { key: 'modelId', label: 'Model', dataPath: 'modelId' },
      { key: 'providerKey', label: 'Provider', dataPath: 'providerKey' },
      { key: 'compositeScore', label: 'Score', dataPath: 'compositeScore' },
      { key: 'previousRank', label: 'Prev. Rank', dataPath: 'previousRank' },
      { key: 'updatedAt', label: 'Updated', dataPath: 'updatedAt' },
    ],
    primaryField: 'rank',
    secondaryFields: ['modelId', 'providerKey', 'compositeScore'],
    filters: [
      { key: 'dimension', label: 'Dimension', field: 'dimension', type: 'search' },
      { key: 'providerKey', label: 'Provider', field: 'providerKey', type: 'search' },
    ],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
