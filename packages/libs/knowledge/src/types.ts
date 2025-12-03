import type { KnowledgeCategory } from '@lssm/lib.contracts/knowledge';

/**
 * Result from a knowledge retrieval operation.
 */
export interface RetrievalResult {
  /** The retrieved content/text */
  content: string;
  /** Source identifier (document ID, URL, etc.) */
  source: string;
  /** Relevance score (0-1, higher is more relevant) */
  score: number;
  /** Additional metadata about the result */
  metadata?: Record<string, unknown>;
}

/**
 * Options for knowledge retrieval.
 */
export interface RetrievalOptions {
  /** Knowledge space key to query */
  spaceKey: string;
  /** Maximum number of results to return */
  topK?: number;
  /** Minimum relevance score threshold */
  minScore?: number;
  /** Filter by knowledge category */
  category?: KnowledgeCategory;
  /** Tenant-scoped retrieval */
  tenantId?: string;
  /** Additional filter criteria */
  filter?: Record<string, unknown>;
}

/**
 * Context for knowledge access operations.
 */
export interface KnowledgeAccessContext {
  tenantId: string;
  appId: string;
  environment?: string;
  workflowName?: string;
  agentName?: string;
  operation: 'read' | 'write' | 'search';
}

/**
 * Result of an access check.
 */
export interface KnowledgeAccessResult {
  allowed: boolean;
  reason?: string;
  severity?: 'error' | 'warning';
}


