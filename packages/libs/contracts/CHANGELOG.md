# @contractspec/lib.contracts

## 1.65.0

### Minor Changes

- chore: improve documentation

## 1.64.0

### Minor Changes

- 12c9556: feat: release agentpacks

## 1.63.0

### Minor Changes

- feat: release ContractSpec Studio

## 1.62.0

### Minor Changes

- 362fbac: feat: improve video

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.logger@1.61.0
  - @contractspec/lib.schema@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@1.60.0
  - @contractspec/lib.schema@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.logger@1.59.0
  - @contractspec/lib.schema@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.
- 4355a9e: Add Granola MCP transport support alongside Enterprise API for meeting-recorder integrations, and update provider specs/examples to document and demonstrate MCP-based setup.

### Patch Changes

- Updated dependencies [d1f0fd0]
  - @contractspec/lib.logger@1.58.0
  - @contractspec/lib.schema@1.58.0

## 1.57.0

### Minor Changes

- 8ecf3c1: Add typed PostHog read APIs and readers across contracts, providers, metering, evolution, analytics, observability, and examples.
- a119963: Add project-management integrations (Linear, Jira, Notion), sync helpers for product intent outputs, and expose the new integration category across workspace tooling.
- 4651e06: Add Supabase and voice provider integrations with new runnable examples, and expose these providers across contracts, workspace tooling, and provider factory wiring.
- ad9d10a: feat: improve posthog integration
- 11a5a05: feat: improve product intent

### Patch Changes

- 47c48c2: Refine product-intent contracts, add core/module orchestration and bundle wiring, and expand tests/examples.
- Updated dependencies [11a5a05]
  - @contractspec/lib.logger@1.57.0
  - @contractspec/lib.schema@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.logger@1.56.1
  - @contractspec/lib.schema@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@1.56.0
  - @contractspec/lib.schema@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@1.55.0
  - @contractspec/lib.schema@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.logger@1.54.0
  - @contractspec/lib.schema@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement
- 64d84e1: Add contract-level verification table to impact reports. Defines query and data view contracts for per-contract drift status, surfaces covered, and last verified commit. Reports render the table when contracts data is present; backward compatible when absent.

### Patch Changes

- 5b371b1: Expose OpenCode agent mode in the CLI and workspace validation with updated docs and examples.
- Updated dependencies [f4180d4]
  - @contractspec/lib.schema@1.53.0
  - @contractspec/lib.logger@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.logger@1.52.0
  - @contractspec/lib.schema@1.52.0

## 1.51.0

### Minor Changes

- 23e46e9: feat(capabilities): robustify capabilities with bidirectional linking and runtime enforcement
  - Add optional `capability` field to OperationSpec, EventSpec, and PresentationSpec for bidirectional linking
  - Add `extends` field to CapabilitySpec for capability inheritance
  - Add registry query methods: getOperationsFor, getEventsFor, getPresentationsFor, getCapabilitiesForOperation/Event/Presentation
  - Add inheritance methods: getAncestors, getEffectiveRequirements, getEffectiveSurfaces
  - Create validation.ts with validateCapabilityConsistency() for bidirectional validation
  - Create context.ts with CapabilityContext for opt-in runtime capability checks
  - Create guards.ts with assertCapabilityForOperation/Event/Presentation guards
  - Add comprehensive tests (50 new tests)
  - Update capabilities docblock with full documentation

- ad1f852: feat(contracts): robustify policy, workflow, and translations modules

  Phase 2 of the contracts library robustification:

  **Policy Module (Phase 2.1):**
  - Add `PolicyContext` for runtime RBAC/ABAC enforcement with role/permission checks
  - Add `PolicyViolationError` with detailed violation types
  - Add policy guards: `checkPolicyForOperation`, `assertPolicyForOperation`, `filterOperationsByPolicy`
  - Add role/permission guards: `checkRole`, `assertRole`, `checkPermission`, `assertPermission`
  - Add rate limiting support with sliding window algorithm
  - Add audit trail integration
  - Add `validatePolicySpec` and `validatePolicyConsistency` for policy validation
  - 128 new tests

  **Workflow Module (Phase 2.2):**
  - Add `WorkflowContext` interface for state management, transitions, and SLA tracking
  - Add `WorkflowContextError` with typed error categories
  - Add compensation/rollback support hints
  - Add helper utilities: `calculateWorkflowProgress`, `getWorkflowDuration`, `getAverageStepDuration`
  - Enhance validation with cross-registry consistency checks
  - Add `validateWorkflowConsistency` for operations/events integration
  - Add `validateSlaConfig`, `validateCompensation`, `validateRetryConfig`
  - 64 new tests

  **Translations Module (Phase 2.3):**
  - Add full `TranslationSpec` with placeholders, plural rules, and message variants
  - Add `TranslationRegistry` with locale-aware lookup and fallback chains
  - Add `defineTranslation` factory function
  - Add ICU message format validation with `validateICUFormat`
  - Add missing translation detection with `findMissingTranslations`, `findAllMissingTranslations`
  - Add `validateTranslationSpec` and `validateTranslationRegistry`
  - Add `TranslationValidationError` for assertion helpers
  - 77 new tests

  Total: 890 tests across 93 files, all passing.

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [e6faefb]
  - @contractspec/lib.logger@1.51.0
  - @contractspec/lib.schema@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.logger@1.50.0
  - @contractspec/lib.schema@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.logger@1.49.0
  - @contractspec/lib.schema@1.49.0

