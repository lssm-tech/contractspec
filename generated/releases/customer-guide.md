# Customer Upgrade Guide



### Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: ObjectReferenceHandler supports same-page vs new-page detail opening, rich nested properties, and configurable sheet/drawer behavior with responsive defaults.
- Customer: Reference interactions can show richer details in a desktop sheet or mobile drawer without custom per-screen logic.



### Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- Customer: Reference interactions can show richer details in a desktop sheet or mobile drawer without custom per-screen logic.
- No manual migration steps recorded.

### Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: Design-system overlay behavior is more consistent because mobile menu panels and object references share the AdaptivePanel boundary.
- Customer: Mobile menus keep the same behavior while using the shared responsive panel implementation.



### Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- Customer: Mobile menus keep the same behavior while using the shared responsive panel implementation.
- No manual migration steps recorded.

### Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
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
- Integrator: Integrators can resolve existing workspace or ContractSpec OSS surfaces before adding new implementations, and can scaffold more contract families from the CLI and VS Code extension.
- Customer: Customer workspaces gain setup-managed adoption guidance, Connect `adoption sync/resolve` flows, stronger runtime-import and deprecated-monolith guardrails, and updated bundled schemas in the published CLI entrypoint.
- Enable the new Connect adoption engine in workspace config: ContractSpec workspaces can now opt into family-aware reuse guidance and local catalog sync through `connect.adoption`.
- Use the expanded authoring-target surface in CLI and VS Code flows: Shared workspace discovery and IDE/CLI create flows now recognize additional contract families beyond the original core set.



### Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Customer: Customer workspaces gain setup-managed adoption guidance, Connect `adoption sync/resolve` flows, stronger runtime-import and deprecated-monolith guardrails, and updated bundled schemas in the published CLI entrypoint.
- Enable the new Connect adoption engine in workspace config: ContractSpec workspaces can now opt into family-aware reuse guidance and local catalog sync through `connect.adoption`.
  - Add or review `.contractsrc.json > connect.adoption`.
  - Run `contractspec connect adoption sync --json` to mirror the local catalog.
  - Route uncertain reuse decisions through `contractspec connect adoption resolve --family <family> --stdin`.
- Use the expanded authoring-target surface in CLI and VS Code flows: Shared workspace discovery and IDE/CLI create flows now recognize additional contract families beyond the original core set.
  - Use the new create targets for capability, policy, translation, visualization, job, agent, product-intent, harness scenario, and harness suite scaffolds where appropriate.
  - Update any custom file-name or directory assumptions to rely on shared authoring-target helpers instead of hard-coded extensions.
- Upgrade steps:
  - [assisted] Wire adoption-aware Connect hooks in consumer environments: The consumer plugin and Connect CLI now expose adoption-aware hook events in addition to contracts-spec review hooks.
    - Install or reference the `contractspec-adoption` marketplace/plugin assets where Connect hooks are consumed.
    - Use `contractspec connect hook adoption before-file-edit|before-shell-execution|after-file-edit --stdin` in host hook wiring.
  - [manual] Prefer higher-level runtime package entrypoints in imports: Generated Biome policy artifacts now flag deprecated monolith usage and obvious deep runtime entrypoint imports.
    - Replace `@contractspec/lib.contracts` imports with `@contractspec/lib.contracts-spec` plus the appropriate split runtime package.
    - Prefer package-level runtime entrypoints such as `@contractspec/lib.contracts-runtime-server-mcp` when they already expose the required surface.

### Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- Integrator: Web and Expo app developers can adopt AppShell and PageOutline from the shell subpath while existing AppLayout, AppSidebar, AppHeader, NavLink, and NavSection imports remain supported.
- Customer: Documentation readers get public library docs with copy-ready AI prompts for fresh application shell implementation and existing-app refactors.
- Adopt the focused application shell subpath: Existing shell-related imports keep working, but new application frames should use the focused shell entrypoint.



### Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
- Customer: Documentation readers get public library docs with copy-ready AI prompts for fresh application shell implementation and existing-app refactors.
- Adopt the focused application shell subpath: Existing shell-related imports keep working, but new application frames should use the focused shell entrypoint.
  - Import AppShell and PageOutline from "@contractspec/lib.design-system/shell".
  - Keep existing AppLayout, AppSidebar, AppHeader, NavLink, and NavSection imports where no refactor is needed.
  - Use the public library docs prompts when migrating existing app frame structure.
- Upgrade steps:
  - [assisted] Use AppShell and PageOutline for new application frames: New application shells should compose the focused shell primitives instead of rebuilding frame, navigation, breadcrumb, command, and outline behavior locally.
    - Import AppShell and PageOutline from "@contractspec/lib.design-system/shell".
    - Keep legacy imports for existing AppLayout, AppSidebar, AppHeader, NavLink, and NavSection consumers.
    - Re-run design-system and affected docs or app typechecks after adopting the shell subpath.

### Document AppShell in-app notification adoption and refresh shell implementation prompts.
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: App developers now have public guidance for wiring in-app notifications through AppShell without coupling the design system to notification runtime behavior.
- Use the shell notification boundary for app integrations: Keep notification contracts and runtime helpers outside the design system, then pass render-ready notification center state into AppShell.



### Document AppShell in-app notification adoption and refresh shell implementation prompts.
- Use the shell notification boundary for app integrations: Keep notification contracts and runtime helpers outside the design system, then pass render-ready notification center state into AppShell.
  - Use `@contractspec/lib.contracts-spec/notifications` for canonical notification contracts.
  - Use `@contractspec/lib.notification` for reusable schema, channel, template, and i18n helpers.
  - Keep persistence, subscriptions, delivery, and mutation logic in the host app or runtime layer.
  - Pass `ShellNotificationCenter` state to `AppShell.notifications`.

### Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: AppShell now keeps the desktop topbar inset beside the sidebar, exposes a shared sidebar collapse trigger, and dismisses the web notification panel on outside click, Escape, or trigger toggle.



### Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- No manual migration steps recorded.

### Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- contractspec@1.46.2 (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/tool.docs-generator@3.7.27 (patch)
- @contractspec/biome-config@3.8.11 (patch)
- Integrator: Web LLM guide generation is now a modeled Turbo task and generated docs metadata is stable, making downstream build behavior easier to reason about in local and CI workspaces.



### Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- No manual migration steps recorded.

### Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- @contractspec/bundle.workspace@4.7.0 (patch)
- @contractspec/app.cli-contractspec@6.3.2 (patch)
- Integrator: Fresh `contractspec init --preset builder-local` workspaces now include the Builder API base URL in both `.contractsrc.json` and VS Code settings, while older local-only configs still work through the hosted API fallback.



### Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- No manual migration steps recorded.

### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
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
- Integrator: Integrators can adopt canonical bootstrap presets, register trusted local daemons, and consume richer snapshot-backed mobile review and operator posture data.
- Customer: Builder operators get clearer local runtime trust, lease, and channel-action status when reviewing rollouts away from the desktop workbench.



### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Customer: Builder operators get clearer local runtime trust, lease, and channel-action status when reviewing rollouts away from the desktop workbench.
- No manual migration steps recorded.

### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
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
- Integrator: Integrators can compose managed, local, and hybrid runtime modes with Builder workbench/mobile-review modules and provider adapters for Codex, Claude Code, Gemini, Copilot, STT, and local models.
- Customer: Builder operators now get a unified workbench and mobile-review experience across provider routing, readiness, export approval, and omnichannel control flows.



### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Customer: Builder operators now get a unified workbench and mobile-review experience across provider routing, readiness, export approval, and omnichannel control flows.
- No manual migration steps recorded.

### Add reusable BYOK and environment alias UI helpers for integration setup.
- @contractspec/bundle.library@3.10.0 (minor)
- Integrator: OSS consumers can render managed/BYOK credential setup blocks and monorepo-aware env alias previews from integration manifests.



### Add reusable BYOK and environment alias UI helpers for integration setup.
- No manual migration steps recorded.

### Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-integrations@3.9.0 (minor)
- @contractspec/integration.runtime@3.10.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- Integrator: Monorepos can declare logical environment variables once and materialize framework-specific aliases such as NEXT_PUBLIC_* and EXPO_PUBLIC_* per app target.
- Customer: BYOK setup can be validated from shared contracts without placing raw secrets in specs, docs, reports, or generated env examples.



### Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- Customer: BYOK setup can be validated from shared contracts without placing raw secrets in specs, docs, reports, or generated env examples.
- No manual migration steps recorded.

### Unify release authoring around guided capsules, canonical generated artifacts, and manifest-backed changelog surfaces.
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (major)
- @contractspec/action.version@3.0.8 (major)
- @contractspec/app.web-landing@3.8.12 (patch)
- Customer: The public changelog now renders canonical release summaries, deprecations, migration guidance, and upgrade steps directly from the generated release manifest instead of scraping package changelogs.
- Integrator: Existing tooling that depended on `contractspec changelog` or on the `@contractspec/action.version` changelog side effect must move to `contractspec release prepare` plus `generated/releases/*`.
- Deprecations:
  - `contractspec changelog generate` is no longer the supported release-authoring flow.
  - `contractspec changelog show` is no longer the supported public release surface.
- Replace the legacy changelog CLI flow: Stop invoking `contractspec changelog` for release preparation and use `contractspec release prepare`, `contractspec release build`, or `contractspec release brief` instead.
- Stop relying on action-version changelog side effects: `@contractspec/action.version` no longer runs the generic changelog generator during bump mode.



### Unify release authoring around guided capsules, canonical generated artifacts, and manifest-backed changelog surfaces.
- Customer: The public changelog now renders canonical release summaries, deprecations, migration guidance, and upgrade steps directly from the generated release manifest instead of scraping package changelogs.
- Replace the legacy changelog CLI flow: Stop invoking `contractspec changelog` for release preparation and use `contractspec release prepare`, `contractspec release build`, or `contractspec release brief` instead.
  - Replace `contractspec changelog generate` and `contractspec changelog show` calls with the new release commands that match the workflow intent.
  - Treat `generated/releases/manifest.json` and `generated/releases/upgrade-manifest.json` as the canonical inputs for downstream changelog and upgrade tooling.
- Stop relying on action-version changelog side effects: `@contractspec/action.version` no longer runs the generic changelog generator during bump mode.
  - Generate canonical release artifacts with the release pipeline instead of expecting generic changelog output from the action.
  - Read release data from `generated/releases/*` rather than from package changelog aggregation.
- Upgrade steps:
  - [manual] Use guided release authoring: Create and revise release metadata through `contractspec release prepare` and `contractspec release edit` instead of editing capsules by hand.
    - Run `contractspec release prepare` for new published-package release work.
    - Run `contractspec release edit <slug>` to revise an existing release entry safely.
  - [assisted] Publish canonical release artifacts: Stable release automation now uploads the release manifest, upgrade manifest, customer guide, and agent prompts, and uses generated patch notes as the GitHub Release body.
    - Review `generated/releases/*` as part of release preparation.
    - Use the attached release artifacts instead of scraping package CHANGELOG files or generic changelog JSON.

### Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
- contractspec@1.46.2 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Integrator: Form wrappers keep their existing runtime behavior while remaining compatible with newer React Hook Form resolver generics.



### Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
- No manual migration steps recorded.

### Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/bundle.library@3.10.0 (minor)
- Integrator: Integrators can bootstrap OSS adoption with track-aware guidance for contracts, UI design, knowledge, AI agents, and learning journeys without inventing a second Builder or Connect model.
- Customer: CLI users can run `contractspec onboard` to generate repo-local AGENTS/USAGE guidance, get recommended examples and next commands, and query the same onboarding information through MCP.
- Use `contractspec onboard` as the primary OSS onboarding flow: The CLI now provides a first-class onboarding command that should replace ad hoc “quickstart + create one spec” repo bootstraps.
- Include the new `usage-md` setup target in setup automation: `contractspec init` can now create or merge a managed `USAGE.md` section in addition to `AGENTS.md`.



### Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
- Customer: CLI users can run `contractspec onboard` to generate repo-local AGENTS/USAGE guidance, get recommended examples and next commands, and query the same onboarding information through MCP.
- Use `contractspec onboard` as the primary OSS onboarding flow: The CLI now provides a first-class onboarding command that should replace ad hoc “quickstart + create one spec” repo bootstraps.
  - Run `contractspec onboard` at the repo root to generate or update the managed `AGENTS.md` and `USAGE.md` sections.
  - Use `contractspec onboard <track...>` to focus onboarding on one or more tracks such as `knowledge` or `ai-agents`.
  - Use `--example <key>` when you want the command to create a lightweight example stub under `.contractspec/examples/`.
- Include the new `usage-md` setup target in setup automation: `contractspec init` can now create or merge a managed `USAGE.md` section in addition to `AGENTS.md`.
  - Add `usage-md` anywhere setup target lists are pinned manually.
  - Treat `USAGE.md` as the human-facing repo onboarding document and `AGENTS.md` as the AI-operator document.
- Upgrade steps:
  - [assisted] Route onboarding through the existing Connect adoption layer: The onboarding flow now syncs and consults the existing adoption catalog before recommending new surfaces.
    - Use `contractspec connect adoption sync` to refresh the local adoption catalog outside the onboarding command when needed.
    - Prefer `contractspec connect adoption resolve --family <family> --stdin` for custom tooling that needs the same reuse recommendations.
  - [manual] Use CLI MCP onboarding resources instead of hardcoded prompts: The CLI MCP surface now exposes onboarding tracks, rendered artifacts, and next-command suggestions.
    - Read `onboarding://tracks` and `onboarding://track/{id}` for the canonical onboarding catalog.
    - Call `onboarding_suggestTracks`, `onboarding_renderArtifacts`, and `onboarding_nextCommand` for repo-specific planning and guide rendering.

### Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- agentpacks@1.8.0 (minor)
- Integrator: Integrators can enable `.contractsrc.json > connect`, emit local context/plan/verdict artifacts, and route adapter-facing review or replay flows through the shared workspace services.
- Enable ContractSpec Connect in the workspace config: Turn on the Connect adapter flow before relying on task-scoped context, review, replay, or evaluation artifacts.



### Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Enable ContractSpec Connect in the workspace config: Turn on the Connect adapter flow before relying on task-scoped context, review, replay, or evaluation artifacts.
  - Add or merge a `connect` section in `.contractsrc.json` with `enabled: true` and the storage paths that should hold Connect artifacts.
  - Route risky edits or shell execution through `contractspec connect plan` and `contractspec connect verify` so decisions, review packets, and replay bundles are captured.
  - Use the generated docs and exported agentpacks metadata so downstream agent tooling sees the same Connect contract surface as the CLI.
- Upgrade steps:
  - [manual] Adopt the Connect CLI workflow: Use the built-in Connect commands instead of custom local wrappers for risky file or command mutations.
    - Initialize the workspace with `contractspec connect init --scope workspace`.
    - Use `contractspec connect context`, `plan`, and `verify` to capture task context and mutation verdicts before edits or shell execution.
    - Keep replay and evaluation artifacts under `.contractspec/connect/` so review and audit flows can consume the same evidence bundle.

### Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/module.workspace@4.3.8 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- Integrator: Integrators get a stable `defineTheme` authoring path, new theme and feature validation helpers, and key-based app-config DTOs and templates across shared tooling.
- Customer: CLI users can now run `contractspec create theme`, and validation catches more app-config, theme, and feature mistakes before publish or CI promotion.
- Update custom app-config DTO callers to key-based refs: Shared app-config authoring DTOs and templates now use `key`-based spec references instead of older `name`-based helper fields.
- Adopt `defineTheme(...)` for new theme specs: Theme authoring now has a canonical helper and authored-validator support.



### Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Customer: CLI users can now run `contractspec create theme`, and validation catches more app-config, theme, and feature mistakes before publish or CI promotion.
- Update custom app-config DTO callers to key-based refs: Shared app-config authoring DTOs and templates now use `key`-based spec references instead of older `name`-based helper fields.
  - Replace `name` fields with `key` for app-config spec references.
  - Replace `guardName` and `experimentName` with `guardKey` and `experimentKey` in route DTOs.
  - Keep versions as semver strings rather than numeric literals.
- Adopt `defineTheme(...)` for new theme specs: Theme authoring now has a canonical helper and authored-validator support.
  - Import `defineTheme` from `@contractspec/lib.contracts-spec/themes`.
  - Prefer `defineTheme({...})` for new theme specs, while keeping existing `ThemeSpec` object literals valid.
  - Add `validateThemeSpec` or `assertThemeSpecValid` to CI or publish-time checks where theme correctness matters.
- Upgrade steps:
  - [assisted] Use the authored validators for contract setup and CI: Prefer the package-level validators over shallow AST checks for the three upgraded surfaces.
    - Use `validateBlueprint` or `assertBlueprintValid` for app-config specs.
    - Use `validateThemeSpec` or `assertThemeSpecValid` for theme specs.
    - Use `validateFeatureSpec` or `assertFeatureSpecValid` for feature specs before registry installation or release review.
  - [manual] Adopt the new theme authoring target across workspace tools: Shared workspace discovery and the CLI now treat `theme` as a first-class authored surface.
    - Use `.theme.ts` files and `defineTheme(...)` for new theme specs.
    - Update any custom create flows or discovery logic to include the `theme` authoring target where needed.

### Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- @contractspec/lib.contracts-spec@6.3.0 (major)
- Integrator: Browser and Next.js consumers can use workflow, telemetry, experiments, root, and broad control-plane surfaces without static Node crypto imports.
- Import control-plane skill signing helpers from direct subpaths: Replace broad root or `control-plane` imports for signing and verification helpers with `@contractspec/lib.contracts-spec/control-plane/skills`, `/signer`, or `/verifier`.
- Review sticky experiment bucket assignment changes: Sticky experiment variants may rebucket because the evaluator now uses a browser-safe deterministic hash instead of Node SHA-256.



### Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Import control-plane skill signing helpers from direct subpaths: Replace broad root or `control-plane` imports for signing and verification helpers with `@contractspec/lib.contracts-spec/control-plane/skills`, `/signer`, or `/verifier`.
- Review sticky experiment bucket assignment changes: Sticky experiment variants may rebucket because the evaluator now uses a browser-safe deterministic hash instead of Node SHA-256.

### Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.translation-runtime@0.2.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/example.locale-jurisdiction-gate@3.7.28 (patch)
- Integrator: Integrators should use the production translation runtime for server, React, React Native, and CLI resolution, and use the i18next subpath only as a downstream adapter with caller-owned ICU formatting configuration.
- Customer: Multilingual surfaces can now rely on BCP 47 locale variants, ICU formatting, deterministic SSR snapshots, and safer migration away from locale-suffixed translation bundle keys.
- Separate stable bundle keys from locale variants: Prefer `meta.key: "bundle.messages"` with `locale: "fr-FR"` over stable keys that encode locale suffixes.
- Configure ICU formatting when rendering through i18next: The i18next adapter exports ContractSpec ICU messages intact and does not make i18next canonical.



### Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Customer: Multilingual surfaces can now rely on BCP 47 locale variants, ICU formatting, deterministic SSR snapshots, and safer migration away from locale-suffixed translation bundle keys.
- Separate stable bundle keys from locale variants: Prefer `meta.key: "bundle.messages"` with `locale: "fr-FR"` over stable keys that encode locale suffixes.
  - Move locale identity into `TranslationSpec.locale`.
  - Keep fallback declarations on locale variants through `fallback` or `fallbacks`.
  - Re-run translation validation after migration.
- Configure ICU formatting when rendering through i18next: The i18next adapter exports ContractSpec ICU messages intact and does not make i18next canonical.
  - Import adapter helpers from `@contractspec/lib.translation-runtime/i18next`.
  - Initialize a caller-owned i18next instance with generated resources and `keySeparator: false`.
  - Configure an ICU-capable i18next format plugin before rendering ICU plural/select/selectordinal messages through i18next.
- Upgrade steps:
  - [manual] Adopt the ContractSpec translation runtime for production surfaces: Use runtime instances or snapshots instead of legacy simple string interpolation for production i18n paths.
    - Build runtime instances from canonical `TranslationSpec[]` catalogs.
    - Create one runtime per SSR request and hydrate clients from serialized snapshots.
    - Keep React, React Native, and i18next integrations downstream from the runtime.

### Add an optional ContractSpec-first i18next adapter for downstream interoperability.
- @contractspec/lib.translation-runtime@0.2.1 (minor)
- Integrator: Apps that already use i18next can initialize isolated instances or add resource bundles from ContractSpec translation catalogs without making i18next canonical.
- Customer: Multilingual applications gain a safer migration path from ContractSpec translations to i18next-powered surfaces while preserving locale metadata and diagnostics.
- Import i18next helpers from the adapter subpath: Use `@contractspec/lib.translation-runtime/i18next` for downstream i18next projection instead of importing adapter internals.
- Keep stable bundle identity separate from locale variants: Namespace translation bundles with stable ContractSpec keys and use `TranslationSpec.locale` for BCP 47 language tags.



### Add an optional ContractSpec-first i18next adapter for downstream interoperability.
- Customer: Multilingual applications gain a safer migration path from ContractSpec translations to i18next-powered surfaces while preserving locale metadata and diagnostics.
- Import i18next helpers from the adapter subpath: Use `@contractspec/lib.translation-runtime/i18next` for downstream i18next projection instead of importing adapter internals.
  - Import `exportContractSpecToI18next`, `createI18nextInitOptions`, or `addContractSpecResourceBundles` from `@contractspec/lib.translation-runtime/i18next`.
  - Keep canonical translation contracts in `TranslationSpec` catalogs and use i18next resources as generated runtime interop data.
  - Configure an ICU-capable i18next formatter plugin when rendering ContractSpec ICU plural/select/selectordinal messages through i18next.
- Keep stable bundle identity separate from locale variants: Namespace translation bundles with stable ContractSpec keys and use `TranslationSpec.locale` for BCP 47 language tags.
  - Prefer bundle keys such as `commerce.checkout` rather than `commerce.checkout.en`.
  - Let the adapter map locales like `en-US`, `ar-EG`, and `zh-Hans` to i18next language resource keys.
  - Review adapter diagnostics for namespace, resource, ICU, and fallback projection issues.
- Upgrade steps:
  - [manual] Initialize i18next from ContractSpec exports: Use generated resources and init options with caller-owned i18next instances for SSR and request isolation.
    - Export resources from canonical specs or runtime snapshots.
    - Pass `createI18nextInitOptions(...).options` to a caller-created i18next instance.
    - Serialize the same runtime snapshot/exported resources for hydration when using SSR.

### Add a copy mode for public CSS style entries so packages can preserve Tailwind and other framework directives.
- @contractspec/tool.bun@3.7.18 (patch)
- Integrator: Packages with CSS directives that Bun does not understand can set `styleMode: "copy"` to publish the raw stylesheet unchanged.
- Copy CSS entries when another tool owns directive processing: Add `styleMode: "copy"` or `styles: { mode: "copy" }` in packages whose exported CSS includes directives such as `@source`, `@custom-variant`, `@theme`, or `@tailwind`.



### Add a copy mode for public CSS style entries so packages can preserve Tailwind and other framework directives.
- Copy CSS entries when another tool owns directive processing: Add `styleMode: "copy"` or `styles: { mode: "copy" }` in packages whose exported CSS includes directives such as `@source`, `@custom-variant`, `@theme`, or `@tailwind`.

### Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- @contractspec/biome-config@3.8.11 (patch)
- contractspec@1.46.2 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit-core@3.8.8 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: Integrators adopting the consumer preset get React Native compatible JSX text/list/layout policy diagnostics and shared list/typography primitives.
- Replace raw layout tags: Use ContractSpec layout and typography primitives in JSX surfaces.



### Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Replace raw layout tags: Use ContractSpec layout and typography primitives in JSX surfaces.
  - Replace raw `<div>` layout containers with `HStack`, `VStack`, or `Box` from `@contractspec/lib.design-system/layout`.
  - Replace raw `<ul>`, `<ol>`, and `<li>` with `List` and `ListItem` from `@contractspec/lib.design-system/list`.
  - Replace raw headings and text tags with themed typography components from `@contractspec/lib.design-system/typography`.
  - Wrap visible JSX text with `Text` or another approved typography component.
  - Add an app package to the policy `appPackageAllowList` only when that app should opt into the shared presentation guardrails.
- Upgrade steps:
  - [manual] Sync generated Biome policy artifacts: Keep generated presets, Grit plugins, and AI summaries aligned with the typed manifest.
    - Run `cd packages/tools/biome-config && bun run sync:artifacts` after policy manifest edits.
  - [assisted] Run the JSX primitive fixer: Apply conservative automatic replacements before manually addressing unsupported or ambiguous diagnostics.
    - Run `bun run jsx:fix-primitives -- --check` to preview style-preserving deterministic replacements.
    - Run `bun run jsx:fix-primitives` to apply style-preserving deterministic replacements in shared presentation packages.
    - Add `--allow-app <package>` only when an app package should opt into the same fixer scope.

### Add a dedicated cross-platform UI docs page and AGENTS/rules guidance that explain how the React, React Native, runtime, primitive UI, and design-system layers stay compatible.
- @contractspec/bundle.library@3.10.0 (patch)
- Integrator: Integrators can follow one architecture-first explanation and matching agent guidance for when to use presentation-runtime-core, the React bindings, ui-kit-web, ui-kit, and the design-system layer.
- Customer: Website readers and AI-agent users now have a direct cross-platform UI guide instead of piecing the React and React Native compatibility story together from several separate library pages.



### Add a dedicated cross-platform UI docs page and AGENTS/rules guidance that explain how the React, React Native, runtime, primitive UI, and design-system layers stay compatible.
- Customer: Website readers and AI-agent users now have a direct cross-platform UI guide instead of piecing the React and React Native compatibility story together from several separate library pages.
- No manual migration steps recorded.

### Add template-aware import mapping with column aliases, flexible value formatting, codec options, client review state, and server audit evidence.
- @contractspec/lib.data-exchange-core@0.3.1 (minor)
- @contractspec/lib.data-exchange-client@0.3.1 (minor)
- @contractspec/lib.data-exchange-server@0.3.1 (minor)
- Integrator: Integrators can accept partner CSV/JSON/XML layouts with localized number, boolean, date, JSON, split/join, currency, and percentage formatting before preview or execution.
- Customer: Import review screens can show matched columns, required gaps, formatting summaries, and ignored source columns before users execute an import.
- Add templates to new import flows: Existing explicit mappings continue to work; new flows can pass an import template to plan creation, dry-run, or execution APIs.



