# @contractspec/example.data-grid-showcase

## 3.8.12

### Patch Changes

- Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch)
  - Migration: Keep the primitive `DataTable` lean and compose richer UX through the existing `toolbar` slot.; The examples now reset page index when search or status filters change so server-mode tables stay aligned with remote pagination.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.design-system@3.10.0
  - @contractspec/lib.presentation-runtime-react@36.0.8
  - @contractspec/lib.ui-kit-web@3.10.1

## 3.8.11

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.design-system@3.9.0
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.presentation-runtime-react@36.0.7

## 3.8.10

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.design-system@3.8.11
  - @contractspec/lib.presentation-runtime-react@36.0.6
  - @contractspec/lib.ui-kit-web@3.9.10
  - @contractspec/lib.schema@3.7.14

## 3.8.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-react@36.0.5
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.design-system@3.8.10
  - @contractspec/lib.ui-kit-web@3.9.9
  - @contractspec/lib.schema@3.7.14

## 3.8.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-react@36.0.4
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.design-system@3.8.9
  - @contractspec/lib.ui-kit-web@3.9.8
  - @contractspec/lib.schema@3.7.13

## 3.8.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-react@36.0.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8
  - @contractspec/lib.ui-kit-web@3.9.7
  - @contractspec/lib.schema@3.7.12

## 3.8.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-react@36.0.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7
  - @contractspec/lib.ui-kit-web@3.9.6
  - @contractspec/lib.schema@3.7.11

## 3.8.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.presentation-runtime-react@36.0.1
  - @contractspec/lib.ui-kit-web@3.9.5

## 3.8.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.schema@3.7.10
  - @contractspec/lib.design-system@3.8.5
  - @contractspec/lib.presentation-runtime-react@36.0.0
  - @contractspec/lib.ui-kit-web@3.9.4

## 3.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react@35.0.4
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4
  - @contractspec/lib.ui-kit-web@3.9.3
  - @contractspec/lib.schema@3.7.9

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.presentation-runtime-react@35.0.3
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3
  - @contractspec/lib.ui-kit-web@3.9.2
  - @contractspec/lib.schema@3.7.8

## 3.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react@35.0.2
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2
  - @contractspec/lib.ui-kit-web@3.9.1
  - @contractspec/lib.schema@3.7.7
