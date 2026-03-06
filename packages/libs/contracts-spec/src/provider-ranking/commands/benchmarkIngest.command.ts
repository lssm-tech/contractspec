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
import { BenchmarkIngestedEvent } from '../events/benchmarkIngested.event';

const BenchmarkIngestInput = new SchemaModel({
  name: 'BenchmarkIngestInput',
  fields: {
    source: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    sourceUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    dimensions: { type: ScalarTypeEnum.String_unsecure(), isOptional: true, isArray: true },
    fromDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    toDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const BenchmarkIngestOutput = new SchemaModel({
  name: 'BenchmarkIngestOutput',
  fields: {
    ingestionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    source: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    resultsCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ingestedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const BenchmarkIngestCommand = defineCommand({
  meta: {
    key: 'provider-ranking.benchmark.ingest',
    title: 'Ingest Benchmark Data',
    version: '1.0.0',
    description:
      'Trigger ingestion of external benchmark data from a public source.',
    goal: 'Import and normalize benchmark scores from external leaderboards.',
    context:
      'Used by operators and scheduled jobs to keep ranking data current.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'ingest'],
    stability: PROVIDER_RANKING_STABILITY,
    docId: [docId('docs.tech.provider-ranking.benchmark.ingest')],
  },
  capability: {
    key: 'provider-ranking.system',
    version: '1.0.0',
  },
  io: {
    input: BenchmarkIngestInput,
    output: BenchmarkIngestOutput,
  },
  policy: {
    auth: 'user',
    pii: [],
  },
  sideEffects: {
    emits: [
      {
        ref: BenchmarkIngestedEvent.meta,
        when: 'External benchmark data is successfully ingested and stored.',
      },
    ],
  },
});
