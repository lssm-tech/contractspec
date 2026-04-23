import { describe, expect, it } from 'bun:test';
import type {
	EmailInboundProvider,
	EmailThread,
	EmbeddingDocument,
	EmbeddingProvider,
	EmbeddingResult,
	GetObjectResult,
	VectorDeleteRequest,
	VectorSearchQuery,
	VectorSearchResult,
	VectorStoreProvider,
	VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import { DocumentProcessor } from './document-processor';
import { EmbeddingService } from './embedding-service';
import { GmailIngestionAdapter } from './gmail-adapter';
import { StorageIngestionAdapter } from './storage-adapter';
import { VectorIndexer } from './vector-indexer';

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
			id: query,
			vector: [query.length],
			dimensions: 1,
			model: 'test-embed',
		};
	}
}

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

class FakeEmailInboundProvider implements EmailInboundProvider {
	lastQuery?: Parameters<EmailInboundProvider['listThreads']>[0];

	constructor(private readonly threads: EmailThread[]) {}

	async listThreads(
		query?: Parameters<EmailInboundProvider['listThreads']>[0]
	): Promise<EmailThread[]> {
		this.lastQuery = query;
		return this.threads;
	}

	async getThread(threadId: string): Promise<EmailThread | null> {
		return this.threads.find((thread) => thread.id === threadId) ?? null;
	}

	async listMessagesSince(): Promise<{ messages: []; nextPageToken?: string }> {
		return { messages: [] };
	}
}

function createIndexer(provider: FakeVectorStoreProvider): VectorIndexer {
	return new VectorIndexer(provider, {
		collection: 'knowledge-ingestion',
		namespace: 'tenant-acme',
	});
}

describe('knowledge ingestion adapters', () => {
	it('indexes storage objects with extracted text and storage metadata', async () => {
		const vectorStore = new FakeVectorStoreProvider();
		const adapter = new StorageIngestionAdapter(
			new DocumentProcessor(),
			new EmbeddingService(new FakeEmbeddingProvider()),
			createIndexer(vectorStore)
		);
		const object: GetObjectResult = {
			bucket: 'documents',
			key: 'invoice-2025-01.txt',
			contentType: 'text/plain',
			checksum: 'sha256-123',
			data: new TextEncoder().encode('Invoice #2025-01'),
		};

		await adapter.ingestObject(object);

		expect(vectorStore.lastUpsert?.documents[0]?.payload).toMatchObject({
			text: 'Invoice #2025-01',
			documentId: 'invoice-2025-01.txt',
			bucket: 'documents',
			checksum: 'sha256-123',
		});
	});

	it('indexes Gmail threads with formatted plain-text content', async () => {
		const vectorStore = new FakeVectorStoreProvider();
		const adapter = new GmailIngestionAdapter(
			new FakeEmailInboundProvider([
				{
					id: 'thread-1',
					subject: 'Payout failed',
					snippet: 'Need confirmation',
					participants: [{ email: 'ops@example.com' }],
					updatedAt: new Date('2025-01-02T12:00:00.000Z'),
					messages: [
						{
							id: 'message-1',
							threadId: 'thread-1',
							from: { email: 'ops@example.com', name: 'Ops' },
							to: [{ email: 'support@example.com' }],
							sentAt: new Date('2025-01-02T12:00:00.000Z'),
							htmlBody: '<p>The payout retried automatically.</p>',
						},
					],
				},
			]),
			new DocumentProcessor(),
			new EmbeddingService(new FakeEmbeddingProvider()),
			createIndexer(vectorStore)
		);

		await adapter.syncThreads();

		expect(vectorStore.lastUpsert?.documents[0]?.payload).toMatchObject({
			documentId: 'thread-1',
			subject: 'Payout failed',
			participants: 'ops@example.com',
		});
		expect(vectorStore.lastUpsert?.documents[0]?.payload?.text).toEqual(
			expect.stringContaining('The payout retried automatically.')
		);
	});

	it('throws when storage objects do not include data', async () => {
		const vectorStore = new FakeVectorStoreProvider();
		const adapter = new StorageIngestionAdapter(
			new DocumentProcessor(),
			new EmbeddingService(new FakeEmbeddingProvider()),
			createIndexer(vectorStore)
		);

		await expect(
			adapter.ingestObject({
				bucket: 'documents',
				key: 'missing.txt',
				contentType: 'text/plain',
				checksum: 'sha256-123',
			} as GetObjectResult)
		).rejects.toThrow('Storage ingestion requires object data');
	});

	it('prefers Gmail textBody, forwards sync query, and localizes labels', async () => {
		const vectorStore = new FakeVectorStoreProvider();
		const gmail = new FakeEmailInboundProvider([
			{
				id: 'thread-2',
				subject: 'Question produit',
				snippet: 'Bonjour',
				participants: [{ email: 'ops@example.com' }],
				updatedAt: new Date('2025-01-02T12:00:00.000Z'),
				messages: [
					{
						id: 'message-2',
						threadId: 'thread-2',
						from: { email: 'ops@example.com', name: 'Ops' },
						to: [{ email: 'support@example.com' }],
						sentAt: new Date('2025-01-02T12:00:00.000Z'),
						textBody: 'Texte brut préféré.',
						htmlBody: '<p>HTML ignoré</p>',
					},
				],
			},
		]);
		const adapter = new GmailIngestionAdapter(
			gmail,
			new DocumentProcessor(),
			new EmbeddingService(new FakeEmbeddingProvider()),
			createIndexer(vectorStore),
			'fr'
		);

		await adapter.syncThreads({
			label: 'support',
		});

		expect(gmail.lastQuery).toEqual({
			label: 'support',
		});
		expect(vectorStore.lastUpsert?.documents[0]?.payload?.text).toEqual(
			expect.stringContaining('Texte brut préféré.')
		);
		expect(vectorStore.lastUpsert?.documents[0]?.payload?.text).toEqual(
			expect.stringContaining('Objet : Question produit')
		);
	});
});
