import type { BenchmarkDimension, BenchmarkResult } from "../types";
import type { BenchmarkIngester, IngesterOptions } from "./types";
import { fetchWithRetry, parseJsonSafe } from "./fetch-utils";

const DEFAULT_AA_URL = "https://artificialanalysis.ai/api/models";

interface AAModelEntry {
  model_id: string;
  model_name: string;
  provider: string;
  quality_score?: number;
  speed_score?: number;
  price_per_million_input_tokens?: number;
  price_per_million_output_tokens?: number;
  context_window?: number;
  ttft_ms?: number;
  tokens_per_second?: number;
}

/**
 * Ingests Artificial Analysis data covering quality, speed, and cost.
 *
 * Produces results across multiple dimensions: reasoning (quality),
 * latency (speed/TTFT), cost (pricing), and context (window size).
 */
export const artificialAnalysisIngester: BenchmarkIngester = {
  source: "artificial-analysis",
  displayName: "Artificial Analysis",
  description: "Quality, speed, and cost benchmarks from Artificial Analysis.",

  async ingest(options?: IngesterOptions): Promise<BenchmarkResult[]> {
    const url = options?.sourceUrl ?? DEFAULT_AA_URL;
    const response = await fetchWithRetry(url, { fetch: options?.fetch });
    const text = await response.text();
    const data = parseJsonSafe<AAModelEntry[]>(text, "Artificial Analysis");
    const now = new Date();
    const results: BenchmarkResult[] = [];
    const dims = options?.dimensions ? new Set<BenchmarkDimension>(options.dimensions) : null;

    let entries = data.filter((e) => e.model_id && e.provider);

    if (options?.modelFilter?.length) {
      const filterSet = new Set(options.modelFilter);
      entries = entries.filter((e) => filterSet.has(e.model_id));
    }

    for (const entry of entries) {
      const baseId = `artificial-analysis:${entry.model_id}`;

      if (entry.quality_score != null && (!dims || dims.has("reasoning"))) {
        results.push({
          id: `${baseId}:reasoning`,
          modelId: entry.model_id,
          providerKey: entry.provider.toLowerCase(),
          source: "artificial-analysis",
          dimension: "reasoning",
          score: Math.max(0, Math.min(100, entry.quality_score)),
          rawScore: entry.quality_score,
          metadata: { model_name: entry.model_name },
          measuredAt: now,
          ingestedAt: now,
        });
      }

      if ((entry.tokens_per_second != null || entry.ttft_ms != null) && (!dims || dims.has("latency"))) {
        const latencyScore = computeLatencyScore(
          entry.tokens_per_second,
          entry.ttft_ms,
        );
        results.push({
          id: `${baseId}:latency`,
          modelId: entry.model_id,
          providerKey: entry.provider.toLowerCase(),
          source: "artificial-analysis",
          dimension: "latency",
          score: latencyScore,
          rawScore: {
            tokens_per_second: entry.tokens_per_second,
            ttft_ms: entry.ttft_ms,
          },
          metadata: { model_name: entry.model_name },
          measuredAt: now,
          ingestedAt: now,
        });
      }

      if (
        (entry.price_per_million_input_tokens != null ||
          entry.price_per_million_output_tokens != null) &&
        (!dims || dims.has("cost"))
      ) {
        const costScore = computeCostScore(
          entry.price_per_million_input_tokens,
          entry.price_per_million_output_tokens,
        );
        results.push({
          id: `${baseId}:cost`,
          modelId: entry.model_id,
          providerKey: entry.provider.toLowerCase(),
          source: "artificial-analysis",
          dimension: "cost",
          score: costScore,
          rawScore: {
            input: entry.price_per_million_input_tokens,
            output: entry.price_per_million_output_tokens,
          },
          metadata: { model_name: entry.model_name },
          measuredAt: now,
          ingestedAt: now,
        });
      }

      if (entry.context_window != null && (!dims || dims.has("context"))) {
        const contextScore = computeContextScore(entry.context_window);
        results.push({
          id: `${baseId}:context`,
          modelId: entry.model_id,
          providerKey: entry.provider.toLowerCase(),
          source: "artificial-analysis",
          dimension: "context",
          score: contextScore,
          rawScore: entry.context_window,
          metadata: { model_name: entry.model_name },
          measuredAt: now,
          ingestedAt: now,
        });
      }
    }

    return options?.maxResults ? results.slice(0, options.maxResults) : results;
  },
};

/** Higher tokens/sec and lower TTFT = better. Scale 0-100. */
function computeLatencyScore(
  tokensPerSec?: number,
  ttftMs?: number,
): number {
  let score = 50;

  if (tokensPerSec != null) {
    score = Math.min(100, (tokensPerSec / 200) * 100);
  }

  if (ttftMs != null) {
    const ttftPenalty = Math.max(0, Math.min(30, (ttftMs - 200) / 100 * 10));
    score = Math.max(0, score - ttftPenalty);
  }

  return Math.round(score * 100) / 100;
}

/** Lower cost = higher score. $0/M = 100, $30/M = 0. */
function computeCostScore(
  inputCost?: number,
  outputCost?: number,
): number {
  const avgCost = ((inputCost ?? 0) + (outputCost ?? 0)) / 2;
  const score = Math.max(0, 100 - (avgCost / 30) * 100);
  return Math.round(score * 100) / 100;
}

/** Larger context = higher score. 1M tokens = 100. */
function computeContextScore(contextWindow: number): number {
  const score = Math.min(100, (contextWindow / 1_000_000) * 100);
  return Math.round(score * 100) / 100;
}