### Add template-aware import mapping with column aliases, flexible value formatting, codec options, client review state, and server audit evidence.
- Customer: Import review screens can show matched columns, required gaps, formatting summaries, and ignored source columns before users execute an import.
- Add templates to new import flows: Existing explicit mappings continue to work; new flows can pass an import template to plan creation, dry-run, or execution APIs.
  - Define a template with `defineDataExchangeTemplate` or the backwards-compatible `defineImportTemplate` alias.
  - Add `sourceAliases` and `format` hints to template columns where partner files differ.
  - Pass `template` to core plan creation or server dry-run/execute calls.
  - Use the client controller model to show matched, unmatched, and ignored columns.

### Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
- @contractspec/lib.data-exchange-core@0.3.1 (minor)
- @contractspec/lib.data-exchange-server@0.3.1 (minor)
- @contractspec/lib.data-exchange-client@0.3.1 (minor)
- @contractspec/lib.exporter (patch)
- Integrator: Integrators can profile CSV/JSON/XML payloads into normalized record batches, infer mappings against SchemaModels, preview and validate changes, and route execution through file, HTTP, SQL, or storage adapter families.
- Customer: Existing `@contractspec/lib.exporter` consumers keep the legacy CSV/XML payload API and gain a JSON wrapper, while new work can adopt the more robust data-exchange stack directly.
- Deprecations:
  - `@contractspec/lib.exporter` remains as a compatibility shim; prefer `@contractspec/lib.data-exchange-core` for new import/export work.
- Prefer the new core codecs and planning APIs for new integrations: Keep `lib.exporter` only for legacy payload callers; build new import/export flows on the new core/server/client package family.
- Keep legacy exporter callers on the compatibility shim: The old payload shape remains valid, with CSV/XML preserved and JSON added.



### Add a new SchemaModel-first data interchange stack with shared codecs, planning APIs, server adapters, client mapping surfaces, and a compatibility refresh for `@contractspec/lib.exporter`.
- Customer: Existing `@contractspec/lib.exporter` consumers keep the legacy CSV/XML payload API and gain a JSON wrapper, while new work can adopt the more robust data-exchange stack directly.
- Prefer the new core codecs and planning APIs for new integrations: Keep `lib.exporter` only for legacy payload callers; build new import/export flows on the new core/server/client package family.
  - Use `@contractspec/lib.data-exchange-core` for normalized `RecordBatch`, mapping, preview, and reconciliation planning.
  - Use `@contractspec/lib.data-exchange-server` for file, HTTP, SQL, or storage execution services.
  - Use `@contractspec/lib.data-exchange-client` for shared mapping/review UI surfaces.
- Keep legacy exporter callers on the compatibility shim: The old payload shape remains valid, with CSV/XML preserved and JSON added.
  - Keep the existing `CsvXmlExportPayload` shape.
  - Use `toJsonGeneric(...)` when the same legacy payload now needs JSON output.
  - Migrate to the new core package only when you are ready to adopt normalized `RecordBatch` flows.
- Upgrade steps:
  - [assisted] Re-run focused package verification: The new stack spans new packages plus the legacy exporter shim.
    - Run the focused bun test suites for `data-exchange-core`, `data-exchange-server`, `data-exchange-client`, and `exporter`.
    - Run targeted typechecks and lint checks for the same four packages.
    - Treat `build:bundle` as the current build proof; if `contractspec-bun-build types` stalls, rely on the separate package typechecks until the build tool issue is fixed.

### Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
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
- Integrator: OSS consumers can specify `overflow` on DataView fields or table columns, while the CLI and workspace scaffolds emit the new shape and richer format/filter metadata.
- Customer: Published data-view docs now describe overflow behavior, expansion mode, and generated table defaults more concretely.
- Add explicit overflow behavior where defaults are not enough: Existing tables keep working, but long prose, markdown, and detail-heavy columns can now declare their intended behavior.



### Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Customer: Published data-view docs now describe overflow behavior, expansion mode, and generated table defaults more concretely.
- Add explicit overflow behavior where defaults are not enough: Existing tables keep working, but long prose, markdown, and detail-heavy columns can now declare their intended behavior.
  - Set `overflow` on `DataViewField` for behavior shared by every table using that field.
  - Set `overflow` on `DataViewTableColumn` when a specific table needs to override the field default.
  - Use `expand` for compact rows with full detail in row expansion, and `hideColumn` for low-priority columns that should start hidden when column visibility is enabled.
- Upgrade steps:
  - [assisted] Re-run focused table overflow verification after upgrading: The contract, runtime, web, native, design-system, CLI, and workspace layers all participate in overflow behavior.
    - Run the focused data-view and data-table test suites for contracts-spec, presentation-runtime-react, ui-kit-web, ui-kit, and design-system.
    - Run typecheck and lint checks for the touched libraries, CLI, and workspace packages.

### Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.presentation-runtime-react@40.0.2 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.data-grid-showcase@3.8.23 (patch)
- Integrator: Integrators can adopt `DataTableToolbar` without changing the underlying `DataTable` or `useContractTable` API, and server-paginated tables now behave more defensively when data, columns, or totals change.
- Customer: The CRM and canonical data-grid examples now expose search, filter chips, selection summaries, safer column recovery, and less failure-prone table interactions across web and native paths.
- Move high-level table UX into `DataTableToolbar`: Keep the primitive `DataTable` lean and compose richer UX through the existing `toolbar` slot.
- Reset page-level UI state when server filters change: The examples now reset page index when search or status filters change so server-mode tables stay aligned with remote pagination.



### Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Customer: The CRM and canonical data-grid examples now expose search, filter chips, selection summaries, safer column recovery, and less failure-prone table interactions across web and native paths.
- Move high-level table UX into `DataTableToolbar`: Keep the primitive `DataTable` lean and compose richer UX through the existing `toolbar` slot.
  - Import `DataTableToolbar` from `@contractspec/lib.design-system`.
  - Pass the existing table controller into `DataTableToolbar`.
  - Keep product-specific buttons or filter toggles in `actionsStart` or `actionsEnd`.
- Reset page-level UI state when server filters change: The examples now reset page index when search or status filters change so server-mode tables stay aligned with remote pagination.
  - Reset `pageIndex` whenever remote search or filter inputs change.
  - Continue passing sorting and pagination through the shared controller state.
- Upgrade steps:
  - [assisted] Re-run focused table verification after upgrading: The web, native, design-system, and example surfaces should be validated together because the UX and stability changes span all four layers.
    - Run the focused table test suites in `presentation-runtime-react`, `ui-kit-web`, `ui-kit`, `design-system`, `example.crm-pipeline`, and `example.data-grid-showcase`.
    - Re-run package typechecks and lint checks for the touched libraries and examples.
    - Spot-check server-paginated and client-side examples to confirm search, chips, loading, empty states, and column recovery behave as expected.

### Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/module.workspace@4.3.8 (patch)
- @contractspec/bundle.workspace@4.7.0 (patch)
- @contractspec/app.cli-contractspec@6.3.2 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- Integrator: DataViewRenderer can switch among allowed list, grid, and table projections while preserving existing specs and caller-controlled props.
- Customer: Generated data-view screens can expose modern list/grid/table switching, search, filters, pagination, and density controls.



### Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Customer: Generated data-view screens can expose modern list/grid/table switching, search, filters, pagination, and density controls.
- No manual migration steps recorded.

### Add preference-aware DataView collection defaults and personalization adapters.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.personalization@6.1.1 (minor)
- @contractspec/bundle.library@3.10.0 (patch)
- Integrator: Apps can resolve preferred DataView mode, density, and data depth through personalization helpers and pass plain props to web/native DataViewRenderer.
- Customer: Collection screens can remember or infer list/grid/table mode and compact/detail preferences without duplicating DataView specs.



### Add preference-aware DataView collection defaults and personalization adapters.
- Customer: Collection screens can remember or infer list/grid/table mode and compact/detail preferences without duplicating DataView specs.
- No manual migration steps recorded.

### Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
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
- Integrator: Library consumers no longer install large optional UI, provider, sandbox, and video runtime stacks unless they use the matching subpaths/features.
- Install optional runtime peers for used feature subpaths: Consumers using native UI, provider implementations, sandbox database/runtime, example runtime UI, or Remotion video subpaths should add the corresponding optional peer packages directly to their app/package dependencies.
- Import provider implementations from explicit subpaths: Replace broad `@contractspec/integration.providers-impls/impls` imports with provider-specific subpaths such as `@contractspec/integration.providers-impls/impls/linear`.
- Track dependency and bundle-size drift: Run `bun run deps:audit --json` before and after dependency changes to compare runtime edges, heavy dependency families, and package dist sizes.



### Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
- Install optional runtime peers for used feature subpaths: Consumers using native UI, provider implementations, sandbox database/runtime, example runtime UI, or Remotion video subpaths should add the corresponding optional peer packages directly to their app/package dependencies.
- Import provider implementations from explicit subpaths: Replace broad `@contractspec/integration.providers-impls/impls` imports with provider-specific subpaths such as `@contractspec/integration.providers-impls/impls/linear`.
- Track dependency and bundle-size drift: Run `bun run deps:audit --json` before and after dependency changes to compare runtime edges, heavy dependency families, and package dist sizes.

### Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Integrators can keep root imports or adopt focused subpaths such as `@contractspec/lib.design-system/theme` and `@contractspec/lib.design-system/forms`.
- Customer: Contract-rendered forms and themed controls keep the same behavior while the design-system internals become easier to maintain.



### Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Customer: Contract-rendered forms and themed controls keep the same behavior while the design-system internals become easier to maintain.
- No manual migration steps recorded.

### Add grouped option support to design-system Select controls across web and native.
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Existing flat Select options keep working, while callers can opt into translated grouped option sections on web and native.
- Customer: Select controls can now present options in labelled groups consistently across web and native surfaces.



### Add grouped option support to design-system Select controls across web and native.
- Customer: Select controls can now present options in labelled groups consistently across web and native surfaces.
- No manual migration steps recorded.

### Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Integrators can import themed and translated controls from `@contractspec/lib.design-system` instead of reaching into web or native UI kit primitives directly.
- Customer: Product surfaces and contract-rendered forms can now share the same ThemeSpec-aware and TranslationSpec-aware design-system controls across web and React Native.



### Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Customer: Product surfaces and contract-rendered forms can now share the same ThemeSpec-aware and TranslationSpec-aware design-system controls across web and React Native.
- No manual migration steps recorded.

### Wrap UI-backed docs example previews in the template runtime provider so public example pages prerender with the same runtime boundary as sandbox and template previews.
- @contractspec/app.web-landing (patch)
- Customer: Public docs pages for UI-backed examples, including `analytics-dashboard`, now prerender successfully instead of failing on missing template runtime context.



### Wrap UI-backed docs example previews in the template runtime provider so public example pages prerender with the same runtime boundary as sandbox and template previews.
- Customer: Public docs pages for UI-backed examples, including `analytics-dashboard`, now prerender successfully instead of failing on missing template runtime context.
- No manual migration steps recorded.

### Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- contractspec@1.46.2 (patch)
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can follow the updated Connect adoption, Builder workspace-config, and release-capsule workflows without reconciling stale docs across multiple surfaces.
- Customer: Website readers and package consumers now see current guidance for Connect, Builder, and release communication, including the corrected contracts-spec export inventory.



### Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Customer: Website readers and package consumers now see current guidance for Connect, Builder, and release communication, including the corrected contracts-spec export inventory.
- No manual migration steps recorded.

### Expand the spec-pack docs into a fuller learning path across the public docs site.
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Customer: Public docs readers can follow a clearer spec-pack learning path from overview pages into Connect, module bundles, and Builder workbench hosting guides.



### Expand the spec-pack docs into a fuller learning path across the public docs site.
- Customer: Public docs readers can follow a clearer spec-pack learning path from overview pages into Connect, module bundles, and Builder workbench hosting guides.
- No manual migration steps recorded.

### Document and link object-reference adoption and adaptive panel guidance in the public docs bundle.
- @contractspec/bundle.library@3.10.0 (patch)
- Integrator: Downstream apps have concrete guidance for replacing inert references with ObjectReferenceHandler and using AdaptivePanel instead of direct Sheet/Drawer branching.
- Customer: Product teams get clearer guidance for making addresses, phone numbers, users, customers, files, and URLs actionable in responsive panels.



### Document and link object-reference adoption and adaptive panel guidance in the public docs bundle.
- Customer: Product teams get clearer guidance for making addresses, phone numbers, users, customers, files, and URLs actionable in responsive panels.
- No manual migration steps recorded.

### Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Customer: Vercel Workflow projects should keep Node-only code out of "use workflow" modules and use the safe workflow subpaths instead.
- Deprecations:
  - Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Rewrite workflow imports to safe subpaths: Keep Node-only workflow runner code out of "use workflow" entrypoints.



### Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Customer: Vercel Workflow projects should keep Node-only code out of "use workflow" modules and use the safe workflow subpaths instead.
- Rewrite workflow imports to safe subpaths: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Import `defineWorkflow`, `WorkflowSpec`, and `WorkflowRegistry` from `@contractspec/lib.contracts-spec/workflow/spec`.
  - Import `WorkflowRunner` from `@contractspec/lib.contracts-spec/workflow/runner` and `InMemoryStateStore` from `@contractspec/lib.contracts-spec/workflow/adapters`.
  - Keep Node-only work inside "use step" functions, not the "use workflow" module graph.
- Upgrade steps:
  - [manual] Rewrite workflow imports to safe subpaths: Use narrow workflow entrypoints so sandboxed workflow runtimes do not pull Node-only runner code.
    - Replace broad workflow barrel imports with the specific `workflow/spec`, `workflow/runner`, `workflow/adapters`, and `workflow/expression` subpaths you need.
    - Keep `crypto` and other Node-only dependencies in step functions instead of workflow entrypoints.

