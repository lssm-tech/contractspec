# @contractspec/bundle.workspace

## 4.2.0

### Minor Changes

- Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/bundle.workspace (minor), @contractspec/app.cli-contractspec (minor), @contractspec/app.web-landing (patch)
  - Migration: Published release changesets now require a structured release capsule.
  - Deprecations: The standalone release domain under `@contractspec/lib.contracts-spec/release` is deprecated in favor of versioning-owned release metadata.

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-integrations@3.8.9
  - @contractspec/lib.contracts-transformers@3.7.17
  - @contractspec/lib.source-extractors@2.7.17
  - @contractspec/lib.utils-typescript@3.7.13
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/biome-config@3.8.7
  - @contractspec/lib.ai-providers@3.7.13
  - @contractspec/module.workspace@4.1.4
  - @contractspec/lib.ai-agent@8.0.5

## 4.1.4

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-integrations@3.8.8
  - @contractspec/lib.contracts-transformers@3.7.16
  - @contractspec/lib.source-extractors@2.7.16
  - @contractspec/lib.utils-typescript@3.7.12
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/biome-config@3.8.6
  - @contractspec/lib.ai-providers@3.7.12
  - @contractspec/module.workspace@4.1.3
  - @contractspec/lib.ai-agent@8.0.4

## 4.1.3

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-integrations@3.8.7
  - @contractspec/lib.contracts-transformers@3.7.15
  - @contractspec/lib.source-extractors@2.7.15
  - @contractspec/lib.utils-typescript@3.7.11
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/biome-config@3.8.5
  - @contractspec/lib.ai-providers@3.7.11
  - @contractspec/module.workspace@4.1.2
  - @contractspec/lib.ai-agent@8.0.3

## 4.1.2

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-integrations@3.8.6
  - @contractspec/lib.contracts-transformers@3.7.14
  - @contractspec/lib.source-extractors@2.7.14
  - @contractspec/lib.utils-typescript@3.7.10
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/biome-config@3.8.4
  - @contractspec/lib.ai-providers@3.7.10
  - @contractspec/module.workspace@4.1.1
  - @contractspec/lib.ai-agent@8.0.2

## 4.1.1

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.ai-agent@8.0.1
  - @contractspec/lib.contracts-integrations@3.8.5
  - @contractspec/lib.contracts-transformers@3.7.13
  - @contractspec/lib.source-extractors@2.7.13
  - @contractspec/module.workspace@4.1.1

## 4.1.0

### Minor Changes

- 85ddd6a: Align workspace tooling with strict same-file DocBlock authoring.

  - Add shared static authored-DocBlock analysis APIs to
    `@contractspec/module.workspace` for manifest building and validation without
    executing source modules.
  - Update `@contractspec/bundle.workspace` to consume authored DocBlocks through
    static analysis, remove runtime DocBlock registration, and move impact docs
    into their owner modules.
  - Update `@contractspec/app.cli-contractspec` to validate example packages with
    the shared authored-doc rules and reject standalone `*.docblock.ts` sources.
  - Update `vscode-contractspec` to generate same-file DocBlocks in snippets and
    align extension-owned docs with the new authoring model.

### Patch Changes

- 81256ea: Split agent definition contracts out of `@contractspec/lib.ai-agent` and make
  `@contractspec/lib.contracts-spec` the source of truth for agent declaration APIs.

  Major changes:

  - Move `AgentSpec`, `AgentToolConfig`, `AgentPolicy`, `AgentRegistry`,
    `createAgentRegistry`, `defineAgent`, and related definition-only types into
    `@contractspec/lib.contracts-spec/agent`.
  - Add `@contractspec/lib.contracts-spec/agent/spec` and
    `@contractspec/lib.contracts-spec/agent/registry` export subpaths.
  - Remove `@contractspec/lib.ai-agent/spec`,
    `@contractspec/lib.ai-agent/spec/spec`, and
    `@contractspec/lib.ai-agent/spec/registry`.
  - Remove the spec layer from the `@contractspec/lib.ai-agent` root barrel so it
    is runtime-focused.

  Workspace consumers were migrated to import agent-definition contracts from
  `@contractspec/lib.contracts-spec/agent`, and packages that only needed the
  contract layer dropped their direct dependency on `@contractspec/lib.ai-agent`.

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [85ddd6a]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.contracts-integrations@3.8.4
  - @contractspec/lib.ai-agent@8.0.0
  - @contractspec/module.workspace@4.1.0
  - @contractspec/lib.contracts-transformers@3.7.12
  - @contractspec/lib.source-extractors@2.7.12

