import type { BenchmarkResult, BenchmarkSource } from "../types";

interface NormalizationConfig {
  /** Minimum possible raw score for the source. */
  min: number;
  /** Maximum possible raw score for the source. */
  max: number;
  /** If true, lower raw scores are better (e.g. latency, cost). */
  invertScale: boolean;
}

/**
 * Known normalization ranges per benchmark source.
 * Scores are mapped to a 0-100 normalized scale.
 */
const SOURCE_NORMALIZATION: Partial<Record<BenchmarkSource, NormalizationConfig>> = {
  "chatbot-arena": { min: 800, max: 1400, invertScale: false },
  "swe-bench": { min: 0, max: 100, invertScale: false },
  "human-eval": { min: 0, max: 100, invertScale: false },
  "mmlu": { min: 0, max: 100, invertScale: false },
  "gpqa": { min: 0, max: 100, invertScale: false },
  "arc": { min: 0, max: 100, invertScale: false },
  "truthfulqa": { min: 0, max: 100, invertScale: false },
  "tau-bench": { min: 0, max: 100, invertScale: false },
  "artificial-analysis": { min: 0, max: 100, invertScale: false },
};

/**
 * Normalize a raw score to the 0-100 scale.
 * Falls back to clamping if no source config is known.
 */
export function normalizeScore(
  rawScore: number,
  source: BenchmarkSource,
  configOverride?: NormalizationConfig,
): number {
  const config = configOverride ?? SOURCE_NORMALIZATION[source];

  if (!config) {
    return Math.max(0, Math.min(100, rawScore));
  }

  const { min, max, invertScale } = config;
  const range = max - min;

  if (range === 0) return 50;

  let normalized = ((rawScore - min) / range) * 100;

  if (invertScale) {
    normalized = 100 - normalized;
  }

  return Math.max(0, Math.min(100, normalized));
}

/**
 * Normalize an array of benchmark results in place,
 * setting the `score` field from `rawScore`.
 */
export function normalizeBenchmarkResults(
  results: BenchmarkResult[],
): BenchmarkResult[] {
  return results.map((result) => ({
    ...result,
    score: normalizeScore(
      typeof result.rawScore === "number" ? result.rawScore : result.score,
      result.source,
    ),
  }));
}
