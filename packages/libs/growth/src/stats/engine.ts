import type { MetricSample, VariantMetricSummary } from '../types';

export interface StatsResult {
  metric: string;
  summaries: VariantMetricSummary[];
  winner?: string;
  pValue?: number;
}

export class StatsEngine {
  summarize(samples: MetricSample[], metric: string): StatsResult {
    const grouped = groupBy(
      samples.filter((sample) => sample.metric === metric),
      (sample) => sample.variantId
    );
    const summaries: VariantMetricSummary[] = [];
    for (const [variantId, variantSamples] of grouped.entries()) {
      const stats = aggregate(variantSamples);
      summaries.push({
        variantId,
        average: stats.mean,
        samples: stats.count,
        improvement: 0,
      });
    }
    summaries.sort((a, b) => b.average - a.average);
    if (summaries.length < 2) {
      return { metric, summaries };
    }
    const control = summaries[0];
    const challenger = summaries[1];
    if (!control || !challenger) {
      return { metric, summaries };
    }
    summaries.forEach((summary) => {
      summary.improvement = Number(
        ((summary.average - control.average) / (control.average || 1)).toFixed(
          3
        )
      );
    });
    const controlSamples = grouped.get(control.variantId) ?? [];
    const challengerSamples = grouped.get(challenger.variantId) ?? [];
    const pValue = welchsTTest(
      control,
      challenger,
      controlSamples,
      challengerSamples
    );
    return {
      metric,
      summaries,
      winner: pValue < 0.05 ? control.variantId : undefined,
      pValue,
    };
  }
}

function groupBy<T>(
  items: T[],
  selector: (item: T) => string
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = selector(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

function aggregate(samples: MetricSample[]) {
  const count = samples.length;
  const sum = samples.reduce((acc, sample) => acc + sample.value, 0);
  const mean = count === 0 ? 0 : sum / count;
  const variance =
    count <= 1
      ? 0
      : samples.reduce(
          (acc, sample) => acc + Math.pow(sample.value - mean, 2),
          0
        ) /
        (count - 1);
  return { count, mean, variance };
}

function welchsTTest(
  control: VariantMetricSummary,
  challenger: VariantMetricSummary,
  controlSamples: MetricSample[],
  challengerSamples: MetricSample[]
) {
  const controlStats = aggregate(controlSamples);
  const challengerStats = aggregate(challengerSamples);
  const numerator = controlStats.mean - challengerStats.mean;
  const denominator = Math.sqrt(
    controlStats.variance / controlStats.count +
      challengerStats.variance / challengerStats.count
  );
  if (!isFinite(denominator) || denominator === 0) return 1;
  const tScore = Math.abs(numerator / denominator);
  const df = degreesOfFreedom(controlStats, challengerStats);
  return approximatePValue(tScore, df);
}

function degreesOfFreedom(
  a: { variance: number; count: number },
  b: { variance: number; count: number }
) {
  const numerator = Math.pow(a.variance / a.count + b.variance / b.count, 2);
  const denominator =
    Math.pow(a.variance / a.count, 2) / (a.count - 1 || 1) +
    Math.pow(b.variance / b.count, 2) / (b.count - 1 || 1);
  return numerator / denominator;
}

function approximatePValue(tScore: number, df: number) {
  if (!isFinite(df) || df <= 0) return 1;
  const x = df / (df + tScore * tScore);
  const beta = Math.pow(x, df / 2);
  return Math.min(1, 2 * (1 - beta));
}