## 4.0.4

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.3
  - @contractspec/lib.contracts-transformers@3.7.11
  - @contractspec/lib.source-extractors@2.7.11
  - @contractspec/lib.utils-typescript@3.7.9
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/biome-config@3.8.3
  - @contractspec/lib.ai-providers@3.7.9
  - @contractspec/module.workspace@4.0.4
  - @contractspec/lib.ai-agent@7.0.11

## 4.0.3

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-integrations@3.8.2
  - @contractspec/lib.contracts-transformers@3.7.10
  - @contractspec/lib.source-extractors@2.7.10
  - @contractspec/lib.utils-typescript@3.7.8
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/biome-config@3.8.2
  - @contractspec/lib.ai-providers@3.7.8
  - @contractspec/module.workspace@4.0.3
  - @contractspec/lib.ai-agent@7.0.10

## 4.0.2

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.8.1
  - @contractspec/lib.contracts-transformers@3.7.9
  - @contractspec/lib.source-extractors@2.7.9
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/module.workspace@4.0.2
  - @contractspec/lib.ai-agent@7.0.9
  - @contractspec/lib.ai-providers@3.7.7
  - @contractspec/lib.utils-typescript@3.7.7
  - @contractspec/biome-config@3.8.1

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.6
  - @contractspec/lib.contracts-transformers@3.7.6
  - @contractspec/lib.source-extractors@2.7.6
  - @contractspec/lib.utils-typescript@3.7.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.ai-providers@3.7.6
  - @contractspec/module.workspace@3.7.6
  - @contractspec/lib.ai-agent@7.0.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-integrations@3.7.5
  - @contractspec/lib.contracts-transformers@3.7.5
  - @contractspec/lib.source-extractors@2.7.5
  - @contractspec/lib.utils-typescript@3.7.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.ai-providers@3.7.5
  - @contractspec/module.workspace@3.7.5
  - @contractspec/lib.ai-agent@7.0.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.4
  - @contractspec/lib.contracts-transformers@3.7.4
  - @contractspec/lib.source-extractors@2.7.4
  - @contractspec/lib.utils-typescript@3.7.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.ai-providers@3.7.4
  - @contractspec/module.workspace@3.7.4
  - @contractspec/lib.ai-agent@7.0.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-integrations@3.7.3
  - @contractspec/lib.contracts-transformers@3.7.3
  - @contractspec/lib.source-extractors@2.7.3
  - @contractspec/lib.utils-typescript@3.7.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.ai-providers@3.7.3
  - @contractspec/module.workspace@3.7.3
  - @contractspec/lib.ai-agent@7.0.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- 04bc555: Improve contract integrity, example validation, onboarding docs, doctor safety,
  release verification, packaged smoke testing, and security workflow coverage.
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-integrations@3.7.2
  - @contractspec/lib.contracts-transformers@3.7.2
  - @contractspec/lib.source-extractors@2.7.2
  - @contractspec/lib.utils-typescript@3.7.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.ai-providers@3.7.2
  - @contractspec/module.workspace@3.7.2
  - @contractspec/lib.ai-agent@7.0.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-integrations@3.7.1
  - @contractspec/lib.contracts-transformers@3.7.1
  - @contractspec/lib.source-extractors@2.7.1
  - @contractspec/lib.utils-typescript@3.7.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.ai-providers@3.7.1
  - @contractspec/module.workspace@3.7.1
  - @contractspec/lib.ai-agent@7.0.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-integrations@3.7.0
  - @contractspec/lib.contracts-transformers@3.7.0
  - @contractspec/lib.source-extractors@2.7.0
  - @contractspec/lib.utils-typescript@3.7.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.ai-providers@3.7.0
  - @contractspec/module.workspace@3.7.0
  - @contractspec/lib.ai-agent@7.0.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.ai-agent@6.0.0
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.contracts-integrations@3.6.0
  - @contractspec/lib.contracts-transformers@3.6.0
  - @contractspec/lib.source-extractors@2.6.0
  - @contractspec/lib.utils-typescript@3.6.0
  - @contractspec/lib.ai-providers@3.6.0
  - @contractspec/module.workspace@3.6.0

## 3.5.5

### Patch Changes

