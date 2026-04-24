# @contractspec/example.ai-chat-assistant

## 3.8.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.ai-agent@8.0.12
  - @contractspec/module.ai-chat@4.3.26
  - @contractspec/lib.contracts-spec@5.7.0

## 3.8.17

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
  - @contractspec/lib.ai-agent@8.0.11
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/module.ai-chat@4.3.25
  - @contractspec/lib.schema@3.7.14

## 3.8.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.ai-agent@8.0.10
  - @contractspec/module.ai-chat@4.3.24
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.schema@3.7.14

## 3.8.15

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/module.ai-chat@4.3.23
  - @contractspec/lib.ai-agent@8.0.9
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 3.8.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.ai-agent@8.0.9
  - @contractspec/module.ai-chat@4.3.22
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 3.8.13

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/module.ai-chat@4.3.21

## 3.8.12

### Patch Changes

- Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
  - Packages: @contractspec/module.examples (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch), @contractspec/example.agent-console (patch), @contractspec/example.ai-chat-assistant (patch), @contractspec/example.analytics-dashboard (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.integration-hub (patch), @contractspec/example.learning-journey-registry (patch), @contractspec/example.marketplace (patch), @contractspec/example.policy-safe-knowledge-assistant (patch), @contractspec/example.saas-boilerplate (patch), @contractspec/example.workflow-system (patch)
  - Migration: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.ai-agent@8.0.8
  - @contractspec/module.ai-chat@4.3.20

## 3.8.11

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.ai-agent@8.0.7
  - @contractspec/module.ai-chat@4.3.19

## 3.8.10

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.ai-agent@8.0.6
  - @contractspec/module.ai-chat@4.3.18
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.schema@3.7.14

## 3.8.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/module.ai-chat@4.3.17
  - @contractspec/lib.ai-agent@8.0.5
  - @contractspec/lib.schema@3.7.14

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
