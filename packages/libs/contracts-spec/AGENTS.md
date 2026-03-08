# AI Agent Guide — `@contractspec/lib.contracts-spec`

Scope: `packages/libs/contracts-spec/*`

Core contract declarations, registries, and shared execution primitives — the foundation of the monorepo.

## Quick Context

- **Layer**: lib
- **Consumers**: nearly every package in the monorepo

## Public Exports

- `.` — main entry
- `./app-config`
- `./capabilities`
- `./contract-registry`
- `./control-plane`
- 440+ additional subpath exports (domain contracts, schemas, runtime helpers)

## Bundle Spec Alignment

`FeatureModuleSpec` and `defineFeature` align with `specs/contractspec_modules_bundle_spec_2026-03-08`. Bundle `requires` keys (e.g. `ai-chat`) should match `FeatureModuleSpec.meta.key`. See README "Bundle requires alignment".

## Guardrails

- **HIGHEST blast radius in the monorepo** — treat every change as a potential breaking change.
- Contract type definitions are public API; do not alter shapes without a migration plan.
- Registry interfaces must stay backward-compatible.
- Do not edit `dist/` directly.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
