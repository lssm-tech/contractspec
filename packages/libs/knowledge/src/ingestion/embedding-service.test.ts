import { describe, expect, it } from 'bun:test';
import type {
	EmbeddingDocument,
	EmbeddingProvider,
	EmbeddingResult,
} from '@contractspec/lib.contracts-integrations';
import { EmbeddingService } from './embedding-service';

class RecordingEmbeddingProvider implements EmbeddingProvider {
	readonly calls: EmbeddingDocument[][] = [];

	async embedDocuments(
		documents: EmbeddingDocument[]
	): Promise<EmbeddingResult[]> {
		this.calls.push(documents);
		return documents.map((document, index) => ({
			id: document.id,
			vector: [index, document.text.length],
			dimensions: 2,
			model: 'test-embed',
		}));
	}

	async embedQuery(query: string): Promise<EmbeddingResult> {
		return {
			id: query,
			vector: [query.length],
			dimensions: 1,
			model: 'test-embed',
		};
	}
}

describe('EmbeddingService', () => {
	it('batches fragments and preserves ordering/metadata', async () => {
		const provider = new RecordingEmbeddingProvider();
		const service = new EmbeddingService(provider, 2);
		const fragments = [
			{ id: 'f1', documentId: 'd1', text: 'one', metadata: { a: '1' } },
			{ id: 'f2', documentId: 'd1', text: 'two', metadata: { a: '2' } },
			{ id: 'f3', documentId: 'd2', text: 'three', metadata: { a: '3' } },
		];

		const results = await service.embedFragments(fragments);

		expect(provider.calls).toHaveLength(2);
		expect(provider.calls[0]).toEqual([
			{ id: 'f1', text: 'one', metadata: { a: '1' } },
			{ id: 'f2', text: 'two', metadata: { a: '2' } },
		]);
		expect(provider.calls[1]).toEqual([
			{ id: 'f3', text: 'three', metadata: { a: '3' } },
		]);
		expect(results.map((result) => result.id)).toEqual(['f1', 'f2', 'f3']);
	});

	it('returns an empty array for empty input', async () => {
		const provider = new RecordingEmbeddingProvider();
		const service = new EmbeddingService(provider);

		await expect(service.embedFragments([])).resolves.toEqual([]);
		expect(provider.calls).toEqual([]);
	});
});