- 27b77db: feat(ai-models): add latest models and align defaults

  - Add claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5, gpt-5.4, gpt-5-mini
  - Add mistral-large-2512, mistral-medium-2508, mistral-small-2506, devstral-2512
  - Add gemini-3.1-pro-preview, gemini-3.1-flash-lite-preview, gemini-3-flash-preview
  - Fix GPT-5.4 cost and context window; update default models to claude-sonnet-4-6
  - Enrich provider-ranking MCP with cost from ai-providers when store has none
  - Update model allowlist for gpt-5 and gemini 3.x; align agentpacks templates

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.ai-providers@3.5.5
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.ai-agent@5.0.5
  - @contractspec/lib.contracts-integrations@3.5.5
  - @contractspec/lib.contracts-transformers@3.5.5
  - @contractspec/lib.source-extractors@2.5.5
  - @contractspec/lib.utils-typescript@3.5.5
  - @contractspec/module.workspace@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- f5d4816: Standardize MCP tool naming from dot notation to underscore notation for MCP protocol compatibility. Update docs, docblocks, and generated indexes accordingly. Path resolver and fixture updates.
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-integrations@3.5.4
  - @contractspec/lib.contracts-transformers@3.5.4
  - @contractspec/lib.source-extractors@2.5.4
  - @contractspec/lib.utils-typescript@3.5.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.ai-providers@3.5.4
  - @contractspec/module.workspace@3.5.4
  - @contractspec/lib.ai-agent@5.0.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
- Updated dependencies [56ae36d]
  - @contractspec/lib.contracts-integrations@3.5.3
  - @contractspec/lib.contracts-transformers@3.5.3
  - @contractspec/lib.source-extractors@2.5.3
  - @contractspec/lib.utils-typescript@3.5.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.ai-providers@3.5.3
  - @contractspec/module.workspace@3.5.3
  - @contractspec/lib.ai-agent@5.0.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-integrations@3.5.2
  - @contractspec/lib.contracts-transformers@3.5.2
  - @contractspec/lib.source-extractors@2.5.2
  - @contractspec/lib.utils-typescript@3.5.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.ai-providers@3.5.2
  - @contractspec/module.workspace@3.5.2
  - @contractspec/lib.ai-agent@5.0.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- 73a7f8d: Update operation templates (skeleton-operation, operation.template, operation.ts).
- Updated dependencies [dfff0d4]
- Updated dependencies [73a7f8d]
- Updated dependencies [73a7f8d]
  - @contractspec/lib.contracts-integrations@3.5.1
  - @contractspec/lib.contracts-transformers@3.5.1
  - @contractspec/lib.source-extractors@2.5.1
  - @contractspec/lib.utils-typescript@3.5.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.ai-providers@3.5.1
  - @contractspec/module.workspace@3.5.1
  - @contractspec/lib.ai-agent@5.0.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-integrations@3.5.0
  - @contractspec/lib.contracts-transformers@3.5.0
  - @contractspec/lib.source-extractors@2.5.0
  - @contractspec/lib.utils-typescript@3.5.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.ai-providers@3.5.0
  - @contractspec/module.workspace@3.5.0
  - @contractspec/lib.ai-agent@5.0.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-integrations@3.4.3
  - @contractspec/lib.contracts-transformers@3.4.3
  - @contractspec/lib.source-extractors@2.4.3
  - @contractspec/lib.utils-typescript@3.4.3
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.ai-providers@3.4.3
  - @contractspec/module.workspace@3.4.3
  - @contractspec/lib.ai-agent@4.0.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-integrations@3.4.2
  - @contractspec/lib.contracts-transformers@3.4.2
  - @contractspec/lib.source-extractors@2.4.2
  - @contractspec/lib.utils-typescript@3.4.2
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.ai-providers@3.4.2
  - @contractspec/module.workspace@3.4.2
  - @contractspec/lib.ai-agent@4.0.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-integrations@3.4.1
  - @contractspec/lib.contracts-transformers@3.4.1
  - @contractspec/lib.source-extractors@2.4.1
  - @contractspec/lib.utils-typescript@3.4.1
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.ai-providers@3.4.1
  - @contractspec/module.workspace@3.4.1
  - @contractspec/lib.ai-agent@4.0.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-integrations@3.4.0
  - @contractspec/lib.contracts-transformers@3.4.0
  - @contractspec/lib.source-extractors@2.4.0
  - @contractspec/lib.utils-typescript@3.4.0
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.ai-providers@3.4.0
  - @contractspec/module.workspace@3.4.0
  - @contractspec/lib.ai-agent@4.0.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- 575b316: Fix lint and build errors: replace forbidden non-null assertion with safe flatMap guard in changelog formatter, and ensure required Record fields survive Partial spread in integration test helpers
