import type { ProviderRankingStore } from './store';
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

export class InMemoryProviderRankingStore implements ProviderRankingStore {
  private benchmarkResults = new Map<string, BenchmarkResult>();
  private modelRankings = new Map<string, ModelRanking>();
  private ingestionRuns = new Map<string, IngestionRun>();

  async upsertBenchmarkResult(result: BenchmarkResult): Promise<void> {
    this.benchmarkResults.set(result.id, result);
  }

  async getBenchmarkResult(id: string): Promise<BenchmarkResult | null> {
    return this.benchmarkResults.get(id) ?? null;
  }

  async listBenchmarkResults(
    query: BenchmarkResultQuery
  ): Promise<BenchmarkResultListResult> {
    let results = Array.from(this.benchmarkResults.values());

    if (query.source) {
      results = results.filter((r) => r.source === query.source);
    }
    if (query.modelId) {
      results = results.filter((r) => r.modelId === query.modelId);
    }
    if (query.dimension) {
      results = results.filter((r) => r.dimension === query.dimension);
    }
    if (query.providerKey) {
      results = results.filter((r) => r.providerKey === query.providerKey);
    }

    const total = results.length;
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 50;
    results = results.slice(offset, offset + limit);
    const nextOffset =
      offset + results.length < total ? offset + results.length : undefined;

    return { results, total, nextOffset };
  }

  async upsertModelRanking(ranking: ModelRanking): Promise<void> {
    this.modelRankings.set(ranking.modelId, ranking);
  }

  async getModelRanking(modelId: string): Promise<ModelRanking | null> {
    return this.modelRankings.get(modelId) ?? null;
  }

  async listModelRankings(query: RankingQuery): Promise<RankingListResult> {
    let rankings = Array.from(this.modelRankings.values());

    if (query.providerKey) {
      rankings = rankings.filter((r) => r.providerKey === query.providerKey);
    }

    if (query.dimension) {
      const dim = query.dimension;
      rankings.sort((a, b) => {
        const scoreA = a.dimensionScores[dim]?.score ?? -1;
        const scoreB = b.dimensionScores[dim]?.score ?? -1;
        return scoreB - scoreA;
      });
    } else {
      rankings.sort((a, b) => a.rank - b.rank);
    }

    const total = rankings.length;
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 50;
    rankings = rankings.slice(offset, offset + limit);
    const nextOffset =
      offset + rankings.length < total ? offset + rankings.length : undefined;

    return { rankings, total, nextOffset };
  }

  async getModelProfile(modelId: string): Promise<ModelProfile | null> {
    const ranking = this.modelRankings.get(modelId);
    if (!ranking) return null;

    const benchmarkResults = Array.from(this.benchmarkResults.values()).filter(
      (r) => r.modelId === modelId
    );

    return {
      modelId,
      providerKey: ranking.providerKey,
      displayName: modelId,
      contextWindow: 0,
      costPerMillion: null,
      capabilities: [],
      ranking,
      benchmarkResults,
    };
  }

  async createIngestionRun(run: IngestionRun): Promise<void> {
    this.ingestionRuns.set(run.id, run);
  }

  async updateIngestionRun(
    id: string,
    update: Partial<IngestionRun>
  ): Promise<void> {
    const existing = this.ingestionRuns.get(id);
    if (existing) {
      this.ingestionRuns.set(id, { ...existing, ...update });
    }
  }

  async getIngestionRun(id: string): Promise<IngestionRun | null> {
    return this.ingestionRuns.get(id) ?? null;
  }
}
