# @contractspec/lib.ai-agent

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-providers@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.knowledge@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.ai-providers@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.knowledge@2.6.0

## 2.5.0

### Minor Changes

- 284cbe2: Add full i18n support across all 10 packages with en/fr/es locales (460 keys total).
  - add shared `createI18nFactory<K>()` to `@contractspec/lib.contracts-spec/translations` to eliminate ~1,450 lines of duplicated boilerplate
  - add `src/i18n/` modules to all 10 packages with typed keys, locale resolution, message catalogs (en/fr/es), and completeness tests
  - thread `locale` parameter through public options interfaces and runtime functions in every package
  - convert all 55 `getDefaultI18n()` call sites in ai-agent to locale-aware `createAgentI18n()`
  - add locale-keyed keyword dictionaries (en/fr/es) to support-bot classifier
  - add `getLocalizedStageMeta()` and `getLocalizedStagePlaybooks()` to lifecycle packages
  - add `localeChannels` on notification templates with fr/es content for all standard templates
  - add `getXpSourceLabel(source, locale)` for localized XP source display in learning-journey
  - fix `slugify()` in content-gen to support non-Latin characters via Unicode property escapes
  - enable `i18next/no-literal-string` ESLint rule (warn, jsx-text-only) for all 10 packages
  - add `scripts/check-i18n-parity.ts` CI script and `bun run i18n:check` for catalog key parity verification

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.knowledge@2.5.0
  - @contractspec/lib.ai-providers@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.ai-providers@2.4.0
  - @contractspec/lib.knowledge@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.ai-providers@2.3.0
  - @contractspec/lib.knowledge@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.ai-providers@2.2.0
  - @contractspec/lib.knowledge@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.knowledge@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video
- 659d15f: feat: improve ai-agent analytics leveraging posthog

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.ai-providers@2.1.0
  - @contractspec/lib.knowledge@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance
- 94f3c24: perf: reduce import-time memory usage by slimming root barrels and moving heavy runtime surfaces to explicit subpath entrypoints.

  Breaking changes:
  - `@contractspec/lib.contracts` root exports are now intentionally minimal; workflow/tests/app-config/regenerator/telemetry/experiments and other heavy modules must be imported from their dedicated subpaths.
  - `@contractspec/lib.ai-agent` root exports are reduced to lightweight surfaces; runtime agent APIs should be imported from package subpaths.

  Additional optimizations:
  - add schema-level memoization/caching for zod/json-schema conversion paths and scalar factory reuse in `@contractspec/lib.schema`.
  - lower default build memory pressure in `@contractspec/tool.bun` by preferring bun-only dev targets and disabling declaration maps by default for type builds.

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [f152678]
- Updated dependencies [7f3203a]
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.ai-providers@2.0.0
  - @contractspec/lib.knowledge@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: add multi-language (i18n) support for all user-facing strings

  Adds full internationalization to the ai-agent package with English, French, and Spanish support:
  - **i18n module** (`src/i18n/`): `createAgentI18n(specLocale?, runtimeLocale?)` and `getDefaultI18n()` with `{placeholder}` interpolation, backed by the `TranslationRegistry` from `@contractspec/lib.contracts`
  - **130+ typed message keys** organized by domain: agent prompts, knowledge, tools, interop, errors, exports, approval, and logs
  - **3 complete catalogs**: English (reference), French (formal "vous"), Spanish (formal "usted")
  - **Locale resolution**: runtime override > spec-level `locale` > default ("en"), with regional variant fallback (e.g. "fr-CA" -> "fr")
  - **Spec/type changes**: `locale?: string` added to `AgentSpec`, `AgentCallOptions`, and `AgentSessionState`

  All hardcoded strings across the package now go through the i18n system:
  - Interop spec/tool consumers (markdown headings, prompt sections, error messages)
  - Provider adapters and tool bridges (Claude Agent SDK, OpenCode SDK)
  - Exporters (Claude Agent, OpenCode markdown/JSON generation, validation)
  - Agent runners, knowledge injector, MCP server, approval workflow

  New `./i18n` entrypoint exported from `package.json` for direct access to keys, catalogs, and locale utilities.

- 064258d: feat: upgrade all dependencies
- 064258d: feat: add PostHog LLM Analytics and Evaluations support

  Adds PostHog LLM observability to the ai-agent package via two integration approaches:
  - **Model wrapping** (`createPostHogTracedModel`): wraps any Vercel AI SDK `LanguageModel` with `@posthog/ai` `withTracing` to automatically capture `$ai_generation` events (tokens, latency, cost, I/O)
  - **TelemetryCollector bridge** (`PostHogTelemetryCollector`): implements the existing `TelemetryCollector` interface to forward `trackAgentStep` data to PostHog
  - **CompositeTelemetryCollector**: fan-out to multiple telemetry collectors simultaneously

  Both `ContractSpecAgentConfig` and `AgentFactoryConfig` now accept an optional `posthogConfig` for automatic model wrapping.

  PostHog Evaluations (Relevance, Helpfulness, Hallucination, Toxicity, Jailbreak) run server-side on captured events with no additional client code.

  Contracts updated: PostHog integration spec bumped to v1.1.0 with `analytics.llm-tracing` and `analytics.llm-evaluations` capabilities. New `posthogLLMTelemetrySpec` defines the generation event schema, PII fields, and evaluation templates.

  `@posthog/ai` and `posthog-node` added as optional peer dependencies.

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.ai-providers@1.62.0
  - @contractspec/lib.contracts@1.62.0
  - @contractspec/lib.knowledge@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.ai-providers@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0
  - @contractspec/lib.knowledge@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-providers@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0
  - @contractspec/lib.knowledge@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.ai-providers@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0
  - @contractspec/lib.knowledge@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.ai-providers@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0
  - @contractspec/lib.knowledge@1.58.0

