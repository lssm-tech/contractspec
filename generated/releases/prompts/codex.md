Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/app.cli-contractspec: unknown -> 6.2.2
@contractspec/app.web-landing: unknown -> latest
@contractspec/bundle.library: unknown -> 3.9.8
@contractspec/bundle.workspace: unknown -> 4.5.6
@contractspec/example.crm-pipeline: unknown -> 3.7.28
@contractspec/example.locale-jurisdiction-gate: unknown -> 3.7.26
@contractspec/example.saas-boilerplate: unknown -> 3.8.20
@contractspec/example.wealth-snapshot: unknown -> 3.8.0
@contractspec/lib.contracts-runtime-client-react: unknown -> 3.13.0
@contractspec/lib.contracts-runtime-server-rest: unknown -> 3.8.5
@contractspec/lib.contracts-spec: unknown -> 6.1.0
@contractspec/lib.data-exchange-client: unknown -> 0.2.7
@contractspec/lib.data-exchange-core: unknown -> 0.2.6
@contractspec/lib.data-exchange-server: unknown -> 0.2.6
@contractspec/lib.design-system: unknown -> 4.3.0
@contractspec/lib.identity-rbac: unknown -> 3.7.26
@contractspec/lib.notification: unknown -> 0.1.0
@contractspec/lib.personalization: unknown -> 6.0.26
@contractspec/lib.translation-runtime: unknown -> 0.1.0
@contractspec/module.notifications: unknown -> 3.8.2
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
- [manual] Monitor release manifest verification: Dist-tag read-after-write convergence failures now surface at the manifest verification step instead of during every package publish.
  - Keep `Verify npm release manifest` enabled after stable and canary publish steps.
  - Tune `CONTRACTSPEC_RELEASE_VERIFY_RETRY_COUNT` or `CONTRACTSPEC_RELEASE_VERIFY_RETRY_DELAY_MS` if npm registry reads need a longer final convergence window.
- [manual] Initialize i18next from ContractSpec exports: Use generated resources and init options with caller-owned i18next instances for SSR and request isolation.
  - Export resources from canonical specs or runtime snapshots.
  - Pass `createI18nextInitOptions(...).options` to a caller-created i18next instance.
  - Serialize the same runtime snapshot/exported resources for hydration when using SSR.