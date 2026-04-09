# AI Agent Guide — `@contractspec/lib.personalization`

Scope: `packages/libs/personalization/*`

Mission: keep `@contractspec/lib.personalization` small, deterministic, and source-accurate. This package owns behavior telemetry primitives, analysis heuristics, overlay adaptation helpers, and the shared preference-dimensions contracts used by downstream runtimes.

## Public surface

Treat these exports as compatibility surface:

- Root barrel: `./src/index.ts`
- Runtime subpaths: `./adapter`, `./analyzer`, `./preference-dimensions`, `./store`, `./tracker`, `./types`
- Docs subpaths: `./docs`, `./docs/behavior-tracking.docblock`, `./docs/overlay-engine.docblock`, `./docs/workflow-composition.docblock`

Stable contracts readers are likely to depend on:

- `BehaviorEvent` and its event kinds: `field_access`, `feature_usage`, `workflow_step`
- `BehaviorStore` and `InMemoryBehaviorStore`
- `BehaviorTracker`, `createBehaviorTracker`, and tracker context/options
- `BehaviorAnalyzer`, `BehaviorAnalyzerOptions`, and analysis params
- `OverlaySuggestionOptions` and `WorkflowAdaptation`
- `PreferenceDimensions`, `PreferenceScope`, `ResolvedPreferenceProfile`, `PreferenceResolutionContext`, `BundlePreferenceAdapter`

## Change boundaries

- Treat exported types, functions, classes, and subpaths as compatibility surface.
- Keep `package.json` exports and published docs aligned with source.
- Do not document behavior that is not implemented in `src/`.
- Prefer additive changes over breaking changes.
- If a public entrypoint moves or changes shape, update both workspace exports and `publishConfig.exports`.

## Package invariants

- `BehaviorEvent` must remain backward-compatible. Older event payloads should remain parseable.
- `BehaviorStore` is the persistence boundary. Tracker and analyzer should not assume a specific storage implementation.
- Tracker context fields such as `tenantId`, `userId`, `role`, `device`, and `metadata` must propagate consistently into emitted events.
- Tracker buffering and flush behavior must stay predictable. `flush()` uses `bulkRecord()`, and `dispose()` must flush pending events after clearing timers.
- OpenTelemetry emission in `tracker.ts` is part of the package behavior. Do not remove or silently narrow it.
- Analyzer output must stay deterministic and explainable unless the package is intentionally redesigned.
- Adapter output must remain valid for `@contractspec/lib.overlay-engine` consumers.
- Preference-dimension contracts must stay aligned with downstream runtime consumers, especially `@contractspec/lib.surface-runtime`.

## Editing guidance by area

### Tracker

- Preserve batching, buffer thresholds, and `autoFlushIntervalMs` behavior.
- Keep event creation shape aligned with the `BehaviorEvent` union.
- Protect `flush()` and `dispose()` behavior with regression coverage if semantics change.
- Changes here affect telemetry, ingestion volume, and downstream event consumers.

### Store

- Preserve tenant scoping, query filtering, and summarize semantics.
- Keep `query()` and `summarize()` behavior consistent with `BehaviorQuery`.
- If adding new event kinds, update filtering and summarization deliberately.

### Analyzer

- Keep heuristics simple and explainable.
- Document any threshold changes in package docs and changelog.
- Add or adjust regression coverage when changing bottleneck detection, hidden-field suggestions, or layout inference.

### Adapter

- Keep overlay suggestions minimal, deterministic, and valid.
- Do not emit new overlay modification kinds unless the target overlay runtime supports them.
- Keep workflow adaptation output lightweight and descriptive rather than prescriptive.

### Preference model

- Treat `preference-dimensions.ts` as cross-package contract work.
- Check downstream consumers before changing dimension names, allowed values, scope order, or adapter contracts.
- Keep this file aligned with runtime consumers rather than inventing a parallel preference model here.

## Docs maintenance rules

- If exports or behavior semantics change, update `README.md`.
- If guardrails, invariants, or compatibility risks change, update `AGENTS.md`.
- Keep examples accurate to real imports and current behavior.
- Do not copy unrelated overlay-engine or workflow-composer implementation detail into this package's docs.
- `./docs*` entrypoints are documentation surfaces, not proof of additional runtime behavior.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
- Confirm `README.md` examples still match exported imports and current semantics.
- Confirm `package.json` exports still match the documented public surface.
