Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/action.version: unknown -> 3.0.1
@contractspec/app.cli-contractspec: unknown -> 6.0.2
@contractspec/app.cursor-marketplace: unknown -> latest
@contractspec/app.web-landing: unknown -> latest
@contractspec/biome-config: unknown -> 3.8.8
@contractspec/bundle.library: unknown -> 3.9.2
@contractspec/bundle.marketing: unknown -> 3.8.15
@contractspec/bundle.workspace: unknown -> 4.5.1
@contractspec/example.agent-console: unknown -> 3.8.14
@contractspec/example.ai-chat-assistant: unknown -> 3.8.14
@contractspec/example.analytics-dashboard: unknown -> 3.9.14
@contractspec/example.crm-pipeline: unknown -> 3.7.22
@contractspec/example.data-grid-showcase: unknown -> 3.8.14
@contractspec/example.integration-hub: unknown -> 3.8.14
@contractspec/example.learning-journey-ambient-coach: unknown -> 4.0.1
@contractspec/example.learning-journey-crm-onboarding: unknown -> 4.0.2
@contractspec/example.learning-journey-duo-drills: unknown -> 4.0.1
@contractspec/example.learning-journey-platform-tour: unknown -> 4.0.1
@contractspec/example.learning-journey-quest-challenges: unknown -> 4.0.1
@contractspec/example.learning-journey-registry: unknown -> 4.0.2
@contractspec/example.learning-journey-studio-onboarding: unknown -> 4.0.1
@contractspec/example.learning-journey-ui-coaching: unknown -> 4.0.2
@contractspec/example.learning-journey-ui-gamified: unknown -> 4.0.2
@contractspec/example.learning-journey-ui-onboarding: unknown -> 4.0.2
@contractspec/example.learning-journey-ui-shared: unknown -> 4.0.2
@contractspec/example.learning-patterns: unknown -> 4.0.1
@contractspec/example.marketplace: unknown -> 3.8.14
@contractspec/example.policy-safe-knowledge-assistant: unknown -> 3.7.22
@contractspec/example.saas-boilerplate: unknown -> 3.8.14
@contractspec/example.workflow-system: unknown -> 3.8.14
@contractspec/integration.builder-telegram: unknown -> 0.2.3
@contractspec/integration.builder-voice: unknown -> 0.2.3
@contractspec/integration.builder-whatsapp: unknown -> 0.2.3
@contractspec/integration.provider.claude-code: unknown -> 0.2.2
@contractspec/integration.provider.codex: unknown -> 0.2.2
@contractspec/integration.provider.copilot: unknown -> 0.2.2
@contractspec/integration.provider.gemini: unknown -> 0.2.2
@contractspec/integration.provider.local-model: unknown -> 0.2.2
@contractspec/integration.provider.stt: unknown -> 0.2.2
@contractspec/integration.runtime: unknown -> 3.9.3
@contractspec/integration.runtime.hybrid: unknown -> 0.2.3
@contractspec/integration.runtime.local: unknown -> 0.2.3
@contractspec/integration.runtime.managed: unknown -> 0.2.3
@contractspec/lib.accessibility: unknown -> 3.7.21
@contractspec/lib.builder-runtime: unknown -> 0.2.3
@contractspec/lib.builder-spec: unknown -> 0.2.3
@contractspec/lib.contracts-runtime-client-react: unknown -> 3.10.0
@contractspec/lib.contracts-runtime-server-graphql: unknown -> 3.8.0
@contractspec/lib.contracts-runtime-server-mcp: unknown -> 3.8.0
@contractspec/lib.contracts-runtime-server-rest: unknown -> 3.8.0
@contractspec/lib.contracts-spec: unknown -> 5.5.0
@contractspec/lib.data-exchange-client: unknown -> 0.2.1
@contractspec/lib.data-exchange-core: unknown -> 0.2.1
@contractspec/lib.data-exchange-server: unknown -> 0.2.1
@contractspec/lib.design-system: unknown -> 3.11.0
@contractspec/lib.error: unknown -> 3.7.14
@contractspec/lib.example-shared-ui: unknown -> 6.0.22
@contractspec/lib.exporter: unknown -> latest
@contractspec/lib.jobs: unknown -> 3.8.0
@contractspec/lib.knowledge: unknown -> 3.7.21
@contractspec/lib.mobile-control: unknown -> 0.2.3
@contractspec/lib.presentation-runtime-core: unknown -> 5.0.0
@contractspec/lib.presentation-runtime-react: unknown -> 38.0.0
@contractspec/lib.provider-runtime: unknown -> 0.2.3
@contractspec/lib.provider-spec: unknown -> 0.2.1
@contractspec/lib.support-bot: unknown -> 4.0.1
@contractspec/lib.surface-runtime: unknown -> 0.5.21
@contractspec/lib.ui-kit: unknown -> 3.9.3
@contractspec/lib.ui-kit-core: unknown -> 3.8.1
@contractspec/lib.ui-kit-web: unknown -> 3.10.3
@contractspec/lib.ui-link: unknown -> 3.7.16
@contractspec/lib.video-gen: unknown -> 2.7.22
@contractspec/module.builder-workbench: unknown -> 0.2.4
@contractspec/module.examples: unknown -> 3.10.0
@contractspec/module.execution-console: unknown -> 0.1.5
@contractspec/module.learning-journey: unknown -> 4.0.1
@contractspec/module.mobile-review: unknown -> 0.2.4
@contractspec/module.notifications: unknown -> 3.7.20
@contractspec/module.workspace: unknown -> 4.3.1
@contractspec/tool.bun: unknown -> 3.7.15
agentpacks: unknown -> 1.8.0
contractspec: unknown -> 1.46.2
vscode-contractspec: unknown -> 3.10.2

