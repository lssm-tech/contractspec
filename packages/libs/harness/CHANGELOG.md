# @contractspec/lib.harness

## 0.3.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.contracts-spec@6.1.0

## 0.3.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.contracts-spec@6.0.0

## 0.3.0

### Minor Changes

- Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.harness (minor), @contractspec/integration.harness-runtime (minor), @contractspec/app.cli-contractspec (minor), @contractspec/example.harness-lab (minor)

### Patch Changes

- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.contracts-spec@5.7.0

## 0.2.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-spec@5.6.0

## 0.2.15

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-spec@5.5.1

## 0.2.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0

## 0.2.13

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0

## 0.2.12

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0

## 0.2.11

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.contracts-spec@5.2.0

## 0.2.10

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0

## 0.2.9

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4

## 0.2.8

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3

## 0.2.7

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2

## 0.2.6

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1

## 0.2.5

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0

## 0.2.4

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3

## 0.2.3

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2

## 0.2.2

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
