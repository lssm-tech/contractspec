# AI Agent Guide — `@contractspec/lib.contracts-spec`

Scope: `packages/libs/contracts-spec/*`

Foundational contract declarations, registries, capabilities, and shared execution primitives for ContractSpec.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root barrel for the public contract surface.
- The package is organized as many domain-specific subtrees exporting capabilities, commands, models, registries, and shared runtime helpers.
- High-volume subpath exports are intentional so consumers can depend on narrow contract surfaces without pulling the whole tree.
- `src/events.ts` is package-level event definitions.
- `src/types.ts` is shared public type definitions.

## Public Surface

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
- Export `./app-config/validation` resolves through `./src/app-config/validation.ts`.
- Export `./features/validation` resolves through `./src/features/validation.ts`.
- Export `./themes.validation` resolves through `./src/themes.validation.ts`.
- Export `./workspace-config` resolves through `./src/workspace-config/index.ts`.
- Export `./workspace-config/contractsrc-schema` resolves through `./src/workspace-config/contractsrc-schema.ts`.
- Export `./workspace-config/contractsrc-types` resolves through `./src/workspace-config/contractsrc-types.ts`.
- The package publishes 394 total exports in `package.json`, including the root `.` barrel and 393 subpath exports; keep docs aligned with `package.json`.

## Guardrails

- This is one of the highest-blast-radius libraries in the repo; export and type changes ripple everywhere.
- Contract, registry, and capability shapes are public API and must remain compatible or be versioned deliberately.
- Do not document or expose generated paths that are not actually exported from `package.json`.
- Keep the package README, package AGENTS guide, and `/llms/lib.contracts-spec` output aligned when public exports or authoring workflows change.
- Changes here can affect downstream packages such as `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