Required steps:
- [manual] Use FormSpec layout hints for dense forms: Replace renderer-specific row wrappers with portable column and colspan metadata.
  - Add `layout.columns` at form or group level.
  - Use `field.layout.colSpan` for fields that should expand across columns.
  - Use `group.legendI18n` when a section needs a semantic legend.
- [manual] Use serializable input-group addons: Add text or icon addon descriptors to text and textarea fields.
  - Add `inputGroup.addons` to text or textarea field specs.
  - Resolve icon keys in the host driver through the `InputGroupIcon` slot.
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
- [assisted] Prefer focused subpaths for new imports: Existing root imports stay supported, but new code can import from focused design-system surfaces.
  - Use `@contractspec/lib.design-system/theme` for ThemeSpec runtime and Tailwind helpers.
  - Use `@contractspec/lib.design-system/controls` for themed and translated controls.
  - Use `@contractspec/lib.design-system/forms` for form layouts, controls, and `ZodForm`.
  - Use `@contractspec/lib.design-system/layout` for stack primitives.
- [assisted] Prefer explicit example discovery helpers: Consumers that need public web-facing example lists should use the new helpers instead of filtering `listExamples()` manually.
  - Use `listDiscoverableExamples()` for docs and sitemap surfaces that should include non-internal examples with usable public surfaces.
  - Use `listTemplateExamples()` for template catalogs.
  - Keep `listPublicExamples()` only when the narrower `visibility: public` subset is required.
- [assisted] Prefer the platform-neutral content export for native or non-web shells: Use `@contractspec/bundle.marketing/content` when a shell needs landing story, navigation, or public page data without importing web components.
  - Import `contractspecLandingStory`, `contractspecPublicNavigation`, or `contractspecLandingPages` from `@contractspec/bundle.marketing/content`.
  - Map the exported `iconKey` strings to platform-specific icon components.
  - Resolve CTA targets with `resolveContractspecLandingCtaUrl` when opening links outside the web app.
