import { defineCapability } from '../../capabilities';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  PROVIDER_RANKING_DOMAIN,
  PROVIDER_RANKING_OWNERS,
  PROVIDER_RANKING_STABILITY,
  PROVIDER_RANKING_TAGS,
} from '../constants';

export const ProviderRankingCapability = defineCapability({
  meta: {
    key: 'provider-ranking.system',
    version: '1.0.0',
    kind: 'integration',
    title: 'AI Provider Ranking',
    description:
      'Benchmark ingestion, scoring, and ranking for AI providers and models.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'system'],
    stability: PROVIDER_RANKING_STABILITY,
    docId: [docId('docs.tech.provider-ranking.system')],
  },
  provides: [
    {
      surface: 'operation',
      key: 'provider-ranking.benchmark.ingest',
      version: '1.0.0',
      description: 'Trigger ingestion of external benchmark data.',
    },
    {
      surface: 'operation',
      key: 'provider-ranking.benchmark.run-custom',
      version: '1.0.0',
      description: 'Launch a custom benchmark evaluation against a model.',
    },
    {
      surface: 'operation',
      key: 'provider-ranking.ranking.refresh',
      version: '1.0.0',
      description: 'Recompute composite rankings from latest data.',
    },
    {
      surface: 'operation',
      key: 'provider-ranking.ranking.get',
      version: '1.0.0',
      description: 'Get ranked list of providers/models.',
    },
    {
      surface: 'operation',
      key: 'provider-ranking.benchmark.results.list',
      version: '1.0.0',
      description: 'List raw benchmark results.',
    },
    {
      surface: 'operation',
      key: 'provider-ranking.model.profile.get',
      version: '1.0.0',
      description: 'Get detailed model profile with scores.',
    },
    {
      surface: 'event',
      key: 'provider-ranking.benchmark.ingested',
      version: '1.0.0',
      description: 'External benchmark data ingested.',
    },
    {
      surface: 'event',
      key: 'provider-ranking.benchmark.custom.completed',
      version: '1.0.0',
      description: 'Custom benchmark run completed.',
    },
    {
      surface: 'event',
      key: 'provider-ranking.ranking.updated',
      version: '1.0.0',
      description: 'Composite rankings recomputed.',
    },
    {
      surface: 'presentation',
      key: 'provider-ranking.model.comparison',
      version: '1.0.0',
      description: 'Side-by-side model comparison view.',
    },
  ],
});
