# @contractspec/lib.data-exchange-server

## 0.2.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.data-exchange-core@0.2.5
  - @contractspec/lib.contracts-spec@6.0.0

## 0.2.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.data-exchange-core@0.2.4
  - @contractspec/lib.contracts-spec@5.7.0

## 0.2.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.data-exchange-core@0.2.3
  - @contractspec/lib.contracts-spec@5.6.0

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.data-exchange-core@0.2.2
  - @contractspec/lib.contracts-spec@5.5.1

## 0.2.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.data-exchange-core@0.2.1
  - @contractspec/lib.contracts-spec@5.5.0

## 0.2.0

### Minor Changes

- Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
  - Packages: @contractspec/lib.data-exchange-core (minor), @contractspec/lib.data-exchange-server (minor), @contractspec/lib.data-exchange-client (minor), @contractspec/lib.exporter (patch)
  - Migration: Keep `lib.exporter` only for legacy payload callers; build new import/export flows on the new core/server/client package family.; The old payload shape remains valid, with CSV/XML preserved and JSON added.
  - Deprecations: `@contractspec/lib.exporter` remains as a compatibility shim; prefer `@contractspec/lib.data-exchange-core` for new import/export work.

### Patch Changes

- Updated dependencies because of Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
  - @contractspec/lib.data-exchange-core@0.2.0

## 0.1.0

### Minor Changes

- Initial release of server adapters and execution services for data interchange.
