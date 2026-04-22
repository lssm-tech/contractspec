# @contractspec/example.analytics-dashboard

## 3.9.17

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Updated dependencies because of Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/lib.contracts-integrations@3.8.15
  - @contractspec/lib.example-shared-ui@7.0.2
  - @contractspec/lib.runtime-sandbox@3.0.2
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.presentation-runtime-core@5.0.3
  - @contractspec/lib.schema@3.7.14

## 3.9.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.contracts-integrations@3.8.14
  - @contractspec/lib.example-shared-ui@7.0.1
  - @contractspec/lib.presentation-runtime-core@5.0.2
  - @contractspec/lib.runtime-sandbox@3.0.1
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.design-system@3.11.2
  - @contractspec/lib.schema@3.7.14

## 3.9.15

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
- Updated dependencies because of Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
  - @contractspec/lib.design-system@3.11.1
  - @contractspec/lib.runtime-sandbox@3.0.0
  - @contractspec/lib.example-shared-ui@7.0.0
  - @contractspec/lib.presentation-runtime-core@5.0.1
  - @contractspec/lib.contracts-integrations@3.8.13
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 3.9.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Updated dependencies because of Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-integrations@3.8.13
  - @contractspec/lib.example-shared-ui@6.0.22
  - @contractspec/lib.runtime-sandbox@2.7.15
  - @contractspec/lib.design-system@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.presentation-runtime-core@5.0.0
  - @contractspec/lib.schema@3.7.14

## 3.9.13

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - @contractspec/lib.design-system@3.10.1
  - @contractspec/lib.example-shared-ui@6.0.21
  - @contractspec/lib.presentation-runtime-core@4.0.0

## 3.9.12

### Patch Changes

- Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
  - Packages: @contractspec/module.examples (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch), @contractspec/example.agent-console (patch), @contractspec/example.ai-chat-assistant (patch), @contractspec/example.analytics-dashboard (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.integration-hub (patch), @contractspec/example.learning-journey-registry (patch), @contractspec/example.marketplace (patch), @contractspec/example.policy-safe-knowledge-assistant (patch), @contractspec/example.saas-boilerplate (patch), @contractspec/example.workflow-system (patch)
  - Migration: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.contracts-integrations@3.8.12
  - @contractspec/lib.example-shared-ui@6.0.20
  - @contractspec/lib.presentation-runtime-core@3.9.8
  - @contractspec/lib.design-system@3.10.0

## 3.9.11

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.design-system@3.9.0
  - @contractspec/lib.contracts-integrations@3.8.11
  - @contractspec/lib.example-shared-ui@6.0.19
  - @contractspec/lib.presentation-runtime-core@3.9.7

## 3.9.10

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.contracts-integrations@3.8.10
  - @contractspec/lib.presentation-runtime-core@3.9.6
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.design-system@3.8.11
  - @contractspec/lib.example-shared-ui@6.0.18
  - @contractspec/lib.runtime-sandbox@2.7.14
  - @contractspec/lib.schema@3.7.14

## 3.9.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-core@3.9.5
  - @contractspec/lib.contracts-integrations@3.8.9
  - @contractspec/lib.example-shared-ui@6.0.17
  - @contractspec/lib.runtime-sandbox@2.7.14
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.design-system@3.8.10
  - @contractspec/lib.schema@3.7.14

## 3.9.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-core@3.9.4
  - @contractspec/lib.contracts-integrations@3.8.8
  - @contractspec/lib.example-shared-ui@6.0.16
  - @contractspec/lib.runtime-sandbox@2.7.13
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.design-system@3.8.9
  - @contractspec/lib.schema@3.7.13

## 3.9.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/lib.contracts-integrations@3.8.7
  - @contractspec/lib.example-shared-ui@6.0.15
  - @contractspec/lib.runtime-sandbox@2.7.12
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8
  - @contractspec/lib.schema@3.7.12

## 3.9.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/lib.contracts-integrations@3.8.6
  - @contractspec/lib.example-shared-ui@6.0.14
  - @contractspec/lib.runtime-sandbox@2.7.11
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7
  - @contractspec/lib.schema@3.7.11

## 3.9.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.contracts-integrations@3.8.5
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.example-shared-ui@6.0.13
  - @contractspec/lib.presentation-runtime-core@3.9.1

## 3.9.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0
  - @contractspec/lib.contracts-integrations@3.8.4
  - @contractspec/lib.schema@3.7.10
  - @contractspec/lib.design-system@3.8.5
  - @contractspec/lib.example-shared-ui@6.0.12

## 3.9.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.3
  - @contractspec/lib.example-shared-ui@6.0.11
  - @contractspec/lib.runtime-sandbox@2.7.10
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4
  - @contractspec/lib.schema@3.7.9

## 3.9.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-integrations@3.8.2
  - @contractspec/lib.example-shared-ui@6.0.10
  - @contractspec/lib.runtime-sandbox@2.7.9
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3
  - @contractspec/lib.schema@3.7.8

## 3.9.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.1
  - @contractspec/lib.example-shared-ui@6.0.9
  - @contractspec/lib.runtime-sandbox@2.7.8
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2
  - @contractspec/lib.schema@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.6
  - @contractspec/lib.example-shared-ui@6.0.6
  - @contractspec/lib.runtime-sandbox@2.7.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.design-system@3.7.6
  - @contractspec/lib.schema@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-integrations@3.7.5
  - @contractspec/lib.example-shared-ui@6.0.5
  - @contractspec/lib.runtime-sandbox@2.7.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.design-system@3.7.5
  - @contractspec/lib.schema@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.4
  - @contractspec/lib.example-shared-ui@6.0.4
  - @contractspec/lib.runtime-sandbox@2.7.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.design-system@3.7.4
  - @contractspec/lib.schema@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.3
  - @contractspec/lib.example-shared-ui@6.0.3
  - @contractspec/lib.runtime-sandbox@2.7.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.design-system@3.7.3
  - @contractspec/lib.schema@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-integrations@3.7.2
  - @contractspec/lib.example-shared-ui@6.0.2
  - @contractspec/lib.runtime-sandbox@2.7.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.design-system@3.7.2
  - @contractspec/lib.schema@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-integrations@3.7.1
  - @contractspec/lib.example-shared-ui@6.0.1
  - @contractspec/lib.runtime-sandbox@2.7.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.design-system@3.7.1
  - @contractspec/lib.schema@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-integrations@3.7.0
  - @contractspec/lib.example-shared-ui@6.0.0
  - @contractspec/lib.runtime-sandbox@2.7.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.design-system@3.7.0
  - @contractspec/lib.schema@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.contracts-integrations@3.6.0
  - @contractspec/lib.example-shared-ui@5.0.0
  - @contractspec/lib.runtime-sandbox@2.6.0
  - @contractspec/lib.design-system@3.6.0
  - @contractspec/lib.schema@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.contracts-integrations@3.5.5
  - @contractspec/lib.example-shared-ui@4.0.5
  - @contractspec/lib.runtime-sandbox@2.5.5
  - @contractspec/lib.design-system@3.5.5
  - @contractspec/lib.schema@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-integrations@3.5.4
  - @contractspec/lib.example-shared-ui@4.0.4
  - @contractspec/lib.runtime-sandbox@2.5.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.design-system@3.5.4
  - @contractspec/lib.schema@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-integrations@3.5.3
  - @contractspec/lib.example-shared-ui@4.0.3
  - @contractspec/lib.runtime-sandbox@2.5.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.design-system@3.5.3
  - @contractspec/lib.schema@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-integrations@3.5.2
  - @contractspec/lib.example-shared-ui@4.0.2
  - @contractspec/lib.runtime-sandbox@2.5.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.design-system@3.5.2
  - @contractspec/lib.schema@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [73a7f8d]
- Updated dependencies [dfff0d4]
  - @contractspec/lib.example-shared-ui@4.0.1
  - @contractspec/lib.contracts-integrations@3.5.1
  - @contractspec/lib.runtime-sandbox@2.5.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.design-system@3.5.1
  - @contractspec/lib.schema@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [66c51da]
- Updated dependencies [230bdf6]
  - @contractspec/lib.example-shared-ui@4.0.0
  - @contractspec/lib.contracts-integrations@3.5.0
  - @contractspec/lib.runtime-sandbox@2.5.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.design-system@3.5.0
  - @contractspec/lib.schema@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-integrations@3.4.3
  - @contractspec/lib.example-shared-ui@3.4.3
  - @contractspec/lib.runtime-sandbox@2.4.3
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.design-system@3.4.3
  - @contractspec/lib.schema@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-integrations@3.4.2
  - @contractspec/lib.example-shared-ui@3.4.2
  - @contractspec/lib.runtime-sandbox@2.4.2
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.design-system@3.4.2
  - @contractspec/lib.schema@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-integrations@3.4.1
  - @contractspec/lib.example-shared-ui@3.4.1
  - @contractspec/lib.runtime-sandbox@2.4.1
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.design-system@3.4.1
  - @contractspec/lib.schema@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-integrations@3.4.0
  - @contractspec/lib.example-shared-ui@3.4.0
  - @contractspec/lib.runtime-sandbox@2.4.0
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.design-system@3.4.0
  - @contractspec/lib.schema@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.3.0
  - @contractspec/lib.example-shared-ui@3.3.0
  - @contractspec/lib.runtime-sandbox@2.3.0
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.design-system@3.3.0
  - @contractspec/lib.schema@3.3.0
