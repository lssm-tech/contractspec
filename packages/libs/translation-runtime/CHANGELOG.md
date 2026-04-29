# @contractspec/lib.translation-runtime

## 0.2.0

### Minor Changes

- Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.translation-runtime (minor), @contractspec/lib.design-system (minor), @contractspec/example.locale-jurisdiction-gate (patch)
  - Migration: Prefer `meta.key: "bundle.messages"` with `locale: "fr-FR"` over stable keys that encode locale suffixes.; The i18next adapter exports ContractSpec ICU messages intact and does not make i18next canonical.
- Add an optional ContractSpec-first i18next adapter for downstream interoperability.
  - Packages: @contractspec/lib.translation-runtime (minor)
  - Migration: Use `@contractspec/lib.translation-runtime/i18next` for downstream i18next projection instead of importing adapter internals.; Namespace translation bundles with stable ContractSpec keys and use `TranslationSpec.locale` for BCP 47 language tags.

### Patch Changes

- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.contracts-spec@6.2.0
