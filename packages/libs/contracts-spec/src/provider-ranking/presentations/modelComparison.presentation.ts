import { definePresentation } from '../../presentations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  PROVIDER_RANKING_DOMAIN,
  PROVIDER_RANKING_OWNERS,
  PROVIDER_RANKING_STABILITY,
  PROVIDER_RANKING_TAGS,
} from '../constants';

export const ModelComparisonPresentation = definePresentation({
  meta: {
    key: 'provider-ranking.model.comparison',
    title: 'Model Comparison',
    version: '1.0.0',
    description: 'Side-by-side comparison of AI model scores and capabilities.',
    goal: 'Enable informed model selection through visual comparison.',
    context: 'Used by Studio to compare two or more models across dimensions.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'comparison'],
    stability: PROVIDER_RANKING_STABILITY,
    docId: [docId('docs.tech.provider-ranking.model.comparison')],
  },
  capability: {
    key: 'provider-ranking.system',
    version: '1.0.0',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'modelComparison',
  },
  targets: ['react', 'markdown'],
});
