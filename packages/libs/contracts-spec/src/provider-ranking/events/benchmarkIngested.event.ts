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

export const BenchmarkIngestedPayload = new SchemaModel({
  name: 'BenchmarkIngestedPayload',
  fields: {
    ingestionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    source: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    resultsCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    ingestedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const BenchmarkIngestedEvent = defineEvent({
  meta: {
    key: 'provider-ranking.benchmark.ingested',
    version: '1.0.0',
    description: 'Emitted after external benchmark data is ingested.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'ingest'],
    stability: PROVIDER_RANKING_STABILITY,
    docId: [docId('docs.tech.provider-ranking.benchmark.ingested')],
  },
  capability: {
    key: 'provider-ranking.system',
    version: '1.0.0',
  },
  pii: [],
  payload: BenchmarkIngestedPayload,
});
