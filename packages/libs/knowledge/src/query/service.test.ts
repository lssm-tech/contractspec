import { describe, expect, it } from 'bun:test';
import type {
	EmbeddingDocument,
	EmbeddingProvider,
	EmbeddingResult,
	LLMChatOptions,
	LLMMessage,
	LLMResponse,
	LLMStreamChunk,
	TokenCountResult,
	VectorDeleteRequest,
	VectorSearchQuery,
	VectorSearchResult,
	VectorStoreProvider,
	VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import { KnowledgeQueryService } from './service';

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

class FakeLLMProvider {
	lastMessages?: LLMMessage[];

	async chat(
		messages: LLMMessage[],
		_options?: LLMChatOptions
	): Promise<LLMResponse> {
		this.lastMessages = messages;
		return {
			message: {
				role: 'assistant',
				content: [{ type: 'text', text: 'Use the indexed invoice context.' }],
			},
			usage: {
				promptTokens: 12,
				completionTokens: 7,
				totalTokens: 19,
			},
		};
	}

	async *stream(): AsyncIterable<LLMStreamChunk> {
		yield {
			type: 'end',
			response: {
				message: { role: 'assistant', content: [] },
			},
		};
	}

	async countTokens(_messages: LLMMessage[]): Promise<TokenCountResult> {
		return { promptTokens: 0 };
	}
}

describe('KnowledgeQueryService', () => {
	it('builds prompt context from indexed text payloads', async () => {
		const llm = new FakeLLMProvider();
		const vectorStore = new FakeVectorStoreProvider([
			{
				id: 'fragment-1',
				score: 0.95,
				payload: {
					text: 'Invoice #2025-01 is due on 2025-02-05.',
				},
			},
		]);
		const queryService = new KnowledgeQueryService(
			new FakeEmbeddingProvider(),
			vectorStore,
			llm,
			{
				collection: 'tenant.family-office',
			}
		);

		const answer = await queryService.query(
			'What invoices are due next week?',
			{
				topK: 2,
				namespace: 'tenant-acme',
				filter: { locale: 'en' },
			}
		);

		expect(answer.answer).toBe('Use the indexed invoice context.');
		expect(vectorStore.lastSearch).toMatchObject({
			topK: 2,
			namespace: 'tenant-acme',
			filter: { locale: 'en' },
		});
		expect(answer.references).toEqual([
			{
				id: 'fragment-1',
				score: 0.95,
				payload: {
					text: 'Invoice #2025-01 is due on 2025-02-05.',
				},
				text: 'Invoice #2025-01 is due on 2025-02-05.',
			},
		]);
		expect(llm.lastMessages?.[1]?.content[0]).toEqual({
			type: 'text',
			text: expect.stringContaining('Invoice #2025-01 is due on 2025-02-05.'),
		});
	});

	it('supports per-query prompt and locale overrides', async () => {
		const llm = new FakeLLMProvider();
		const queryService = new KnowledgeQueryService(
			new FakeEmbeddingProvider(),
			new FakeVectorStoreProvider([]),
			llm,
			{
				collection: 'tenant.family-office',
				systemPrompt: 'Default prompt',
			}
		);

		await queryService.query('Question test', {
			systemPrompt: 'Custom prompt',
			locale: 'fr',
		});

		expect(llm.lastMessages?.[0]?.content[0]).toEqual({
			type: 'text',
			text: 'Custom prompt',
		});
		expect(llm.lastMessages?.[1]?.content[0]).toEqual({
			type: 'text',
			text: expect.stringContaining('Question :\nQuestion test'),
		});
	});

	it('uses a deterministic no-results context message', async () => {
		const llm = new FakeLLMProvider();
		const queryService = new KnowledgeQueryService(
			new FakeEmbeddingProvider(),
			new FakeVectorStoreProvider([]),
			llm,
			{
				collection: 'tenant.family-office',
			}
		);

		const answer = await queryService.query('What invoices are due next week?');

		expect(answer.references).toEqual([]);
		expect(llm.lastMessages?.[1]?.content[0]).toEqual({
			type: 'text',
			text: expect.stringContaining('No relevant documents found.'),
		});
	});

	it('falls back to payload.content when payload.text is absent', async () => {
		const llm = new FakeLLMProvider();
		const queryService = new KnowledgeQueryService(
			new FakeEmbeddingProvider(),
			new FakeVectorStoreProvider([
				{
					id: 'legacy-fragment',
					score: 0.87,
					payload: {
						content: 'Legacy content remains searchable.',
					},
				},
			]),
			llm,
			{
				collection: 'tenant.family-office',
			}
		);

		const answer = await queryService.query('legacy?');

		expect(answer.references[0]?.text).toBe(
			'Legacy content remains searchable.'
		);
	});
});
