# Patch Notes



### Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- Slug: adaptive-object-reference-panel
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Design-system now exposes AdaptivePanel as the shared responsive sheet/drawer primitive and wires object-reference details through it.

### Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- Slug: adaptive-panel-menu-migration
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)
- Maintainer: Header and marketing header mobile menus now use AdaptivePanel instead of direct sheet composition, leaving sheet/drawer primitives behind the shared overlay adapter.

### Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Slug: adoption-engine-and-authoring-targets
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/module.workspace@4.3.8 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/bundle.library@3.10.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- vscode-contractspec@3.10.12 (minor)
- contractspec@1.46.2 (patch)
- @contractspec/lib.knowledge@3.8.4 (patch)
- @contractspec/biome-config@3.8.11 (patch)
- @contractspec/app.cursor-marketplace (patch)
- Maintainer: Maintainers get a shared adoption catalog and resolver, Connect adoption hooks, MCP exposure for reuse decisions, expanded authoring-target coverage, and updated static policy artifacts.

### Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
- Slug: application-shell-navigation
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- Maintainer: Design-system maintainers now have a focused shell API for application frames, navigation sections, breadcrumbs, commands, and page outlines.

### Document AppShell in-app notification adoption and refresh shell implementation prompts.
- Slug: application-shell-notification-docs
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers get updated copy-ready AI prompts that include library-first notification imports, shell notification props, and migration from legacy notification module imports.

### Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- Slug: appshell-notification-layout
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)

### Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Slug: build-cache-stabilization
- Date: 2026-04-29
- Breaking: no
- contractspec@1.46.2 (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/tool.docs-generator@3.7.27 (patch)
- @contractspec/biome-config@3.8.11 (patch)
- Maintainer: Repeated local builds now hit Turbo cache after an initial run because generated timestamps, temporary TypeScript configs, generated roots, and source handlers no longer poison task hashes.

### Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- Slug: builder-local-onboarding-api-resolution
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.workspace@4.7.0 (patch)
- @contractspec/app.cli-contractspec@6.3.2 (patch)
- Maintainer: Builder-local setup now writes control-plane API defaults, doctor checks all Builder presets for missing auth, and the Builder CLI reads `.contractsrc.json` before falling back to the default hosted API.

### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Slug: builder-next-wave-hardening
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.builder-spec@0.2.10 (minor)
- @contractspec/lib.builder-runtime@0.2.10 (minor)
- @contractspec/lib.mobile-control@0.2.10 (minor)
- @contractspec/lib.provider-runtime@0.2.10 (minor)
- @contractspec/module.builder-workbench@0.2.13 (minor)
- @contractspec/module.mobile-review@0.2.13 (minor)
- @contractspec/integration.runtime.local@0.2.10 (minor)
- @contractspec/integration.provider.gemini@0.2.9 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: Builder bootstrap presets, local-daemon registration, and mobile/operator status views now move together as one governed rollout surface.

### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Slug: builder-v3-control-plane-rollout
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/lib.builder-spec@0.2.10 (minor)
- @contractspec/lib.provider-spec@0.2.8 (minor)
- @contractspec/lib.builder-runtime@0.2.10 (minor)
- @contractspec/lib.mobile-control@0.2.10 (minor)
- @contractspec/lib.provider-runtime@0.2.10 (minor)
- @contractspec/module.builder-workbench@0.2.13 (minor)
- @contractspec/module.mobile-review@0.2.13 (minor)
- @contractspec/integration.runtime@3.10.0 (minor)
- @contractspec/integration.runtime.managed@0.2.10 (minor)
- @contractspec/integration.runtime.local@0.2.10 (minor)
- @contractspec/integration.runtime.hybrid@0.2.10 (minor)
- @contractspec/integration.builder-telegram@0.2.10 (minor)
- @contractspec/integration.builder-voice@0.2.10 (minor)
- @contractspec/integration.builder-whatsapp@0.2.10 (minor)
- @contractspec/integration.provider.codex@0.2.9 (minor)
- @contractspec/integration.provider.claude-code@0.2.9 (minor)
- @contractspec/integration.provider.gemini@0.2.9 (minor)
- @contractspec/integration.provider.copilot@0.2.9 (minor)
- @contractspec/integration.provider.stt@0.2.9 (minor)
- @contractspec/integration.provider.local-model@0.2.9 (minor)
- Maintainer: Builder v3 now has a governed contract, runtime, and provider surface that keeps authoring, readiness, and export orchestration aligned across the package stack.

### Add reusable BYOK and environment alias UI helpers for integration setup.
- Slug: byok-env-ui-kit
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (minor)
- Maintainer: Integration UI helpers preserve redaction guarantees by displaying secret references and required status without serializing raw secret values.

### Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- Slug: byok-monorepo-env-config
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-integrations@3.9.0 (minor)
- @contractspec/integration.runtime@3.10.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- Maintainer: Integration specs can expose managed/BYOK credential manifests while runtime reports redact secret and sensitive values.

### Unify release authoring around guided capsules, canonical generated artifacts, and manifest-backed changelog surfaces.
- Slug: canonical-release-pipeline
- Date: 2026-04-29
- Breaking: yes
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (major)
- @contractspec/action.version@3.0.8 (major)
- @contractspec/app.web-landing@3.8.12 (patch)
- Maintainer: Release preparation now runs through guided `contractspec release prepare` and `contractspec release edit` flows, generated release artifacts become the canonical source of truth, and stable publish automation creates a GitHub Release from patch notes plus attached release artifacts.
- Deprecations:
  - `contractspec changelog generate` is no longer the supported release-authoring flow.
  - `contractspec changelog show` is no longer the supported public release surface.

### Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
- Slug: catalog-rhf-upgrade-hardening
- Date: 2026-04-29
- Breaking: no
- contractspec@1.46.2 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Maintainer: Shared dependency families now resolve from named Bun catalogs, reducing repeated version drift across workspace manifests.

### Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
- Slug: cli-onboard-guided-adoption
- Date: 2026-04-29
- Breaking: no
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/bundle.library@3.10.0 (minor)
- Maintainer: Maintainers get a single onboarding catalog and planner that powers CLI output, managed repo guides, Connect-compatible evidence, and the CLI MCP onboarding resources.

### Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Slug: connect-spec-alignment-april-2026
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- agentpacks@1.8.0 (minor)
- Maintainer: Connect is now a governed repo surface with CLI commands, workspace services, and versioned docs that keep risky edits, review packets, and replay artifacts aligned.

### Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Slug: contract-dx-first-slice
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/module.workspace@4.3.8 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- Maintainer: Maintainers can rely on authored validators for app-config, theme, and feature specs instead of shallow per-surface checks, and can scaffold theme specs directly from the CLI.

### Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Slug: contracts-spec-root-crypto-surface
- Date: 2026-04-29
- Breaking: yes
- @contractspec/lib.contracts-spec@6.3.0 (major)

### Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Slug: contractspec-i18n-runtime
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.translation-runtime@0.2.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/example.locale-jurisdiction-gate@3.7.28 (patch)
- Maintainer: Translation specs now keep stable bundle identity separate from locale variants while the runtime owns formatter-backed ICU resolution, fallback chains, overrides, diagnostics, async loading, SSR snapshots, and optional downstream i18next projection.

### Add an optional ContractSpec-first i18next adapter for downstream interoperability.
- Slug: contractspec-i18next-adapter
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.translation-runtime@0.2.1 (minor)
- Maintainer: The translation runtime now exposes an optional `./i18next` subpath while keeping the root runtime and ContractSpec registry i18next-free.

### Add a copy mode for public CSS style entries so packages can preserve Tailwind and other framework directives.
- Slug: copy-css-style-entries
- Date: 2026-04-29
- Breaking: no
- @contractspec/tool.bun@3.7.18 (patch)
- Maintainer: Style entry processing now has explicit build and copy modes while keeping `build` as the default for compatibility.

### Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Slug: cross-platform-jsx-biome-guardrails
- Date: 2026-04-29
- Breaking: no
- @contractspec/biome-config@3.8.11 (patch)
- contractspec@1.46.2 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit-core@3.8.8 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- Maintainer: Maintainers get generated repo and consumer Biome presets that reject raw layout tags and raw JSX text outside typography components, with monorepo apps excluded by default and a style-preserving fixer command for deterministic replacements.

### Add a dedicated cross-platform UI docs page and AGENTS/rules guidance that explain how the React, React Native, runtime, primitive UI, and design-system layers stay compatible.
- Slug: cross-platform-ui-docs
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: Maintainers now have a dedicated website docs page, exported bundle-library docs component, and package/rule guidance for explaining the React and React Native UI layering model.

### Add template-aware import mapping with column aliases, flexible value formatting, codec options, client review state, and server audit evidence.
- Slug: data-exchange-import-templates
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.data-exchange-core@0.3.1 (minor)
- @contractspec/lib.data-exchange-client@0.3.1 (minor)
- @contractspec/lib.data-exchange-server@0.3.1 (minor)
- Maintainer: Maintainers can define reusable import templates that resolve incoming file columns through aliases, normalized labels, and SchemaModel fallback inference.

### Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
- Slug: data-exchange-stack
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.data-exchange-core@0.3.1 (minor)
- @contractspec/lib.data-exchange-server@0.3.1 (minor)
- @contractspec/lib.data-exchange-client@0.3.1 (minor)
- @contractspec/lib.exporter (patch)
- Maintainer: Maintainers now have a dedicated data-interchange package family instead of the orphaned `lib.exporter` stub, with SchemaModel-driven planning in core, adapter-based execution on the server, and reusable mapping/review controllers on the client.
- Deprecations:
  - `@contractspec/lib.exporter` remains as a compatibility shim; prefer `@contractspec/lib.data-exchange-core` for new import/export work.

### Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Slug: data-table-overflow-policy
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.presentation-runtime-core@5.2.2 (minor)
- @contractspec/lib.presentation-runtime-react@40.0.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/module.workspace@4.3.8 (patch)
- @contractspec/bundle.workspace@4.7.0 (patch)
- @contractspec/app.cli-contractspec@6.3.2 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: DataView contracts, renderers, scaffolds, and docs now expose overflow hints and typed data hints end-to-end, from spec authoring through table rendering and generated starter files.

### Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Slug: data-table-ux-stability-upgrade
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.presentation-runtime-react@40.0.2 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.data-grid-showcase@3.8.23 (patch)
- Maintainer: The shared table controller now sanitizes stale row and column state, and the design-system exports `DataTableToolbar` as the preferred composed UX layer above the primitive tables.

### Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Slug: data-views-collection-readiness
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/module.workspace@4.3.8 (patch)
- @contractspec/bundle.workspace@4.7.0 (patch)
- @contractspec/app.cli-contractspec@6.3.2 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: DataView collection specs now share view-mode, toolbar, pagination, and density defaults under view.collection.

### Add preference-aware DataView collection defaults and personalization adapters.
- Slug: data-views-personalization-integration
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.personalization@6.1.1 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: DataView contracts now expose neutral data-depth and collection personalization hints while keeping contracts-spec independent from personalization runtime code.

### Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
- Slug: dependency-bundle-size-reduction
- Date: 2026-04-29
- Breaking: yes
- @contractspec/lib.ui-kit@4.1.5 (major)
- @contractspec/integration.providers-impls@4.1.4 (major)
- @contractspec/lib.runtime-sandbox@3.0.7 (major)
- @contractspec/lib.example-shared-ui@7.0.8 (major)
- @contractspec/lib.video-gen@3.0.8 (major)
- @contractspec/lib.ui-kit-web@3.13.3 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/app.api-library (patch)
- @contractspec/app.registry-packs@1.7.22 (patch)
- vscode-contractspec@3.10.12 (patch)
- @contractspec/example.project-management-sync@3.7.29 (patch)
- @contractspec/example.voice-providers@3.7.29 (patch)
- @contractspec/example.meeting-recorder-providers@3.7.29 (patch)
- @contractspec/example.integration-posthog@3.7.29 (patch)
- contractspec@1.46.2 (patch)
- Maintainer: The repo now includes `bun run deps:audit` to report dependency sections, duplicate declarations, missing runtime import signals, heavy dependency families, and largest dist outputs.

### Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Slug: design-system-core-hardening
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Maintainers now have smaller internal design-system modules and focused subpaths for theme, controls, forms, layout, and renderers.

### Add grouped option support to design-system Select controls across web and native.
- Slug: design-system-select-groups
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: The design-system Select wrappers now share grouped-option normalization and expose a typed grouped Select API.

### Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Slug: design-system-themed-controls
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Maintainers now have a shared design-system control boundary for forms, stacks, themes, translations, and FormSpec rendering.

### Wrap UI-backed docs example previews in the template runtime provider so public example pages prerender with the same runtime boundary as sandbox and template previews.
- Slug: docs-example-runtime-preview
- Date: 2026-04-29
- Breaking: no
- @contractspec/app.web-landing (patch)
- Maintainer: The `/docs/examples/<key>` inline preview section now initializes `TemplateRuntimeProvider` for examples with inline runtime UI while preserving lightweight fallback previews for non-UI examples.

### Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Slug: docs-governance-sync
- Date: 2026-04-29
- Breaking: no
- contractspec@1.46.2 (patch)
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers now have aligned root guidance, package docs, website docs, and release-manifest-backed changelog copy for the current Connect, Builder, and release-capsule workflows.

### Expand the spec-pack docs into a fuller learning path across the public docs site.
- Slug: docs-learning-path-spec-packs
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: The docs bundle and web app now expose Connect, module-bundle, and Builder workbench guides as one linked learning path instead of isolated pages.

### Document and link object-reference adoption and adaptive panel guidance in the public docs bundle.
- Slug: document-object-reference-adoption
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: The design-system docs now cover ObjectReferenceHandler descriptors, rich properties and sections, action handlers, safe hrefs, AdaptivePanel behavior, adoption prompts, and sidebar discovery.

### Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Slug: early-cats-tap
- Date: 2026-04-29
- Breaking: no
- Maintainer: Workflow templates, docs, and devkit code now avoid broad workflow barrel imports in sandboxed workflow entrypoints.
- Deprecations:
  - Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.

### Speed up npm release publishing by removing per-package dist-tag convergence polling after successful dist-tag updates.
- Slug: fast-npm-dist-tag-reconciliation
- Date: 2026-04-29
- Breaking: no
- contractspec@1.46.2 (patch)
- Maintainer: Stable and canary npm release jobs now avoid the repeated dist-tag verification sleep loop after `npm dist-tag add` succeeds.

### Add a governed public finance-ops workflow template with replay proof and inline web template preview support.
- Slug: finance-ops-ai-workflows-template
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.finance-ops-ai-workflows@1.1.3 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers now have a public deterministic finance-ops example package covering mission intake, cash-aging prioritization, procedure drafting, reporting narrative composition, AI usage governance, and an inline UI preview.

### Expand the Finance Ops AI Workflows preview into an operator cockpit and refresh the generated LLMS package surface for it.
- Slug: finance-ops-demo-preview
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.finance-ops-ai-workflows@1.1.3 (minor)
- @contractspec/app.web-landing (patch)
- Maintainer: The finance-ops example now ships richer preview fixtures, deterministic replay controls, local draft-review state, and refreshed docs surface exports for the showcase route.

### Make the form-only showcase previewable from the templates catalog and restore sandbox routing for non-inline template previews.
- Slug: form-showcase-preview-routing
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.form-showcase@1.1.4 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: The generated example preview registry now includes the form-showcase UI entrypoint, while marketing preview actions distinguish inline previews from sandbox-only examples.

### Replace the form showcase preview blueprint with a real form-control demonstration.
- Slug: form-showcase-real-controls
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.form-showcase@1.1.4 (patch)
- Maintainer: The form-showcase UI preview now composes real controls instead of listing field kinds as metadata.

### Add a form-only example template and public docs links for ContractSpec form adoption.
- Slug: form-showcase-template
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.form-showcase@1.1.4 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers get a dedicated `@contractspec/example.form-showcase` package registered through the generated examples catalog.

### Improve FormSpec autocomplete rendering and resolver-backed search.
- Slug: forms-autocomplete-combobox
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (minor)
- Maintainer: FormSpec autocomplete docs now describe local and resolver-backed authoring without adding transport fields to the contract.

### Keep web FormSpec datetime controls inside their responsive form columns.
- Slug: forms-datetime-containment
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Maintainer: The web datetime picker now gives its composite date and time controls shrinkable width constraints.

### Add first-class FormSpec email fields with native renderer affordances.
- Slug: forms-email-field
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Maintainers can declare single-address email inputs with `kind: "email"` while keeping validation in the form model.

### Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Slug: forms-email-input-safety
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- Maintainer: The React FormSpec renderer now treats `uiProps` as optional for email and text fields, and design-system inputs preserve explicit HTML input props over default keyboard hints.

### Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Slug: forms-layout-input-groups
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Maintainer: Maintainers can express richer FormSpec layout and field chrome without embedding renderer-specific UI.
- Deprecations:
  - `FieldSpec.wrapper.orientation` remains supported but should be replaced by `FieldSpec.layout.orientation` in new specs.

### Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- Slug: forms-numeric-temporal-fields
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: FormSpec contracts and examples can now declare numeric and temporal field-specific formatting metadata without bespoke renderer code.

### Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
- Slug: forms-option-surface-aliases
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)
- Maintainer: The ThemeSpec Tailwind bridge now emits shadcn-compatible color aliases for popover, card, and input surfaces.

### Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Slug: forms-password-rendering
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (minor)
- @contractspec/lib.ui-kit@4.1.5 (minor)
- @contractspec/lib.ui-kit-core@3.8.8 (patch)
- Maintainer: Maintainers can declare current and new password fields as additive FormSpec text metadata.

### Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- Slug: forms-password-visibility-toggle
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Maintainer: The web password primitive now keeps its computed `type` authoritative over upstream input props from FormSpec renderers.

### Fix FormSpec phone country-select rendering to remove duplicated country adornments.
- Slug: forms-phone-ux-regression
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)

### Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
- Slug: forms-progressive-layout
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Maintainers can declare progressive form sections or steps as additive FormSpec layout metadata while keeping the field list canonical.

### Add mobile-safe FormSpec layout helpers and scoped DataView filters.
- Slug: formspec-layout-scoped-filters
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.presentation-runtime-core@5.2.2 (minor)
- @contractspec/lib.presentation-runtime-react@40.0.2 (minor)
- @contractspec/lib.presentation-runtime-react-native@40.0.2 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Maintainers can add mobile-safe FormSpec layout metadata and first-class scoped filter contracts without breaking existing numeric layout semantics.

### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
- Slug: fresh-toes-build
- Date: 2026-04-29
- Breaking: no
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/lib.accessibility@3.7.30 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/lib.example-shared-ui@7.0.8 (patch)
- @contractspec/lib.presentation-runtime-react@40.0.2 (patch)
- @contractspec/lib.surface-runtime@0.5.28 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-link@3.7.23 (patch)
- @contractspec/lib.video-gen@3.0.8 (patch)
- @contractspec/module.builder-workbench@0.2.13 (patch)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/module.execution-console@0.1.14 (patch)
- @contractspec/module.mobile-review@0.2.13 (patch)
- Maintainer: Shared Bun transpile paths now force production JSX mode, and the affected published browser bundles were rebuilt against that fix.

### Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
- Slug: guided-authoring-workspace-form-rollout
- Date: 2026-04-29
- Breaking: yes
- contractspec@1.46.2 (major)
- @contractspec/app.cli-contractspec@6.3.2 (major)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/module.workspace@4.3.8 (minor)
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-core@3.8.8 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (minor)
- @contractspec/lib.ui-kit@4.1.5 (minor)
- vscode-contractspec@3.10.12 (minor)
- Maintainer: Maintainers can ship the CLI and workspace packages with preset-driven setup, generated contractsrc schema assets, authoring-target discovery, and unified package-scaffold validation from the same release.
- Deprecations:
  - The standalone contractspec apply command has been removed; use contractspec generate for write-generation flows.

### Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
- Slug: harness-browser-verification
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.harness@0.3.4 (minor)
- @contractspec/integration.harness-runtime@0.3.4 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/example.harness-lab@3.8.4 (minor)
- Maintainer: Harness scenarios now support typed browser actions, auth profile refs, visual-diff assertions, setup/reset hook execution, required evidence enforcement, success rules, and a shared CLI runtime used by both `contractspec harness eval` and `contractspec connect eval`.

### Add inline preview support for the Wealth Snapshot and Pocket Family Office examples in the templates catalog.
- Slug: inline-finance-example-previews
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.pocket-family-office@3.8.3 (minor)
- @contractspec/example.wealth-snapshot@3.8.3 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: The two finance example packages now publish `./ui` preview entrypoints, and the generated examples preview registry recognizes both exports.

