# Design Inspirations

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Distill useful product patterns from modern configurable software without copying their weaknesses.

## Pattern 1: Notion-style flexible structured content

Useful lessons:
- blocks as a user-facing composition primitive
- configurable properties and visibility
- alternate views over the same underlying entity/data set
- application-like detail surfaces
- user-created structure without raw-code editing

What to adopt:
- schema-driven field and section rendering
- rich document surfaces
- custom blocks and inline entity references
- view presets and layout variants

What not to copy:
- hidden complexity in page templates
- weak enforcement of strongly typed domain actions

## Pattern 2: Airtable-style multi-view data surfaces

Useful lessons:
- one underlying table/data model, many views
- personal, collaborative, and locked views
- field-driven shape
- filters, grouping, sorting, alternate layouts

What to adopt:
- saved view presets in the bundle layer
- view-scoped configuration and permissions
- collaborative versus personal versus locked surface customizations

What not to copy:
- letting view configuration become the only interaction model
- over-reliance on table metaphors for everything

## Pattern 3: Linear-style speed and command efficiency

Useful lessons:
- keyboard-first navigation
- command palette
- dense but legible workbench surfaces
- bulk actions
- undo as a normal part of the workflow

What to adopt:
- command registry
- predictable shortcuts
- fast transitions
- strong defaults for dense expert workflows

What not to copy:
- assuming every domain can be flattened into one ultra-opinionated interaction style

## Pattern 4: Retool-style prompt + canvas + code composition

Useful lessons:
- users want multiple creation modes
- prompt-to-first-draft is powerful when grounded in real context
- visual canvas helps spatial reasoning
- code/custom logic remains essential for experts

What to adopt:
- assistant as planner
- direct manipulation editing mode
- editable generated surfaces
- explicit policy and governance around generated changes

What not to copy:
- turning the product into an opaque low-code runtime
- allowing generated structure to outrun governance

## Bundle-native synthesis

The ContractSpec version should combine these ideas like this:

- rich block surfaces from Notion-like patterns
- field/view-driven entities from Airtable-like patterns
- command speed from Linear-like patterns
- AI-assisted composition from Retool-like patterns

But the ContractSpec version should stay more rigorous by adding:
- typed bundle specs
- policy-aware rendering
- overlay-based persistence
- auditable AI patch proposals
- explicit 7-dimension personalization

## Product stance

The target experience is **not** a low-code builder exposed to end users.

The target is a product where:
- the system understands intent,
- the UI adapts intelligently,
- users can still directly manipulate structure,
- and every important change remains governed by a spec.

That is much closer to an “AI-native operating surface” than a page builder with a chat box bolted on top.
