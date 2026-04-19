# Patch Notes



### Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Slug: adoption-engine-and-authoring-targets
- Date: 2026-04-19
- Breaking: no
- @contractspec/lib.contracts-spec@5.3.0 (minor)
- @contractspec/module.workspace@4.2.0 (minor)
- @contractspec/bundle.workspace@4.4.0 (minor)
- @contractspec/bundle.library@3.8.12 (minor)
- @contractspec/app.cli-contractspec@5.0.0 (minor)
- vscode-contractspec@3.9.0 (minor)
- contractspec@1.46.2 (patch)
- @contractspec/lib.knowledge@3.7.19 (patch)
- @contractspec/biome-config@3.8.7 (patch)
- @contractspec/app.cursor-marketplace (patch)
- Maintainer: Maintainers get a shared adoption catalog and resolver, Connect adoption hooks, MCP exposure for reuse decisions, expanded authoring-target coverage, and updated static policy artifacts.

### Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- Slug: builder-local-onboarding-api-resolution
- Date: 2026-04-15
- Breaking: no
- @contractspec/bundle.workspace@4.4.0 (patch)
- @contractspec/app.cli-contractspec@5.0.0 (patch)
- Maintainer: Builder-local setup now writes control-plane API defaults, doctor checks all Builder presets for missing auth, and the Builder CLI reads `.contractsrc.json` before falling back to the default hosted API.

### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Slug: builder-next-wave-hardening
- Date: 2026-04-10
- Breaking: no
- @contractspec/lib.builder-spec@0.2.1 (minor)
- @contractspec/lib.builder-runtime@0.2.1 (minor)
- @contractspec/lib.mobile-control@0.2.1 (minor)
- @contractspec/lib.provider-runtime@0.2.1 (minor)
- @contractspec/module.builder-workbench@0.2.1 (minor)
- @contractspec/module.mobile-review@0.2.1 (minor)
- @contractspec/integration.runtime.local@0.2.1 (minor)
- @contractspec/integration.provider.gemini@0.2.0 (minor)
- @contractspec/app.cli-contractspec@5.0.0 (minor)
- @contractspec/bundle.library@3.8.12 (patch)
- Maintainer: Builder bootstrap presets, local-daemon registration, and mobile/operator status views now move together as one governed rollout surface.

### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Slug: builder-v3-control-plane-rollout
- Date: 2026-04-10
- Breaking: no
- @contractspec/lib.contracts-spec@5.3.0 (patch)
- @contractspec/lib.builder-spec@0.2.1 (minor)
- @contractspec/lib.provider-spec@0.2.0 (minor)
- @contractspec/lib.builder-runtime@0.2.1 (minor)
- @contractspec/lib.mobile-control@0.2.1 (minor)
- @contractspec/lib.provider-runtime@0.2.1 (minor)
- @contractspec/module.builder-workbench@0.2.1 (minor)
- @contractspec/module.mobile-review@0.2.1 (minor)
- @contractspec/integration.runtime@3.9.1 (minor)
- @contractspec/integration.runtime.managed@0.2.1 (minor)
- @contractspec/integration.runtime.local@0.2.1 (minor)
- @contractspec/integration.runtime.hybrid@0.2.1 (minor)
- @contractspec/integration.builder-telegram@0.2.1 (minor)
- @contractspec/integration.builder-voice@0.2.1 (minor)
- @contractspec/integration.builder-whatsapp@0.2.1 (minor)
- @contractspec/integration.provider.codex@0.2.0 (minor)
- @contractspec/integration.provider.claude-code@0.2.0 (minor)
- @contractspec/integration.provider.gemini@0.2.0 (minor)
- @contractspec/integration.provider.copilot@0.2.0 (minor)
- @contractspec/integration.provider.stt@0.2.0 (minor)
- @contractspec/integration.provider.local-model@0.2.0 (minor)
- Maintainer: Builder v3 now has a governed contract, runtime, and provider surface that keeps authoring, readiness, and export orchestration aligned across the package stack.

### Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
- Slug: cli-onboard-guided-adoption
- Date: 2026-04-19
- Breaking: no
- @contractspec/app.cli-contractspec@5.0.0 (minor)
- @contractspec/bundle.workspace@4.4.0 (minor)
- @contractspec/bundle.library@3.8.12 (minor)
- Maintainer: Maintainers get a single onboarding catalog and planner that powers CLI output, managed repo guides, Connect-compatible evidence, and the CLI MCP onboarding resources.

### Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Slug: connect-spec-alignment-april-2026
- Date: 2026-04-10
- Breaking: no
- @contractspec/lib.contracts-spec@5.3.0 (minor)
- @contractspec/bundle.workspace@4.4.0 (minor)
- @contractspec/app.cli-contractspec@5.0.0 (minor)
- @contractspec/bundle.library@3.8.12 (patch)
- agentpacks@1.8.0 (minor)
- Maintainer: Connect is now a governed repo surface with CLI commands, workspace services, and versioned docs that keep risky edits, review packets, and replay artifacts aligned.

### Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Slug: contract-dx-first-slice
- Date: 2026-04-19
- Breaking: no
- @contractspec/lib.contracts-spec@5.3.0 (minor)
- @contractspec/module.workspace@4.2.0 (minor)
- @contractspec/bundle.workspace@4.4.0 (minor)
- @contractspec/app.cli-contractspec@5.0.0 (minor)
- Maintainer: Maintainers can rely on authored validators for app-config, theme, and feature specs instead of shallow per-surface checks, and can scaffold theme specs directly from the CLI.

### Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Slug: data-table-ux-stability-upgrade
- Date: 2026-04-19
- Breaking: no
- @contractspec/lib.design-system@3.9.0 (minor)
- @contractspec/lib.presentation-runtime-react@36.0.7 (patch)
- @contractspec/lib.ui-kit-web@3.10.0 (patch)
- @contractspec/lib.ui-kit@3.9.0 (patch)
- @contractspec/example.crm-pipeline@3.7.19 (patch)
- @contractspec/example.data-grid-showcase@3.8.11 (patch)
- Maintainer: The shared table controller now sanitizes stale row and column state, and the design-system exports `DataTableToolbar` as the preferred composed UX layer above the primitive tables.

### Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Slug: docs-governance-sync
- Date: 2026-04-19
- Breaking: no
- contractspec@1.46.2 (patch)
- @contractspec/lib.contracts-spec@5.3.0 (patch)
- @contractspec/bundle.library@3.8.12 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers now have aligned root guidance, package docs, website docs, and release-manifest-backed changelog copy for the current Connect, Builder, and release-capsule workflows.

### Expand the spec-pack docs into a fuller learning path across the public docs site.
- Slug: docs-learning-path-spec-packs
- Date: 2026-04-10
- Breaking: no
- @contractspec/bundle.library@3.8.12 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: The docs bundle and web app now expose Connect, module-bundle, and Builder workbench guides as one linked learning path instead of isolated pages.

### Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Slug: early-cats-tap
- Date: 2026-03-27
- Breaking: no
- Maintainer: Workflow templates, docs, and devkit code now avoid broad workflow barrel imports in sandboxed workflow entrypoints.
- Deprecations:
  - Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.

### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
- Slug: fresh-toes-build
- Date: 2026-04-10
- Breaking: no
- @contractspec/tool.bun@3.7.14 (patch)
- @contractspec/bundle.marketing@3.8.12 (patch)
- @contractspec/lib.accessibility@3.7.18 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.9.0 (patch)
- @contractspec/lib.design-system@3.9.0 (patch)
- @contractspec/lib.example-shared-ui@6.0.19 (patch)
- @contractspec/lib.presentation-runtime-react@36.0.7 (patch)
- @contractspec/lib.surface-runtime@0.5.19 (patch)
- @contractspec/lib.ui-kit@3.9.0 (patch)
- @contractspec/lib.ui-kit-web@3.10.0 (patch)
- @contractspec/lib.ui-link@3.7.15 (patch)
- @contractspec/lib.video-gen@2.7.19 (patch)
- @contractspec/module.builder-workbench@0.2.1 (patch)
- @contractspec/module.examples@3.8.11 (patch)
- @contractspec/module.execution-console@0.1.2 (patch)
- @contractspec/module.mobile-review@0.2.1 (patch)
- Maintainer: Shared Bun transpile paths now force production JSX mode, and the affected published browser bundles were rebuilt against that fix.

### Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
- Slug: guided-authoring-workspace-form-rollout
- Date: 2026-04-13
- Breaking: yes
- contractspec@1.46.2 (major)
- @contractspec/app.cli-contractspec@5.0.0 (major)
- @contractspec/bundle.workspace@4.4.0 (minor)
- @contractspec/module.workspace@4.2.0 (minor)
- @contractspec/lib.contracts-spec@5.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.9.0 (minor)
- @contractspec/lib.design-system@3.9.0 (minor)
- @contractspec/lib.ui-kit-core@3.8.0 (minor)
- @contractspec/lib.ui-kit-web@3.10.0 (minor)
- @contractspec/lib.ui-kit@3.9.0 (minor)
- vscode-contractspec@3.9.0 (minor)
- Maintainer: Maintainers can ship the CLI and workspace packages with preset-driven setup, generated contractsrc schema assets, authoring-target discovery, and unified package-scaffold validation from the same release.
- Deprecations:
  - The standalone contractspec apply command has been removed; use contractspec generate for write-generation flows.

### Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- Slug: knowledge-indexed-payload-hardening
- Date: 2026-04-19
- Breaking: no
- @contractspec/lib.knowledge@3.7.19 (patch)
- @contractspec/lib.contracts-spec@5.3.0 (patch)
- Maintainer: The knowledge ingestion/query path now persists fragment text into vector payloads, package tests cover the corrected behavior, and the knowledge doc surfaces were refreshed.

