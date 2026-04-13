# @contractspec/integration.harness-runtime

## 0.2.12

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.harness@0.2.12

## 0.2.11

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.harness@0.2.11
  - @contractspec/lib.contracts-spec@5.2.0

## 0.2.10

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.harness@0.2.10

## 0.2.9

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.harness@0.2.9

## 0.2.8

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.harness@0.2.8

## 0.2.7

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.harness@0.2.7

## 0.2.6

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.harness@0.2.6

## 0.2.5

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.harness@0.2.5

## 0.2.4

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.harness@0.2.4

## 0.2.3

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.harness@0.2.3

## 0.2.2

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.harness@0.2.2
