import type {
	EmailInboundProvider,
	EmbeddingProvider,
	GoogleDriveProvider,
	LLMProvider,
	VectorStoreProvider,
} from '@contractspec/lib.contracts-integrations';
import type { DocumentProcessor } from './ingestion/document-processor';
import type { VectorIndexConfig } from './ingestion/vector-indexer';
import type { KnowledgeQueryConfig } from './query/service';
import type { VectorRetrieverConfig } from './retriever/vector-retriever';
import type { KnowledgeProviderDeltaCheckpointStore } from './runtime-provider-sync';

export interface KnowledgeRuntimeConfig extends VectorIndexConfig {
	embeddings: EmbeddingProvider;
	vectorStore: VectorStoreProvider;
	llm?: LLMProvider;
	gmail?: EmailInboundProvider;
	drive?: GoogleDriveProvider;
	deltaCheckpointStore?: KnowledgeProviderDeltaCheckpointStore;
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

export function resolveSpaceCollections(
	config: KnowledgeRuntimeConfig
): VectorRetrieverConfig['spaceCollections'] {
	return (
		config.spaceCollections ?? {
			[config.spaceKey ?? 'default']: config.collection,
		}
	);
}