- [assisted] Use ThemeSpec as the Tailwind theme source: Resolve ThemeSpec tokens for the active mode and feed them to the Tailwind preset or CSS serializer.
  - Keep existing `tokens` as the default/light-compatible token bag.
  - Add `modes.dark.tokens` when a dark-mode overlay is needed.
  - Use `themeSpecToTailwindPreset` for config-based Tailwind usage or `themeSpecToTailwindCss` when an app wants an importable CSS artifact.
- [assisted] Re-run helper and docs verification: Confirm the runtime helpers, generated docs, and website-facing docs now agree on the new names.
  - Run the focused helper tests, typecheck, and lint checks in `@contractspec/lib.presentation-runtime-core`.
  - Re-run the bundle-library docs manifest test and typecheck.
  - Regenerate the web-facing `/llms*` surface after the README changes.
- [manual] Prefer design-system controls for themed and translated forms: Use the design-system form and stack exports before dropping to platform-specific UI kit primitives.
  - Wrap surfaces in `DesignSystemThemeProvider` when ThemeSpec or scoped theme overrides are available.
  - Wrap surfaces in `DesignSystemTranslationProvider` when TranslationSpec messages should resolve labels or placeholders.
  - Import controls such as `Select`, `Autocomplete`, `DatePicker`, `TimePicker`, `DateTimePicker`, `Box`, `HStack`, and `VStack` from `@contractspec/lib.design-system`.
- [assisted] Rebuild and syntax-check design-system artifacts: The generated package output should remain parseable and preserve imports for Metro aliasing.
  - Run `bun run --cwd packages/libs/design-system build`.
  - Run `bun run --cwd packages/libs/design-system test:build-artifacts`.
  - Run `bun run --cwd packages/apps/mobile-demo typecheck`.
- [assisted] Route onboarding through the existing Connect adoption layer: The onboarding flow now syncs and consults the existing adoption catalog before recommending new surfaces.
  - Use `contractspec connect adoption sync` to refresh the local adoption catalog outside the onboarding command when needed.
  - Prefer `contractspec connect adoption resolve --family <family> --stdin` for custom tooling that needs the same reuse recommendations.
- [manual] Use CLI MCP onboarding resources instead of hardcoded prompts: The CLI MCP surface now exposes onboarding tracks, rendered artifacts, and next-command suggestions.
  - Read `onboarding://tracks` and `onboarding://track/{id}` for the canonical onboarding catalog.
  - Call `onboarding_suggestTracks`, `onboarding_renderArtifacts`, and `onboarding_nextCommand` for repo-specific planning and guide rendering.
- [assisted] Wire adoption-aware Connect hooks in consumer environments: The consumer plugin and Connect CLI now expose adoption-aware hook events in addition to contracts-spec review hooks.
  - Install or reference the `contractspec-adoption` marketplace/plugin assets where Connect hooks are consumed.
  - Use `contractspec connect hook adoption before-file-edit|before-shell-execution|after-file-edit --stdin` in host hook wiring.
- [manual] Prefer higher-level runtime package entrypoints in imports: Generated Biome policy artifacts now flag deprecated monolith usage and obvious deep runtime entrypoint imports.
  - Replace `@contractspec/lib.contracts` imports with `@contractspec/lib.contracts-spec` plus the appropriate split runtime package.
  - Prefer package-level runtime entrypoints such as `@contractspec/lib.contracts-runtime-server-mcp` when they already expose the required surface.
- [assisted] Use the authored validators for contract setup and CI: Prefer the package-level validators over shallow AST checks for the three upgraded surfaces.
  - Use `validateBlueprint` or `assertBlueprintValid` for app-config specs.
  - Use `validateThemeSpec` or `assertThemeSpecValid` for theme specs.
  - Use `validateFeatureSpec` or `assertFeatureSpecValid` for feature specs before registry installation or release review.
