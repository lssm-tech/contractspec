---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.notification": minor
"@contractspec/module.notifications": patch
"@contractspec/lib.design-system": minor
"@contractspec/example.crm-pipeline": patch
"@contractspec/example.wealth-snapshot": patch
"@contractspec/example.saas-boilerplate": patch
---

Move notification contracts and reusable notification helpers into library-first packages while keeping `@contractspec/module.notifications` as a compatibility shim.

`@contractspec/lib.contracts-spec/notifications` is now the canonical notification contract surface, and `@contractspec/lib.notification` now owns notification entities, schema contribution, channels, templates, and i18n helpers. The module package continues to resolve existing imports and preserves its legacy schema contribution identity for non-breaking migration.

`@contractspec/lib.design-system/shell` also gains prop-driven in-app notification affordances for web and native application shells without depending on any notification runtime package.
