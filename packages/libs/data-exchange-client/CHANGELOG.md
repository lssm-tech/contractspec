# @contractspec/lib.data-exchange-client

## 0.2.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.data-exchange-core@0.2.1
  - @contractspec/lib.presentation-runtime-react@38.0.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit-web@3.10.3

## 0.2.0

### Minor Changes

- Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
  - Packages: @contractspec/lib.data-exchange-core (minor), @contractspec/lib.data-exchange-server (minor), @contractspec/lib.data-exchange-client (minor), @contractspec/lib.exporter (patch)
  - Migration: Keep `lib.exporter` only for legacy payload callers; build new import/export flows on the new core/server/client package family.; The old payload shape remains valid, with CSV/XML preserved and JSON added.
  - Deprecations: `@contractspec/lib.exporter` remains as a compatibility shim; prefer `@contractspec/lib.data-exchange-core` for new import/export work.

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
  - @contractspec/lib.presentation-runtime-react@37.0.0
  - @contractspec/lib.ui-kit-web@3.10.2
  - @contractspec/lib.data-exchange-core@0.2.0

## 0.1.0

### Minor Changes

- Initial release of data-exchange controllers and web/native UI surfaces.
