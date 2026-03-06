# @contractspec/app.registry-server

Website: https://contractspec.io/

**ContractSpec and LSSM registry HTTP server**

Elysia HTTP server that serves registry manifests and items for ContractSpec and LSSM. Static JSON endpoints for manifests and per-item lookups. No database; reads from built registry files.

## Installation / Running

From the monorepo root:

```bash
bun install
bun run dev --filter=@contractspec/app.registry-server
```

Or from this directory:

```bash
bun install
bun run dev
```

Default port: `8090` (override with `PORT`).

## Entry Point

- `src/index.ts` — Imports and runs `src/server.ts`

## Routes

- `/health`, `/healthz` — Health checks
- `/` — Root with route listing
- `/r/lssm.json` — LSSM registry manifest
- `/r/lssm/:name` — LSSM registry item by name
- `/r/contractspec.json` — ContractSpec registry manifest
- `/r/contractspec/:type/:name` — ContractSpec registry item by type and name

## Build

- `bun run build` — Compiles to standalone `dist/server` binary (Bun target)
