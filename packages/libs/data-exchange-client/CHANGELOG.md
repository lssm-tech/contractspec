# @contractspec/lib.data-exchange-client

## 0.2.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.data-exchange-core@0.2.4
  - @contractspec/lib.ui-kit-web@3.12.1
  - @contractspec/lib.contracts-spec@5.7.0
  - @contractspec/lib.presentation-runtime-react@39.0.0

## 0.2.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Keep shared table string headers and cells as primitive render-model values so React Native table renderers can wrap them in Text.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
  - @contractspec/lib.data-exchange-core@0.2.3
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.presentation-runtime-react@38.0.3

## 0.2.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.data-exchange-core@0.2.2
  - @contractspec/lib.presentation-runtime-react@38.0.2
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.ui-kit-web@3.11.1

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - @contractspec/lib.presentation-runtime-react@38.0.1
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.data-exchange-core@0.2.1

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
