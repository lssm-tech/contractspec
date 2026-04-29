Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/app.cli-contractspec: unknown -> 6.3.0
@contractspec/app.web-landing: unknown -> latest
@contractspec/bundle.library: unknown -> 3.9.9
@contractspec/bundle.workspace: unknown -> 4.6.0
@contractspec/example.crm-pipeline: unknown -> 3.7.29
@contractspec/example.locale-jurisdiction-gate: unknown -> 3.7.27
@contractspec/example.saas-boilerplate: unknown -> 3.8.21
@contractspec/example.wealth-snapshot: unknown -> 3.8.1
@contractspec/lib.contracts-runtime-client-react: unknown -> 3.14.0
@contractspec/lib.contracts-runtime-server-rest: unknown -> 3.9.0
@contractspec/lib.contracts-spec: unknown -> 6.2.0
@contractspec/lib.data-exchange-client: unknown -> 0.3.0
@contractspec/lib.data-exchange-core: unknown -> 0.3.0
@contractspec/lib.data-exchange-server: unknown -> 0.3.0
@contractspec/lib.design-system: unknown -> 4.4.0
@contractspec/lib.identity-rbac: unknown -> 3.8.0
@contractspec/lib.notification: unknown -> 0.2.0
@contractspec/lib.personalization: unknown -> 6.1.0
@contractspec/lib.translation-runtime: unknown -> 0.2.0
@contractspec/module.notifications: unknown -> 3.8.3
contractspec: unknown -> 1.46.2

Required steps:
- [manual] Adopt the ContractSpec translation runtime for production surfaces: Use runtime instances or snapshots instead of legacy simple string interpolation for production i18n paths.
  - Build runtime instances from canonical `TranslationSpec[]` catalogs.
  - Create one runtime per SSR request and hydrate clients from serialized snapshots.
  - Keep React, React Native, and i18next integrations downstream from the runtime.
- [assisted] Resolve personalized DataView defaults in the host app: Keep DataViewRenderer dependency-free by resolving personalization preferences before rendering.
  - Import `resolveDataViewPreferences` from `@contractspec/lib.personalization/data-view-preferences`.
  - Pass the resolved `viewMode`, `density`, and `dataDepth` values to `DataViewRenderer` as controlled or default props.
  - Record user changes with `trackDataViewInteraction` when persistence or behavioral insights are desired.
- [manual] Verify notification schema contribution identity: Confirm old module imports keep the legacy module id while new library imports use the library module id.
  - Check `notificationsSchemaContribution.moduleId` from `@contractspec/lib.notification` is `@contractspec/lib.notification`.
  - Check `notificationsSchemaContribution.moduleId` from `@contractspec/module.notifications` is still `@contractspec/module.notifications`.
- [assisted] Configure phone fields where split values or single-input UX are needed: Existing `kind: "phone"` object-valued fields continue to work; opt into new modes through field metadata.
  - Use `phone.input.mode` to choose `single` or `split` rendering.
  - Use `phone.output.mode` with linked path names to write split country/national/E.164 values.
  - Use `phone.country.defaultIso2` and `phone.display.flag` for country defaults and flag affordances.
- [assisted] Wire app-owned dynamic RBAC providers: Apps that store workspace-specific role bindings can implement a role-permission source and pass it to `RBACPolicyEngine.evaluateRequirement`.
  - Resolve static templates and dynamic role/binding records for the current tenant/workspace.
  - Mark explicit denies with `effect: "deny"` so they override static/template grants.
  - Treat provider failure as a protected-operation denial unless an audited break-glass path exists.
- [manual] Keep current release artifacts compact: Use the default release build for current release communication and the explicit history scope only when a full changelog is required.
  - Run `bun run release:build` for the current release bundle.
  - Run `bun packages/apps/cli-contractspec/src/cli.ts release check --strict --baseline main` after regenerating artifacts.
  - Use `--scope all --output generated/releases/history` for website changelog history builds.
- [assisted] Reuse AdaptivePanel for responsive overlay choices: Replace one-off sheet/drawer branching with AdaptivePanel when a surface should use sheets on desktop and drawers on mobile.
  - Import `AdaptivePanel` from `@contractspec/lib.design-system`.
  - Use the default responsive mode, or force `mode="sheet"` / `mode="drawer"` when product requirements need one presentation.
- [assisted] Replace inert references with ObjectReferenceHandler: Use the documented adoption prompt and examples to find plain object references and wrap them with the shared handler.
  - Start with address, phone, email, user, customer, file, and URL text rendered in product workflows.
  - Model each reference as a data-only descriptor and put runtime behavior in handler props.
  - Use rich properties and sections when one object should expose multiple interaction targets.
  - Keep responsive overlays on AdaptivePanel or ObjectReferenceHandler panel props.
- [manual] Keep website docs and LLM guides aligned for data-exchange imports: When data-exchange template behavior changes, update the package READMEs, public guide, web-landing README, and generated `/llms*` package guides together.
  - Update the data-exchange package READMEs for package-level API behavior.
  - Update `/docs/guides/data-exchange-import-templates` for end-to-end website guidance.
  - Regenerate or verify `/llms*` package guides before release.
- [manual] Use the linked DataViews and personalization docs for collection screens: Follow the DataViews tutorial or runtime guide, then apply the personalization bridge from the personalization library page.
  - Open `/docs/getting-started/dataviews` for the end-to-end query/spec/render flow.
  - Open `/docs/libraries/data-views` for collection config, data depth, and renderer props.
  - Open `/docs/libraries/personalization` for preference resolution, interaction tracking, analyzer output, and agent prompts.
- [manual] Keep website docs and LLM guides aligned for translation runtime work: When translation runtime behavior changes, update the web docs route, package README, `/llms.txt`, and package-specific `/llms` guide together.
  - Update `@contractspec/lib.translation-runtime` README for package-level API behavior.
  - Update the shared library docs page for website readers.
  - Regenerate or verify `/llms*` package guides before release.
- [manual] Monitor release manifest verification: Dist-tag read-after-write convergence failures now surface at the manifest verification step instead of during every package publish.
  - Keep `Verify npm release manifest` enabled after stable and canary publish steps.
  - Tune `CONTRACTSPEC_RELEASE_VERIFY_RETRY_COUNT` or `CONTRACTSPEC_RELEASE_VERIFY_RETRY_DELAY_MS` if npm registry reads need a longer final convergence window.
- [manual] Initialize i18next from ContractSpec exports: Use generated resources and init options with caller-owned i18next instances for SSR and request isolation.
  - Export resources from canonical specs or runtime snapshots.
  - Pass `createI18nextInitOptions(...).options` to a caller-created i18next instance.
  - Serialize the same runtime snapshot/exported resources for hydration when using SSR.