- [manual] Adopt the new theme authoring target across workspace tools: Shared workspace discovery and the CLI now treat `theme` as a first-class authored surface.
  - Use `.theme.ts` files and `defineTheme(...)` for new theme specs.
  - Update any custom create flows or discovery logic to include the `theme` authoring target where needed.
- [manual] Use guided release authoring: Create and revise release metadata through `contractspec release prepare` and `contractspec release edit` instead of editing capsules by hand.
  - Run `contractspec release prepare` for new published-package release work.
  - Run `contractspec release edit <slug>` to revise an existing release entry safely.
- [assisted] Publish canonical release artifacts: Stable release automation now uploads the release manifest, upgrade manifest, customer guide, and agent prompts, and uses generated patch notes as the GitHub Release body.
  - Review `generated/releases/*` as part of release preparation.
  - Use the attached release artifacts instead of scraping package CHANGELOG files or generic changelog JSON.
- [assisted] Rebuild learning package release artifacts after upgrading: The affected learning packages should be rebuilt and revalidated together because the runtime, examples, and sandbox wiring now depend on the same adaptive presentation/runtime surface.
  - Run package-level build, test, typecheck, and lint checks for the affected learning packages.
  - Regenerate example registry artifacts if `@contractspec/module.examples` dependencies change.
  - Verify at least one supported learning sandbox route renders markdown successfully.
- [assisted] Re-run focused table verification after upgrading: The web, native, design-system, and example surfaces should be validated together because the UX and stability changes span all four layers.
  - Run the focused table test suites in `presentation-runtime-react`, `ui-kit-web`, `ui-kit`, `design-system`, `example.crm-pipeline`, and `example.data-grid-showcase`.
  - Re-run package typechecks and lint checks for the touched libraries and examples.
  - Spot-check server-paginated and client-side examples to confirm search, chips, loading, empty states, and column recovery behave as expected.
- [assisted] Regenerate preview metadata after adding UI-backed examples: Keep the generated preview registry aligned with the workspace examples.
  - Run `bun scripts/generate-example-registry.ts --write`.
  - Re-run preview tests in `packages/modules/examples`, `packages/bundles/marketing`, and `packages/bundles/library`.
  - Verify `/templates` and `/docs/examples/<key>` render the expected inline or fallback preview action.
- [manual] Verify indexed knowledge payloads expose canonical text: Check that vector payloads now include `payload.text` and that retrieval/query flows surface readable snippets without custom metadata shims.
  - Re-run the ingestion flow that feeds your knowledge index.
  - Inspect the stored vector payloads or downstream references for canonical `payload.text` content.
- [manual] Verify localized notification templates for regional locales: Check that supported regional locales now reuse their base locale template content and that partial locale overrides retain default channel fields.
  - Upgrade to the patched `@contractspec/module.notifications` release.
  - Exercise a localized template with a regional locale such as `fr-CA` or `es-MX`.
  - Confirm that localized templates still preserve default title/action fields when only part of the channel content is overridden.
- [manual] Regenerate docs and release artifacts after workflow copy changes: Keep the generated docs, `/llms*` guides, and release-backed changelog surfaces aligned with the underlying source docs.
  - Run `cd packages/libs/contracts-spec && bun run docs:manifest` after changing contracts-spec docblocks or package docs.
  - Run `cd packages/apps/web-landing && bun run llms:generate` after changing package READMEs or `/llms*` guidance.
  - Run `contractspec release build` before treating changelog or upgrade surfaces as current.
- [assisted] Re-run focused package verification: The new stack spans new packages plus the legacy exporter shim.
  - Run the focused bun test suites for `data-exchange-core`, `data-exchange-server`, `data-exchange-client`, and `exporter`.
  - Run targeted typechecks and lint checks for the same four packages.
  - Treat `build:bundle` as the current build proof; if `contractspec-bun-build types` stalls, rely on the separate package typechecks until the build tool issue is fixed.
