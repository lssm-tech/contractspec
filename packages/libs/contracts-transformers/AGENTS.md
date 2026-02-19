# AI Agent Guide — `@contractspec/lib.contracts-transformers`

Scope: `packages/libs/contracts-transformers/*`

This library handles **bidirectional transformations** between ContractSpec and external API specification formats (OpenAPI, AsyncAPI, etc.).

## Architecture

The library is organized by format, with each format having its own module:

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

## Key Principles

1. **Pure transformations**: Core logic should be pure functions with no I/O
2. **Transport hints**: Preserve original transport metadata (path/query/header params) for accurate round-trips
3. **Provenance tracking**: Track where specs came from for sync operations
4. **Backwards compatibility**: `@contractspec/lib.contracts-spec` re-exports this library for existing consumers

## Adding a New Format

To add support for a new format (e.g., AsyncAPI):

1. Create `src/asyncapi/` directory
2. Implement: `types.ts`, `parser.ts`, `importer.ts`, `exporter.ts`, `differ.ts`
3. Export from `src/asyncapi/index.ts`
4. Re-export from `src/index.ts`
5. Update `bun.config.js` entry points
6. Update `package.json` exports

## Local Commands

- Build: `bun run build`
- Dev/watch: `bun run dev`
- Test: `bun test`
- Lint: `bun run lint:check`

