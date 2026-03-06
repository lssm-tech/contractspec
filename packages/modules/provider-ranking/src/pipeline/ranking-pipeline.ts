import type { ProviderRankingStore } from '@contractspec/lib.provider-ranking/store';
import type {
  BenchmarkDimension,
  BenchmarkResult,
  DimensionWeightConfig,
  ProviderTransportSupport,
  ProviderAuthSupport,
} from '@contractspec/lib.provider-ranking/types';
import { computeModelRankings } from '@contractspec/lib.provider-ranking/scoring';

export interface RankingPipelineOptions {
  store: ProviderRankingStore;
}

export interface RefreshParams {
  weightOverrides?: DimensionWeightConfig[];
  dimensions?: BenchmarkDimension[];
  forceRecalculate?: boolean;
  /** Filter rankings to models whose provider supports this transport. */
  requiredTransport?: ProviderTransportSupport;
  /** Filter rankings to models whose provider supports this auth method. */
  requiredAuthMethod?: ProviderAuthSupport;
}

export interface RankingPipelineResult {
  modelsRanked: number;
  updatedAt: Date;
}

/**
 * Orchestrates the ranking refresh flow:
 * 1. Load all benchmark results from the store
 * 2. Load existing rankings (for previousRank tracking)
 * 3. Compute new composite rankings via the scoring engine
 * 4. Persist updated rankings
 */
export class RankingPipeline {
  private readonly store: ProviderRankingStore;

  constructor(options: RankingPipelineOptions) {
    this.store = options.store;
  }

  async refresh(params?: RefreshParams): Promise<RankingPipelineResult> {
    let allResults = await this.loadAllBenchmarkResults();

    if (params?.dimensions?.length) {
      const dimSet = new Set(params.dimensions);
      allResults = allResults.filter((r) => dimSet.has(r.dimension));
    }

    const existingRankings = params?.forceRecalculate
      ? new Map<string, never>()
      : new Map(
          (await this.store.listModelRankings({
            limit: 10000,
            requiredTransport: params?.requiredTransport,
            requiredAuthMethod: params?.requiredAuthMethod,
          })).rankings.map(
            (r) => [r.modelId, r],
          ),
        );

    const newRankings = computeModelRankings(
      allResults,
      params?.weightOverrides ? { weightOverrides: params.weightOverrides } : undefined,
      existingRankings,
    );

    for (const ranking of newRankings) {
      await this.store.upsertModelRanking(ranking);
    }

    return {
      modelsRanked: newRankings.length,
      updatedAt: new Date(),
    };
  }

  private async loadAllBenchmarkResults(): Promise<BenchmarkResult[]> {
    const pageSize = 500;
    let offset = 0;
    const allResults: BenchmarkResult[] = [];

    while (true) {
      const page = await this.store.listBenchmarkResults({
        limit: pageSize,
        offset,
      });

      allResults.push(...page.results);

      if (allResults.length >= page.total || page.results.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    return allResults;
  }
}
