---
"@contractspec/lib.design-system": minor
"@contractspec/lib.presentation-runtime-react": patch
"@contractspec/lib.ui-kit-web": patch
"@contractspec/lib.ui-kit": patch
"@contractspec/example.crm-pipeline": patch
"@contractspec/example.data-grid-showcase": patch
---

Upgrade the shared data-table stack with safer controller state handling, richer composed toolbar UX, and stronger web/native regression coverage.

- add `DataTableToolbar` to `@contractspec/lib.design-system` as the recommended composed layer for search, active chips, selection summary, and hidden-column recovery
- harden `@contractspec/lib.presentation-runtime-react` table state normalization so stale row/column state and invalid pagination are pruned before they can leak into the render path
- improve `@contractspec/lib.ui-kit-web` and `@contractspec/lib.ui-kit` table interactions with safer resize cleanup, last-visible-column protection, and better row activation behavior
- update the CRM and data-grid showcase examples to demonstrate the new composed toolbar path for server/client tables, filters, loading/empty states, and recovery affordances
