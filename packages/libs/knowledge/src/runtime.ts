import type {
	EmailInboundProvider,
	EmailThread,
	EmailThreadListQuery,
	GetObjectResult,
	GoogleDriveListFilesQuery,
	GoogleDriveProvider,
	GoogleDriveWatchInput,
	GoogleDriveWatchResult,
	ProviderDeltaSyncState,
} from '@contractspec/lib.contracts-integrations';
import {
	executeGovernedKnowledgeMutation,
	type KnowledgeMutationExecutionOptions,
	type KnowledgeMutationRequest,
	type KnowledgeMutationResult,
} from './governance';
import {
	type DocumentFragment,
	DocumentProcessor,
	type RawDocument,
} from './ingestion/document-processor';
import {
	DriveIngestionAdapter,
	type DriveIngestionResult,
} from './ingestion/drive-adapter';
import { EmbeddingService } from './ingestion/embedding-service';
import { GmailIngestionAdapter } from './ingestion/gmail-adapter';
import { StorageIngestionAdapter } from './ingestion/storage-adapter';
import { VectorIndexer } from './ingestion/vector-indexer';
import {
	type KnowledgeAnswer,
	type KnowledgeQueryOptions,
	KnowledgeQueryService,
} from './query/service';
import {
	createVectorRetriever,
	type VectorRetriever,
} from './retriever/vector-retriever';
import {
	type KnowledgeRuntimeConfig,
	resolveSpaceCollections,
} from './runtime-config';
import {
	type KnowledgeProviderDeltaCheckpointStore,
	type KnowledgeProviderSyncOptions,
	syncDriveProvider,
	syncGmailProvider,
	watchDriveProvider,
} from './runtime-provider-sync';
import type { RetrievalOptions, RetrievalResult } from './types';

export type { KnowledgeRuntimeConfig } from './runtime-config';
export type {
	KnowledgeProviderDeltaCheckpoint,
	KnowledgeProviderDeltaCheckpointKey,
	KnowledgeProviderDeltaCheckpointStore,
	KnowledgeProviderSyncOptions,
} from './runtime-provider-sync';

export class KnowledgeRuntime {
	readonly processor: DocumentProcessor;
	readonly embeddingService: EmbeddingService;
	readonly indexer: VectorIndexer;
	readonly retriever: VectorRetriever;
	readonly queryService?: KnowledgeQueryService;

	private readonly gmail?: EmailInboundProvider;
	private readonly drive?: GoogleDriveProvider;
	private readonly deltaCheckpointStore?: KnowledgeProviderDeltaCheckpointStore;
	private readonly locale?: string;

	constructor(private readonly config: KnowledgeRuntimeConfig) {
		this.processor = config.processor ?? new DocumentProcessor();
		this.embeddingService = new EmbeddingService(
			config.embeddings,
			config.embeddingBatchSize
		);
		this.indexer = new VectorIndexer(config.vectorStore, {
			collection: config.collection,
			namespace: config.namespace,
			metadata: config.metadata,
		});
		this.retriever = createVectorRetriever({
			embeddings: config.embeddings,
			vectorStore: config.vectorStore,
			spaceCollections: resolveSpaceCollections(config),
			staticContent: config.staticContent,
			defaultTopK: config.defaultTopK,
			defaultMinScore: config.defaultMinScore,
		});
		this.queryService = config.llm
			? new KnowledgeQueryService(
					config.embeddings,
					config.vectorStore,
					config.llm,
					{
						collection: config.collection,
						namespace: config.namespace,
						topK: config.defaultTopK,
						systemPrompt: config.systemPrompt,
						locale: config.locale,
					}
				)
			: undefined;
		this.gmail = config.gmail;
		this.drive = config.drive;
		this.deltaCheckpointStore = config.deltaCheckpointStore;
		this.locale = config.locale;
	}

