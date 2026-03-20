import type {
	DatabaseProvider,
	EmbeddingProvider,
	VectorStoreProvider,
} from '@contractspec/lib.contracts-integrations';
import {
	DocumentProcessor,
	EmbeddingService,
	type VectorIndexConfig,
	VectorIndexer,
} from '@contractspec/lib.knowledge/ingestion';
import {
	ContextSnapshotPipeline,
	PostgresContextStorage,
} from '@contractspec/module.context-storage';

export interface ContextStorageServiceOptions {
	database: DatabaseProvider;
	schema?: string;
	createTablesIfMissing?: boolean;
	documentProcessor?: DocumentProcessor;
	embeddingProvider?: EmbeddingProvider;
	embeddingBatchSize?: number;
	vectorStoreProvider?: VectorStoreProvider;
	vectorIndex?: VectorIndexConfig;
}

export interface ContextStorageService {
	store: PostgresContextStorage;
	pipeline: ContextSnapshotPipeline;
}

export function createContextStorageService(
	options: ContextStorageServiceOptions
): ContextStorageService {
	const store = new PostgresContextStorage({
		database: options.database,
		schema: options.schema,
		createTablesIfMissing: options.createTablesIfMissing,
	});
	const embeddingService = options.embeddingProvider
		? new EmbeddingService(
				options.embeddingProvider,
				options.embeddingBatchSize
			)
		: undefined;
	const vectorIndexer =
		options.vectorStoreProvider && options.vectorIndex
			? new VectorIndexer(options.vectorStoreProvider, options.vectorIndex)
			: undefined;
	const pipeline = new ContextSnapshotPipeline({
		store,
		documentProcessor: options.documentProcessor,
		embeddingService,
		vectorIndexer,
	});
	return { store, pipeline };
}
