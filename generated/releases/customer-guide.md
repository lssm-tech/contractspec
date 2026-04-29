# Customer Upgrade Guide



### Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- @contractspec/lib.design-system@4.4.0 (minor)
- Integrator: ObjectReferenceHandler supports same-page vs new-page detail opening, rich nested properties, and configurable sheet/drawer behavior with responsive defaults.
- Customer: Reference interactions can show richer details in a desktop sheet or mobile drawer without custom per-screen logic.



### Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- Customer: Reference interactions can show richer details in a desktop sheet or mobile drawer without custom per-screen logic.
- No manual migration steps recorded.

### Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- @contractspec/lib.design-system@4.4.0 (patch)
- Integrator: Design-system overlay behavior is more consistent because mobile menu panels and object references share the AdaptivePanel boundary.
- Customer: Mobile menus keep the same behavior while using the shared responsive panel implementation.



### Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- Customer: Mobile menus keep the same behavior while using the shared responsive panel implementation.
- No manual migration steps recorded.

### Document AppShell in-app notification adoption and refresh shell implementation prompts.
- @contractspec/bundle.library@3.9.9 (patch)
- @contractspec/app.web-landing (patch)
- Integrator: App developers now have public guidance for wiring in-app notifications through AppShell without coupling the design system to notification runtime behavior.
- Use the shell notification boundary for app integrations: Keep notification contracts and runtime helpers outside the design system, then pass render-ready notification center state into AppShell.



### Document AppShell in-app notification adoption and refresh shell implementation prompts.
- Use the shell notification boundary for app integrations: Keep notification contracts and runtime helpers outside the design system, then pass render-ready notification center state into AppShell.
  - Use `@contractspec/lib.contracts-spec/notifications` for canonical notification contracts.
  - Use `@contractspec/lib.notification` for reusable schema, channel, template, and i18n helpers.
  - Keep persistence, subscriptions, delivery, and mutation logic in the host app or runtime layer.
  - Pass `ShellNotificationCenter` state to `AppShell.notifications`.

### Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- @contractspec/lib.contracts-spec@6.2.0 (minor)
- @contractspec/lib.translation-runtime@0.2.0 (minor)
- @contractspec/lib.design-system@4.4.0 (minor)
- @contractspec/example.locale-jurisdiction-gate@3.7.27 (patch)
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
- @contractspec/lib.translation-runtime@0.2.0 (minor)
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

### Add template-aware import mapping with column aliases, flexible value formatting, codec options, client review state, and server audit evidence.
- @contractspec/lib.data-exchange-core@0.3.0 (minor)
- @contractspec/lib.data-exchange-client@0.3.0 (minor)
- @contractspec/lib.data-exchange-server@0.3.0 (minor)
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

### Add preference-aware DataView collection defaults and personalization adapters.
- @contractspec/lib.contracts-spec@6.2.0 (minor)
- @contractspec/lib.design-system@4.4.0 (minor)
- @contractspec/lib.personalization@6.1.0 (minor)
- @contractspec/bundle.library@3.9.9 (patch)
- Integrator: Apps can resolve preferred DataView mode, density, and data depth through personalization helpers and pass plain props to web/native DataViewRenderer.
- Customer: Collection screens can remember or infer list/grid/table mode and compact/detail preferences without duplicating DataView specs.



### Add preference-aware DataView collection defaults and personalization adapters.
- Customer: Collection screens can remember or infer list/grid/table mode and compact/detail preferences without duplicating DataView specs.
- No manual migration steps recorded.

### Document and link object-reference adoption and adaptive panel guidance in the public docs bundle.
- @contractspec/bundle.library@3.9.9 (patch)
- Integrator: Downstream apps have concrete guidance for replacing inert references with ObjectReferenceHandler and using AdaptivePanel instead of direct Sheet/Drawer branching.
- Customer: Product teams get clearer guidance for making addresses, phone numbers, users, customers, files, and URLs actionable in responsive panels.



