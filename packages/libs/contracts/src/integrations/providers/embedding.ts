export type EmbeddingVector = number[];

export interface EmbeddingDocument {
  id: string;
  text: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface EmbeddingResult {
  id: string;
  vector: EmbeddingVector;
  dimensions: number;
  model: string;
  metadata?: Record<string, string>;
}

export interface EmbeddingProvider {
  embedDocuments(
    documents: EmbeddingDocument[],
    options?: { model?: string }
  ): Promise<EmbeddingResult[]>;
  embedQuery(
    query: string,
    options?: { model?: string }
  ): Promise<EmbeddingResult>;
}
