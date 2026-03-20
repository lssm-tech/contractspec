# @contractspec/example.opencode-cli

**OpenCode CLI example showing agent-mode contract building and validation.**

## What This Demonstrates

- Agent-mode (`--agent-mode opencode`) contract compilation.
- Implementation checking via `--check-implementation`.
- Private package pattern (not published).
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/opencode-cli`:
- `bun run build`

## Usage

Use `@contractspec/example.opencode-cli` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/opencode-cli.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts/opencode` resolves through `./src/contracts/opencode.contracts.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/opencode-cli.docblock` resolves through `./src/docs/opencode-cli.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./opencode-cli.feature` resolves through `./src/opencode-cli.feature.ts`.

## Local Commands

- `bun run build` — bun ../../apps/cli-contractspec/src/cli.ts build src/contracts/opencode.contracts.ts --agent-mode opencode
- `bun run validate` — bun ../../apps/cli-contractspec/src/cli.ts validate src/contracts/opencode.contracts.ts --check-implementation --agent-mode opencode

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Stability.
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`.
