# AI Agent Guide — `@contractspec/lib.contracts-transformers`

Scope: `packages/libs/contracts-transformers/*`

Bidirectional transformations between ContractSpec and external API specification formats (OpenAPI, AsyncAPI, etc.).

## Quick Context

- **Layer**: lib
- **Consumers**: `lib.contracts-spec`, bundles, CLI

## Public Exports

- `.` — Public API (re-exports all formats)
- `./openapi` — OpenAPI 3.x transformations

## Architecture

```
src/
├── index.ts              # Public API (re-exports all formats)
├── openapi/              # OpenAPI 3.x transformations
│   ├── index.ts          # Module exports
│   ├── types.ts          # OpenAPI + mapping types
│   ├── parser.ts         # Parse JSON/YAML from file/URL
│   ├── importer.ts       # OpenAPI -> ContractSpec
│   ├── exporter.ts       # ContractSpec -> OpenAPI
│   ├── differ.ts         # Diff for sync operations
│   └── schema-converter.ts  # JSON Schema <-> SchemaModel
└── common/               # Shared utilities
    ├── index.ts
    ├── types.ts
    └── utils.ts
```

## Guardrails

- Core logic must be pure functions with no I/O.
- Preserve original transport metadata (path/query/header params) for accurate round-trips.
- Track provenance — where specs came from — for sync operations.
- `@contractspec/lib.contracts-spec` re-exports this library for existing consumers; avoid breaking that contract.

## Adding a New Format

1. Create `src/<format>/` directory
2. Implement: `types.ts`, `parser.ts`, `importer.ts`, `exporter.ts`, `differ.ts`
3. Export from `src/<format>/index.ts`
4. Re-export from `src/index.ts`
5. Update `bun.config.js` entry points
6. Update `package.json` exports

## Local Commands

- Build: `bun run build`
- Dev/watch: `bun run dev`
- Test: `bun test`
- Lint: `bun run lint:check`
