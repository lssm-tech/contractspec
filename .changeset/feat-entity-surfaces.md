---
"@contractspec/lib.surface-runtime": minor
---

feat(surface-runtime): entity surface registry and field renderer registry

Implements 06_entity_surfaces plan:
- EntitySurfaceRegistrySpec with entityTypes, fieldKinds, sectionKinds, viewKinds
- FieldRendererRegistry with core kinds (text, number, date, select, checkbox) and stubs (relation, rollup, formula, people)
- New BundleNodeKind values: entity-header, entity-summary, entity-activity, entity-relations, etc.
- Section and entity-field rendering in SlotRenderer
- PM workbench example with entities registry
- ResolvedEntitySchema, ResolvedField, ResolvedSection, ResolvedViewPreset types
