# AI Agent Guide — `@contractspec/lib.personalization`

Scope: `packages/libs/personalization/*`

Behavior tracking, analysis, and adaptation helpers. Bridges user behavior data with overlay-engine and knowledge for adaptive experiences.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, example apps

## Public Exports

- `.` — main entry
- `./adapter` — adaptation strategy interface
- `./analyzer` — behavior analysis logic
- `./docs` — documentation helpers
- `./preference-dimensions` — PreferenceDimensions, BundlePreferenceAdapter, ResolvedPreferenceProfile (bundle spec alignment)
- `./store` — behavior data store
- `./tracker` — event tracking interface
- `./types` — shared type definitions

## Bundle Spec Alignment

PreferenceDimensions and BundlePreferenceAdapter were added for alignment with `specs/contractspec_modules_bundle_spec_2026-03-08` (05_personalization_model). Surface-runtime and other bundles may consume these types. See `./preference-dimensions`.

## Guardrails

- Tracker interface is the adapter boundary — implementation details must not leak
- Behavior data schema must stay backward-compatible; older events must remain parseable
- Depends on bus, overlay-engine, and knowledge — coordinate cross-lib changes

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
