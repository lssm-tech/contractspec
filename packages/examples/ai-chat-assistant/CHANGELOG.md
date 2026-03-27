# @contractspec/example.ai-chat-assistant

## 3.8.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/module.ai-chat@4.3.16
  - @contractspec/lib.ai-agent@8.0.4
  - @contractspec/lib.schema@3.7.13

## 3.8.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/module.ai-chat@4.3.15
  - @contractspec/lib.ai-agent@8.0.3
  - @contractspec/lib.schema@3.7.12

## 3.8.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/module.ai-chat@4.3.14
  - @contractspec/lib.ai-agent@8.0.2
  - @contractspec/lib.schema@3.7.11

## 3.8.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.ai-agent@8.0.1
  - @contractspec/module.ai-chat@4.3.13

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
  - @contractspec/lib.ai-agent@8.0.0
  - @contractspec/module.ai-chat@4.3.12

## 3.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/module.ai-chat@4.3.11
  - @contractspec/lib.ai-agent@7.0.11
  - @contractspec/lib.schema@3.7.9

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/module.ai-chat@4.3.10
  - @contractspec/lib.ai-agent@7.0.10
  - @contractspec/lib.schema@3.7.8

## 3.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/module.ai-chat@4.3.9
  - @contractspec/lib.ai-agent@7.0.9
  - @contractspec/lib.schema@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/module.ai-chat@4.3.6
  - @contractspec/lib.ai-agent@7.0.6
  - @contractspec/lib.schema@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/module.ai-chat@4.3.5
  - @contractspec/lib.ai-agent@7.0.5
  - @contractspec/lib.schema@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/module.ai-chat@4.3.4
  - @contractspec/lib.ai-agent@7.0.4
  - @contractspec/lib.schema@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/module.ai-chat@4.3.3
  - @contractspec/lib.ai-agent@7.0.3
  - @contractspec/lib.schema@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- 04bc555: Improve contract integrity, example validation, onboarding docs, doctor safety,
  release verification, packaged smoke testing, and security workflow coverage.
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/module.ai-chat@4.3.2
  - @contractspec/lib.ai-agent@7.0.2
  - @contractspec/lib.schema@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/module.ai-chat@4.3.1
  - @contractspec/lib.ai-agent@7.0.1
  - @contractspec/lib.schema@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/module.ai-chat@4.3.0
  - @contractspec/lib.ai-agent@7.0.0
  - @contractspec/lib.schema@3.7.0

## 3.6.0

### Minor Changes

- 44b46cd: feat(examples): full AI chat example with MCP, reasoning, and contracts

  - **example.ai-chat-assistant**: New focused template with ChatWithSidebar, assistant.search contract, mock handlers, and sandbox
  - **integration-hub**: Add Chat tab with IntegrationHubChat (reasoning, CoT, sources, suggestions, optional MCP)
  - **web-landing**: Add /api/chat route (createChatRoute), wire both examples in sandbox
  - **module.examples**: Register ai-chat-assistant in builtins

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.ai-agent@6.0.0
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/module.ai-chat@4.2.0
  - @contractspec/lib.schema@3.6.0
