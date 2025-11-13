import { Mistral } from '@mistralai/mistralai';

import type {
  EmbeddingDocument,
  EmbeddingProvider,
  EmbeddingResult,
} from '../embedding';

export interface MistralEmbeddingProviderOptions {
  apiKey: string;
  defaultModel?: string;
  serverURL?: string;
  client?: Mistral;
}

export class MistralEmbeddingProvider implements EmbeddingProvider {
  private readonly client: Mistral;
  private readonly defaultModel: string;

  constructor(options: MistralEmbeddingProviderOptions) {
    if (!options.apiKey) {
      throw new Error('MistralEmbeddingProvider requires an apiKey');
    }

    this.client =
      options.client ??
      new Mistral({
        apiKey: options.apiKey,
        serverURL: options.serverURL,
      });
    this.defaultModel = options.defaultModel ?? 'mistral-embed';
  }

  async embedDocuments(
    documents: EmbeddingDocument[],
    options?: { model?: string }
  ): Promise<EmbeddingResult[]> {
    if (documents.length === 0) return [];
    const model = options?.model ?? this.defaultModel;
    const response = await this.client.embeddings.create({
      model,
      inputs: documents.map((doc) => doc.text),
    });

    return response.data.map((item, index) => ({
      id:
        documents[index]?.id ??
        (item.index != null ? `embedding-${item.index}` : `embedding-${index}`),
      vector: item.embedding ?? [],
      dimensions: item.embedding?.length ?? 0,
      model: response.model,
      metadata: documents[index]?.metadata
        ? Object.fromEntries(
            Object.entries(documents[index]?.metadata ?? {}).map(
              ([key, value]) => [key, String(value)]
            )
          )
        : undefined,
    }));
  }

  async embedQuery(
    query: string,
    options?: { model?: string }
  ): Promise<EmbeddingResult> {
    const [result] = await this.embedDocuments(
      [{ id: 'query', text: query }],
      options
    );
    if (!result) {
      throw new Error('Failed to compute embedding for query');
    }
    return result;
  }
}


