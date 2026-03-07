# @contractspec/lib.runtime-sandbox

Website: https://contractspec.io/

**Browser-friendly database abstraction with lazy-loaded PGLite.**

Provides a `DatabasePort` interface and a PGLite adapter for running PostgreSQL-compatible queries in the browser. The adapter is lazy-loaded to avoid bundle bloat for consumers that don't need it.

## Installation

```bash
bun add @contractspec/lib.runtime-sandbox
```

## Exports

- `.` -- `DatabasePort`, `DatabaseAdapterFactory`, `createPGLiteAdapter()`, `web` namespace, and core types

## Usage

```ts
import { createPGLiteAdapter } from "@contractspec/lib.runtime-sandbox";

const db = await createPGLiteAdapter();
await db.init();

await db.execute("CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT)");
await db.execute("INSERT INTO users VALUES ('1', 'Alice')");

const result = await db.query("SELECT * FROM users");
console.log(result.rows);
```

### Web namespace

```ts
import { web } from "@contractspec/lib.runtime-sandbox";
```

The `web` namespace provides browser-specific utilities for the sandbox runtime.