### Speed up npm release publishing by removing per-package dist-tag convergence polling after successful dist-tag updates.
- contractspec@1.46.2 (patch)
- Integrator: Release manifest verification remains the final registry consistency gate, while publish logs now distinguish immediate tag verification from manifest-deferred reconciliation.



### Speed up npm release publishing by removing per-package dist-tag convergence polling after successful dist-tag updates.
- No manual migration steps recorded.

### Add a governed public finance-ops workflow template with replay proof and inline web template preview support.
- @contractspec/example.finance-ops-ai-workflows@1.1.3 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can route the new finance-ops template through existing examples discovery, sandbox surfaces, and generated inline preview loaders without external AI dependencies.
- Customer: Example consumers can open the Finance Ops AI Workflows Preview button from `/templates` and inspect governed finance workflow assistance across five synthetic workflows with fixed rules, replay proof, and mandatory human review.



### Add a governed public finance-ops workflow template with replay proof and inline web template preview support.
- Customer: Example consumers can open the Finance Ops AI Workflows Preview button from `/templates` and inspect governed finance workflow assistance across five synthetic workflows with fixed rules, replay proof, and mandatory human review.
- No manual migration steps recorded.

### Expand the Finance Ops AI Workflows preview into an operator cockpit and refresh the generated LLMS package surface for it.
- @contractspec/example.finance-ops-ai-workflows@1.1.3 (minor)
- @contractspec/app.web-landing (patch)
- Integrator: Preview-consuming apps can surface a deterministic finance-ops operator cockpit rather than a static preview panel.
- Customer: The `/templates` Finance Ops AI Workflows preview now plays like an operator cockpit with scenario-specific screens, replay controls, selectable records, selected details, and draft-only review flows.



### Expand the Finance Ops AI Workflows preview into an operator cockpit and refresh the generated LLMS package surface for it.
- Customer: The `/templates` Finance Ops AI Workflows preview now plays like an operator cockpit with scenario-specific screens, replay controls, selectable records, selected details, and draft-only review flows.
- No manual migration steps recorded.

### Make the form-only showcase previewable from the templates catalog and restore sandbox routing for non-inline template previews.
- @contractspec/example.form-showcase@1.1.4 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Web apps that install the example package can open the Form Showcase preview from `/templates`; examples without inline UI keep routing to `/sandbox?template=...`.
- Customer: Template browsing now opens a useful form-only preview for Form Showcase and sends sandbox-backed templates to the sandbox instead of an empty preview dialog.



### Make the form-only showcase previewable from the templates catalog and restore sandbox routing for non-inline template previews.
- Customer: Template browsing now opens a useful form-only preview for Form Showcase and sends sandbox-backed templates to the sandbox instead of an empty preview dialog.
- No manual migration steps recorded.

### Replace the form showcase preview blueprint with a real form-control demonstration.
- @contractspec/example.form-showcase@1.1.4 (patch)
- Integrator: Template preview consumers can inspect representative form layouts and controls directly from the Form Showcase example.
- Customer: The form template preview now displays actual inputs, grouped fields, repeated rows, and progressive steps.



### Replace the form showcase preview blueprint with a real form-control demonstration.
- Customer: The form template preview now displays actual inputs, grouped fields, repeated rows, and progressive steps.
- No manual migration steps recorded.

### Add a form-only example template and public docs links for ContractSpec form adoption.
- @contractspec/example.form-showcase@1.1.4 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can inspect schema-backed FormSpec examples for all field kinds, section/step flows, conditionals, arrays, groups, and registry usage.
- Customer: Docs readers can jump from the contract-driven forms guide into the form-only example, the templates catalog, or the sandbox spec preview.



### Add a form-only example template and public docs links for ContractSpec form adoption.
- Customer: Docs readers can jump from the contract-driven forms guide into the form-only example, the templates catalog, or the sandbox spec preview.
- No manual migration steps recorded.

### Improve FormSpec autocomplete rendering and resolver-backed search.
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (minor)
- Integrator: React FormSpec autocomplete resolvers receive query, dependency values, field name, and AbortSignal args while stale responses are ignored.
- Customer: Contract-rendered autocomplete fields now use an accessible editable combobox on web and show loading, empty, error, and selected states more reliably.



### Improve FormSpec autocomplete rendering and resolver-backed search.
- Customer: Contract-rendered autocomplete fields now use an accessible editable combobox on web and show loading, empty, error, and selected states more reliably.
- No manual migration steps recorded.

### Keep web FormSpec datetime controls inside their responsive form columns.
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Integrator: Existing datetime picker and FormSpec renderer imports stay compatible while the composite control fits responsive grids.
- Customer: Datetime FormSpec fields now fit inside responsive form columns instead of overflowing into neighboring fields.



### Keep web FormSpec datetime controls inside their responsive form columns.
- Customer: Datetime FormSpec fields now fit inside responsive form columns instead of overflowing into neighboring fields.
- No manual migration steps recorded.

### Add first-class FormSpec email fields with native renderer affordances.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Integrators get native email input attributes through the existing form renderer driver slots without adding an EmailInput slot.
- Customer: Contract-driven email fields now use email keyboards, autofill, and browser email input behavior by default.
- Keep existing text email fields as-is: Existing `kind: "text"` fields with email input hints continue to render normally.
- Keep email validation in the model: `kind: "email"` only describes rendering intent; strict validation remains schema-owned.



### Add first-class FormSpec email fields with native renderer affordances.
- Customer: Contract-driven email fields now use email keyboards, autofill, and browser email input behavior by default.
- Keep existing text email fields as-is: Existing `kind: "text"` fields with email input hints continue to render normally.
  - No migration is required for existing text fields.
  - Prefer `kind: "email"` for new single-address email fields.
- Keep email validation in the model: `kind: "email"` only describes rendering intent; strict validation remains schema-owned.
  - Use `z.string().email()` or the existing schema email scalar for email format validation.
- Upgrade steps:
  - [manual] Adopt first-class email fields: Replace renderer-specific email text hints with `kind: "email"` where a field captures one email address.
    - Use `{ kind: "email", name: "contactEmail" }` for single-address email fields.
    - Use an `array` of email fields when a form must collect multiple addresses.

### Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: Existing email FormSpec fields render without requiring `uiProps`, while explicit `type`, `inputMode`, and autofill props continue to pass through the design-system input wrapper.
- Customer: Contract-driven email fields keep their expected browser email input behavior.



### Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Customer: Contract-driven email fields keep their expected browser email input behavior.
- No manual migration steps recorded.

### Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Integrator: Integrators can render contract forms with semantic legends, descriptions, errors, grid rows, colspans, and input addons through driver slots.
- Customer: Contract-driven forms can now present dense multi-column layouts and input adornments while preserving accessible field semantics.
- Deprecations:
  - `FieldSpec.wrapper.orientation` remains supported but should be replaced by `FieldSpec.layout.orientation` in new specs.
- Keep existing forms as-is: Existing forms continue to render without changes.
- Use FormSpec layout hints for dense forms: New multi-column forms should use `FormSpec.layout`, `group.layout`, and `field.layout.colSpan`.
- Use input-group addons for text fields: New input addons should use `inputGroup.addons` on text and textarea fields.



### Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Customer: Contract-driven forms can now present dense multi-column layouts and input adornments while preserving accessible field semantics.
- Keep existing forms as-is: Existing forms continue to render without changes.
  - No migration is required for forms that do not use the new layout or addon fields.
- Use FormSpec layout hints for dense forms: New multi-column forms should use `FormSpec.layout`, `group.layout`, and `field.layout.colSpan`.
  - Add `layout.columns` at form or group level.
  - Use `field.layout.colSpan` for fields that should expand across columns.
- Use input-group addons for text fields: New input addons should use `inputGroup.addons` on text and textarea fields.
  - Add `inputGroup.addons` to text or textarea field specs.
  - Resolve icon keys in the host driver through the `InputGroupIcon` slot.
- Upgrade steps:
  - [manual] Use FormSpec layout hints for dense forms: Replace renderer-specific row wrappers with portable column and colspan metadata.
    - Add `layout.columns` at form or group level.
    - Use `field.layout.colSpan` for fields that should expand across columns.
    - Use `group.legendI18n` when a section needs a semantic legend.
  - [manual] Use serializable input-group addons: Add text or icon addon descriptors to text and textarea fields.
    - Add `inputGroup.addons` to text or textarea field specs.
    - Resolve icon keys in the host driver through the `InputGroupIcon` slot.

### Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Custom form drivers can implement `NumberField`, `PercentField`, `CurrencyField`, and `DurationField` slots, while older drivers fall back to standard inputs.
- Customer: Contract-driven forms can now express budgets, completion ratios, currency amounts, and durations with consistent metadata and shared rendering defaults.
- Use dedicated numeric field kinds instead of generic text inputs: New field kinds provide stronger semantics and formatting metadata for finance and operations forms.



### Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- Customer: Contract-driven forms can now express budgets, completion ratios, currency amounts, and durations with consistent metadata and shared rendering defaults.
- Use dedicated numeric field kinds instead of generic text inputs: New field kinds provide stronger semantics and formatting metadata for finance and operations forms.
  - Replace ad hoc numeric `text` fields with `number`, `percent`, `currency`, or `duration` where the schema intent is known.
  - Set `format` metadata when locale, precision, currency display, or duration display needs to be explicit.
- Upgrade steps:
  - [assisted] Add numeric field slots to custom form drivers: Shared drivers can opt into richer rendering for the new field kinds.
    - Implement the optional `NumberField`, `PercentField`, `CurrencyField`, and `DurationField` driver slots when custom styling is required.
    - Keep relying on the `Input` fallback when a separate visual treatment is unnecessary.

### Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: Apps using generated design-system theme CSS get the color aliases expected by Radix/shadcn select and combobox primitives.
- Customer: Contract-rendered select and combobox option panels keep a proper themed surface instead of falling back to transparency when the app relies on ThemeSpec CSS.



### Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
- Customer: Contract-rendered select and combobox option panels keep a proper themed surface instead of falling back to transparency when the app relies on ThemeSpec CSS.
- No manual migration steps recorded.

### Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.ui-kit-web@3.13.3 (minor)
- @contractspec/lib.ui-kit@4.1.5 (minor)
- @contractspec/lib.ui-kit-core@3.8.8 (patch)
- Integrator: Integrators can render password fields through an optional driver slot while older drivers fall back to masked inputs.
- Customer: Contract-driven password forms now mask values, expose a visibility toggle, and provide password-manager autocomplete hints.
- Keep existing text fields as-is: Existing text fields and custom driver slots remain compatible.
- Mark password fields explicitly: Prefer `text.password.purpose` for password fields instead of renderer-specific `uiProps.type`.



### Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Customer: Contract-driven password forms now mask values, expose a visibility toggle, and provide password-manager autocomplete hints.
- Keep existing text fields as-is: Existing text fields and custom driver slots remain compatible.
  - No migration is required for non-password text fields.
- Mark password fields explicitly: Prefer `text.password.purpose` for password fields instead of renderer-specific `uiProps.type`.
  - Use `password: { purpose: "current" }` for existing-password entry.
  - Use `password: { purpose: "new" }` for new-password creation or reset fields.
- Upgrade steps:
  - [manual] Add PasswordInput to custom drivers: Custom form renderers can provide the optional `PasswordInput` slot to get a visibility toggle.
    - Implement a driver component that accepts input props plus `passwordPurpose`, `visibilityToggle`, `showLabelI18n`, and `hideLabelI18n`.
    - Omit the slot to keep the fallback masked input behavior.

### Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Integrator: Design-system FormSpec renderers can pass legacy `type: "password"` hints without disabling the visibility toggle.
- Customer: Contract-driven password fields now reveal the password when the visibility toggle changes from closed eye to open eye.



### Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- Customer: Contract-driven password fields now reveal the password when the visibility toggle changes from closed eye to open eye.
- No manual migration steps recorded.

### Fix FormSpec phone country-select rendering to remove duplicated country adornments.
- @contractspec/lib.design-system@4.4.2 (patch)
- Customer: Split FormSpec phone fields now show one clear country selector instead of duplicating the flag and calling code beside the select.
- Integrator: Design-system phone country options now honor the configured flag/calling-code display parts, while the selected country control owns those adornments in select mode.



### Fix FormSpec phone country-select rendering to remove duplicated country adornments.
- Customer: Split FormSpec phone fields now show one clear country selector instead of duplicating the flag and calling code beside the select.
- No manual migration steps recorded.

### Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Integrators can render long contract-driven forms through shared section or step layouts without custom per-form wrappers.
- Customer: Long forms can now be split into scannable sections or progressive steps, improving completion ergonomics without changing submitted data.
- Keep existing forms as-is: Existing forms render exactly as before unless they opt into `layout.flow`.
- Add section or step flow metadata to long forms: Use `layout.flow.sections` to group existing fields by immediate field name.



### Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
- Customer: Long forms can now be split into scannable sections or progressive steps, improving completion ergonomics without changing submitted data.
- Keep existing forms as-is: Existing forms render exactly as before unless they opt into `layout.flow`.
  - No migration is required for forms without `layout.flow`.
- Add section or step flow metadata to long forms: Use `layout.flow.sections` to group existing fields by immediate field name.
  - Add `layout.flow.kind: "sections"` when all sections should remain visible.
  - Add `layout.flow.kind: "steps"` when the renderer should show one section at a time.
  - Keep field definitions in `FormSpec.fields` and reference them through section `fieldNames`.
