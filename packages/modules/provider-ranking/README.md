# @contractspec/module.provider-ranking

Website: https://contractspec.io/

**AI provider ranking module with persistence and pipeline orchestration**

AI provider ranking module for benchmarks, model rankings, and ingestion. Re-exports entities, storage adapters, and pipeline orchestration.

## Installation

```bash
bun add @contractspec/module.provider-ranking
```

## Exports

- `.` — Main entry: entities, storage, and pipelines
- `./entities` — Schema entities (BenchmarkResult, ModelRanking, IngestionRun)
- `./storage` — Postgres storage adapter (PostgresProviderRankingStore)
- `./pipeline` — IngestionPipeline and RankingPipeline orchestration

## Usage

```typescript
import {
  PostgresProviderRankingStore,
  RankingPipeline,
} from "@contractspec/module.provider-ranking";

const store = new PostgresProviderRankingStore({ database });
const ranking = new RankingPipeline({ store });

const result = await ranking.refresh();
```
