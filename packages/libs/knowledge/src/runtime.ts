import type {
	EmailInboundProvider,
	EmailThread,
	EmbeddingProvider,
	GetObjectResult,
	LLMProvider,
	VectorStoreProvider,
} from '@contractspec/lib.contracts-integrations';
import {
	type DocumentFragment,
	DocumentProcessor,
	type RawDocument,
} from './ingestion/document-processor';
import { EmbeddingService } from './ingestion/embedding-service';
import { GmailIngestionAdapter } from './ingestion/gmail-adapter';
import { StorageIngestionAdapter } from './ingestion/storage-adapter';
import {
	type VectorIndexConfig,
	VectorIndexer,
} from './ingestion/vector-indexer';
import {
	type KnowledgeAnswer,
	type KnowledgeQueryConfig,
	type KnowledgeQueryOptions,
	KnowledgeQueryService,
} from './query/service';
import {
	createVectorRetriever,
	type VectorRetriever,
	type VectorRetrieverConfig,
} from './retriever/vector-retriever';
import type { RetrievalOptions, RetrievalResult } from './types';

export interface KnowledgeRuntimeConfig extends VectorIndexConfig {
	embeddings: EmbeddingProvider;
	vectorStore: VectorStoreProvider;
	llm?: LLMProvider;
	gmail?: EmailInboundProvider;
	spaceKey?: string;
	spaceCollections?: VectorRetrieverConfig['spaceCollections'];
	staticContent?: VectorRetrieverConfig['staticContent'];
	defaultTopK?: number;
	defaultMinScore?: number;
	embeddingBatchSize?: number;
	systemPrompt?: KnowledgeQueryConfig['systemPrompt'];
	locale?: KnowledgeQueryConfig['locale'];
	processor?: DocumentProcessor;
}

export class KnowledgeRuntime {
	readonly processor: DocumentProcessor;
	readonly embeddingService: EmbeddingService;
	readonly indexer: VectorIndexer;
	readonly retriever: VectorRetriever;
	readonly queryService?: KnowledgeQueryService;

	private readonly gmail?: EmailInboundProvider;
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
}

export function createKnowledgeRuntime(
	config: KnowledgeRuntimeConfig
): KnowledgeRuntime {
	return new KnowledgeRuntime(config);
}

function resolveSpaceCollections(
	config: KnowledgeRuntimeConfig
): VectorRetrieverConfig['spaceCollections'] {
	if (config.spaceCollections) {
		return config.spaceCollections;
	}
	return {
		[config.spaceKey ?? 'default']: config.collection,
	};
}
