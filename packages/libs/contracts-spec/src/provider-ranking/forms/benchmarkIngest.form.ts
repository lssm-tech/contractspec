import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineFormSpec } from '../../forms/forms';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  PROVIDER_RANKING_DOMAIN,
  PROVIDER_RANKING_OWNERS,
  PROVIDER_RANKING_STABILITY,
  PROVIDER_RANKING_TAGS,
} from '../constants';

const BenchmarkIngestFormModel = new SchemaModel({
  name: 'BenchmarkIngestFormModel',
  fields: {
    source: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    sourceUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    fromDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    toDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const BenchmarkIngestForm = defineFormSpec({
  meta: {
    key: 'provider-ranking.benchmark.ingest.form',
    title: 'Ingest Benchmark Data',
    version: '1.0.0',
    description: 'Form to trigger benchmark data ingestion from external sources.',
    domain: PROVIDER_RANKING_DOMAIN,
    owners: PROVIDER_RANKING_OWNERS,
    tags: [...PROVIDER_RANKING_TAGS, 'ingest'],
    stability: PROVIDER_RANKING_STABILITY,
    docId: [docId('docs.tech.provider-ranking.benchmark.ingest.form')],
  },
  model: BenchmarkIngestFormModel,
  fields: [
    {
      kind: 'text',
      name: 'source',
      labelI18n: 'Source',
      placeholderI18n: 'chatbot-arena, swe-bench, artificial-analysis...',
      required: true,
    },
    {
      kind: 'text',
      name: 'sourceUrl',
      labelI18n: 'Source URL',
      placeholderI18n: 'https://...',
    },
    {
      kind: 'text',
      name: 'fromDate',
      labelI18n: 'From Date',
      placeholderI18n: 'YYYY-MM-DD',
    },
    {
      kind: 'text',
      name: 'toDate',
      labelI18n: 'To Date',
      placeholderI18n: 'YYYY-MM-DD',
    },
  ],
  actions: [
    {
      key: 'ingest',
      labelI18n: 'Start ingestion',
      op: { name: 'provider-ranking.benchmark.ingest', version: '1.0.0' },
    },
  ],
  policy: {
    flags: [],
    pii: [],
  },
});
