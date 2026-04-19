import { describe, expect, it } from 'bun:test';
import type {
	EmbeddingResult,
	VectorDeleteRequest,
	VectorSearchQuery,
	VectorSearchResult,
	VectorStoreProvider,
	VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import type { DocumentFragment } from './document-processor';
import { VectorIndexer } from './vector-indexer';

class FakeVectorStoreProvider implements VectorStoreProvider {
	lastUpsert?: VectorUpsertRequest;

	async upsert(request: VectorUpsertRequest): Promise<void> {
		this.lastUpsert = request;
	}

	async search(_query: VectorSearchQuery): Promise<VectorSearchResult[]> {
		return [];
	}

	async delete(_request: VectorDeleteRequest): Promise<void> {
		/* noop */
	}
}

describe('VectorIndexer', () => {
	it('stores fragment text alongside merged metadata and namespace', async () => {
		const provider = new FakeVectorStoreProvider();
		const indexer = new VectorIndexer(provider, {
			collection: 'knowledge-docs',
			namespace: 'tenant-acme',
			metadata: {
				tenantId: 'tenant-acme',
			},
		});

		const fragments: DocumentFragment[] = [
			{
				id: 'fragment-1',
				documentId: 'document-1',
				text: 'Rotate the API key in the dashboard settings.',
				metadata: {
					locale: 'en',
					sourceType: 'runbook',
				},
			},
		];
		const embeddings: EmbeddingResult[] = [
			{
				id: 'fragment-1',
				vector: [0.1, 0.2, 0.3],
				dimensions: 3,
				model: 'test-embed',
			},
		];

		await indexer.upsert(fragments, embeddings);

		expect(provider.lastUpsert?.collection).toBe('knowledge-docs');
		expect(provider.lastUpsert?.documents).toEqual([
			{
				id: 'fragment-1',
				vector: [0.1, 0.2, 0.3],
				namespace: 'tenant-acme',
				payload: {
					tenantId: 'tenant-acme',
					locale: 'en',
					sourceType: 'runbook',
					documentId: 'document-1',
					text: 'Rotate the API key in the dashboard settings.',
				},
			},
		]);
	});
});
