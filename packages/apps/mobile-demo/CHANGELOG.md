# @contractspec/app.expo-demo

## 1.1.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add a shared marketing content/navigation surface and convert the Expo demo into a native public-nav companion for the ContractSpec OSS-first story.
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Updated dependencies because of Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.presentation-runtime-react-native@38.0.0
  - @contractspec/lib.ui-kit-core@3.8.1
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit@3.9.3
  - @contractspec/bundle.marketing@3.8.15
  - @contractspec/lib.presentation-runtime-core@5.0.0
  - @contractspec/lib.schema@3.7.14

## 1.1.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - @contractspec/lib.presentation-runtime-react-native@37.0.0
  - @contractspec/lib.ui-kit@3.9.2
  - @contractspec/lib.presentation-runtime-core@4.0.0

## 1.1.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.presentation-runtime-core@3.9.8
  - @contractspec/lib.presentation-runtime-react-native@36.0.7
  - @contractspec/lib.ui-kit@3.9.1

## 1.1.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.ui-kit-core@3.8.0
  - @contractspec/lib.ui-kit@3.9.0
  - @contractspec/lib.presentation-runtime-core@3.9.7
  - @contractspec/lib.presentation-runtime-react-native@36.0.6

## 1.1.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.presentation-runtime-core@3.9.6
  - @contractspec/lib.presentation-runtime-react-native@36.0.5
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.ui-kit@3.8.10
  - @contractspec/lib.schema@3.7.14
  - @contractspec/lib.ui-kit-core@3.7.13

## 1.1.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-react-native@36.0.4
  - @contractspec/lib.presentation-runtime-core@3.9.5
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.ui-kit-core@3.7.13
  - @contractspec/lib.schema@3.7.14
  - @contractspec/lib.ui-kit@3.8.9

## 1.1.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-react-native@36.0.3
  - @contractspec/lib.presentation-runtime-core@3.9.4
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.ui-kit-core@3.7.12
  - @contractspec/lib.schema@3.7.13
  - @contractspec/lib.ui-kit@3.8.8

## 1.1.15

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-react-native@36.0.2
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.ui-kit-core@3.7.11
  - @contractspec/lib.schema@3.7.12
  - @contractspec/lib.ui-kit@3.8.7

## 1.1.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-react-native@36.0.1
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.ui-kit-core@3.7.10
  - @contractspec/lib.schema@3.7.11
  - @contractspec/lib.ui-kit@3.8.6

## 1.1.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.presentation-runtime-core@3.9.1
  - @contractspec/lib.presentation-runtime-react-native@36.0.1
  - @contractspec/lib.ui-kit@3.8.6

## 1.1.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0
  - @contractspec/lib.schema@3.7.10
  - @contractspec/lib.presentation-runtime-react-native@36.0.0
  - @contractspec/lib.ui-kit@3.8.5

## 1.1.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react-native@35.0.4
  - @contractspec/lib.presentation-runtime-core@3.8.4
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.ui-kit-core@3.7.9
  - @contractspec/lib.schema@3.7.9
  - @contractspec/lib.ui-kit@3.8.4

## 1.1.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.presentation-runtime-react-native@35.0.3
  - @contractspec/lib.presentation-runtime-core@3.8.3
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.ui-kit-core@3.7.8
  - @contractspec/lib.schema@3.7.8
  - @contractspec/lib.ui-kit@3.8.3

## 1.1.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react-native@35.0.2
  - @contractspec/lib.presentation-runtime-core@3.8.2
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.ui-kit@3.8.2
  - @contractspec/lib.schema@3.7.7
  - @contractspec/lib.ui-kit-core@3.7.7

## 1.1.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react-native@34.0.6
  - @contractspec/lib.presentation-runtime-core@3.7.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.ui-kit-core@3.7.6
  - @contractspec/lib.schema@3.7.6
  - @contractspec/lib.ui-kit@3.7.6

## 1.1.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.presentation-runtime-react-native@34.0.5
  - @contractspec/lib.presentation-runtime-core@3.7.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.ui-kit-core@3.7.5
  - @contractspec/lib.schema@3.7.5
  - @contractspec/lib.ui-kit@3.7.5

## 1.1.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react-native@34.0.4
  - @contractspec/lib.presentation-runtime-core@3.7.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.ui-kit-core@3.7.4
  - @contractspec/lib.schema@3.7.4
  - @contractspec/lib.ui-kit@3.7.4

## 1.1.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react-native@34.0.3
  - @contractspec/lib.presentation-runtime-core@3.7.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.ui-kit-core@3.7.3
  - @contractspec/lib.schema@3.7.3
  - @contractspec/lib.ui-kit@3.7.3

## 1.1.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.presentation-runtime-react-native@34.0.2
  - @contractspec/lib.presentation-runtime-core@3.7.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.ui-kit-core@3.7.2
  - @contractspec/lib.schema@3.7.2
  - @contractspec/lib.ui-kit@3.7.2

## 1.1.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.presentation-runtime-react-native@34.0.1
  - @contractspec/lib.presentation-runtime-core@3.7.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.ui-kit-core@3.7.1
  - @contractspec/lib.schema@3.7.1
  - @contractspec/lib.ui-kit@3.7.1

## 1.1.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.presentation-runtime-react-native@34.0.0
  - @contractspec/lib.presentation-runtime-core@3.7.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.ui-kit-core@3.7.0
  - @contractspec/lib.schema@3.7.0
  - @contractspec/lib.ui-kit@3.7.0
