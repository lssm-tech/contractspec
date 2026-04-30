import { describe, expect, it } from 'bun:test';
import type {
	EmailInboundProvider,
	EmailThread,
	EmbeddingDocument,
	EmbeddingProvider,
	EmbeddingResult,
	GoogleDriveFile,
	GoogleDriveListFilesQuery,
	GoogleDriveListFilesResult,
	GoogleDriveProvider,
	GoogleDriveWatchInput,
	GoogleDriveWatchResult,
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
import {
	createKnowledgeRuntime,
	type KnowledgeProviderDeltaCheckpoint,
	type KnowledgeProviderDeltaCheckpointKey,
	type KnowledgeProviderDeltaCheckpointStore,
} from './runtime';

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

class FakeDriveProvider implements GoogleDriveProvider {
	lastQuery?: GoogleDriveListFilesQuery;
	lastWatchInput?: GoogleDriveWatchInput;

	constructor(private readonly files: GoogleDriveFile[]) {}

	async listFiles(
		query?: GoogleDriveListFilesQuery
	): Promise<GoogleDriveListFilesResult> {
		this.lastQuery = query;
		return {
			files: this.files,
			delta: {
				cursor: {
					cursor: 'drive-cursor-2',
					watermarkVersion: 'v2',
				},
				webhookChannel: {
					channelId: 'channel-1',
					resourceId: 'resource-1',
					expiresAt: '2025-02-05T10:00:00.000Z',
				},
			},
		};
	}

	async getFile(fileId: string): Promise<GoogleDriveFile | null> {
		return this.files.find((file) => file.id === fileId) ?? null;
	}

	async watchChanges(
		input: GoogleDriveWatchInput
	): Promise<GoogleDriveWatchResult> {
		this.lastWatchInput = input;
		return {
			delta: {
				webhookChannel: {
					channelId: input.channelId,
					resourceId: 'watched-resource',
					expiresAt: '2025-02-05T11:00:00.000Z',
				},
				cursor: {
					cursor: 'drive-watch-cursor-2',
					watermarkVersion: 'watch-v2',
				},
			},
		};
	}
}

class InMemoryDeltaCheckpointStore
	implements KnowledgeProviderDeltaCheckpointStore
{
	readonly saved: KnowledgeProviderDeltaCheckpoint[] = [];
	private readonly checkpoints = new Map<
		string,
		KnowledgeProviderDeltaCheckpoint
	>();

	constructor(initial: KnowledgeProviderDeltaCheckpoint[] = []) {
		for (const checkpoint of initial) {
			this.checkpoints.set(this.key(checkpoint), checkpoint);
		}
	}

	async load(
		key: KnowledgeProviderDeltaCheckpointKey
	): Promise<KnowledgeProviderDeltaCheckpoint['delta'] | undefined> {
		return this.checkpoints.get(this.key(key))?.delta;
	}

	async save(checkpoint: KnowledgeProviderDeltaCheckpoint): Promise<void> {
		this.saved.push(checkpoint);
		this.checkpoints.set(this.key(checkpoint), checkpoint);
	}

	private key(key: KnowledgeProviderDeltaCheckpointKey): string {
		return `${key.providerKey}:${key.sourceId}`;
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

	it('orchestrates Gmail and Drive sync helpers', async () => {
		const vectorStore = new InMemoryVectorStore();
		const gmail = new FakeEmailInboundProvider([
			{
				id: 'thread-1',
				subject: 'Billing update',
				snippet: 'Invoice moved',
				participants: [{ email: 'billing@example.com' }],
				updatedAt: new Date('2025-02-05T09:00:00.000Z'),
				messages: [
					{
						id: 'message-1',
						threadId: 'thread-1',
						from: { email: 'billing@example.com' },
						to: [{ email: 'ops@example.com' }],
						sentAt: new Date('2025-02-05T09:00:00.000Z'),
						textBody: 'The invoice was moved to Drive.',
					},
				],
				delta: {
					cursor: {
						cursor: 'gmail-history-2',
						watermarkVersion: 'gmail-v2',
					},
				},
			},
		]);
		const drive = new FakeDriveProvider([
			{
				id: 'drive-file-1',
				name: 'Billing runbook.txt',
				mimeType: 'text/plain',
				data: new TextEncoder().encode('Drive billing runbook.'),
				delta: {
					providerEventId: 'event-1',
					dedupeKey: 'drive-file-1:v1',
					idempotencyKey: 'drive-sync-1',
				},
			},
		]);
		const checkpoints = new InMemoryDeltaCheckpointStore([
			{
				providerKey: 'email.gmail',
				sourceId: 'gmail-support',
				delta: {
					cursor: {
						cursor: 'gmail-history-1',
						watermarkVersion: 'gmail-v1',
					},
				},
			},
			{
				providerKey: 'storage.google-drive',
				sourceId: 'drive-support',
				delta: {
					cursor: {
						cursor: 'drive-cursor-1',
						watermarkVersion: 'drive-v1',
					},
				},
			},
		]);
		const runtime = createKnowledgeRuntime({
			collection: 'knowledge-sync',
			namespace: 'tenant-acme',
			spaceKey: 'support',
			embeddings: new FakeEmbeddingProvider(),
			vectorStore,
			gmail,
			drive,
			deltaCheckpointStore: checkpoints,
		});

		const gmailResult = await runtime.syncGmail(undefined, {
			sourceId: 'gmail-support',
		});
		const driveResult = await runtime.syncDriveFiles(undefined, {
			sourceId: 'drive-support',
		});
		const results = await runtime.retrieve('billing', {
			spaceKey: 'support',
			tenantId: 'tenant-acme',
		});

		expect(gmailResult).toMatchObject({ threadsIndexed: 1 });
		expect(gmail.lastQuery?.delta?.cursor?.watermarkVersion).toBe('gmail-v1');
		expect(gmailResult.delta?.cursor?.watermarkVersion).toBe('gmail-v2');
		expect(driveResult).toMatchObject({
			filesSeen: 1,
			filesIndexed: 1,
			filesSkipped: 0,
		});
		expect(drive.lastQuery?.delta?.cursor?.watermarkVersion).toBe('drive-v1');
		expect(driveResult.delta?.webhookChannel?.expiresAt).toBe(
			'2025-02-05T10:00:00.000Z'
		);
		expect(checkpoints.saved).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					providerKey: 'email.gmail',
					sourceId: 'gmail-support',
					delta: expect.objectContaining({
						cursor: expect.objectContaining({ watermarkVersion: 'gmail-v2' }),
					}),
				}),
				expect.objectContaining({
					providerKey: 'storage.google-drive',
					sourceId: 'drive-support',
					delta: expect.objectContaining({
						webhookChannel: expect.objectContaining({
							channelId: 'channel-1',
						}),
					}),
				}),
			])
		);
		expect(results[0]?.content).toContain('Drive billing runbook.');
	});

	it('starts Google Drive watches with checkpoint state and saves channel expiry', async () => {
		const drive = new FakeDriveProvider([]);
		const checkpoints = new InMemoryDeltaCheckpointStore([
			{
				providerKey: 'storage.google-drive',
				sourceId: 'drive-watch',
				delta: {
					cursor: {
						cursor: 'drive-watch-cursor-1',
						watermarkVersion: 'watch-v1',
					},
				},
			},
		]);
		const runtime = createKnowledgeRuntime({
			collection: 'knowledge-sync',
			namespace: 'tenant-acme',
			embeddings: new FakeEmbeddingProvider(),
			vectorStore: new InMemoryVectorStore(),
			drive,
			deltaCheckpointStore: checkpoints,
		});

		const result = await runtime.watchDriveChanges(
			{
				channelId: 'channel-1',
				webhookUrl: 'https://example.com/drive/webhook',
			},
			{ sourceId: 'drive-watch' }
		);

		expect(drive.lastWatchInput?.delta?.cursor?.watermarkVersion).toBe(
			'watch-v1'
		);
		expect(result.delta.webhookChannel?.expiresAt).toBe(
			'2025-02-05T11:00:00.000Z'
		);
		expect(checkpoints.saved[0]?.delta.cursor?.watermarkVersion).toBe(
			'watch-v2'
		);
	});

	it('runs governed mutations through the runtime facade', async () => {
		const runtime = createKnowledgeRuntime({
			collection: 'knowledge-support',
			namespace: 'tenant-acme',
			embeddings: new FakeEmbeddingProvider(),
			vectorStore: new InMemoryVectorStore(),
		});

		const result = await runtime.runGovernedMutation(
			{
				operation: 'gmail.message.send',
				requiresApproval: true,
				outboundSend: true,
				governance: {
					idempotencyKey: 'mutation-1',
					auditEvidence: {
						evidenceRef: 'audit://mutation-1',
					},
					approvalRefs: [{ id: 'approval-1' }],
					outboundSendGate: {
						status: 'approved',
					},
				},
			},
			async () => ({ sent: true })
		);

		expect(result).toMatchObject({
			status: 'executed',
			idempotencyKey: 'mutation-1',
			result: { sent: true },
		});
	});
});
