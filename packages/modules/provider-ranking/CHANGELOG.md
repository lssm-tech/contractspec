# @contractspec/module.provider-ranking

## 0.7.24

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.contracts-integrations@3.8.17
  - @contractspec/lib.provider-ranking@0.7.18
  - @contractspec/lib.contracts-spec@6.0.0

## 0.7.23

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.contracts-integrations@3.8.16
  - @contractspec/lib.provider-ranking@0.7.17
  - @contractspec/lib.contracts-spec@5.7.0

## 0.7.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-integrations@3.8.15
  - @contractspec/lib.provider-ranking@0.7.16
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.schema@3.7.14

## 0.7.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-integrations@3.8.14
  - @contractspec/lib.provider-ranking@0.7.15
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.schema@3.7.14

## 0.7.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-integrations@3.8.13
  - @contractspec/lib.provider-ranking@0.7.14
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 0.7.19

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.contracts-integrations@3.8.12

## 0.7.18

### Patch Changes

- @contractspec/lib.contracts-integrations@3.8.11

## 0.7.17

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.contracts-integrations@3.8.10
  - @contractspec/lib.provider-ranking@0.7.13
  - @contractspec/lib.schema@3.7.14

## 0.7.16

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - @contractspec/lib.contracts-integrations@3.8.9
  - @contractspec/lib.provider-ranking@0.7.13
  - @contractspec/lib.schema@3.7.14

## 0.7.15

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-integrations@3.8.8
  - @contractspec/lib.provider-ranking@0.7.12
  - @contractspec/lib.schema@3.7.13

## 0.7.14

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-integrations@3.8.7
  - @contractspec/lib.provider-ranking@0.7.11
  - @contractspec/lib.schema@3.7.12

## 0.7.13

### Patch Changes

- chore: stability & release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.6
  - @contractspec/lib.provider-ranking@0.7.10
  - @contractspec/lib.schema@3.7.11

## 0.7.12

### Patch Changes

- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
  - @contractspec/lib.contracts-integrations@3.8.4
  - @contractspec/lib.schema@3.7.10

## 0.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.3
  - @contractspec/lib.provider-ranking@0.7.9
  - @contractspec/lib.schema@3.7.9

## 0.7.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-integrations@3.8.2
  - @contractspec/lib.provider-ranking@0.7.8
  - @contractspec/lib.schema@3.7.8

## 0.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.1
  - @contractspec/lib.provider-ranking@0.7.7
  - @contractspec/lib.schema@3.7.7

## 0.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.6
  - @contractspec/lib.provider-ranking@0.7.6
  - @contractspec/lib.schema@3.7.6

## 0.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-integrations@3.7.5
  - @contractspec/lib.provider-ranking@0.7.5
  - @contractspec/lib.schema@3.7.5

## 0.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.4
  - @contractspec/lib.provider-ranking@0.7.4
  - @contractspec/lib.schema@3.7.4

## 0.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.3
  - @contractspec/lib.provider-ranking@0.7.3
  - @contractspec/lib.schema@3.7.3

## 0.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
  - @contractspec/lib.contracts-integrations@3.7.2
  - @contractspec/lib.provider-ranking@0.7.2
  - @contractspec/lib.schema@3.7.2

## 0.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-integrations@3.7.1
  - @contractspec/lib.provider-ranking@0.7.1
  - @contractspec/lib.schema@3.7.1

## 0.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-integrations@3.7.0
  - @contractspec/lib.provider-ranking@0.7.0
  - @contractspec/lib.schema@3.7.0

## 0.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [ea320ea]
  - @contractspec/lib.contracts-integrations@3.6.0
  - @contractspec/lib.provider-ranking@0.6.0
  - @contractspec/lib.schema@3.6.0

## 0.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-integrations@3.5.5
  - @contractspec/lib.provider-ranking@0.5.5
  - @contractspec/lib.schema@3.5.5

## 0.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
  - @contractspec/lib.contracts-integrations@3.5.4
  - @contractspec/lib.provider-ranking@0.5.4
  - @contractspec/lib.schema@3.5.4

## 0.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-integrations@3.5.3
  - @contractspec/lib.provider-ranking@0.5.3
  - @contractspec/lib.schema@3.5.3

## 0.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-integrations@3.5.2
  - @contractspec/lib.provider-ranking@0.5.2
  - @contractspec/lib.schema@3.5.2

## 0.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-integrations@3.5.1
  - @contractspec/lib.provider-ranking@0.5.1
  - @contractspec/lib.schema@3.5.1

## 0.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-integrations@3.5.0
  - @contractspec/lib.provider-ranking@0.5.0
  - @contractspec/lib.schema@3.5.0

## 0.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-integrations@3.4.3
  - @contractspec/lib.provider-ranking@0.4.3
  - @contractspec/lib.schema@3.4.3

## 0.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-integrations@3.4.2
  - @contractspec/lib.provider-ranking@0.4.2
  - @contractspec/lib.schema@3.4.2

## 0.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-integrations@3.4.1
  - @contractspec/lib.provider-ranking@0.4.1
  - @contractspec/lib.schema@3.4.1

## 0.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
  - @contractspec/lib.contracts-integrations@3.4.0
  - @contractspec/lib.provider-ranking@0.4.0
  - @contractspec/lib.schema@3.4.0

## 0.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.3.0
  - @contractspec/lib.provider-ranking@0.3.0
  - @contractspec/lib.schema@3.3.0

## 0.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-integrations@3.2.0
  - @contractspec/lib.provider-ranking@0.2.0
  - @contractspec/lib.schema@3.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-integrations@3.1.1
  - @contractspec/lib.provider-ranking@0.1.1

## 0.1.1

### Patch Changes

- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-integrations@3.1.0
  - @contractspec/lib.schema@3.1.0
  - @contractspec/lib.provider-ranking@0.1.0