## 1.57.0

### Minor Changes

- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [8ecf3c1]
- Updated dependencies [47c48c2]
- Updated dependencies [a119963]
- Updated dependencies [4651e06]
- Updated dependencies [ad9d10a]
- Updated dependencies [11a5a05]
  - @contractspec/lib.contracts-spec@1.57.0
  - @contractspec/lib.ai-providers@1.57.0
  - @contractspec/lib.knowledge@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.56.1
  - @contractspec/lib.knowledge@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@1.56.0
  - @contractspec/lib.knowledge@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@1.55.0
  - @contractspec/lib.knowledge@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/lib.knowledge@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/lib.knowledge@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.contracts-spec@1.52.0
  - @contractspec/lib.knowledge@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.knowledge@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.knowledge@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.contracts-spec@1.49.0
  - @contractspec/lib.knowledge@1.49.0

## 1.48.1

### Patch Changes

- Updated dependencies [c560ee7]
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/lib.knowledge@1.48.1

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.contracts-spec@1.48.0
  - @contractspec/lib.knowledge@1.48.0

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
  - @contractspec/lib.contracts-spec@1.47.0
  - @contractspec/lib.knowledge@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.contracts-spec@1.46.2
  - @contractspec/lib.knowledge@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.contracts-spec@1.46.1
  - @contractspec/lib.knowledge@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.contracts-spec@1.46.0
  - @contractspec/lib.knowledge@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.contracts-spec@1.45.6
  - @contractspec/lib.knowledge@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.contracts-spec@1.45.5
  - @contractspec/lib.knowledge@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.45.4
  - @contractspec/lib.knowledge@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.contracts-spec@1.45.3
  - @contractspec/lib.knowledge@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.contracts-spec@1.45.2
  - @contractspec/lib.knowledge@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.45.1
  - @contractspec/lib.knowledge@1.45.1

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
  - @contractspec/lib.contracts-spec@1.45.0
  - @contractspec/lib.knowledge@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.contracts-spec@1.44.1
  - @contractspec/lib.knowledge@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.contracts-spec@1.44.0
  - @contractspec/lib.knowledge@1.44.0

## 1.43.4

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/lib.contracts-spec@1.43.4
  - @contractspec/lib.knowledge@1.43.4

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/lib.contracts-spec@1.43.3
  - @contractspec/lib.knowledge@1.43.3

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/lib.contracts-spec@1.43.2
  - @contractspec/lib.knowledge@1.43.2

## 1.43.1

### Patch Changes

- Updated dependencies [f28fdad]
  - @contractspec/lib.contracts-spec@1.43.1
  - @contractspec/lib.knowledge@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/lib.contracts-spec@1.43.0
  - @contractspec/lib.knowledge@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/lib.contracts-spec@1.42.10
  - @contractspec/lib.knowledge@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/lib.contracts-spec@1.42.9
  - @contractspec/lib.knowledge@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/lib.contracts-spec@1.42.8
  - @contractspec/lib.knowledge@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/lib.contracts-spec@1.42.7
  - @contractspec/lib.knowledge@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/lib.contracts-spec@1.42.6
  - @contractspec/lib.knowledge@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/lib.contracts-spec@1.42.5
  - @contractspec/lib.knowledge@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/lib.contracts-spec@1.42.4
  - @contractspec/lib.knowledge@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.contracts-spec@1.42.3
  - @contractspec/lib.knowledge@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/lib.contracts-spec@1.42.2
  - @contractspec/lib.knowledge@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/lib.contracts-spec@1.42.1
  - @contractspec/lib.knowledge@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/lib.contracts-spec@1.42.0
  - @contractspec/lib.knowledge@1.42.0

## 1.1.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@1.12.0
  - @contractspec/lib.knowledge@1.1.0

## 0.4.1

### Patch Changes

- Fix dependencies
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.11.1

## 0.4.0

### Minor Changes

- b7621d3: Fix version

### Patch Changes

- Updated dependencies [b7621d3]
  - @contractspec/lib.contracts-spec@1.11.0

## 0.3.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@1.10.0

## 0.2.2

### Patch Changes

- fix dependencies
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.9.2

## 0.2.1

### Patch Changes

- fix
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.9.1

## 0.2.0

### Minor Changes

- b1d0876: Managed platform

### Patch Changes

- Updated dependencies [b1d0876]
  - @contractspec/lib.contracts-spec@1.9.0