- Upgrade steps:
  - [manual] Verify custom form driver button and fieldset slots: Custom drivers should confirm their existing `Button`, `FieldSet`, `FieldLegend`, `FieldDescription`, and `FieldGroup` slots render the new flow structure cleanly.
    - Render a form with `layout.flow.kind: "sections"`.
    - Render a form with `layout.flow.kind: "steps"`.
    - Confirm unlisted fields remain visible and step navigation buttons inherit expected styling.

### Add mobile-safe FormSpec layout helpers and scoped DataView filters.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (patch)
- @contractspec/lib.presentation-runtime-core@5.2.2 (minor)
- @contractspec/lib.presentation-runtime-react@40.0.2 (minor)
- @contractspec/lib.presentation-runtime-react-native@40.0.2 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Integrators can reuse one DataView contract for generic and restricted list/search screens while locked filters stay out of user-editable URL state.
- Customer: Contract-driven forms can opt into mobile-safe layouts, and scoped listings now show non-removable locked filter chips by default.
- Keep existing numeric layouts as-is: Existing `layout.columns: 2` contracts continue to render as base two-column layouts.
- Move fixed list constraints into DataView filter scope: Use `view.filterScope.locked` for non-removable list constraints such as category-scoped posts.



### Add mobile-safe FormSpec layout helpers and scoped DataView filters.
- Customer: Contract-driven forms can opt into mobile-safe layouts, and scoped listings now show non-removable locked filter chips by default.
- Keep existing numeric layouts as-is: Existing `layout.columns: 2` contracts continue to render as base two-column layouts.
  - No migration is required for existing numeric column specs.
  - Use `responsiveFormColumns(...)` in new specs that should collapse to one mobile column.
- Move fixed list constraints into DataView filter scope: Use `view.filterScope.locked` for non-removable list constraints such as category-scoped posts.
  - Keep user-editable filter definitions in `view.filters`.
  - Put removable defaults in `view.filterScope.initial`.
  - Put non-removable constraints in `view.filterScope.locked`.
- Upgrade steps:
  - [manual] Opt into mobile-safe form columns: Replace ad hoc responsive column objects with `responsiveFormColumns(...)` where mobile forms should render one field per row.
    - Import `responsiveFormColumns` from `@contractspec/lib.contracts-spec/forms`.
    - Set `layout.columns` to `responsiveFormColumns(2)` or another supported column count.
  - [manual] Adopt scoped DataView filters: Declare initial and locked filters in the DataView contract instead of passing all filters as removable renderer state.
    - Add `filterScope.initial` for removable default filters.
    - Add `filterScope.locked` for fixed constraints.
    - Use `lockedChips: "hidden"` only when the surrounding UI explains the constraint elsewhere.

### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
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
- Integrator: Browser-facing Contractspec packages no longer publish `react/jsx-dev-runtime` imports in their production JS artifacts.
- Customer: Production React bundles built from the affected Contractspec packages stop depending on the development JSX runtime.
- Upgrade to the rebuilt package versions: Pull the patch releases for the affected Contractspec React/browser packages.



### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
- Customer: Production React bundles built from the affected Contractspec packages stop depending on the development JSX runtime.
- Upgrade to the rebuilt package versions: Pull the patch releases for the affected Contractspec React/browser packages.
  - Upgrade the affected Contractspec package versions after this release is published.
  - Rebuild the downstream production bundle so it picks up the republished artifacts.
- Upgrade steps:
  - [manual] Verify production bundles no longer import the dev JSX runtime: Check released JS artifacts for `react/jsx-dev-runtime` imports or `jsxDEV(` call sites.
    - Rebuild the affected package set with the updated `@contractspec/tool.bun`.
    - Scan `dist/` output for `react/jsx-dev-runtime` imports and `jsxDEV(` call sites before publishing.

### Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
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
- Integrator: Integrators can scaffold feature, form, and package targets, consume the published schema and rich form exports, and reuse the new UI kit primitives across web and React Native surfaces.
- Customer: CLI and VS Code users get shell completion, guided setup presets, stronger spec discovery, and richer generated form and data-view rendering.
- Deprecations:
  - The standalone contractspec apply command has been removed; use contractspec generate for write-generation flows.
- Replace retired contractspec apply invocations: Update automation, docs, and local shell habits to use the new generate-first CLI flow.



### Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
- Customer: CLI and VS Code users get shell completion, guided setup presets, stronger spec discovery, and richer generated form and data-view rendering.
- Replace retired contractspec apply invocations: Update automation, docs, and local shell habits to use the new generate-first CLI flow.
  - Replace contractspec apply invocations with the matching contractspec generate command for write-generation workflows.
  - Reinstall or regenerate shell completion so the updated command tree is available in developer shells.
  - If you redistribute the contractspec package, ensure the packaged contractsrc.schema.json asset ships with the CLI wrapper.
- Upgrade steps:
  - [assisted] Adopt preset-driven setup and schema packaging: Use the new init presets and packaged schema assets when bootstrapping workspaces or editor integrations.
    - Run contractspec init --preset core, connect, builder-managed, builder-local, or builder-hybrid instead of hand-authoring the initial workspace config.
    - Wire editor or automation experiences to the published contractsrc.schema.json artifact rather than copying ad hoc schema snapshots.
    - Use the new workspace discovery and package-scaffold validation surfaces before materializing authored package targets.
  - [manual] Adopt the richer form contract and UI surfaces: Switch form-oriented consumers to the new contract exports and UI primitives where you want richer rendering coverage.
    - Import the new form showcase and workspace-schema exports from @contractspec/lib.contracts-spec when validating or demonstrating rich field coverage.
    - Update React and design-system form renderers to use the new contract-aware field, theme, and translation surfaces.
    - Adopt the new ui-kit-web and React Native primitives only where the added controls are needed; existing imports continue to work.
  - [manual] Validate the updated editor setup flow: Confirm VS Code setup and spec discovery use the new shared workspace flow.
    - Open the VS Code extension and run the setup flow to confirm presets, next steps, and spec discovery match CLI behavior.
    - Verify the refreshed workspace views discover feature, form, and authored package targets through the shared workspace services.

### Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.harness@0.3.4 (minor)
- @contractspec/integration.harness-runtime@0.3.4 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/example.harness-lab@3.8.4 (minor)
- Integrator: Integrators can run OSS full-app verification locally or in CI with Playwright, agent-browser, or both, while writing replay bundles and browser evidence under `.contractspec/harness`.
- Customer: Browser, authenticated, and visual app flows can now be verified with replayable evidence before accepting provider or agent-generated work.



### Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
- Customer: Browser, authenticated, and visual app flows can now be verified with replayable evidence before accepting provider or agent-generated work.
- No manual migration steps recorded.

### Add inline preview support for the Wealth Snapshot and Pocket Family Office examples in the templates catalog.
- @contractspec/example.pocket-family-office@3.8.3 (minor)
- @contractspec/example.wealth-snapshot@3.8.3 (minor)
- @contractspec/module.examples@4.0.8 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Preview-consuming bundles and apps can resolve inline previews for both finance examples once the new example package dependencies are installed.
- Customer: `/templates` can now open useful inline previews for Wealth Snapshot and Pocket Family Office instead of only linking through the sandbox flow.



### Add inline preview support for the Wealth Snapshot and Pocket Family Office examples in the templates catalog.
- Customer: `/templates` can now open useful inline previews for Wealth Snapshot and Pocket Family Office instead of only linking through the sandbox flow.
- No manual migration steps recorded.

### Teach the Integration Hub example to model managed/BYOK credential setup and monorepo-aware env aliases.
- @contractspec/example.integration-hub@3.9.0 (minor)
- Integrator: The Integration Hub example now exposes credential setup manifests, safe secret references, and app-specific Next/Expo env aliases for managed and BYOK integrations.



### Teach the Integration Hub example to model managed/BYOK credential setup and monorepo-aware env aliases.
- No manual migration steps recorded.

### Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- @contractspec/lib.knowledge@3.8.4 (patch)
- @contractspec/lib.contracts-spec@6.3.0 (patch)
- Integrator: Consumers of `@contractspec/lib.knowledge` no longer need to copy fragment text into metadata for retrieval and RAG queries to work.
- Remove custom knowledge payload text shims: Stop copying fragment text into metadata solely to make downstream retrieval/query flows return readable content.



### Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- Remove custom knowledge payload text shims: Stop copying fragment text into metadata solely to make downstream retrieval/query flows return readable content.
  - Upgrade to the patched `@contractspec/lib.knowledge` release.
  - Remove any pre-upsert metadata workaround that duplicates `fragment.text` into `metadata.text`.
- Upgrade steps:
  - [manual] Verify indexed knowledge payloads expose canonical text: Check that vector payloads now include `payload.text` and that retrieval/query flows surface readable snippets without custom metadata shims.
    - Re-run the ingestion flow that feeds your knowledge index.
    - Inspect the stored vector payloads or downstream references for canonical `payload.text` content.

### Complete the knowledge OSS surface with stricter guardrails and an easier runtime path.
- @contractspec/lib.knowledge@3.8.4 (minor)
- @contractspec/example.knowledge-canon@3.8.4 (minor)
- Integrator: Integrators can compose `KnowledgeRuntime`, use per-query overrides, rely on typed retrieval filters, and see real example usage in the knowledge-canon package.
- Update flows that depended on permissive automation writes: `KnowledgeAccessGuard` now enforces `automationWritable`, so spaces or callers that relied on writes being allowed must be updated before upgrading.
- Provide explicit scoped workflow and agent bindings: Missing workflow or agent names no longer bypass scoped bindings implicitly.



### Complete the knowledge OSS surface with stricter guardrails and an easier runtime path.
- Update flows that depended on permissive automation writes: `KnowledgeAccessGuard` now enforces `automationWritable`, so spaces or callers that relied on writes being allowed must be updated before upgrading.
  - Update the affected space definition to allow the required write path, or change the calling flow so it no longer attempts that write.
  - Verify automation-triggered write operations still succeed only for explicitly writable spaces.
- Provide explicit scoped workflow and agent bindings: Missing workflow or agent names no longer bypass scoped bindings implicitly.
  - Pass the correct workflow and agent binding identifiers explicitly wherever scoped bindings are required.
  - Re-run the affected retrieval or mutation flows to confirm the intended scope still resolves.
- Upgrade steps:
  - [manual] Use the higher-level runtime helper when you want a simple OSS setup: Prefer `createKnowledgeRuntime(...)` for the common ingest, retrieve, and answer flow instead of composing every low-level primitive by hand.
    - Provide embedding and vector-store providers, plus an LLM provider if you want `query(...)`.
    - Set `collection`, `namespace`, and either `spaceKey` or `spaceCollections`.
    - Keep using the lower-level primitives directly when you need custom orchestration.

### Add a shared marketing content/navigation surface and convert the Expo demo into a native public-nav companion for the ContractSpec OSS-first story.
- @contractspec/bundle.marketing@3.8.24 (patch)
- Integrator: Integrators can import shared ContractSpec landing copy, public navigation, page content, and CTA metadata from `@contractspec/bundle.marketing/content` without pulling web-only React components into native shells.
- Customer: The Expo demo now presents native Home, Product, Templates, Pricing, Docs, and Changelog companion routes instead of the previous task-list demo.



### Add a shared marketing content/navigation surface and convert the Expo demo into a native public-nav companion for the ContractSpec OSS-first story.
- Customer: The Expo demo now presents native Home, Product, Templates, Pricing, Docs, and Changelog companion routes instead of the previous task-list demo.
- No manual migration steps recorded.

### Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/tool.bun@3.7.18 (patch)
- Integrator: Expo apps can import `@contractspec/lib.design-system/renderers` and rely on `withPresentationMetroAliases` to remap shared ui-kit-web imports instead of using a separate native renderer.
- Import FormRender from the shared renderers subpath on mobile: Avoid broad root-barrel imports for mobile FormSpec rendering while keeping one shared design-system renderer.



### Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Import FormRender from the shared renderers subpath on mobile: Avoid broad root-barrel imports for mobile FormSpec rendering while keeping one shared design-system renderer.
  - Import `formRenderer` from `@contractspec/lib.design-system/renderers`.
  - Keep `withPresentationMetroAliases` enabled in the Expo Metro config.
  - Do not introduce a native-only design-system FormRender path.
- Upgrade steps:
  - [assisted] Rebuild and syntax-check design-system artifacts: The generated package output should remain parseable and preserve imports for Metro aliasing.
    - Run `bun run --cwd packages/libs/design-system build`.
    - Run `bun run --cwd packages/libs/design-system test:build-artifacts`.
    - Run `bun run --cwd packages/apps/mobile-demo typecheck`.

### Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- @contractspec/app.expo-demo (patch)
- Integrator: Expo apps using the ContractSpec Metro alias helper avoid Hermes `__extends` crashes in ECharts/ZRender paths while gesture-backed native chart interactions have the required root provider.
- Restart Metro with a clean cache: Native Metro resolver changes and gesture-handler entry setup require a clean dev-server restart.



### Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
- Restart Metro with a clean cache: Native Metro resolver changes and gesture-handler entry setup require a clean dev-server restart.
  - Run `expo start --clear` from the Expo app workspace.
  - Rebuild the dev client only if `react-native-gesture-handler` was not already compiled into the installed native binary.