- Updated dependencies [890a0da]
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.3.0
  - @contractspec/lib.contracts-transformers@3.3.0
  - @contractspec/lib.source-extractors@2.3.0
  - @contractspec/lib.utils-typescript@3.3.0
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.ai-providers@3.3.0
  - @contractspec/module.workspace@3.3.0
  - @contractspec/lib.ai-agent@3.3.0

## 3.2.1

### Patch Changes

- 575b316: Fix lint and build errors: replace forbidden non-null assertion with safe flatMap guard in changelog formatter, and ensure required Record fields survive Partial spread in integration test helpers
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.2.1
  - @contractspec/module.workspace@3.2.1
  - @contractspec/lib.ai-agent@3.2.1

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-integrations@3.2.0
  - @contractspec/lib.contracts-transformers@3.2.0
  - @contractspec/lib.source-extractors@2.2.0
  - @contractspec/lib.utils-typescript@3.2.0
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.ai-providers@3.2.0
  - @contractspec/module.workspace@3.2.0
  - @contractspec/lib.ai-agent@3.2.0

## 3.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-integrations@3.1.1
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/lib.ai-providers@3.1.1
  - @contractspec/module.workspace@3.1.1
  - @contractspec/lib.ai-agent@3.1.1
  - @contractspec/lib.contracts-transformers@3.1.1
  - @contractspec/lib.source-extractors@2.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.ai-agent@3.1.0
  - @contractspec/lib.contracts-integrations@3.1.0
  - @contractspec/lib.contracts-transformers@3.1.0
  - @contractspec/lib.source-extractors@2.1.0
  - @contractspec/lib.utils-typescript@3.1.0
  - @contractspec/lib.ai-providers@3.1.0
  - @contractspec/module.workspace@3.1.0

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Patch Changes

- c608804: Add a new messaging integration category and provider contracts for Slack, GitHub, WhatsApp Meta, and WhatsApp Twilio, plus provider implementation wiring for outbound delivery.

  Introduce an AI-native channel runtime with webhook normalization/signature verification, policy gating, idempotent ingest, outbox dispatch/retry flow, API ingress routes, scheduler dispatch support, and end-to-end integration coverage in api-library.

