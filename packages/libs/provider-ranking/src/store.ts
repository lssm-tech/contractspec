import type {
	BenchmarkResult,
	BenchmarkResultListResult,
	BenchmarkResultQuery,
	IngestionRun,
	ModelProfile,
	ModelRanking,
	RankingListResult,
	RankingQuery,
} from './types';

/**
 * Storage interface for the provider ranking system.
 *
 * Lib provides an in-memory implementation; the module layer
 * adds a Postgres-backed implementation.
 */
export interface ProviderRankingStore {
	upsertBenchmarkResult(result: BenchmarkResult): Promise<void>;
	getBenchmarkResult(id: string): Promise<BenchmarkResult | null>;
	listBenchmarkResults(
		query: BenchmarkResultQuery
	): Promise<BenchmarkResultListResult>;

	upsertModelRanking(ranking: ModelRanking): Promise<void>;
	getModelRanking(modelId: string): Promise<ModelRanking | null>;
	listModelRankings(query: RankingQuery): Promise<RankingListResult>;

	getModelProfile(modelId: string): Promise<ModelProfile | null>;

	createIngestionRun(run: IngestionRun): Promise<void>;
	updateIngestionRun(id: string, update: Partial<IngestionRun>): Promise<void>;
	getIngestionRun(id: string): Promise<IngestionRun | null>;
}
