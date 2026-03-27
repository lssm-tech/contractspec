# @contractspec/module.context-storage

## 0.7.15

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-integrations@3.8.8
  - @contractspec/lib.context-storage@0.7.12
  - @contractspec/lib.knowledge@3.7.16
  - @contractspec/lib.schema@3.7.13

## 0.7.14

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-integrations@3.8.7
  - @contractspec/lib.context-storage@0.7.11
  - @contractspec/lib.knowledge@3.7.15
  - @contractspec/lib.schema@3.7.12

## 0.7.13

### Patch Changes

- chore: stability & release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.6
  - @contractspec/lib.context-storage@0.7.10
  - @contractspec/lib.knowledge@3.7.14
  - @contractspec/lib.schema@3.7.11

## 0.7.12

### Patch Changes

- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
  - @contractspec/lib.contracts-integrations@3.8.4
  - @contractspec/lib.schema@3.7.10
  - @contractspec/lib.knowledge@3.7.12

## 0.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.3
  - @contractspec/lib.context-storage@0.7.9
  - @contractspec/lib.knowledge@3.7.11
  - @contractspec/lib.schema@3.7.9

## 0.7.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-integrations@3.8.2
  - @contractspec/lib.context-storage@0.7.8
  - @contractspec/lib.knowledge@3.7.10
  - @contractspec/lib.schema@3.7.8

## 0.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.1
  - @contractspec/lib.knowledge@3.7.9
  - @contractspec/lib.context-storage@0.7.7
  - @contractspec/lib.schema@3.7.7

## 0.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.6
  - @contractspec/lib.context-storage@0.7.6
  - @contractspec/lib.knowledge@3.7.6
  - @contractspec/lib.schema@3.7.6

## 0.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-integrations@3.7.5
  - @contractspec/lib.context-storage@0.7.5
  - @contractspec/lib.knowledge@3.7.5
  - @contractspec/lib.schema@3.7.5

## 0.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.4
  - @contractspec/lib.context-storage@0.7.4
  - @contractspec/lib.knowledge@3.7.4
  - @contractspec/lib.schema@3.7.4

## 0.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.3
  - @contractspec/lib.context-storage@0.7.3
  - @contractspec/lib.knowledge@3.7.3
  - @contractspec/lib.schema@3.7.3

## 0.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
  - @contractspec/lib.contracts-integrations@3.7.2
  - @contractspec/lib.context-storage@0.7.2
  - @contractspec/lib.knowledge@3.7.2
  - @contractspec/lib.schema@3.7.2

## 0.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-integrations@3.7.1
  - @contractspec/lib.context-storage@0.7.1
  - @contractspec/lib.knowledge@3.7.1
  - @contractspec/lib.schema@3.7.1

## 0.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-integrations@3.7.0
  - @contractspec/lib.context-storage@0.7.0
  - @contractspec/lib.knowledge@3.7.0
  - @contractspec/lib.schema@3.7.0

## 0.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [ea320ea]
  - @contractspec/lib.contracts-integrations@3.6.0
  - @contractspec/lib.context-storage@0.6.0
  - @contractspec/lib.knowledge@3.6.0
  - @contractspec/lib.schema@3.6.0

## 0.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-integrations@3.5.5
  - @contractspec/lib.context-storage@0.5.5
  - @contractspec/lib.knowledge@3.5.5
  - @contractspec/lib.schema@3.5.5

## 0.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
  - @contractspec/lib.contracts-integrations@3.5.4
  - @contractspec/lib.context-storage@0.5.4
  - @contractspec/lib.knowledge@3.5.4
  - @contractspec/lib.schema@3.5.4

## 0.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-integrations@3.5.3
  - @contractspec/lib.context-storage@0.5.3
  - @contractspec/lib.knowledge@3.5.3
  - @contractspec/lib.schema@3.5.3

## 0.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-integrations@3.5.2
  - @contractspec/lib.context-storage@0.5.2
  - @contractspec/lib.knowledge@3.5.2
  - @contractspec/lib.schema@3.5.2

## 0.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-integrations@3.5.1
  - @contractspec/lib.context-storage@0.5.1
  - @contractspec/lib.knowledge@3.5.1
  - @contractspec/lib.schema@3.5.1

## 0.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-integrations@3.5.0
  - @contractspec/lib.context-storage@0.5.0
  - @contractspec/lib.knowledge@3.5.0
  - @contractspec/lib.schema@3.5.0

## 0.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-integrations@3.4.3
  - @contractspec/lib.context-storage@0.4.3
  - @contractspec/lib.knowledge@3.4.3
  - @contractspec/lib.schema@3.4.3

## 0.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-integrations@3.4.2
  - @contractspec/lib.context-storage@0.4.2
  - @contractspec/lib.knowledge@3.4.2
  - @contractspec/lib.schema@3.4.2

## 0.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-integrations@3.4.1
  - @contractspec/lib.context-storage@0.4.1
  - @contractspec/lib.knowledge@3.4.1
  - @contractspec/lib.schema@3.4.1

## 0.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
  - @contractspec/lib.contracts-integrations@3.4.0
  - @contractspec/lib.context-storage@0.4.0
  - @contractspec/lib.knowledge@3.4.0
  - @contractspec/lib.schema@3.4.0

## 0.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.3.0
  - @contractspec/lib.context-storage@0.3.0
  - @contractspec/lib.knowledge@3.3.0
  - @contractspec/lib.schema@3.3.0

## 0.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-integrations@3.2.0
  - @contractspec/lib.context-storage@0.2.0
  - @contractspec/lib.knowledge@3.2.0
  - @contractspec/lib.schema@3.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-integrations@3.1.1
  - @contractspec/lib.knowledge@3.1.1

## 0.1.1

### Patch Changes

- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-integrations@3.1.0
  - @contractspec/lib.knowledge@3.1.0
  - @contractspec/lib.schema@3.1.0
  - @contractspec/lib.context-storage@0.1.0
