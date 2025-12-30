import type { Logger } from '@contractspec/lib.logger';
import {
  prisma,
  KnowledgeSourceType,
  type KnowledgeSource,
} from '@contractspec/lib.database-studio';
import type { LLMProvider } from '@contractspec/lib.contracts/integrations/providers/llm';
import type { EmbeddingProvider } from '@contractspec/lib.contracts/integrations/providers/embedding';
import type { VectorStoreProvider } from '@contractspec/lib.contracts/integrations/providers/vector-store';
import {
  DocumentProcessor,
  type RawDocument,
} from '@contractspec/lib.knowledge/ingestion/document-processor';
import { EmbeddingService } from '@contractspec/lib.knowledge/ingestion/embedding-service';
import { VectorIndexer } from '@contractspec/lib.knowledge/ingestion/vector-indexer';
import { KnowledgeQueryService } from '@contractspec/lib.knowledge/query/service';

export interface IndexKnowledgeSourceInput {
  organizationId: string;
  type: KnowledgeSourceType;
  name: string;
  documents: RawDocument[];
  projectId?: string;
  namespace?: string;
  collection?: string;
  metadata?: Record<string, string>;
}

export interface QueryKnowledgeInput {
  question: string;
  collection?: string;
  namespace?: string;
  systemPrompt?: string;
  topK?: number;
}

export interface StudioKnowledgeModuleOptions {
  embeddings: EmbeddingProvider;
  vectorStore: VectorStoreProvider;
  llm: LLMProvider;
  defaultCollection: string;
  logger?: Logger;
}

export class StudioKnowledgeModule {
  private readonly processor = new DocumentProcessor();
  private readonly embeddingService: EmbeddingService;
  private readonly vectorStore: VectorStoreProvider;
  private readonly embeddings: EmbeddingProvider;
  private readonly llm: LLMProvider;
  private readonly defaultCollection: string;
  private readonly logger?: Logger;

  constructor(options: StudioKnowledgeModuleOptions) {
    this.embeddings = options.embeddings;
    this.vectorStore = options.vectorStore;
    this.llm = options.llm;
    this.embeddingService = new EmbeddingService(options.embeddings);
    this.defaultCollection = options.defaultCollection;
    this.logger = options.logger;
  }

  async indexSource(
    input: IndexKnowledgeSourceInput
  ): Promise<KnowledgeSource> {
    if (!input.documents.length) {
      throw new Error('indexSource requires at least one document');
    }

    const fragments = (
      await Promise.all(
        input.documents.map((document) => this.processor.process(document))
      )
    ).flat();
    const embeddings = await this.embeddingService.embedFragments(fragments);

    const indexer = new VectorIndexer(this.vectorStore, {
      collection: input.collection ?? this.defaultCollection,
      namespace: input.namespace,
      metadata: input.metadata,
    });
    await indexer.upsert(fragments, embeddings);

    const source = await prisma.knowledgeSource.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        type: input.type,
        name: input.name,
        content: {
          fragments: fragments.length,
          namespace: input.namespace,
        },
        indexed: true,
        lastIndexed: new Date(),
      },
    });

    this.logger?.info?.('studio.knowledge.indexed', {
      sourceId: source.id,
      fragments: fragments.length,
    });

    return source;
  }

  async queryKnowledge(input: QueryKnowledgeInput) {
    const service = new KnowledgeQueryService(
      this.embeddings,
      this.vectorStore,
      this.llm,
      {
        collection: input.collection ?? this.defaultCollection,
        namespace: input.namespace,
        topK: input.topK,
        systemPrompt: input.systemPrompt,
      }
    );
    return service.query(input.question);
  }
}