- Updated dependencies [7cbdb7f]
- Updated dependencies [c608804]
- Updated dependencies [e3bc858]
- Updated dependencies [b19ae0a]
- Updated dependencies [aa4a9c9]
- Updated dependencies [b781ce6]
  - @contractspec/lib.contracts-spec@3.0.0
  - @contractspec/lib.contracts-integrations@3.0.0
  - @contractspec/lib.ai-providers@3.0.0
  - @contractspec/module.workspace@3.0.0
  - @contractspec/lib.contracts-transformers@3.0.0
  - @contractspec/lib.source-extractors@2.0.0
  - @contractspec/lib.utils-typescript@3.0.0
  - @contractspec/lib.ai-agent@3.0.0

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-integrations@2.10.0
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/module.workspace@2.9.1
  - @contractspec/lib.ai-agent@2.9.1
  - @contractspec/lib.contracts-transformers@2.9.1
  - @contractspec/lib.source-extractors@1.9.1

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-integrations@2.9.0
  - @contractspec/lib.contracts-transformers@2.9.0
  - @contractspec/lib.source-extractors@1.9.0
  - @contractspec/lib.utils-typescript@2.9.0
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.ai-providers@2.9.0
  - @contractspec/module.workspace@2.9.0
  - @contractspec/lib.ai-agent@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-agent@2.8.0
  - @contractspec/lib.ai-providers@2.8.0
  - @contractspec/lib.contracts-integrations@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.contracts-transformers@2.8.0
  - @contractspec/lib.source-extractors@1.8.0
  - @contractspec/lib.utils-typescript@2.8.0
  - @contractspec/module.workspace@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-agent@2.7.0
  - @contractspec/lib.ai-providers@2.7.0
  - @contractspec/lib.contracts-integrations@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.contracts-transformers@2.7.0
  - @contractspec/lib.source-extractors@1.7.0
  - @contractspec/lib.utils-typescript@2.7.0
  - @contractspec/module.workspace@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.ai-agent@2.6.0
  - @contractspec/lib.ai-providers@2.6.0
  - @contractspec/lib.contracts-integrations@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.contracts-transformers@2.6.0
  - @contractspec/lib.source-extractors@1.6.0
  - @contractspec/lib.utils-typescript@2.6.0
  - @contractspec/module.workspace@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.contracts-integrations@2.5.0
  - @contractspec/lib.ai-agent@2.5.0
  - @contractspec/lib.contracts-transformers@2.5.0
  - @contractspec/lib.source-extractors@1.5.0
  - @contractspec/lib.utils-typescript@2.5.0
  - @contractspec/lib.ai-providers@2.5.0
  - @contractspec/module.workspace@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-integrations@2.4.0
  - @contractspec/lib.contracts-transformers@2.4.0
  - @contractspec/lib.source-extractors@1.4.0
  - @contractspec/lib.utils-typescript@2.4.0
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.ai-providers@2.4.0
  - @contractspec/module.workspace@2.4.0
  - @contractspec/lib.ai-agent@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-integrations@2.3.0
  - @contractspec/lib.contracts-transformers@2.3.0
  - @contractspec/lib.source-extractors@1.3.0
  - @contractspec/lib.utils-typescript@2.3.0
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.ai-providers@2.3.0
  - @contractspec/module.workspace@2.3.0
  - @contractspec/lib.ai-agent@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-integrations@2.2.0
  - @contractspec/lib.contracts-transformers@2.2.0
  - @contractspec/lib.source-extractors@1.2.0
  - @contractspec/lib.utils-typescript@2.2.0
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.ai-providers@2.2.0
  - @contractspec/module.workspace@2.2.0
  - @contractspec/lib.ai-agent@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.ai-agent@2.1.1
  - @contractspec/lib.contracts-integrations@2.1.1
  - @contractspec/lib.contracts-transformers@2.1.1
  - @contractspec/lib.source-extractors@1.1.1
  - @contractspec/module.workspace@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.contracts-integrations@2.1.0
  - @contractspec/lib.contracts-transformers@2.1.0
  - @contractspec/lib.source-extractors@1.1.0
  - @contractspec/lib.utils-typescript@2.1.0
  - @contractspec/lib.ai-providers@2.1.0
  - @contractspec/module.workspace@2.1.0
  - @contractspec/lib.ai-agent@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [94f3c24]
- Updated dependencies [f152678]
- Updated dependencies [7f3203a]
  - @contractspec/lib.contracts-integrations@2.0.0
  - @contractspec/lib.contracts-transformers@2.0.0
  - @contractspec/lib.source-extractors@1.0.0
  - @contractspec/lib.utils-typescript@2.0.0
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.ai-providers@2.0.0
  - @contractspec/module.workspace@2.0.0
  - @contractspec/lib.ai-agent@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.ai-agent@1.62.0
  - @contractspec/lib.contracts-transformers@1.62.0
  - @contractspec/lib.source-extractors@0.16.0
  - @contractspec/lib.utils-typescript@1.62.0
  - @contractspec/lib.ai-providers@1.62.0
  - @contractspec/module.workspace@1.62.0
  - @contractspec/lib.contracts@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.contracts-transformers@1.61.0
  - @contractspec/lib.source-extractors@0.15.0
  - @contractspec/lib.utils-typescript@1.61.0
  - @contractspec/lib.ai-providers@1.61.0
  - @contractspec/module.workspace@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0
  - @contractspec/lib.ai-agent@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.60.0
  - @contractspec/lib.source-extractors@0.14.0
  - @contractspec/lib.utils-typescript@1.60.0
  - @contractspec/lib.ai-providers@1.60.0
  - @contractspec/module.workspace@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0
  - @contractspec/lib.ai-agent@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.contracts-transformers@1.59.0
  - @contractspec/lib.source-extractors@0.13.0
  - @contractspec/lib.utils-typescript@1.59.0
  - @contractspec/lib.ai-providers@1.59.0
  - @contractspec/module.workspace@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0
  - @contractspec/lib.ai-agent@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.contracts-transformers@1.58.0
  - @contractspec/lib.source-extractors@0.12.0
  - @contractspec/lib.utils-typescript@1.58.0
  - @contractspec/lib.ai-providers@1.58.0
  - @contractspec/module.workspace@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0
  - @contractspec/lib.ai-agent@1.58.0

## 1.57.0

### Minor Changes

