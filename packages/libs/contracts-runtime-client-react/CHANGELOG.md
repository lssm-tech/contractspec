# @contractspec/lib.contracts-runtime-client-react

## 3.11.0

### Minor Changes

- Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (minor), @contractspec/lib.ui-kit (minor), @contractspec/lib.ui-kit-core (patch)
  - Migration: Existing text fields and custom driver slots remain compatible.; Prefer `text.password.purpose` for password fields instead of renderer-specific `uiProps.type`.

### Patch Changes

- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Updated dependencies because of Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.presentation-runtime-core@5.0.3
  - @contractspec/lib.schema@3.7.14

## 3.10.2

### Patch Changes

- Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - Packages: contractspec (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.presentation-runtime-core@5.0.2
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.schema@3.7.14

## 3.10.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
  - @contractspec/lib.presentation-runtime-core@5.0.1
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 3.10.0

### Minor Changes

- Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch)
  - Migration: Existing forms continue to render without changes.; New multi-column forms should use `FormSpec.layout`, `group.layout`, and `field.layout.colSpan`.; New input addons should use `inputGroup.addons` on text and textarea fields.
  - Deprecations: `FieldSpec.wrapper.orientation` remains supported but should be replaced by `FieldSpec.layout.orientation` in new specs.
- Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
  - Packages: @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/tool.bun (patch)
  - Migration: Avoid broad root-barrel imports for mobile FormSpec rendering while keeping one shared design-system renderer.
- Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-server-rest (minor), @contractspec/lib.contracts-runtime-server-graphql (minor), @contractspec/lib.contracts-runtime-server-mcp (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.jobs (minor), @contractspec/lib.error (patch)
  - Migration: Replace new uses of `AppError` with `ContractSpecError` or `contractFail`; existing `AppError` consumers can convert to a compatible problem shape with `appErrorToProblem`.
  - Deprecations: Prefer `ContractSpecError`, `createContractError`, and `contractFail` from `@contractspec/lib.contracts-spec/results`; `@contractspec/lib.error` remains as a compatibility bridge for existing `AppError` users.

### Patch Changes

- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.presentation-runtime-core@5.0.0
  - @contractspec/lib.schema@3.7.14

## 3.9.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - @contractspec/lib.presentation-runtime-core@4.0.0

## 3.9.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.presentation-runtime-core@3.9.8

## 3.9.0

### Minor Changes

- Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - Packages: contractspec (major), @contractspec/app.cli-contractspec (major), @contractspec/bundle.workspace (minor), @contractspec/module.workspace (minor), @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-core (minor), @contractspec/lib.ui-kit-web (minor), @contractspec/lib.ui-kit (minor), vscode-contractspec (minor)
  - Migration: Update automation, docs, and local shell habits to use the new generate-first CLI flow.
  - Deprecations: The standalone contractspec apply command has been removed; use contractspec generate for write-generation flows.

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.presentation-runtime-core@3.9.7

## 3.8.6

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.presentation-runtime-core@3.9.6
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.schema@3.7.14

## 3.8.5

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-core@3.9.5
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.schema@3.7.14

## 3.8.4

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-core@3.9.4
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.schema@3.7.13

## 3.8.3

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.schema@3.7.12

## 3.8.2

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.schema@3.7.11

## 3.8.1

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.presentation-runtime-core@3.9.1

## 3.8.0

### Minor Changes

- 81256ea: Make `@contractspec/lib.contracts-spec` contract-model only and move concrete
  runtime and integration code to dedicated packages.

  Major changes:

  - Remove `@contractspec/lib.contracts-spec/presentations/transform-engine`.
  - Remove all `@contractspec/lib.contracts-spec/integrations*` export paths.
  - Remove `@contractspec/lib.contracts-spec/jobs/scaleway-sqs-queue`.
  - Remove provider-type re-exports for email, embedding, LLM, storage, and
    vector-store surfaces from the `@contractspec/lib.contracts-spec` root
    barrel.
  - Keep `PresentationSpec` unchanged while moving transform-engine runtime logic
    out of the contract package.

  New runtime surfaces:

  - Add `@contractspec/lib.presentation-runtime-core/transform-engine` for the
    core transform engine, validators, and markdown/json/xml rendering support.
  - Add `@contractspec/lib.contracts-runtime-client-react/transform-engine` for
    React render descriptors and React-specific transform-engine helpers.
  - Update `@contractspec/lib.contracts-runtime-server-mcp` to use the core
    transform engine without React registration.

  Migration notes:

  - Import integration provider and secret types from
    `@contractspec/lib.contracts-integrations`.
  - Import transform-engine core APIs from
    `@contractspec/lib.presentation-runtime-core/transform-engine`.
  - Import React-specific transform-engine helpers from
    `@contractspec/lib.contracts-runtime-client-react/transform-engine`.

### Patch Changes

- 2619dd8: Break the `contracts-spec` ⇄ `contracts-integrations` build cycle by restoring
  `@contractspec/lib.contracts-spec` to spec-only surfaces.

  Major changes in `@contractspec/lib.contracts-spec`:

  - Remove runtime knowledge exports under `knowledge/ingestion*`,
    `knowledge/query*`, and `knowledge/runtime`.
  - Remove runtime job exports under `jobs/handlers*`,
    `jobs/gcp-cloud-tasks`, `jobs/gcp-pubsub`, and `jobs/memory-queue`.
  - Remove the direct dependency on `@contractspec/lib.contracts-integrations`.
  - Make `app-config` the source of truth for `AppIntegrationBinding`,
    `IntegrationCategory`, and `IntegrationOwnershipMode`.
  - Replace remaining integration and secret-provider dependencies with narrow
    local structural ports for feature install and workflow execution.

  Patch changes:

  - Update `@contractspec/lib.contracts-integrations` to re-export app-config
    binding and ownership/category types from `@contractspec/lib.contracts-spec`.
  - Re-export the default transform-engine helpers from
    `@contractspec/lib.contracts-runtime-client-react/transform-engine`.

  Migration notes:

  - Import knowledge runtime helpers from `@contractspec/lib.knowledge/*`.
  - Import job handlers and queue adapters from `@contractspec/lib.jobs/*`.
  - Import app-config binding/category/mode types from
    `@contractspec/lib.contracts-spec/app-config` if you need the canonical
    contract source.

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0
  - @contractspec/lib.schema@3.7.10

## 3.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.schema@3.7.9

## 3.7.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.schema@3.7.8

## 3.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.schema@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.schema@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.schema@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.schema@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.schema@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.schema@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.schema@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.schema@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.schema@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.schema@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.schema@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.schema@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.schema@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.schema@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- 66c51da: docs(contracts-runtime-client-react): surface-runtime slot integration

  - Add README section on slot content, field renderer registry, widget registry

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.schema@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.schema@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.schema@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.schema@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.schema@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.schema@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.schema@3.2.0

## 3.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.schema@3.1.0

## 3.0.0

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
  - @contractspec/lib.schema@3.0.0

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.schema@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.schema@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.schema@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.schema@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.schema@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.schema@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.schema@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.schema@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.schema@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Minor Changes

- f152678: Scaffolded split contracts packages for spec+registry, integrations definitions, and runtime adapters by surface (client-react, server-rest, server-graphql, server-mcp). Migrated first consumers and documentation examples to the new runtime package imports.

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [94f3c24]
- Updated dependencies [f152678]
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.schema@2.0.0
