# @contractspec/lib.mobile-control

## 0.2.11

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add provider delta contracts, Google Drive knowledge ingestion, and governed mutation execution for workspace knowledge.
  - @contractspec/lib.builder-spec@0.2.11
  - @contractspec/lib.provider-spec@0.2.9
  - @contractspec/lib.contracts-spec@6.4.0

## 0.2.10

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
  - @contractspec/lib.builder-spec@0.2.10
  - @contractspec/lib.provider-spec@0.2.8
  - @contractspec/lib.contracts-spec@6.3.0

## 0.2.9

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.builder-spec@0.2.9
  - @contractspec/lib.provider-spec@0.2.7
  - @contractspec/lib.contracts-spec@6.2.0

## 0.2.8

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.builder-spec@0.2.8
  - @contractspec/lib.provider-spec@0.2.6
  - @contractspec/lib.contracts-spec@6.1.0

## 0.2.7

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.builder-spec@0.2.7
  - @contractspec/lib.provider-spec@0.2.5
  - @contractspec/lib.contracts-spec@6.0.0

## 0.2.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.builder-spec@0.2.6
  - @contractspec/lib.provider-spec@0.2.4
  - @contractspec/lib.contracts-spec@5.7.0

## 0.2.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.builder-spec@0.2.5
  - @contractspec/lib.provider-spec@0.2.3
  - @contractspec/lib.contracts-spec@5.6.0

## 0.2.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.builder-spec@0.2.4
  - @contractspec/lib.provider-spec@0.2.2
  - @contractspec/lib.contracts-spec@5.5.1

## 0.2.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.builder-spec@0.2.3
  - @contractspec/lib.provider-spec@0.2.1
  - @contractspec/lib.contracts-spec@5.5.0

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.builder-spec@0.2.2

## 0.2.1

### Patch Changes

- @contractspec/lib.builder-spec@0.2.1

## 0.2.0

### Minor Changes

- Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
  - Packages: @contractspec/lib.builder-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.provider.gemini (minor), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.library (patch)
- Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
  - Packages: @contractspec/lib.contracts-spec (patch), @contractspec/lib.builder-spec (minor), @contractspec/lib.provider-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime (minor), @contractspec/integration.runtime.managed (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.runtime.hybrid (minor), @contractspec/integration.builder-telegram (minor), @contractspec/integration.builder-voice (minor), @contractspec/integration.builder-whatsapp (minor), @contractspec/integration.provider.codex (minor), @contractspec/integration.provider.claude-code (minor), @contractspec/integration.provider.gemini (minor), @contractspec/integration.provider.copilot (minor), @contractspec/integration.provider.stt (minor), @contractspec/integration.provider.local-model (minor)

### Patch Changes

- Updated dependencies because of Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
  - @contractspec/lib.builder-spec@0.2.0
  - @contractspec/lib.provider-spec@0.2.0
