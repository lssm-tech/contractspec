# Customer Upgrade Guide



### Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- @contractspec/lib.contracts-spec@5.4.0 (minor)
- @contractspec/module.workspace@4.3.0 (minor)
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/bundle.library@3.9.0 (minor)
- @contractspec/app.cli-contractspec@6.0.0 (minor)
- vscode-contractspec@3.10.0 (minor)
- contractspec@1.46.2 (patch)
- @contractspec/lib.knowledge@3.7.20 (patch)
- @contractspec/biome-config@3.8.8 (patch)
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

### Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- @contractspec/bundle.workspace@4.5.0 (patch)
- @contractspec/app.cli-contractspec@6.0.0 (patch)
- Integrator: Fresh `contractspec init --preset builder-local` workspaces now include the Builder API base URL in both `.contractsrc.json` and VS Code settings, while older local-only configs still work through the hosted API fallback.



### Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- No manual migration steps recorded.

### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- @contractspec/lib.builder-spec@0.2.2 (minor)
- @contractspec/lib.builder-runtime@0.2.2 (minor)
- @contractspec/lib.mobile-control@0.2.2 (minor)
- @contractspec/lib.provider-runtime@0.2.2 (minor)
- @contractspec/module.builder-workbench@0.2.2 (minor)
- @contractspec/module.mobile-review@0.2.2 (minor)
- @contractspec/integration.runtime.local@0.2.2 (minor)
- @contractspec/integration.provider.gemini@0.2.1 (minor)
- @contractspec/app.cli-contractspec@6.0.0 (minor)
- @contractspec/bundle.library@3.9.0 (patch)
- Integrator: Integrators can adopt canonical bootstrap presets, register trusted local daemons, and consume richer snapshot-backed mobile review and operator posture data.
- Customer: Builder operators get clearer local runtime trust, lease, and channel-action status when reviewing rollouts away from the desktop workbench.



### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Customer: Builder operators get clearer local runtime trust, lease, and channel-action status when reviewing rollouts away from the desktop workbench.
- No manual migration steps recorded.

### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- @contractspec/lib.contracts-spec@5.4.0 (patch)
- @contractspec/lib.builder-spec@0.2.2 (minor)
- @contractspec/lib.provider-spec@0.2.0 (minor)
- @contractspec/lib.builder-runtime@0.2.2 (minor)
- @contractspec/lib.mobile-control@0.2.2 (minor)
- @contractspec/lib.provider-runtime@0.2.2 (minor)
- @contractspec/module.builder-workbench@0.2.2 (minor)
- @contractspec/module.mobile-review@0.2.2 (minor)
- @contractspec/integration.runtime@3.9.2 (minor)
- @contractspec/integration.runtime.managed@0.2.2 (minor)
- @contractspec/integration.runtime.local@0.2.2 (minor)
- @contractspec/integration.runtime.hybrid@0.2.2 (minor)
- @contractspec/integration.builder-telegram@0.2.2 (minor)
- @contractspec/integration.builder-voice@0.2.2 (minor)
- @contractspec/integration.builder-whatsapp@0.2.2 (minor)
- @contractspec/integration.provider.codex@0.2.1 (minor)
- @contractspec/integration.provider.claude-code@0.2.1 (minor)
- @contractspec/integration.provider.gemini@0.2.1 (minor)
- @contractspec/integration.provider.copilot@0.2.1 (minor)
- @contractspec/integration.provider.stt@0.2.1 (minor)
- @contractspec/integration.provider.local-model@0.2.1 (minor)
- Integrator: Integrators can compose managed, local, and hybrid runtime modes with Builder workbench/mobile-review modules and provider adapters for Codex, Claude Code, Gemini, Copilot, STT, and local models.
- Customer: Builder operators now get a unified workbench and mobile-review experience across provider routing, readiness, export approval, and omnichannel control flows.



### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Customer: Builder operators now get a unified workbench and mobile-review experience across provider routing, readiness, export approval, and omnichannel control flows.
- No manual migration steps recorded.

### Unify release authoring around guided capsules, canonical generated artifacts, and manifest-backed changelog surfaces.
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/app.cli-contractspec@6.0.0 (major)
- @contractspec/action.version@3.0.0 (major)
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

### Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
- @contractspec/app.cli-contractspec@6.0.0 (minor)
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/bundle.library@3.9.0 (minor)
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
- @contractspec/lib.contracts-spec@5.4.0 (minor)
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/app.cli-contractspec@6.0.0 (minor)
- @contractspec/bundle.library@3.9.0 (patch)
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
- @contractspec/lib.contracts-spec@5.4.0 (minor)
- @contractspec/module.workspace@4.3.0 (minor)
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/app.cli-contractspec@6.0.0 (minor)
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

### Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- @contractspec/lib.design-system@3.10.0 (minor)
- @contractspec/lib.presentation-runtime-react@36.0.8 (patch)
- @contractspec/lib.ui-kit-web@3.10.1 (patch)
- @contractspec/lib.ui-kit@3.9.1 (patch)
- @contractspec/example.crm-pipeline@3.7.20 (patch)
- @contractspec/example.data-grid-showcase@3.8.12 (patch)
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

### Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- contractspec@1.46.2 (patch)
- @contractspec/lib.contracts-spec@5.4.0 (patch)
- @contractspec/bundle.library@3.9.0 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: Integrators can follow the updated Connect adoption, Builder workspace-config, and release-capsule workflows without reconciling stale docs across multiple surfaces.
- Customer: Website readers and package consumers now see current guidance for Connect, Builder, and release communication, including the corrected contracts-spec export inventory.



### Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Customer: Website readers and package consumers now see current guidance for Connect, Builder, and release communication, including the corrected contracts-spec export inventory.
- No manual migration steps recorded.

### Expand the spec-pack docs into a fuller learning path across the public docs site.
- @contractspec/bundle.library@3.9.0 (patch)
- @contractspec/app.web-landing (patch)
- Customer: Public docs readers can follow a clearer spec-pack learning path from overview pages into Connect, module bundles, and Builder workbench hosting guides.



### Expand the spec-pack docs into a fuller learning path across the public docs site.
- Customer: Public docs readers can follow a clearer spec-pack learning path from overview pages into Connect, module bundles, and Builder workbench hosting guides.
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

### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
- @contractspec/tool.bun@3.7.14 (patch)
- @contractspec/bundle.marketing@3.8.13 (patch)
- @contractspec/lib.accessibility@3.7.19 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.9.1 (patch)
- @contractspec/lib.design-system@3.10.0 (patch)
- @contractspec/lib.example-shared-ui@6.0.20 (patch)
- @contractspec/lib.presentation-runtime-react@36.0.8 (patch)
- @contractspec/lib.surface-runtime@0.5.20 (patch)
- @contractspec/lib.ui-kit@3.9.1 (patch)
- @contractspec/lib.ui-kit-web@3.10.1 (patch)
- @contractspec/lib.ui-link@3.7.15 (patch)
- @contractspec/lib.video-gen@2.7.20 (patch)
- @contractspec/module.builder-workbench@0.2.2 (patch)
- @contractspec/module.examples@3.9.0 (patch)
- @contractspec/module.execution-console@0.1.3 (patch)
- @contractspec/module.mobile-review@0.2.2 (patch)
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
- @contractspec/app.cli-contractspec@6.0.0 (major)
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/module.workspace@4.3.0 (minor)
- @contractspec/lib.contracts-spec@5.4.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.9.1 (minor)
- @contractspec/lib.design-system@3.10.0 (minor)
- @contractspec/lib.ui-kit-core@3.8.0 (minor)
- @contractspec/lib.ui-kit-web@3.10.1 (minor)
- @contractspec/lib.ui-kit@3.9.1 (minor)
- vscode-contractspec@3.10.0 (minor)
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

### Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- @contractspec/lib.knowledge@3.7.20 (patch)
- @contractspec/lib.contracts-spec@5.4.0 (patch)
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

### Normalize notification template locale resolution and merge partial locale channel overrides without dropping base channel content.
- @contractspec/module.notifications@3.7.19 (patch)
- Integrator: Localized notification templates no longer fall back to English for supported regional locale variants, and partial localized channel overrides retain the default title/action payload.



### Normalize notification template locale resolution and merge partial locale channel overrides without dropping base channel content.
- No manual migration steps recorded.

### Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
- @contractspec/module.learning-journey@4.0.0 (major)
- @contractspec/module.examples@3.9.0 (patch)
- @contractspec/example.learning-journey-ambient-coach@4.0.0 (major)
- @contractspec/example.learning-journey-crm-onboarding@4.0.0 (major)
- @contractspec/example.learning-journey-duo-drills@4.0.0 (major)
- @contractspec/example.learning-journey-platform-tour@4.0.0 (major)
- @contractspec/example.learning-journey-quest-challenges@4.0.0 (major)
- @contractspec/example.learning-journey-registry@4.0.0 (major)
- @contractspec/example.learning-journey-studio-onboarding@4.0.0 (major)
- @contractspec/example.learning-journey-ui-coaching@4.0.0 (major)
- @contractspec/example.learning-journey-ui-gamified@4.0.0 (major)
- @contractspec/example.learning-journey-ui-onboarding@4.0.0 (major)
- @contractspec/example.learning-journey-ui-shared@4.0.0 (major)
- @contractspec/example.learning-patterns@4.0.0 (major)
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
- @contractspec/integration.builder-telegram@0.2.2 (patch)
- @contractspec/integration.builder-voice@0.2.2 (patch)
- @contractspec/integration.builder-whatsapp@0.2.2 (patch)
- @contractspec/integration.provider.claude-code@0.2.1 (patch)
- @contractspec/integration.provider.codex@0.2.1 (patch)
- @contractspec/integration.provider.copilot@0.2.1 (patch)
- @contractspec/integration.provider.gemini@0.2.1 (patch)
- @contractspec/integration.provider.local-model@0.2.1 (patch)
- @contractspec/integration.provider.stt@0.2.1 (patch)
- @contractspec/integration.runtime.hybrid@0.2.2 (patch)
- @contractspec/integration.runtime.local@0.2.2 (patch)
- @contractspec/integration.runtime.managed@0.2.2 (patch)
- Integrator: Integrator release automation can republish the affected integration packages with npm provenance enabled without hitting the empty repository URL validation failure.
- Customer: This patch only corrects publish metadata for the affected integration packages; their runtime APIs and behavior are unchanged.



### Restore npm provenance-safe publishing for the public integration packages by declaring repository metadata and failing release discovery before publish when it is missing.
- Customer: This patch only corrects publish metadata for the affected integration packages; their runtime APIs and behavior are unchanged.
- No manual migration steps recorded.

### Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.
- @contractspec/lib.support-bot@4.0.0 (major)
- Integrator: `defineSupportBot` no longer accepts `autoEscalateThreshold`; integrators must migrate to the explicit `thresholds` object and can now pass `review` directly.
- Replace the old support-bot threshold field: Migrate `defineSupportBot` calls from the overloaded `autoEscalateThreshold` field to the explicit `thresholds` object.



### Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.
- Replace the old support-bot threshold field: Migrate `defineSupportBot` calls from the overloaded `autoEscalateThreshold` field to the explicit `thresholds` object.
  - Replace `autoEscalateThreshold` with `thresholds.autoResolveMinConfidence` when you mean the auto-response cutoff.
  - Set `thresholds.escalationConfidenceThreshold` when you need a distinct policy escalation cutoff.
  - Move any external review routing into the new top-level `review` field if the spec should expose queue or approval workflow metadata.

### Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
- @contractspec/module.examples@3.9.0 (minor)
- @contractspec/bundle.marketing@3.8.13 (patch)
- @contractspec/bundle.library@3.9.0 (patch)
- @contractspec/app.web-landing (patch)
- @contractspec/example.agent-console@3.8.12 (patch)
- @contractspec/example.ai-chat-assistant@3.8.12 (patch)
- @contractspec/example.analytics-dashboard@3.9.12 (patch)
- @contractspec/example.crm-pipeline@3.7.20 (patch)
- @contractspec/example.integration-hub@3.8.12 (patch)
- @contractspec/example.learning-journey-registry@4.0.0 (patch)
- @contractspec/example.marketplace@3.8.12 (patch)
- @contractspec/example.policy-safe-knowledge-assistant@3.7.20 (patch)
- @contractspec/example.saas-boilerplate@3.8.12 (patch)
- @contractspec/example.workflow-system@3.8.12 (patch)
- Integrator: Integrators consuming public example metadata can now detect inline-preview capability through `@contractspec/module.examples`, and every public example now has a first-party `/docs/examples/<key>` route in web-landing.
- Customer: The public site now provides richer template previews and full docs-example coverage, with inline embeds for UI-backed examples and fallback sandbox/reference actions elsewhere.
- Declare `entrypoints.ui` for UI-backed example packages: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.



### Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
- Customer: The public site now provides richer template previews and full docs-example coverage, with inline embeds for UI-backed examples and fallback sandbox/reference actions elsewhere.
- Declare `entrypoints.ui` for UI-backed example packages: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.
  - Add `ui: './ui'` to the example's `entrypoints` object in `src/example.ts`.
  - Update `scripts/generate-example-registry.ts` if the package needs a non-default preview component export.
  - Regenerate the example registries before publishing.
- Upgrade steps:
  - [assisted] Regenerate preview metadata after adding UI-backed examples: Keep the generated preview registry aligned with the workspace examples.
    - Run `bun scripts/generate-example-registry.ts --write`.
    - Re-run preview tests in `packages/modules/examples`, `packages/bundles/marketing`, and `packages/bundles/library`.
    - Verify `/templates` and `/docs/examples/<key>` render the expected inline or fallback preview action.

### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- @contractspec/lib.contracts-spec@5.4.0 (minor)
- @contractspec/bundle.workspace@4.5.0 (minor)
- @contractspec/app.cli-contractspec@6.0.0 (minor)
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