### Teach the Integration Hub example to model managed/BYOK credential setup and monorepo-aware env aliases.
- Slug: integration-hub-byok-env-example
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.integration-hub@3.9.0 (minor)
- Maintainer: Maintainers get regression-covered setup fixtures that exercise public-prefix aliasing without exposing secret fields through client env names.

### Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- Slug: knowledge-indexed-payload-hardening
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.knowledge@3.8.4 (patch)
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- Maintainer: The knowledge ingestion/query path now persists fragment text into vector payloads, package tests cover the corrected behavior, and the knowledge doc surfaces were refreshed.

### Complete the knowledge OSS surface with stricter guardrails and an easier runtime path.
- Slug: knowledge-runtime-hardening
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.knowledge@3.8.4 (minor)
- @contractspec/example.knowledge-canon@3.8.4 (minor)
- Maintainer: Maintainers get a stricter, better-tested knowledge package and a concrete example surface that proves the OSS path end to end.

### Add a shared marketing content/navigation surface and convert the Expo demo into a native public-nav companion for the ContractSpec OSS-first story.
- Slug: mobile-expo-landing-companion
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.marketing@3.8.24 (patch)
- Maintainer: Marketing now exposes React-free landing story, page, navigation, and CTA data through `@contractspec/bundle.marketing/content`, and the Expo demo consumes that content through mobile-native components and ContractSpec handlers.

### Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Slug: mobile-form-render-polyfill
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/tool.bun@3.7.18 (patch)
- Maintainer: Form rendering now supports host-provided layout slots and button-driven submission while design-system builds no-bundle artifacts that keep package imports visible to platform aliasing.

### Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
- Slug: mobile-native-chart-gesture-runtime
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- @contractspec/app.expo-demo (patch)
- Maintainer: The Metro alias helper now maps native `tslib` imports to the ESM helper build, and the Expo demo initializes gesture handling at the entrypoint and root layout.

