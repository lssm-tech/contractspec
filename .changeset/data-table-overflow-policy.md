---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.presentation-runtime-core": minor
"@contractspec/lib.presentation-runtime-react": minor
"@contractspec/lib.ui-kit-web": patch
"@contractspec/lib.ui-kit": patch
"@contractspec/lib.design-system": patch
"@contractspec/module.workspace": patch
"@contractspec/bundle.workspace": patch
"@contractspec/app.cli-contractspec": patch
"@contractspec/bundle.library": patch
---

Add contract-driven data-table overflow behavior so DataView fields and columns can choose truncation, wrapping, row expansion, initial hiding, or unmodified rendering while keeping type-aware defaults for unspecified columns.

Also tighten DataView format and filter metadata for numeric, currency, percent, temporal, and duration values so scaffolds, docs, query validation, and renderers can make consistent type-aware choices.
