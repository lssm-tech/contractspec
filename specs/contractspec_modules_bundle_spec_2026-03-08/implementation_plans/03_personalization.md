# Implementation Plan: Personalization Model

- **Spec:** 05_personalization_model.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Integrates the surface runtime with the 7-dimension preference model. PreferenceDimensions are documented but not yet in lib.personalization; surface runtime may own them initially.

## Objectives

1. Implement ResolvedPreferenceProfile and BundlePreferenceAdapter interface.
2. Implement preference resolution at user, workspace-user, bundle, surface, entity, session scopes.
3. Map each dimension to runtime behavior (guidance, density, dataDepth, control, media, pace, narrative).
4. Integrate with overlay-engine for layout snapshot persistence (distinct from preferences).

## Non-goals (v1)

- Migrating PreferenceDimensions into lib.personalization (optional later).
- Full preset system (executive, analyst, builder, etc.).
- Constraint resolution with capability gates (stub first).

## Codebase alignment

- Preference model in `references/current_specs/01_preference_dimensions.md`.
- lib.personalization has BehaviorEvent, not PreferenceDimensions.
- lib.overlay-engine for overlay persistence.

## Workstreams

### WS1 — Preference types and adapter

- [x] Implement PreferenceDimensions type (from 01_preference_dimensions.md).
- [x] Implement ResolvedPreferenceProfile with sourceByDimension, constrained.
- [x] Implement BundlePreferenceAdapter interface.
- [x] Add stub implementation for resolver.

### WS2 — Scope resolution

- [x] Implement scope order: global user → workspace-user → bundle → surface → entity → session.
- [x] Add constraint resolution stub (capability gates, device, performance).
- [x] Document distinction: preference vs layout snapshot vs view vs overlay.

### WS3 — Dimension mapping

- [x] Document runtime behavior per dimension for each surface kind.
- [x] Add verification block requirement to SurfaceSpec.
- [x] Implement savePreferencePatch (stub or integrate with overlay-engine).

## Dependencies

- 01_core_bundle (PreferenceDimensions in BundleContext).
- 02_resolution_runtime (preference step in pipeline).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| PreferenceDimensions drift from spec | Single source in types; reference doc for values. |
| Overlay vs preference confusion | Explicit docs; separate storage. |

## Implementation notes (completed)

- **Types** (`spec/types.ts`): `PreferenceScope`, `ResolvedPreferenceProfile` (canonical, sourceByDimension, constrained, notes), `BundlePreferenceAdapter`.
- **Resolver** (`runtime/resolve-preferences.ts`): `resolvePreferenceProfile`, `mergeByScope`, `resolveConstraints` (stub). Scope order: user → workspace-user → bundle → surface → entity → session.
- **Adapter** (`runtime/preference-adapter.ts`): `defaultPreferenceAdapter` with `resolve()` and `savePreferencePatch()` (stub).
- **Pipeline** (`runtime/resolve-bundle.ts`): `buildAdaptation` uses `profile.canonical` and `profile.notes`.
- **Docs** (`README.md`): Preference vs layout vs view vs overlay; scope resolution order; dimension → runtime behavior table.
- **Tests** (`runtime/resolve-preferences.test.ts`): Profile shape, canonical dimensions, adapter resolve/savePreferencePatch.
