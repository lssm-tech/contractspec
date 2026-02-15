import type { EmbeddingProvider } from '@contractspec/lib.contracts-integrations';
import type {
  VectorStoreProvider,
  VectorSearchResult,
} from '@contractspec/lib.contracts-integrations';
import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
} from '@contractspec/lib.contracts-integrations';

export interface KnowledgeQueryConfig {
  collection: string;
  namespace?: string;
  topK?: number;
  systemPrompt?: string;
}

export interface KnowledgeAnswer {
  answer: string;
  references: (VectorSearchResult & {
    text?: string;
  })[];
  usage?: LLMResponse['usage'];
}

export class KnowledgeQueryService {
  private readonly embeddings: EmbeddingProvider;
  private readonly vectorStore: VectorStoreProvider;
  private readonly llm: LLMProvider;
  private readonly config: KnowledgeQueryConfig;

  constructor(
    embeddings: EmbeddingProvider,
    vectorStore: VectorStoreProvider,
    llm: LLMProvider,
    config: KnowledgeQueryConfig
  ) {
    this.embeddings = embeddings;
    this.vectorStore = vectorStore;
    this.llm = llm;
    this.config = config;
  }

  async query(question: string): Promise<KnowledgeAnswer> {
    const embedding = await this.embeddings.embedQuery(question);
    const results = await this.vectorStore.search({
      collection: this.config.collection,
      vector: embedding.vector,
      topK: this.config.topK ?? 5,
      namespace: this.config.namespace,
      filter: undefined,
    });
    const context = buildContext(results);
    const messages = this.buildMessages(question, context);
    const response = await this.llm.chat(messages);
    return {
      answer: response.message.content
        .map((part) => ('text' in part ? part.text : ''))
        .join(''),
      references: results.map((result) => ({
        ...result,
        text: extractText(result),
      })),
      usage: response.usage,
    };
  }

  private buildMessages(question: string, context: string): LLMMessage[] {
    const systemPrompt =
      this.config.systemPrompt ??
      'You are a knowledge assistant that answers questions using the provided context. Cite relevant sources if possible.';
    return [
      {
        role: 'system',
        content: [{ type: 'text', text: systemPrompt }],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Question:\n${question}\n\nContext:\n${context}`,
          },
        ],
      },
    ];
  }
}

function buildContext(results: VectorSearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant documents found.';
  }
  return results
    .map((result, index) => {
      const text = extractText(result);
      return `Source ${index + 1} (score: ${result.score.toFixed(3)}):\n${text}`;
    })
    .join('\n\n');
}

function extractText(result: VectorSearchResult): string {
  const payload = result.payload ?? {};
  if (typeof payload.text === 'string') return payload.text;
  if (typeof payload.content === 'string') return payload.content;
  return JSON.stringify(payload);
}
