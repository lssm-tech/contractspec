import type { EmbeddingVector } from './embedding';

export interface VectorDocument {
  id: string;
  vector: EmbeddingVector;
  payload?: Record<string, unknown>;
  namespace?: string;
  expiresAt?: Date;
}

export interface VectorUpsertRequest {
  collection: string;
  documents: VectorDocument[];
  waitForSync?: boolean;
}

export interface VectorDeleteRequest {
  collection: string;
  ids: string[];
  namespace?: string;
}

export interface VectorSearchQuery {
  collection: string;
  vector: EmbeddingVector;
  topK: number;
  namespace?: string;
  filter?: Record<string, unknown>;
  scoreThreshold?: number;
  consistent?: boolean;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  payload?: Record<string, unknown>;
  vector?: EmbeddingVector;
  namespace?: string;
}

export interface VectorStoreProvider {
  upsert(request: VectorUpsertRequest): Promise<void>;
  search(query: VectorSearchQuery): Promise<VectorSearchResult[]>;
  delete(request: VectorDeleteRequest): Promise<void>;
}


