# AI Agent Guide — `@contractspec/example.opencode-cli`

Scope: `packages/examples/opencode-cli/*`

OpenCode CLI example showing agent-mode contract building and validation.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/opencode-cli.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts/opencode` resolves through `./src/contracts/opencode.contracts.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/opencode-cli.docblock` resolves through `./src/docs/opencode-cli.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./opencode-cli.feature` resolves through `./src/opencode-cli.feature.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`.

## Local Commands

- `bun run build` — bun ../../apps/cli-contractspec/src/cli.ts build src/contracts/opencode.contracts.ts --agent-mode opencode
- `bun run validate` — bun ../../apps/cli-contractspec/src/cli.ts validate src/contracts/opencode.contracts.ts --check-implementation --agent-mode opencode
- `bun run typecheck` — tsc --noEmit
- `bun run test` — bun test
- `bun run smoke` — bun test src/example.smoke.test.ts
- `bun run preflight` — bun run build && bun run typecheck && bun run test && bun run validate && bun run smoke
