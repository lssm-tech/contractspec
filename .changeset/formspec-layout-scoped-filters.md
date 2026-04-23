---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.contracts-runtime-client-react": patch
"@contractspec/lib.presentation-runtime-core": minor
"@contractspec/lib.presentation-runtime-react": minor
"@contractspec/lib.presentation-runtime-react-native": minor
"@contractspec/lib.design-system": minor
---

Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.
