# @lssm/lib.personalization

Composable behavior tracking and personalization primitives for ContractSpec applications. The library provides trackers that capture feature usage, analyzers that transform raw events into adaptation hints, and adapters that feed personalized overlays or workflow tweaks.

## Modules

- `tracker` – lightweight tracker helpers that record field/feature/workflow usage.
- `store` – store abstractions plus an in-memory implementation.
- `analyzer` – stateless analyzers that convert usage data into insights.
- `adapter` – bridges insights into OverlaySpecs or WorkflowComposer extensions.

See `docs/tech/personalization/behavior-tracking.md` for full usage notes.















