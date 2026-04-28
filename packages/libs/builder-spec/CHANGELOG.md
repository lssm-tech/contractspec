# @contractspec/lib.builder-spec

## 0.2.8

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.execution-lanes@0.1.9
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
  - @contractspec/lib.execution-lanes@0.1.8
  - @contractspec/lib.provider-spec@0.2.5
  - @contractspec/lib.contracts-spec@6.0.0

## 0.2.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.execution-lanes@0.1.7
  - @contractspec/lib.provider-spec@0.2.4
  - @contractspec/lib.contracts-spec@5.7.0

## 0.2.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.execution-lanes@0.1.6
  - @contractspec/lib.provider-spec@0.2.3
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.schema@3.7.14

## 0.2.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.execution-lanes@0.1.5
  - @contractspec/lib.provider-spec@0.2.2
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.schema@3.7.14

## 0.2.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.execution-lanes@0.1.4
  - @contractspec/lib.provider-spec@0.2.1
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.execution-lanes@0.1.3

## 0.2.1

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.execution-lanes@0.1.2

## 0.2.0

### Minor Changes

- Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
  - Packages: @contractspec/lib.builder-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.provider.gemini (minor), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.library (patch)
- Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
  - Packages: @contractspec/lib.contracts-spec (patch), @contractspec/lib.builder-spec (minor), @contractspec/lib.provider-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime (minor), @contractspec/integration.runtime.managed (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.runtime.hybrid (minor), @contractspec/integration.builder-telegram (minor), @contractspec/integration.builder-voice (minor), @contractspec/integration.builder-whatsapp (minor), @contractspec/integration.provider.codex (minor), @contractspec/integration.provider.claude-code (minor), @contractspec/integration.provider.gemini (minor), @contractspec/integration.provider.copilot (minor), @contractspec/integration.provider.stt (minor), @contractspec/integration.provider.local-model (minor)

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.execution-lanes@0.1.1
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.provider-spec@0.2.0
  - @contractspec/lib.schema@3.7.14
