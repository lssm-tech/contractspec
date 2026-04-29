# @contractspec/lib.context-storage

## 0.7.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
  - @contractspec/lib.contracts-spec@6.3.0

## 0.7.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.contracts-spec@6.2.0

## 0.7.19

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.contracts-spec@6.1.0

## 0.7.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.contracts-spec@6.0.0

## 0.7.17

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.contracts-spec@5.7.0

## 0.7.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-spec@5.6.0

## 0.7.15

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-spec@5.5.1

## 0.7.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0

## 0.7.13

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.

## 0.7.12

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime

## 0.7.11

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

## 0.7.10

### Patch Changes

- chore: stability & release

## 0.7.9

### Patch Changes

- fix: release

## 0.7.8

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type

## 0.7.7

### Patch Changes

- fix: release

## 0.7.6

### Patch Changes

- fix: release manifest

## 0.7.5

### Patch Changes

- ecf195a: fix: release security

## 0.7.4

### Patch Changes

- fix: release security

## 0.7.3

### Patch Changes

- fix: release

## 0.7.2

### Patch Changes

- 8cd229b: fix: release

## 0.7.1

### Patch Changes

- 5eb8626: fix: package exports

## 0.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

## 0.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

## 0.5.5

### Patch Changes

- 693eedd: chore: improve ai models

## 0.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming

## 0.5.3

### Patch Changes

- b0b4da6: fix: release

## 0.5.2

### Patch Changes

- 18df977: fix: release workflow

## 0.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime

## 0.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

## 0.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs

## 0.4.2

### Patch Changes

- 78d56a4: fix: release workflow

## 0.4.1

### Patch Changes

- 8f47829: fix: circular import issue

## 0.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

## 0.3.0

### Minor Changes

- 890a0da: fix: stability improvements

## 0.2.0

### Minor Changes

- a281fc5: fix: missing dependencies