- [manual] Refresh existing builder-local workspace config when convenient: Existing local-only configs keep working through the hosted API fallback, but rerunning init will persist the new API defaults into workspace config.
  - Re-run `contractspec init --preset builder-local` if you want the generated `builder.api.baseUrl` and `builder.api.controlPlaneTokenEnvVar` fields written into `.contractsrc.json`.
  - Set the configured control-plane token environment variable before running `contractspec builder` commands.
- [manual] Republish the affected integration packages with provenance enabled: Pull the patch releases for the affected integration packages or rerun the release job after the metadata fix lands.
  - Upgrade the affected integration packages to the patched versions once they are published.
  - Re-run the release workflow with npm provenance enabled and verify release discovery completes before the publish step starts.
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
- [assisted] Adopt the Builder v3 control-plane packages: Wire provider/runtime integrations through the governed Builder v3 workbench and mobile-review surfaces.
  - Install the Builder v3 contracts and runtime packages alongside the provider integrations you intend to expose in the authoring surface.
  - Use the Builder workbench and mobile-review modules as the host UI surfaces instead of building separate readiness or export orchestration shells.
  - Validate managed, local, and hybrid runtime mode selection plus provider routing before promoting the control-plane workflow to operators.
- [manual] Adopt the Connect CLI workflow: Use the built-in Connect commands instead of custom local wrappers for risky file or command mutations.
  - Initialize the workspace with `contractspec connect init --scope workspace`.
  - Use `contractspec connect context`, `plan`, and `verify` to capture task context and mutation verdicts before edits or shell execution.
  - Keep replay and evaluation artifacts under `.contractspec/connect/` so review and audit flows can consume the same evidence bundle.
- [manual] Review the updated spec-pack learning path: Confirm the new guide pages and cross-links appear in the expected docs navigation flow.
  - Open the public docs overview and verify the new learning-path entries for Connect, module bundles, and hosting the Builder workbench.
  - Follow the related-page links between the spec overview, architecture references, and Studio/Builder guides to confirm the intended navigation loop.
- [manual] Verify production bundles no longer import the dev JSX runtime: Check released JS artifacts for `react/jsx-dev-runtime` imports or `jsxDEV(` call sites.
  - Rebuild the affected package set with the updated `@contractspec/tool.bun`.
  - Scan `dist/` output for `react/jsx-dev-runtime` imports and `jsxDEV(` call sites before publishing.
- [manual] Verify hardened Builder bootstrap and local-daemon flows: Confirm the new preset, mobile-review, and local runtime registration surfaces are wired through the workbench snapshot.
  - Update any bootstrap orchestration to use the managed, local-daemon, or hybrid preset values exposed by the Builder contracts.
  - Register a local daemon through the runtime integration and confirm the resulting trust and lease details appear in the Builder snapshot surfaces.
  - Review the mobile-review and operator status cards to verify channel-native actions and comparison posture are rendered from the shared snapshot model.
- [manual] Scaffold release capsule companions: Add release capsules for changesets and include validation evidence.
  - Run `contractspec release init` for new release work.
  - Keep `.changeset/*.md` and `.changeset/*.release.yaml` together in the same PR.
  - Use `contractspec release brief` or `contractspec upgrade prompt` to generate maintainer, customer, and agent guidance.
- [assisted] Use generated release manifests in tooling: Prefer generated release artifacts for changelog and upgrade flows.
  - Run `contractspec release build` to populate `generated/releases/`.
  - Point changelog or upgrade tooling at `generated/releases/manifest.json` and `generated/releases/upgrade-manifest.json`.
- [manual] Rewrite workflow imports to safe subpaths: Use narrow workflow entrypoints so sandboxed workflow runtimes do not pull Node-only runner code.
  - Replace broad workflow barrel imports with the specific `workflow/spec`, `workflow/runner`, `workflow/adapters`, and `workflow/expression` subpaths you need.
  - Keep `crypto` and other Node-only dependencies in step functions instead of workflow entrypoints.