### Document and link object-reference adoption and adaptive panel guidance in the public docs bundle.
- Customer: Product teams get clearer guidance for making addresses, phone numbers, users, customers, files, and URLs actionable in responsive panels.
- No manual migration steps recorded.

### Speed up npm release publishing by removing per-package dist-tag convergence polling after successful dist-tag updates.
- contractspec@1.46.2 (patch)
- Integrator: Release manifest verification remains the final registry consistency gate, while publish logs now distinguish immediate tag verification from manifest-deferred reconciliation.



### Speed up npm release publishing by removing per-package dist-tag convergence polling after successful dist-tag updates.
- No manual migration steps recorded.

### Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- @contractspec/lib.contracts-spec@6.2.0 (minor)
- @contractspec/lib.notification@0.2.0 (minor)
- @contractspec/module.notifications@3.8.3 (patch)
- @contractspec/lib.design-system@4.4.0 (minor)
- @contractspec/example.crm-pipeline@3.7.29 (patch)
- @contractspec/example.wealth-snapshot@3.8.1 (patch)
- @contractspec/example.saas-boilerplate@3.8.21 (patch)
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

### Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- @contractspec/lib.contracts-spec@6.2.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.0 (minor)
- @contractspec/lib.design-system@4.4.0 (minor)
- Integrator: Host renderers can set phone defaults through `createFormRenderer({ phone })`, while individual FormSpecs can choose object, E.164, or split linked outputs.
- Customer: Form-rendered phone fields can show country flags, detect countries from international input, and keep single or split controls synchronized.



### Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Customer: Form-rendered phone fields can show country flags, detect countries from international input, and keep single or split controls synchronized.
- No manual migration steps recorded.

### Add PWA update management contracts and runtime helpers.
- @contractspec/lib.contracts-spec@6.2.0 (minor)
- @contractspec/lib.contracts-runtime-server-rest@3.9.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.14.0 (minor)
- Integrator: App developers can define PWA release policy once, override it per release, and consume a standard update-check API from the frontend.
- Adopt the PWA update-check contract: Register the PWA update operation, bind it to a manifest resolver, and call it from the frontend on startup or polling intervals.



### Add PWA update management contracts and runtime helpers.
- Adopt the PWA update-check contract: Register the PWA update operation, bind it to a manifest resolver, and call it from the frontend on startup or polling intervals.
  - Define a PWA app manifest with `defaultUpdatePolicy` and release entries.
  - Add per-release `updatePolicy` overrides when a release must be optional, required, or disabled.
  - Bind `createPwaUpdateCheckHandler` to the `pwa.update.check` operation.
  - Use `usePwaUpdateChecker` in the frontend and keep service worker activation inside the host app callback.

### Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
- @contractspec/lib.contracts-spec@6.2.0 (minor)
- @contractspec/lib.identity-rbac@3.8.0 (minor)
- @contractspec/lib.design-system@4.4.0 (minor)
- @contractspec/lib.personalization@6.1.0 (minor)
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

### Stabilize release artifact generation so customer-facing release files stay current-release-only and deterministic.
- @contractspec/bundle.workspace@4.6.0 (minor)
- @contractspec/app.cli-contractspec@6.3.0 (minor)
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

### Add public website docs and prompts for flexible data-exchange import templates and user column mapping review.
- @contractspec/bundle.library@3.9.9 (patch)
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
- @contractspec/bundle.library@3.9.9 (patch)
- @contractspec/lib.personalization@6.1.0 (patch)
- Integrator: Public docs now show how to wire DataViewRenderer with resolveDataViewPreferences and trackDataViewInteraction.



### Add public docs and LLM guidance for preference-aware DataViews.
- No manual migration steps recorded.

### Add public web docs and agent guidance for the ContractSpec translation runtime and optional i18next adapter.
- @contractspec/bundle.library@3.9.9 (patch)
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