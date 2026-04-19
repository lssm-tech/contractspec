import { describe, expect, it } from 'bun:test';
import type {
	EmbeddingDocument,
	EmbeddingProvider,
	EmbeddingResult,
	VectorDeleteRequest,
	VectorSearchQuery,
	VectorSearchResult,
	VectorStoreProvider,
	VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import { createVectorRetriever } from './vector-retriever';

class FakeEmbeddingProvider implements EmbeddingProvider {
	async embedDocuments(
		documents: EmbeddingDocument[]
	): Promise<EmbeddingResult[]> {
		return documents.map((document) => ({
			id: document.id,
			vector: [document.text.length],
			dimensions: 1,
			model: 'test-embed',
		}));
	}

	async embedQuery(query: string): Promise<EmbeddingResult> {
		return {
			id: 'query',
			vector: [query.length],
			dimensions: 1,
			model: 'test-embed',
		};
	}
}

class FakeVectorStoreProvider implements VectorStoreProvider {
	lastSearch?: VectorSearchQuery;

	constructor(private readonly results: VectorSearchResult[]) {}

	async upsert(_request: VectorUpsertRequest): Promise<void> {
		/* noop */
	}

	async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
		this.lastSearch = query;
		return this.results;
	}

	async delete(_request: VectorDeleteRequest): Promise<void> {
		/* noop */
	}
}

describe('VectorRetriever', () => {
	it('returns readable text from canonical payloads and applies filters', async () => {
		const vectorStore = new FakeVectorStoreProvider([
			{
				id: 'doc-1',
				score: 0.92,
				payload: {
					text: 'Rotate the key from Settings > API.',
					locale: 'en',
				},
			},
			{
				id: 'doc-2',
				score: 0.12,
				payload: {
					text: 'Stale result',
				},
			},
		]);
		const retriever = createVectorRetriever({
			embeddings: new FakeEmbeddingProvider(),
			vectorStore,
			spaceCollections: {
				'product-canon': 'knowledge-product-canon',
			},
			defaultTopK: 3,
			defaultMinScore: 0.4,
		});

		const results = await retriever.retrieve('rotate key', {
			spaceKey: 'product-canon',
			tenantId: 'tenant-acme',
			filter: {
				locale: 'en',
			},
		});

		expect(vectorStore.lastSearch).toMatchObject({
			collection: 'knowledge-product-canon',
			topK: 3,
			namespace: 'tenant-acme',
			filter: {
				locale: 'en',
			},
		});
		expect(results).toEqual([
			{
				content: 'Rotate the key from Settings > API.',
				source: 'doc-1',
				score: 0.92,
				metadata: {
					text: 'Rotate the key from Settings > API.',
					locale: 'en',
				},
			},
		]);
	});

	it('keeps compatibility with legacy content payloads and unknown spaces', async () => {
		const retriever = createVectorRetriever({
			embeddings: new FakeEmbeddingProvider(),
			vectorStore: new FakeVectorStoreProvider([
				{
					id: 'doc-legacy',
					score: 0.81,
					payload: {
						content: 'Legacy payload support remains available.',
					},
				},
			]),
			spaceCollections: {
				support: 'knowledge-support',
			},
		});

		expect(
			await retriever.retrieve('legacy', {
				spaceKey: 'support',
			})
		).toEqual([
			{
				content: 'Legacy payload support remains available.',
				source: 'doc-legacy',
				score: 0.81,
				metadata: {
					content: 'Legacy payload support remains available.',
				},
			},
		]);
		expect(
			await retriever.retrieve('missing', {
				spaceKey: 'unknown',
			})
		).toEqual([]);
	});
});