- a119963: Add project-management integrations (Linear, Jira, Notion), sync helpers for product intent outputs, and expose the new integration category across workspace tooling.
- 4651e06: Add Supabase and voice provider integrations with new runnable examples, and expose these providers across contracts, workspace tooling, and provider factory wiring.
- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [8ecf3c1]
- Updated dependencies [47c48c2]
- Updated dependencies [a119963]
- Updated dependencies [4651e06]
- Updated dependencies [ad9d10a]
- Updated dependencies [11a5a05]
  - @contractspec/lib.contracts-spec@1.57.0
  - @contractspec/module.workspace@1.57.0
  - @contractspec/lib.contracts-transformers@1.57.0
  - @contractspec/lib.source-extractors@0.11.0
  - @contractspec/lib.utils-typescript@1.57.0
  - @contractspec/lib.ai-providers@1.57.0
  - @contractspec/lib.ai-agent@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.56.1
  - @contractspec/lib.source-extractors@0.10.1
  - @contractspec/lib.utils-typescript@1.56.1
  - @contractspec/lib.ai-providers@1.56.1
  - @contractspec/module.workspace@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1
  - @contractspec/lib.ai-agent@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.56.0
  - @contractspec/lib.source-extractors@0.10.0
  - @contractspec/lib.utils-typescript@1.56.0
  - @contractspec/lib.ai-providers@1.56.0
  - @contractspec/module.workspace@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0
  - @contractspec/lib.ai-agent@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.55.0
  - @contractspec/lib.source-extractors@0.9.0
  - @contractspec/lib.utils-typescript@1.55.0
  - @contractspec/lib.ai-providers@1.55.0
  - @contractspec/module.workspace@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0
  - @contractspec/lib.ai-agent@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/lib.ai-agent@1.54.0
  - @contractspec/lib.ai-providers@1.54.0
  - @contractspec/lib.contracts-transformers@1.54.0
  - @contractspec/lib.source-extractors@0.8.0
  - @contractspec/lib.utils-typescript@1.54.0
  - @contractspec/module.workspace@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- 5b371b1: Expose OpenCode agent mode in the CLI and workspace validation with updated docs and examples.
- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/module.workspace@1.53.0
  - @contractspec/lib.ai-agent@1.53.0
  - @contractspec/lib.ai-providers@1.53.0
  - @contractspec/lib.contracts-transformers@1.53.0
  - @contractspec/lib.source-extractors@0.7.0
  - @contractspec/lib.utils-typescript@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.contracts-transformers@1.52.0
  - @contractspec/lib.source-extractors@0.6.0
  - @contractspec/lib.ai-providers@1.52.0
  - @contractspec/module.workspace@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0
  - @contractspec/lib.ai-agent@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.contracts-transformers@1.51.0
  - @contractspec/lib.source-extractors@0.5.0
  - @contractspec/lib.ai-providers@1.51.0
  - @contractspec/module.workspace@1.51.0
  - @contractspec/lib.ai-agent@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo
- 81a703b: feat: add --baseline option to view command for PR change summaries
  - Add `diffFiles()` method to GitAdapter for listing changed files between refs
  - Add `generateViews()` service function with baseline filtering and audience validation
  - Add `listSpecsForView()` helper for spec file resolution
  - Add `--baseline <ref>` option to `contractspec view` command
  - Update GitHub Actions workflow to show only changed contracts in PR comments
  - Refactor CLI to delegate all business logic to bundle service

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.ai-agent@1.50.0
  - @contractspec/lib.ai-providers@1.50.0
  - @contractspec/lib.contracts-transformers@1.50.0
  - @contractspec/lib.source-extractors@0.4.0
  - @contractspec/module.workspace@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.contracts-transformers@1.49.0
  - @contractspec/lib.source-extractors@0.3.0
  - @contractspec/lib.ai-providers@1.49.0
  - @contractspec/module.workspace@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0
  - @contractspec/lib.ai-agent@1.49.0

## 1.48.1

### Patch Changes

- c560ee7: Add onboarding and documentation surfaces across the library and marketing bundles, plus small tracking, telemetry, and UI copy refinements to support adoption workflows.
- Updated dependencies [c560ee7]
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/lib.ai-agent@1.48.1
  - @contractspec/lib.contracts-transformers@1.48.1
  - @contractspec/lib.source-extractors@0.2.1
  - @contractspec/module.workspace@1.48.1

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.contracts-transformers@1.48.0
  - @contractspec/lib.source-extractors@0.2.0
  - @contractspec/lib.ai-providers@1.48.0
  - @contractspec/module.workspace@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0
  - @contractspec/lib.ai-agent@1.48.0

