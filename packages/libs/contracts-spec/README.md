# @contractspec/lib.contracts-spec

**Foundational contract declarations, registries, capabilities, and shared execution primitives for ContractSpec.**

## What It Provides

- Defines the core spec model used by nearly every package in the monorepo.
- Publishes capability, contract, registry, control-plane, ACP, and agent-facing contract surfaces.
- Recently expanded with harness-related contract surfaces and richer AI-native runtime capabilities.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/lib.contracts-spec`

or

`bun add @contractspec/lib.contracts-spec`

## Usage

Import the root entrypoint from `@contractspec/lib.contracts-spec`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root barrel for the public contract surface.
- The package is organized as many domain-specific subtrees exporting capabilities, commands, models, registries, and shared runtime helpers.
- High-volume subpath exports are intentional so consumers can depend on narrow contract surfaces without pulling the whole tree.
- `src/events.ts` is package-level event definitions.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Exports the root barrel plus hundreds of domain-specific subpath exports for ACP, agent, control-plane, capabilities, commands, registries, and shared helpers.
- Export `.` resolves through `./src/index.ts`.
- Export `./acp` resolves through `./src/acp/index.ts`.
- Export `./acp/acp.feature` resolves through `./src/acp/acp.feature.ts`.
- Export `./acp/capabilities` resolves through `./src/acp/capabilities/index.ts`.
- Export `./acp/capabilities/acpTransport.capability` resolves through `./src/acp/capabilities/acpTransport.capability.ts`.
- Export `./acp/commands` resolves through `./src/acp/commands/index.ts`.
- Export `./acp/commands/acpFsAccess.command` resolves through `./src/acp/commands/acpFsAccess.command.ts`.
- Export `./acp/commands/acpPromptTurn.command` resolves through `./src/acp/commands/acpPromptTurn.command.ts`.
- Export `./acp/commands/acpSessionInit.command` resolves through `./src/acp/commands/acpSessionInit.command.ts`.
- Export `./acp/commands/acpSessionResume.command` resolves through `./src/acp/commands/acpSessionResume.command.ts`.
- The package publishes 549 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
- `bun run registry:build` — bun run scripts/build-registry.ts
- `bun run readme:inventory` — bun run scripts/update-readme-contract-inventory.ts

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add a first-class harness system for controlled inspection, testing, evaluation, and proof generation.
- Add data visualization capabilities.
- Add table capabilities.
- Stability.
- Agentic workflows — subagents, memory tools, and next steps.

## Notes

- **HIGHEST blast radius in the monorepo** — treat every change as a potential breaking change.
- Contract type definitions are public API; do not alter shapes without a migration plan.
- Registry interfaces must stay backward-compatible.
- Do not edit `dist/` directly.
