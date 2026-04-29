---
"@contractspec/lib.translation-runtime": minor
---

Add an optional ContractSpec-first i18next adapter.

`@contractspec/lib.translation-runtime/i18next` now projects canonical `TranslationSpec` catalogs and runtime snapshots into i18next resources, sidecar metadata manifests, deterministic init options, and caller-owned resource bundle installation helpers. ContractSpec remains the canonical source of truth for translation contracts, locale variants, fallback metadata, diagnostics, and ownership; i18next stays a downstream compatibility adapter.

The adapter preserves stable bundle identity separately from locale, exports ICU messages intact, keeps dotted keys flat with `keySeparator: false`, reports lossy fallback/ICU/collision diagnostics, and avoids global i18next singleton mutation for SSR and request isolation.
