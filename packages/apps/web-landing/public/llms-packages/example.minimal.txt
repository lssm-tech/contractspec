# @contractspec/example.minimal

**Minimal ContractSpec example showing the simplest possible contract definition and build.**

## What This Demonstrates

- Bare-minimum contract definition (user contract).
- `contractspec build` and `contractspec validate` CLI usage.
- Maintained example package included in the ContractSpec example registry.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/minimal`:
- `bun run build`
- `bun run test`
- `bun run typecheck`
- `bun run smoke`
- `bun run preflight`

## Usage

Use `@contractspec/example.minimal` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/minimal.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/minimal.docblock` resolves through `./src/docs/minimal.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./minimal.feature` resolves through `./src/minimal.feature.ts`.
- Export `./contracts/user` resolves through `./src/contracts/user.ts`.

## Local Commands

- `bun run build` — bun ../../apps/cli-contractspec/src/cli.ts build src/contracts/user.ts
- `bun run validate` — bun ../../apps/cli-contractspec/src/cli.ts validate src/contracts/user.ts
- `bun run typecheck` — tsc --noEmit
- `bun run test` — bun test
- `bun run smoke` — bun test src/example.smoke.test.ts
- `bun run preflight` — bun run build && bun run typecheck && bun run test && bun run validate && bun run smoke

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Stability.
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`.
