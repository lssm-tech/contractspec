---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.design-system": minor
"@contractspec/lib.personalization": minor
"@contractspec/bundle.library": patch
---

Add preference-aware DataView collection integration.

`@contractspec/lib.contracts-spec` now lets collection DataView specs declare
`collection.dataDepth`, collection personalization persistence hints, and
field-level `visibility.minDataDepth` so one list/grid/table spec can support
summary, standard, detailed, and exhaustive projections.

`@contractspec/lib.design-system` now accepts `dataDepth`,
`defaultDataDepth`, and `onDataDepthChange` on web and native
`DataViewRenderer`, and projects collection fields by data depth without
mutating the authored spec.

`@contractspec/lib.personalization` now exposes data-view preference helpers
and `data_view_interaction` behavior events so apps can resolve preferred
view mode, density, and data depth into ordinary renderer props without adding
a design-system dependency on personalization.
