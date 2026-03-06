import { defineEntity, field, index } from '@contractspec/lib.schema';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

export const BenchmarkResultEntity = defineEntity({
  name: 'BenchmarkResult',
  description: 'Individual benchmark score for a model from a specific source.',
  schema: 'lssm_ranking',
  map: 'benchmark_result',
  fields: {
    id: field.id({ description: 'Benchmark result ID' }),
    modelId: field.string({ description: 'Model identifier' }),
    providerKey: field.string({ description: 'Provider key (e.g. openai, anthropic)' }),
    source: field.string({ description: 'Benchmark source (e.g. swe-bench, chatbot-arena)' }),
    dimension: field.string({ description: 'Ranking dimension (coding, reasoning, etc.)' }),
    score: field.float({ description: 'Normalized score 0-100' }),
    rawScore: field.json({ description: 'Original score from source' }),
    metadata: field.json({ isOptional: true }),
    measuredAt: field.dateTime({ description: 'When the benchmark was measured' }),
    ingestedAt: field.dateTime({ description: 'When the result was ingested' }),
  },
  indexes: [
    index.unique(['id']),
    index.on(['modelId']),
    index.on(['providerKey']),
    index.on(['source']),
    index.on(['dimension']),
    index.on(['modelId', 'source', 'dimension']),
  ],
});

export const ModelRankingEntity = defineEntity({
  name: 'ModelRanking',
  description: 'Computed composite ranking for a model.',
  schema: 'lssm_ranking',
  map: 'model_ranking',
  fields: {
    modelId: field.id({ description: 'Model identifier (primary key)' }),
    providerKey: field.string({ description: 'Provider key' }),
    compositeScore: field.float({ description: 'Weighted composite score 0-100' }),
    dimensionScores: field.json({ description: 'Per-dimension score breakdown' }),
    rank: field.int({ description: 'Current rank position' }),
    previousRank: field.int({ isOptional: true, description: 'Previous rank position' }),
    updatedAt: field.updatedAt(),
  },
  indexes: [
    index.on(['providerKey']),
    index.on(['rank']),
    index.on(['compositeScore']),
  ],
});

export const IngestionRunEntity = defineEntity({
  name: 'IngestionRun',
  description: 'Tracks a benchmark data ingestion run.',
  schema: 'lssm_ranking',
  map: 'ingestion_run',
  fields: {
    id: field.id({ description: 'Ingestion run ID' }),
    source: field.string({ description: 'Benchmark source' }),
    status: field.string({ description: 'Run status: pending, running, completed, failed' }),
    resultsCount: field.int({ description: 'Number of results ingested' }),
    startedAt: field.dateTime({ description: 'When the run started' }),
    completedAt: field.dateTime({ isOptional: true, description: 'When the run completed' }),
    error: field.string({ isOptional: true, description: 'Error message if failed' }),
  },
  indexes: [
    index.on(['source']),
    index.on(['status']),
    index.on(['startedAt']),
  ],
});

export const providerRankingEntities = [
  BenchmarkResultEntity,
  ModelRankingEntity,
  IngestionRunEntity,
];

export const providerRankingSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/module.provider-ranking',
  entities: providerRankingEntities,
};