### Normalize notification template locale resolution and merge partial locale channel overrides without dropping base channel content.
- Slug: notifications-template-locale-hardening
- Date: 2026-04-19
- Breaking: no
- @contractspec/module.notifications@3.7.18 (patch)
- Maintainer: Notification template rendering now resolves regional locales like `fr-CA` through the shared locale resolver and allows locale overrides to override only the fields that changed.

### Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
- Slug: quiet-learning-thread
- Date: 2026-04-19
- Breaking: yes
- @contractspec/module.learning-journey@3.7.18 (major)
- @contractspec/module.examples@3.8.11 (patch)
- @contractspec/example.learning-journey-ambient-coach@3.7.19 (major)
- @contractspec/example.learning-journey-crm-onboarding@3.7.19 (major)
- @contractspec/example.learning-journey-duo-drills@3.7.19 (major)
- @contractspec/example.learning-journey-platform-tour@3.7.19 (major)
- @contractspec/example.learning-journey-quest-challenges@3.7.19 (major)
- @contractspec/example.learning-journey-registry@3.7.19 (major)
- @contractspec/example.learning-journey-studio-onboarding@3.7.19 (major)
- @contractspec/example.learning-journey-ui-coaching@3.7.19 (major)
- @contractspec/example.learning-journey-ui-gamified@3.7.19 (major)
- @contractspec/example.learning-journey-ui-onboarding@3.7.19 (major)
- @contractspec/example.learning-journey-ui-shared@3.7.19 (major)
- @contractspec/example.learning-patterns@3.7.19 (major)
- Maintainer: The learning stack now uses the adaptive `learning.journey.*` runtime and the sandbox resolves shared learning registry presentations through `@contractspec/module.examples`.

### Restore npm provenance-safe publishing for the public integration packages by declaring repository metadata and failing release discovery before publish when it is missing.
- Slug: release-provenance-metadata-fix
- Date: 2026-04-15
- Breaking: no
- @contractspec/integration.builder-telegram@0.2.1 (patch)
- @contractspec/integration.builder-voice@0.2.1 (patch)
- @contractspec/integration.builder-whatsapp@0.2.1 (patch)
- @contractspec/integration.provider.claude-code@0.2.0 (patch)
- @contractspec/integration.provider.codex@0.2.0 (patch)
- @contractspec/integration.provider.copilot@0.2.0 (patch)
- @contractspec/integration.provider.gemini@0.2.0 (patch)
- @contractspec/integration.provider.local-model@0.2.0 (patch)
- @contractspec/integration.provider.stt@0.2.0 (patch)
- @contractspec/integration.runtime.hybrid@0.2.1 (patch)
- @contractspec/integration.runtime.local@0.2.1 (patch)
- @contractspec/integration.runtime.managed@0.2.1 (patch)
- Maintainer: Release discovery now blocks publishable manifests that omit repository metadata, and the affected integration packages declare the canonical GitHub repository URL and directory before npm provenance is requested.

### Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.
- Slug: support-bot-reliability-threshold-cleanup
- Date: 2026-04-15
- Breaking: yes
- @contractspec/lib.support-bot@3.7.19 (major)
- Maintainer: Support-bot now validates tool inputs and classifier LLM overrides more defensively, and its responder prompt/catalog wiring is aligned and covered by focused unit tests.

### Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
- Slug: unify-example-previews
- Date: 2026-04-19
- Breaking: no
- @contractspec/module.examples@3.8.11 (minor)
- @contractspec/bundle.marketing@3.8.12 (patch)
- @contractspec/bundle.library@3.8.12 (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/example.agent-console@3.8.11 (patch)
- @contractspec/example.ai-chat-assistant@3.8.11 (patch)
- @contractspec/example.analytics-dashboard@3.9.11 (patch)
- @contractspec/example.crm-pipeline@3.7.19 (patch)
- @contractspec/example.integration-hub@3.8.11 (patch)
- @contractspec/example.learning-journey-registry@3.7.19 (patch)
- @contractspec/example.marketplace@3.8.11 (patch)
- @contractspec/example.policy-safe-knowledge-assistant@3.7.19 (patch)
- @contractspec/example.saas-boilerplate@3.8.11 (patch)
- @contractspec/example.workflow-system@3.8.11 (patch)
- Maintainer: Preview wiring now comes from a generated example preview registry, and UI-backed example packages must expose `entrypoints.ui` in their exported `ExampleSpec`.

### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- Slug: versioning-release-system
- Date: 2026-03-27
- Breaking: no
- @contractspec/lib.contracts-spec@5.3.0 (minor)
- @contractspec/bundle.workspace@4.4.0 (minor)
- @contractspec/app.cli-contractspec@5.0.0 (minor)
- @contractspec/app.web-landing (patch)
- Maintainer: Release communication is now generated from versioning-backed release capsules and enforced on release branches.
- Deprecations:
  - The standalone release domain under `@contractspec/lib.contracts-spec/release` is deprecated in favor of versioning-owned release metadata.