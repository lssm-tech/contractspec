import type {
	BenchmarkDimension,
	BenchmarkResult,
	DimensionScore,
	DimensionWeightConfig,
	ModelRanking,
} from '../types';
import { getWeightMap, normalizeWeights } from './dimension-weights';

interface ScorerOptions {
	weightOverrides?: DimensionWeightConfig[];
}

/**
 * Groups benchmark results by model, computes per-dimension scores,
 * and produces a weighted composite ranking.
 */
export function computeModelRankings(
	results: BenchmarkResult[],
	options?: ScorerOptions,
	existingRankings?: Map<string, ModelRanking>
): ModelRanking[] {
	const byModel = groupByModel(results);
	const weights = getWeightMap(options?.weightOverrides);

	const unsorted: ModelRanking[] = [];

	for (const [modelId, modelResults] of byModel) {
		const providerKey = modelResults[0]?.providerKey ?? 'unknown';
		const dimensionScores = computeDimensionScores(modelResults);
		const activeDimensions = Object.keys(
			dimensionScores
		) as BenchmarkDimension[];
		const normalizedWeights = normalizeWeights(weights, activeDimensions);

		let compositeScore = 0;
		for (const dim of activeDimensions) {
			const dimScore = dimensionScores[dim];
			const weight = normalizedWeights.get(dim) ?? 0;
			if (dimScore) {
				compositeScore += dimScore.score * weight;
			}
		}

		const previousRank = existingRankings?.get(modelId)?.rank ?? null;

		unsorted.push({
			modelId,
			providerKey,
			compositeScore: Math.round(compositeScore * 100) / 100,
			dimensionScores,
			rank: 0,
			previousRank,
			updatedAt: new Date(),
		});
	}

	unsorted.sort((a, b) => b.compositeScore - a.compositeScore);

	return unsorted.map((ranking, index) => ({
		...ranking,
		rank: index + 1,
	}));
}

function groupByModel(
	results: BenchmarkResult[]
): Map<string, BenchmarkResult[]> {
	const map = new Map<string, BenchmarkResult[]>();

	for (const result of results) {
		const existing = map.get(result.modelId);
		if (existing) {
			existing.push(result);
		} else {
			map.set(result.modelId, [result]);
		}
	}

	return map;
}

function computeDimensionScores(
	results: BenchmarkResult[]
): Partial<Record<BenchmarkDimension, DimensionScore>> {
	const byDimension = new Map<BenchmarkDimension, BenchmarkResult[]>();

	for (const result of results) {
		const existing = byDimension.get(result.dimension);
		if (existing) {
			existing.push(result);
		} else {
			byDimension.set(result.dimension, [result]);
		}
	}

	const scores: Partial<Record<BenchmarkDimension, DimensionScore>> = {};

	for (const [dimension, dimResults] of byDimension) {
		const avgScore =
			dimResults.reduce((sum, r) => sum + r.score, 0) / dimResults.length;

		const sources = [...new Set(dimResults.map((r) => r.source))];

		const recencyFactor = computeRecencyFactor(dimResults);
		const sourceDiversity = Math.min(sources.length / 3, 1);
		const confidence =
			Math.round((recencyFactor * 0.5 + sourceDiversity * 0.5) * 100) / 100;

		scores[dimension] = {
			score: Math.round(avgScore * 100) / 100,
			confidence,
			sources,
		};
	}

	return scores;
}

/**
 * Recency factor: 1.0 if most recent result is < 30 days old,
 * decaying to 0.3 for results older than 180 days.
 */
function computeRecencyFactor(results: BenchmarkResult[]): number {
	if (results.length === 0) return 0;

	const now = Date.now();
	const mostRecent = Math.max(...results.map((r) => r.measuredAt.getTime()));
	const daysSinceMostRecent = (now - mostRecent) / (1000 * 60 * 60 * 24);

	if (daysSinceMostRecent <= 30) return 1.0;
	if (daysSinceMostRecent >= 180) return 0.3;

	return 1.0 - ((daysSinceMostRecent - 30) / (180 - 30)) * 0.7;
}
