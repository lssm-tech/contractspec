import type { BenchmarkDimension, DimensionWeightConfig } from '../types';

/**
 * Default weights for composite score calculation.
 * Weights are normalized to sum to 1.0 at scoring time.
 */
export const DEFAULT_DIMENSION_WEIGHTS: DimensionWeightConfig[] = [
  { dimension: 'coding', weight: 20 },
  { dimension: 'reasoning', weight: 20 },
  { dimension: 'agentic', weight: 15 },
  { dimension: 'cost', weight: 10 },
  { dimension: 'latency', weight: 10 },
  { dimension: 'context', weight: 10 },
  { dimension: 'safety', weight: 10 },
  { dimension: 'custom', weight: 5 },
];

export function getWeightMap(
  overrides?: DimensionWeightConfig[]
): Map<BenchmarkDimension, number> {
  const map = new Map<BenchmarkDimension, number>();

  for (const w of DEFAULT_DIMENSION_WEIGHTS) {
    map.set(w.dimension, w.weight);
  }

  if (overrides) {
    for (const w of overrides) {
      map.set(w.dimension, w.weight);
    }
  }

  return map;
}

export function normalizeWeights(
  weights: Map<BenchmarkDimension, number>,
  activeDimensions: BenchmarkDimension[]
): Map<BenchmarkDimension, number> {
  const totalWeight = activeDimensions.reduce(
    (sum, dim) => sum + (weights.get(dim) ?? 0),
    0
  );

  if (totalWeight === 0) return new Map();

  const normalized = new Map<BenchmarkDimension, number>();
  for (const dim of activeDimensions) {
    const raw = weights.get(dim) ?? 0;
    normalized.set(dim, raw / totalWeight);
  }

  return normalized;
}
