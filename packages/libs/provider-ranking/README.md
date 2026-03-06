# @contractspec/lib.provider-ranking

Website: https://contractspec.io/

**AI provider ranking: benchmark ingestion, scoring, and model comparison.**

Ingests benchmark data from multiple sources (Chatbot Arena, SWE-bench, Artificial Analysis, Open LLM Leaderboard), normalizes scores to a 0-100 scale, and computes composite rankings across dimensions like coding, reasoning, cost, and latency.

## Installation

```bash
bun add @contractspec/lib.provider-ranking
```

## Exports

- `.` -- Core types, store interface, and in-memory store
- `./types` -- `BenchmarkResult`, `ModelRanking`, `ModelProfile`, `BenchmarkDimension`, `DimensionWeightConfig`
- `./store` -- `ProviderRankingStore` interface
- `./in-memory-store` -- `InMemoryProviderRankingStore` class
- `./scoring` -- `computeModelRankings()`, `normalizeScore()`, `DEFAULT_DIMENSION_WEIGHTS`
- `./ingesters` -- `chatbotArenaIngester`, `sweBenchIngester`, `artificialAnalysisIngester`, `IngesterRegistry`
- `./eval` -- `EvalRunner`, `EvalSuite`, `EvalCase` for custom evaluation

## Usage

```ts
import { InMemoryProviderRankingStore } from "@contractspec/lib.provider-ranking/in-memory-store";
import { createDefaultIngesterRegistry } from "@contractspec/lib.provider-ranking/ingesters";
import { computeModelRankings } from "@contractspec/lib.provider-ranking/scoring";

const store = new InMemoryProviderRankingStore();
const registry = createDefaultIngesterRegistry();

const ingester = registry.get("swe-bench");
const results = await ingester.ingest();

for (const result of results) {
  await store.addBenchmarkResult(result);
}

const rankings = computeModelRankings(await store.listBenchmarkResults({}));
console.log(rankings);
```
