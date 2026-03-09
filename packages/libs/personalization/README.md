# @contractspec/lib.personalization

Website: https://contractspec.io/


Composable behavior tracking and personalization primitives for ContractSpec applications. The library provides trackers that capture feature usage, analyzers that transform raw events into adaptation hints, and adapters that feed personalized overlays or workflow tweaks.

## Modules

- `tracker` – lightweight tracker helpers that record field/feature/workflow usage.
- `store` – store abstractions plus an in-memory implementation.
- `analyzer` – stateless analyzers that convert usage data into insights.
- `adapter` – bridges insights into OverlaySpecs or WorkflowComposer extensions.

See `docs/tech/personalization/behavior-tracking.md` for full usage notes.

## Bundle spec / surface-runtime alignment

When using `@contractspec/lib.surface-runtime`, the types in `./preference-dimensions` are the canonical source for preference resolution:

- **`PreferenceDimensions`** — 7-dimension model (guidance, density, dataDepth, control, media, pace, narrative)
- **`BundlePreferenceAdapter`** — Interface for resolving and persisting preferences; surface-runtime's `resolvePreferenceProfile` consumes adapters implementing this interface
- **`ResolvedPreferenceProfile`** — Canonical values with source attribution; aligns with surface-runtime's adaptation output

Pass a `BundlePreferenceAdapter` implementation to `resolveBundle` options when integrating personalization with surface-runtime.















