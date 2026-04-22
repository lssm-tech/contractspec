# @contractspec/lib.image-gen

## 1.7.23

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.content-gen@3.7.23
  - @contractspec/lib.contracts-integrations@3.8.15
  - @contractspec/lib.contracts-spec@5.6.0

## 1.7.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.content-gen@3.7.22
  - @contractspec/lib.contracts-integrations@3.8.14
  - @contractspec/lib.contracts-spec@5.5.1

## 1.7.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.content-gen@3.7.21
  - @contractspec/lib.contracts-integrations@3.8.13
  - @contractspec/lib.contracts-spec@5.5.0

## 1.7.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.content-gen@3.7.20
  - @contractspec/lib.contracts-integrations@3.8.12

## 1.7.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.content-gen@3.7.19
  - @contractspec/lib.contracts-integrations@3.8.11

## 1.7.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.content-gen@3.7.18
  - @contractspec/lib.contracts-integrations@3.8.10
  - @contractspec/lib.contracts-spec@5.2.0

## 1.7.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-integrations@3.8.9
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.content-gen@3.7.17

## 1.7.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-integrations@3.8.8
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.content-gen@3.7.16

## 1.7.15

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-integrations@3.8.7
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.content-gen@3.7.15

## 1.7.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-integrations@3.8.6
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.content-gen@3.7.14

## 1.7.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.content-gen@3.7.13
  - @contractspec/lib.contracts-integrations@3.8.5

## 1.7.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.contracts-integrations@3.8.4
  - @contractspec/lib.content-gen@3.7.12

## 1.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.3
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.content-gen@3.7.11

## 1.7.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-integrations@3.8.2
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.content-gen@3.7.10

## 1.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.1
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.content-gen@3.7.9

## 1.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.content-gen@3.7.6

## 1.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-integrations@3.7.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.content-gen@3.7.5

## 1.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.content-gen@3.7.4

## 1.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.content-gen@3.7.3

## 1.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-integrations@3.7.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.content-gen@3.7.2

## 1.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-integrations@3.7.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.content-gen@3.7.1

## 1.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-integrations@3.7.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.content-gen@3.7.0

## 1.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.contracts-integrations@3.6.0
  - @contractspec/lib.content-gen@3.6.0

## 1.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.contracts-integrations@3.5.5
  - @contractspec/lib.content-gen@3.5.5

## 1.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-integrations@3.5.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.content-gen@3.5.4

## 1.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-integrations@3.5.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.content-gen@3.5.3

## 1.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-integrations@3.5.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.content-gen@3.5.2

## 1.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-integrations@3.5.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.content-gen@3.5.1

## 1.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-integrations@3.5.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.content-gen@3.5.0

## 1.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-integrations@3.4.3
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.content-gen@3.4.3

## 1.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-integrations@3.4.2
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.content-gen@3.4.2

## 1.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-integrations@3.4.1
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.content-gen@3.4.1

## 1.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-integrations@3.4.0
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.content-gen@3.4.0

## 1.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.3.0
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.content-gen@3.3.0

## 1.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-integrations@3.2.0
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.content-gen@3.2.0

## 1.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-integrations@3.1.1
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/lib.content-gen@3.1.1

## 1.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.contracts-integrations@3.1.0
  - @contractspec/lib.content-gen@3.1.0

## 1.0.0

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
  - @contractspec/lib.contracts-integrations@3.0.0
  - @contractspec/lib.content-gen@3.0.0

## 0.6.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-integrations@2.10.0
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/lib.content-gen@2.9.1

## 0.6.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-integrations@2.9.0
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.content-gen@2.9.0

## 0.5.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.content-gen@2.8.0
  - @contractspec/lib.contracts-integrations@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0

## 0.4.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.content-gen@2.7.0
  - @contractspec/lib.contracts-integrations@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0

## 0.3.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.content-gen@2.6.0
  - @contractspec/lib.contracts-integrations@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0

## 0.2.0

### Minor Changes

- 4fa3bd4: Add @contractspec/lib.image-gen package for AI-powered image generation

  - New `ai-image` IntegrationCategory in both contracts-spec and contracts-integrations
  - New ImageProvider contract with image generation, upscale, and edit interfaces
  - New fal-image and openai-image integration specs
  - New image-gen library with ImageGenerator, PromptBuilder, StyleResolver
  - Presets for social (OG, Twitter, Instagram), marketing (blog hero, landing, email), and video thumbnails
  - Full i18n support (en, fr, es)
  - video-gen: fix missing contracts-integrations dependency, add image-gen dependency, add image option to VideoGeneratorOptions, implement thumbnail generation in VideoGenerator
  - IMAGE_PRESETS: add emailHeader and illustration presets to contract layer
  - Comprehensive test suite (129 tests across 5 files)

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.contracts-integrations@2.5.0
  - @contractspec/lib.content-gen@2.5.0
