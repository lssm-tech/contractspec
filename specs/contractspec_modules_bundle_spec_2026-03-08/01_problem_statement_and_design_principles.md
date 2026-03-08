# Problem Statement and Design Principles

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Problem statement

ContractSpec is already good at defining what a system can do, but AI-native products need one more layer: a way to define what the **user should see next**, how that surface should adapt, and how those adaptations stay safe.

Today, without a bundle layer, teams drift toward one of three bad patterns:

1. **Static pages everywhere**  
   Every route becomes bespoke React code with ad hoc fetches, state, side panels, and conditionals.

2. **Chat as fake product shell**  
   Everything gets shoved into a chat thread, which is flexible but weak for dense data, comparison, editing, and repeated workflows.

3. **Unbounded generative UI**  
   A model emits raw UI structures that are difficult to validate, audit, or keep consistent with policies, capabilities, and design tokens.

None of those gets you to a truly AI-native, data-native product.

## What the bundle layer must solve

A serious bundle layer must answer these questions:

- Which surface should resolve for this route, actor, device, entity, and moment?
- Which data should be loaded, and at what depth?
- What layout should appear given preference dimensions, saved views, and current intent?
- Which actions are allowed, visible, promoted, hidden, or explainable?
- Which parts of the surface may AI modify?
- How do AI suggestions become accepted customizations?
- How do custom fields, sections, views, and domain extensions render without page-specific glue?
- How do we undo, audit, and measure the effect of changes?

## Design principles

### 1. Spec first, runtime second

All important behavior must be declared in a spec shape before it becomes runtime behavior.

That includes:
- surface structure
- slots
- layout blueprints
- AI-allowed patch operations
- extension points
- policy hooks
- telemetry events

### 2. Resolve, don’t improvise

The runtime should resolve the best eligible surface from declared options. It should not “invent a page”.

AI can help rank, choose, and patch within declared structures. The base system remains deterministic.

### 3. Stable slots over fragile trees

Surfaces need named regions and slots:
- `header`
- `primary`
- `secondary`
- `assistant`
- `inspector`
- `footer`
- `floating`
- `command`

Stable slots make it possible to:
- patch safely,
- persist customizations,
- merge overlays,
- and keep UI generation composable.

### 4. Chat plus direct manipulation

AI-native does not mean chat-only.

Users should be able to:
- talk to the assistant,
- drag sections,
- resize panels,
- edit structured fields,
- use command palettes,
- and invoke contextual actions directly.

Chat is one control surface, not the whole product.

### 5. Data depth must be explicit

A surface should not load “everything” by default. The spec must declare data recipes and allow the resolver to choose the right depth for the context.

This matters for:
- performance
- cost
- cognitive load
- trust

### 6. Personalization should be principled

Use the 7 preference dimensions:
- guidance
- density
- dataDepth
- control
- media
- pace
- narrative

Those axes give you a compact, orthogonal adaptation model that is far better than fifty one-off toggles.

### 7. Every dynamic change must be reversible

There should be:
- an audit record,
- a diff,
- an approval state when needed,
- and an undo path.

That applies to:
- manual layout edits,
- AI surface suggestions,
- workspace-level customizations,
- and policy-driven redactions.

### 8. Accessibility is part of the contract

Bundle specs must define:
- keyboard paths
- focus behavior
- readable aria labels
- screen reader announcements for drag-and-drop
- motion reduction behavior
- explanatory text for hidden/disabled actions

### 9. Design tokens still win

AI should not bypass the design system. It should only compose:
- approved primitives
- approved block schemas
- approved renderer types
- approved slot behaviors

### 10. Ejectability matters

Generated or resolved surfaces must remain inspectable and debuggable. The package must remain aligned with ContractSpec’s broader philosophy: standard tech, readable outputs, no prison.

## Required product qualities

The bundle layer should make it realistic to build software that feels like a mix of:

- Notion’s block and view flexibility
- Airtable’s alternate views and field-driven surfaces
- Linear’s speed and command efficiency
- Retool’s prompt-plus-canvas-plus-code composition

without turning ContractSpec into a low-code swamp.

## Key tension to manage

The hardest tension is this:

**The more flexible the system becomes, the easier it is to lose coherence.**

The answer is not less flexibility.

The answer is:
- typed contracts,
- explicit slots,
- validated patches,
- policy-aware resolution,
- and audit-friendly persistence.
