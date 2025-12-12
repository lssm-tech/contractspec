# AI Agent Guide (AGENTS.md)

This repository is **ContractSpec**: the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. **You keep your app. You own the code.** ContractSpec is the compiler, not the prison.

If you’re an AI agent working in this repo, use these instructions as your default operating rules. More specific rules may exist in nested `AGENTS.md` files.

## Mission (do not drift)

**ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.**

Keep changes aligned with `.cursor/rules/contractspec-mission.mdc`: prefer spec-first work, enforce invariants, avoid lock-in, and keep outputs ejectable and based on standard tech.

## How to make changes (repo-wide)

- Prefer updating **contracts/specs** over editing generated artifacts; ContractSpec should remain the source of truth across surfaces.
- Keep behavior **deterministic** (no hidden state, timestamped outputs, or “magic” runtime dependencies).
- Favor **incremental adoption** patterns: stabilize one module/endpoint/model at a time.
- Avoid introducing proprietary formats, hidden runtimes, or abstractions that reduce ejectability.
- When touching code, keep edits minimal and consistent with surrounding style; run the narrowest relevant checks (lint/build) if available.

## Monorepo basics

- Package manager: `bun` (see `package.json#packageManager`).
- Task runner: `turbo` (`bun run dev`, `bun run build`, `bun run lint`, etc.).
- Workspace layout:
  - `packages/apps/*`: runnable apps (API, web, CLIs, workers)
  - `packages/libs/*`: core libraries (contracts, schema, docs, etc.)
  - `packages/bundles/*`: composed “product” bundles used by apps

## MCP endpoints and handlers

ContractSpec exposes dedicated MCP servers to keep agents scoped and efficient:

- **Docs MCP**: `/api/mcp/docs` (also mounted at `/mcp/docs`)
- **CLI MCP**: `/api/mcp/cli` (also mounted at `/mcp/cli`)
- **Internal MCP**: `/api/mcp/internal` (also mounted at `/mcp/internal`)

Implementation notes:

- HTTP routing for these endpoints lives in `packages/apps/api-contractspec/src/handlers/mcp-handler.ts`.
- The handlers are created from `@lssm/bundle.contractspec-studio/application` (`createDocsMcpHandler`, `createCliMcpHandler`, `createInternalMcpHandler`).
- If you add/change an MCP surface, update:
  - `packages/apps/api-contractspec/src/handlers/mcp-handler.ts` (routes)
  - `packages/apps/api-contractspec/src/server.ts` (startup logs / mounted endpoints)
  - `packages/libs/contracts/src/docs/tech/mcp-endpoints.docblock.ts` (docs reference)

## Nested `AGENTS.md` (important)

`AGENTS.md` files are **scoped to the directory tree they live in**. When working in a subdirectory, check for a closer (nested) `AGENTS.md` and follow it in preference to this file.

Add nested `AGENTS.md` files when a package/module needs extra constraints (e.g., generation boundaries, code style rules, or run/test commands).
