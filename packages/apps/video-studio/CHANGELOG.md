# @contractspec/app.video-studio

## 2.7.28

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- Updated dependencies because of Add an extensible design-system object reference handler for actionable references.
  - @contractspec/lib.design-system@4.3.0
  - @contractspec/lib.content-gen@3.7.26
  - @contractspec/lib.video-gen@3.0.5
  - @contractspec/lib.contracts-spec@6.1.0

## 2.7.27

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Add grouped option support to design-system Select controls across web and native.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Updated dependencies because of Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
- Updated dependencies because of Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.content-gen@3.7.25
  - @contractspec/lib.video-gen@3.0.4
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.design-system@4.2.0

## 2.7.26

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.content-gen@3.7.24
  - @contractspec/lib.video-gen@3.0.3
  - @contractspec/lib.design-system@4.1.0
  - @contractspec/lib.contracts-spec@5.7.0

## 2.7.25

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/lib.content-gen@3.7.23
  - @contractspec/lib.video-gen@3.0.2
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0

## 2.7.24

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.content-gen@3.7.22
  - @contractspec/lib.video-gen@3.0.1
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.design-system@3.11.2

## 2.7.23

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - @contractspec/lib.design-system@3.11.1
  - @contractspec/lib.video-gen@3.0.0
  - @contractspec/lib.content-gen@3.7.21
  - @contractspec/lib.contracts-spec@5.5.0

## 2.7.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Updated dependencies because of Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.content-gen@3.7.21
  - @contractspec/lib.video-gen@2.7.22
  - @contractspec/lib.design-system@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0

## 2.7.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.design-system@3.10.1
  - @contractspec/lib.video-gen@2.7.21

## 2.7.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.content-gen@3.7.20
  - @contractspec/lib.video-gen@2.7.20
  - @contractspec/lib.design-system@3.10.0

## 2.7.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.design-system@3.9.0
  - @contractspec/lib.content-gen@3.7.19
  - @contractspec/lib.video-gen@2.7.19

## 2.7.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.content-gen@3.7.18
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.design-system@3.8.11
  - @contractspec/lib.video-gen@2.7.18

## 2.7.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.design-system@3.8.10
  - @contractspec/lib.content-gen@3.7.17
  - @contractspec/lib.video-gen@2.7.17

## 2.7.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.design-system@3.8.9
  - @contractspec/lib.content-gen@3.7.16
  - @contractspec/lib.video-gen@2.7.16

## 2.7.15

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8
  - @contractspec/lib.content-gen@3.7.15
  - @contractspec/lib.video-gen@2.7.15

## 2.7.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7
  - @contractspec/lib.content-gen@3.7.14
  - @contractspec/lib.video-gen@2.7.14

## 2.7.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.content-gen@3.7.13
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.video-gen@2.7.13

## 2.7.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.content-gen@3.7.12
  - @contractspec/lib.design-system@3.8.5
  - @contractspec/lib.video-gen@2.7.12

## 2.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4
  - @contractspec/lib.content-gen@3.7.11
  - @contractspec/lib.video-gen@2.7.11

## 2.7.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3
  - @contractspec/lib.content-gen@3.7.10
  - @contractspec/lib.video-gen@2.7.10

## 2.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2
  - @contractspec/lib.content-gen@3.7.9
  - @contractspec/lib.video-gen@2.7.9

## 2.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.design-system@3.7.6
  - @contractspec/lib.content-gen@3.7.6
  - @contractspec/lib.video-gen@2.7.6

## 2.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.design-system@3.7.5
  - @contractspec/lib.content-gen@3.7.5
  - @contractspec/lib.video-gen@2.7.5

## 2.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.design-system@3.7.4
  - @contractspec/lib.content-gen@3.7.4
  - @contractspec/lib.video-gen@2.7.4

## 2.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.design-system@3.7.3
  - @contractspec/lib.content-gen@3.7.3
  - @contractspec/lib.video-gen@2.7.3

## 2.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.design-system@3.7.2
  - @contractspec/lib.content-gen@3.7.2
  - @contractspec/lib.video-gen@2.7.2

## 2.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.design-system@3.7.1
  - @contractspec/lib.content-gen@3.7.1
  - @contractspec/lib.video-gen@2.7.1

## 2.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.design-system@3.7.0
  - @contractspec/lib.content-gen@3.7.0
  - @contractspec/lib.video-gen@2.7.0

## 2.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.design-system@3.6.0
  - @contractspec/lib.content-gen@3.6.0
  - @contractspec/lib.video-gen@2.6.0

## 2.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.design-system@3.5.5
  - @contractspec/lib.content-gen@3.5.5
  - @contractspec/lib.video-gen@2.5.5

