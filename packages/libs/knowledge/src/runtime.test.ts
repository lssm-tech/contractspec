import { describe, expect, it } from 'bun:test';
import type {
	EmbeddingDocument,
	EmbeddingProvider,
	EmbeddingResult,
	LLMChatOptions,
	LLMMessage,
	LLMProvider,
	LLMResponse,
	LLMStreamChunk,
	TokenCountResult,
	VectorDeleteRequest,
	VectorSearchQuery,
	VectorSearchResult,
	VectorStoreProvider,
	VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import { createKnowledgeRuntime } from './runtime';

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

class InMemoryVectorStore implements VectorStoreProvider {
	private readonly documents: VectorUpsertRequest['documents'] = [];

	async upsert(request: VectorUpsertRequest): Promise<void> {
		this.documents.splice(0, this.documents.length, ...request.documents);
	}

	async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
		return this.documents
			.filter((document) => document.namespace === query.namespace)
			.map((document) => ({
				id: document.id,
				score: 0.9,
				payload: document.payload,
			}));
	}

	async delete(_request: VectorDeleteRequest): Promise<void> {
		/* noop */
	}
}

class FakeLLMProvider implements LLMProvider {
	async chat(
		messages: LLMMessage[],
		_options?: LLMChatOptions
	): Promise<LLMResponse> {
		const prompt = messages[1]?.content[0];
		return {
			message: {
				role: 'assistant',
				content: [
					{
						type: 'text',
						text:
							prompt && 'text' in prompt
								? `Answering with context: ${prompt.text}`
								: 'Answering with context:',
					},
				],
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

describe('KnowledgeRuntime', () => {
	it('provides an end-to-end ingest/retrieve/query helper path', async () => {
		const runtime = createKnowledgeRuntime({
			collection: 'knowledge-support',
			namespace: 'tenant-acme',
			spaceKey: 'support',
			embeddings: new FakeEmbeddingProvider(),
			vectorStore: new InMemoryVectorStore(),
			llm: new FakeLLMProvider(),
		});

		await runtime.ingestDocument({
			id: 'doc-1',
			mimeType: 'text/plain',
			data: new TextEncoder().encode('Rotate the key from Settings > API.'),
			metadata: {
				locale: 'en',
			},
		});

		const results = await runtime.retrieve('rotate', {
			spaceKey: 'support',
			tenantId: 'tenant-acme',
			locale: 'en',
		});
		const answer = await runtime.query('How do I rotate a key?', {
			namespace: 'tenant-acme',
		});

		expect(results[0]?.content).toContain('Rotate the key');
		expect(answer.answer).toContain('Rotate the key');
	});
});
