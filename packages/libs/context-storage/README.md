# @contractspec/lib.context-storage

Website: https://contractspec.io/

**Context pack and snapshot storage primitives.**

Provides the store interface, domain types, and an in-memory implementation for managing context packs and snapshots. Packs describe curated sets of sources (docblocks, contracts, schemas); snapshots capture point-in-time materializations of those packs.

## Installation

```bash
bun add @contractspec/lib.context-storage
```

## Exports

- `.` -- Re-exports types, store interface, and in-memory implementation
- `./store` -- `ContextSnapshotStore` interface (upsertPack, createSnapshot, listPacks, etc.)
- `./in-memory-store` -- `InMemoryContextSnapshotStore` class
- `./types` -- Domain types: `ContextPackRecord`, `ContextSnapshotRecord`, `ContextSnapshotItem`, queries, and list results

## Usage

```ts
import { InMemoryContextSnapshotStore } from "@contractspec/lib.context-storage/in-memory-store";
import type { ContextPackRecord } from "@contractspec/lib.context-storage/types";

const store = new InMemoryContextSnapshotStore();

const pack: ContextPackRecord = {
  packKey: "onboarding",
  version: "1.0.0",
  title: "Onboarding Context Pack",
  tags: ["getting-started"],
  createdAt: new Date().toISOString(),
};

await store.upsertPack(pack);

const result = await store.listPacks({ tag: "getting-started" });
console.log(result.packs);
```
