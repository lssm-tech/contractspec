# Entity Surface and Custom Fields

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Make complex entities render generically and richly, without writing one bespoke React page per domain type.

This file is especially aligned with your PM issue depth and deep customization specs.

## Why this matters

Your PM specs already move toward:
- relation-rich issues
- custom fields
- multi-supertag composition
- saved views
- sections
- automations
- templates
- cross-domain links
- agent-authored activity

If the UI layer does not become schema-driven now, every new entity feature will multiply page complexity.

## Core model

The bundle package should define an `EntitySurfaceRegistrySpec`.

```ts
export interface EntitySurfaceRegistrySpec {
  entityTypes: Record<string, EntityTypeSurfaceSpec>;
  fieldKinds: Record<string, FieldRendererSpec>;
  sectionKinds?: Record<string, SectionRendererSpec>;
  viewKinds?: Record<string, ViewRendererSpec>;
}

export interface EntityTypeSurfaceSpec {
  entityType: string;
  defaultSurfaceId: string;
  detailBlueprints: string[];
  supportedViews: string[];
  sectionsFromSchema?: boolean;
  fieldsFromSchema?: boolean;
  relationPanels?: string[];
}

export interface FieldRendererSpec {
  fieldKind: string;
  viewer: string;
  editor?: string;
  summaryViewer?: string;
  tableCell?: string;
  filters?: string[];
  validators?: string[];
}
```

## Field registry

The field registry should support both existing and new PM field kinds.

### Existing kinds
- text
- number
- date
- checkbox
- select
- options
- instance
- url

### New kinds
- relation
- rollup
- formula
- people

## Rendering expectations by field kind

### Relation

Needs:
- inline chips
- side preview cards
- expandable related items
- relation graph or dependency graph affordances
- keyboard-friendly entity picker
- contextual create/link flow

### Rollup

Needs:
- compact aggregation chips
- drill-down to source records
- tooltips or inspector to explain calculation scope

### Formula

Needs:
- computed value display
- dependency explainer
- error states for invalid formula
- optionally raw expression in advanced mode

### People

Needs:
- multi-person chips
- quick assign picker
- avatar + role rendering
- max count handling
- reviewer/stakeholder/assignee semantic styling

## Sections

Your PM spec introduces `PmFieldSection`. The bundle runtime should treat sections as first-class layout units, not just decorative wrappers.

A section can affect:
- collapse state
- default placement
- sort order
- density behavior
- narrative ordering
- drag-and-drop customization

## Multi-supertag resolution

When an entity has multiple applied types, the bundle runtime should resolve a merged render schema:

1. start with base entity type
2. apply inherited field definitions
3. merge additional type field definitions by declared order
4. resolve collisions deterministically
5. produce a final field/section layout graph

This final graph becomes the entity’s render contract for that context.

## Saved views

Saved views should become bundle-native render presets.

A saved view typically contains:
- filter
- sort
- group
- display type
- optional visible fields
- optional layout hints

The bundle system should allow a saved view to influence:
- surface selection
- default node set
- preferred layout blueprint
- promoted actions
- panel composition

## Suggested entity node kinds

```ts
type BundleNodeKind =
  | "entity-header"
  | "entity-summary"
  | "entity-section"
  | "entity-field"
  | "entity-activity"
  | "entity-relations"
  | "entity-timeline"
  | "entity-comments"
  | "entity-attachments"
  | "entity-view-switcher"
  | "entity-automation-panel";
```

These can be implemented as specializations or aliases over the generic node system.

## PM issue workbench recommendation

For PM issues, create a canonical workbench surface with slots like:

- `header`
- `overview`
- `details`
- `relations`
- `activity`
- `assistant`
- `inspector`

### Suggested default node set

- issue identity / status bar
- summary card
- custom field sections
- relations panel
- activity timeline
- comments and attachments
- assistant panel
- saved view switcher

### Variant layouts

- minimal summary mode
- balanced issue detail mode
- dense workbench mode
- evidence-first diagnostic mode
- template-edit mode

## Cross-domain relations

Your broader PM spec includes bridges into:
- meetings
- schedule
- loop
- decisions
- bookings
- content ops

The entity surface layer should support relation-backed panels that can appear conditionally when relation density is high or when the user explicitly asks for that context.

Example:
- show “Meeting Evidence” panel if related meetings exist
- show “Decision Trail” panel if issue is causally linked to a decision
- show “Schedule Impact” panel if issue is bound to time blocks

## Field validation and conditional visibility

Validation rules should integrate with the runtime and AI planner.

Examples:
- `required`
- `min`
- `max`
- `regex`
- dependent visibility

The assistant should know:
- whether a field is required
- whether it is currently hidden by a dependency rule
- whether a requested UI mutation would expose an invalid editing path

## Suggested APIs

```ts
export interface EntitySurfaceResolver {
  resolveEntitySchema(args: {
    entityType: string;
    entityId: string;
    workspaceId?: string;
  }): Promise<ResolvedEntitySchema>;
}

export interface ResolvedEntitySchema {
  entityType: string;
  sections: ResolvedSection[];
  fields: ResolvedField[];
  views: ResolvedViewPreset[];
}

export interface ResolvedField {
  fieldId: string;
  fieldKind: string;
  title: string;
  visible: boolean;
  editable: boolean;
  required: boolean;
  sectionId?: string;
}
```

## Strong recommendation

Treat rich entity surfaces as a declared graph, not a hand-built page.

That is the only sane way to support your current PM direction without building a maze of special-case components every time a new field kind or relation shows up.
