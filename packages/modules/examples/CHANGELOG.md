# @contractspec/module.examples

## 4.0.7

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/example.agent-console@3.8.22
  - @contractspec/example.ai-chat-assistant@3.8.22
  - @contractspec/example.analytics-dashboard@3.9.22
  - @contractspec/example.crm-pipeline@3.7.30
  - @contractspec/example.data-grid-showcase@3.8.22
  - @contractspec/example.finance-ops-ai-workflows@1.1.2
  - @contractspec/example.form-showcase@1.1.3
  - @contractspec/example.in-app-docs@3.7.30
  - @contractspec/example.integration-hub@3.8.22
  - @contractspec/example.learning-journey-registry@4.0.10
  - @contractspec/example.marketplace@3.8.22
  - @contractspec/example.pocket-family-office@3.8.2
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.30
  - @contractspec/example.saas-boilerplate@3.8.22
  - @contractspec/example.visualization-showcase@3.9.22
  - @contractspec/example.wealth-snapshot@3.8.2
  - @contractspec/example.workflow-system@3.8.22
  - @contractspec/lib.example-shared-ui@7.0.7

## 4.0.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/example.agent-console@3.8.21
  - @contractspec/example.ai-chat-assistant@3.8.21
  - @contractspec/example.analytics-dashboard@3.9.21
  - @contractspec/example.data-grid-showcase@3.8.21
  - @contractspec/example.finance-ops-ai-workflows@1.1.1
  - @contractspec/example.form-showcase@1.1.2
  - @contractspec/example.in-app-docs@3.7.29
  - @contractspec/example.integration-hub@3.8.21
  - @contractspec/example.learning-journey-registry@4.0.9
  - @contractspec/example.marketplace@3.8.21
  - @contractspec/example.pocket-family-office@3.8.1
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.29
  - @contractspec/example.visualization-showcase@3.9.21
  - @contractspec/example.workflow-system@3.8.21
  - @contractspec/lib.example-shared-ui@7.0.6
  - @contractspec/lib.presentation-runtime-core@5.2.1
  - @contractspec/lib.runtime-sandbox@3.0.6
  - @contractspec/lib.contracts-spec@6.2.0
  - @contractspec/example.crm-pipeline@3.7.29
  - @contractspec/example.wealth-snapshot@3.8.1
  - @contractspec/example.saas-boilerplate@3.8.21
  - @contractspec/lib.contracts-runtime-client-react@3.14.0

## 4.0.5

### Patch Changes

- Add a governed public finance-ops workflow template with replay proof and inline web template preview support.
  - Packages: @contractspec/example.finance-ops-ai-workflows (minor), @contractspec/module.examples (patch), @contractspec/bundle.marketing (patch), @contractspec/app.web-landing (patch)
