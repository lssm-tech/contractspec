# @contractspec/module.context-storage

Website: https://contractspec.io/

**Context storage module with persistence adapters**

Context storage module for packs, snapshots, and items. Re-exports entities, storage adapters, and the context-snapshot pipeline.

## Installation

```bash
bun add @contractspec/module.context-storage
```

## Exports

- `.` — Main entry: entities, storage, and pipeline
- `./entities` — Schema entities (ContextPack, ContextSnapshot, ContextSnapshotItem)
- `./storage` — Postgres storage adapter (PostgresContextStorage)
- `./pipeline` — ContextSnapshotPipeline for building snapshots from packs

## Usage

```typescript
import {
  PostgresContextStorage,
  ContextSnapshotPipeline,
} from "@contractspec/module.context-storage";

const store = new PostgresContextStorage({ database });
const pipeline = new ContextSnapshotPipeline({ store });

const result = await pipeline.buildSnapshot({
  pack,
  snapshot,
  items,
  index: true,
});
```