## 1.47.0

### Minor Changes

- caf8701: feat: add cli vibe command to run workflow
- c69b849: feat: add api web services (mcp & website)
- 42b8d78: feat: add cli `contractspec vibe` workflow to simplify usage
- fd38e85: feat: auto-fix contractspec issues

### Patch Changes

- e7ded36: feat: improve stability (adding ts-morph)
- c231a8b: test: improve workspace stability
- Updated dependencies [e7ded36]
- Updated dependencies [caf8701]
- Updated dependencies [c69b849]
- Updated dependencies [c231a8b]
- Updated dependencies [42b8d78]
- Updated dependencies [fd38e85]
  - @contractspec/lib.contracts-transformers@1.47.0
  - @contractspec/lib.ai-providers@1.47.0
  - @contractspec/module.workspace@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0
  - @contractspec/lib.ai-agent@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.contracts-transformers@1.46.2
  - @contractspec/lib.ai-providers@1.46.2
  - @contractspec/module.workspace@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.contracts-transformers@1.46.1
  - @contractspec/lib.ai-providers@1.46.1
  - @contractspec/module.workspace@1.46.1
  - @contractspec/lib.contracts-spec@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.contracts-transformers@1.46.0
  - @contractspec/lib.ai-providers@1.46.0
  - @contractspec/module.workspace@1.46.0
  - @contractspec/lib.contracts-spec@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.contracts-transformers@1.45.6
  - @contractspec/lib.ai-providers@1.45.6
  - @contractspec/module.workspace@1.45.6
  - @contractspec/lib.contracts-spec@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.contracts-transformers@1.45.5
  - @contractspec/lib.ai-providers@1.45.5
  - @contractspec/module.workspace@1.45.5
  - @contractspec/lib.contracts-spec@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.45.4
  - @contractspec/lib.ai-providers@1.45.4
  - @contractspec/module.workspace@1.45.4
  - @contractspec/lib.contracts-spec@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.contracts-transformers@1.45.3
  - @contractspec/lib.ai-providers@1.45.3
  - @contractspec/module.workspace@1.45.3
  - @contractspec/lib.contracts-spec@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.contracts-transformers@1.45.2
  - @contractspec/lib.ai-providers@1.45.2
  - @contractspec/module.workspace@1.45.2
  - @contractspec/lib.contracts-spec@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.45.1
  - @contractspec/lib.ai-providers@1.45.1
  - @contractspec/module.workspace@1.45.1
  - @contractspec/lib.contracts-spec@1.45.1
  - @contractspec/lib.testing@1.45.1
  - @contractspec/lib.schema@1.45.1

## 1.45.0

### Minor Changes

- e73ca1d: feat: improve app config and examples contracts
  feat: Contract layers support (features, examples, app-configs)

  ### New CLI Commands

  - `contractspec list layers` - List all contract layers with filtering

  ### Enhanced Commands

  - `contractspec ci` - New `layers` check category validates features/examples/config
  - `contractspec doctor` - New `layers` health checks
  - `contractspec integrity` - Now shows layer statistics

  ### New APIs

  - `discoverLayers()` - Scan workspace for all layer files
  - `scanExampleSource()` - Parse ExampleSpec from source code
  - `isExampleFile()` - Check if file is an example spec

### Patch Changes

- Updated dependencies [e73ca1d]
  - @contractspec/lib.contracts-transformers@1.45.0
  - @contractspec/lib.ai-providers@1.45.0
  - @contractspec/module.workspace@1.45.0
  - @contractspec/lib.contracts-spec@1.45.0
  - @contractspec/lib.testing@1.45.0
  - @contractspec/lib.schema@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.contracts-transformers@1.44.1
  - @contractspec/lib.ai-providers@1.44.1
  - @contractspec/module.workspace@1.44.1
  - @contractspec/lib.contracts-spec@1.44.1
  - @contractspec/lib.testing@1.44.1
  - @contractspec/lib.schema@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.contracts-transformers@1.44.0
  - @contractspec/lib.ai-providers@1.44.0
  - @contractspec/module.workspace@1.44.0
  - @contractspec/lib.contracts-spec@1.44.0
  - @contractspec/lib.testing@1.44.0
  - @contractspec/lib.schema@1.44.0

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/module.workspace@1.43.3
  - @contractspec/lib.contracts-transformers@1.43.3
  - @contractspec/lib.ai-providers@1.43.2
  - @contractspec/lib.contracts-spec@1.43.3
  - @contractspec/lib.testing@1.43.3
  - @contractspec/lib.schema@1.43.2

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/module.workspace@1.43.2
  - @contractspec/lib.contracts-transformers@1.43.2
  - @contractspec/lib.contracts-spec@1.43.2
  - @contractspec/lib.testing@1.43.2
  - @contractspec/lib.ai-providers@1.43.1
  - @contractspec/lib.schema@1.43.1