### Promote the Expo demo Examples surface to first-class navigation and reuse shared preview components so mobile and web example previews stay aligned.
- Slug: mobile-web-example-parity
- Date: 2026-04-29
- Breaking: no
- @contractspec/app.expo-demo (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/example.agent-console@3.8.23 (patch)
- @contractspec/module.examples@4.0.8 (minor)
- Maintainer: Example preview routing now uses shared catalog helpers and a reusable Agent Console preview component instead of platform-specific allowlists or bespoke mobile summaries.

### Replace the native UI-kit data table resize handle's gesture-handler dependency with a Reanimated responder boundary.
- Slug: native-data-table-reanimated-resize
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Maintainer: The data table resize handle now uses Reanimated and native responder events instead of importing `react-native-gesture-handler`.
- Deprecations:
  - Do not import `react-native-gesture-handler` for the native UI-kit data table resize handle; use the Reanimated-backed implementation.

### Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Slug: native-design-system-platform-suffix
- Date: 2026-04-29
- Breaking: yes
- @contractspec/lib.design-system@4.4.2 (major)
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- Maintainer: Package exports, registry metadata, and cross-platform UI docs now describe `.tsx` / `.native.tsx` renderer pairs.
- Deprecations:
  - Direct imports such as `@contractspec/lib.design-system/components/molecules/Tabs.mobile` have been replaced by `.native` subpaths.

### Harden native Pagination layout with shared stack primitives, safer page math, and accessible control labels.
- Slug: native-pagination-stack-hardening
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Maintainer: The native Pagination atom now relies on UI-kit stack primitives instead of raw View layout wrappers and keeps its visible page-window calculation typed outside render.

### Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Slug: native-publish-closure
- Date: 2026-04-29
- Breaking: no
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/module.ai-chat@4.3.31 (patch)
- Maintainer: Native builds now include generic shared entries in dist/native so native public exports have a resolvable helper closure.

### Keep shared table string headers and cells as primitive render-model values so React Native table renderers can wrap them in Text.
- Slug: native-table-primitive-rendering
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.presentation-runtime-react@40.0.2 (patch)
- @contractspec/lib.presentation-runtime-react-native@40.0.2 (patch)
- Maintainer: The TanStack-backed table controller now resolves its internal header and cell templates directly instead of returning React component wrappers for primitive strings.

### Add native UI-kit subpaths for Metro's ui-kit-web alias surface so Expo builds can resolve shared design-system form controls.
- Slug: native-ui-kit-metro-aliases
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Maintainer: Native UI-kit now exposes the subpaths Metro rewrites from ui-kit-web for shared design-system form controls.

### Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Slug: notification-library-shell
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.notification@0.2.1 (minor)
- @contractspec/module.notifications@3.8.4 (patch)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.wealth-snapshot@3.8.3 (patch)
- @contractspec/example.saas-boilerplate@3.8.23 (patch)
- Maintainer: Notification contracts now live in contracts-spec, reusable notification helpers live in lib.notification, and the old module remains as a compatibility shim.
- Deprecations:
  - The `@contractspec/module.notifications` package remains import-compatible for this release, but new code should import contracts from `@contractspec/lib.contracts-spec/notifications` and runtime helpers from `@contractspec/lib.notification`.

### Normalize notification template locale resolution and merge partial locale channel overrides without dropping base channel content.
- Slug: notifications-template-locale-hardening
- Date: 2026-04-29
- Breaking: no
- @contractspec/module.notifications@3.8.4 (patch)
- Maintainer: Notification template rendering now resolves regional locales like `fr-CA` through the shared locale resolver and allows locale overrides to override only the fields that changed.

### Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
- Slug: notion-page-outline
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)
- Maintainer: Design-system maintainers can opt PageOutline into a floating variant while preserving existing rail and compact variants.

### Add an extensible design-system object reference handler for actionable references.
- Slug: object-reference-handler
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: The design-system package now exposes a public object-reference component group with schema-friendly descriptors, runtime action handlers, and paired web/native implementations.

### Add concrete omnichannel notification channels for email, SMS, Telegram, and WhatsApp.
- Slug: omnichannel-notifications
- Date: 2026-04-29
- Breaking: no
- @contractspec/module.notifications@3.8.4 (minor)
- Maintainer: Maintainers can wire provider-backed notification channels directly from the module instead of supplying their own email or messaging adapter layer.

### Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Slug: pagination-stack-layout
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Maintainer: The pagination primitive now consumes the shared `HStack` API and `hStackVariants` instead of hand-rolled flex classes.

### Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Slug: phone-number-field-support
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: FormSpec phone contracts now expose input, output, country, and display configuration while keeping the schema-owned value model backward compatible.

### Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Slug: platform-suffix-bun-build
- Date: 2026-04-29
- Breaking: no
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- Maintainer: contractspec-bun-build now treats ios and android as native-family platform variants while keeping web and native export behavior stable.

### Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
- Slug: presentation-lucide-aliases
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- Maintainer: Presentation alias helpers now treat lucide icons as a platform pair alongside the UI-kit and presentation-runtime package pairs.

### Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Slug: presentation-runtime-bundler-split
- Date: 2026-04-29
- Breaking: yes
- @contractspec/lib.presentation-runtime-core@5.2.2 (major)
- Maintainer: Maintainers now configure shared rendering aliases with explicit Webpack and Turbopack helpers instead of the overloaded Next helper name, while Metro behavior stays unchanged and package exports point at generated dist artifacts.

### Add PWA update management contracts and runtime helpers.
- Slug: pwa-update-management
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-server-rest@3.9.1 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- Maintainer: Maintainers get typed contracts, registry helpers, server evaluation helpers, and React prompt state helpers for PWA update workflows.

### Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
- Slug: quiet-learning-thread
- Date: 2026-04-29
- Breaking: yes
- @contractspec/module.learning-journey@4.0.8 (major)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/example.learning-journey-ambient-coach@4.0.8 (major)
- @contractspec/example.learning-journey-crm-onboarding@4.0.11 (major)
- @contractspec/example.learning-journey-duo-drills@4.0.8 (major)
- @contractspec/example.learning-journey-platform-tour@4.0.8 (major)
- @contractspec/example.learning-journey-quest-challenges@4.0.8 (major)
- @contractspec/example.learning-journey-registry@4.0.11 (major)
- @contractspec/example.learning-journey-studio-onboarding@4.0.8 (major)
- @contractspec/example.learning-journey-ui-coaching@4.0.11 (major)
- @contractspec/example.learning-journey-ui-gamified@4.0.11 (major)
- @contractspec/example.learning-journey-ui-onboarding@4.0.11 (major)
- @contractspec/example.learning-journey-ui-shared@4.0.11 (major)
- @contractspec/example.learning-patterns@4.0.8 (major)
- Maintainer: The learning stack now uses the adaptive `learning.journey.*` runtime and the sandbox resolves shared learning registry presentations through `@contractspec/module.examples`.