- Add inline preview support for the Wealth Snapshot and Pocket Family Office examples in the templates catalog.
  - Packages: @contractspec/example.pocket-family-office (minor), @contractspec/example.wealth-snapshot (minor), @contractspec/module.examples (patch), @contractspec/bundle.marketing (patch), @contractspec/app.web-landing (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.example-shared-ui@7.0.5
  - @contractspec/lib.runtime-sandbox@3.0.5
  - @contractspec/lib.contracts-spec@6.1.0
  - @contractspec/lib.presentation-runtime-core@5.2.0
  - @contractspec/lib.contracts-runtime-client-react@3.13.0

## 4.0.4

### Patch Changes

- Make the form-only showcase previewable from the templates catalog and restore sandbox routing for non-inline template previews.
  - Packages: @contractspec/example.form-showcase (minor), @contractspec/module.examples (patch), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Add a form-only example template and public docs links for ContractSpec form adoption.
  - Packages: @contractspec/example.form-showcase (minor), @contractspec/module.examples (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.example-shared-ui@7.0.4
  - @contractspec/lib.presentation-runtime-core@5.1.1
  - @contractspec/lib.runtime-sandbox@3.0.4
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.contracts-runtime-client-react@3.12.0

## 4.0.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.example-shared-ui@7.0.3
  - @contractspec/lib.runtime-sandbox@3.0.3
  - @contractspec/lib.contracts-spec@5.7.0
  - @contractspec/lib.contracts-runtime-client-react@3.11.1
  - @contractspec/lib.presentation-runtime-core@5.1.0

## 4.0.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Updated dependencies because of Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
  - @contractspec/lib.example-shared-ui@7.0.2
  - @contractspec/lib.runtime-sandbox@3.0.2
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.contracts-runtime-client-react@3.11.0
  - @contractspec/lib.presentation-runtime-core@5.0.3

## 4.0.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.example-shared-ui@7.0.1
  - @contractspec/lib.presentation-runtime-core@5.0.2
  - @contractspec/lib.runtime-sandbox@3.0.1
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.contracts-runtime-client-react@3.10.2

## 4.0.0

### Major Changes

- Split example discovery from rich runtime packages so lightweight consumers no longer install every ContractSpec example.
  - Packages: @contractspec/module.examples (major), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch)
  - Migration: Replace runtime imports such as `TemplateRuntimeProvider`, `listTemplates`, and inline preview loaders from `@contractspec/module.examples` with `@contractspec/module.examples/runtime`.; Import `listExamples`, `getExample`, `searchExamples`, route helpers, and source metadata from `@contractspec/module.examples/catalog` when runnable example code is not needed.

### Minor Changes

- Promote the Expo demo Examples surface to first-class navigation and reuse shared preview components so mobile and web example previews stay aligned.
  - Packages: @contractspec/app.expo-demo (patch), @contractspec/app.web-landing (patch), @contractspec/bundle.library (patch), @contractspec/bundle.marketing (patch), @contractspec/example.agent-console (patch), @contractspec/module.examples (minor)
  - Migration: Rich example previews should reuse cross-platform components through the UI kit alias layer before falling back to app-local native summaries.

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
- Updated dependencies because of Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
  - @contractspec/lib.contracts-runtime-client-react@3.10.1
  - @contractspec/lib.runtime-sandbox@3.0.0
  - @contractspec/lib.example-shared-ui@7.0.0
  - @contractspec/lib.presentation-runtime-core@5.0.1
  - @contractspec/lib.contracts-spec@5.5.0

## 3.10.0

### Minor Changes

- Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
  - Packages: @contractspec/module.examples (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/example.agent-console@3.8.14
  - @contractspec/example.ai-chat-assistant@3.8.14
  - @contractspec/example.ai-support-bot@3.7.21
  - @contractspec/example.analytics-dashboard@3.9.14
  - @contractspec/example.calendar-google@3.7.21
  - @contractspec/example.content-generation@3.7.21
  - @contractspec/example.crm-pipeline@3.7.22
  - @contractspec/example.data-grid-showcase@3.8.14
  - @contractspec/example.email-gmail@3.7.21
  - @contractspec/example.in-app-docs@3.7.22
  - @contractspec/example.integration-hub@3.8.14
  - @contractspec/example.integration-posthog@3.7.21
  - @contractspec/example.integration-stripe@3.7.21
  - @contractspec/example.integration-supabase@3.7.21
  - @contractspec/example.kb-update-pipeline@3.7.21
  - @contractspec/example.knowledge-canon@3.7.21
  - @contractspec/example.learning-journey-ambient-coach@4.0.1
  - @contractspec/example.learning-journey-crm-onboarding@4.0.2
  - @contractspec/example.learning-journey-duo-drills@4.0.1
  - @contractspec/example.learning-journey-platform-tour@4.0.1
  - @contractspec/example.learning-journey-quest-challenges@4.0.1
  - @contractspec/example.learning-journey-registry@4.0.2
  - @contractspec/example.learning-journey-studio-onboarding@4.0.1
  - @contractspec/example.learning-journey-ui-coaching@4.0.2
  - @contractspec/example.learning-journey-ui-gamified@4.0.2
  - @contractspec/example.learning-journey-ui-onboarding@4.0.2
  - @contractspec/example.learning-journey-ui-shared@4.0.2
  - @contractspec/example.learning-patterns@4.0.1
  - @contractspec/example.lifecycle-cli@3.7.21
  - @contractspec/example.lifecycle-dashboard@3.7.21
  - @contractspec/example.locale-jurisdiction-gate@3.7.21
  - @contractspec/example.marketplace@3.8.14
  - @contractspec/example.meeting-recorder-providers@3.7.21
  - @contractspec/example.messaging-agent-actions@3.8.13
  - @contractspec/example.minimal@2.8.13
  - @contractspec/example.openbanking-powens@3.7.21
  - @contractspec/example.opencode-cli@2.8.13
  - @contractspec/example.personalization@3.7.21
  - @contractspec/example.pocket-family-office@3.7.21
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.22
  - @contractspec/example.product-intent@3.7.21
  - @contractspec/example.project-management-sync@3.7.21
  - @contractspec/example.saas-boilerplate@3.8.14
  - @contractspec/example.service-business-os@3.7.21
  - @contractspec/example.team-hub@3.7.21
  - @contractspec/example.versioned-knowledge-base@3.7.21
  - @contractspec/example.video-api-showcase@3.7.22
  - @contractspec/example.video-docs-terminal@3.7.22
  - @contractspec/example.video-marketing-clip@3.7.22
  - @contractspec/example.visualization-showcase@3.9.14
  - @contractspec/example.voice-providers@3.7.21
  - @contractspec/example.wealth-snapshot@3.7.21
  - @contractspec/example.workflow-system@3.8.14
  - @contractspec/lib.example-shared-ui@6.0.22
  - @contractspec/lib.runtime-sandbox@2.7.15
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.contracts-runtime-client-react@3.10.0
  - @contractspec/lib.presentation-runtime-core@5.0.0

## 3.9.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - @contractspec/example.agent-console@3.8.13
  - @contractspec/example.ai-chat-assistant@3.8.13
  - @contractspec/example.analytics-dashboard@3.9.13
  - @contractspec/example.crm-pipeline@3.7.21
  - @contractspec/example.data-grid-showcase@3.8.13
  - @contractspec/example.in-app-docs@3.7.21
  - @contractspec/example.integration-hub@3.8.13
  - @contractspec/example.learning-journey-crm-onboarding@4.0.1
  - @contractspec/example.learning-journey-registry@4.0.1
  - @contractspec/example.learning-journey-ui-coaching@4.0.1
  - @contractspec/example.learning-journey-ui-gamified@4.0.1
  - @contractspec/example.learning-journey-ui-onboarding@4.0.1
  - @contractspec/example.learning-journey-ui-shared@4.0.1
  - @contractspec/example.marketplace@3.8.13
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.21
  - @contractspec/example.saas-boilerplate@3.8.13
  - @contractspec/example.video-api-showcase@3.7.21
  - @contractspec/example.video-docs-terminal@3.7.21
  - @contractspec/example.video-marketing-clip@3.7.21
  - @contractspec/example.visualization-showcase@3.9.13
  - @contractspec/example.workflow-system@3.8.13
  - @contractspec/lib.contracts-runtime-client-react@3.9.2
  - @contractspec/lib.example-shared-ui@6.0.21
  - @contractspec/lib.presentation-runtime-core@4.0.0

## 3.9.0

### Minor Changes

- Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
  - Packages: @contractspec/module.examples (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch), @contractspec/example.agent-console (patch), @contractspec/example.ai-chat-assistant (patch), @contractspec/example.analytics-dashboard (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.integration-hub (patch), @contractspec/example.learning-journey-registry (patch), @contractspec/example.marketplace (patch), @contractspec/example.policy-safe-knowledge-assistant (patch), @contractspec/example.saas-boilerplate (patch), @contractspec/example.workflow-system (patch)
  - Migration: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.

### Patch Changes

- Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
  - Packages: @contractspec/module.learning-journey (major), @contractspec/module.examples (patch), @contractspec/example.learning-journey-ambient-coach (major), @contractspec/example.learning-journey-crm-onboarding (major), @contractspec/example.learning-journey-duo-drills (major), @contractspec/example.learning-journey-platform-tour (major), @contractspec/example.learning-journey-quest-challenges (major), @contractspec/example.learning-journey-registry (major), @contractspec/example.learning-journey-studio-onboarding (major), @contractspec/example.learning-journey-ui-coaching (major), @contractspec/example.learning-journey-ui-gamified (major), @contractspec/example.learning-journey-ui-onboarding (major), @contractspec/example.learning-journey-ui-shared (major), @contractspec/example.learning-patterns (major)
  - Migration: Replace the old onboarding-centric learning contracts and local example progress logic with the canonical adaptive `learning.journey.*` runtime.; Use the shared learning registry mapping/data helpers so supported learning sandbox templates resolve the shared presentation set consistently.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- Updated dependencies because of Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
- Updated dependencies because of Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/example.ai-support-bot@3.7.20
  - @contractspec/example.calendar-google@3.7.20
  - @contractspec/example.content-generation@3.7.20
  - @contractspec/example.email-gmail@3.7.20
  - @contractspec/example.in-app-docs@3.7.20
  - @contractspec/example.integration-posthog@3.7.20
  - @contractspec/example.integration-stripe@3.7.20
  - @contractspec/example.integration-supabase@3.7.20
  - @contractspec/example.kb-update-pipeline@3.7.20
  - @contractspec/example.knowledge-canon@3.7.20
  - @contractspec/example.lifecycle-cli@3.7.20
  - @contractspec/example.lifecycle-dashboard@3.7.20
  - @contractspec/example.locale-jurisdiction-gate@3.7.20
  - @contractspec/example.meeting-recorder-providers@3.7.20
  - @contractspec/example.messaging-agent-actions@3.8.12
  - @contractspec/example.minimal@2.8.12
  - @contractspec/example.openbanking-powens@3.7.20
  - @contractspec/example.opencode-cli@2.8.12
  - @contractspec/example.personalization@3.7.20
  - @contractspec/example.pocket-family-office@3.7.20
  - @contractspec/example.product-intent@3.7.20
  - @contractspec/example.project-management-sync@3.7.20
  - @contractspec/example.service-business-os@3.7.20
  - @contractspec/example.team-hub@3.7.20
  - @contractspec/example.versioned-knowledge-base@3.7.20
  - @contractspec/example.video-api-showcase@3.7.20
  - @contractspec/example.video-docs-terminal@3.7.20
  - @contractspec/example.video-marketing-clip@3.7.20
  - @contractspec/example.visualization-showcase@3.9.12
  - @contractspec/example.voice-providers@3.7.20
  - @contractspec/example.wealth-snapshot@3.7.20
  - @contractspec/lib.contracts-runtime-client-react@3.9.1
  - @contractspec/lib.example-shared-ui@6.0.20
  - @contractspec/lib.presentation-runtime-core@3.9.8
  - @contractspec/example.crm-pipeline@3.7.20
  - @contractspec/example.data-grid-showcase@3.8.12
  - @contractspec/example.learning-journey-ambient-coach@4.0.0
  - @contractspec/example.learning-journey-crm-onboarding@4.0.0
  - @contractspec/example.learning-journey-duo-drills@4.0.0
  - @contractspec/example.learning-journey-platform-tour@4.0.0
  - @contractspec/example.learning-journey-quest-challenges@4.0.0
  - @contractspec/example.learning-journey-registry@4.0.0
  - @contractspec/example.learning-journey-studio-onboarding@4.0.0
  - @contractspec/example.learning-journey-ui-coaching@4.0.0
  - @contractspec/example.learning-journey-ui-gamified@4.0.0
  - @contractspec/example.learning-journey-ui-onboarding@4.0.0
  - @contractspec/example.learning-journey-ui-shared@4.0.0
  - @contractspec/example.learning-patterns@4.0.0
  - @contractspec/example.agent-console@3.8.12
  - @contractspec/example.ai-chat-assistant@3.8.12
  - @contractspec/example.analytics-dashboard@3.9.12
  - @contractspec/example.integration-hub@3.8.12
  - @contractspec/example.marketplace@3.8.12
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.20
  - @contractspec/example.saas-boilerplate@3.8.12
  - @contractspec/example.workflow-system@3.8.12

## 3.8.11

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.contracts-runtime-client-react@3.9.0
  - @contractspec/example.agent-console@3.8.11
  - @contractspec/example.ai-chat-assistant@3.8.11
  - @contractspec/example.ai-support-bot@3.7.19
  - @contractspec/example.analytics-dashboard@3.9.11
  - @contractspec/example.calendar-google@3.7.19
  - @contractspec/example.content-generation@3.7.19
  - @contractspec/example.crm-pipeline@3.7.19
  - @contractspec/example.data-grid-showcase@3.8.11
  - @contractspec/example.email-gmail@3.7.19
  - @contractspec/example.in-app-docs@3.7.19
  - @contractspec/example.integration-hub@3.8.11
  - @contractspec/example.integration-posthog@3.7.19
  - @contractspec/example.integration-stripe@3.7.19
  - @contractspec/example.integration-supabase@3.7.19
  - @contractspec/example.kb-update-pipeline@3.7.19
  - @contractspec/example.knowledge-canon@3.7.19
  - @contractspec/example.learning-journey-ambient-coach@3.7.19
  - @contractspec/example.learning-journey-crm-onboarding@3.7.19
  - @contractspec/example.learning-journey-duo-drills@3.7.19
  - @contractspec/example.learning-journey-platform-tour@3.7.19
  - @contractspec/example.learning-journey-quest-challenges@3.7.19
  - @contractspec/example.learning-journey-registry@3.7.19
  - @contractspec/example.learning-journey-studio-onboarding@3.7.19
  - @contractspec/example.learning-journey-ui-coaching@3.7.19
  - @contractspec/example.learning-journey-ui-gamified@3.7.19
  - @contractspec/example.learning-journey-ui-onboarding@3.7.19
  - @contractspec/example.learning-journey-ui-shared@3.7.19
  - @contractspec/example.learning-patterns@3.7.19
  - @contractspec/example.lifecycle-cli@3.7.19
  - @contractspec/example.lifecycle-dashboard@3.7.19
  - @contractspec/example.locale-jurisdiction-gate@3.7.19
  - @contractspec/example.marketplace@3.8.11
  - @contractspec/example.meeting-recorder-providers@3.7.19
  - @contractspec/example.messaging-agent-actions@3.8.11
  - @contractspec/example.minimal@2.8.11
  - @contractspec/example.openbanking-powens@3.7.19
  - @contractspec/example.opencode-cli@2.8.11
  - @contractspec/example.personalization@3.7.19
  - @contractspec/example.pocket-family-office@3.7.19
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.19
  - @contractspec/example.product-intent@3.7.19
  - @contractspec/example.project-management-sync@3.7.19
  - @contractspec/example.saas-boilerplate@3.8.11
  - @contractspec/example.service-business-os@3.7.19
  - @contractspec/example.team-hub@3.7.19
  - @contractspec/example.versioned-knowledge-base@3.7.19
  - @contractspec/example.video-api-showcase@3.7.19
  - @contractspec/example.video-docs-terminal@3.7.19
  - @contractspec/example.video-marketing-clip@3.7.19
  - @contractspec/example.visualization-showcase@3.9.11
  - @contractspec/example.voice-providers@3.7.19
  - @contractspec/example.wealth-snapshot@3.7.19
  - @contractspec/example.workflow-system@3.8.11
  - @contractspec/lib.example-shared-ui@6.0.19
  - @contractspec/lib.presentation-runtime-core@3.9.7

## 3.8.10

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/example.agent-console@3.8.10
  - @contractspec/example.ai-chat-assistant@3.8.10
  - @contractspec/example.ai-support-bot@3.7.18
  - @contractspec/example.analytics-dashboard@3.9.10
  - @contractspec/example.calendar-google@3.7.18
  - @contractspec/example.content-generation@3.7.18
  - @contractspec/example.crm-pipeline@3.7.18
  - @contractspec/example.data-grid-showcase@3.8.10
  - @contractspec/example.email-gmail@3.7.18
  - @contractspec/example.in-app-docs@3.7.18
  - @contractspec/example.integration-hub@3.8.10
  - @contractspec/example.integration-posthog@3.7.18
  - @contractspec/example.integration-stripe@3.7.18
  - @contractspec/example.integration-supabase@3.7.18
  - @contractspec/example.kb-update-pipeline@3.7.18
  - @contractspec/example.knowledge-canon@3.7.18
  - @contractspec/example.learning-journey-ambient-coach@3.7.18
  - @contractspec/example.learning-journey-crm-onboarding@3.7.18
  - @contractspec/example.learning-journey-duo-drills@3.7.18
  - @contractspec/example.learning-journey-platform-tour@3.7.18
  - @contractspec/example.learning-journey-quest-challenges@3.7.18
  - @contractspec/example.learning-journey-registry@3.7.18
  - @contractspec/example.learning-journey-studio-onboarding@3.7.18
  - @contractspec/example.learning-journey-ui-coaching@3.7.18
  - @contractspec/example.learning-journey-ui-gamified@3.7.18
  - @contractspec/example.learning-journey-ui-onboarding@3.7.18
  - @contractspec/example.learning-journey-ui-shared@3.7.18
  - @contractspec/example.learning-patterns@3.7.18
  - @contractspec/example.lifecycle-cli@3.7.18
  - @contractspec/example.lifecycle-dashboard@3.7.18
  - @contractspec/example.locale-jurisdiction-gate@3.7.18
  - @contractspec/example.marketplace@3.8.10
  - @contractspec/example.meeting-recorder-providers@3.7.18
  - @contractspec/example.messaging-agent-actions@3.8.10
  - @contractspec/example.minimal@2.8.10
  - @contractspec/example.openbanking-powens@3.7.18
  - @contractspec/example.opencode-cli@2.8.10
  - @contractspec/example.personalization@3.7.18
  - @contractspec/example.pocket-family-office@3.7.18
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.18
  - @contractspec/example.product-intent@3.7.18
  - @contractspec/example.project-management-sync@3.7.18
  - @contractspec/example.saas-boilerplate@3.8.10
  - @contractspec/example.service-business-os@3.7.18
  - @contractspec/example.team-hub@3.7.18
  - @contractspec/example.versioned-knowledge-base@3.7.18
  - @contractspec/example.video-api-showcase@3.7.18
  - @contractspec/example.video-docs-terminal@3.7.18
  - @contractspec/example.video-marketing-clip@3.7.18
  - @contractspec/example.visualization-showcase@3.9.10
  - @contractspec/example.voice-providers@3.7.18
  - @contractspec/example.wealth-snapshot@3.7.18
  - @contractspec/example.workflow-system@3.8.10
  - @contractspec/lib.presentation-runtime-core@3.9.6
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.contracts-runtime-client-react@3.8.6
  - @contractspec/lib.example-shared-ui@6.0.18
  - @contractspec/lib.runtime-sandbox@2.7.14

## 3.8.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/example.learning-journey-studio-onboarding@3.7.17
  - @contractspec/example.learning-journey-quest-challenges@3.7.17
  - @contractspec/example.learning-journey-crm-onboarding@3.7.17
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.17
  - @contractspec/example.learning-journey-ambient-coach@3.7.17
  - @contractspec/example.learning-journey-platform-tour@3.7.17
  - @contractspec/example.learning-journey-ui-onboarding@3.7.17
  - @contractspec/example.learning-journey-ui-coaching@3.7.17
  - @contractspec/example.learning-journey-ui-gamified@3.7.17
  - @contractspec/example.learning-journey-duo-drills@3.7.17
  - @contractspec/example.learning-journey-ui-shared@3.7.17
  - @contractspec/example.meeting-recorder-providers@3.7.17
  - @contractspec/lib.contracts-runtime-client-react@3.8.5
  - @contractspec/example.learning-journey-registry@3.7.17
  - @contractspec/example.locale-jurisdiction-gate@3.7.17
  - @contractspec/example.versioned-knowledge-base@3.7.17
  - @contractspec/example.messaging-agent-actions@3.8.9
  - @contractspec/example.project-management-sync@3.7.17
  - @contractspec/example.visualization-showcase@3.9.9
  - @contractspec/lib.presentation-runtime-core@3.9.5
  - @contractspec/example.integration-supabase@3.7.17
  - @contractspec/example.pocket-family-office@3.7.17
  - @contractspec/example.video-marketing-clip@3.7.17
  - @contractspec/example.analytics-dashboard@3.9.9
  - @contractspec/example.integration-posthog@3.7.17
  - @contractspec/example.lifecycle-dashboard@3.7.17
  - @contractspec/example.service-business-os@3.7.17
  - @contractspec/example.video-docs-terminal@3.7.17
  - @contractspec/example.content-generation@3.7.17
  - @contractspec/example.data-grid-showcase@3.8.9
  - @contractspec/example.integration-stripe@3.7.17
  - @contractspec/example.kb-update-pipeline@3.7.17
  - @contractspec/example.openbanking-powens@3.7.17
  - @contractspec/example.video-api-showcase@3.7.17
  - @contractspec/example.ai-chat-assistant@3.8.9
  - @contractspec/example.learning-patterns@3.7.17
  - @contractspec/example.saas-boilerplate@3.8.9
  - @contractspec/example.calendar-google@3.7.17
  - @contractspec/example.integration-hub@3.8.9
  - @contractspec/example.knowledge-canon@3.7.17
  - @contractspec/example.personalization@3.7.17
  - @contractspec/example.voice-providers@3.7.17
  - @contractspec/example.wealth-snapshot@3.7.17
  - @contractspec/example.workflow-system@3.8.9
  - @contractspec/example.ai-support-bot@3.7.17
  - @contractspec/example.product-intent@3.7.17
  - @contractspec/example.agent-console@3.8.9
  - @contractspec/example.lifecycle-cli@3.7.17
  - @contractspec/lib.example-shared-ui@6.0.17
  - @contractspec/example.crm-pipeline@3.7.17
  - @contractspec/example.opencode-cli@2.8.9
  - @contractspec/example.email-gmail@3.7.17
  - @contractspec/example.in-app-docs@3.7.17
  - @contractspec/example.marketplace@3.8.9
  - @contractspec/lib.runtime-sandbox@2.7.14
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/example.team-hub@3.7.17
  - @contractspec/example.minimal@2.8.9

## 3.8.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.16
  - @contractspec/example.learning-journey-quest-challenges@3.7.16
  - @contractspec/example.learning-journey-crm-onboarding@3.7.16
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.16
  - @contractspec/example.learning-journey-ambient-coach@3.7.16
  - @contractspec/example.learning-journey-platform-tour@3.7.16
  - @contractspec/example.learning-journey-ui-onboarding@3.7.16
  - @contractspec/example.learning-journey-ui-coaching@3.7.16
  - @contractspec/example.learning-journey-ui-gamified@3.7.16
  - @contractspec/example.learning-journey-duo-drills@3.7.16
  - @contractspec/example.learning-journey-ui-shared@3.7.16
  - @contractspec/example.meeting-recorder-providers@3.7.16
  - @contractspec/lib.contracts-runtime-client-react@3.8.4
  - @contractspec/example.learning-journey-registry@3.7.16
  - @contractspec/example.locale-jurisdiction-gate@3.7.16
  - @contractspec/example.versioned-knowledge-base@3.7.16
  - @contractspec/example.messaging-agent-actions@3.8.8
  - @contractspec/example.project-management-sync@3.7.16
  - @contractspec/example.visualization-showcase@3.9.8
  - @contractspec/lib.presentation-runtime-core@3.9.4
  - @contractspec/example.integration-supabase@3.7.16
  - @contractspec/example.pocket-family-office@3.7.16
  - @contractspec/example.video-marketing-clip@3.7.16
  - @contractspec/example.analytics-dashboard@3.9.8
  - @contractspec/example.integration-posthog@3.7.16
  - @contractspec/example.lifecycle-dashboard@3.7.16
  - @contractspec/example.service-business-os@3.7.16
  - @contractspec/example.video-docs-terminal@3.7.16
  - @contractspec/example.content-generation@3.7.16
  - @contractspec/example.data-grid-showcase@3.8.8
  - @contractspec/example.integration-stripe@3.7.16
  - @contractspec/example.kb-update-pipeline@3.7.16
  - @contractspec/example.openbanking-powens@3.7.16
  - @contractspec/example.video-api-showcase@3.7.16
  - @contractspec/example.ai-chat-assistant@3.8.8
  - @contractspec/example.learning-patterns@3.7.16
  - @contractspec/example.saas-boilerplate@3.8.8
  - @contractspec/example.calendar-google@3.7.16
  - @contractspec/example.integration-hub@3.8.8
  - @contractspec/example.knowledge-canon@3.7.16
  - @contractspec/example.personalization@3.7.16
  - @contractspec/example.voice-providers@3.7.16
  - @contractspec/example.wealth-snapshot@3.7.16
  - @contractspec/example.workflow-system@3.8.8
  - @contractspec/example.ai-support-bot@3.7.16
  - @contractspec/example.product-intent@3.7.16
  - @contractspec/example.agent-console@3.8.8
  - @contractspec/example.lifecycle-cli@3.7.16
  - @contractspec/lib.example-shared-ui@6.0.16
  - @contractspec/example.crm-pipeline@3.7.16
  - @contractspec/example.opencode-cli@2.8.8
  - @contractspec/example.email-gmail@3.7.16
  - @contractspec/example.in-app-docs@3.7.16
  - @contractspec/example.marketplace@3.8.8
  - @contractspec/lib.runtime-sandbox@2.7.13
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/example.team-hub@3.7.16
  - @contractspec/example.minimal@2.8.8

## 3.8.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
- Updated dependencies [cce2b13]
  - @contractspec/example.agent-console@3.8.7
  - @contractspec/example.learning-journey-studio-onboarding@3.7.15
  - @contractspec/example.learning-journey-quest-challenges@3.7.15
  - @contractspec/example.learning-journey-crm-onboarding@3.7.15
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.15
  - @contractspec/example.learning-journey-ambient-coach@3.7.15
  - @contractspec/example.learning-journey-platform-tour@3.7.15
  - @contractspec/example.learning-journey-ui-onboarding@3.7.15
  - @contractspec/example.learning-journey-ui-coaching@3.7.15
  - @contractspec/example.learning-journey-ui-gamified@3.7.15
  - @contractspec/example.learning-journey-duo-drills@3.7.15
  - @contractspec/example.learning-journey-ui-shared@3.7.15
  - @contractspec/example.meeting-recorder-providers@3.7.15
  - @contractspec/lib.contracts-runtime-client-react@3.8.3
  - @contractspec/example.learning-journey-registry@3.7.15
  - @contractspec/example.locale-jurisdiction-gate@3.7.15
  - @contractspec/example.versioned-knowledge-base@3.7.15
  - @contractspec/example.messaging-agent-actions@3.8.7
  - @contractspec/example.project-management-sync@3.7.15
  - @contractspec/example.visualization-showcase@3.9.7
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/example.integration-supabase@3.7.15
  - @contractspec/example.pocket-family-office@3.7.15
  - @contractspec/example.video-marketing-clip@3.7.15
  - @contractspec/example.analytics-dashboard@3.9.7
  - @contractspec/example.integration-posthog@3.7.15
  - @contractspec/example.lifecycle-dashboard@3.7.15
  - @contractspec/example.service-business-os@3.7.15
  - @contractspec/example.video-docs-terminal@3.7.15
  - @contractspec/example.content-generation@3.7.15
  - @contractspec/example.data-grid-showcase@3.8.7
  - @contractspec/example.integration-stripe@3.7.15
  - @contractspec/example.kb-update-pipeline@3.7.15
  - @contractspec/example.openbanking-powens@3.7.15
  - @contractspec/example.video-api-showcase@3.7.15
  - @contractspec/example.ai-chat-assistant@3.8.7
  - @contractspec/example.learning-patterns@3.7.15
  - @contractspec/example.saas-boilerplate@3.8.7
  - @contractspec/example.calendar-google@3.7.15
  - @contractspec/example.integration-hub@3.8.7
  - @contractspec/example.knowledge-canon@3.7.15
  - @contractspec/example.personalization@3.7.15
  - @contractspec/example.voice-providers@3.7.15
  - @contractspec/example.wealth-snapshot@3.7.15
  - @contractspec/example.workflow-system@3.8.7
  - @contractspec/example.ai-support-bot@3.7.15
  - @contractspec/example.product-intent@3.7.15
  - @contractspec/example.lifecycle-cli@3.7.15
  - @contractspec/lib.example-shared-ui@6.0.15
  - @contractspec/example.crm-pipeline@3.7.15
  - @contractspec/example.opencode-cli@2.8.7
  - @contractspec/example.email-gmail@3.7.15
  - @contractspec/example.in-app-docs@3.7.15
  - @contractspec/example.marketplace@3.8.7
  - @contractspec/lib.runtime-sandbox@2.7.12
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/example.team-hub@3.7.15
  - @contractspec/example.minimal@2.8.7

## 3.8.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.14
  - @contractspec/example.learning-journey-quest-challenges@3.7.14
  - @contractspec/example.learning-journey-crm-onboarding@3.7.14
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.14
  - @contractspec/example.learning-journey-ambient-coach@3.7.14
  - @contractspec/example.learning-journey-platform-tour@3.7.14
  - @contractspec/example.learning-journey-ui-onboarding@3.7.14
  - @contractspec/example.learning-journey-ui-coaching@3.7.14
  - @contractspec/example.learning-journey-ui-gamified@3.7.14
  - @contractspec/example.learning-journey-duo-drills@3.7.14
  - @contractspec/example.learning-journey-ui-shared@3.7.14
  - @contractspec/example.meeting-recorder-providers@3.7.14
  - @contractspec/lib.contracts-runtime-client-react@3.8.2
  - @contractspec/example.learning-journey-registry@3.7.14
  - @contractspec/example.locale-jurisdiction-gate@3.7.14
  - @contractspec/example.versioned-knowledge-base@3.7.14
  - @contractspec/example.messaging-agent-actions@3.8.6
  - @contractspec/example.project-management-sync@3.7.14
  - @contractspec/example.visualization-showcase@3.9.6
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/example.integration-supabase@3.7.14
  - @contractspec/example.pocket-family-office@3.7.14
  - @contractspec/example.video-marketing-clip@3.7.14
  - @contractspec/example.analytics-dashboard@3.9.6
  - @contractspec/example.integration-posthog@3.7.14
  - @contractspec/example.lifecycle-dashboard@3.7.14
  - @contractspec/example.service-business-os@3.7.14
  - @contractspec/example.video-docs-terminal@3.7.14
  - @contractspec/example.content-generation@3.7.14
  - @contractspec/example.data-grid-showcase@3.8.6
  - @contractspec/example.integration-stripe@3.7.14
  - @contractspec/example.kb-update-pipeline@3.7.14
  - @contractspec/example.openbanking-powens@3.7.14
  - @contractspec/example.video-api-showcase@3.7.14
  - @contractspec/example.ai-chat-assistant@3.8.6
  - @contractspec/example.learning-patterns@3.7.14
  - @contractspec/example.saas-boilerplate@3.8.6
  - @contractspec/example.calendar-google@3.7.14
  - @contractspec/example.integration-hub@3.8.6
  - @contractspec/example.knowledge-canon@3.7.14
  - @contractspec/example.personalization@3.7.14
  - @contractspec/example.voice-providers@3.7.14
  - @contractspec/example.wealth-snapshot@3.7.14
  - @contractspec/example.workflow-system@3.8.6
  - @contractspec/example.ai-support-bot@3.7.14
  - @contractspec/example.product-intent@3.7.14
  - @contractspec/example.agent-console@3.8.6
  - @contractspec/example.lifecycle-cli@3.7.14
  - @contractspec/lib.example-shared-ui@6.0.14
  - @contractspec/example.crm-pipeline@3.7.14
  - @contractspec/example.opencode-cli@2.8.6
  - @contractspec/example.email-gmail@3.7.14
  - @contractspec/example.in-app-docs@3.7.14
  - @contractspec/example.marketplace@3.8.6
  - @contractspec/lib.runtime-sandbox@2.7.11
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/example.team-hub@3.7.14
  - @contractspec/example.minimal@2.8.6

## 3.8.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/example.integration-supabase@3.7.13
  - @contractspec/example.agent-console@3.8.5
  - @contractspec/example.ai-chat-assistant@3.8.5
  - @contractspec/example.ai-support-bot@3.7.13
  - @contractspec/example.analytics-dashboard@3.9.5
  - @contractspec/example.calendar-google@3.7.13
  - @contractspec/example.content-generation@3.7.13
  - @contractspec/example.crm-pipeline@3.7.13
  - @contractspec/example.data-grid-showcase@3.8.5
  - @contractspec/example.email-gmail@3.7.13
  - @contractspec/example.in-app-docs@3.7.13
  - @contractspec/example.integration-hub@3.8.5
  - @contractspec/example.integration-posthog@3.7.13
  - @contractspec/example.integration-stripe@3.7.13
  - @contractspec/example.kb-update-pipeline@3.7.13
  - @contractspec/example.knowledge-canon@3.7.13
  - @contractspec/example.learning-journey-ambient-coach@3.7.13
  - @contractspec/example.learning-journey-crm-onboarding@3.7.13
  - @contractspec/example.learning-journey-duo-drills@3.7.13
  - @contractspec/example.learning-journey-platform-tour@3.7.13
  - @contractspec/example.learning-journey-quest-challenges@3.7.13
  - @contractspec/example.learning-journey-registry@3.7.13
  - @contractspec/example.learning-journey-studio-onboarding@3.7.13
  - @contractspec/example.learning-journey-ui-coaching@3.7.13
  - @contractspec/example.learning-journey-ui-gamified@3.7.13
  - @contractspec/example.learning-journey-ui-onboarding@3.7.13
  - @contractspec/example.learning-journey-ui-shared@3.7.13
  - @contractspec/example.learning-patterns@3.7.13
  - @contractspec/example.lifecycle-cli@3.7.13
  - @contractspec/example.lifecycle-dashboard@3.7.13
  - @contractspec/example.locale-jurisdiction-gate@3.7.13
  - @contractspec/example.marketplace@3.8.5
  - @contractspec/example.meeting-recorder-providers@3.7.13
  - @contractspec/example.messaging-agent-actions@3.8.5
  - @contractspec/example.minimal@2.8.5
  - @contractspec/example.openbanking-powens@3.7.13
  - @contractspec/example.opencode-cli@2.8.5
  - @contractspec/example.personalization@3.7.13
  - @contractspec/example.pocket-family-office@3.7.13
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.13
  - @contractspec/example.product-intent@3.7.13
  - @contractspec/example.project-management-sync@3.7.13
  - @contractspec/example.saas-boilerplate@3.8.5
  - @contractspec/example.service-business-os@3.7.13
  - @contractspec/example.team-hub@3.7.13
  - @contractspec/example.versioned-knowledge-base@3.7.13
  - @contractspec/example.video-api-showcase@3.7.13
  - @contractspec/example.video-docs-terminal@3.7.13
  - @contractspec/example.video-marketing-clip@3.7.13
  - @contractspec/example.visualization-showcase@3.9.5
  - @contractspec/example.voice-providers@3.7.13
  - @contractspec/example.wealth-snapshot@3.7.13
  - @contractspec/example.workflow-system@3.8.5
  - @contractspec/lib.contracts-runtime-client-react@3.8.1
  - @contractspec/lib.example-shared-ui@6.0.13
  - @contractspec/lib.presentation-runtime-core@3.9.1

## 3.8.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0
  - @contractspec/lib.contracts-runtime-client-react@3.8.0
  - @contractspec/example.agent-console@3.8.4
  - @contractspec/example.ai-chat-assistant@3.8.4
  - @contractspec/example.ai-support-bot@3.7.12
  - @contractspec/example.analytics-dashboard@3.9.4
  - @contractspec/example.calendar-google@3.7.12
  - @contractspec/example.content-generation@3.7.12
  - @contractspec/example.crm-pipeline@3.7.12
  - @contractspec/example.data-grid-showcase@3.8.4
  - @contractspec/example.email-gmail@3.7.12
  - @contractspec/example.in-app-docs@3.7.12
  - @contractspec/example.integration-hub@3.8.4
  - @contractspec/example.integration-posthog@3.7.12
  - @contractspec/example.integration-stripe@3.7.12
  - @contractspec/example.integration-supabase@3.7.12
  - @contractspec/example.kb-update-pipeline@3.7.12
  - @contractspec/example.knowledge-canon@3.7.12
  - @contractspec/example.learning-journey-ambient-coach@3.7.12
  - @contractspec/example.learning-journey-crm-onboarding@3.7.12
  - @contractspec/example.learning-journey-duo-drills@3.7.12
  - @contractspec/example.learning-journey-platform-tour@3.7.12
  - @contractspec/example.learning-journey-quest-challenges@3.7.12
  - @contractspec/example.learning-journey-registry@3.7.12
  - @contractspec/example.learning-journey-studio-onboarding@3.7.12
  - @contractspec/example.learning-journey-ui-coaching@3.7.12
  - @contractspec/example.learning-journey-ui-gamified@3.7.12
  - @contractspec/example.learning-journey-ui-onboarding@3.7.12
  - @contractspec/example.learning-journey-ui-shared@3.7.12
  - @contractspec/example.learning-patterns@3.7.12
  - @contractspec/example.lifecycle-cli@3.7.12
  - @contractspec/example.lifecycle-dashboard@3.7.12
  - @contractspec/example.locale-jurisdiction-gate@3.7.12
  - @contractspec/example.marketplace@3.8.4
  - @contractspec/example.meeting-recorder-providers@3.7.12
  - @contractspec/example.messaging-agent-actions@3.8.4
  - @contractspec/example.minimal@2.8.4
  - @contractspec/example.openbanking-powens@3.7.12
  - @contractspec/example.opencode-cli@2.8.4
  - @contractspec/example.personalization@3.7.12
  - @contractspec/example.pocket-family-office@3.7.12
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.12
  - @contractspec/example.product-intent@3.7.12
  - @contractspec/example.project-management-sync@3.7.12
  - @contractspec/example.saas-boilerplate@3.8.4
  - @contractspec/example.service-business-os@3.7.12
  - @contractspec/example.team-hub@3.7.12
  - @contractspec/example.versioned-knowledge-base@3.7.12
  - @contractspec/example.video-api-showcase@3.7.12
  - @contractspec/example.video-docs-terminal@3.7.12
  - @contractspec/example.video-marketing-clip@3.7.12
  - @contractspec/example.visualization-showcase@3.9.4
  - @contractspec/example.voice-providers@3.7.12
  - @contractspec/example.wealth-snapshot@3.7.12
  - @contractspec/example.workflow-system@3.8.4
  - @contractspec/lib.example-shared-ui@6.0.12

## 3.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@3.7.11
  - @contractspec/example.learning-journey-quest-challenges@3.7.11
  - @contractspec/example.learning-journey-crm-onboarding@3.7.11
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.11
  - @contractspec/example.learning-journey-ambient-coach@3.7.11
  - @contractspec/example.learning-journey-platform-tour@3.7.11
  - @contractspec/example.learning-journey-ui-onboarding@3.7.11
  - @contractspec/example.learning-journey-ui-coaching@3.7.11
  - @contractspec/example.learning-journey-ui-gamified@3.7.11
  - @contractspec/example.learning-journey-duo-drills@3.7.11
  - @contractspec/example.learning-journey-ui-shared@3.7.11
  - @contractspec/example.meeting-recorder-providers@3.7.11
  - @contractspec/example.learning-journey-registry@3.7.11
  - @contractspec/example.locale-jurisdiction-gate@3.7.11
  - @contractspec/example.versioned-knowledge-base@3.7.11
  - @contractspec/example.messaging-agent-actions@3.8.3
  - @contractspec/example.project-management-sync@3.7.11
  - @contractspec/example.visualization-showcase@3.9.3
  - @contractspec/example.integration-supabase@3.7.11
  - @contractspec/example.pocket-family-office@3.7.11
  - @contractspec/example.video-marketing-clip@3.7.11
  - @contractspec/example.analytics-dashboard@3.9.3
  - @contractspec/example.integration-posthog@3.7.11
  - @contractspec/example.lifecycle-dashboard@3.7.11
  - @contractspec/example.service-business-os@3.7.11
  - @contractspec/example.video-docs-terminal@3.7.11
  - @contractspec/example.content-generation@3.7.11
  - @contractspec/example.data-grid-showcase@3.8.3
  - @contractspec/example.integration-stripe@3.7.11
  - @contractspec/example.kb-update-pipeline@3.7.11
  - @contractspec/example.openbanking-powens@3.7.11
  - @contractspec/example.video-api-showcase@3.7.11
  - @contractspec/example.ai-chat-assistant@3.8.3
  - @contractspec/example.learning-patterns@3.7.11
  - @contractspec/example.saas-boilerplate@3.8.3
  - @contractspec/example.calendar-google@3.7.11
  - @contractspec/example.integration-hub@3.8.3
  - @contractspec/example.knowledge-canon@3.7.11
  - @contractspec/example.personalization@3.7.11
  - @contractspec/example.voice-providers@3.7.11
  - @contractspec/example.wealth-snapshot@3.7.11
  - @contractspec/example.workflow-system@3.8.3
  - @contractspec/example.ai-support-bot@3.7.11
  - @contractspec/example.product-intent@3.7.11
  - @contractspec/example.agent-console@3.8.3
  - @contractspec/example.lifecycle-cli@3.7.11
  - @contractspec/lib.example-shared-ui@6.0.11
  - @contractspec/example.crm-pipeline@3.7.11
  - @contractspec/example.opencode-cli@2.8.3
  - @contractspec/example.email-gmail@3.7.11
  - @contractspec/example.in-app-docs@3.7.11
  - @contractspec/example.marketplace@3.8.3
  - @contractspec/lib.runtime-sandbox@2.7.10
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/example.team-hub@3.7.11
  - @contractspec/example.minimal@2.8.3

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.10
  - @contractspec/example.learning-journey-quest-challenges@3.7.10
  - @contractspec/example.learning-journey-crm-onboarding@3.7.10
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.10
  - @contractspec/example.learning-journey-ambient-coach@3.7.10
  - @contractspec/example.learning-journey-platform-tour@3.7.10
  - @contractspec/example.learning-journey-ui-onboarding@3.7.10
  - @contractspec/example.learning-journey-ui-coaching@3.7.10
  - @contractspec/example.learning-journey-ui-gamified@3.7.10
  - @contractspec/example.learning-journey-duo-drills@3.7.10
  - @contractspec/example.learning-journey-ui-shared@3.7.10
  - @contractspec/example.meeting-recorder-providers@3.7.10
  - @contractspec/example.learning-journey-registry@3.7.10
  - @contractspec/example.locale-jurisdiction-gate@3.7.10
  - @contractspec/example.versioned-knowledge-base@3.7.10
  - @contractspec/example.messaging-agent-actions@3.8.2
  - @contractspec/example.project-management-sync@3.7.10
  - @contractspec/example.visualization-showcase@3.9.2
  - @contractspec/example.integration-supabase@3.7.10
  - @contractspec/example.pocket-family-office@3.7.10
  - @contractspec/example.video-marketing-clip@3.7.10
  - @contractspec/example.analytics-dashboard@3.9.2
  - @contractspec/example.integration-posthog@3.7.10
  - @contractspec/example.lifecycle-dashboard@3.7.10
  - @contractspec/example.service-business-os@3.7.10
  - @contractspec/example.video-docs-terminal@3.7.10
  - @contractspec/example.content-generation@3.7.10
  - @contractspec/example.data-grid-showcase@3.8.2
  - @contractspec/example.integration-stripe@3.7.10
  - @contractspec/example.kb-update-pipeline@3.7.10
  - @contractspec/example.openbanking-powens@3.7.10
  - @contractspec/example.video-api-showcase@3.7.10
  - @contractspec/example.ai-chat-assistant@3.8.2
  - @contractspec/example.learning-patterns@3.7.10
  - @contractspec/example.saas-boilerplate@3.8.2
  - @contractspec/example.calendar-google@3.7.10
  - @contractspec/example.integration-hub@3.8.2
  - @contractspec/example.knowledge-canon@3.7.10
  - @contractspec/example.personalization@3.7.10
  - @contractspec/example.voice-providers@3.7.10
  - @contractspec/example.wealth-snapshot@3.7.10
  - @contractspec/example.workflow-system@3.8.2
  - @contractspec/example.ai-support-bot@3.7.10
  - @contractspec/example.product-intent@3.7.10
  - @contractspec/example.agent-console@3.8.2
  - @contractspec/example.lifecycle-cli@3.7.10
  - @contractspec/lib.example-shared-ui@6.0.10
  - @contractspec/example.crm-pipeline@3.7.10
  - @contractspec/example.opencode-cli@2.8.2
  - @contractspec/example.email-gmail@3.7.10
  - @contractspec/example.in-app-docs@3.7.10
  - @contractspec/example.marketplace@3.8.2
  - @contractspec/lib.runtime-sandbox@2.7.9
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/example.team-hub@3.7.10
  - @contractspec/example.minimal@2.8.2

## 3.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@3.7.9
  - @contractspec/example.learning-journey-quest-challenges@3.7.9
  - @contractspec/example.learning-journey-crm-onboarding@3.7.9
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.9
  - @contractspec/example.learning-journey-ambient-coach@3.7.9
  - @contractspec/example.learning-journey-platform-tour@3.7.9
  - @contractspec/example.learning-journey-ui-onboarding@3.7.9
  - @contractspec/example.learning-journey-ui-coaching@3.7.9
  - @contractspec/example.learning-journey-ui-gamified@3.7.9
  - @contractspec/example.learning-journey-duo-drills@3.7.9
  - @contractspec/example.learning-journey-ui-shared@3.7.9
  - @contractspec/example.meeting-recorder-providers@3.7.9
  - @contractspec/example.learning-journey-registry@3.7.9
  - @contractspec/example.locale-jurisdiction-gate@3.7.9
  - @contractspec/example.versioned-knowledge-base@3.7.9
  - @contractspec/example.messaging-agent-actions@3.8.1
  - @contractspec/example.project-management-sync@3.7.9
  - @contractspec/example.visualization-showcase@3.9.1
  - @contractspec/example.integration-supabase@3.7.9
  - @contractspec/example.pocket-family-office@3.7.9
  - @contractspec/example.video-marketing-clip@3.7.9
  - @contractspec/example.analytics-dashboard@3.9.1
  - @contractspec/example.integration-posthog@3.7.9
  - @contractspec/example.lifecycle-dashboard@3.7.9
  - @contractspec/example.service-business-os@3.7.9
  - @contractspec/example.video-docs-terminal@3.7.9
  - @contractspec/example.content-generation@3.7.9
  - @contractspec/example.data-grid-showcase@3.8.1
  - @contractspec/example.integration-stripe@3.7.9
  - @contractspec/example.kb-update-pipeline@3.7.9
  - @contractspec/example.openbanking-powens@3.7.9
  - @contractspec/example.video-api-showcase@3.7.9
  - @contractspec/example.ai-chat-assistant@3.8.1
  - @contractspec/example.learning-patterns@3.7.9
  - @contractspec/example.saas-boilerplate@3.8.1
  - @contractspec/example.calendar-google@3.7.9
  - @contractspec/example.integration-hub@3.8.1
  - @contractspec/example.knowledge-canon@3.7.9
  - @contractspec/example.personalization@3.7.9
  - @contractspec/example.voice-providers@3.7.9
  - @contractspec/example.wealth-snapshot@3.7.9
  - @contractspec/example.workflow-system@3.8.1
  - @contractspec/example.ai-support-bot@3.7.9
  - @contractspec/example.product-intent@3.7.9
  - @contractspec/example.agent-console@3.8.1
  - @contractspec/example.lifecycle-cli@3.7.9
  - @contractspec/lib.example-shared-ui@6.0.9
  - @contractspec/example.crm-pipeline@3.7.9
  - @contractspec/example.opencode-cli@2.8.1
  - @contractspec/example.email-gmail@3.7.9
  - @contractspec/example.in-app-docs@3.7.9
  - @contractspec/example.marketplace@3.8.1
  - @contractspec/lib.runtime-sandbox@2.7.8
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/example.team-hub@3.7.9
  - @contractspec/example.minimal@2.8.1

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@3.7.6
  - @contractspec/example.learning-journey-quest-challenges@3.7.6
  - @contractspec/example.learning-journey-crm-onboarding@3.7.6
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.6
  - @contractspec/example.learning-journey-ambient-coach@3.7.6
  - @contractspec/example.learning-journey-platform-tour@3.7.6
  - @contractspec/example.learning-journey-ui-onboarding@3.7.6
  - @contractspec/example.learning-journey-ui-coaching@3.7.6
  - @contractspec/example.learning-journey-ui-gamified@3.7.6
  - @contractspec/example.learning-journey-duo-drills@3.7.6
  - @contractspec/example.learning-journey-ui-shared@3.7.6
  - @contractspec/example.meeting-recorder-providers@3.7.6
  - @contractspec/example.learning-journey-registry@3.7.6
  - @contractspec/example.locale-jurisdiction-gate@3.7.6
  - @contractspec/example.versioned-knowledge-base@3.7.6
  - @contractspec/example.project-management-sync@3.7.6
  - @contractspec/example.integration-supabase@3.7.6
  - @contractspec/example.pocket-family-office@3.7.6
  - @contractspec/example.video-marketing-clip@3.7.6
  - @contractspec/example.analytics-dashboard@3.7.6
  - @contractspec/example.integration-posthog@3.7.6
  - @contractspec/example.lifecycle-dashboard@3.7.6
  - @contractspec/example.service-business-os@3.7.6
  - @contractspec/example.video-docs-terminal@3.7.6
  - @contractspec/example.content-generation@3.7.6
  - @contractspec/example.integration-stripe@3.7.6
  - @contractspec/example.kb-update-pipeline@3.7.6
  - @contractspec/example.openbanking-powens@3.7.6
  - @contractspec/example.video-api-showcase@3.7.6
  - @contractspec/example.ai-chat-assistant@3.7.6
  - @contractspec/example.learning-patterns@3.7.6
  - @contractspec/example.saas-boilerplate@3.7.6
  - @contractspec/example.calendar-google@3.7.6
  - @contractspec/example.integration-hub@3.7.6
  - @contractspec/example.knowledge-canon@3.7.6
  - @contractspec/example.personalization@3.7.6
  - @contractspec/example.voice-providers@3.7.6
  - @contractspec/example.wealth-snapshot@3.7.6
  - @contractspec/example.workflow-system@3.7.6
  - @contractspec/example.ai-support-bot@3.7.6
  - @contractspec/example.product-intent@3.7.6
  - @contractspec/example.agent-console@3.7.6
  - @contractspec/example.lifecycle-cli@3.7.6
  - @contractspec/lib.example-shared-ui@6.0.6
  - @contractspec/example.crm-pipeline@3.7.6
  - @contractspec/example.email-gmail@3.7.6
  - @contractspec/example.in-app-docs@3.7.6
  - @contractspec/example.marketplace@3.7.6
  - @contractspec/lib.runtime-sandbox@2.7.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/example.team-hub@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.5
  - @contractspec/example.learning-journey-quest-challenges@3.7.5
  - @contractspec/example.learning-journey-crm-onboarding@3.7.5
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.5
  - @contractspec/example.learning-journey-ambient-coach@3.7.5
  - @contractspec/example.learning-journey-platform-tour@3.7.5
  - @contractspec/example.learning-journey-ui-onboarding@3.7.5
  - @contractspec/example.learning-journey-ui-coaching@3.7.5
  - @contractspec/example.learning-journey-ui-gamified@3.7.5
  - @contractspec/example.learning-journey-duo-drills@3.7.5
  - @contractspec/example.learning-journey-ui-shared@3.7.5
  - @contractspec/example.meeting-recorder-providers@3.7.5
  - @contractspec/example.learning-journey-registry@3.7.5
  - @contractspec/example.locale-jurisdiction-gate@3.7.5
  - @contractspec/example.versioned-knowledge-base@3.7.5
  - @contractspec/example.project-management-sync@3.7.5
  - @contractspec/example.integration-supabase@3.7.5
  - @contractspec/example.pocket-family-office@3.7.5
  - @contractspec/example.video-marketing-clip@3.7.5
  - @contractspec/example.analytics-dashboard@3.7.5
  - @contractspec/example.integration-posthog@3.7.5
  - @contractspec/example.lifecycle-dashboard@3.7.5
  - @contractspec/example.service-business-os@3.7.5
  - @contractspec/example.video-docs-terminal@3.7.5
  - @contractspec/example.content-generation@3.7.5
  - @contractspec/example.integration-stripe@3.7.5
  - @contractspec/example.kb-update-pipeline@3.7.5
  - @contractspec/example.openbanking-powens@3.7.5
  - @contractspec/example.video-api-showcase@3.7.5
  - @contractspec/example.ai-chat-assistant@3.7.5
  - @contractspec/example.learning-patterns@3.7.5
  - @contractspec/example.saas-boilerplate@3.7.5
  - @contractspec/example.calendar-google@3.7.5
  - @contractspec/example.integration-hub@3.7.5
  - @contractspec/example.knowledge-canon@3.7.5
  - @contractspec/example.personalization@3.7.5
  - @contractspec/example.voice-providers@3.7.5
  - @contractspec/example.wealth-snapshot@3.7.5
  - @contractspec/example.workflow-system@3.7.5
  - @contractspec/example.ai-support-bot@3.7.5
  - @contractspec/example.product-intent@3.7.5
  - @contractspec/example.agent-console@3.7.5
  - @contractspec/example.lifecycle-cli@3.7.5
  - @contractspec/lib.example-shared-ui@6.0.5
  - @contractspec/example.crm-pipeline@3.7.5
  - @contractspec/example.email-gmail@3.7.5
  - @contractspec/example.in-app-docs@3.7.5
  - @contractspec/example.marketplace@3.7.5
  - @contractspec/lib.runtime-sandbox@2.7.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/example.team-hub@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@3.7.4
  - @contractspec/example.learning-journey-quest-challenges@3.7.4
  - @contractspec/example.learning-journey-crm-onboarding@3.7.4
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.4
  - @contractspec/example.learning-journey-ambient-coach@3.7.4
  - @contractspec/example.learning-journey-platform-tour@3.7.4
  - @contractspec/example.learning-journey-ui-onboarding@3.7.4
  - @contractspec/example.learning-journey-ui-coaching@3.7.4
  - @contractspec/example.learning-journey-ui-gamified@3.7.4
  - @contractspec/example.learning-journey-duo-drills@3.7.4
  - @contractspec/example.learning-journey-ui-shared@3.7.4
  - @contractspec/example.meeting-recorder-providers@3.7.4
  - @contractspec/example.learning-journey-registry@3.7.4
  - @contractspec/example.locale-jurisdiction-gate@3.7.4
  - @contractspec/example.versioned-knowledge-base@3.7.4
  - @contractspec/example.project-management-sync@3.7.4
  - @contractspec/example.integration-supabase@3.7.4
  - @contractspec/example.pocket-family-office@3.7.4
  - @contractspec/example.video-marketing-clip@3.7.4
  - @contractspec/example.analytics-dashboard@3.7.4
  - @contractspec/example.integration-posthog@3.7.4
  - @contractspec/example.lifecycle-dashboard@3.7.4
  - @contractspec/example.service-business-os@3.7.4
  - @contractspec/example.video-docs-terminal@3.7.4
  - @contractspec/example.content-generation@3.7.4
  - @contractspec/example.integration-stripe@3.7.4
  - @contractspec/example.kb-update-pipeline@3.7.4
  - @contractspec/example.openbanking-powens@3.7.4
  - @contractspec/example.video-api-showcase@3.7.4
  - @contractspec/example.ai-chat-assistant@3.7.4
  - @contractspec/example.learning-patterns@3.7.4
  - @contractspec/example.saas-boilerplate@3.7.4
  - @contractspec/example.calendar-google@3.7.4
  - @contractspec/example.integration-hub@3.7.4
  - @contractspec/example.knowledge-canon@3.7.4
  - @contractspec/example.personalization@3.7.4
  - @contractspec/example.voice-providers@3.7.4
  - @contractspec/example.wealth-snapshot@3.7.4
  - @contractspec/example.workflow-system@3.7.4
  - @contractspec/example.ai-support-bot@3.7.4
  - @contractspec/example.product-intent@3.7.4
  - @contractspec/example.agent-console@3.7.4
  - @contractspec/example.lifecycle-cli@3.7.4
  - @contractspec/lib.example-shared-ui@6.0.4
  - @contractspec/example.crm-pipeline@3.7.4
  - @contractspec/example.email-gmail@3.7.4
  - @contractspec/example.in-app-docs@3.7.4
  - @contractspec/example.marketplace@3.7.4
  - @contractspec/lib.runtime-sandbox@2.7.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/example.team-hub@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@3.7.3
  - @contractspec/example.learning-journey-quest-challenges@3.7.3
  - @contractspec/example.learning-journey-crm-onboarding@3.7.3
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.3
  - @contractspec/example.learning-journey-ambient-coach@3.7.3
  - @contractspec/example.learning-journey-platform-tour@3.7.3
  - @contractspec/example.learning-journey-ui-onboarding@3.7.3
  - @contractspec/example.learning-journey-ui-coaching@3.7.3
  - @contractspec/example.learning-journey-ui-gamified@3.7.3
  - @contractspec/example.learning-journey-duo-drills@3.7.3
  - @contractspec/example.learning-journey-ui-shared@3.7.3
  - @contractspec/example.meeting-recorder-providers@3.7.3
  - @contractspec/example.learning-journey-registry@3.7.3
  - @contractspec/example.locale-jurisdiction-gate@3.7.3
  - @contractspec/example.versioned-knowledge-base@3.7.3
  - @contractspec/example.project-management-sync@3.7.3
  - @contractspec/example.integration-supabase@3.7.3
  - @contractspec/example.pocket-family-office@3.7.3
  - @contractspec/example.video-marketing-clip@3.7.3
  - @contractspec/example.analytics-dashboard@3.7.3
  - @contractspec/example.integration-posthog@3.7.3
  - @contractspec/example.lifecycle-dashboard@3.7.3
  - @contractspec/example.service-business-os@3.7.3
  - @contractspec/example.video-docs-terminal@3.7.3
  - @contractspec/example.content-generation@3.7.3
  - @contractspec/example.integration-stripe@3.7.3
  - @contractspec/example.kb-update-pipeline@3.7.3
  - @contractspec/example.openbanking-powens@3.7.3
  - @contractspec/example.video-api-showcase@3.7.3
  - @contractspec/example.ai-chat-assistant@3.7.3
  - @contractspec/example.learning-patterns@3.7.3
  - @contractspec/example.saas-boilerplate@3.7.3
  - @contractspec/example.calendar-google@3.7.3
  - @contractspec/example.integration-hub@3.7.3
  - @contractspec/example.knowledge-canon@3.7.3
  - @contractspec/example.personalization@3.7.3
  - @contractspec/example.voice-providers@3.7.3
  - @contractspec/example.wealth-snapshot@3.7.3
  - @contractspec/example.workflow-system@3.7.3
  - @contractspec/example.ai-support-bot@3.7.3
  - @contractspec/example.product-intent@3.7.3
  - @contractspec/example.agent-console@3.7.3
  - @contractspec/example.lifecycle-cli@3.7.3
  - @contractspec/lib.example-shared-ui@6.0.3
  - @contractspec/example.crm-pipeline@3.7.3
  - @contractspec/example.email-gmail@3.7.3
  - @contractspec/example.in-app-docs@3.7.3
  - @contractspec/example.marketplace@3.7.3
  - @contractspec/lib.runtime-sandbox@2.7.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/example.team-hub@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- 04bc555: Improve contract integrity, example validation, onboarding docs, doctor safety,
  release verification, packaged smoke testing, and security workflow coverage.
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.2
  - @contractspec/example.learning-journey-quest-challenges@3.7.2
  - @contractspec/example.learning-journey-crm-onboarding@3.7.2
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.2
  - @contractspec/example.learning-journey-ambient-coach@3.7.2
  - @contractspec/example.learning-journey-platform-tour@3.7.2
  - @contractspec/example.learning-journey-ui-onboarding@3.7.2
  - @contractspec/example.learning-journey-ui-coaching@3.7.2
  - @contractspec/example.learning-journey-ui-gamified@3.7.2
  - @contractspec/example.learning-journey-duo-drills@3.7.2
  - @contractspec/example.learning-journey-ui-shared@3.7.2
  - @contractspec/example.meeting-recorder-providers@3.7.2
  - @contractspec/example.learning-journey-registry@3.7.2
  - @contractspec/example.locale-jurisdiction-gate@3.7.2
  - @contractspec/example.versioned-knowledge-base@3.7.2
  - @contractspec/example.project-management-sync@3.7.2
  - @contractspec/example.integration-supabase@3.7.2
  - @contractspec/example.pocket-family-office@3.7.2
  - @contractspec/example.video-marketing-clip@3.7.2
  - @contractspec/example.analytics-dashboard@3.7.2
  - @contractspec/example.integration-posthog@3.7.2
  - @contractspec/example.lifecycle-dashboard@3.7.2
  - @contractspec/example.service-business-os@3.7.2
  - @contractspec/example.video-docs-terminal@3.7.2
  - @contractspec/example.content-generation@3.7.2
  - @contractspec/example.integration-stripe@3.7.2
  - @contractspec/example.kb-update-pipeline@3.7.2
  - @contractspec/example.openbanking-powens@3.7.2
  - @contractspec/example.video-api-showcase@3.7.2
  - @contractspec/example.ai-chat-assistant@3.7.2
  - @contractspec/example.learning-patterns@3.7.2
  - @contractspec/example.saas-boilerplate@3.7.2
  - @contractspec/example.calendar-google@3.7.2
  - @contractspec/example.integration-hub@3.7.2
  - @contractspec/example.knowledge-canon@3.7.2
  - @contractspec/example.personalization@3.7.2
  - @contractspec/example.voice-providers@3.7.2
  - @contractspec/example.wealth-snapshot@3.7.2
  - @contractspec/example.workflow-system@3.7.2
  - @contractspec/example.ai-support-bot@3.7.2
  - @contractspec/example.product-intent@3.7.2
  - @contractspec/example.agent-console@3.7.2
  - @contractspec/example.lifecycle-cli@3.7.2
  - @contractspec/lib.example-shared-ui@6.0.2
  - @contractspec/example.crm-pipeline@3.7.2
  - @contractspec/example.opencode-cli@2.7.2
  - @contractspec/example.email-gmail@3.7.2
  - @contractspec/example.in-app-docs@3.7.2
  - @contractspec/example.marketplace@3.7.2
  - @contractspec/lib.runtime-sandbox@2.7.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/example.team-hub@3.7.2
  - @contractspec/example.minimal@2.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.1
  - @contractspec/example.learning-journey-quest-challenges@3.7.1
  - @contractspec/example.learning-journey-crm-onboarding@3.7.1
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.1
  - @contractspec/example.learning-journey-ambient-coach@3.7.1
  - @contractspec/example.learning-journey-platform-tour@3.7.1
  - @contractspec/example.learning-journey-ui-onboarding@3.7.1
  - @contractspec/example.learning-journey-ui-coaching@3.7.1
  - @contractspec/example.learning-journey-ui-gamified@3.7.1
  - @contractspec/example.learning-journey-duo-drills@3.7.1
  - @contractspec/example.learning-journey-ui-shared@3.7.1
  - @contractspec/example.learning-journey-registry@3.7.1
  - @contractspec/example.locale-jurisdiction-gate@3.7.1
  - @contractspec/example.versioned-knowledge-base@3.7.1
  - @contractspec/example.analytics-dashboard@3.7.1
  - @contractspec/example.lifecycle-dashboard@3.7.1
  - @contractspec/example.service-business-os@3.7.1
  - @contractspec/example.content-generation@3.7.1
  - @contractspec/example.integration-stripe@3.7.1
  - @contractspec/example.kb-update-pipeline@3.7.1
  - @contractspec/example.openbanking-powens@3.7.1
  - @contractspec/example.ai-chat-assistant@3.7.1
  - @contractspec/example.learning-patterns@3.7.1
  - @contractspec/example.saas-boilerplate@3.7.1
  - @contractspec/example.integration-hub@3.7.1
  - @contractspec/example.knowledge-canon@3.7.1
  - @contractspec/example.personalization@3.7.1
  - @contractspec/example.voice-providers@3.7.1
  - @contractspec/example.wealth-snapshot@3.7.1
  - @contractspec/example.workflow-system@3.7.1
  - @contractspec/example.ai-support-bot@3.7.1
  - @contractspec/example.agent-console@3.7.1
  - @contractspec/example.lifecycle-cli@3.7.1
  - @contractspec/lib.example-shared-ui@6.0.1
  - @contractspec/example.crm-pipeline@3.7.1
  - @contractspec/example.marketplace@3.7.1
  - @contractspec/lib.runtime-sandbox@2.7.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/example.team-hub@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/example.learning-journey-studio-onboarding@3.7.0
  - @contractspec/example.learning-journey-quest-challenges@3.7.0
  - @contractspec/example.learning-journey-crm-onboarding@3.7.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.7.0
  - @contractspec/example.learning-journey-ambient-coach@3.7.0
  - @contractspec/example.learning-journey-platform-tour@3.7.0
  - @contractspec/example.learning-journey-ui-onboarding@3.7.0
  - @contractspec/example.learning-journey-ui-coaching@3.7.0
  - @contractspec/example.learning-journey-ui-gamified@3.7.0
  - @contractspec/example.learning-journey-duo-drills@3.7.0
  - @contractspec/example.learning-journey-ui-shared@3.7.0
  - @contractspec/example.learning-journey-registry@3.7.0
  - @contractspec/example.locale-jurisdiction-gate@3.7.0
  - @contractspec/example.versioned-knowledge-base@3.7.0
  - @contractspec/example.analytics-dashboard@3.7.0
  - @contractspec/example.lifecycle-dashboard@3.7.0
  - @contractspec/example.service-business-os@3.7.0
  - @contractspec/example.content-generation@3.7.0
  - @contractspec/example.integration-stripe@3.7.0
  - @contractspec/example.kb-update-pipeline@3.7.0
  - @contractspec/example.openbanking-powens@3.7.0
  - @contractspec/example.ai-chat-assistant@3.7.0
  - @contractspec/example.learning-patterns@3.7.0
  - @contractspec/example.saas-boilerplate@3.7.0
  - @contractspec/example.integration-hub@3.7.0
  - @contractspec/example.knowledge-canon@3.7.0
  - @contractspec/example.personalization@3.7.0
  - @contractspec/example.voice-providers@3.7.0
  - @contractspec/example.wealth-snapshot@3.7.0
  - @contractspec/example.workflow-system@3.7.0
  - @contractspec/example.ai-support-bot@3.7.0
  - @contractspec/example.agent-console@3.7.0
  - @contractspec/example.lifecycle-cli@3.7.0
  - @contractspec/lib.example-shared-ui@6.0.0
  - @contractspec/example.crm-pipeline@3.7.0
  - @contractspec/example.marketplace@3.7.0
  - @contractspec/lib.runtime-sandbox@2.7.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/example.team-hub@3.7.0

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
- Updated dependencies [44b46cd]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/example.ai-chat-assistant@3.6.0
  - @contractspec/example.integration-hub@3.6.0
  - @contractspec/example.learning-journey-studio-onboarding@3.6.0
  - @contractspec/example.learning-journey-quest-challenges@3.6.0
  - @contractspec/example.learning-journey-crm-onboarding@3.6.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.6.0
  - @contractspec/example.learning-journey-ambient-coach@3.6.0
  - @contractspec/example.learning-journey-platform-tour@3.6.0
  - @contractspec/example.learning-journey-ui-onboarding@3.6.0
  - @contractspec/example.learning-journey-ui-coaching@3.6.0
  - @contractspec/example.learning-journey-ui-gamified@3.6.0
  - @contractspec/example.learning-journey-duo-drills@3.6.0
  - @contractspec/example.learning-journey-ui-shared@3.6.0
  - @contractspec/example.learning-journey-registry@3.6.0
  - @contractspec/example.locale-jurisdiction-gate@3.6.0
  - @contractspec/example.versioned-knowledge-base@3.6.0
  - @contractspec/example.analytics-dashboard@3.6.0
  - @contractspec/example.lifecycle-dashboard@3.6.0
  - @contractspec/example.service-business-os@3.6.0
  - @contractspec/example.content-generation@3.6.0
  - @contractspec/example.integration-stripe@3.6.0
  - @contractspec/example.kb-update-pipeline@3.6.0
  - @contractspec/example.openbanking-powens@3.6.0
  - @contractspec/example.learning-patterns@3.6.0
  - @contractspec/example.saas-boilerplate@3.6.0
  - @contractspec/example.knowledge-canon@3.6.0
  - @contractspec/example.personalization@3.6.0
  - @contractspec/example.voice-providers@3.6.0
  - @contractspec/example.wealth-snapshot@3.6.0
  - @contractspec/example.workflow-system@3.6.0
  - @contractspec/example.ai-support-bot@3.6.0
  - @contractspec/example.agent-console@3.6.0
  - @contractspec/example.lifecycle-cli@3.6.0
  - @contractspec/lib.example-shared-ui@5.0.0
  - @contractspec/example.crm-pipeline@3.6.0
  - @contractspec/example.marketplace@3.6.0
  - @contractspec/lib.runtime-sandbox@2.6.0
  - @contractspec/example.team-hub@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/example.agent-console@3.5.5
  - @contractspec/example.learning-journey-studio-onboarding@3.5.5
  - @contractspec/example.learning-journey-quest-challenges@3.5.5
  - @contractspec/example.learning-journey-crm-onboarding@3.5.5
  - @contractspec/example.policy-safe-knowledge-assistant@3.5.5
  - @contractspec/example.learning-journey-ambient-coach@3.5.5
  - @contractspec/example.learning-journey-platform-tour@3.5.5
  - @contractspec/example.learning-journey-ui-onboarding@3.5.5
  - @contractspec/example.learning-journey-ui-coaching@3.5.5
  - @contractspec/example.learning-journey-ui-gamified@3.5.5
  - @contractspec/example.learning-journey-duo-drills@3.5.5
  - @contractspec/example.learning-journey-ui-shared@3.5.5
  - @contractspec/example.learning-journey-registry@3.5.5
  - @contractspec/example.locale-jurisdiction-gate@3.5.5
  - @contractspec/example.versioned-knowledge-base@3.5.5
  - @contractspec/example.analytics-dashboard@3.5.5
  - @contractspec/example.lifecycle-dashboard@3.5.5
  - @contractspec/example.service-business-os@3.5.5
  - @contractspec/example.content-generation@3.5.5
  - @contractspec/example.integration-stripe@3.5.5
  - @contractspec/example.kb-update-pipeline@3.5.5
  - @contractspec/example.openbanking-powens@3.5.5
  - @contractspec/example.learning-patterns@3.5.5
  - @contractspec/example.saas-boilerplate@3.5.5
  - @contractspec/example.integration-hub@3.5.5
  - @contractspec/example.knowledge-canon@3.5.5
  - @contractspec/example.personalization@3.5.5
  - @contractspec/example.voice-providers@3.5.5
  - @contractspec/example.wealth-snapshot@3.5.5
  - @contractspec/example.workflow-system@3.5.5
  - @contractspec/example.ai-support-bot@3.5.5
  - @contractspec/example.lifecycle-cli@3.5.5
  - @contractspec/lib.example-shared-ui@4.0.5
  - @contractspec/example.crm-pipeline@3.5.5
  - @contractspec/example.marketplace@3.5.5
  - @contractspec/lib.runtime-sandbox@2.5.5
  - @contractspec/example.team-hub@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/example.learning-journey-studio-onboarding@3.5.4
  - @contractspec/example.learning-journey-quest-challenges@3.5.4
  - @contractspec/example.learning-journey-crm-onboarding@3.5.4
  - @contractspec/example.policy-safe-knowledge-assistant@3.5.4
  - @contractspec/example.learning-journey-ambient-coach@3.5.4
  - @contractspec/example.learning-journey-platform-tour@3.5.4
  - @contractspec/example.learning-journey-ui-onboarding@3.5.4
  - @contractspec/example.learning-journey-ui-coaching@3.5.4
  - @contractspec/example.learning-journey-ui-gamified@3.5.4
  - @contractspec/example.learning-journey-duo-drills@3.5.4
  - @contractspec/example.learning-journey-ui-shared@3.5.4
  - @contractspec/example.learning-journey-registry@3.5.4
  - @contractspec/example.locale-jurisdiction-gate@3.5.4
  - @contractspec/example.versioned-knowledge-base@3.5.4
  - @contractspec/example.analytics-dashboard@3.5.4
  - @contractspec/example.lifecycle-dashboard@3.5.4
  - @contractspec/example.service-business-os@3.5.4
  - @contractspec/example.content-generation@3.5.4
  - @contractspec/example.integration-stripe@3.5.4
  - @contractspec/example.kb-update-pipeline@3.5.4
  - @contractspec/example.openbanking-powens@3.5.4
  - @contractspec/example.learning-patterns@3.5.4
  - @contractspec/example.saas-boilerplate@3.5.4
  - @contractspec/example.integration-hub@3.5.4
  - @contractspec/example.knowledge-canon@3.5.4
  - @contractspec/example.personalization@3.5.4
  - @contractspec/example.voice-providers@3.5.4
  - @contractspec/example.wealth-snapshot@3.5.4
  - @contractspec/example.workflow-system@3.5.4
  - @contractspec/example.ai-support-bot@3.5.4
  - @contractspec/example.agent-console@3.5.4
  - @contractspec/example.lifecycle-cli@3.5.4
  - @contractspec/lib.example-shared-ui@4.0.4
  - @contractspec/example.crm-pipeline@3.5.4
  - @contractspec/example.marketplace@3.5.4
  - @contractspec/lib.runtime-sandbox@2.5.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/example.team-hub@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/example.learning-journey-studio-onboarding@3.5.3
  - @contractspec/example.learning-journey-quest-challenges@3.5.3
  - @contractspec/example.learning-journey-crm-onboarding@3.5.3
  - @contractspec/example.policy-safe-knowledge-assistant@3.5.3
  - @contractspec/example.learning-journey-ambient-coach@3.5.3
  - @contractspec/example.learning-journey-platform-tour@3.5.3
  - @contractspec/example.learning-journey-ui-onboarding@3.5.3
  - @contractspec/example.learning-journey-ui-coaching@3.5.3
  - @contractspec/example.learning-journey-ui-gamified@3.5.3
  - @contractspec/example.learning-journey-duo-drills@3.5.3
  - @contractspec/example.learning-journey-ui-shared@3.5.3
  - @contractspec/example.learning-journey-registry@3.5.3
  - @contractspec/example.locale-jurisdiction-gate@3.5.3
  - @contractspec/example.versioned-knowledge-base@3.5.3
  - @contractspec/example.analytics-dashboard@3.5.3
  - @contractspec/example.lifecycle-dashboard@3.5.3
  - @contractspec/example.service-business-os@3.5.3
  - @contractspec/example.content-generation@3.5.3
  - @contractspec/example.integration-stripe@3.5.3
  - @contractspec/example.kb-update-pipeline@3.5.3
  - @contractspec/example.openbanking-powens@3.5.3
  - @contractspec/example.learning-patterns@3.5.3
  - @contractspec/example.saas-boilerplate@3.5.3
  - @contractspec/example.integration-hub@3.5.3
  - @contractspec/example.knowledge-canon@3.5.3
  - @contractspec/example.personalization@3.5.3
  - @contractspec/example.voice-providers@3.5.3
  - @contractspec/example.wealth-snapshot@3.5.3
  - @contractspec/example.workflow-system@3.5.3
  - @contractspec/example.ai-support-bot@3.5.3
  - @contractspec/example.agent-console@3.5.3
  - @contractspec/example.lifecycle-cli@3.5.3
  - @contractspec/lib.example-shared-ui@4.0.3
  - @contractspec/example.crm-pipeline@3.5.3
  - @contractspec/example.marketplace@3.5.3
  - @contractspec/lib.runtime-sandbox@2.5.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/example.team-hub@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/example.learning-journey-studio-onboarding@3.5.2
  - @contractspec/example.learning-journey-quest-challenges@3.5.2
  - @contractspec/example.learning-journey-crm-onboarding@3.5.2
  - @contractspec/example.policy-safe-knowledge-assistant@3.5.2
  - @contractspec/example.learning-journey-ambient-coach@3.5.2
  - @contractspec/example.learning-journey-platform-tour@3.5.2
  - @contractspec/example.learning-journey-ui-onboarding@3.5.2
  - @contractspec/example.learning-journey-ui-coaching@3.5.2
  - @contractspec/example.learning-journey-ui-gamified@3.5.2
  - @contractspec/example.learning-journey-duo-drills@3.5.2
  - @contractspec/example.learning-journey-ui-shared@3.5.2
  - @contractspec/example.learning-journey-registry@3.5.2
  - @contractspec/example.locale-jurisdiction-gate@3.5.2
  - @contractspec/example.versioned-knowledge-base@3.5.2
  - @contractspec/example.analytics-dashboard@3.5.2
  - @contractspec/example.lifecycle-dashboard@3.5.2
  - @contractspec/example.service-business-os@3.5.2
  - @contractspec/example.content-generation@3.5.2
  - @contractspec/example.integration-stripe@3.5.2
  - @contractspec/example.kb-update-pipeline@3.5.2
  - @contractspec/example.openbanking-powens@3.5.2
  - @contractspec/example.learning-patterns@3.5.2
  - @contractspec/example.saas-boilerplate@3.5.2
  - @contractspec/example.integration-hub@3.5.2
  - @contractspec/example.knowledge-canon@3.5.2
  - @contractspec/example.personalization@3.5.2
  - @contractspec/example.voice-providers@3.5.2
  - @contractspec/example.wealth-snapshot@3.5.2
  - @contractspec/example.workflow-system@3.5.2
  - @contractspec/example.ai-support-bot@3.5.2
  - @contractspec/example.agent-console@3.5.2
  - @contractspec/example.lifecycle-cli@3.5.2
  - @contractspec/lib.example-shared-ui@4.0.2
  - @contractspec/example.crm-pipeline@3.5.2
  - @contractspec/example.marketplace@3.5.2
  - @contractspec/lib.runtime-sandbox@2.5.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/example.team-hub@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [73a7f8d]
- Updated dependencies [dfff0d4]
  - @contractspec/lib.example-shared-ui@4.0.1
  - @contractspec/example.learning-journey-studio-onboarding@3.5.1
  - @contractspec/example.learning-journey-quest-challenges@3.5.1
  - @contractspec/example.learning-journey-crm-onboarding@3.5.1
  - @contractspec/example.policy-safe-knowledge-assistant@3.5.1
  - @contractspec/example.learning-journey-ambient-coach@3.5.1
  - @contractspec/example.learning-journey-platform-tour@3.5.1
  - @contractspec/example.learning-journey-ui-onboarding@3.5.1
  - @contractspec/example.learning-journey-ui-coaching@3.5.1
  - @contractspec/example.learning-journey-ui-gamified@3.5.1
  - @contractspec/example.learning-journey-duo-drills@3.5.1
  - @contractspec/example.learning-journey-ui-shared@3.5.1
  - @contractspec/example.learning-journey-registry@3.5.1
  - @contractspec/example.locale-jurisdiction-gate@3.5.1
  - @contractspec/example.versioned-knowledge-base@3.5.1
  - @contractspec/example.analytics-dashboard@3.5.1
  - @contractspec/example.lifecycle-dashboard@3.5.1
  - @contractspec/example.service-business-os@3.5.1
  - @contractspec/example.content-generation@3.5.1
  - @contractspec/example.integration-stripe@3.5.1
  - @contractspec/example.kb-update-pipeline@3.5.1
  - @contractspec/example.openbanking-powens@3.5.1
  - @contractspec/example.learning-patterns@3.5.1
  - @contractspec/example.saas-boilerplate@3.5.1
  - @contractspec/example.integration-hub@3.5.1
  - @contractspec/example.knowledge-canon@3.5.1
  - @contractspec/example.personalization@3.5.1
  - @contractspec/example.voice-providers@3.5.1
  - @contractspec/example.wealth-snapshot@3.5.1
  - @contractspec/example.workflow-system@3.5.1
  - @contractspec/example.ai-support-bot@3.5.1
  - @contractspec/example.agent-console@3.5.1
  - @contractspec/example.lifecycle-cli@3.5.1
  - @contractspec/example.crm-pipeline@3.5.1
  - @contractspec/example.marketplace@3.5.1
  - @contractspec/lib.runtime-sandbox@2.5.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/example.team-hub@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [66c51da]
- Updated dependencies [230bdf6]
  - @contractspec/lib.example-shared-ui@4.0.0
  - @contractspec/example.learning-journey-studio-onboarding@3.5.0
  - @contractspec/example.learning-journey-quest-challenges@3.5.0
  - @contractspec/example.learning-journey-crm-onboarding@3.5.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.5.0
  - @contractspec/example.learning-journey-ambient-coach@3.5.0
  - @contractspec/example.learning-journey-platform-tour@3.5.0
  - @contractspec/example.learning-journey-ui-onboarding@3.5.0
  - @contractspec/example.learning-journey-ui-coaching@3.5.0
  - @contractspec/example.learning-journey-ui-gamified@3.5.0
  - @contractspec/example.learning-journey-duo-drills@3.5.0
  - @contractspec/example.learning-journey-ui-shared@3.5.0
  - @contractspec/example.learning-journey-registry@3.5.0
  - @contractspec/example.locale-jurisdiction-gate@3.5.0
  - @contractspec/example.versioned-knowledge-base@3.5.0
  - @contractspec/example.analytics-dashboard@3.5.0
  - @contractspec/example.lifecycle-dashboard@3.5.0
  - @contractspec/example.service-business-os@3.5.0
  - @contractspec/example.content-generation@3.5.0
  - @contractspec/example.integration-stripe@3.5.0
  - @contractspec/example.kb-update-pipeline@3.5.0
  - @contractspec/example.openbanking-powens@3.5.0
  - @contractspec/example.learning-patterns@3.5.0
  - @contractspec/example.saas-boilerplate@3.5.0
  - @contractspec/example.integration-hub@3.5.0
  - @contractspec/example.knowledge-canon@3.5.0
  - @contractspec/example.personalization@3.5.0
  - @contractspec/example.voice-providers@3.5.0
  - @contractspec/example.wealth-snapshot@3.5.0
  - @contractspec/example.workflow-system@3.5.0
  - @contractspec/example.ai-support-bot@3.5.0
  - @contractspec/example.agent-console@3.5.0
  - @contractspec/example.lifecycle-cli@3.5.0
  - @contractspec/example.crm-pipeline@3.5.0
  - @contractspec/example.marketplace@3.5.0
  - @contractspec/lib.runtime-sandbox@2.5.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/example.team-hub@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/example.learning-journey-studio-onboarding@3.4.3
  - @contractspec/example.learning-journey-quest-challenges@3.4.3
  - @contractspec/example.learning-journey-crm-onboarding@3.4.3
  - @contractspec/example.policy-safe-knowledge-assistant@3.4.3
  - @contractspec/example.learning-journey-ambient-coach@3.4.3
  - @contractspec/example.learning-journey-platform-tour@3.4.3
  - @contractspec/example.learning-journey-ui-onboarding@3.4.3
  - @contractspec/example.learning-journey-ui-coaching@3.4.3
  - @contractspec/example.learning-journey-ui-gamified@3.4.3
  - @contractspec/example.learning-journey-duo-drills@3.4.3
  - @contractspec/example.learning-journey-ui-shared@3.4.3
  - @contractspec/example.learning-journey-registry@3.4.3
  - @contractspec/example.locale-jurisdiction-gate@3.4.3
  - @contractspec/example.versioned-knowledge-base@3.4.3
  - @contractspec/example.analytics-dashboard@3.4.3
  - @contractspec/example.lifecycle-dashboard@3.4.3
  - @contractspec/example.service-business-os@3.4.3
  - @contractspec/example.content-generation@3.4.3
  - @contractspec/example.integration-stripe@3.4.3
  - @contractspec/example.kb-update-pipeline@3.4.3
  - @contractspec/example.openbanking-powens@3.4.3
  - @contractspec/example.learning-patterns@3.4.3
  - @contractspec/example.saas-boilerplate@3.4.3
  - @contractspec/example.integration-hub@3.4.3
  - @contractspec/example.knowledge-canon@3.4.3
  - @contractspec/example.personalization@3.4.3
  - @contractspec/example.voice-providers@3.4.3
  - @contractspec/example.wealth-snapshot@3.4.3
  - @contractspec/example.workflow-system@3.4.3
  - @contractspec/example.ai-support-bot@3.4.3
  - @contractspec/example.agent-console@3.4.3
  - @contractspec/example.lifecycle-cli@3.4.3
  - @contractspec/lib.example-shared-ui@3.4.3
  - @contractspec/example.crm-pipeline@3.4.3
  - @contractspec/example.marketplace@3.4.3
  - @contractspec/lib.runtime-sandbox@2.4.3
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/example.team-hub@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/example.learning-journey-studio-onboarding@3.4.2
  - @contractspec/example.learning-journey-quest-challenges@3.4.2
  - @contractspec/example.learning-journey-crm-onboarding@3.4.2
  - @contractspec/example.policy-safe-knowledge-assistant@3.4.2
  - @contractspec/example.learning-journey-ambient-coach@3.4.2
  - @contractspec/example.learning-journey-platform-tour@3.4.2
  - @contractspec/example.learning-journey-ui-onboarding@3.4.2
  - @contractspec/example.learning-journey-ui-coaching@3.4.2
  - @contractspec/example.learning-journey-ui-gamified@3.4.2
  - @contractspec/example.learning-journey-duo-drills@3.4.2
  - @contractspec/example.learning-journey-ui-shared@3.4.2
  - @contractspec/example.learning-journey-registry@3.4.2
  - @contractspec/example.locale-jurisdiction-gate@3.4.2
  - @contractspec/example.versioned-knowledge-base@3.4.2
  - @contractspec/example.analytics-dashboard@3.4.2
  - @contractspec/example.lifecycle-dashboard@3.4.2
  - @contractspec/example.service-business-os@3.4.2
  - @contractspec/example.content-generation@3.4.2
  - @contractspec/example.integration-stripe@3.4.2
  - @contractspec/example.kb-update-pipeline@3.4.2
  - @contractspec/example.openbanking-powens@3.4.2
  - @contractspec/example.learning-patterns@3.4.2
  - @contractspec/example.saas-boilerplate@3.4.2
  - @contractspec/example.integration-hub@3.4.2
  - @contractspec/example.knowledge-canon@3.4.2
  - @contractspec/example.personalization@3.4.2
  - @contractspec/example.voice-providers@3.4.2
  - @contractspec/example.wealth-snapshot@3.4.2
  - @contractspec/example.workflow-system@3.4.2
  - @contractspec/example.ai-support-bot@3.4.2
  - @contractspec/example.agent-console@3.4.2
  - @contractspec/example.lifecycle-cli@3.4.2
  - @contractspec/lib.example-shared-ui@3.4.2
  - @contractspec/example.crm-pipeline@3.4.2
  - @contractspec/example.marketplace@3.4.2
  - @contractspec/lib.runtime-sandbox@2.4.2
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/example.team-hub@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/example.learning-journey-studio-onboarding@3.4.1
  - @contractspec/example.learning-journey-quest-challenges@3.4.1
  - @contractspec/example.learning-journey-crm-onboarding@3.4.1
  - @contractspec/example.policy-safe-knowledge-assistant@3.4.1
  - @contractspec/example.learning-journey-ambient-coach@3.4.1
  - @contractspec/example.learning-journey-platform-tour@3.4.1
  - @contractspec/example.learning-journey-ui-onboarding@3.4.1
  - @contractspec/example.learning-journey-ui-coaching@3.4.1
  - @contractspec/example.learning-journey-ui-gamified@3.4.1
  - @contractspec/example.learning-journey-duo-drills@3.4.1
  - @contractspec/example.learning-journey-ui-shared@3.4.1
  - @contractspec/example.learning-journey-registry@3.4.1
  - @contractspec/example.locale-jurisdiction-gate@3.4.1
  - @contractspec/example.versioned-knowledge-base@3.4.1
  - @contractspec/example.analytics-dashboard@3.4.1
  - @contractspec/example.lifecycle-dashboard@3.4.1
  - @contractspec/example.service-business-os@3.4.1
  - @contractspec/example.content-generation@3.4.1
  - @contractspec/example.integration-stripe@3.4.1
  - @contractspec/example.kb-update-pipeline@3.4.1
  - @contractspec/example.openbanking-powens@3.4.1
  - @contractspec/example.learning-patterns@3.4.1
  - @contractspec/example.saas-boilerplate@3.4.1
  - @contractspec/example.integration-hub@3.4.1
  - @contractspec/example.knowledge-canon@3.4.1
  - @contractspec/example.personalization@3.4.1
  - @contractspec/example.voice-providers@3.4.1
  - @contractspec/example.wealth-snapshot@3.4.1
  - @contractspec/example.workflow-system@3.4.1
  - @contractspec/example.ai-support-bot@3.4.1
  - @contractspec/example.agent-console@3.4.1
  - @contractspec/example.lifecycle-cli@3.4.1
  - @contractspec/lib.example-shared-ui@3.4.1
  - @contractspec/example.crm-pipeline@3.4.1
  - @contractspec/example.marketplace@3.4.1
  - @contractspec/lib.runtime-sandbox@2.4.1
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/example.team-hub@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/example.learning-journey-studio-onboarding@3.4.0
  - @contractspec/example.learning-journey-quest-challenges@3.4.0
  - @contractspec/example.learning-journey-crm-onboarding@3.4.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.4.0
  - @contractspec/example.learning-journey-ambient-coach@3.4.0
  - @contractspec/example.learning-journey-platform-tour@3.4.0
  - @contractspec/example.learning-journey-ui-onboarding@3.4.0
  - @contractspec/example.learning-journey-ui-coaching@3.4.0
  - @contractspec/example.learning-journey-ui-gamified@3.4.0
  - @contractspec/example.learning-journey-duo-drills@3.4.0
  - @contractspec/example.learning-journey-ui-shared@3.4.0
  - @contractspec/example.learning-journey-registry@3.4.0
  - @contractspec/example.locale-jurisdiction-gate@3.4.0
  - @contractspec/example.versioned-knowledge-base@3.4.0
  - @contractspec/example.analytics-dashboard@3.4.0
  - @contractspec/example.lifecycle-dashboard@3.4.0
  - @contractspec/example.service-business-os@3.4.0
  - @contractspec/example.content-generation@3.4.0
  - @contractspec/example.integration-stripe@3.4.0
  - @contractspec/example.kb-update-pipeline@3.4.0
  - @contractspec/example.openbanking-powens@3.4.0
  - @contractspec/example.learning-patterns@3.4.0
  - @contractspec/example.saas-boilerplate@3.4.0
  - @contractspec/example.integration-hub@3.4.0
  - @contractspec/example.knowledge-canon@3.4.0
  - @contractspec/example.personalization@3.4.0
  - @contractspec/example.voice-providers@3.4.0
  - @contractspec/example.wealth-snapshot@3.4.0
  - @contractspec/example.workflow-system@3.4.0
  - @contractspec/example.ai-support-bot@3.4.0
  - @contractspec/example.agent-console@3.4.0
  - @contractspec/example.lifecycle-cli@3.4.0
  - @contractspec/lib.example-shared-ui@3.4.0
  - @contractspec/example.crm-pipeline@3.4.0
  - @contractspec/example.marketplace@3.4.0
  - @contractspec/lib.runtime-sandbox@2.4.0
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/example.team-hub@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/example.learning-journey-studio-onboarding@3.3.0
  - @contractspec/example.learning-journey-quest-challenges@3.3.0
  - @contractspec/example.learning-journey-crm-onboarding@3.3.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.3.0
  - @contractspec/example.learning-journey-ambient-coach@3.3.0
  - @contractspec/example.learning-journey-platform-tour@3.3.0
  - @contractspec/example.learning-journey-ui-onboarding@3.3.0
  - @contractspec/example.learning-journey-ui-coaching@3.3.0
  - @contractspec/example.learning-journey-ui-gamified@3.3.0
  - @contractspec/example.learning-journey-duo-drills@3.3.0
  - @contractspec/example.learning-journey-ui-shared@3.3.0
  - @contractspec/example.learning-journey-registry@3.3.0
  - @contractspec/example.locale-jurisdiction-gate@3.3.0
  - @contractspec/example.versioned-knowledge-base@3.3.0
  - @contractspec/example.analytics-dashboard@3.3.0
  - @contractspec/example.lifecycle-dashboard@3.3.0
  - @contractspec/example.service-business-os@3.3.0
  - @contractspec/example.content-generation@3.3.0
  - @contractspec/example.integration-stripe@3.3.0
  - @contractspec/example.kb-update-pipeline@3.3.0
  - @contractspec/example.openbanking-powens@3.3.0
  - @contractspec/example.learning-patterns@3.3.0
  - @contractspec/example.saas-boilerplate@3.3.0
  - @contractspec/example.integration-hub@3.3.0
  - @contractspec/example.knowledge-canon@3.3.0
  - @contractspec/example.personalization@3.3.0
  - @contractspec/example.voice-providers@3.3.0
  - @contractspec/example.wealth-snapshot@3.3.0
  - @contractspec/example.workflow-system@3.3.0
  - @contractspec/example.ai-support-bot@3.3.0
  - @contractspec/example.agent-console@3.3.0
  - @contractspec/example.lifecycle-cli@3.3.0
  - @contractspec/lib.example-shared-ui@3.3.0
  - @contractspec/example.crm-pipeline@3.3.0
  - @contractspec/example.marketplace@3.3.0
  - @contractspec/lib.runtime-sandbox@2.3.0
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/example.team-hub@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/example.learning-journey-studio-onboarding@3.2.0
  - @contractspec/example.learning-journey-quest-challenges@3.2.0
  - @contractspec/example.learning-journey-crm-onboarding@3.2.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.2.0
  - @contractspec/example.learning-journey-ambient-coach@3.2.0
  - @contractspec/example.learning-journey-platform-tour@3.2.0
  - @contractspec/example.learning-journey-ui-onboarding@3.2.0
  - @contractspec/example.learning-journey-ui-coaching@3.2.0
  - @contractspec/example.learning-journey-ui-gamified@3.2.0
  - @contractspec/example.learning-journey-duo-drills@3.2.0
  - @contractspec/example.learning-journey-ui-shared@3.2.0
  - @contractspec/example.learning-journey-registry@3.2.0
  - @contractspec/example.locale-jurisdiction-gate@3.2.0
  - @contractspec/example.versioned-knowledge-base@3.2.0
  - @contractspec/example.analytics-dashboard@3.2.0
  - @contractspec/example.lifecycle-dashboard@3.2.0
  - @contractspec/example.service-business-os@3.2.0
  - @contractspec/example.content-generation@3.2.0
  - @contractspec/example.integration-stripe@3.2.0
  - @contractspec/example.kb-update-pipeline@3.2.0
  - @contractspec/example.openbanking-powens@3.2.0
  - @contractspec/example.learning-patterns@3.2.0
  - @contractspec/example.saas-boilerplate@3.2.0
  - @contractspec/example.integration-hub@3.2.0
  - @contractspec/example.knowledge-canon@3.2.0
  - @contractspec/example.personalization@3.2.0
  - @contractspec/example.voice-providers@3.2.0
  - @contractspec/example.wealth-snapshot@3.2.0
  - @contractspec/example.workflow-system@3.2.0
  - @contractspec/example.ai-support-bot@3.2.0
  - @contractspec/example.agent-console@3.2.0
  - @contractspec/example.lifecycle-cli@3.2.0
  - @contractspec/lib.example-shared-ui@3.2.0
  - @contractspec/example.crm-pipeline@3.2.0
  - @contractspec/example.marketplace@3.2.0
  - @contractspec/lib.runtime-sandbox@2.2.0
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/example.team-hub@3.2.0

## 3.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/example.analytics-dashboard@3.1.1
  - @contractspec/example.integration-stripe@3.1.1
  - @contractspec/example.voice-providers@3.1.1
  - @contractspec/example.agent-console@3.1.1
  - @contractspec/example.ai-support-bot@3.1.1
  - @contractspec/example.content-generation@3.1.1
  - @contractspec/example.crm-pipeline@3.1.1
  - @contractspec/example.integration-hub@3.1.1
  - @contractspec/example.kb-update-pipeline@3.1.1
  - @contractspec/example.knowledge-canon@3.1.1
  - @contractspec/example.learning-journey-ambient-coach@3.1.1
  - @contractspec/example.learning-journey-crm-onboarding@3.1.1
  - @contractspec/example.learning-journey-duo-drills@3.1.1
  - @contractspec/example.learning-journey-platform-tour@3.1.1
  - @contractspec/example.learning-journey-quest-challenges@3.1.1
  - @contractspec/example.learning-journey-registry@3.1.1
  - @contractspec/example.learning-journey-studio-onboarding@3.1.1
  - @contractspec/example.learning-journey-ui-coaching@3.1.1
  - @contractspec/example.learning-journey-ui-gamified@3.1.1
  - @contractspec/example.learning-journey-ui-onboarding@3.1.1
  - @contractspec/example.learning-journey-ui-shared@3.1.1
  - @contractspec/example.learning-patterns@3.1.1
  - @contractspec/example.lifecycle-cli@3.1.1
  - @contractspec/example.lifecycle-dashboard@3.1.1
  - @contractspec/example.locale-jurisdiction-gate@3.1.1
  - @contractspec/example.marketplace@3.1.1
  - @contractspec/example.openbanking-powens@3.1.1
  - @contractspec/example.personalization@3.1.1
  - @contractspec/example.policy-safe-knowledge-assistant@3.1.1
  - @contractspec/example.saas-boilerplate@3.1.1
  - @contractspec/example.service-business-os@3.1.1
  - @contractspec/example.team-hub@3.1.1
  - @contractspec/example.versioned-knowledge-base@3.1.1
  - @contractspec/example.wealth-snapshot@3.1.1
  - @contractspec/example.workflow-system@3.1.1
  - @contractspec/lib.example-shared-ui@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/example.learning-journey-studio-onboarding@3.1.0
  - @contractspec/example.learning-journey-quest-challenges@3.1.0
  - @contractspec/example.learning-journey-crm-onboarding@3.1.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.1.0
  - @contractspec/example.learning-journey-ambient-coach@3.1.0
  - @contractspec/example.learning-journey-platform-tour@3.1.0
  - @contractspec/example.learning-journey-ui-onboarding@3.1.0
  - @contractspec/example.learning-journey-ui-coaching@3.1.0
  - @contractspec/example.learning-journey-ui-gamified@3.1.0
  - @contractspec/example.learning-journey-duo-drills@3.1.0
  - @contractspec/example.learning-journey-ui-shared@3.1.0
  - @contractspec/example.learning-journey-registry@3.1.0
  - @contractspec/example.locale-jurisdiction-gate@3.1.0
  - @contractspec/example.versioned-knowledge-base@3.1.0
  - @contractspec/example.analytics-dashboard@3.1.0
  - @contractspec/example.lifecycle-dashboard@3.1.0
  - @contractspec/example.service-business-os@3.1.0
  - @contractspec/example.content-generation@3.1.0
  - @contractspec/example.integration-stripe@3.1.0
  - @contractspec/example.kb-update-pipeline@3.1.0
  - @contractspec/example.openbanking-powens@3.1.0
  - @contractspec/example.learning-patterns@3.1.0
  - @contractspec/example.saas-boilerplate@3.1.0
  - @contractspec/example.integration-hub@3.1.0
  - @contractspec/example.knowledge-canon@3.1.0
  - @contractspec/example.personalization@3.1.0
  - @contractspec/example.voice-providers@3.1.0
  - @contractspec/example.wealth-snapshot@3.1.0
  - @contractspec/example.workflow-system@3.1.0
  - @contractspec/example.ai-support-bot@3.1.0
  - @contractspec/example.agent-console@3.1.0
  - @contractspec/example.lifecycle-cli@3.1.0
  - @contractspec/lib.example-shared-ui@3.1.0
  - @contractspec/example.crm-pipeline@3.1.0
  - @contractspec/example.marketplace@3.1.0
  - @contractspec/lib.runtime-sandbox@2.1.0
  - @contractspec/example.team-hub@3.1.0

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
  - @contractspec/example.integration-hub@3.0.0
  - @contractspec/example.learning-journey-studio-onboarding@3.0.0
  - @contractspec/example.learning-journey-quest-challenges@3.0.0
  - @contractspec/example.learning-journey-crm-onboarding@3.0.0
  - @contractspec/example.policy-safe-knowledge-assistant@3.0.0
  - @contractspec/example.learning-journey-ambient-coach@3.0.0
  - @contractspec/example.learning-journey-platform-tour@3.0.0
  - @contractspec/example.learning-journey-ui-onboarding@3.0.0
  - @contractspec/example.learning-journey-ui-coaching@3.0.0
  - @contractspec/example.learning-journey-ui-gamified@3.0.0
  - @contractspec/example.learning-journey-duo-drills@3.0.0
  - @contractspec/example.learning-journey-ui-shared@3.0.0
  - @contractspec/example.learning-journey-registry@3.0.0
  - @contractspec/example.locale-jurisdiction-gate@3.0.0
  - @contractspec/example.versioned-knowledge-base@3.0.0
  - @contractspec/example.analytics-dashboard@3.0.0
  - @contractspec/example.lifecycle-dashboard@3.0.0
  - @contractspec/example.service-business-os@3.0.0
  - @contractspec/example.content-generation@3.0.0
  - @contractspec/example.integration-stripe@3.0.0
  - @contractspec/example.kb-update-pipeline@3.0.0
  - @contractspec/example.openbanking-powens@3.0.0
  - @contractspec/example.learning-patterns@3.0.0
  - @contractspec/example.saas-boilerplate@3.0.0
  - @contractspec/example.knowledge-canon@3.0.0
  - @contractspec/example.personalization@3.0.0
  - @contractspec/example.voice-providers@3.0.0
  - @contractspec/example.wealth-snapshot@3.0.0
  - @contractspec/example.workflow-system@3.0.0
  - @contractspec/example.ai-support-bot@3.0.0
  - @contractspec/example.agent-console@3.0.0
  - @contractspec/example.lifecycle-cli@3.0.0
  - @contractspec/lib.example-shared-ui@3.0.0
  - @contractspec/example.crm-pipeline@3.0.0
  - @contractspec/example.marketplace@3.0.0
  - @contractspec/lib.runtime-sandbox@2.0.0
  - @contractspec/example.team-hub@3.0.0

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/example.integration-hub@2.9.1
  - @contractspec/example.analytics-dashboard@2.9.1
  - @contractspec/example.integration-stripe@2.9.1
  - @contractspec/example.voice-providers@2.9.1
  - @contractspec/example.agent-console@2.9.1
  - @contractspec/example.ai-support-bot@2.9.1
  - @contractspec/example.content-generation@2.9.1
  - @contractspec/example.crm-pipeline@2.9.1
  - @contractspec/example.kb-update-pipeline@2.9.1
  - @contractspec/example.knowledge-canon@2.9.1
  - @contractspec/example.learning-journey-ambient-coach@2.9.1
  - @contractspec/example.learning-journey-crm-onboarding@2.9.1
  - @contractspec/example.learning-journey-duo-drills@2.9.1
  - @contractspec/example.learning-journey-platform-tour@2.9.1
  - @contractspec/example.learning-journey-quest-challenges@2.9.1
  - @contractspec/example.learning-journey-registry@2.9.1
  - @contractspec/example.learning-journey-studio-onboarding@2.9.1
  - @contractspec/example.learning-journey-ui-coaching@2.9.1
  - @contractspec/example.learning-journey-ui-gamified@2.9.1
  - @contractspec/example.learning-journey-ui-onboarding@2.9.1
  - @contractspec/example.learning-journey-ui-shared@2.9.1
  - @contractspec/example.learning-patterns@2.9.1
  - @contractspec/example.lifecycle-cli@2.9.1
  - @contractspec/example.lifecycle-dashboard@2.9.1
  - @contractspec/example.locale-jurisdiction-gate@2.9.1
  - @contractspec/example.marketplace@2.9.1
  - @contractspec/example.openbanking-powens@2.9.1
  - @contractspec/example.personalization@2.9.1
  - @contractspec/example.policy-safe-knowledge-assistant@2.9.1
  - @contractspec/example.saas-boilerplate@2.9.1
  - @contractspec/example.service-business-os@2.9.1
  - @contractspec/example.team-hub@2.9.1
  - @contractspec/example.versioned-knowledge-base@2.9.1
  - @contractspec/example.wealth-snapshot@2.9.1
  - @contractspec/example.workflow-system@2.9.1
  - @contractspec/lib.example-shared-ui@2.9.1

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@2.9.0
  - @contractspec/example.learning-journey-quest-challenges@2.9.0
  - @contractspec/example.learning-journey-crm-onboarding@2.9.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.9.0
  - @contractspec/example.learning-journey-ambient-coach@2.9.0
  - @contractspec/example.learning-journey-platform-tour@2.9.0
  - @contractspec/example.learning-journey-ui-onboarding@2.9.0
  - @contractspec/example.learning-journey-ui-coaching@2.9.0
  - @contractspec/example.learning-journey-ui-gamified@2.9.0
  - @contractspec/example.learning-journey-duo-drills@2.9.0
  - @contractspec/example.learning-journey-ui-shared@2.9.0
  - @contractspec/example.learning-journey-registry@2.9.0
  - @contractspec/example.locale-jurisdiction-gate@2.9.0
  - @contractspec/example.versioned-knowledge-base@2.9.0
  - @contractspec/example.analytics-dashboard@2.9.0
  - @contractspec/example.lifecycle-dashboard@2.9.0
  - @contractspec/example.service-business-os@2.9.0
  - @contractspec/example.content-generation@2.9.0
  - @contractspec/example.integration-stripe@2.9.0
  - @contractspec/example.kb-update-pipeline@2.9.0
  - @contractspec/example.openbanking-powens@2.9.0
  - @contractspec/example.learning-patterns@2.9.0
  - @contractspec/example.saas-boilerplate@2.9.0
  - @contractspec/example.integration-hub@2.9.0
  - @contractspec/example.knowledge-canon@2.9.0
  - @contractspec/example.personalization@2.9.0
  - @contractspec/example.voice-providers@2.9.0
  - @contractspec/example.wealth-snapshot@2.9.0
  - @contractspec/example.workflow-system@2.9.0
  - @contractspec/example.ai-support-bot@2.9.0
  - @contractspec/example.agent-console@2.9.0
  - @contractspec/example.lifecycle-cli@2.9.0
  - @contractspec/lib.example-shared-ui@2.9.0
  - @contractspec/example.crm-pipeline@2.9.0
  - @contractspec/example.marketplace@2.9.0
  - @contractspec/lib.runtime-sandbox@1.9.0
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/example.team-hub@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/example.agent-console@2.8.0
  - @contractspec/example.ai-support-bot@2.8.0
  - @contractspec/example.analytics-dashboard@2.8.0
  - @contractspec/example.content-generation@2.8.0
  - @contractspec/example.crm-pipeline@2.8.0
  - @contractspec/example.integration-hub@2.8.0
  - @contractspec/example.integration-stripe@2.8.0
  - @contractspec/example.kb-update-pipeline@2.8.0
  - @contractspec/example.knowledge-canon@2.8.0
  - @contractspec/example.learning-journey-ambient-coach@2.8.0
  - @contractspec/example.learning-journey-crm-onboarding@2.8.0
  - @contractspec/example.learning-journey-duo-drills@2.8.0
  - @contractspec/example.learning-journey-platform-tour@2.8.0
  - @contractspec/example.learning-journey-quest-challenges@2.8.0
  - @contractspec/example.learning-journey-registry@2.8.0
  - @contractspec/example.learning-journey-studio-onboarding@2.8.0
  - @contractspec/example.learning-journey-ui-coaching@2.8.0
  - @contractspec/example.learning-journey-ui-gamified@2.8.0
  - @contractspec/example.learning-journey-ui-onboarding@2.8.0
  - @contractspec/example.learning-journey-ui-shared@2.8.0
  - @contractspec/example.learning-patterns@2.8.0
  - @contractspec/example.lifecycle-cli@2.8.0
  - @contractspec/example.lifecycle-dashboard@2.8.0
  - @contractspec/example.locale-jurisdiction-gate@2.8.0
  - @contractspec/example.marketplace@2.8.0
  - @contractspec/example.openbanking-powens@2.8.0
  - @contractspec/example.personalization@2.8.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.8.0
  - @contractspec/example.saas-boilerplate@2.8.0
  - @contractspec/example.service-business-os@2.8.0
  - @contractspec/example.team-hub@2.8.0
  - @contractspec/example.versioned-knowledge-base@2.8.0
  - @contractspec/example.voice-providers@2.8.0
  - @contractspec/example.wealth-snapshot@2.8.0
  - @contractspec/example.workflow-system@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.example-shared-ui@2.8.0
  - @contractspec/lib.runtime-sandbox@1.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/example.agent-console@2.7.0
  - @contractspec/example.ai-support-bot@2.7.0
  - @contractspec/example.analytics-dashboard@2.7.0
  - @contractspec/example.content-generation@2.7.0
  - @contractspec/example.crm-pipeline@2.7.0
  - @contractspec/example.integration-hub@2.7.0
  - @contractspec/example.integration-stripe@2.7.0
  - @contractspec/example.kb-update-pipeline@2.7.0
  - @contractspec/example.knowledge-canon@2.7.0
  - @contractspec/example.learning-journey-ambient-coach@2.7.0
  - @contractspec/example.learning-journey-crm-onboarding@2.7.0
  - @contractspec/example.learning-journey-duo-drills@2.7.0
  - @contractspec/example.learning-journey-platform-tour@2.7.0
  - @contractspec/example.learning-journey-quest-challenges@2.7.0
  - @contractspec/example.learning-journey-registry@2.7.0
  - @contractspec/example.learning-journey-studio-onboarding@2.7.0
  - @contractspec/example.learning-journey-ui-coaching@2.7.0
  - @contractspec/example.learning-journey-ui-gamified@2.7.0
  - @contractspec/example.learning-journey-ui-onboarding@2.7.0
  - @contractspec/example.learning-journey-ui-shared@2.7.0
  - @contractspec/example.learning-patterns@2.7.0
  - @contractspec/example.lifecycle-cli@2.7.0
  - @contractspec/example.lifecycle-dashboard@2.7.0
  - @contractspec/example.locale-jurisdiction-gate@2.7.0
  - @contractspec/example.marketplace@2.7.0
  - @contractspec/example.openbanking-powens@2.7.0
  - @contractspec/example.personalization@2.7.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.7.0
  - @contractspec/example.saas-boilerplate@2.7.0
  - @contractspec/example.service-business-os@2.7.0
  - @contractspec/example.team-hub@2.7.0
  - @contractspec/example.versioned-knowledge-base@2.7.0
  - @contractspec/example.voice-providers@2.7.0
  - @contractspec/example.wealth-snapshot@2.7.0
  - @contractspec/example.workflow-system@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.example-shared-ui@2.7.0
  - @contractspec/lib.runtime-sandbox@1.7.0

## 2.6.1

### Patch Changes

- @contractspec/example.agent-console@2.6.1
- @contractspec/example.analytics-dashboard@2.6.1
- @contractspec/example.crm-pipeline@2.6.1
- @contractspec/example.integration-hub@2.6.1
- @contractspec/example.learning-journey-ui-coaching@2.6.1
- @contractspec/example.learning-journey-ui-gamified@2.6.1
- @contractspec/example.learning-journey-ui-onboarding@2.6.1
- @contractspec/example.learning-journey-ui-shared@2.6.1
- @contractspec/example.marketplace@2.6.1
- @contractspec/example.policy-safe-knowledge-assistant@2.6.1
- @contractspec/example.saas-boilerplate@2.6.1
- @contractspec/example.workflow-system@2.6.1
- @contractspec/lib.example-shared-ui@2.6.1
- @contractspec/example.learning-journey-crm-onboarding@2.6.1
- @contractspec/example.learning-journey-registry@2.6.1

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/example.agent-console@2.6.0
  - @contractspec/example.ai-support-bot@2.6.0
  - @contractspec/example.analytics-dashboard@2.6.0
  - @contractspec/example.content-generation@2.6.0
  - @contractspec/example.crm-pipeline@2.6.0
  - @contractspec/example.integration-hub@2.6.0
  - @contractspec/example.integration-stripe@2.6.0
  - @contractspec/example.kb-update-pipeline@2.6.0
  - @contractspec/example.knowledge-canon@2.6.0
  - @contractspec/example.learning-journey-ambient-coach@2.6.0
  - @contractspec/example.learning-journey-crm-onboarding@2.6.0
  - @contractspec/example.learning-journey-duo-drills@2.6.0
  - @contractspec/example.learning-journey-platform-tour@2.6.0
  - @contractspec/example.learning-journey-quest-challenges@2.6.0
  - @contractspec/example.learning-journey-registry@2.6.0
  - @contractspec/example.learning-journey-studio-onboarding@2.6.0
  - @contractspec/example.learning-journey-ui-coaching@2.6.0
  - @contractspec/example.learning-journey-ui-gamified@2.6.0
  - @contractspec/example.learning-journey-ui-onboarding@2.6.0
  - @contractspec/example.learning-journey-ui-shared@2.6.0
  - @contractspec/example.learning-patterns@2.6.0
  - @contractspec/example.lifecycle-cli@2.6.0
  - @contractspec/example.lifecycle-dashboard@2.6.0
  - @contractspec/example.locale-jurisdiction-gate@2.6.0
  - @contractspec/example.marketplace@2.6.0
  - @contractspec/example.openbanking-powens@2.6.0
  - @contractspec/example.personalization@2.6.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.6.0
  - @contractspec/example.saas-boilerplate@2.6.0
  - @contractspec/example.service-business-os@2.6.0
  - @contractspec/example.team-hub@2.6.0
  - @contractspec/example.versioned-knowledge-base@2.6.0
  - @contractspec/example.voice-providers@2.6.0
  - @contractspec/example.wealth-snapshot@2.6.0
  - @contractspec/example.workflow-system@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.example-shared-ui@2.6.0
  - @contractspec/lib.runtime-sandbox@1.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/example.learning-journey-studio-onboarding@2.5.0
  - @contractspec/example.learning-journey-quest-challenges@2.5.0
  - @contractspec/example.learning-journey-crm-onboarding@2.5.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.5.0
  - @contractspec/example.learning-journey-ambient-coach@2.5.0
  - @contractspec/example.learning-journey-platform-tour@2.5.0
  - @contractspec/example.learning-journey-ui-onboarding@2.5.0
  - @contractspec/example.learning-journey-ui-coaching@2.5.0
  - @contractspec/example.learning-journey-ui-gamified@2.5.0
  - @contractspec/example.learning-journey-duo-drills@2.5.0
  - @contractspec/example.learning-journey-ui-shared@2.5.0
  - @contractspec/example.learning-journey-registry@2.5.0
  - @contractspec/example.locale-jurisdiction-gate@2.5.0
  - @contractspec/example.versioned-knowledge-base@2.5.0
  - @contractspec/example.analytics-dashboard@2.5.0
  - @contractspec/example.lifecycle-dashboard@2.5.0
  - @contractspec/example.service-business-os@2.5.0
  - @contractspec/example.content-generation@2.5.0
  - @contractspec/example.integration-stripe@2.5.0
  - @contractspec/example.kb-update-pipeline@2.5.0
  - @contractspec/example.openbanking-powens@2.5.0
  - @contractspec/example.learning-patterns@2.5.0
  - @contractspec/example.saas-boilerplate@2.5.0
  - @contractspec/example.integration-hub@2.5.0
  - @contractspec/example.knowledge-canon@2.5.0
  - @contractspec/example.personalization@2.5.0
  - @contractspec/example.voice-providers@2.5.0
  - @contractspec/example.wealth-snapshot@2.5.0
  - @contractspec/example.workflow-system@2.5.0
  - @contractspec/example.ai-support-bot@2.5.0
  - @contractspec/example.agent-console@2.5.0
  - @contractspec/example.lifecycle-cli@2.5.0
  - @contractspec/lib.example-shared-ui@2.5.0
  - @contractspec/example.crm-pipeline@2.5.0
  - @contractspec/example.marketplace@2.5.0
  - @contractspec/lib.runtime-sandbox@1.5.0
  - @contractspec/example.team-hub@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@2.4.0
  - @contractspec/example.learning-journey-quest-challenges@2.4.0
  - @contractspec/example.learning-journey-crm-onboarding@2.4.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.4.0
  - @contractspec/example.learning-journey-ambient-coach@2.4.0
  - @contractspec/example.learning-journey-platform-tour@2.4.0
  - @contractspec/example.learning-journey-ui-onboarding@2.4.0
  - @contractspec/example.learning-journey-ui-coaching@2.4.0
  - @contractspec/example.learning-journey-ui-gamified@2.4.0
  - @contractspec/example.learning-journey-duo-drills@2.4.0
  - @contractspec/example.learning-journey-ui-shared@2.4.0
  - @contractspec/example.learning-journey-registry@2.4.0
  - @contractspec/example.locale-jurisdiction-gate@2.4.0
  - @contractspec/example.versioned-knowledge-base@2.4.0
  - @contractspec/example.analytics-dashboard@2.4.0
  - @contractspec/example.lifecycle-dashboard@2.4.0
  - @contractspec/example.service-business-os@2.4.0
  - @contractspec/example.content-generation@2.4.0
  - @contractspec/example.integration-stripe@2.4.0
  - @contractspec/example.kb-update-pipeline@2.4.0
  - @contractspec/example.openbanking-powens@2.4.0
  - @contractspec/example.learning-patterns@2.4.0
  - @contractspec/example.saas-boilerplate@2.4.0
  - @contractspec/example.integration-hub@2.4.0
  - @contractspec/example.knowledge-canon@2.4.0
  - @contractspec/example.personalization@2.4.0
  - @contractspec/example.voice-providers@2.4.0
  - @contractspec/example.wealth-snapshot@2.4.0
  - @contractspec/example.workflow-system@2.4.0
  - @contractspec/example.ai-support-bot@2.4.0
  - @contractspec/example.agent-console@2.4.0
  - @contractspec/example.lifecycle-cli@2.4.0
  - @contractspec/lib.example-shared-ui@2.4.0
  - @contractspec/example.crm-pipeline@2.4.0
  - @contractspec/example.marketplace@2.4.0
  - @contractspec/lib.runtime-sandbox@1.4.0
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/example.team-hub@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/example.learning-journey-studio-onboarding@2.3.0
  - @contractspec/example.learning-journey-quest-challenges@2.3.0
  - @contractspec/example.learning-journey-crm-onboarding@2.3.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.3.0
  - @contractspec/example.learning-journey-ambient-coach@2.3.0
  - @contractspec/example.learning-journey-platform-tour@2.3.0
  - @contractspec/example.learning-journey-ui-onboarding@2.3.0
  - @contractspec/example.learning-journey-ui-coaching@2.3.0
  - @contractspec/example.learning-journey-ui-gamified@2.3.0
  - @contractspec/example.learning-journey-duo-drills@2.3.0
  - @contractspec/example.learning-journey-ui-shared@2.3.0
  - @contractspec/example.learning-journey-registry@2.3.0
  - @contractspec/example.locale-jurisdiction-gate@2.3.0
  - @contractspec/example.versioned-knowledge-base@2.3.0
  - @contractspec/example.analytics-dashboard@2.3.0
  - @contractspec/example.lifecycle-dashboard@2.3.0
  - @contractspec/example.service-business-os@2.3.0
  - @contractspec/example.content-generation@2.3.0
  - @contractspec/example.integration-stripe@2.3.0
  - @contractspec/example.kb-update-pipeline@2.3.0
  - @contractspec/example.openbanking-powens@2.3.0
  - @contractspec/example.learning-patterns@2.3.0
  - @contractspec/example.saas-boilerplate@2.3.0
  - @contractspec/example.integration-hub@2.3.0
  - @contractspec/example.knowledge-canon@2.3.0
  - @contractspec/example.personalization@2.3.0
  - @contractspec/example.voice-providers@2.3.0
  - @contractspec/example.wealth-snapshot@2.3.0
  - @contractspec/example.workflow-system@2.3.0
  - @contractspec/example.ai-support-bot@2.3.0
  - @contractspec/example.agent-console@2.3.0
  - @contractspec/example.lifecycle-cli@2.3.0
  - @contractspec/lib.example-shared-ui@2.3.0
  - @contractspec/example.crm-pipeline@2.3.0
  - @contractspec/example.marketplace@2.3.0
  - @contractspec/lib.runtime-sandbox@1.3.0
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/example.team-hub@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@2.2.0
  - @contractspec/example.learning-journey-quest-challenges@2.2.0
  - @contractspec/example.learning-journey-crm-onboarding@2.2.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.2.0
  - @contractspec/example.learning-journey-ambient-coach@2.2.0
  - @contractspec/example.learning-journey-platform-tour@2.2.0
  - @contractspec/example.learning-journey-ui-onboarding@2.2.0
  - @contractspec/example.learning-journey-ui-coaching@2.2.0
  - @contractspec/example.learning-journey-ui-gamified@2.2.0
  - @contractspec/example.learning-journey-duo-drills@2.2.0
  - @contractspec/example.learning-journey-ui-shared@2.2.0
  - @contractspec/example.learning-journey-registry@2.2.0
  - @contractspec/example.locale-jurisdiction-gate@2.2.0
  - @contractspec/example.versioned-knowledge-base@2.2.0
  - @contractspec/example.analytics-dashboard@2.2.0
  - @contractspec/example.lifecycle-dashboard@2.2.0
  - @contractspec/example.service-business-os@2.2.0
  - @contractspec/example.content-generation@2.2.0
  - @contractspec/example.integration-stripe@2.2.0
  - @contractspec/example.kb-update-pipeline@2.2.0
  - @contractspec/example.openbanking-powens@2.2.0
  - @contractspec/example.learning-patterns@2.2.0
  - @contractspec/example.saas-boilerplate@2.2.0
  - @contractspec/example.integration-hub@2.2.0
  - @contractspec/example.knowledge-canon@2.2.0
  - @contractspec/example.personalization@2.2.0
  - @contractspec/example.voice-providers@2.2.0
  - @contractspec/example.wealth-snapshot@2.2.0
  - @contractspec/example.workflow-system@2.2.0
  - @contractspec/example.ai-support-bot@2.2.0
  - @contractspec/example.agent-console@2.2.0
  - @contractspec/example.lifecycle-cli@2.2.0
  - @contractspec/lib.example-shared-ui@2.2.0
  - @contractspec/example.crm-pipeline@2.2.0
  - @contractspec/example.marketplace@2.2.0
  - @contractspec/lib.runtime-sandbox@1.2.0
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/example.team-hub@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/example.agent-console@2.1.1
  - @contractspec/example.ai-support-bot@2.1.1
  - @contractspec/example.analytics-dashboard@2.1.1
  - @contractspec/example.content-generation@2.1.1
  - @contractspec/example.crm-pipeline@2.1.1
  - @contractspec/example.integration-hub@2.1.1
  - @contractspec/example.integration-stripe@2.1.1
  - @contractspec/example.kb-update-pipeline@2.1.1
  - @contractspec/example.knowledge-canon@2.1.1
  - @contractspec/example.learning-journey-ambient-coach@2.1.1
  - @contractspec/example.learning-journey-crm-onboarding@2.1.1
  - @contractspec/example.learning-journey-duo-drills@2.1.1
  - @contractspec/example.learning-journey-platform-tour@2.1.1
  - @contractspec/example.learning-journey-quest-challenges@2.1.1
  - @contractspec/example.learning-journey-registry@2.1.1
  - @contractspec/example.learning-journey-studio-onboarding@2.1.1
  - @contractspec/example.learning-journey-ui-coaching@2.1.1
  - @contractspec/example.learning-journey-ui-gamified@2.1.1
  - @contractspec/example.learning-journey-ui-onboarding@2.1.1
  - @contractspec/example.learning-journey-ui-shared@2.1.1
  - @contractspec/example.learning-patterns@2.1.1
  - @contractspec/example.lifecycle-cli@2.1.1
  - @contractspec/example.lifecycle-dashboard@2.1.1
  - @contractspec/example.locale-jurisdiction-gate@2.1.1
  - @contractspec/example.marketplace@2.1.1
  - @contractspec/example.openbanking-powens@2.1.1
  - @contractspec/example.personalization@2.1.1
  - @contractspec/example.policy-safe-knowledge-assistant@2.1.1
  - @contractspec/example.saas-boilerplate@2.1.1
  - @contractspec/example.service-business-os@2.1.1
  - @contractspec/example.team-hub@2.1.1
  - @contractspec/example.versioned-knowledge-base@2.1.1
  - @contractspec/example.voice-providers@2.1.1
  - @contractspec/example.wealth-snapshot@2.1.1
  - @contractspec/example.workflow-system@2.1.1
  - @contractspec/lib.example-shared-ui@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/example.learning-journey-studio-onboarding@2.1.0
  - @contractspec/example.learning-journey-quest-challenges@2.1.0
  - @contractspec/example.learning-journey-crm-onboarding@2.1.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.1.0
  - @contractspec/example.learning-journey-ambient-coach@2.1.0
  - @contractspec/example.learning-journey-platform-tour@2.1.0
  - @contractspec/example.learning-journey-ui-onboarding@2.1.0
  - @contractspec/example.learning-journey-ui-coaching@2.1.0
  - @contractspec/example.learning-journey-ui-gamified@2.1.0
  - @contractspec/example.learning-journey-duo-drills@2.1.0
  - @contractspec/example.learning-journey-ui-shared@2.1.0
  - @contractspec/example.learning-journey-registry@2.1.0
  - @contractspec/example.locale-jurisdiction-gate@2.1.0
  - @contractspec/example.versioned-knowledge-base@2.1.0
  - @contractspec/example.analytics-dashboard@2.1.0
  - @contractspec/example.lifecycle-dashboard@2.1.0
  - @contractspec/example.service-business-os@2.1.0
  - @contractspec/example.content-generation@2.1.0
  - @contractspec/example.integration-stripe@2.1.0
  - @contractspec/example.kb-update-pipeline@2.1.0
  - @contractspec/example.openbanking-powens@2.1.0
  - @contractspec/example.learning-patterns@2.1.0
  - @contractspec/example.saas-boilerplate@2.1.0
  - @contractspec/example.integration-hub@2.1.0
  - @contractspec/example.knowledge-canon@2.1.0
  - @contractspec/example.personalization@2.1.0
  - @contractspec/example.voice-providers@2.1.0
  - @contractspec/example.wealth-snapshot@2.1.0
  - @contractspec/example.workflow-system@2.1.0
  - @contractspec/example.ai-support-bot@2.1.0
  - @contractspec/example.agent-console@2.1.0
  - @contractspec/example.lifecycle-cli@2.1.0
  - @contractspec/lib.example-shared-ui@2.1.0
  - @contractspec/example.crm-pipeline@2.1.0
  - @contractspec/example.marketplace@2.1.0
  - @contractspec/lib.runtime-sandbox@1.1.0
  - @contractspec/example.team-hub@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [f152678]
- Updated dependencies [7f3203a]
  - @contractspec/example.learning-journey-studio-onboarding@2.0.0
  - @contractspec/example.learning-journey-quest-challenges@2.0.0
  - @contractspec/example.learning-journey-crm-onboarding@2.0.0
  - @contractspec/example.policy-safe-knowledge-assistant@2.0.0
  - @contractspec/example.learning-journey-ambient-coach@2.0.0
  - @contractspec/example.learning-journey-platform-tour@2.0.0
  - @contractspec/example.learning-journey-ui-onboarding@2.0.0
  - @contractspec/example.learning-journey-ui-coaching@2.0.0
  - @contractspec/example.learning-journey-ui-gamified@2.0.0
  - @contractspec/example.learning-journey-duo-drills@2.0.0
  - @contractspec/example.learning-journey-ui-shared@2.0.0
  - @contractspec/example.learning-journey-registry@2.0.0
  - @contractspec/example.locale-jurisdiction-gate@2.0.0
  - @contractspec/example.versioned-knowledge-base@2.0.0
  - @contractspec/example.analytics-dashboard@2.0.0
  - @contractspec/example.lifecycle-dashboard@2.0.0
  - @contractspec/example.service-business-os@2.0.0
  - @contractspec/example.content-generation@2.0.0
  - @contractspec/example.integration-stripe@2.0.0
  - @contractspec/example.kb-update-pipeline@2.0.0
  - @contractspec/example.openbanking-powens@2.0.0
  - @contractspec/example.learning-patterns@2.0.0
  - @contractspec/example.saas-boilerplate@2.0.0
  - @contractspec/example.integration-hub@2.0.0
  - @contractspec/example.knowledge-canon@2.0.0
  - @contractspec/example.personalization@2.0.0
  - @contractspec/example.voice-providers@2.0.0
  - @contractspec/example.wealth-snapshot@2.0.0
  - @contractspec/example.workflow-system@2.0.0
  - @contractspec/example.ai-support-bot@2.0.0
  - @contractspec/example.agent-console@2.0.0
  - @contractspec/example.lifecycle-cli@2.0.0
  - @contractspec/lib.example-shared-ui@2.0.0
  - @contractspec/example.crm-pipeline@2.0.0
  - @contractspec/example.marketplace@2.0.0
  - @contractspec/lib.runtime-sandbox@1.0.0
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/example.team-hub@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/example.learning-journey-studio-onboarding@1.62.0
  - @contractspec/example.learning-journey-quest-challenges@1.62.0
  - @contractspec/example.learning-journey-crm-onboarding@1.62.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.62.0
  - @contractspec/example.learning-journey-ambient-coach@1.62.0
  - @contractspec/example.learning-journey-platform-tour@1.62.0
  - @contractspec/example.learning-journey-ui-onboarding@1.62.0
  - @contractspec/example.learning-journey-ui-coaching@1.62.0
  - @contractspec/example.learning-journey-ui-gamified@1.62.0
  - @contractspec/example.learning-journey-duo-drills@1.62.0
  - @contractspec/example.learning-journey-ui-shared@1.62.0
  - @contractspec/example.learning-journey-registry@1.62.0
  - @contractspec/example.locale-jurisdiction-gate@1.62.0
  - @contractspec/example.versioned-knowledge-base@1.62.0
  - @contractspec/example.analytics-dashboard@1.62.0
  - @contractspec/example.lifecycle-dashboard@1.62.0
  - @contractspec/example.service-business-os@1.62.0
  - @contractspec/example.content-generation@1.62.0
  - @contractspec/example.integration-stripe@1.62.0
  - @contractspec/example.kb-update-pipeline@1.62.0
  - @contractspec/example.openbanking-powens@1.62.0
  - @contractspec/example.learning-patterns@1.62.0
  - @contractspec/example.saas-boilerplate@1.62.0
  - @contractspec/example.integration-hub@1.62.0
  - @contractspec/example.knowledge-canon@1.62.0
  - @contractspec/example.personalization@1.62.0
  - @contractspec/example.voice-providers@1.62.0
  - @contractspec/example.wealth-snapshot@1.62.0
  - @contractspec/example.workflow-system@1.62.0
  - @contractspec/example.ai-support-bot@1.62.0
  - @contractspec/example.agent-console@1.62.0
  - @contractspec/example.lifecycle-cli@1.62.0
  - @contractspec/lib.example-shared-ui@1.16.0
  - @contractspec/example.crm-pipeline@1.62.0
  - @contractspec/example.marketplace@1.62.0
  - @contractspec/lib.runtime-sandbox@0.17.0
  - @contractspec/example.team-hub@1.62.0
  - @contractspec/lib.contracts@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/example.learning-journey-studio-onboarding@1.61.0
  - @contractspec/example.learning-journey-quest-challenges@1.61.0
  - @contractspec/example.learning-journey-crm-onboarding@1.61.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.61.0
  - @contractspec/example.learning-journey-ambient-coach@1.61.0
  - @contractspec/example.learning-journey-platform-tour@1.61.0
  - @contractspec/example.learning-journey-ui-onboarding@1.61.0
  - @contractspec/example.learning-journey-ui-coaching@1.61.0
  - @contractspec/example.learning-journey-ui-gamified@1.61.0
  - @contractspec/example.learning-journey-duo-drills@1.61.0
  - @contractspec/example.learning-journey-ui-shared@1.61.0
  - @contractspec/example.learning-journey-registry@1.61.0
  - @contractspec/example.locale-jurisdiction-gate@1.61.0
  - @contractspec/example.versioned-knowledge-base@1.61.0
  - @contractspec/example.analytics-dashboard@1.61.0
  - @contractspec/example.lifecycle-dashboard@1.61.0
  - @contractspec/example.service-business-os@1.61.0
  - @contractspec/example.content-generation@1.61.0
  - @contractspec/example.integration-stripe@1.61.0
  - @contractspec/example.kb-update-pipeline@1.61.0
  - @contractspec/example.openbanking-powens@1.61.0
  - @contractspec/example.learning-patterns@1.61.0
  - @contractspec/example.saas-boilerplate@1.61.0
  - @contractspec/example.integration-hub@1.61.0
  - @contractspec/example.knowledge-canon@1.61.0
  - @contractspec/example.personalization@1.61.0
  - @contractspec/example.voice-providers@1.61.0
  - @contractspec/example.wealth-snapshot@1.61.0
  - @contractspec/example.workflow-system@1.61.0
  - @contractspec/example.ai-support-bot@1.61.0
  - @contractspec/example.agent-console@1.61.0
  - @contractspec/example.lifecycle-cli@1.61.0
  - @contractspec/lib.example-shared-ui@1.15.0
  - @contractspec/example.crm-pipeline@1.61.0
  - @contractspec/example.marketplace@1.61.0
  - @contractspec/lib.runtime-sandbox@0.16.0
  - @contractspec/example.team-hub@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@1.60.0
  - @contractspec/example.learning-journey-quest-challenges@1.60.0
  - @contractspec/example.learning-journey-crm-onboarding@1.60.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.60.0
  - @contractspec/example.learning-journey-ambient-coach@1.60.0
  - @contractspec/example.learning-journey-platform-tour@1.60.0
  - @contractspec/example.learning-journey-ui-onboarding@1.60.0
  - @contractspec/example.learning-journey-ui-coaching@1.60.0
  - @contractspec/example.learning-journey-ui-gamified@1.60.0
  - @contractspec/example.learning-journey-duo-drills@1.60.0
  - @contractspec/example.learning-journey-ui-shared@1.60.0
  - @contractspec/example.learning-journey-registry@1.60.0
  - @contractspec/example.locale-jurisdiction-gate@1.60.0
  - @contractspec/example.versioned-knowledge-base@1.60.0
  - @contractspec/example.analytics-dashboard@1.60.0
  - @contractspec/example.lifecycle-dashboard@1.60.0
  - @contractspec/example.service-business-os@1.60.0
  - @contractspec/example.content-generation@1.60.0
  - @contractspec/example.integration-stripe@1.60.0
  - @contractspec/example.kb-update-pipeline@1.60.0
  - @contractspec/example.openbanking-powens@1.60.0
  - @contractspec/example.learning-patterns@1.60.0
  - @contractspec/example.saas-boilerplate@1.60.0
  - @contractspec/example.integration-hub@1.60.0
  - @contractspec/example.knowledge-canon@1.60.0
  - @contractspec/example.personalization@1.60.0
  - @contractspec/example.voice-providers@1.60.0
  - @contractspec/example.wealth-snapshot@1.60.0
  - @contractspec/example.workflow-system@1.60.0
  - @contractspec/example.ai-support-bot@1.60.0
  - @contractspec/example.agent-console@1.60.0
  - @contractspec/example.lifecycle-cli@1.60.0
  - @contractspec/lib.example-shared-ui@1.14.0
  - @contractspec/example.crm-pipeline@1.60.0
  - @contractspec/example.marketplace@1.60.0
  - @contractspec/lib.runtime-sandbox@0.15.0
  - @contractspec/example.team-hub@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/example.learning-journey-studio-onboarding@1.59.0
  - @contractspec/example.learning-journey-quest-challenges@1.59.0
  - @contractspec/example.learning-journey-crm-onboarding@1.59.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.59.0
  - @contractspec/example.learning-journey-ambient-coach@1.59.0
  - @contractspec/example.learning-journey-platform-tour@1.59.0
  - @contractspec/example.learning-journey-ui-onboarding@1.59.0
  - @contractspec/example.learning-journey-ui-coaching@1.59.0
  - @contractspec/example.learning-journey-ui-gamified@1.59.0
  - @contractspec/example.learning-journey-duo-drills@1.59.0
  - @contractspec/example.learning-journey-ui-shared@1.59.0
  - @contractspec/example.learning-journey-registry@1.59.0
  - @contractspec/example.locale-jurisdiction-gate@1.59.0
  - @contractspec/example.versioned-knowledge-base@1.59.0
  - @contractspec/example.analytics-dashboard@1.59.0
  - @contractspec/example.lifecycle-dashboard@1.59.0
  - @contractspec/example.service-business-os@1.59.0
  - @contractspec/example.content-generation@1.59.0
  - @contractspec/example.integration-stripe@1.59.0
  - @contractspec/example.kb-update-pipeline@1.59.0
  - @contractspec/example.openbanking-powens@1.59.0
  - @contractspec/example.learning-patterns@1.59.0
  - @contractspec/example.saas-boilerplate@1.59.0
  - @contractspec/example.integration-hub@1.59.0
  - @contractspec/example.knowledge-canon@1.59.0
  - @contractspec/example.personalization@1.59.0
  - @contractspec/example.voice-providers@1.59.0
  - @contractspec/example.wealth-snapshot@1.59.0
  - @contractspec/example.workflow-system@1.59.0
  - @contractspec/example.ai-support-bot@1.59.0
  - @contractspec/example.agent-console@1.59.0
  - @contractspec/example.lifecycle-cli@1.59.0
  - @contractspec/lib.example-shared-ui@1.13.0
  - @contractspec/example.crm-pipeline@1.59.0
  - @contractspec/example.marketplace@1.59.0
  - @contractspec/lib.runtime-sandbox@0.14.0
  - @contractspec/example.team-hub@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/example.learning-journey-studio-onboarding@1.58.0
  - @contractspec/example.learning-journey-quest-challenges@1.58.0
  - @contractspec/example.learning-journey-crm-onboarding@1.58.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.58.0
  - @contractspec/example.learning-journey-ambient-coach@1.58.0
  - @contractspec/example.learning-journey-platform-tour@1.58.0
  - @contractspec/example.learning-journey-ui-onboarding@1.58.0
  - @contractspec/example.learning-journey-ui-coaching@1.58.0
  - @contractspec/example.learning-journey-ui-gamified@1.58.0
  - @contractspec/example.learning-journey-duo-drills@1.58.0
  - @contractspec/example.learning-journey-ui-shared@1.58.0
  - @contractspec/example.learning-journey-registry@1.58.0
  - @contractspec/example.locale-jurisdiction-gate@1.58.0
  - @contractspec/example.versioned-knowledge-base@1.58.0
  - @contractspec/example.analytics-dashboard@1.58.0
  - @contractspec/example.lifecycle-dashboard@1.58.0
  - @contractspec/example.service-business-os@1.58.0
  - @contractspec/example.content-generation@1.58.0
  - @contractspec/example.integration-stripe@1.58.0
  - @contractspec/example.kb-update-pipeline@1.58.0
  - @contractspec/example.openbanking-powens@1.58.0
  - @contractspec/example.learning-patterns@1.58.0
  - @contractspec/example.saas-boilerplate@1.58.0
  - @contractspec/example.integration-hub@1.58.0
  - @contractspec/example.knowledge-canon@1.58.0
  - @contractspec/example.personalization@1.58.0
  - @contractspec/example.voice-providers@1.58.0
  - @contractspec/example.wealth-snapshot@1.58.0
  - @contractspec/example.workflow-system@1.58.0
  - @contractspec/example.ai-support-bot@1.58.0
  - @contractspec/example.agent-console@1.58.0
  - @contractspec/example.lifecycle-cli@1.58.0
  - @contractspec/lib.example-shared-ui@1.12.0
  - @contractspec/example.crm-pipeline@1.58.0
  - @contractspec/example.marketplace@1.58.0
  - @contractspec/lib.runtime-sandbox@0.13.0
  - @contractspec/example.team-hub@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0

## 1.57.0

### Minor Changes

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
  - @contractspec/example.analytics-dashboard@1.57.0
  - @contractspec/example.integration-hub@1.57.0
  - @contractspec/example.voice-providers@1.57.0
  - @contractspec/example.saas-boilerplate@1.57.0
  - @contractspec/example.crm-pipeline@1.57.0
  - @contractspec/example.learning-journey-studio-onboarding@1.57.0
  - @contractspec/example.learning-journey-quest-challenges@1.57.0
  - @contractspec/example.learning-journey-crm-onboarding@1.57.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.57.0
  - @contractspec/example.learning-journey-ambient-coach@1.57.0
  - @contractspec/example.learning-journey-platform-tour@1.57.0
  - @contractspec/example.learning-journey-ui-onboarding@1.57.0
  - @contractspec/example.learning-journey-ui-coaching@1.57.0
  - @contractspec/example.learning-journey-ui-gamified@1.57.0
  - @contractspec/example.learning-journey-duo-drills@1.57.0
  - @contractspec/example.learning-journey-ui-shared@1.57.0
  - @contractspec/example.learning-journey-registry@1.57.0
  - @contractspec/example.locale-jurisdiction-gate@1.57.0
  - @contractspec/example.versioned-knowledge-base@1.57.0
  - @contractspec/example.lifecycle-dashboard@1.57.0
  - @contractspec/example.service-business-os@1.57.0
  - @contractspec/example.content-generation@1.57.0
  - @contractspec/example.integration-stripe@1.57.0
  - @contractspec/example.kb-update-pipeline@1.57.0
  - @contractspec/example.openbanking-powens@1.57.0
  - @contractspec/example.learning-patterns@1.57.0
  - @contractspec/example.knowledge-canon@1.57.0
  - @contractspec/example.personalization@1.57.0
  - @contractspec/example.wealth-snapshot@1.57.0
  - @contractspec/example.workflow-system@1.57.0
  - @contractspec/example.ai-support-bot@1.57.0
  - @contractspec/example.agent-console@1.57.0
  - @contractspec/example.lifecycle-cli@1.57.0
  - @contractspec/lib.example-shared-ui@1.11.0
  - @contractspec/example.marketplace@1.57.0
  - @contractspec/lib.runtime-sandbox@0.12.0
  - @contractspec/example.team-hub@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@1.56.1
  - @contractspec/example.learning-journey-quest-challenges@1.56.1
  - @contractspec/example.learning-journey-crm-onboarding@1.56.1
  - @contractspec/example.policy-safe-knowledge-assistant@1.56.1
  - @contractspec/example.learning-journey-ambient-coach@1.56.1
  - @contractspec/example.learning-journey-platform-tour@1.56.1
  - @contractspec/example.learning-journey-ui-onboarding@1.56.1
  - @contractspec/example.learning-journey-ui-coaching@1.56.1
  - @contractspec/example.learning-journey-ui-gamified@1.56.1
  - @contractspec/example.learning-journey-duo-drills@1.56.1
  - @contractspec/example.learning-journey-ui-shared@1.56.1
  - @contractspec/example.learning-journey-registry@1.56.1
  - @contractspec/example.locale-jurisdiction-gate@1.56.1
  - @contractspec/example.versioned-knowledge-base@1.56.1
  - @contractspec/example.analytics-dashboard@1.56.1
  - @contractspec/example.lifecycle-dashboard@1.56.1
  - @contractspec/example.service-business-os@1.56.1
  - @contractspec/example.content-generation@1.56.1
  - @contractspec/example.integration-stripe@1.56.1
  - @contractspec/example.kb-update-pipeline@1.56.1
  - @contractspec/example.openbanking-powens@1.56.1
  - @contractspec/example.learning-patterns@1.56.1
  - @contractspec/example.saas-boilerplate@1.56.1
  - @contractspec/example.integration-hub@1.56.1
  - @contractspec/example.knowledge-canon@1.56.1
  - @contractspec/example.personalization@1.56.1
  - @contractspec/example.wealth-snapshot@1.56.1
  - @contractspec/example.workflow-system@1.56.1
  - @contractspec/example.ai-support-bot@1.56.1
  - @contractspec/example.agent-console@1.56.1
  - @contractspec/example.lifecycle-cli@1.56.1
  - @contractspec/lib.example-shared-ui@1.10.1
  - @contractspec/example.crm-pipeline@1.56.1
  - @contractspec/example.marketplace@1.56.1
  - @contractspec/lib.runtime-sandbox@0.11.1
  - @contractspec/example.team-hub@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@1.56.0
  - @contractspec/example.learning-journey-quest-challenges@1.56.0
  - @contractspec/example.learning-journey-crm-onboarding@1.56.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.56.0
  - @contractspec/example.learning-journey-ambient-coach@1.56.0
  - @contractspec/example.learning-journey-platform-tour@1.56.0
  - @contractspec/example.learning-journey-ui-onboarding@1.56.0
  - @contractspec/example.learning-journey-ui-coaching@1.56.0
  - @contractspec/example.learning-journey-ui-gamified@1.56.0
  - @contractspec/example.learning-journey-duo-drills@1.56.0
  - @contractspec/example.learning-journey-ui-shared@1.56.0
  - @contractspec/example.learning-journey-registry@1.56.0
  - @contractspec/example.locale-jurisdiction-gate@1.56.0
  - @contractspec/example.versioned-knowledge-base@1.56.0
  - @contractspec/example.analytics-dashboard@1.56.0
  - @contractspec/example.lifecycle-dashboard@1.56.0
  - @contractspec/example.service-business-os@1.56.0
  - @contractspec/example.content-generation@1.56.0
  - @contractspec/example.integration-stripe@1.56.0
  - @contractspec/example.kb-update-pipeline@1.56.0
  - @contractspec/example.openbanking-powens@1.56.0
  - @contractspec/example.learning-patterns@1.56.0
  - @contractspec/example.saas-boilerplate@1.56.0
  - @contractspec/example.integration-hub@1.56.0
  - @contractspec/example.knowledge-canon@1.56.0
  - @contractspec/example.personalization@1.56.0
  - @contractspec/example.wealth-snapshot@1.56.0
  - @contractspec/example.workflow-system@1.56.0
  - @contractspec/example.ai-support-bot@1.56.0
  - @contractspec/example.agent-console@1.56.0
  - @contractspec/example.lifecycle-cli@1.56.0
  - @contractspec/lib.example-shared-ui@1.10.0
  - @contractspec/example.crm-pipeline@1.56.0
  - @contractspec/example.marketplace@1.56.0
  - @contractspec/lib.runtime-sandbox@0.11.0
  - @contractspec/example.team-hub@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@1.55.0
  - @contractspec/example.learning-journey-quest-challenges@1.55.0
  - @contractspec/example.learning-journey-crm-onboarding@1.55.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.55.0
  - @contractspec/example.learning-journey-ambient-coach@1.55.0
  - @contractspec/example.learning-journey-platform-tour@1.55.0
  - @contractspec/example.learning-journey-ui-onboarding@1.55.0
  - @contractspec/example.learning-journey-ui-coaching@1.55.0
  - @contractspec/example.learning-journey-ui-gamified@1.55.0
  - @contractspec/example.learning-journey-duo-drills@1.55.0
  - @contractspec/example.learning-journey-ui-shared@1.55.0
  - @contractspec/example.learning-journey-registry@1.55.0
  - @contractspec/example.locale-jurisdiction-gate@1.55.0
  - @contractspec/example.versioned-knowledge-base@1.55.0
  - @contractspec/example.analytics-dashboard@1.55.0
  - @contractspec/example.lifecycle-dashboard@1.55.0
  - @contractspec/example.service-business-os@1.55.0
  - @contractspec/example.content-generation@1.55.0
  - @contractspec/example.integration-stripe@1.55.0
  - @contractspec/example.kb-update-pipeline@1.55.0
  - @contractspec/example.openbanking-powens@1.55.0
  - @contractspec/example.learning-patterns@1.55.0
  - @contractspec/example.saas-boilerplate@1.55.0
  - @contractspec/example.integration-hub@1.55.0
  - @contractspec/example.knowledge-canon@1.55.0
  - @contractspec/example.personalization@1.55.0
  - @contractspec/example.wealth-snapshot@1.55.0
  - @contractspec/example.workflow-system@1.55.0
  - @contractspec/example.ai-support-bot@1.55.0
  - @contractspec/example.agent-console@1.55.0
  - @contractspec/example.lifecycle-cli@1.55.0
  - @contractspec/lib.example-shared-ui@1.9.0
  - @contractspec/example.crm-pipeline@1.55.0
  - @contractspec/example.marketplace@1.55.0
  - @contractspec/lib.runtime-sandbox@0.10.0
  - @contractspec/example.team-hub@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/example.learning-journey-ui-onboarding@1.54.0
  - @contractspec/example.learning-journey-ui-coaching@1.54.0
  - @contractspec/example.learning-journey-ui-gamified@1.54.0
  - @contractspec/example.learning-journey-ui-shared@1.54.0
  - @contractspec/example.learning-journey-registry@1.54.0
  - @contractspec/lib.example-shared-ui@1.8.0
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/example.agent-console@1.54.0
  - @contractspec/example.ai-support-bot@1.54.0
  - @contractspec/example.analytics-dashboard@1.54.0
  - @contractspec/example.content-generation@1.54.0
  - @contractspec/example.crm-pipeline@1.54.0
  - @contractspec/example.integration-hub@1.54.0
  - @contractspec/example.integration-stripe@1.54.0
  - @contractspec/example.kb-update-pipeline@1.54.0
  - @contractspec/example.knowledge-canon@1.54.0
  - @contractspec/example.learning-journey-ambient-coach@1.54.0
  - @contractspec/example.learning-journey-crm-onboarding@1.54.0
  - @contractspec/example.learning-journey-duo-drills@1.54.0
  - @contractspec/example.learning-journey-platform-tour@1.54.0
  - @contractspec/example.learning-journey-quest-challenges@1.54.0
  - @contractspec/example.learning-journey-studio-onboarding@1.54.0
  - @contractspec/example.learning-patterns@1.54.0
  - @contractspec/example.lifecycle-cli@1.54.0
  - @contractspec/example.lifecycle-dashboard@1.54.0
  - @contractspec/example.locale-jurisdiction-gate@1.54.0
  - @contractspec/example.marketplace@1.54.0
  - @contractspec/example.openbanking-powens@1.54.0
  - @contractspec/example.personalization@1.54.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.54.0
  - @contractspec/example.saas-boilerplate@1.54.0
  - @contractspec/example.service-business-os@1.54.0
  - @contractspec/example.team-hub@1.54.0
  - @contractspec/example.versioned-knowledge-base@1.54.0
  - @contractspec/example.wealth-snapshot@1.54.0
  - @contractspec/example.workflow-system@1.54.0
  - @contractspec/lib.runtime-sandbox@0.9.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/example.analytics-dashboard@1.53.0
  - @contractspec/example.integration-hub@1.53.0
  - @contractspec/example.workflow-system@1.53.0
  - @contractspec/example.agent-console@1.53.0
  - @contractspec/example.crm-pipeline@1.53.0
  - @contractspec/example.marketplace@1.53.0
  - @contractspec/example.ai-support-bot@1.53.0
  - @contractspec/example.content-generation@1.53.0
  - @contractspec/example.integration-stripe@1.53.0
  - @contractspec/example.kb-update-pipeline@1.53.0
  - @contractspec/example.knowledge-canon@1.53.0
  - @contractspec/example.learning-journey-ambient-coach@1.53.0
  - @contractspec/example.learning-journey-crm-onboarding@1.53.0
  - @contractspec/example.learning-journey-duo-drills@1.53.0
  - @contractspec/example.learning-journey-platform-tour@1.53.0
  - @contractspec/example.learning-journey-quest-challenges@1.53.0
  - @contractspec/example.learning-journey-registry@1.53.0
  - @contractspec/example.learning-journey-studio-onboarding@1.53.0
  - @contractspec/example.learning-journey-ui-coaching@1.53.0
  - @contractspec/example.learning-journey-ui-gamified@1.53.0
  - @contractspec/example.learning-journey-ui-onboarding@1.53.0
  - @contractspec/example.learning-journey-ui-shared@1.53.0
  - @contractspec/example.learning-patterns@1.53.0
  - @contractspec/example.lifecycle-cli@1.53.0
  - @contractspec/example.lifecycle-dashboard@1.53.0
  - @contractspec/example.locale-jurisdiction-gate@1.53.0
  - @contractspec/example.openbanking-powens@1.53.0
  - @contractspec/example.personalization@1.53.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.53.0
  - @contractspec/example.saas-boilerplate@1.53.0
  - @contractspec/example.service-business-os@1.53.0
  - @contractspec/example.team-hub@1.53.0
  - @contractspec/example.versioned-knowledge-base@1.53.0
  - @contractspec/example.wealth-snapshot@1.53.0
  - @contractspec/lib.example-shared-ui@1.7.0
  - @contractspec/lib.runtime-sandbox@0.8.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/example.learning-journey-studio-onboarding@1.52.0
  - @contractspec/example.learning-journey-quest-challenges@1.52.0
  - @contractspec/example.learning-journey-crm-onboarding@1.52.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.52.0
  - @contractspec/example.learning-journey-ambient-coach@1.52.0
  - @contractspec/example.learning-journey-platform-tour@1.52.0
  - @contractspec/example.learning-journey-ui-onboarding@1.52.0
  - @contractspec/example.learning-journey-ui-coaching@1.52.0
  - @contractspec/example.learning-journey-ui-gamified@1.52.0
  - @contractspec/example.learning-journey-duo-drills@1.52.0
  - @contractspec/example.learning-journey-ui-shared@1.52.0
  - @contractspec/example.learning-journey-registry@1.52.0
  - @contractspec/example.locale-jurisdiction-gate@1.52.0
  - @contractspec/example.versioned-knowledge-base@1.52.0
  - @contractspec/example.analytics-dashboard@1.52.0
  - @contractspec/example.lifecycle-dashboard@1.52.0
  - @contractspec/example.service-business-os@1.52.0
  - @contractspec/example.content-generation@1.52.0
  - @contractspec/example.integration-stripe@1.52.0
  - @contractspec/example.kb-update-pipeline@1.52.0
  - @contractspec/example.openbanking-powens@1.52.0
  - @contractspec/example.learning-patterns@1.52.0
  - @contractspec/example.saas-boilerplate@1.52.0
  - @contractspec/example.integration-hub@1.52.0
  - @contractspec/example.knowledge-canon@1.52.0
  - @contractspec/example.personalization@1.52.0
  - @contractspec/example.wealth-snapshot@1.52.0
  - @contractspec/example.workflow-system@1.52.0
  - @contractspec/example.ai-support-bot@1.52.0
  - @contractspec/example.agent-console@1.52.0
  - @contractspec/example.lifecycle-cli@1.52.0
  - @contractspec/lib.example-shared-ui@1.6.0
  - @contractspec/example.crm-pipeline@1.52.0
  - @contractspec/example.marketplace@1.52.0
  - @contractspec/lib.runtime-sandbox@0.7.0
  - @contractspec/example.team-hub@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/example.learning-journey-studio-onboarding@1.51.0
  - @contractspec/example.learning-journey-quest-challenges@1.51.0
  - @contractspec/example.learning-journey-crm-onboarding@1.51.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.51.0
  - @contractspec/example.learning-journey-ambient-coach@1.51.0
  - @contractspec/example.learning-journey-platform-tour@1.51.0
  - @contractspec/example.learning-journey-ui-onboarding@1.51.0
  - @contractspec/example.learning-journey-ui-coaching@1.51.0
  - @contractspec/example.learning-journey-ui-gamified@1.51.0
  - @contractspec/example.learning-journey-duo-drills@1.51.0
  - @contractspec/example.learning-journey-ui-shared@1.51.0
  - @contractspec/example.learning-journey-registry@1.51.0
  - @contractspec/example.locale-jurisdiction-gate@1.51.0
  - @contractspec/example.versioned-knowledge-base@1.51.0
  - @contractspec/example.analytics-dashboard@1.51.0
  - @contractspec/example.lifecycle-dashboard@1.51.0
  - @contractspec/example.service-business-os@1.51.0
  - @contractspec/example.content-generation@1.51.0
  - @contractspec/example.integration-stripe@1.51.0
  - @contractspec/example.kb-update-pipeline@1.51.0
  - @contractspec/example.openbanking-powens@1.51.0
  - @contractspec/example.learning-patterns@1.51.0
  - @contractspec/example.saas-boilerplate@1.51.0
  - @contractspec/example.integration-hub@1.51.0
  - @contractspec/example.knowledge-canon@1.51.0
  - @contractspec/example.personalization@1.51.0
  - @contractspec/example.wealth-snapshot@1.51.0
  - @contractspec/example.workflow-system@1.51.0
  - @contractspec/example.ai-support-bot@1.51.0
  - @contractspec/example.agent-console@1.51.0
  - @contractspec/example.lifecycle-cli@1.51.0
  - @contractspec/lib.example-shared-ui@1.5.0
  - @contractspec/example.crm-pipeline@1.51.0
  - @contractspec/example.marketplace@1.51.0
  - @contractspec/lib.runtime-sandbox@0.6.0
  - @contractspec/example.team-hub@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/example.agent-console@1.50.0
  - @contractspec/example.ai-support-bot@1.50.0
  - @contractspec/example.analytics-dashboard@1.50.0
  - @contractspec/example.content-generation@1.50.0
  - @contractspec/example.crm-pipeline@1.50.0
  - @contractspec/example.integration-hub@1.50.0
  - @contractspec/example.integration-stripe@1.50.0
  - @contractspec/example.kb-update-pipeline@1.50.0
  - @contractspec/example.knowledge-canon@1.50.0
  - @contractspec/example.learning-journey-ambient-coach@1.50.0
  - @contractspec/example.learning-journey-crm-onboarding@1.50.0
  - @contractspec/example.learning-journey-duo-drills@1.50.0
  - @contractspec/example.learning-journey-platform-tour@1.50.0
  - @contractspec/example.learning-journey-quest-challenges@1.50.0
  - @contractspec/example.learning-journey-registry@1.50.0
  - @contractspec/example.learning-journey-studio-onboarding@1.50.0
  - @contractspec/example.learning-journey-ui-coaching@1.50.0
  - @contractspec/example.learning-journey-ui-gamified@1.50.0
  - @contractspec/example.learning-journey-ui-onboarding@1.50.0
  - @contractspec/example.learning-journey-ui-shared@1.50.0
  - @contractspec/example.learning-patterns@1.50.0
  - @contractspec/example.lifecycle-cli@1.50.0
  - @contractspec/example.lifecycle-dashboard@1.50.0
  - @contractspec/example.locale-jurisdiction-gate@1.50.0
  - @contractspec/example.marketplace@1.50.0
  - @contractspec/example.openbanking-powens@1.50.0
  - @contractspec/example.personalization@1.50.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.50.0
  - @contractspec/example.saas-boilerplate@1.50.0
  - @contractspec/example.service-business-os@1.50.0
  - @contractspec/example.team-hub@1.50.0
  - @contractspec/example.versioned-knowledge-base@1.50.0
  - @contractspec/example.wealth-snapshot@1.50.0
  - @contractspec/example.workflow-system@1.50.0
  - @contractspec/lib.example-shared-ui@1.4.0
  - @contractspec/lib.runtime-sandbox@0.5.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/example.learning-journey-studio-onboarding@1.49.0
  - @contractspec/example.learning-journey-quest-challenges@1.49.0
  - @contractspec/example.learning-journey-crm-onboarding@1.49.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.49.0
  - @contractspec/example.learning-journey-ambient-coach@1.49.0
  - @contractspec/example.learning-journey-platform-tour@1.49.0
  - @contractspec/example.learning-journey-ui-onboarding@1.49.0
  - @contractspec/example.learning-journey-ui-coaching@1.49.0
  - @contractspec/example.learning-journey-ui-gamified@1.49.0
  - @contractspec/example.learning-journey-duo-drills@1.49.0
  - @contractspec/example.learning-journey-ui-shared@1.49.0
  - @contractspec/example.learning-journey-registry@1.49.0
  - @contractspec/example.locale-jurisdiction-gate@1.49.0
  - @contractspec/example.versioned-knowledge-base@1.49.0
  - @contractspec/example.analytics-dashboard@1.49.0
  - @contractspec/example.lifecycle-dashboard@1.49.0
  - @contractspec/example.service-business-os@1.49.0
  - @contractspec/example.content-generation@1.49.0
  - @contractspec/example.integration-stripe@1.49.0
  - @contractspec/example.kb-update-pipeline@1.49.0
  - @contractspec/example.openbanking-powens@1.49.0
  - @contractspec/example.learning-patterns@1.49.0
  - @contractspec/example.saas-boilerplate@1.49.0
  - @contractspec/example.integration-hub@1.49.0
  - @contractspec/example.knowledge-canon@1.49.0
  - @contractspec/example.personalization@1.49.0
  - @contractspec/example.wealth-snapshot@1.49.0
  - @contractspec/example.workflow-system@1.49.0
  - @contractspec/example.ai-support-bot@1.49.0
  - @contractspec/example.agent-console@1.49.0
  - @contractspec/example.lifecycle-cli@1.49.0
  - @contractspec/lib.example-shared-ui@1.3.0
  - @contractspec/example.crm-pipeline@1.49.0
  - @contractspec/example.marketplace@1.49.0
  - @contractspec/lib.runtime-sandbox@0.4.0
  - @contractspec/example.team-hub@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0

## 1.48.2

### Patch Changes

- Updated dependencies [2016af0]
  - @contractspec/example.integration-hub@1.48.2

## 1.48.1

### Patch Changes

- Updated dependencies [c560ee7]
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/example.agent-console@1.48.1
  - @contractspec/example.analytics-dashboard@1.48.1
  - @contractspec/example.crm-pipeline@1.48.1
  - @contractspec/example.integration-hub@1.48.1
  - @contractspec/example.learning-journey-ui-coaching@1.48.1
  - @contractspec/example.learning-journey-ui-gamified@1.48.1
  - @contractspec/example.learning-journey-ui-onboarding@1.48.1
  - @contractspec/example.learning-journey-ui-shared@1.48.1
  - @contractspec/example.marketplace@1.48.1
  - @contractspec/example.policy-safe-knowledge-assistant@1.48.1
  - @contractspec/example.saas-boilerplate@1.48.1
  - @contractspec/example.workflow-system@1.48.1
  - @contractspec/lib.example-shared-ui@1.2.1
  - @contractspec/example.ai-support-bot@1.48.1
  - @contractspec/example.content-generation@1.48.1
  - @contractspec/example.integration-stripe@1.48.1
  - @contractspec/example.kb-update-pipeline@1.48.1
  - @contractspec/example.knowledge-canon@1.48.1
  - @contractspec/example.learning-journey-ambient-coach@1.48.1
  - @contractspec/example.learning-journey-crm-onboarding@1.48.1
  - @contractspec/example.learning-journey-duo-drills@1.48.1
  - @contractspec/example.learning-journey-platform-tour@1.48.1
  - @contractspec/example.learning-journey-quest-challenges@1.48.1
  - @contractspec/example.learning-journey-registry@1.48.1
  - @contractspec/example.learning-journey-studio-onboarding@1.48.1
  - @contractspec/example.learning-patterns@1.48.1
  - @contractspec/example.lifecycle-cli@1.48.1
  - @contractspec/example.lifecycle-dashboard@1.48.1
  - @contractspec/example.locale-jurisdiction-gate@1.48.1
  - @contractspec/example.openbanking-powens@1.48.1
  - @contractspec/example.personalization@1.48.1
  - @contractspec/example.service-business-os@1.48.1
  - @contractspec/example.team-hub@1.48.1
  - @contractspec/example.versioned-knowledge-base@1.48.1
  - @contractspec/example.wealth-snapshot@1.48.1

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/example.learning-journey-studio-onboarding@1.48.0
  - @contractspec/example.learning-journey-quest-challenges@1.48.0
  - @contractspec/example.learning-journey-crm-onboarding@1.48.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.48.0
  - @contractspec/example.learning-journey-ambient-coach@1.48.0
  - @contractspec/example.learning-journey-platform-tour@1.48.0
  - @contractspec/example.learning-journey-ui-onboarding@1.48.0
  - @contractspec/example.learning-journey-ui-coaching@1.48.0
  - @contractspec/example.learning-journey-ui-gamified@1.48.0
  - @contractspec/example.learning-journey-duo-drills@1.48.0
  - @contractspec/example.learning-journey-ui-shared@1.48.0
  - @contractspec/example.learning-journey-registry@1.48.0
  - @contractspec/example.locale-jurisdiction-gate@1.48.0
  - @contractspec/example.versioned-knowledge-base@1.48.0
  - @contractspec/example.analytics-dashboard@1.48.0
  - @contractspec/example.lifecycle-dashboard@1.48.0
  - @contractspec/example.service-business-os@1.48.0
  - @contractspec/example.content-generation@1.48.0
  - @contractspec/example.integration-stripe@1.48.0
  - @contractspec/example.kb-update-pipeline@1.48.0
  - @contractspec/example.openbanking-powens@1.48.0
  - @contractspec/example.learning-patterns@1.48.0
  - @contractspec/example.saas-boilerplate@1.48.0
  - @contractspec/example.integration-hub@1.48.0
  - @contractspec/example.knowledge-canon@1.48.0
  - @contractspec/example.personalization@1.48.0
  - @contractspec/example.wealth-snapshot@1.48.0
  - @contractspec/example.workflow-system@1.48.0
  - @contractspec/example.ai-support-bot@1.48.0
  - @contractspec/example.agent-console@1.48.0
  - @contractspec/example.lifecycle-cli@1.48.0
  - @contractspec/lib.example-shared-ui@1.2.0
  - @contractspec/example.crm-pipeline@1.48.0
  - @contractspec/example.marketplace@1.48.0
  - @contractspec/lib.runtime-sandbox@0.3.0
  - @contractspec/example.team-hub@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0

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
  - @contractspec/example.learning-journey-studio-onboarding@1.47.0
  - @contractspec/example.learning-journey-quest-challenges@1.47.0
  - @contractspec/example.learning-journey-crm-onboarding@1.47.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.47.0
  - @contractspec/example.learning-journey-ambient-coach@1.47.0
  - @contractspec/example.learning-journey-platform-tour@1.47.0
  - @contractspec/example.learning-journey-ui-onboarding@1.47.0
  - @contractspec/example.learning-journey-ui-coaching@1.47.0
  - @contractspec/example.learning-journey-ui-gamified@1.47.0
  - @contractspec/example.learning-journey-duo-drills@1.47.0
  - @contractspec/example.learning-journey-ui-shared@1.47.0
  - @contractspec/example.learning-journey-registry@1.47.0
  - @contractspec/example.locale-jurisdiction-gate@1.47.0
  - @contractspec/example.versioned-knowledge-base@1.47.0
  - @contractspec/example.analytics-dashboard@1.47.0
  - @contractspec/example.lifecycle-dashboard@1.47.0
  - @contractspec/example.service-business-os@1.47.0
  - @contractspec/example.content-generation@1.47.0
  - @contractspec/example.integration-stripe@1.47.0
  - @contractspec/example.kb-update-pipeline@1.47.0
  - @contractspec/example.openbanking-powens@1.47.0
  - @contractspec/example.learning-patterns@1.47.0
  - @contractspec/example.saas-boilerplate@1.47.0
  - @contractspec/example.integration-hub@1.47.0
  - @contractspec/example.knowledge-canon@1.47.0
  - @contractspec/example.personalization@1.47.0
  - @contractspec/example.wealth-snapshot@1.47.0
  - @contractspec/example.workflow-system@1.47.0
  - @contractspec/example.ai-support-bot@1.47.0
  - @contractspec/example.agent-console@1.47.0
  - @contractspec/example.lifecycle-cli@1.47.0
  - @contractspec/lib.example-shared-ui@1.1.0
  - @contractspec/example.crm-pipeline@1.47.0
  - @contractspec/example.marketplace@1.47.0
  - @contractspec/lib.runtime-sandbox@0.2.0
  - @contractspec/example.team-hub@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/example.learning-journey-studio-onboarding@1.46.2
  - @contractspec/example.learning-journey-quest-challenges@1.46.2
  - @contractspec/example.learning-journey-crm-onboarding@1.46.2
  - @contractspec/example.policy-safe-knowledge-assistant@1.46.2
  - @contractspec/example.learning-journey-ambient-coach@1.46.2
  - @contractspec/example.learning-journey-platform-tour@1.46.2
  - @contractspec/example.learning-journey-ui-onboarding@1.46.2
  - @contractspec/example.learning-journey-ui-coaching@1.46.2
  - @contractspec/example.learning-journey-ui-gamified@1.46.2
  - @contractspec/example.learning-journey-duo-drills@1.46.2
  - @contractspec/example.learning-journey-ui-shared@1.46.2
  - @contractspec/example.learning-journey-registry@1.46.2
  - @contractspec/example.locale-jurisdiction-gate@1.46.2
  - @contractspec/example.versioned-knowledge-base@1.46.2
  - @contractspec/example.analytics-dashboard@1.46.2
  - @contractspec/example.lifecycle-dashboard@1.46.2
  - @contractspec/example.service-business-os@1.46.2
  - @contractspec/example.content-generation@1.46.2
  - @contractspec/example.integration-stripe@1.46.2
  - @contractspec/example.kb-update-pipeline@1.46.2
  - @contractspec/example.openbanking-powens@1.46.2
  - @contractspec/example.learning-patterns@1.46.2
  - @contractspec/example.saas-boilerplate@1.46.2
  - @contractspec/example.integration-hub@1.46.2
  - @contractspec/example.knowledge-canon@1.46.2
  - @contractspec/example.personalization@1.46.2
  - @contractspec/example.wealth-snapshot@1.46.2
  - @contractspec/example.workflow-system@1.46.2
  - @contractspec/example.ai-support-bot@1.46.2
  - @contractspec/example.agent-console@1.46.2
  - @contractspec/example.lifecycle-cli@1.46.2
  - @contractspec/example.crm-pipeline@1.46.2
  - @contractspec/example.marketplace@1.46.2
  - @contractspec/lib.runtime-sandbox@0.1.1
  - @contractspec/example.team-hub@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/example.learning-journey-studio-onboarding@1.46.1
  - @contractspec/example.learning-journey-quest-challenges@1.46.1
  - @contractspec/example.learning-journey-crm-onboarding@1.46.1
  - @contractspec/example.policy-safe-knowledge-assistant@1.46.1
  - @contractspec/example.learning-journey-ambient-coach@1.46.1
  - @contractspec/example.learning-journey-platform-tour@1.46.1
  - @contractspec/example.learning-journey-ui-onboarding@1.46.1
  - @contractspec/example.learning-journey-ui-coaching@1.46.1
  - @contractspec/example.learning-journey-ui-gamified@1.46.1
  - @contractspec/example.learning-journey-duo-drills@1.46.1
  - @contractspec/example.learning-journey-ui-shared@1.46.1
  - @contractspec/example.learning-journey-registry@1.46.1
  - @contractspec/example.locale-jurisdiction-gate@1.46.1
  - @contractspec/example.versioned-knowledge-base@1.46.1
  - @contractspec/example.analytics-dashboard@1.46.1
  - @contractspec/example.lifecycle-dashboard@1.46.1
  - @contractspec/example.service-business-os@1.46.1
  - @contractspec/example.content-generation@1.46.1
  - @contractspec/example.integration-stripe@1.46.1
  - @contractspec/example.kb-update-pipeline@1.46.1
  - @contractspec/example.openbanking-powens@1.46.1
  - @contractspec/example.learning-patterns@1.46.1
  - @contractspec/example.saas-boilerplate@1.46.1
  - @contractspec/example.integration-hub@1.46.1
  - @contractspec/example.knowledge-canon@1.46.1
  - @contractspec/example.personalization@1.46.1
  - @contractspec/example.wealth-snapshot@1.46.1
  - @contractspec/example.workflow-system@1.46.1
  - @contractspec/example.ai-support-bot@1.46.1
  - @contractspec/example.agent-console@1.46.1
  - @contractspec/example.lifecycle-cli@1.46.1
  - @contractspec/example.crm-pipeline@1.46.1
  - @contractspec/example.marketplace@1.46.1
  - @contractspec/example.team-hub@1.46.1
  - @contractspec/lib.contracts-spec@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/example.learning-journey-studio-onboarding@1.46.0
  - @contractspec/example.learning-journey-quest-challenges@1.46.0
  - @contractspec/example.learning-journey-crm-onboarding@1.46.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.46.0
  - @contractspec/example.learning-journey-ambient-coach@1.46.0
  - @contractspec/example.learning-journey-platform-tour@1.46.0
  - @contractspec/example.learning-journey-ui-onboarding@1.46.0
  - @contractspec/example.learning-journey-ui-coaching@1.46.0
  - @contractspec/example.learning-journey-ui-gamified@1.46.0
  - @contractspec/example.learning-journey-duo-drills@1.46.0
  - @contractspec/example.learning-journey-ui-shared@1.46.0
  - @contractspec/example.learning-journey-registry@1.46.0
  - @contractspec/example.locale-jurisdiction-gate@1.46.0
  - @contractspec/example.versioned-knowledge-base@1.46.0
  - @contractspec/example.analytics-dashboard@1.46.0
  - @contractspec/example.lifecycle-dashboard@1.46.0
  - @contractspec/example.service-business-os@1.46.0
  - @contractspec/example.content-generation@1.46.0
  - @contractspec/example.integration-stripe@1.46.0
  - @contractspec/example.kb-update-pipeline@1.46.0
  - @contractspec/example.openbanking-powens@1.46.0
  - @contractspec/example.learning-patterns@1.46.0
  - @contractspec/example.saas-boilerplate@1.46.0
  - @contractspec/example.integration-hub@1.46.0
  - @contractspec/example.knowledge-canon@1.46.0
  - @contractspec/example.personalization@1.46.0
  - @contractspec/example.wealth-snapshot@1.46.0
  - @contractspec/example.workflow-system@1.46.0
  - @contractspec/example.ai-support-bot@1.46.0
  - @contractspec/example.agent-console@1.46.0
  - @contractspec/example.lifecycle-cli@1.46.0
  - @contractspec/example.crm-pipeline@1.46.0
  - @contractspec/example.marketplace@1.46.0
  - @contractspec/example.team-hub@1.46.0
  - @contractspec/lib.contracts-spec@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/example.learning-journey-studio-onboarding@1.45.6
  - @contractspec/example.learning-journey-quest-challenges@1.45.6
  - @contractspec/example.learning-journey-crm-onboarding@1.45.6
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.6
  - @contractspec/example.learning-journey-ambient-coach@1.45.6
  - @contractspec/example.learning-journey-platform-tour@1.45.6
  - @contractspec/example.learning-journey-ui-onboarding@1.45.6
  - @contractspec/example.learning-journey-ui-coaching@1.45.6
  - @contractspec/example.learning-journey-ui-gamified@1.45.6
  - @contractspec/example.learning-journey-duo-drills@1.45.6
  - @contractspec/example.learning-journey-ui-shared@1.45.6
  - @contractspec/example.learning-journey-registry@1.45.6
  - @contractspec/example.locale-jurisdiction-gate@1.45.6
  - @contractspec/example.versioned-knowledge-base@1.45.6
  - @contractspec/example.analytics-dashboard@1.45.6
  - @contractspec/example.lifecycle-dashboard@1.45.6
  - @contractspec/example.service-business-os@1.45.6
  - @contractspec/example.content-generation@1.45.6
  - @contractspec/example.integration-stripe@1.45.6
  - @contractspec/example.kb-update-pipeline@1.45.6
  - @contractspec/example.openbanking-powens@1.45.6
  - @contractspec/example.learning-patterns@1.45.6
  - @contractspec/example.saas-boilerplate@1.45.6
  - @contractspec/example.integration-hub@1.45.6
  - @contractspec/example.knowledge-canon@1.45.6
  - @contractspec/example.personalization@1.45.6
  - @contractspec/example.wealth-snapshot@1.45.6
  - @contractspec/example.workflow-system@1.45.6
  - @contractspec/example.ai-support-bot@1.45.6
  - @contractspec/example.agent-console@1.45.6
  - @contractspec/example.lifecycle-cli@1.45.6
  - @contractspec/example.crm-pipeline@1.45.6
  - @contractspec/example.marketplace@1.45.6
  - @contractspec/example.team-hub@1.45.6
  - @contractspec/lib.contracts-spec@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/example.learning-journey-studio-onboarding@1.45.5
  - @contractspec/example.learning-journey-quest-challenges@1.45.5
  - @contractspec/example.learning-journey-crm-onboarding@1.45.5
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.5
  - @contractspec/example.learning-journey-ambient-coach@1.45.5
  - @contractspec/example.learning-journey-platform-tour@1.45.5
  - @contractspec/example.learning-journey-ui-onboarding@1.45.5
  - @contractspec/example.learning-journey-ui-coaching@1.45.5
  - @contractspec/example.learning-journey-ui-gamified@1.45.5
  - @contractspec/example.learning-journey-duo-drills@1.45.5
  - @contractspec/example.learning-journey-ui-shared@1.45.5
  - @contractspec/example.learning-journey-registry@1.45.5
  - @contractspec/example.locale-jurisdiction-gate@1.45.5
  - @contractspec/example.versioned-knowledge-base@1.45.5
  - @contractspec/example.analytics-dashboard@1.45.5
  - @contractspec/example.lifecycle-dashboard@1.45.5
  - @contractspec/example.service-business-os@1.45.5
  - @contractspec/example.content-generation@1.45.5
  - @contractspec/example.integration-stripe@1.45.5
  - @contractspec/example.kb-update-pipeline@1.45.5
  - @contractspec/example.openbanking-powens@1.45.5
  - @contractspec/example.learning-patterns@1.45.5
  - @contractspec/example.saas-boilerplate@1.45.5
  - @contractspec/example.integration-hub@1.45.5
  - @contractspec/example.knowledge-canon@1.45.5
  - @contractspec/example.personalization@1.45.5
  - @contractspec/example.wealth-snapshot@1.45.5
  - @contractspec/example.workflow-system@1.45.5
  - @contractspec/example.ai-support-bot@1.45.5
  - @contractspec/example.agent-console@1.45.5
  - @contractspec/example.lifecycle-cli@1.45.5
  - @contractspec/example.crm-pipeline@1.45.5
  - @contractspec/example.marketplace@1.45.5
  - @contractspec/example.team-hub@1.45.5
  - @contractspec/lib.contracts-spec@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@1.45.4
  - @contractspec/example.learning-journey-quest-challenges@1.45.4
  - @contractspec/example.learning-journey-crm-onboarding@1.45.4
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.4
  - @contractspec/example.learning-journey-ambient-coach@1.45.4
  - @contractspec/example.learning-journey-platform-tour@1.45.4
  - @contractspec/example.learning-journey-ui-onboarding@1.45.4
  - @contractspec/example.learning-journey-ui-coaching@1.45.4
  - @contractspec/example.learning-journey-ui-gamified@1.45.4
  - @contractspec/example.learning-journey-duo-drills@1.45.4
  - @contractspec/example.learning-journey-ui-shared@1.45.4
  - @contractspec/example.learning-journey-registry@1.45.4
  - @contractspec/example.locale-jurisdiction-gate@1.45.4
  - @contractspec/example.versioned-knowledge-base@1.45.4
  - @contractspec/example.analytics-dashboard@1.45.4
  - @contractspec/example.lifecycle-dashboard@1.45.4
  - @contractspec/example.service-business-os@1.45.4
  - @contractspec/example.content-generation@1.45.4
  - @contractspec/example.integration-stripe@1.45.4
  - @contractspec/example.kb-update-pipeline@1.45.4
  - @contractspec/example.openbanking-powens@1.45.4
  - @contractspec/example.learning-patterns@1.45.4
  - @contractspec/example.saas-boilerplate@1.45.4
  - @contractspec/example.integration-hub@1.45.4
  - @contractspec/example.knowledge-canon@1.45.4
  - @contractspec/example.personalization@1.45.4
  - @contractspec/example.wealth-snapshot@1.45.4
  - @contractspec/example.workflow-system@1.45.4
  - @contractspec/example.ai-support-bot@1.45.4
  - @contractspec/example.agent-console@1.45.4
  - @contractspec/example.lifecycle-cli@1.45.4
  - @contractspec/example.crm-pipeline@1.45.4
  - @contractspec/example.marketplace@1.45.4
  - @contractspec/example.team-hub@1.45.4
  - @contractspec/lib.contracts-spec@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/example.learning-journey-studio-onboarding@1.45.3
  - @contractspec/example.learning-journey-quest-challenges@1.45.3
  - @contractspec/example.learning-journey-crm-onboarding@1.45.3
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.3
  - @contractspec/example.learning-journey-ambient-coach@1.45.3
  - @contractspec/example.learning-journey-platform-tour@1.45.3
  - @contractspec/example.learning-journey-ui-onboarding@1.45.3
  - @contractspec/example.learning-journey-ui-coaching@1.45.3
  - @contractspec/example.learning-journey-ui-gamified@1.45.3
  - @contractspec/example.learning-journey-duo-drills@1.45.3
  - @contractspec/example.learning-journey-ui-shared@1.45.3
  - @contractspec/example.learning-journey-registry@1.45.3
  - @contractspec/example.locale-jurisdiction-gate@1.45.3
  - @contractspec/example.versioned-knowledge-base@1.45.3
  - @contractspec/example.analytics-dashboard@1.45.3
  - @contractspec/example.lifecycle-dashboard@1.45.3
  - @contractspec/example.service-business-os@1.45.3
  - @contractspec/example.content-generation@1.45.3
  - @contractspec/example.integration-stripe@1.45.3
  - @contractspec/example.kb-update-pipeline@1.45.3
  - @contractspec/example.openbanking-powens@1.45.3
  - @contractspec/example.learning-patterns@1.45.3
  - @contractspec/example.saas-boilerplate@1.45.3
  - @contractspec/example.integration-hub@1.45.3
  - @contractspec/example.knowledge-canon@1.45.3
  - @contractspec/example.personalization@1.45.3
  - @contractspec/example.wealth-snapshot@1.45.3
  - @contractspec/example.workflow-system@1.45.3
  - @contractspec/example.ai-support-bot@1.45.3
  - @contractspec/example.agent-console@1.45.3
  - @contractspec/example.lifecycle-cli@1.45.3
  - @contractspec/example.crm-pipeline@1.45.3
  - @contractspec/example.marketplace@1.45.3
  - @contractspec/example.team-hub@1.45.3
  - @contractspec/lib.contracts-spec@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/example.learning-journey-studio-onboarding@1.45.2
  - @contractspec/example.learning-journey-quest-challenges@1.45.2
  - @contractspec/example.learning-journey-crm-onboarding@1.45.2
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.2
  - @contractspec/example.learning-journey-ambient-coach@1.45.2
  - @contractspec/example.learning-journey-platform-tour@1.45.2
  - @contractspec/example.learning-journey-ui-onboarding@1.45.2
  - @contractspec/example.learning-journey-ui-coaching@1.45.2
  - @contractspec/example.learning-journey-ui-gamified@1.45.2
  - @contractspec/example.learning-journey-duo-drills@1.45.2
  - @contractspec/example.learning-journey-ui-shared@1.45.2
  - @contractspec/example.learning-journey-registry@1.45.2
  - @contractspec/example.locale-jurisdiction-gate@1.45.2
  - @contractspec/example.versioned-knowledge-base@1.45.2
  - @contractspec/example.analytics-dashboard@1.45.2
  - @contractspec/example.lifecycle-dashboard@1.45.2
  - @contractspec/example.service-business-os@1.45.2
  - @contractspec/example.content-generation@1.45.2
  - @contractspec/example.integration-stripe@1.45.2
  - @contractspec/example.kb-update-pipeline@1.45.2
  - @contractspec/example.openbanking-powens@1.45.2
  - @contractspec/example.learning-patterns@1.45.2
  - @contractspec/example.saas-boilerplate@1.45.2
  - @contractspec/example.integration-hub@1.45.2
  - @contractspec/example.knowledge-canon@1.45.2
  - @contractspec/example.personalization@1.45.2
  - @contractspec/example.wealth-snapshot@1.45.2
  - @contractspec/example.workflow-system@1.45.2
  - @contractspec/example.ai-support-bot@1.45.2
  - @contractspec/example.agent-console@1.45.2
  - @contractspec/example.lifecycle-cli@1.45.2
  - @contractspec/example.crm-pipeline@1.45.2
  - @contractspec/example.marketplace@1.45.2
  - @contractspec/example.team-hub@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/example.learning-journey-studio-onboarding@1.45.1
  - @contractspec/example.learning-journey-quest-challenges@1.45.1
  - @contractspec/example.learning-journey-crm-onboarding@1.45.1
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.1
  - @contractspec/example.learning-journey-ambient-coach@1.45.1
  - @contractspec/example.learning-journey-platform-tour@1.45.1
  - @contractspec/example.learning-journey-ui-onboarding@1.45.1
  - @contractspec/example.learning-journey-ui-coaching@1.45.1
  - @contractspec/example.learning-journey-ui-gamified@1.45.1
  - @contractspec/example.learning-journey-duo-drills@1.45.1
  - @contractspec/example.learning-journey-ui-shared@1.45.1
  - @contractspec/example.learning-journey-registry@1.45.1
  - @contractspec/example.locale-jurisdiction-gate@1.45.1
  - @contractspec/example.versioned-knowledge-base@1.45.1
  - @contractspec/example.analytics-dashboard@1.45.1
  - @contractspec/example.lifecycle-dashboard@1.45.1
  - @contractspec/example.service-business-os@1.45.1
  - @contractspec/example.content-generation@1.45.1
  - @contractspec/example.integration-stripe@1.45.1
  - @contractspec/example.kb-update-pipeline@1.45.1
  - @contractspec/example.openbanking-powens@1.45.1
  - @contractspec/example.learning-patterns@1.45.1
  - @contractspec/example.saas-boilerplate@1.45.1
  - @contractspec/example.integration-hub@1.45.1
  - @contractspec/example.knowledge-canon@1.45.1
  - @contractspec/example.personalization@1.45.1
  - @contractspec/example.wealth-snapshot@1.45.1
  - @contractspec/example.workflow-system@1.45.1
  - @contractspec/example.ai-support-bot@1.45.1
  - @contractspec/example.agent-console@1.45.1
  - @contractspec/example.lifecycle-cli@1.45.1
  - @contractspec/example.crm-pipeline@1.45.1
  - @contractspec/example.marketplace@1.45.1
  - @contractspec/example.team-hub@1.45.1

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
  - @contractspec/example.learning-journey-studio-onboarding@1.45.0
  - @contractspec/example.learning-journey-quest-challenges@1.45.0
  - @contractspec/example.learning-journey-crm-onboarding@1.45.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.45.0
  - @contractspec/example.learning-journey-ambient-coach@1.45.0
  - @contractspec/example.learning-journey-platform-tour@1.45.0
  - @contractspec/example.learning-journey-ui-onboarding@1.45.0
  - @contractspec/example.learning-journey-ui-coaching@1.45.0
  - @contractspec/example.learning-journey-ui-gamified@1.45.0
  - @contractspec/example.learning-journey-duo-drills@1.45.0
  - @contractspec/example.learning-journey-ui-shared@1.45.0
  - @contractspec/example.learning-journey-registry@1.45.0
  - @contractspec/example.locale-jurisdiction-gate@1.45.0
  - @contractspec/example.versioned-knowledge-base@1.45.0
  - @contractspec/example.analytics-dashboard@1.45.0
  - @contractspec/example.lifecycle-dashboard@1.45.0
  - @contractspec/example.service-business-os@1.45.0
  - @contractspec/example.content-generation@1.45.0
  - @contractspec/example.integration-stripe@1.45.0
  - @contractspec/example.kb-update-pipeline@1.45.0
  - @contractspec/example.openbanking-powens@1.45.0
  - @contractspec/example.learning-patterns@1.45.0
  - @contractspec/example.saas-boilerplate@1.45.0
  - @contractspec/example.integration-hub@1.45.0
  - @contractspec/example.knowledge-canon@1.45.0
  - @contractspec/example.personalization@1.45.0
  - @contractspec/example.wealth-snapshot@1.45.0
  - @contractspec/example.workflow-system@1.45.0
  - @contractspec/example.ai-support-bot@1.45.0
  - @contractspec/example.agent-console@1.45.0
  - @contractspec/example.lifecycle-cli@1.45.0
  - @contractspec/example.crm-pipeline@1.45.0
  - @contractspec/example.marketplace@1.45.0
  - @contractspec/example.team-hub@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/example.learning-journey-studio-onboarding@1.44.1
  - @contractspec/example.learning-journey-quest-challenges@1.44.1
  - @contractspec/example.learning-journey-crm-onboarding@1.44.1
  - @contractspec/example.policy-safe-knowledge-assistant@1.44.1
  - @contractspec/example.learning-journey-ambient-coach@1.44.1
  - @contractspec/example.learning-journey-platform-tour@1.44.1
  - @contractspec/example.learning-journey-ui-onboarding@1.44.1
  - @contractspec/example.learning-journey-ui-coaching@1.44.1
  - @contractspec/example.learning-journey-ui-gamified@1.44.1
  - @contractspec/example.learning-journey-duo-drills@1.44.1
  - @contractspec/example.learning-journey-ui-shared@1.44.1
  - @contractspec/example.learning-journey-registry@1.44.1
  - @contractspec/example.locale-jurisdiction-gate@1.44.1
  - @contractspec/example.versioned-knowledge-base@1.44.1
  - @contractspec/example.analytics-dashboard@1.44.1
  - @contractspec/example.lifecycle-dashboard@1.44.1
  - @contractspec/example.service-business-os@1.44.1
  - @contractspec/example.content-generation@1.44.1
  - @contractspec/example.integration-stripe@1.44.1
  - @contractspec/example.kb-update-pipeline@1.44.1
  - @contractspec/example.openbanking-powens@1.44.1
  - @contractspec/example.learning-patterns@1.44.1
  - @contractspec/example.saas-boilerplate@1.44.1
  - @contractspec/example.integration-hub@1.44.1
  - @contractspec/example.knowledge-canon@1.44.1
  - @contractspec/example.personalization@1.44.1
  - @contractspec/example.wealth-snapshot@1.44.1
  - @contractspec/example.workflow-system@1.44.1
  - @contractspec/example.ai-support-bot@1.44.1
  - @contractspec/example.agent-console@1.44.1
  - @contractspec/example.lifecycle-cli@1.44.1
  - @contractspec/example.crm-pipeline@1.44.1
  - @contractspec/example.marketplace@1.44.1
  - @contractspec/example.team-hub@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/example.learning-journey-studio-onboarding@1.44.0
  - @contractspec/example.learning-journey-quest-challenges@1.44.0
  - @contractspec/example.learning-journey-crm-onboarding@1.44.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.44.0
  - @contractspec/example.learning-journey-ambient-coach@1.44.0
  - @contractspec/example.learning-journey-platform-tour@1.44.0
  - @contractspec/example.learning-journey-ui-onboarding@1.44.0
  - @contractspec/example.learning-journey-ui-coaching@1.44.0
  - @contractspec/example.learning-journey-ui-gamified@1.44.0
  - @contractspec/example.learning-journey-duo-drills@1.44.0
  - @contractspec/example.learning-journey-ui-shared@1.44.0
  - @contractspec/example.learning-journey-registry@1.44.0
  - @contractspec/example.locale-jurisdiction-gate@1.44.0
  - @contractspec/example.versioned-knowledge-base@1.44.0
  - @contractspec/example.analytics-dashboard@1.44.0
  - @contractspec/example.lifecycle-dashboard@1.44.0
  - @contractspec/example.service-business-os@1.44.0
  - @contractspec/example.content-generation@1.44.0
  - @contractspec/example.integration-stripe@1.44.0
  - @contractspec/example.kb-update-pipeline@1.44.0
  - @contractspec/example.openbanking-powens@1.44.0
  - @contractspec/example.learning-patterns@1.44.0
  - @contractspec/example.saas-boilerplate@1.44.0
  - @contractspec/example.integration-hub@1.44.0
  - @contractspec/example.knowledge-canon@1.44.0
  - @contractspec/example.personalization@1.44.0
  - @contractspec/example.wealth-snapshot@1.44.0
  - @contractspec/example.workflow-system@1.44.0
  - @contractspec/example.ai-support-bot@1.44.0
  - @contractspec/example.agent-console@1.44.0
  - @contractspec/example.lifecycle-cli@1.44.0
  - @contractspec/example.crm-pipeline@1.44.0
  - @contractspec/example.marketplace@1.44.0
  - @contractspec/example.team-hub@1.44.0

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/example.learning-journey-studio-onboarding@1.43.2
  - @contractspec/example.learning-journey-quest-challenges@1.43.3
  - @contractspec/example.learning-journey-crm-onboarding@1.43.3
  - @contractspec/example.policy-safe-knowledge-assistant@1.43.3
  - @contractspec/example.learning-journey-ambient-coach@1.43.3
  - @contractspec/example.learning-journey-platform-tour@1.43.2
  - @contractspec/example.learning-journey-ui-onboarding@1.43.3
  - @contractspec/example.learning-journey-ui-coaching@1.43.3
  - @contractspec/example.learning-journey-ui-gamified@1.43.3
  - @contractspec/example.learning-journey-duo-drills@1.43.3
  - @contractspec/example.learning-journey-ui-shared@1.43.3
  - @contractspec/example.learning-journey-registry@1.43.3
  - @contractspec/example.locale-jurisdiction-gate@1.43.3
  - @contractspec/example.versioned-knowledge-base@1.43.3
  - @contractspec/example.analytics-dashboard@1.43.3
  - @contractspec/example.lifecycle-dashboard@1.43.3
  - @contractspec/example.service-business-os@1.43.3
  - @contractspec/example.content-generation@1.43.2
  - @contractspec/example.integration-stripe@1.43.3
  - @contractspec/example.kb-update-pipeline@1.43.3
  - @contractspec/example.openbanking-powens@1.43.3
  - @contractspec/example.learning-patterns@1.43.2
  - @contractspec/example.saas-boilerplate@1.43.3
  - @contractspec/example.integration-hub@1.43.3
  - @contractspec/example.knowledge-canon@1.43.3
  - @contractspec/example.personalization@1.43.3
  - @contractspec/example.wealth-snapshot@1.43.3
  - @contractspec/example.workflow-system@1.43.3
  - @contractspec/example.ai-support-bot@1.43.3
  - @contractspec/example.agent-console@1.43.3
  - @contractspec/example.lifecycle-cli@1.43.3
  - @contractspec/example.crm-pipeline@1.43.3
  - @contractspec/example.marketplace@1.43.3
  - @contractspec/example.team-hub@1.43.3

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/example.learning-journey-studio-onboarding@1.43.2
  - @contractspec/example.learning-journey-quest-challenges@1.43.2
  - @contractspec/example.learning-journey-crm-onboarding@1.43.2
  - @contractspec/example.policy-safe-knowledge-assistant@1.43.2
  - @contractspec/example.learning-journey-ambient-coach@1.43.2
  - @contractspec/example.learning-journey-platform-tour@1.43.2
  - @contractspec/example.learning-journey-ui-onboarding@1.43.2
  - @contractspec/example.learning-journey-ui-coaching@1.43.2
  - @contractspec/example.learning-journey-ui-gamified@1.43.2
  - @contractspec/example.learning-journey-duo-drills@1.43.2
  - @contractspec/example.learning-journey-ui-shared@1.43.2
  - @contractspec/example.learning-journey-registry@1.43.2
  - @contractspec/example.locale-jurisdiction-gate@1.43.2
  - @contractspec/example.versioned-knowledge-base@1.43.2
  - @contractspec/example.analytics-dashboard@1.43.2
  - @contractspec/example.lifecycle-dashboard@1.43.2
  - @contractspec/example.service-business-os@1.43.2
  - @contractspec/example.content-generation@1.43.2
  - @contractspec/example.integration-stripe@1.43.2
  - @contractspec/example.kb-update-pipeline@1.43.2
  - @contractspec/example.openbanking-powens@1.43.2
  - @contractspec/example.learning-patterns@1.43.2
  - @contractspec/example.saas-boilerplate@1.43.2
  - @contractspec/example.integration-hub@1.43.2
  - @contractspec/example.knowledge-canon@1.43.2
  - @contractspec/example.personalization@1.43.2
  - @contractspec/example.wealth-snapshot@1.43.2
  - @contractspec/example.workflow-system@1.43.2
  - @contractspec/example.ai-support-bot@1.43.2
  - @contractspec/example.agent-console@1.43.2
  - @contractspec/example.lifecycle-cli@1.43.2
  - @contractspec/example.crm-pipeline@1.43.2
  - @contractspec/example.marketplace@1.43.2
  - @contractspec/example.team-hub@1.43.2

## 1.43.1

### Patch Changes

- @contractspec/example.agent-console@1.43.1
- @contractspec/example.ai-support-bot@1.43.1
- @contractspec/example.analytics-dashboard@1.43.1
- @contractspec/example.content-generation@1.43.1
- @contractspec/example.crm-pipeline@1.43.1
- @contractspec/example.integration-hub@1.43.1
- @contractspec/example.integration-stripe@1.43.1
- @contractspec/example.kb-update-pipeline@1.43.1
- @contractspec/example.knowledge-canon@1.43.1
- @contractspec/example.learning-journey-ambient-coach@1.43.1
- @contractspec/example.learning-journey-crm-onboarding@1.43.1
- @contractspec/example.learning-journey-duo-drills@1.43.1
- @contractspec/example.learning-journey-platform-tour@1.43.1
- @contractspec/example.learning-journey-quest-challenges@1.43.1
- @contractspec/example.learning-journey-registry@1.43.1
- @contractspec/example.learning-journey-studio-onboarding@1.43.1
- @contractspec/example.learning-journey-ui-coaching@1.43.1
- @contractspec/example.learning-journey-ui-gamified@1.43.1
- @contractspec/example.learning-journey-ui-onboarding@1.43.1
- @contractspec/example.learning-journey-ui-shared@1.43.1
- @contractspec/example.learning-patterns@1.43.1
- @contractspec/example.lifecycle-cli@1.43.1
- @contractspec/example.lifecycle-dashboard@1.43.1
- @contractspec/example.locale-jurisdiction-gate@1.43.1
- @contractspec/example.marketplace@1.43.1
- @contractspec/example.openbanking-powens@1.43.1
- @contractspec/example.personalization@1.43.1
- @contractspec/example.policy-safe-knowledge-assistant@1.43.1
- @contractspec/example.saas-boilerplate@1.43.1
- @contractspec/example.service-business-os@1.43.1
- @contractspec/example.team-hub@1.43.1
- @contractspec/example.versioned-knowledge-base@1.43.1
- @contractspec/example.wealth-snapshot@1.43.1
- @contractspec/example.workflow-system@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/example.learning-journey-studio-onboarding@1.43.0
  - @contractspec/example.learning-journey-quest-challenges@1.43.0
  - @contractspec/example.learning-journey-crm-onboarding@1.43.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.43.0
  - @contractspec/example.learning-journey-ambient-coach@1.43.0
  - @contractspec/example.learning-journey-platform-tour@1.43.0
  - @contractspec/example.learning-journey-ui-onboarding@1.43.0
  - @contractspec/example.learning-journey-ui-coaching@1.43.0
  - @contractspec/example.learning-journey-ui-gamified@1.43.0
  - @contractspec/example.learning-journey-duo-drills@1.43.0
  - @contractspec/example.learning-journey-ui-shared@1.43.0
  - @contractspec/example.learning-journey-registry@1.43.0
  - @contractspec/example.locale-jurisdiction-gate@1.43.0
  - @contractspec/example.versioned-knowledge-base@1.43.0
  - @contractspec/example.analytics-dashboard@1.43.0
  - @contractspec/example.lifecycle-dashboard@1.43.0
  - @contractspec/example.service-business-os@1.43.0
  - @contractspec/example.content-generation@1.43.0
  - @contractspec/example.integration-stripe@1.43.0
  - @contractspec/example.kb-update-pipeline@1.43.0
  - @contractspec/example.openbanking-powens@1.43.0
  - @contractspec/example.learning-patterns@1.43.0
  - @contractspec/example.saas-boilerplate@1.43.0
  - @contractspec/example.integration-hub@1.43.0
  - @contractspec/example.knowledge-canon@1.43.0
  - @contractspec/example.personalization@1.43.0
  - @contractspec/example.wealth-snapshot@1.43.0
  - @contractspec/example.workflow-system@1.43.0
  - @contractspec/example.ai-support-bot@1.43.0
  - @contractspec/example.agent-console@1.43.0
  - @contractspec/example.lifecycle-cli@1.43.0
  - @contractspec/example.crm-pipeline@1.43.0
  - @contractspec/example.marketplace@1.43.0
  - @contractspec/example.team-hub@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.10
  - @contractspec/example.learning-journey-quest-challenges@1.42.10
  - @contractspec/example.learning-journey-crm-onboarding@1.42.10
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.10
  - @contractspec/example.learning-journey-ambient-coach@1.42.10
  - @contractspec/example.learning-journey-platform-tour@1.42.9
  - @contractspec/example.learning-journey-ui-onboarding@1.42.10
  - @contractspec/example.learning-journey-ui-coaching@1.42.10
  - @contractspec/example.learning-journey-ui-gamified@1.42.10
  - @contractspec/example.learning-journey-duo-drills@1.42.10
  - @contractspec/example.learning-journey-ui-shared@1.42.10
  - @contractspec/example.learning-journey-registry@1.42.10
  - @contractspec/example.locale-jurisdiction-gate@1.42.10
  - @contractspec/example.versioned-knowledge-base@1.42.10
  - @contractspec/example.analytics-dashboard@1.42.10
  - @contractspec/example.lifecycle-dashboard@1.42.10
  - @contractspec/example.service-business-os@1.42.10
  - @contractspec/example.content-generation@1.42.10
  - @contractspec/example.integration-stripe@1.42.10
  - @contractspec/example.kb-update-pipeline@1.42.10
  - @contractspec/example.openbanking-powens@1.42.10
  - @contractspec/example.learning-patterns@1.42.9
  - @contractspec/example.saas-boilerplate@1.42.10
  - @contractspec/example.integration-hub@1.42.10
  - @contractspec/example.knowledge-canon@1.42.10
  - @contractspec/example.personalization@1.42.10
  - @contractspec/example.wealth-snapshot@1.42.10
  - @contractspec/example.workflow-system@1.42.10
  - @contractspec/example.ai-support-bot@1.42.10
  - @contractspec/example.agent-console@1.42.10
  - @contractspec/example.lifecycle-cli@1.42.10
  - @contractspec/example.crm-pipeline@1.42.10
  - @contractspec/example.marketplace@1.42.10
  - @contractspec/example.team-hub@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.9
  - @contractspec/example.learning-journey-quest-challenges@1.42.9
  - @contractspec/example.learning-journey-crm-onboarding@1.42.9
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.9
  - @contractspec/example.learning-journey-ambient-coach@1.42.9
  - @contractspec/example.learning-journey-platform-tour@1.42.8
  - @contractspec/example.learning-journey-ui-onboarding@1.42.9
  - @contractspec/example.learning-journey-ui-coaching@1.42.9
  - @contractspec/example.learning-journey-ui-gamified@1.42.9
  - @contractspec/example.learning-journey-duo-drills@1.42.9
  - @contractspec/example.learning-journey-ui-shared@1.42.9
  - @contractspec/example.learning-journey-registry@1.42.9
  - @contractspec/example.locale-jurisdiction-gate@1.42.9
  - @contractspec/example.versioned-knowledge-base@1.42.9
  - @contractspec/example.analytics-dashboard@1.42.9
  - @contractspec/example.lifecycle-dashboard@1.42.9
  - @contractspec/example.service-business-os@1.42.9
  - @contractspec/example.content-generation@1.42.9
  - @contractspec/example.integration-stripe@1.42.9
  - @contractspec/example.kb-update-pipeline@1.42.9
  - @contractspec/example.openbanking-powens@1.42.9
  - @contractspec/example.learning-patterns@1.42.8
  - @contractspec/example.saas-boilerplate@1.42.9
  - @contractspec/example.integration-hub@1.42.9
  - @contractspec/example.knowledge-canon@1.42.9
  - @contractspec/example.personalization@1.42.9
  - @contractspec/example.wealth-snapshot@1.42.9
  - @contractspec/example.workflow-system@1.42.9
  - @contractspec/example.ai-support-bot@1.42.9
  - @contractspec/example.agent-console@1.42.9
  - @contractspec/example.lifecycle-cli@1.42.9
  - @contractspec/example.crm-pipeline@1.42.9
  - @contractspec/example.marketplace@1.42.9
  - @contractspec/example.team-hub@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.8
  - @contractspec/example.learning-journey-quest-challenges@1.42.8
  - @contractspec/example.learning-journey-crm-onboarding@1.42.8
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.8
  - @contractspec/example.learning-journey-ambient-coach@1.42.8
  - @contractspec/example.learning-journey-platform-tour@1.42.7
  - @contractspec/example.learning-journey-ui-onboarding@1.42.8
  - @contractspec/example.learning-journey-ui-coaching@1.42.8
  - @contractspec/example.learning-journey-ui-gamified@1.42.8
  - @contractspec/example.learning-journey-duo-drills@1.42.8
  - @contractspec/example.learning-journey-ui-shared@1.42.8
  - @contractspec/example.learning-journey-registry@1.42.8
  - @contractspec/example.locale-jurisdiction-gate@1.42.8
  - @contractspec/example.versioned-knowledge-base@1.42.8
  - @contractspec/example.analytics-dashboard@1.42.8
  - @contractspec/example.lifecycle-dashboard@1.42.8
  - @contractspec/example.service-business-os@1.42.8
  - @contractspec/example.content-generation@1.42.8
  - @contractspec/example.integration-stripe@1.42.8
  - @contractspec/example.kb-update-pipeline@1.42.8
  - @contractspec/example.openbanking-powens@1.42.8
  - @contractspec/example.learning-patterns@1.42.7
  - @contractspec/example.saas-boilerplate@1.42.8
  - @contractspec/example.integration-hub@1.42.8
  - @contractspec/example.knowledge-canon@1.42.8
  - @contractspec/example.personalization@1.42.8
  - @contractspec/example.wealth-snapshot@1.42.8
  - @contractspec/example.workflow-system@1.42.8
  - @contractspec/example.ai-support-bot@1.42.8
  - @contractspec/example.agent-console@1.42.8
  - @contractspec/example.lifecycle-cli@1.42.8
  - @contractspec/example.crm-pipeline@1.42.8
  - @contractspec/example.marketplace@1.42.8
  - @contractspec/example.team-hub@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.7
  - @contractspec/example.learning-journey-quest-challenges@1.42.7
  - @contractspec/example.learning-journey-crm-onboarding@1.42.7
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.7
  - @contractspec/example.learning-journey-ambient-coach@1.42.7
  - @contractspec/example.learning-journey-platform-tour@1.42.6
  - @contractspec/example.learning-journey-ui-onboarding@1.42.7
  - @contractspec/example.learning-journey-ui-coaching@1.42.7
  - @contractspec/example.learning-journey-ui-gamified@1.42.7
  - @contractspec/example.learning-journey-duo-drills@1.42.7
  - @contractspec/example.learning-journey-ui-shared@1.42.7
  - @contractspec/example.learning-journey-registry@1.42.7
  - @contractspec/example.locale-jurisdiction-gate@1.42.7
  - @contractspec/example.versioned-knowledge-base@1.42.7
  - @contractspec/example.analytics-dashboard@1.42.7
  - @contractspec/example.lifecycle-dashboard@1.42.7
  - @contractspec/example.service-business-os@1.42.7
  - @contractspec/example.content-generation@1.42.7
  - @contractspec/example.integration-stripe@1.42.7
  - @contractspec/example.kb-update-pipeline@1.42.7
  - @contractspec/example.openbanking-powens@1.42.7
  - @contractspec/example.learning-patterns@1.42.6
  - @contractspec/example.saas-boilerplate@1.42.7
  - @contractspec/example.integration-hub@1.42.7
  - @contractspec/example.knowledge-canon@1.42.7
  - @contractspec/example.personalization@1.42.7
  - @contractspec/example.wealth-snapshot@1.42.7
  - @contractspec/example.workflow-system@1.42.7
  - @contractspec/example.ai-support-bot@1.42.7
  - @contractspec/example.agent-console@1.42.7
  - @contractspec/example.lifecycle-cli@1.42.7
  - @contractspec/example.crm-pipeline@1.42.7
  - @contractspec/example.marketplace@1.42.7
  - @contractspec/example.team-hub@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.6
  - @contractspec/example.learning-journey-quest-challenges@1.42.6
  - @contractspec/example.learning-journey-crm-onboarding@1.42.6
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.6
  - @contractspec/example.learning-journey-ambient-coach@1.42.6
  - @contractspec/example.learning-journey-platform-tour@1.42.5
  - @contractspec/example.learning-journey-ui-onboarding@1.42.6
  - @contractspec/example.learning-journey-ui-coaching@1.42.6
  - @contractspec/example.learning-journey-ui-gamified@1.42.6
  - @contractspec/example.learning-journey-duo-drills@1.42.6
  - @contractspec/example.learning-journey-ui-shared@1.42.6
  - @contractspec/example.learning-journey-registry@1.42.6
  - @contractspec/example.locale-jurisdiction-gate@1.42.6
  - @contractspec/example.versioned-knowledge-base@1.42.6
  - @contractspec/example.analytics-dashboard@1.42.6
  - @contractspec/example.lifecycle-dashboard@1.42.6
  - @contractspec/example.service-business-os@1.42.6
  - @contractspec/example.content-generation@1.42.6
  - @contractspec/example.integration-stripe@1.42.6
  - @contractspec/example.kb-update-pipeline@1.42.6
  - @contractspec/example.openbanking-powens@1.42.6
  - @contractspec/example.learning-patterns@1.42.5
  - @contractspec/example.saas-boilerplate@1.42.6
  - @contractspec/example.integration-hub@1.42.6
  - @contractspec/example.knowledge-canon@1.42.6
  - @contractspec/example.personalization@1.42.6
  - @contractspec/example.wealth-snapshot@1.42.6
  - @contractspec/example.workflow-system@1.42.6
  - @contractspec/example.ai-support-bot@1.42.6
  - @contractspec/example.agent-console@1.42.6
  - @contractspec/example.lifecycle-cli@1.42.6
  - @contractspec/example.crm-pipeline@1.42.6
  - @contractspec/example.marketplace@1.42.6
  - @contractspec/example.team-hub@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.5
  - @contractspec/example.learning-journey-quest-challenges@1.42.5
  - @contractspec/example.learning-journey-crm-onboarding@1.42.5
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.5
  - @contractspec/example.learning-journey-ambient-coach@1.42.5
  - @contractspec/example.learning-journey-platform-tour@1.42.4
  - @contractspec/example.learning-journey-ui-onboarding@1.42.5
  - @contractspec/example.learning-journey-ui-coaching@1.42.5
  - @contractspec/example.learning-journey-ui-gamified@1.42.5
  - @contractspec/example.learning-journey-duo-drills@1.42.5
  - @contractspec/example.learning-journey-ui-shared@1.42.5
  - @contractspec/example.learning-journey-registry@1.42.5
  - @contractspec/example.locale-jurisdiction-gate@1.42.5
  - @contractspec/example.versioned-knowledge-base@1.42.5
  - @contractspec/example.analytics-dashboard@1.42.5
  - @contractspec/example.lifecycle-dashboard@1.42.5
  - @contractspec/example.service-business-os@1.42.5
  - @contractspec/example.content-generation@1.42.5
  - @contractspec/example.integration-stripe@1.42.5
  - @contractspec/example.kb-update-pipeline@1.42.5
  - @contractspec/example.openbanking-powens@1.42.5
  - @contractspec/example.learning-patterns@1.42.4
  - @contractspec/example.saas-boilerplate@1.42.5
  - @contractspec/example.integration-hub@1.42.5
  - @contractspec/example.knowledge-canon@1.42.5
  - @contractspec/example.personalization@1.42.5
  - @contractspec/example.wealth-snapshot@1.42.5
  - @contractspec/example.workflow-system@1.42.5
  - @contractspec/example.ai-support-bot@1.42.5
  - @contractspec/example.agent-console@1.42.5
  - @contractspec/example.lifecycle-cli@1.42.5
  - @contractspec/example.crm-pipeline@1.42.5
  - @contractspec/example.marketplace@1.42.5
  - @contractspec/example.team-hub@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.4
  - @contractspec/example.learning-journey-quest-challenges@1.42.4
  - @contractspec/example.learning-journey-crm-onboarding@1.42.4
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.4
  - @contractspec/example.learning-journey-ambient-coach@1.42.4
  - @contractspec/example.learning-journey-platform-tour@1.42.3
  - @contractspec/example.learning-journey-ui-onboarding@1.42.4
  - @contractspec/example.learning-journey-ui-coaching@1.42.4
  - @contractspec/example.learning-journey-ui-gamified@1.42.4
  - @contractspec/example.learning-journey-duo-drills@1.42.4
  - @contractspec/example.learning-journey-ui-shared@1.42.4
  - @contractspec/example.learning-journey-registry@1.42.4
  - @contractspec/example.locale-jurisdiction-gate@1.42.4
  - @contractspec/example.versioned-knowledge-base@1.42.4
  - @contractspec/example.analytics-dashboard@1.42.4
  - @contractspec/example.lifecycle-dashboard@1.42.4
  - @contractspec/example.service-business-os@1.42.4
  - @contractspec/example.content-generation@1.42.4
  - @contractspec/example.integration-stripe@1.42.4
  - @contractspec/example.kb-update-pipeline@1.42.4
  - @contractspec/example.openbanking-powens@1.42.4
  - @contractspec/example.learning-patterns@1.42.3
  - @contractspec/example.saas-boilerplate@1.42.4
  - @contractspec/example.integration-hub@1.42.4
  - @contractspec/example.knowledge-canon@1.42.4
  - @contractspec/example.personalization@1.42.4
  - @contractspec/example.wealth-snapshot@1.42.4
  - @contractspec/example.workflow-system@1.42.4
  - @contractspec/example.ai-support-bot@1.42.4
  - @contractspec/example.agent-console@1.42.4
  - @contractspec/example.lifecycle-cli@1.42.4
  - @contractspec/example.crm-pipeline@1.42.4
  - @contractspec/example.marketplace@1.42.4
  - @contractspec/example.team-hub@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/example.agent-console@1.42.3
  - @contractspec/example.ai-support-bot@1.42.3
  - @contractspec/example.analytics-dashboard@1.42.3
  - @contractspec/example.content-generation@1.42.3
  - @contractspec/example.crm-pipeline@1.42.3
  - @contractspec/example.integration-hub@1.42.3
  - @contractspec/example.integration-stripe@1.42.3
  - @contractspec/example.kb-update-pipeline@1.42.3
  - @contractspec/example.knowledge-canon@1.42.3
  - @contractspec/example.learning-journey-ambient-coach@1.42.3
  - @contractspec/example.learning-journey-crm-onboarding@1.42.3
  - @contractspec/example.learning-journey-duo-drills@1.42.3
  - @contractspec/example.learning-journey-platform-tour@1.42.2
  - @contractspec/example.learning-journey-quest-challenges@1.42.3
  - @contractspec/example.learning-journey-registry@1.42.3
  - @contractspec/example.learning-journey-studio-onboarding@1.42.3
  - @contractspec/example.learning-journey-ui-coaching@1.42.3
  - @contractspec/example.learning-journey-ui-gamified@1.42.3
  - @contractspec/example.learning-journey-ui-onboarding@1.42.3
  - @contractspec/example.learning-journey-ui-shared@1.42.3
  - @contractspec/example.learning-patterns@1.42.2
  - @contractspec/example.lifecycle-cli@1.42.3
  - @contractspec/example.lifecycle-dashboard@1.42.3
  - @contractspec/example.locale-jurisdiction-gate@1.42.3
  - @contractspec/example.marketplace@1.42.3
  - @contractspec/example.openbanking-powens@1.42.3
  - @contractspec/example.personalization@1.42.3
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.3
  - @contractspec/example.saas-boilerplate@1.42.3
  - @contractspec/example.service-business-os@1.42.3
  - @contractspec/example.team-hub@1.42.3
  - @contractspec/example.versioned-knowledge-base@1.42.3
  - @contractspec/example.wealth-snapshot@1.42.3
  - @contractspec/example.workflow-system@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/example.agent-console@1.42.2
  - @contractspec/example.ai-support-bot@1.42.2
  - @contractspec/example.analytics-dashboard@1.42.2
  - @contractspec/example.content-generation@1.42.2
  - @contractspec/example.crm-pipeline@1.42.2
  - @contractspec/example.integration-hub@1.42.2
  - @contractspec/example.integration-stripe@1.42.2
  - @contractspec/example.kb-update-pipeline@1.42.2
  - @contractspec/example.knowledge-canon@1.42.2
  - @contractspec/example.learning-journey-ambient-coach@1.42.2
  - @contractspec/example.learning-journey-crm-onboarding@1.42.2
  - @contractspec/example.learning-journey-duo-drills@1.42.2
  - @contractspec/example.learning-journey-platform-tour@1.42.2
  - @contractspec/example.learning-journey-quest-challenges@1.42.2
  - @contractspec/example.learning-journey-registry@1.42.2
  - @contractspec/example.learning-journey-studio-onboarding@1.42.2
  - @contractspec/example.learning-journey-ui-coaching@1.42.2
  - @contractspec/example.learning-journey-ui-gamified@1.42.2
  - @contractspec/example.learning-journey-ui-onboarding@1.42.2
  - @contractspec/example.learning-journey-ui-shared@1.42.2
  - @contractspec/example.learning-patterns@1.42.2
  - @contractspec/example.lifecycle-cli@1.42.2
  - @contractspec/example.lifecycle-dashboard@1.42.2
  - @contractspec/example.locale-jurisdiction-gate@1.42.2
  - @contractspec/example.marketplace@1.42.2
  - @contractspec/example.openbanking-powens@1.42.2
  - @contractspec/example.personalization@1.42.2
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.2
  - @contractspec/example.saas-boilerplate@1.42.2
  - @contractspec/example.service-business-os@1.42.2
  - @contractspec/example.team-hub@1.42.2
  - @contractspec/example.versioned-knowledge-base@1.42.2
  - @contractspec/example.wealth-snapshot@1.42.2
  - @contractspec/example.workflow-system@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/example.learning-journey-studio-onboarding@1.42.1
  - @contractspec/example.learning-journey-quest-challenges@1.42.1
  - @contractspec/example.learning-journey-crm-onboarding@1.42.1
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.1
  - @contractspec/example.learning-journey-ambient-coach@1.42.1
  - @contractspec/example.learning-journey-platform-tour@1.42.1
  - @contractspec/example.learning-journey-ui-onboarding@1.42.1
  - @contractspec/example.learning-journey-ui-coaching@1.42.1
  - @contractspec/example.learning-journey-ui-gamified@1.42.1
  - @contractspec/example.learning-journey-duo-drills@1.42.1
  - @contractspec/example.learning-journey-ui-shared@1.42.1
  - @contractspec/example.learning-journey-registry@1.42.1
  - @contractspec/example.locale-jurisdiction-gate@1.42.1
  - @contractspec/example.versioned-knowledge-base@1.42.1
  - @contractspec/example.analytics-dashboard@1.42.1
  - @contractspec/example.lifecycle-dashboard@1.42.1
  - @contractspec/example.service-business-os@1.42.1
  - @contractspec/example.content-generation@1.42.1
  - @contractspec/example.integration-stripe@1.42.1
  - @contractspec/example.kb-update-pipeline@1.42.1
  - @contractspec/example.openbanking-powens@1.42.1
  - @contractspec/example.learning-patterns@1.42.1
  - @contractspec/example.saas-boilerplate@1.42.1
  - @contractspec/example.integration-hub@1.42.1
  - @contractspec/example.knowledge-canon@1.42.1
  - @contractspec/example.personalization@1.42.1
  - @contractspec/example.wealth-snapshot@1.42.1
  - @contractspec/example.workflow-system@1.42.1
  - @contractspec/example.ai-support-bot@1.42.1
  - @contractspec/example.agent-console@1.42.1
  - @contractspec/example.lifecycle-cli@1.42.1
  - @contractspec/example.crm-pipeline@1.42.1
  - @contractspec/example.marketplace@1.42.1
  - @contractspec/example.team-hub@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/example.agent-console@1.42.0
  - @contractspec/example.ai-support-bot@1.42.0
  - @contractspec/example.analytics-dashboard@1.42.0
  - @contractspec/example.content-generation@1.42.0
  - @contractspec/example.crm-pipeline@1.42.0
  - @contractspec/example.integration-hub@1.42.0
  - @contractspec/example.integration-stripe@1.42.0
  - @contractspec/example.kb-update-pipeline@1.42.0
  - @contractspec/example.knowledge-canon@1.42.0
  - @contractspec/example.learning-journey-ambient-coach@1.42.0
  - @contractspec/example.learning-journey-crm-onboarding@1.42.0
  - @contractspec/example.learning-journey-duo-drills@1.42.0
  - @contractspec/example.learning-journey-platform-tour@1.42.0
  - @contractspec/example.learning-journey-quest-challenges@1.42.0
  - @contractspec/example.learning-journey-registry@1.42.0
  - @contractspec/example.learning-journey-studio-onboarding@1.42.0
  - @contractspec/example.learning-journey-ui-coaching@1.42.0
  - @contractspec/example.learning-journey-ui-gamified@1.42.0
  - @contractspec/example.learning-journey-ui-onboarding@1.42.0
  - @contractspec/example.learning-journey-ui-shared@1.42.0
  - @contractspec/example.learning-patterns@1.42.0
  - @contractspec/example.lifecycle-cli@1.42.0
  - @contractspec/example.lifecycle-dashboard@1.42.0
  - @contractspec/example.locale-jurisdiction-gate@1.42.0
  - @contractspec/example.marketplace@1.42.0
  - @contractspec/example.openbanking-powens@1.42.0
  - @contractspec/example.personalization@1.42.0
  - @contractspec/example.policy-safe-knowledge-assistant@1.42.0
  - @contractspec/example.saas-boilerplate@1.42.0
  - @contractspec/example.service-business-os@1.42.0
  - @contractspec/example.team-hub@1.42.0
  - @contractspec/example.versioned-knowledge-base@1.42.0
  - @contractspec/example.wealth-snapshot@1.42.0
  - @contractspec/example.workflow-system@1.42.0