	async ingestDocument(
		document: RawDocument
	): Promise<{ fragments: DocumentFragment[] }> {
		const fragments = await this.processor.process(document);
		const embeddings = await this.embeddingService.embedFragments(fragments);
		await this.indexer.upsert(fragments, embeddings);
		return { fragments };
	}

	async ingestObject(object: GetObjectResult): Promise<void> {
		await this.createStorageAdapter().ingestObject(object);
	}

	async ingestThread(thread: EmailThread): Promise<void> {
		await this.createGmailAdapter().ingestThread(thread);
	}

	async syncThreads(
		query?: Parameters<EmailInboundProvider['listThreads']>[0]
	): Promise<void> {
		await this.createGmailAdapter().syncThreads(query);
	}

	async syncGmail(
		query?: EmailThreadListQuery,
		options: KnowledgeProviderSyncOptions = {}
	): Promise<{ threadsIndexed: number; delta?: ProviderDeltaSyncState }> {
		const provider = this.gmail;
		if (!provider) {
			throw new Error(
				'KnowledgeRuntime.syncGmail() requires an EmailInboundProvider.'
			);
		}
		return syncGmailProvider({
			provider,
			query,
			options,
			context: { checkpointStore: this.deltaCheckpointStore },
			adapter: this.createGmailAdapter(provider),
		});
	}

	async syncDriveFiles(
		query?: GoogleDriveListFilesQuery,
		options: KnowledgeProviderSyncOptions = {}
	): Promise<DriveIngestionResult> {
		return syncDriveProvider({
			query,
			options,
			context: { checkpointStore: this.deltaCheckpointStore },
			adapter: this.createDriveAdapter(),
		});
	}

	async watchDriveChanges(
		input: GoogleDriveWatchInput,
		options: KnowledgeProviderSyncOptions = {}
	): Promise<GoogleDriveWatchResult> {
		const provider = this.drive;
		if (!provider) {
			throw new Error(
				'KnowledgeRuntime.watchDriveChanges() requires a GoogleDriveProvider.'
			);
		}
		return watchDriveProvider({
			provider,
			input,
			options,
			context: { checkpointStore: this.deltaCheckpointStore },
		});
	}

	async runGovernedMutation<T>(
		request: KnowledgeMutationRequest,
		execute: () => Promise<T>,
		options?: KnowledgeMutationExecutionOptions
	): Promise<KnowledgeMutationResult<T>> {
		return executeGovernedKnowledgeMutation(request, execute, options);
	}

	async retrieve(
		query: string,
		options: RetrievalOptions
	): Promise<RetrievalResult[]> {
		return this.retriever.retrieve(query, options);
	}

	async query(
		question: string,
		options: KnowledgeQueryOptions = {}
	): Promise<KnowledgeAnswer> {
		if (!this.queryService) {
			throw new Error(
				'KnowledgeRuntime.query() requires an LLMProvider in the runtime config.'
			);
		}
		return this.queryService.query(question, options);
	}

	createStorageAdapter(): StorageIngestionAdapter {
		return new StorageIngestionAdapter(
			this.processor,
			this.embeddingService,
			this.indexer
		);
	}

	createGmailAdapter(provider = this.gmail): GmailIngestionAdapter {
		if (!provider) {
			throw new Error(
				'KnowledgeRuntime.createGmailAdapter() requires an EmailInboundProvider.'
			);
		}
		return new GmailIngestionAdapter(
			provider,
			this.processor,
			this.embeddingService,
			this.indexer,
			this.locale
		);
	}

	createDriveAdapter(provider = this.drive): DriveIngestionAdapter {
		if (!provider) {
			throw new Error(
				'KnowledgeRuntime.createDriveAdapter() requires a GoogleDriveProvider.'
			);
		}
		return new DriveIngestionAdapter(
			provider,
			this.processor,
			this.embeddingService,
			this.indexer
		);
	}
}

export const createKnowledgeRuntime = (config: KnowledgeRuntimeConfig) =>
	new KnowledgeRuntime(config);