### Restore npm provenance-safe publishing for the public integration packages by declaring repository metadata and failing release discovery before publish when it is missing.
- Slug: release-provenance-metadata-fix
- Date: 2026-04-29
- Breaking: no
- @contractspec/integration.builder-telegram@0.2.10 (patch)
- @contractspec/integration.builder-voice@0.2.10 (patch)
- @contractspec/integration.builder-whatsapp@0.2.10 (patch)
- @contractspec/integration.provider.claude-code@0.2.9 (patch)
- @contractspec/integration.provider.codex@0.2.9 (patch)
- @contractspec/integration.provider.copilot@0.2.9 (patch)
- @contractspec/integration.provider.gemini@0.2.9 (patch)
- @contractspec/integration.provider.local-model@0.2.9 (patch)
- @contractspec/integration.provider.stt@0.2.9 (patch)
- @contractspec/integration.runtime.hybrid@0.2.10 (patch)
- @contractspec/integration.runtime.local@0.2.10 (patch)
- @contractspec/integration.runtime.managed@0.2.10 (patch)
- Maintainer: Release discovery now blocks publishable manifests that omit repository metadata, and the affected integration packages declare the canonical GitHub repository URL and directory before npm provenance is requested.

### Render resolver-backed combobox results as a floating overlay instead of inline form content.
- Slug: resolver-autocomplete-floating-overlay
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Maintainer: Editable/query combobox mode now portals its listbox and positions it from the input rect instead of rendering it as an inline sibling.

### Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
- Slug: restore-web-landing-examples
- Date: 2026-04-29
- Breaking: no
- @contractspec/module.examples@4.0.8 (minor)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Example discovery now has explicit non-internal registry helpers, and web-landing consumes those helpers for templates, docs route generation, sitemap entries, and sandbox fallback behavior.

### Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
- Slug: roles-permissions-rbac-policy-system
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.identity-rbac@3.8.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.personalization@6.1.1 (minor)
- Maintainer: Contract authors can declare shared static policy requirements while RBAC providers evaluate static, dynamic, and hybrid workspace-scoped grants.

### Split provider implementations into targeted integration packages while preserving the legacy providers-impls facade.
- Slug: split-provider-impls-targeted-packages
- Date: 2026-04-29
- Breaking: no
- @contractspec/integration.providers-impls@4.1.4 (minor)
- @contractspec/integration.provider.analytics@0.2.4 (minor)
- @contractspec/integration.provider.calendar@0.2.4 (minor)
- @contractspec/integration.provider.database@0.2.4 (minor)
- @contractspec/integration.provider.email@0.2.4 (minor)
- @contractspec/integration.provider.embedding@0.2.4 (minor)
- @contractspec/integration.provider.health@0.2.4 (minor)
- @contractspec/integration.provider.llm@0.2.4 (minor)
- @contractspec/integration.provider.meeting-recorder@0.2.4 (minor)
- @contractspec/integration.provider.messaging@0.2.4 (minor)
- @contractspec/integration.provider.openbanking@0.2.4 (minor)
- @contractspec/integration.provider.payments@0.2.4 (minor)
- @contractspec/integration.provider.project-management@0.2.4 (minor)
- @contractspec/integration.provider.sms@0.2.4 (minor)
- @contractspec/integration.provider.storage@0.2.4 (minor)
- @contractspec/integration.provider.vector-store@0.2.4 (minor)
- @contractspec/integration.provider.voice@0.2.4 (minor)
- @contractspec/app.api-library (patch)
- @contractspec/example.calendar-google@3.7.29 (patch)
- @contractspec/example.email-gmail@3.7.29 (patch)
- @contractspec/example.integration-posthog@3.7.29 (patch)
- @contractspec/example.meeting-recorder-providers@3.7.29 (patch)
- @contractspec/example.openbanking-powens@3.7.29 (patch)
- @contractspec/example.product-intent@3.7.29 (patch)
- @contractspec/example.project-management-sync@3.7.29 (patch)
- @contractspec/example.voice-providers@3.7.29 (patch)
- Maintainer: The legacy providers-impls package remains a compatibility facade and all-provider factory, with concrete implementation files owned by targeted packages.

### Stabilize release artifact generation so customer-facing release files stay current-release-only and deterministic.
- Slug: stabilize-current-release-artifacts
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/app.web-landing (patch)
- contractspec@1.46.2 (patch)
- Maintainer: Release builds now default to compact current-release artifacts, while full historical output must be requested explicitly with `--scope all`.

### Teach contractspec-bun-build to publish public CSS style files as direct style conditional subpath exports.
- Slug: style-exports-bun-build
- Date: 2026-04-29
- Breaking: no
- @contractspec/tool.bun@3.7.18 (patch)
- Maintainer: The build tool now scans style entries separately from TypeScript entries so CSS exports do not alter JavaScript output roots.

### Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.
- Slug: support-bot-reliability-threshold-cleanup
- Date: 2026-04-29
- Breaking: yes
- @contractspec/lib.support-bot@4.0.8 (major)
- Maintainer: Support-bot now validates tool inputs and classifier LLM overrides more defensively, and its responder prompt/catalog wiring is aligned and covered by focused unit tests.

### Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Slug: theme-tailwind-bridge
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Maintainer: Maintainers can keep ThemeSpec as the source of truth while exposing Tailwind variables and runtime theme modes from the design-system package.

### Publish TypeScript declarations for the @contractspec/tool.bun root config preset API.
- Slug: typed-bun-tool-config
- Date: 2026-04-29
- Breaking: no
- @contractspec/tool.bun@3.7.18 (patch)
- Maintainer: The Bun build tool now exposes typed config presets through package metadata while keeping private build internals unexported.

### Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
- Slug: typed-result-system
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-server-rest@3.9.1 (minor)
- @contractspec/lib.contracts-runtime-server-graphql@3.8.7 (minor)
- @contractspec/lib.contracts-runtime-server-mcp@3.8.8 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.jobs@3.8.7 (minor)
- @contractspec/lib.error@3.7.21 (patch)
- Maintainer: Maintainers can declare operation, workflow, and job result catalogs and have runtime registries enforce custom success and failure outcomes.
- Deprecations:
  - Prefer `ContractSpecError`, `createContractError`, and `contractFail` from `@contractspec/lib.contracts-spec/results`; `@contractspec/lib.error` remains as a compatibility bridge for existing `AppError` users.

### Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
- Slug: ui-kit-web-button-forward-ref
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Maintainer: The web Button primitive now uses `React.forwardRef` and passes refs through Radix Slot when `asChild` is enabled.

### Split example discovery from rich runtime packages so lightweight consumers no longer install every ContractSpec example.
- Slug: unbundle-examples-runtime
- Date: 2026-04-29
- Breaking: yes
- @contractspec/module.examples@4.0.8 (major)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)

### Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
- Slug: unified-design-system-tabs
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/example.agent-console@3.8.23 (patch)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.data-grid-showcase@3.8.23 (patch)
- @contractspec/module.builder-workbench@0.2.13 (patch)
- @contractspec/module.execution-console@0.1.14 (patch)
- Maintainer: Maintainers can expose tabbed product surfaces through the design-system root instead of choosing between web and native UI-kit tab APIs.

### Unify example preview metadata so templates, docs, sandbox, and mobile preview routes derive preview support from shared example registry data instead of hand-maintained lists.
- Slug: unify-example-previews
- Date: 2026-04-29
- Breaking: no
- @contractspec/module.examples@4.0.8 (minor)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/app.expo-demo (patch)
- @contractspec/example.agent-console@3.8.23 (patch)
- @contractspec/example.ai-chat-assistant@3.8.23 (patch)
- @contractspec/example.analytics-dashboard@3.9.23 (patch)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.integration-hub@3.9.0 (patch)
- @contractspec/example.learning-journey-registry@4.0.11 (patch)
- @contractspec/example.marketplace@3.8.23 (patch)
- @contractspec/example.policy-safe-knowledge-assistant@3.7.31 (patch)
- @contractspec/example.saas-boilerplate@3.8.23 (patch)
- @contractspec/example.workflow-system@3.8.23 (patch)
- Maintainer: Preview wiring now comes from shared example preview surface helpers, and UI-backed example packages must expose `entrypoints.ui` in their exported `ExampleSpec`.

### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- Slug: versioning-release-system
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/app.web-landing (patch)
- Maintainer: Release communication is now generated from versioning-backed release capsules and enforced on release branches.
- Deprecations:
  - The standalone release domain under `@contractspec/lib.contracts-spec/release` is deprecated in favor of versioning-owned release metadata.

### Keep the VS Code extension production typecheck focused on runtime sources while allowing Bun-typed workspace imports to resolve.
- Slug: vscode-bun-type-boundary
- Date: 2026-04-29
- Breaking: no
- vscode-contractspec@3.10.12 (patch)
- Maintainer: The extension build now excludes Bun test files from the production typecheck and includes Bun ambient types for workspace source imports that expose Bun adapters.

### Add public website docs and prompts for flexible data-exchange import templates and user column mapping review.
- Slug: web-landing-data-exchange-import-template-docs
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers can point developers at a canonical website guide for import templates, alias matching, format profiles, codec options, and verification.

### Add public docs and LLM guidance for preference-aware DataViews.
- Slug: web-landing-data-view-personalization-docs
- Date: 2026-04-29
- Breaking: no
- @contractspec/app.web-landing (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/lib.personalization@6.1.1 (patch)
- Maintainer: DataView personalization docs are registered in the docs manifest and mirrored into /llms package guides.

### Add public web docs and agent guidance for the ContractSpec translation runtime and optional i18next adapter.
- Slug: web-landing-translation-runtime-docs
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: The shared docs bundle now registers a translation-runtime library guide and primary-nav entry so the public web shell can expose ContractSpec i18n guidance consistently.