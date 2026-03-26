# @contractspec/app.cursor-marketplace

## 1.7.11

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

## 1.7.10

### Patch Changes

- chore: stability & release

## 1.7.9

### Patch Changes

- fix: release

## 1.7.8

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type

## 1.7.7

### Patch Changes

- fix: release

## 1.7.6

### Patch Changes

- fix: release manifest

## 1.7.5

### Patch Changes

- ecf195a: fix: release security

## 1.7.4

### Patch Changes

- fix: release security

## 1.7.3

### Patch Changes

- fix: release

## 1.7.2

### Patch Changes

- 8cd229b: fix: release

## 1.7.1

### Patch Changes

- 5eb8626: fix: package exports

## 1.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

## 1.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

## 1.5.5

### Patch Changes

- 693eedd: chore: improve ai models

## 1.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming

## 1.5.3

### Patch Changes

- b0b4da6: fix: release

## 1.5.2

### Patch Changes

- 18df977: fix: release workflow

## 1.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime

## 1.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

## 1.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs

## 1.4.2

### Patch Changes

- 78d56a4: fix: release workflow

## 1.4.1

### Patch Changes

- 8f47829: fix: circular import issue

## 1.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

## 1.3.0

### Minor Changes

- 890a0da: fix: stability improvements

## 1.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

## 1.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

## 1.0.0

### Major Changes

- b781ce6: feat: improve ai readiness
