# @contractspec/example.harness-lab

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