## 1.48.1

### Patch Changes

- c560ee7: Add onboarding and documentation surfaces across the library and marketing bundles, plus small tracking, telemetry, and UI copy refinements to support adoption workflows.

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.logger@1.48.0
  - @contractspec/lib.schema@1.48.0

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
  - @contractspec/lib.logger@1.47.0
  - @contractspec/lib.schema@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.logger@1.46.2
  - @contractspec/lib.schema@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.logger@1.46.1
  - @contractspec/lib.schema@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.logger@1.46.0
  - @contractspec/lib.schema@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.logger@1.45.6
  - @contractspec/lib.schema@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.logger@1.45.5
  - @contractspec/lib.schema@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.logger@1.45.4
  - @contractspec/lib.schema@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.logger@1.45.3
  - @contractspec/lib.schema@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.logger@1.45.2
  - @contractspec/lib.schema@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.logger@1.45.1
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
  - @contractspec/lib.logger@1.45.0
  - @contractspec/lib.schema@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.logger@1.44.1
  - @contractspec/lib.schema@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.logger@1.44.0
  - @contractspec/lib.schema@1.44.0

## 1.43.4

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/lib.logger@1.43.3
  - @contractspec/lib.schema@1.43.3

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/lib.logger@1.43.2
  - @contractspec/lib.schema@1.43.2

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/lib.logger@1.43.1
  - @contractspec/lib.schema@1.43.1

## 1.43.1

### Patch Changes

- f28fdad: fix

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/lib.logger@1.43.0
  - @contractspec/lib.schema@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/lib.logger@1.42.10
  - @contractspec/lib.schema@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/lib.logger@1.42.9
  - @contractspec/lib.schema@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/lib.logger@1.42.8
  - @contractspec/lib.schema@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/lib.logger@1.42.7
  - @contractspec/lib.schema@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/lib.logger@1.42.6
  - @contractspec/lib.schema@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/lib.logger@1.42.5
  - @contractspec/lib.schema@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/lib.logger@1.42.4
  - @contractspec/lib.schema@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.logger@1.42.3
  - @contractspec/lib.schema@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/lib.logger@1.42.2
  - @contractspec/lib.schema@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/lib.logger@1.42.1
  - @contractspec/lib.schema@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/lib.logger@1.42.0
  - @contractspec/lib.schema@1.42.0

## 1.12.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

### Patch Changes

- Updated dependencies
  - @contractspec/lib.graphql-federation@1.12.0
  - @contractspec/lib.schema@1.12.0

## 1.11.1

### Patch Changes

- Fix dependencies
- Updated dependencies
  - @contractspec/lib.graphql-federation@1.11.1
  - @contractspec/lib.schema@1.11.1

## 1.11.0

### Minor Changes

- b7621d3: Fix version

### Patch Changes

- Updated dependencies [b7621d3]
  - @contractspec/lib.schema@1.11.0

## 1.10.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.10.0

## 1.9.2

### Patch Changes

- fix dependencies
- Updated dependencies
  - @contractspec/lib.schema@1.9.2

## 1.9.1

### Patch Changes

- fix
- Updated dependencies
  - @contractspec/lib.schema@1.9.1

## 1.9.0

### Minor Changes

- b1d0876: Managed platform

### Patch Changes

- Updated dependencies [b1d0876]
  - @contractspec/lib.schema@1.9.0

## 1.8.0

### Minor Changes

- f1f4ddd: Foundation Hardening

### Patch Changes

- Updated dependencies [f1f4ddd]
  - @contractspec/lib.schema@1.8.0

## 1.7.4

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.schema@1.7.4

## 1.7.3

### Patch Changes

- add right-sidebar
- Updated dependencies
  - @contractspec/lib.schema@1.7.3

## 1.7.2

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.schema@1.7.2

## 1.7.1

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.schema@1.7.1

## 1.7.0

### Minor Changes

- fixii

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.7.0

## 1.6.0

### Minor Changes

- fix versionnnn

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.6.0

## 1.5.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.5.0

## 1.4.0

### Minor Changes

- fix exports

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.4.0

## 1.3.0

### Minor Changes

- fix it

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.3.0

## 1.2.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@1.2.0

## 1.1.0

### Minor Changes

- fix
- 748b3a2: fix publish

### Patch Changes

- Updated dependencies
- Updated dependencies [748b3a2]
  - @contractspec/lib.schema@1.1.0

## 1.1.0

### Minor Changes

- eeba130: fix publish

### Patch Changes

- Updated dependencies [eeba130]
  - @contractspec/lib.schema@1.1.0