## 1.43.1

### Patch Changes

- Updated dependencies [f28fdad]
  - @contractspec/lib.contracts-spec@1.43.1
  - @contractspec/lib.contracts-transformers@1.43.1
  - @contractspec/lib.testing@1.43.1
  - @contractspec/module.workspace@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/module.workspace@1.43.0
  - @contractspec/lib.contracts-transformers@1.43.0
  - @contractspec/lib.ai-providers@1.43.0
  - @contractspec/lib.contracts-spec@1.43.0
  - @contractspec/lib.testing@1.43.0
  - @contractspec/lib.schema@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/module.workspace@1.42.10
  - @contractspec/lib.contracts-transformers@1.42.10
  - @contractspec/lib.ai-providers@1.42.10
  - @contractspec/lib.contracts-spec@1.42.10
  - @contractspec/lib.testing@1.42.10
  - @contractspec/lib.schema@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/module.workspace@1.42.9
  - @contractspec/lib.contracts-transformers@1.42.9
  - @contractspec/lib.ai-providers@1.42.9
  - @contractspec/lib.contracts-spec@1.42.9
  - @contractspec/lib.testing@1.42.9
  - @contractspec/lib.schema@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/module.workspace@1.42.8
  - @contractspec/lib.contracts-transformers@1.42.8
  - @contractspec/lib.ai-providers@1.42.8
  - @contractspec/lib.contracts-spec@1.42.8
  - @contractspec/lib.testing@1.42.8
  - @contractspec/lib.schema@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/module.workspace@1.42.7
  - @contractspec/lib.contracts-transformers@1.42.7
  - @contractspec/lib.ai-providers@1.42.7
  - @contractspec/lib.contracts-spec@1.42.7
  - @contractspec/lib.testing@1.42.7
  - @contractspec/lib.schema@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/module.workspace@1.42.6
  - @contractspec/lib.contracts-transformers@1.42.6
  - @contractspec/lib.ai-providers@1.42.6
  - @contractspec/lib.contracts-spec@1.42.6
  - @contractspec/lib.testing@1.42.6
  - @contractspec/lib.schema@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/module.workspace@1.42.5
  - @contractspec/lib.contracts-transformers@1.42.5
  - @contractspec/lib.ai-providers@1.42.5
  - @contractspec/lib.contracts-spec@1.42.5
  - @contractspec/lib.testing@1.42.5
  - @contractspec/lib.schema@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/module.workspace@1.42.4
  - @contractspec/lib.contracts-transformers@1.42.4
  - @contractspec/lib.ai-providers@1.42.4
  - @contractspec/lib.contracts-spec@1.42.4
  - @contractspec/lib.testing@1.42.4
  - @contractspec/lib.schema@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.contracts-transformers@1.42.3
  - @contractspec/lib.ai-providers@1.42.3
  - @contractspec/lib.contracts-spec@1.42.3
  - @contractspec/lib.schema@1.42.3
  - @contractspec/lib.testing@1.42.3
  - @contractspec/module.workspace@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/lib.ai-providers@1.42.2
  - @contractspec/lib.contracts-spec@1.42.2
  - @contractspec/lib.contracts-transformers@1.42.2
  - @contractspec/lib.schema@1.42.2
  - @contractspec/lib.testing@1.42.2
  - @contractspec/module.workspace@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/module.workspace@1.42.1
  - @contractspec/lib.contracts-transformers@1.42.1
  - @contractspec/lib.ai-providers@1.42.1
  - @contractspec/lib.contracts-spec@1.42.1
  - @contractspec/lib.testing@1.42.1
  - @contractspec/lib.schema@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/lib.ai-providers@1.42.0
  - @contractspec/lib.contracts-spec@1.42.0
  - @contractspec/lib.contracts-transformers@1.42.0
  - @contractspec/lib.schema@1.42.0
  - @contractspec/lib.testing@1.42.0
  - @contractspec/module.workspace@1.42.0