## 2.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.design-system@3.5.4
  - @contractspec/lib.content-gen@3.5.4
  - @contractspec/lib.video-gen@2.5.4

## 2.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.design-system@3.5.3
  - @contractspec/lib.content-gen@3.5.3
  - @contractspec/lib.video-gen@2.5.3

## 2.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.design-system@3.5.2
  - @contractspec/lib.content-gen@3.5.2
  - @contractspec/lib.video-gen@2.5.2

## 2.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.design-system@3.5.1
  - @contractspec/lib.content-gen@3.5.1
  - @contractspec/lib.video-gen@2.5.1

## 2.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.design-system@3.5.0
  - @contractspec/lib.content-gen@3.5.0
  - @contractspec/lib.video-gen@2.5.0

## 2.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.design-system@3.4.3
  - @contractspec/lib.content-gen@3.4.3
  - @contractspec/lib.video-gen@2.4.3

## 2.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.design-system@3.4.2
  - @contractspec/lib.content-gen@3.4.2
  - @contractspec/lib.video-gen@2.4.2

## 2.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.design-system@3.4.1
  - @contractspec/lib.content-gen@3.4.1
  - @contractspec/lib.video-gen@2.4.1

## 2.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.design-system@3.4.0
  - @contractspec/lib.content-gen@3.4.0
  - @contractspec/lib.video-gen@2.4.0

## 2.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.design-system@3.3.0
  - @contractspec/lib.content-gen@3.3.0
  - @contractspec/lib.video-gen@2.3.0

## 2.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.design-system@3.2.0
  - @contractspec/lib.content-gen@3.2.0
  - @contractspec/lib.video-gen@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/lib.design-system@3.1.1
  - @contractspec/lib.content-gen@3.1.1
  - @contractspec/lib.video-gen@2.1.1

## 2.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.design-system@3.1.0
  - @contractspec/lib.content-gen@3.1.0
  - @contractspec/lib.video-gen@2.1.0

## 2.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Patch Changes

- Updated dependencies [7cbdb7f]
- Updated dependencies [c608804]
- Updated dependencies [e3bc858]
- Updated dependencies [b19ae0a]
- Updated dependencies [aa4a9c9]
- Updated dependencies [b781ce6]
  - @contractspec/lib.contracts-spec@3.0.0
  - @contractspec/lib.design-system@3.0.0
  - @contractspec/lib.content-gen@3.0.0
  - @contractspec/lib.video-gen@2.0.0

## 1.50.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/lib.content-gen@2.9.1
  - @contractspec/lib.video-gen@1.50.1
  - @contractspec/lib.design-system@2.9.1

## 1.50.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.design-system@2.9.0
  - @contractspec/lib.content-gen@2.9.0
  - @contractspec/lib.video-gen@1.50.0

## 1.49.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.content-gen@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.design-system@2.8.0
  - @contractspec/lib.video-gen@1.49.0

## 1.48.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.content-gen@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.design-system@2.7.0
  - @contractspec/lib.video-gen@1.48.0

## 1.47.1

### Patch Changes

- Updated dependencies [f8dc3ad]
  - @contractspec/lib.design-system@2.6.1
  - @contractspec/lib.video-gen@1.47.1

## 1.47.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.video-gen@1.47.0
  - @contractspec/lib.content-gen@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.design-system@2.6.0

## 1.46.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- 397b7c0: Switch Remotion CLI from `npx remotion` to `bunx remotionb` for native Bun runtime support.

  - update video-studio scripts (`dev`, `render`, `render:all`) to use `bunx remotionb`
  - correct documentation that incorrectly claimed Remotion does not run on Bun
  - document known Bun caveats (`lazyComponent` disabled, SSR scripts may not auto-quit)

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
- Updated dependencies [397b7c0]
- Updated dependencies [4d19382]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.video-gen@1.46.0
  - @contractspec/lib.content-gen@2.5.0
  - @contractspec/lib.design-system@2.5.0

## 1.45.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.design-system@2.4.0
  - @contractspec/lib.content-gen@2.4.0
  - @contractspec/lib.video-gen@1.45.0

## 1.44.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.design-system@2.3.0
  - @contractspec/lib.content-gen@2.3.0
  - @contractspec/lib.video-gen@1.44.0

## 1.43.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.design-system@2.2.0
  - @contractspec/lib.content-gen@2.2.0
  - @contractspec/lib.video-gen@1.43.0

## 1.42.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.content-gen@2.1.1
  - @contractspec/lib.design-system@2.1.1
  - @contractspec/lib.video-gen@1.42.1

## 1.42.0

### Minor Changes

- b4bfbc5: feat: init video system
- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.video-gen@1.42.0
  - @contractspec/lib.design-system@2.1.0
  - @contractspec/lib.content-gen@2.1.0
