---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.translation-runtime": minor
"@contractspec/lib.design-system": minor
"@contractspec/example.locale-jurisdiction-gate": patch
---

Introduce a ContractSpec-native translation runtime and strengthen translation contracts.

`@contractspec/lib.contracts-spec` now models richer translation metadata for BCP 47 locale variants, fallback chains, direction hints, and formatter metadata while warning when stable bundle keys encode locale suffixes. Validation now accepts real BCP 47 tags such as `ar-EG` and `zh-Hans` and rejects malformed locale names.

`@contractspec/lib.translation-runtime` is a new framework-independent runtime that consumes canonical `TranslationSpec` catalogs, uses a formatter abstraction backed by FormatJS/`intl-messageformat`, supports locale negotiation, fallback chains, override layers, diagnostics, async loading, request-isolated instances, and SSR snapshots.

`@contractspec/lib.translation-runtime/i18next` now provides an optional downstream i18next projection that exports resources, sidecar metadata, safe init options, and caller-owned resource bundle installation without making i18next canonical.

`@contractspec/lib.design-system` can now create a runtime-backed translation resolver while preserving the existing registry resolver path. The locale-jurisdiction-gate example now uses a stable translation bundle key with separate locale variants.
