# Changelog

## 3.9.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8

## 3.9.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7

## 3.9.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.presentation-runtime-core@3.9.1

## 3.9.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0
  - @contractspec/lib.design-system@3.8.5

## 3.9.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4

## 3.9.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3

## 3.9.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2

## 3.8.0

- Added the visualization showcase example package for ContractSpec visualization primitives.
