# Implementation Plan: Entity Surface and Custom Fields

- **Spec:** 08_entity_surface_and_custom_fields.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Enables schema-driven entity rendering (PM issues, etc.) through field/section/view registries instead of bespoke pages. Supports custom fields, relation/rollup/formula/people, and multi-supertag resolution.

## Objectives

1. [x] Implement EntitySurfaceRegistrySpec (entity types, field kinds, sections, views).
2. [x] Implement field renderer registry (text, number, date, select, relation, rollup, formula, people).
3. [x] Implement PM workbench surface: header, overview, details, relations, activity, assistant, inspector (slots/layouts in example).
4. [x] Implement section rendering and saved view types.
5. [ ] Support multi-supertag merged render schema (deferred to v2).

## Non-goals (v1)

- Full supertag/knowledge graph integration (stub).
- All 8+ field kinds with full renderers (start with text, number, date, select).
- Relation panel with full graph (stub first).
- Multi-supertag merged render schema (types in place; resolution deferred).

## Codebase alignment

- Pilot: PM issue workbench in bundle.workspace or bundle.library.
- Field renderers follow adapter pattern.
- Align with contracts-runtime-client-react for form/field rendering where applicable.

## Workstreams

### WS1 — Entity registry types

- [x] Implement EntitySurfaceRegistrySpec.
- [x] Implement field kinds enum and FieldRendererSpec.
- [x] Implement section and view specs.
- [x] Add to ModuleBundleSpec.entities.

### WS2 — Field renderer registry

- [x] Implement FieldRendererRegistry interface.
- [x] Register core field kinds (text, number, date, select).
- [x] Add relation, rollup, formula, people stubs.
- [x] Implement fallback for unknown field kinds.

### WS3 — PM workbench pilot

- [x] Define PM issue bundle spec with entity registry.
- [x] Implement section rendering (overview, details, relations, activity).
- [x] Implement saved view types (ResolvedViewPreset, viewKinds in registry).
- [x] Wire saved view into resolution (layout selection when view active).
- [x] Replace or wrap existing PM issue detail page with bundle-native surface.

## Dependencies

- 01_core_bundle (types).
- 02_resolution_runtime (data recipes for entity).
- 04_ui_adapters (SlotRenderer, entity-section node kind).

## Completed (2026-03-08)

- EntitySurfaceRegistrySpec, EntityTypeSurfaceSpec, FieldRendererSpec, SectionRendererSpec, ViewRendererSpec.
- EntityFieldKind, ResolvedEntitySchema, ResolvedField, ResolvedSection, ResolvedViewPreset, EntitySurfaceResolver.
- FieldRendererRegistry with createFieldRendererRegistry(); core kinds (text, number, date, select, checkbox) + stubs (relation, rollup, formula, people, options, instance, url).
- New BundleNodeKind: entity-header, entity-summary, entity-activity, entity-relations, entity-timeline, entity-comments, entity-attachments, entity-view-switcher, entity-automation-panel.
- SlotRenderer entity-section and entity-field rendering.
- PM workbench example with entities registry (specs/.../examples/pm-workbench.bundle.ts).
- defineModuleBundle validation for entities when present.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Field registry too complex | Start minimal; add kinds incrementally. |
| PM data model mismatch | Align with existing PM types in bundle.workspace. |