- Upgrade steps:
  - [assisted] Verify the Expo iOS bundle: Confirm mobile routing, gesture setup, and native chart import paths still bundle under Metro.
    - Run the focused presentation-runtime Metro alias test and typecheck.
    - Run the mobile demo typecheck and test suite.
    - Run an iOS export with a cleared Metro cache.

### Promote the Expo demo Examples surface to first-class navigation and reuse shared preview components so mobile and web example previews stay aligned.
- @contractspec/app.expo-demo (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/example.agent-console@3.8.23 (patch)
- @contractspec/module.examples@4.0.8 (minor)
- Integrator: Consumers can use the example preview surface metadata to provide docs, sandbox, source, LLMS, and native preview actions from one catalog.
- Customer: The mobile demo now shows Examples as a normal product surface and renders Agent Console with the same shared preview structure used by web.
- Prefer shared preview components for web/mobile example parity: Rich example previews should reuse cross-platform components through the UI kit alias layer before falling back to app-local native summaries.



### Promote the Expo demo Examples surface to first-class navigation and reuse shared preview components so mobile and web example previews stay aligned.
- Customer: The mobile demo now shows Examples as a normal product surface and renders Agent Console with the same shared preview structure used by web.
- Prefer shared preview components for web/mobile example parity: Rich example previews should reuse cross-platform components through the UI kit alias layer before falling back to app-local native summaries.
  - Export a focused preview subpath that does not pull web-only modules into Expo.
  - Import UI primitives through the shared UI kit boundary so Metro can map web imports to native components.
  - Keep mobile generic fallbacks only for examples without stable shared data or reusable components.
- Upgrade steps:
  - [assisted] Verify web and mobile example preview parity: Re-run catalog, web preview, mobile preview, and Expo export checks after changing example preview wiring.
    - Run the module examples runtime preview tests.
    - Run mobile example registry and landing handler tests.
    - Run Agent Console preview smoke tests.
    - Run an Expo export smoke check for the mobile demo.

### Replace the native UI-kit data table resize handle's gesture-handler dependency with a Reanimated responder boundary.
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Integrator: Native UI-kit consumers can render data tables without pulling in `react-native-gesture-handler` solely for column resizing.
- Customer: Native data table resizing keeps the same visible behavior while reducing gesture runtime coupling.
- Deprecations:
  - Do not import `react-native-gesture-handler` for the native UI-kit data table resize handle; use the Reanimated-backed implementation.



### Replace the native UI-kit data table resize handle's gesture-handler dependency with a Reanimated responder boundary.
- Customer: Native data table resizing keeps the same visible behavior while reducing gesture runtime coupling.
- No manual migration steps recorded.

### Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- @contractspec/lib.design-system@4.4.2 (major)
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- Integrator: Design-system platform variants now use Metro's standard `.native` suffix and no longer publish `.mobile` subpaths.
- Deprecations:
  - Direct imports such as `@contractspec/lib.design-system/components/molecules/Tabs.mobile` have been replaced by `.native` subpaths.
- Replace direct `.mobile` design-system imports: Move direct design-system platform imports from `.mobile` to `.native`.



### Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Replace direct `.mobile` design-system imports: Move direct design-system platform imports from `.mobile` to `.native`.
  - Replace imports ending in `.mobile` with the matching `.native` subpath.
  - Prefer unsuffixed design-system imports when the same call site should run on both web and native.
  - Restart Metro after upgrading so stale package export maps are cleared.
- Upgrade steps:
  - [manual] Regenerate design-system exports: Keep package exports and registry metadata aligned with `.native` source files.
    - Run `cd packages/libs/design-system && bun run prebuild && bun run registry:build`.
    - Verify no `*.mobile.tsx` platform files remain in `packages/libs/design-system/src`.

### Harden native Pagination layout with shared stack primitives, safer page math, and accessible control labels.
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Integrator: Consumers keep the same Pagination props while receiving more defensive item range display behavior when page or page-size inputs drift out of bounds.
- Customer: Pagination controls retain the same visual behavior with clearer accessibility labels for first, previous, numbered, next, and last page actions.



### Harden native Pagination layout with shared stack primitives, safer page math, and accessible control labels.
- Customer: Pagination controls retain the same visual behavior with clearer accessibility labels for first, previous, numbered, next, and last page actions.
- No manual migration steps recorded.

### Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/lib.design-system@4.4.2 (patch)
- @contractspec/module.ai-chat@4.3.31 (patch)
- Integrator: Cross-package UI imports should use precise public subpaths instead of root design-system imports when published packages may be consumed through platform conditions.
- Prefer precise design-system subpaths for published UI packages: Replace root design-system imports in published UI modules with exact public component subpaths.



### Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Prefer precise design-system subpaths for published UI packages: Replace root design-system imports in published UI modules with exact public component subpaths.
- Upgrade steps:
  - [manual] Rebuild packages with native-family entries: Run contractspec-bun-build prebuild and build so dist/native includes shared generic helper files.
    - Rebuild packages that publish .native, .ios, or .android source variants.
    - Restart Metro after upgrading packages with changed native publish artifacts.

### Keep shared table string headers and cells as primitive render-model values so React Native table renderers can wrap them in Text.
- @contractspec/lib.presentation-runtime-react@40.0.2 (patch)
- @contractspec/lib.presentation-runtime-react-native@40.0.2 (patch)
- Integrator: Expo consumers can keep importing the shared table hook through the native presentation runtime while native UI-kit tables receive strings they can wrap in Text.
- Customer: Agent-console and other native table previews no longer fail when string table headers or formatted cell values render inside React Native table cells.



### Keep shared table string headers and cells as primitive render-model values so React Native table renderers can wrap them in Text.
- Customer: Agent-console and other native table previews no longer fail when string table headers or formatted cell values render inside React Native table cells.
- No manual migration steps recorded.

### Add native UI-kit subpaths for Metro's ui-kit-web alias surface so Expo builds can resolve shared design-system form controls.
- @contractspec/lib.ui-kit@4.1.5 (patch)
- Integrator: Expo consumers can import shared design-system form controls without Metro failing on missing native ui-kit subpaths.
- Customer: Mobile demo and native product surfaces can render shared form controls without bundler resolution errors.



### Add native UI-kit subpaths for Metro's ui-kit-web alias surface so Expo builds can resolve shared design-system form controls.
- Customer: Mobile demo and native product surfaces can render shared form controls without bundler resolution errors.
- No manual migration steps recorded.

### Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.notification@0.2.1 (minor)
- @contractspec/module.notifications@3.8.4 (patch)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.wealth-snapshot@3.8.3 (patch)
- @contractspec/example.saas-boilerplate@3.8.23 (patch)
- Integrator: Applications can adopt the new library imports without breaking existing module imports, then wire AppShell notification state through props.
- Deprecations:
  - The `@contractspec/module.notifications` package remains import-compatible for this release, but new code should import contracts from `@contractspec/lib.contracts-spec/notifications` and runtime helpers from `@contractspec/lib.notification`.
- Prefer library-first notification imports: Move new notification integrations away from the module shim.
- Connect AppShell notifications through host state: Provide notification items and callbacks to the design-system shell without coupling it to a delivery runtime.



### Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Prefer library-first notification imports: Move new notification integrations away from the module shim.
  - Import notification contracts from `@contractspec/lib.contracts-spec/notifications`.
  - Import notification schema contribution, channels, templates, and i18n helpers from `@contractspec/lib.notification`.
  - Keep existing `@contractspec/module.notifications` imports during migration when consumers need the legacy schema contribution module id.
- Connect AppShell notifications through host state: Provide notification items and callbacks to the design-system shell without coupling it to a delivery runtime.
  - Pass the `notifications` prop to `AppShell` with items, unread count, and mark-read callbacks.
  - Resolve live delivery, persistence, and subscriptions in the host app or runtime package.
  - Use the native shell entrypoint for Expo surfaces so the same notification state appears through the native header/menu affordance.
- Upgrade steps:
  - [manual] Verify notification schema contribution identity: Confirm old module imports keep the legacy module id while new library imports use the library module id.
    - Check `notificationsSchemaContribution.moduleId` from `@contractspec/lib.notification` is `@contractspec/lib.notification`.
    - Check `notificationsSchemaContribution.moduleId` from `@contractspec/module.notifications` is still `@contractspec/module.notifications`.

### Normalize notification template locale resolution and merge partial locale channel overrides without dropping base channel content.
- @contractspec/module.notifications@3.8.4 (patch)
- Integrator: Localized notification templates no longer fall back to English for supported regional locale variants, and partial localized channel overrides retain the default title/action payload.



### Normalize notification template locale resolution and merge partial locale channel overrides without dropping base channel content.
- No manual migration steps recorded.

### Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: AppShell consumers get a floating desktop PageOutline that no longer reserves a right content column, while mobile and native outline behavior remains menu-contained.



### Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
- No manual migration steps recorded.

### Add an extensible design-system object reference handler for actionable references.
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Product surfaces can replace inert addresses, phone numbers, users, customers, files, URLs, and custom references with one extensible interaction surface.
- Customer: Reference text can now offer quick actions such as copy, open, call, or maps navigation from a consistent interaction surface.



### Add an extensible design-system object reference handler for actionable references.
- Customer: Reference text can now offer quick actions such as copy, open, call, or maps navigation from a consistent interaction surface.
- No manual migration steps recorded.

### Add concrete omnichannel notification channels for email, SMS, Telegram, and WhatsApp.
- @contractspec/module.notifications@3.8.4 (minor)
- Integrator: Integrators can register ready-made email, SMS, Telegram, and WhatsApp channels and keep notification contracts aligned with those delivery targets.
- Replace custom omnichannel notification wrappers: Prefer the built-in provider-backed channels for email, SMS, Telegram, and WhatsApp.



### Add concrete omnichannel notification channels for email, SMS, Telegram, and WhatsApp.
- Replace custom omnichannel notification wrappers: Prefer the built-in provider-backed channels for email, SMS, Telegram, and WhatsApp.
  - Import `ProviderEmailChannel`, `ProviderSmsChannel`, `TelegramChannel`, and `WhatsappChannel` from `@contractspec/module.notifications/channels`.
  - Register those channels with `createChannelRegistry(...)` alongside any existing in-app, push, or webhook channels.
  - Use the expanded notification channel enums when persisting or validating delivery targets.
- Upgrade steps:
  - [manual] Update notification channel allowlists: Add the new omnichannel values anywhere channel enums are mirrored outside the module.
    - Add `SMS`, `TELEGRAM`, and `WHATSAPP` to any application-level channel allowlists or validation layers that mirror the module enums.

### Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Integrator: Existing imports and rendered pagination semantics stay compatible while layout classes align with the shared stack system.
- Customer: Pagination controls keep the same accessible labels and navigation behavior with no required migration.



### Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Customer: Pagination controls keep the same accessible labels and navigation behavior with no required migration.
- No manual migration steps recorded.

### Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Host renderers can set phone defaults through `createFormRenderer({ phone })`, while individual FormSpecs can choose object, E.164, or split linked outputs.
- Customer: Form-rendered phone fields can show country flags, detect countries from international input, and keep single or split controls synchronized.



### Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Customer: Form-rendered phone fields can show country flags, detect countries from international input, and keep single or split controls synchronized.
- No manual migration steps recorded.

### Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- @contractspec/tool.bun@3.7.18 (patch)
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- Integrator: Packages can publish .ios, .android, .native, and .web source variants with matching conditional exports and build outputs.
- Customer: Cross-platform UI packages can resolve platform-specific variants more reliably in Expo, React Native, and Next.js projects.
- Regenerate package exports for platform variants: Run contractspec-bun-build prebuild in packages that add or rename .ios, .android, .native, or .web source entries.



### Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Customer: Cross-platform UI packages can resolve platform-specific variants more reliably in Expo, React Native, and Next.js projects.
- Regenerate package exports for platform variants: Run contractspec-bun-build prebuild in packages that add or rename .ios, .android, .native, or .web source entries.
- Upgrade steps:
  - [manual] Restart Metro after platform export changes: Metro may cache previous package export maps and should be restarted after upgrading packages that add platform variant exports.
    - Stop the Expo or React Native dev server.
    - Restart Metro after package exports have been regenerated and rebuilt.

### Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
- @contractspec/lib.presentation-runtime-core@5.2.2 (patch)
- Integrator: Shared React/React Native surfaces can import lucide icons through the platform-natural package while bundler helpers rewrite them for Expo or Next.js.
- Customer: Mobile and web previews avoid lucide package mismatches when shared UI code crosses the Expo and Next.js boundaries.



### Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
- Customer: Mobile and web previews avoid lucide package mismatches when shared UI code crosses the Expo and Next.js boundaries.
- No manual migration steps recorded.

### Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- @contractspec/lib.presentation-runtime-core@5.2.2 (major)
- Integrator: Integrators must rename `withPresentationNextAliases` calls to `withPresentationWebpackAliases` or move to `withPresentationTurbopackAliases`, depending on which Next.js bundler they use.
- Customer: Public docs now teach Turbopack as the default Next.js path and Webpack as an explicit fallback, with root-imported helpers for Next and Metro examples backed by npm-packable dist files.
- Replace the removed Next helper: The old helper name has been removed in favor of bundler-specific names.
- Move Turbopack setup to `nextConfig.turbopack`: Turbopack aliasing is now configured by patching the full Next config object instead of mutating a webpack resolver config.



### Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Customer: Public docs now teach Turbopack as the default Next.js path and Webpack as an explicit fallback, with root-imported helpers for Next and Metro examples backed by npm-packable dist files.
- Replace the removed Next helper: The old helper name has been removed in favor of bundler-specific names.
  - Replace `withPresentationNextAliases` with `withPresentationTurbopackAliases` for default Next.js apps that use the `turbopack` config block.
  - Replace `withPresentationNextAliases` with `withPresentationWebpackAliases` only in code that still configures `nextConfig.webpack`.
  - Import all three helpers from the root `@contractspec/lib.presentation-runtime-core` entrypoint.
- Move Turbopack setup to `nextConfig.turbopack`: Turbopack aliasing is now configured by patching the full Next config object instead of mutating a webpack resolver config.
  - Wrap the full Next config object with `withPresentationTurbopackAliases(...)`.
  - Keep any existing `turbopack.resolveAlias` entries; the helper merges them with the presentation aliases.
  - Use `next dev --webpack` or `next build --webpack` only when a project intentionally stays on the webpack fallback path.
- Upgrade steps:
  - [assisted] Re-run helper and docs verification: Confirm the runtime helpers, generated docs, and website-facing docs now agree on the new names.
    - Run the focused helper tests, typecheck, and lint checks in `@contractspec/lib.presentation-runtime-core`.
    - Re-run the bundle-library docs manifest test and typecheck.
    - Regenerate the web-facing `/llms*` surface after the README changes.

### Add PWA update management contracts and runtime helpers.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-server-rest@3.9.1 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- Integrator: App developers can define PWA release policy once, override it per release, and consume a standard update-check API from the frontend.
- Adopt the PWA update-check contract: Register the PWA update operation, bind it to a manifest resolver, and call it from the frontend on startup or polling intervals.



### Add PWA update management contracts and runtime helpers.
- Adopt the PWA update-check contract: Register the PWA update operation, bind it to a manifest resolver, and call it from the frontend on startup or polling intervals.
  - Define a PWA app manifest with `defaultUpdatePolicy` and release entries.
  - Add per-release `updatePolicy` overrides when a release must be optional, required, or disabled.
  - Bind `createPwaUpdateCheckHandler` to the `pwa.update.check` operation.
  - Use `usePwaUpdateChecker` in the frontend and keep service worker activation inside the host app callback.

### Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
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
- Integrator: Integrators must adopt the new adaptive journey contracts/types and can rely on shared learning sandbox presentations resolving correctly for the supported `learning-journey-*` templates.
- Customer: Learning journey demos now follow the adaptive branch-aware runtime, and the public sandbox no longer fails when loading the shared learning presentation descriptors for supported learning templates.
- Move learning integrations to the adaptive journey runtime: Replace the old onboarding-centric learning contracts and local example progress logic with the canonical adaptive `learning.journey.*` runtime.
- Align learning template mappings with the shared learning registry: Use the shared learning registry mapping/data helpers so supported learning sandbox templates resolve the shared presentation set consistently.



### Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
- Customer: Learning journey demos now follow the adaptive branch-aware runtime, and the public sandbox no longer fails when loading the shared learning presentation descriptors for supported learning templates.
- Move learning integrations to the adaptive journey runtime: Replace the old onboarding-centric learning contracts and local example progress logic with the canonical adaptive `learning.journey.*` runtime.
  - Update contract references from `learning.onboarding.*` to `learning.journey.*`.
  - Replace old onboarding/progress type imports with the new adaptive journey types and projected progress snapshots.
  - Remove any local learning track evaluators or progress stores that duplicate the module runtime.
- Align learning template mappings with the shared learning registry: Use the shared learning registry mapping/data helpers so supported learning sandbox templates resolve the shared presentation set consistently.
  - Add the template to the learning registry template map and track lookup helpers.
  - Ensure the template’s presentation list uses the shared `learning.journey.*` keys only when the registry can provide matching data.
  - Register descriptor resolution and markdown rendering in `@contractspec/module.examples`.
- Upgrade steps:
  - [assisted] Rebuild learning package release artifacts after upgrading: The affected learning packages should be rebuilt and revalidated together because the runtime, examples, and sandbox wiring now depend on the same adaptive presentation/runtime surface.
    - Run package-level build, test, typecheck, and lint checks for the affected learning packages.
    - Regenerate example registry artifacts if `@contractspec/module.examples` dependencies change.
    - Verify at least one supported learning sandbox route renders markdown successfully.

### Restore npm provenance-safe publishing for the public integration packages by declaring repository metadata and failing release discovery before publish when it is missing.
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
- Integrator: Integrator release automation can republish the affected integration packages with npm provenance enabled without hitting the empty repository URL validation failure.
- Customer: This patch only corrects publish metadata for the affected integration packages; their runtime APIs and behavior are unchanged.



### Restore npm provenance-safe publishing for the public integration packages by declaring repository metadata and failing release discovery before publish when it is missing.
- Customer: This patch only corrects publish metadata for the affected integration packages; their runtime APIs and behavior are unchanged.
- No manual migration steps recorded.

### Render resolver-backed combobox results as a floating overlay instead of inline form content.
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Integrator: Existing combobox props and FormSpec autocomplete drivers remain compatible while resolver-backed result panels no longer change parent layout height.
- Customer: Autocomplete fields in ContractSpec web forms now open search results as an overlay that tracks the input width and scrolls internally.



### Render resolver-backed combobox results as a floating overlay instead of inline form content.
- Customer: Autocomplete fields in ContractSpec web forms now open search results as an overlay that tracks the input width and scrolls internally.
- No manual migration steps recorded.

### Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
- @contractspec/module.examples@4.0.8 (minor)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can use the new `@contractspec/module.examples` helpers to list discoverable examples and template examples without reimplementing visibility and surface filtering.
- Customer: The public website now shows the full non-internal template catalog, generates example docs for experimental examples, and keeps sandbox template pages useful even when a bespoke interactive preview is unavailable.



### Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
- Customer: The public website now shows the full non-internal template catalog, generates example docs for experimental examples, and keeps sandbox template pages useful even when a bespoke interactive preview is unavailable.
- No manual migration steps recorded.

### Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.identity-rbac@3.8.1 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/lib.personalization@6.1.1 (minor)
- Integrator: AppShell navigation and personalization adapters can consume runtime policy decisions without becoming enforcement authorities.
- Customer: Workspace applications can hide or disable unauthorized navigation and avoid promoting denied fields while server-side policy decisions remain authoritative.
- Adopt shared PolicyRequirement metadata incrementally: Existing policies continue to work; add roles, permissions, policy refs, and field policies when a contract needs stronger authorization metadata.



### Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
- Customer: Workspace applications can hide or disable unauthorized navigation and avoid promoting denied fields while server-side policy decisions remain authoritative.
- Adopt shared PolicyRequirement metadata incrementally: Existing policies continue to work; add roles, permissions, policy refs, and field policies when a contract needs stronger authorization metadata.
  - Import shared policy requirement types from `@contractspec/lib.contracts-spec/policy` when authoring reusable contract metadata.
  - Keep server/runtime `ctx.decide` or RBAC evaluation as the source of enforcement authority.
  - Pass evaluated decisions to AppShell and personalization helpers only for UX adaptation and suppression.
- Upgrade steps:
  - [assisted] Wire app-owned dynamic RBAC providers: Apps that store workspace-specific role bindings can implement a role-permission source and pass it to `RBACPolicyEngine.evaluateRequirement`.
    - Resolve static templates and dynamic role/binding records for the current tenant/workspace.
    - Mark explicit denies with `effect: "deny"` so they override static/template grants.
    - Treat provider failure as a protected-operation denial unless an audited break-glass path exists.

### Split provider implementations into targeted integration packages while preserving the legacy providers-impls facade.
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
- Integrator: Consumers can now install the provider implementation domain they need instead of the broad compatibility package.
- Import concrete providers from targeted packages: Replace direct provider imports such as `@contractspec/integration.providers-impls/impls/gmail-inbound` with targeted packages such as `@contractspec/integration.provider.email/impls/gmail-inbound`.
- Keep the all-provider factory on providers-impls: Continue importing `IntegrationProviderFactory` from `@contractspec/integration.providers-impls/impls/provider-factory` when you need broad provider routing.



### Split provider implementations into targeted integration packages while preserving the legacy providers-impls facade.
- Import concrete providers from targeted packages: Replace direct provider imports such as `@contractspec/integration.providers-impls/impls/gmail-inbound` with targeted packages such as `@contractspec/integration.provider.email/impls/gmail-inbound`.
- Keep the all-provider factory on providers-impls: Continue importing `IntegrationProviderFactory` from `@contractspec/integration.providers-impls/impls/provider-factory` when you need broad provider routing.

### Stabilize release artifact generation so customer-facing release files stay current-release-only and deterministic.
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/app.web-landing (patch)
- contractspec@1.46.2 (patch)
- Integrator: Tooling that needs full changelog history should consume `generated/releases/history/manifest.json`; current release guidance stays under `generated/releases/*`.
- Customer: Customer-facing release bundles are smaller and avoid repeatedly rewriting old release entries.
- Generate full release history explicitly: Consumers that previously treated `generated/releases/manifest.json` as a full historical changelog should build the history output path.



### Stabilize release artifact generation so customer-facing release files stay current-release-only and deterministic.
- Customer: Customer-facing release bundles are smaller and avoid repeatedly rewriting old release entries.
- Generate full release history explicitly: Consumers that previously treated `generated/releases/manifest.json` as a full historical changelog should build the history output path.
  - Run `contractspec release build --scope all --output generated/releases/history` before building full changelog surfaces.
  - Keep `generated/releases/*` for current GitHub Release notes, upgrade prompts, and customer AI guidance.
- Upgrade steps:
  - [manual] Keep current release artifacts compact: Use the default release build for current release communication and the explicit history scope only when a full changelog is required.
    - Run `bun run release:build` for the current release bundle.
    - Run `bun packages/apps/cli-contractspec/src/cli.ts release check --strict --baseline main` after regenerating artifacts.
    - Use `--scope all --output generated/releases/history` for website changelog history builds.

### Teach contractspec-bun-build to publish public CSS style files as direct style conditional subpath exports.
- @contractspec/tool.bun@3.7.18 (patch)
- Integrator: Packages built with contractspec-bun-build can expose public CSS files such as `styles/globals.css` through package exports under the `style` condition.
- Regenerate exports for packages with public CSS: Run `contractspec-bun-build prebuild` in packages that should publish direct CSS subpath exports.
- Import public CSS through exported subpaths: Import package styles from direct subpaths such as `@scope/package/styles/globals.css` after the package has regenerated exports and rebuilt artifacts.



### Teach contractspec-bun-build to publish public CSS style files as direct style conditional subpath exports.
- Regenerate exports for packages with public CSS: Run `contractspec-bun-build prebuild` in packages that should publish direct CSS subpath exports.
- Import public CSS through exported subpaths: Import package styles from direct subpaths such as `@scope/package/styles/globals.css` after the package has regenerated exports and rebuilt artifacts.

### Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.
- @contractspec/lib.support-bot@4.0.8 (major)
- Integrator: `defineSupportBot` no longer accepts `autoEscalateThreshold`; integrators must migrate to the explicit `thresholds` object and can now pass `review` directly.
- Replace the old support-bot threshold field: Migrate `defineSupportBot` calls from the overloaded `autoEscalateThreshold` field to the explicit `thresholds` object.



### Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.
- Replace the old support-bot threshold field: Migrate `defineSupportBot` calls from the overloaded `autoEscalateThreshold` field to the explicit `thresholds` object.
  - Replace `autoEscalateThreshold` with `thresholds.autoResolveMinConfidence` when you mean the auto-response cutoff.
  - Set `thresholds.escalationConfidenceThreshold` when you need a distinct policy escalation cutoff.
  - Move any external review routing into the new top-level `review` field if the spec should expose queue or approval workflow metadata.

### Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.design-system@4.4.2 (minor)
- Integrator: Integrators can resolve ThemeSpec tokens for light or dark mode, consume a Tailwind preset, or serialize CSS text without adding a required generation step.
- Customer: Product surfaces can use ThemeSpec-backed light/dark themes with OKLCH colors while keeping existing Tailwind semantic classes such as `bg-primary` and `text-foreground`.



### Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Customer: Product surfaces can use ThemeSpec-backed light/dark themes with OKLCH colors while keeping existing Tailwind semantic classes such as `bg-primary` and `text-foreground`.
- No manual migration steps recorded.

### Publish TypeScript declarations for the @contractspec/tool.bun root config preset API.
- @contractspec/tool.bun@3.7.18 (patch)
- Integrator: TypeScript config files can import defineConfig, BuildConfig, and build presets from @contractspec/tool.bun with editor and compiler support.
- Customer: Customer projects get typed ContractSpec Bun build configuration instead of untyped package imports.



### Publish TypeScript declarations for the @contractspec/tool.bun root config preset API.
- Customer: Customer projects get typed ContractSpec Bun build configuration instead of untyped package imports.
- No manual migration steps recorded.

### Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-runtime-server-rest@3.9.1 (minor)
- @contractspec/lib.contracts-runtime-server-graphql@3.8.7 (minor)
- @contractspec/lib.contracts-runtime-server-mcp@3.8.8 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.1 (minor)
- @contractspec/lib.jobs@3.8.7 (minor)
- @contractspec/lib.error@3.7.21 (patch)
- Integrator: Integrators get consistent result mapping for REST, NextResponse, Nest-compatible filters/interceptors, GraphQL extensions, MCP tool errors, and React client parsing.
- Customer: Product surfaces can rely on consistent success metadata, retry hints, field issues, and Problem Details-style errors across API, job, workflow, and frontend boundaries.
- Deprecations:
  - Prefer `ContractSpecError`, `createContractError`, and `contractFail` from `@contractspec/lib.contracts-spec/results`; `@contractspec/lib.error` remains as a compatibility bridge for existing `AppError` users.
- Prefer contracts-spec result primitives for new error handling: Replace new uses of `AppError` with `ContractSpecError` or `contractFail`; existing `AppError` consumers can convert to a compatible problem shape with `appErrorToProblem`.



### Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
- Customer: Product surfaces can rely on consistent success metadata, retry hints, field issues, and Problem Details-style errors across API, job, workflow, and frontend boundaries.
- Prefer contracts-spec result primitives for new error handling: Replace new uses of `AppError` with `ContractSpecError` or `contractFail`; existing `AppError` consumers can convert to a compatible problem shape with `appErrorToProblem`.
  - Import new result helpers from `@contractspec/lib.contracts-spec/results`.
  - Keep existing `AppError` consumers until they are touched for feature work.
  - Use `appErrorToProblem` when a compatibility conversion is needed.
- Upgrade steps:
  - [assisted] Declare operation-specific success and failure outcomes: Use `defineResultCatalog`, `standardSuccess`, `standardErrors`, `success`, and `failure` from `@contractspec/lib.contracts-spec/results` when an operation, workflow, or job needs custom codes.
    - Keep raw handler returns for ordinary `OK` responses.
    - Use `contractAccepted`, `contractQueued`, `contractNoContent`, or `contractPartial` for non-default success outcomes.
    - Throw `createContractError` or return `contractFail` for known failures with typed args.
    - Declare custom success codes in `spec.results.success` or `io.success`, and custom failures in `spec.results.errors` or `io.errors`.
  - [assisted] Use canonical result mappers in adapters and clients: Route transport boundaries through the new result helpers while preserving raw success compatibility by default.
    - Use `OperationSpecRegistry.executeResult` in adapters that need success metadata or typed failures.
    - Set REST `resultEnvelope: true` only when clients should receive `{ ok, data }` success envelopes.
    - Enable GraphQL `resultExtensions` only when the server integration publishes collected success metadata.
    - Use React runtime parser/hooks to normalize REST, GraphQL, MCP, workflow, and job responses into `ContractResult`.

### Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
- @contractspec/lib.ui-kit-web@3.13.3 (patch)
- Integrator: Existing Button imports stay compatible while Radix trigger wrappers receive stable forwarded refs.
- Customer: Popover-backed controls using Button triggers avoid ref churn that could produce React maximum update depth errors.



### Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
- Customer: Popover-backed controls using Button triggers avoid ref churn that could produce React maximum update depth errors.
- No manual migration steps recorded.

### Split example discovery from rich runtime packages so lightweight consumers no longer install every ContractSpec example.
- @contractspec/module.examples@4.0.8 (major)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/bundle.marketing@3.8.24 (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- Integrator: `@contractspec/module.examples` root imports now expose catalog metadata only; rich runtime helpers moved to `@contractspec/module.examples/runtime`.
- Integrator: CLI installs avoid the full example dependency set and can fetch a selected example source on demand with `contractspec examples download <key>`.
- Import rich example runtime helpers from the runtime subpath: Replace runtime imports such as `TemplateRuntimeProvider`, `listTemplates`, and inline preview loaders from `@contractspec/module.examples` with `@contractspec/module.examples/runtime`.
- Use catalog imports for metadata-only example discovery: Import `listExamples`, `getExample`, `searchExamples`, route helpers, and source metadata from `@contractspec/module.examples/catalog` when runnable example code is not needed.



### Split example discovery from rich runtime packages so lightweight consumers no longer install every ContractSpec example.
- Import rich example runtime helpers from the runtime subpath: Replace runtime imports such as `TemplateRuntimeProvider`, `listTemplates`, and inline preview loaders from `@contractspec/module.examples` with `@contractspec/module.examples/runtime`.
- Use catalog imports for metadata-only example discovery: Import `listExamples`, `getExample`, `searchExamples`, route helpers, and source metadata from `@contractspec/module.examples/catalog` when runnable example code is not needed.

### Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
- @contractspec/lib.design-system@4.4.2 (minor)
- @contractspec/example.agent-console@3.8.23 (patch)
- @contractspec/example.crm-pipeline@3.7.31 (patch)
- @contractspec/example.data-grid-showcase@3.8.23 (patch)
- @contractspec/module.builder-workbench@0.2.13 (patch)
- @contractspec/module.execution-console@0.1.14 (patch)
- Integrator: Integrators can use one `Tabs` API with optional `value`, `defaultValue`, and `onValueChange` props across web and native surfaces.
- Customer: Example dashboards and execution consoles keep their existing tabbed UX while using the cross-platform design-system primitive.
- Prefer design-system Tabs for shared product surfaces: Consumers should import tabs from `@contractspec/lib.design-system` instead of lower-level UI-kit tab modules.



### Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
- Customer: Example dashboards and execution consoles keep their existing tabbed UX while using the cross-platform design-system primitive.
- Prefer design-system Tabs for shared product surfaces: Consumers should import tabs from `@contractspec/lib.design-system` instead of lower-level UI-kit tab modules.
  - Replace `@contractspec/lib.ui-kit-web/ui/tabs` or `@contractspec/lib.ui-kit/ui/tabs` imports with `@contractspec/lib.design-system`.
  - Use `defaultValue` for uncontrolled tabs, or `value` plus `onValueChange` for controlled tabs.
  - Keep existing `TabsList`, `TabsTrigger`, and `TabsContent` structure.
- Upgrade steps:
  - [manual] Migrate direct tab imports: Move tabbed product surfaces to the design-system root export.
    - Import `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` from `@contractspec/lib.design-system`.
    - Add `@contractspec/lib.design-system` as a package dependency if the consumer package did not already depend on it.
    - Re-run typecheck for the migrated package.

### Unify example preview metadata so templates, docs, sandbox, and mobile preview routes derive preview support from shared example registry data instead of hand-maintained lists.
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
- Integrator: Integrators consuming public example metadata can now detect inline-preview capability and fallback preview links through `@contractspec/module.examples`, and every public example now has a first-party `/docs/examples/<key>` route in web-landing.
- Customer: The public site now provides richer template previews and full docs-example coverage, while the mobile demo exposes every discoverable example through in-app native previews with richer panels for exported sample-data examples.
- Declare `entrypoints.ui` for UI-backed example packages: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.



### Unify example preview metadata so templates, docs, sandbox, and mobile preview routes derive preview support from shared example registry data instead of hand-maintained lists.
- Customer: The public site now provides richer template previews and full docs-example coverage, while the mobile demo exposes every discoverable example through in-app native previews with richer panels for exported sample-data examples.
- Declare `entrypoints.ui` for UI-backed example packages: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.
  - Add `ui: './ui'` to the example's `entrypoints` object in `src/example.ts`.
  - Update `scripts/generate-example-registry.ts` if the package needs a non-default preview component export.
  - Regenerate the example registries before publishing.
- Upgrade steps:
  - [assisted] Regenerate preview metadata after adding UI-backed examples: Keep the generated preview registry aligned with the workspace examples.
    - Run `bun scripts/generate-example-registry.ts --write`.
    - Re-run preview tests in `packages/modules/examples`, `packages/bundles/marketing`, and `packages/bundles/library`.
    - Verify `/templates`, `/docs/examples/<key>`, `/sandbox?template=<key>`, mobile `/examples`, compatibility `/examples-preview`, and mobile `example-preview?exampleKey=<key>` render the expected inline, fallback, or native preview action.

### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- @contractspec/app.cli-contractspec@6.3.2 (minor)
- @contractspec/app.web-landing (patch)
- Integrator: Guided upgrade plans and agent prompts now come from generated upgrade manifests instead of ad hoc prose.
- Customer: Web changelog consumers can prefer generated release manifests while older package changelogs remain supported as fallback.
- Deprecations:
  - The standalone release domain under `@contractspec/lib.contracts-spec/release` is deprecated in favor of versioning-owned release metadata.
- Add .release.yaml companions for changesets: Published release changesets now require a structured release capsule.



### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- Customer: Web changelog consumers can prefer generated release manifests while older package changelogs remain supported as fallback.
- Add .release.yaml companions for changesets: Published release changesets now require a structured release capsule.
  - Create `.changeset/<slug>.release.yaml` next to each published changeset.
  - Record customer impact, migration notes, validation commands, and evidence in the release capsule.
  - Run `contractspec release build` before `contractspec release check --strict`.
- Upgrade steps:
  - [manual] Scaffold release capsule companions: Add release capsules for changesets and include validation evidence.
    - Run `contractspec release init` for new release work.
    - Keep `.changeset/*.md` and `.changeset/*.release.yaml` together in the same PR.
    - Use `contractspec release brief` or `contractspec upgrade prompt` to generate maintainer, customer, and agent guidance.
  - [assisted] Use generated release manifests in tooling: Prefer generated release artifacts for changelog and upgrade flows.
    - Run `contractspec release build` to populate `generated/releases/`.
    - Point changelog or upgrade tooling at `generated/releases/manifest.json` and `generated/releases/upgrade-manifest.json`.

### Keep the VS Code extension production typecheck focused on runtime sources while allowing Bun-typed workspace imports to resolve.
- vscode-contractspec@3.10.12 (patch)
- Integrator: VS Code extension packaging no longer fails when workspace source imports reference Bun globals through shared ContractSpec packages.
- Customer: This patch restores extension build reliability without changing runtime extension behavior.



### Keep the VS Code extension production typecheck focused on runtime sources while allowing Bun-typed workspace imports to resolve.
- Customer: This patch restores extension build reliability without changing runtime extension behavior.
- No manual migration steps recorded.

### Add public website docs and prompts for flexible data-exchange import templates and user column mapping review.
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can use the public guide and prompts to accept partner CSV, JSON, or XML imports with alternate headers and localized value formats.
- Customer: Import-review flows can now be explained from the public docs with matched columns, required gaps, ignored source columns, and user remapping actions.
- Use the import-template guide for flexible ingestion flows: Start from `/docs/guides/data-exchange-import-templates` when adding a recommended import template that still accepts partner-specific files.



### Add public website docs and prompts for flexible data-exchange import templates and user column mapping review.
- Customer: Import-review flows can now be explained from the public docs with matched columns, required gaps, ignored source columns, and user remapping actions.
- Use the import-template guide for flexible ingestion flows: Start from `/docs/guides/data-exchange-import-templates` when adding a recommended import template that still accepts partner-specific files.
  - Define a reusable template with target fields, required columns, aliases, and value-format rules.
  - Dry-run CSV, JSON, or XML files with codec options before execution.
  - Show the client mapping-review state so users can remap columns or adjust formats before import.
  - Use `/llms/lib.data-exchange-core`, `/llms/lib.data-exchange-client`, and `/llms/lib.data-exchange-server` for package-specific agent context.
- Upgrade steps:
  - [manual] Keep website docs and LLM guides aligned for data-exchange imports: When data-exchange template behavior changes, update the package READMEs, public guide, web-landing README, and generated `/llms*` package guides together.
    - Update the data-exchange package READMEs for package-level API behavior.
    - Update `/docs/guides/data-exchange-import-templates` for end-to-end website guidance.
    - Regenerate or verify `/llms*` package guides before release.

### Add public docs and LLM guidance for preference-aware DataViews.
- @contractspec/app.web-landing (patch)
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/lib.personalization@6.1.1 (patch)
- Integrator: Public docs now show how to wire DataViewRenderer with resolveDataViewPreferences and trackDataViewInteraction.



### Add public docs and LLM guidance for preference-aware DataViews.
- No manual migration steps recorded.

### Add public web docs and agent guidance for the ContractSpec translation runtime and optional i18next adapter.
- @contractspec/bundle.library@3.10.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can find ContractSpec-first i18n runtime, SSR/hydration, and optional i18next adapter guidance from the website docs and `/llms*` surfaces.
- Customer: Public docs now explain how to keep ContractSpec translations canonical while using the optional i18next adapter for downstream app interoperability.
- Use the translation runtime guide for production i18n adoption: Start from `/docs/libraries/translation-runtime` when wiring ContractSpec translations into server, React, React Native, or i18next-backed app surfaces.



### Add public web docs and agent guidance for the ContractSpec translation runtime and optional i18next adapter.
- Customer: Public docs now explain how to keep ContractSpec translations canonical while using the optional i18next adapter for downstream app interoperability.
- Use the translation runtime guide for production i18n adoption: Start from `/docs/libraries/translation-runtime` when wiring ContractSpec translations into server, React, React Native, or i18next-backed app surfaces.
  - Open `/docs/libraries/translation-runtime` from the docs sidebar or libraries overview.
  - Use `/llms/lib.translation-runtime` when prompting agents for package-specific implementation context.
  - Keep `TranslationSpec` catalogs canonical and treat i18next resources as generated downstream adapter data.
- Upgrade steps:
  - [manual] Keep website docs and LLM guides aligned for translation runtime work: When translation runtime behavior changes, update the web docs route, package README, `/llms.txt`, and package-specific `/llms` guide together.
    - Update `@contractspec/lib.translation-runtime` README for package-level API behavior.
    - Update the shared library docs page for website readers.
    - Regenerate or verify `/llms*` package guides before release.