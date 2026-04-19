import type {
	EmbeddingResult,
	VectorStoreProvider,
	VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import { buildKnowledgeVectorPayload } from '../vector-payload';
import type { DocumentFragment } from './document-processor';

export interface VectorIndexConfig {
	collection: string;
	namespace?: string;
	metadata?: Record<string, string>;
}

export class VectorIndexer {
	private readonly provider: VectorStoreProvider;
	private readonly config: VectorIndexConfig;

	constructor(provider: VectorStoreProvider, config: VectorIndexConfig) {
		this.provider = provider;
		this.config = config;
	}

	async upsert(
		fragments: DocumentFragment[],
		embeddings: EmbeddingResult[]
	): Promise<void> {
		const fragmentsById = new Map(
			fragments.map((fragment) => [fragment.id, fragment])
		);
		const documents = embeddings.map((embedding) => {
			const fragment = fragmentsById.get(embedding.id);
			return {
				id: embedding.id,
				vector: embedding.vector,
				payload: buildKnowledgeVectorPayload(fragment, this.config.metadata),
				namespace: this.config.namespace,
			};
		});

		const request: VectorUpsertRequest = {
			collection: this.config.collection,
			documents,
		};

		await this.provider.upsert(request);
	}
}
