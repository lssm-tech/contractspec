# Implementation Plan: TypeScript API and Package Skeleton

- **Spec:** 12_typescript_api_and_package_skeleton.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Delivers the public API surface and ensures the package skeleton is buildable, typechecks, and follows adapter boundaries. This is the Phase 0 deliverable.

## Objectives

1. Implement public API: defineModuleBundle, resolveBundle, applySurfacePatch, BundleProvider, BundleRenderer.
2. Ensure package-skeleton builds and typechecks.
3. Ensure no direct third-party UI imports outside src/adapters/.
4. Add basic docs and usage examples.
5. Add lints: missing verification, undeclared slots, missing renderers.

## Non-goals (v1)

- Full implementation of all APIs (stubs acceptable for Phase 0).
- All adapters implemented (stubs).
- Published package (local scaffold first).

## Codebase alignment

- Package at packages/libs/surface-runtime (or use package-skeleton as template).
- Exports per 02_package_strategy.md.
- Follow contractspec-bun-build if used elsewhere.

## Workstreams

### WS1 — Public API

- [x] Export defineModuleBundle from ./spec.
- [x] Export resolveBundle, applySurfacePatch from ./runtime.
- [x] Export BundleProvider, BundleRenderer from ./react.
- [x] Ensure barrel exports in index.ts.
- [x] Add JSDoc for public functions.

### WS2 — Package scaffold

- [x] package.json with correct name, dependencies, exports.
- [x] tsconfig.json with strict mode.
- [x] src/ structure: spec/, runtime/, react/, adapters/.
- [x] Build script (tsc or contractspec-bun-build).
- [x] Example bundle (pm-workbench.bundle.ts) typechecks.

### WS3 — Validation and lints

- [x] Add validator: every surface has verification block.
- [x] Add validator: no undeclared slots in layouts.
- [x] Add lint or check: missing renderers for node kinds.
- [x] Document adapter rule; add lint to enforce.

## Dependencies

- 00_foundation (package strategy).
- 01_core_bundle (types).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| API churn | Keep v0.1.0; document breaking change policy. |
| Skeleton diverges from real package | Use skeleton as initial scaffold; replace with real impl. |

## Implementation notes (2026-03-08)

| Deliverable | Location |
|-------------|----------|
| `validateLayoutSlots` | `src/spec/validate-bundle.ts` — integrated into `defineModuleBundle` |
| `validateBundleNodeKinds` | `src/spec/validate-bundle.ts` — exported from `./spec` |
| Example bundle | `src/examples/pm-workbench.bundle.ts` |
| Adapter lint script | `scripts/lint-adapters.mjs` — run via `bun run lint:adapters` |
| Adapter rule docs | `README.md` — "Adapter Rule (Lint)" section |
| Changeset | `.changeset/feat-api-skeleton.md` |
