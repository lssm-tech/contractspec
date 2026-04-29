# Patch Notes



### Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- Slug: adaptive-object-reference-panel
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.3.0 (minor)
- Maintainer: Design-system now exposes AdaptivePanel as the shared responsive sheet/drawer primitive and wires object-reference details through it.

### Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- Slug: adaptive-panel-menu-migration
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.3.0 (patch)
- Maintainer: Header and marketing header mobile menus now use AdaptivePanel instead of direct sheet composition, leaving sheet/drawer primitives behind the shared overlay adapter.

### Document AppShell in-app notification adoption and refresh shell implementation prompts.
- Slug: application-shell-notification-docs
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.9.8 (patch)
- @contractspec/app.web-landing (patch)
- Maintainer: Maintainers get updated copy-ready AI prompts that include library-first notification imports, shell notification props, and migration from legacy notification module imports.

### Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Slug: contractspec-i18n-runtime
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.1.0 (minor)
- @contractspec/lib.translation-runtime@0.1.0 (minor)
- @contractspec/lib.design-system@4.3.0 (minor)
- @contractspec/example.locale-jurisdiction-gate@3.7.26 (patch)
- Maintainer: Translation specs now keep stable bundle identity separate from locale variants while the runtime owns formatter-backed ICU resolution, fallback chains, overrides, diagnostics, async loading, SSR snapshots, and optional downstream i18next projection.

### Add an optional ContractSpec-first i18next adapter for downstream interoperability.
- Slug: contractspec-i18next-adapter
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.translation-runtime@0.1.0 (minor)
- Maintainer: The translation runtime now exposes an optional `./i18next` subpath while keeping the root runtime and ContractSpec registry i18next-free.

### Add template-aware import mapping with column aliases, flexible value formatting, codec options, client review state, and server audit evidence.
- Slug: data-exchange-import-templates
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.data-exchange-core@0.2.6 (minor)
- @contractspec/lib.data-exchange-client@0.2.7 (minor)
- @contractspec/lib.data-exchange-server@0.2.6 (minor)
- Maintainer: Maintainers can define reusable import templates that resolve incoming file columns through aliases, normalized labels, and SchemaModel fallback inference.

### Add preference-aware DataView collection defaults and personalization adapters.
- Slug: data-views-personalization-integration
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.1.0 (minor)
- @contractspec/lib.design-system@4.3.0 (minor)
- @contractspec/lib.personalization@6.0.26 (minor)
- @contractspec/bundle.library@3.9.8 (patch)
- Maintainer: DataView contracts now expose neutral data-depth and collection personalization hints while keeping contracts-spec independent from personalization runtime code.

### Speed up npm release publishing by removing per-package dist-tag convergence polling after successful dist-tag updates.
- Slug: fast-npm-dist-tag-reconciliation
- Date: 2026-04-29
- Breaking: no
- contractspec@1.46.2 (patch)
- Maintainer: Stable and canary npm release jobs now avoid the repeated dist-tag verification sleep loop after `npm dist-tag add` succeeds.

### Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Slug: notification-library-shell
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.1.0 (minor)
- @contractspec/lib.notification@0.1.0 (minor)
- @contractspec/module.notifications@3.8.2 (patch)
- @contractspec/lib.design-system@4.3.0 (minor)
- @contractspec/example.crm-pipeline@3.7.28 (patch)
- @contractspec/example.wealth-snapshot@3.8.0 (patch)
- @contractspec/example.saas-boilerplate@3.8.20 (patch)
- Maintainer: Notification contracts now live in contracts-spec, reusable notification helpers live in lib.notification, and the old module remains as a compatibility shim.
- Deprecations:
  - The `@contractspec/module.notifications` package remains import-compatible for this release, but new code should import contracts from `@contractspec/lib.contracts-spec/notifications` and runtime helpers from `@contractspec/lib.notification`.

### Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Slug: phone-number-field-support
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.1.0 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.13.0 (minor)
- @contractspec/lib.design-system@4.3.0 (minor)
- Maintainer: FormSpec phone contracts now expose input, output, country, and display configuration while keeping the schema-owned value model backward compatible.

### Add PWA update management contracts and runtime helpers.
- Slug: pwa-update-management
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.1.0 (minor)
- @contractspec/lib.contracts-runtime-server-rest@3.8.5 (minor)
- @contractspec/lib.contracts-runtime-client-react@3.13.0 (minor)
- Maintainer: Maintainers get typed contracts, registry helpers, server evaluation helpers, and React prompt state helpers for PWA update workflows.

### Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
- Slug: roles-permissions-rbac-policy-system
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.1.0 (minor)
- @contractspec/lib.identity-rbac@3.7.26 (minor)
- @contractspec/lib.design-system@4.3.0 (minor)
- @contractspec/lib.personalization@6.0.26 (minor)
- Maintainer: Contract authors can declare shared static policy requirements while RBAC providers evaluate static, dynamic, and hybrid workspace-scoped grants.

### Stabilize release artifact generation so customer-facing release files stay current-release-only and deterministic.
- Slug: stabilize-current-release-artifacts
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.workspace@4.5.6 (minor)
- @contractspec/app.cli-contractspec@6.2.2 (minor)
- @contractspec/app.web-landing (patch)
- contractspec@1.46.2 (patch)
- Maintainer: Release builds now default to compact current-release artifacts, while full historical output must be requested explicitly with `--scope all`.