# @contractspec/biome-config

## 3.8.11

### Patch Changes

- Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
  - Packages: @contractspec/biome-config (patch), contractspec (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit-core (patch), @contractspec/lib.design-system (patch)
  - Migration: Use ContractSpec layout and typography primitives in JSX surfaces.

## 3.8.10

### Patch Changes

- Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
  - Packages: @contractspec/biome-config (patch), contractspec (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit-core (patch), @contractspec/lib.design-system (patch)
  - Migration: Use ContractSpec layout and typography primitives in JSX surfaces.

## 3.8.9

### Patch Changes

- Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - Packages: contractspec (patch), @contractspec/app.web-landing (patch), @contractspec/bundle.library (patch), @contractspec/lib.contracts-spec (patch), @contractspec/tool.bun (patch), @contractspec/tool.docs-generator (patch), @contractspec/biome-config (patch)

## 3.8.8

### Patch Changes

- Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/module.workspace (minor), @contractspec/bundle.workspace (minor), @contractspec/bundle.library (minor), @contractspec/app.cli-contractspec (minor), vscode-contractspec (minor), contractspec (patch), @contractspec/lib.knowledge (patch), @contractspec/biome-config (patch), @contractspec/app.cursor-marketplace (patch)
  - Migration: ContractSpec workspaces can now opt into family-aware reuse guidance and local catalog sync through `connect.adoption`.; Shared workspace discovery and IDE/CLI create flows now recognize additional contract families beyond the original core set.

## 3.8.7

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.

## 3.8.6

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime

## 3.8.5

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

## 3.8.4

### Patch Changes

- chore: stability & release

## 3.8.3

### Patch Changes

- fix: release

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type

## 3.8.1

### Patch Changes

- fix: release
