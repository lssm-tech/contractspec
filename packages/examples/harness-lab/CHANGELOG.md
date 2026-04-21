# @contractspec/example.harness-lab

## 3.7.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/integration.harness-runtime@0.2.14
  - @contractspec/lib.harness@0.2.14
  - @contractspec/lib.contracts-spec@5.5.0

## 3.7.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/integration.harness-runtime@0.2.13
  - @contractspec/lib.harness@0.2.13

## 3.7.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/integration.harness-runtime@0.2.12
  - @contractspec/lib.harness@0.2.12

## 3.7.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/integration.harness-runtime@0.2.11
  - @contractspec/lib.harness@0.2.11
  - @contractspec/lib.contracts-spec@5.2.0

## 3.7.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/integration.harness-runtime@0.2.10
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.harness@0.2.10

## 3.7.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/integration.harness-runtime@0.2.9
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.harness@0.2.9

## 3.7.15

### Patch Changes

- cce2b13: Fix the agent console smoke test by awaiting async button handlers, splitting the flow into smaller smoke cases, and wiring dashboard mutation refreshes so the visible agents and runs tabs update after create and execute actions. Also make the harness lab browser smoke tests skip when Chromium cannot launch in this environment and apply explicit timeouts for the browser evaluation paths.
- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/integration.harness-runtime@0.2.8
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.harness@0.2.8

## 3.7.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/integration.harness-runtime@0.2.7
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.harness@0.2.7

## 3.7.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/integration.harness-runtime@0.2.6
  - @contractspec/lib.harness@0.2.6

## 3.7.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/integration.harness-runtime@0.2.5
  - @contractspec/lib.harness@0.2.5

## 3.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/integration.harness-runtime@0.2.4
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.harness@0.2.4
