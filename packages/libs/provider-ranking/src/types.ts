/**
 * Core domain types for the AI Provider Ranking system.
 *
 * Normalized scores use a 0-100 scale. Raw scores preserve the original
 * format from each benchmark source for auditability.
 */

export type BenchmarkDimension =
  | "coding"
  | "reasoning"
  | "agentic"
  | "cost"
  | "latency"
  | "context"
  | "safety"
  | "custom";

export const BENCHMARK_DIMENSIONS: readonly BenchmarkDimension[] = [
  "coding",
  "reasoning",
  "agentic",
  "cost",
  "latency",
  "context",
  "safety",
  "custom",
] as const;

export type BenchmarkSource =
  | "chatbot-arena"
  | "swe-bench"
  | "human-eval"
  | "mmlu"
  | "gpqa"
  | "arc"
  | "truthfulqa"
  | "tau-bench"
  | "artificial-analysis"
  | "custom";

export interface BenchmarkResult {
  id: string;
  modelId: string;
  providerKey: string;
  source: BenchmarkSource;
  dimension: BenchmarkDimension;
  /** Normalized score on a 0-100 scale. */
  score: number;
  /** Original score from the source, preserved for auditability. */
  rawScore: unknown;
  metadata: Record<string, unknown>;
  measuredAt: Date;
  ingestedAt: Date;
}

export interface DimensionScore {
  score: number;
  /** 0-1 confidence based on number and recency of sources. */
  confidence: number;
  sources: string[];
}

export interface ModelRanking {
  modelId: string;
  providerKey: string;
  compositeScore: number;
  dimensionScores: Partial<Record<BenchmarkDimension, DimensionScore>>;
  rank: number;
  previousRank: number | null;
  updatedAt: Date;
}

export interface ModelProfile {
  modelId: string;
  providerKey: string;
  displayName: string;
  contextWindow: number;
  costPerMillion: { input: number; output: number } | null;
  capabilities: string[];
  ranking: ModelRanking | null;
  benchmarkResults: BenchmarkResult[];
  /** Transports supported by this model's provider. */
  supportedTransports?: ProviderTransportSupport[];
  /** Auth methods supported by this model's provider. */
  supportedAuthMethods?: ProviderAuthSupport[];
  /** Whether the provider supports BYOK. */
  byokSupported?: boolean;
}

export interface BenchmarkResultQuery {
  source?: BenchmarkSource;
  modelId?: string;
  dimension?: BenchmarkDimension;
  providerKey?: string;
  limit?: number;
  offset?: number;
}

export interface BenchmarkResultListResult {
  results: BenchmarkResult[];
  total: number;
  nextOffset?: number;
}

export interface RankingQuery {
  dimension?: BenchmarkDimension;
  providerKey?: string;
  limit?: number;
  offset?: number;
  /** Filter by required transport support. */
  requiredTransport?: ProviderTransportSupport;
  /** Filter by required auth method. */
  requiredAuthMethod?: ProviderAuthSupport;
}

export interface RankingListResult {
  rankings: ModelRanking[];
  total: number;
  nextOffset?: number;
}

export interface IngestionRun {
  id: string;
  source: BenchmarkSource;
  status: "pending" | "running" | "completed" | "failed";
  resultsCount: number;
  startedAt: Date;
  completedAt: Date | null;
  error: string | null;
}

export type ProviderTransportSupport = "rest" | "mcp" | "webhook" | "sdk";
export type ProviderAuthSupport = "api-key" | "oauth2" | "bearer" | "header" | "basic" | "webhook-signing" | "service-account";

export interface DimensionWeightConfig {
  dimension: BenchmarkDimension;
  weight: number;
}
