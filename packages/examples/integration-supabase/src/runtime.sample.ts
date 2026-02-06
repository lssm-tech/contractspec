import type { VectorSearchResult } from '@contractspec/integration.providers-impls/vector-store';
import { IntegrationProviderFactory } from '@contractspec/integration.providers-impls/impls/provider-factory';
import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';

export interface SupabaseKnowledgeRuntimeParams {
  vectorContext: IntegrationContext;
  databaseContext: IntegrationContext;
}

export interface SupabaseKnowledgeRuntimeResult {
  matches: VectorSearchResult[];
  indexedDocumentCount: number;
}

export async function runSupabaseKnowledgeRuntime(
  params: SupabaseKnowledgeRuntimeParams
): Promise<SupabaseKnowledgeRuntimeResult> {
  const factory = new IntegrationProviderFactory();

  const vectorStore = await factory.createVectorStoreProvider(
    params.vectorContext
  );
  const database = await factory.createDatabaseProvider(params.databaseContext);

  await vectorStore.upsert({
    collection: 'knowledge_chunks',
    documents: [
      {
        id: 'chunk-1',
        vector: [0.11, 0.23, 0.45],
        payload: { source: 'faq', locale: 'en' },
      },
    ],
  });

  const matches = await vectorStore.search({
    collection: 'knowledge_chunks',
    vector: [0.12, 0.22, 0.44],
    topK: 5,
    filter: { source: 'faq' },
  });

  const count = await database.query<{ total: number }>(
    'SELECT COUNT(*)::int AS total FROM knowledge_chunks;'
  );

  await database.close();

  return {
    matches,
    indexedDocumentCount: count.rows[0]?.total ?? 0,
  };
}
