# Surface Resolution and Runtime

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Describe the runtime pipeline that turns a `ModuleBundleSpec` plus request context into a concrete `ResolvedSurfacePlan`.

## Core pipeline

```text
BundleSpec
  + Route context
  + Entity context
  + Preference profile
  + Capabilities / policy context
  + Saved state
  + Overlays
  + Optional AI planner
= ResolvedSurfacePlan
```

## Resolution order

Order matters. If you get this wrong, the system becomes impossible to reason about.

### Step 1: Build `BundleContext`

Collect:

- route and params
- query
- actor
- workspace / tenant
- device class
- feature flags
- capabilities
- active entity
- conversation state
- 7 preference dimensions
- mode (`guided`, `pro`, `autopilot`)

### Step 2: Choose eligible surfaces

Take the current route and determine which declared surfaces are eligible.

Eligibility depends on:
- route match
- surface `when`
- capability requirements
- entity presence or absence
- device constraints

The resolver should return:
- selected surface
- ranked alternatives
- rejected candidates with reasons

That last part is important for debugging and evaluation.

### Step 3: Select a layout blueprint

Within the chosen surface:
- evaluate `layouts[].when`
- sort by priority / match score
- pick the highest valid layout
- load saved layout override if allowed and still valid

Layouts are not arbitrary JSON blobs. They are declared blueprints.

### Step 4: Resolve data recipes

For each `DataRecipeSpec`:
- evaluate `when`
- clamp requested data depth if necessary
- execute the source binding
- hydrate the result into named bindings

The runtime should record:
- requested depth
- resolved depth
- downgraded depth reason
- latency
- cache status

### Step 5: Apply preference adaptation

Map the 7 preference dimensions into layout and render adjustments.

Examples:
- `density=dense` may expand multi-panel workbench layouts
- `guidance=wizard` may promote explanatory blocks
- `narrative=top-down` may reorder summary above evidence
- `pace=rapid` may choose low-animation variants

This step should produce explicit adaptation metadata rather than invisible magic.

### Step 6: Apply policy

Before any UI plan is returned:
- hide restricted nodes
- redact restricted data
- disable forbidden actions
- attach explanations where needed

Policy is not just about API execution. It also shapes what the user is allowed to see and manipulate.

### Step 7: Apply persistent overlays

Apply signed or stored overlays in order:

1. system
2. tenant / workspace
3. team
4. user

Conflict resolution should be deterministic:
- higher specificity wins
- later scope wins when specificity is equal
- invalid overlays fail closed and are logged

### Step 8: Apply ephemeral session state

This includes:
- unsaved panel changes
- temporary view filters
- open tabs
- draft assistant patches
- focused node

Session state should not silently mutate durable preferences.

### Step 9: Optional AI planning

If the surface is AI-enabled:
- build planner context from the resolved plan
- include only allowed slots, nodes, actions, and tools
- ask for zero or more `SurfacePatchOp` items
- validate patches
- label them as proposals until accepted or auto-approved

### Step 10: Materialize `ResolvedSurfacePlan`

The output should contain:
- selected surface metadata
- final layout
- bound data
- visible actions
- applied overlays
- applied preference adaptations
- pending AI proposals
- telemetry metadata

## Suggested runtime types

```ts
export interface ResolvedSurfacePlan {
  bundleKey: string;
  surfaceId: string;
  layoutId: string;
  nodes: SurfaceNode[];
  actions: ActionSpec[];
  commands: CommandSpec[];
  bindings: Record<string, unknown>;
  adaptation: ResolvedAdaptation;
  overlays: AppliedOverlayMeta[];
  ai: {
    plannerId?: string;
    proposals?: SurfacePatchProposal[];
  };
  audit: {
    resolutionId: string;
    createdAt: string;
    reasons: string[];
  };
}

export interface ResolvedAdaptation {
  appliedDimensions: PreferenceDimensions;
  notes: string[];
}

export interface AppliedOverlayMeta {
  overlayId: string;
  scope: BundleScope;
  appliedOps: number;
}

export interface SurfacePatchProposal {
  proposalId: string;
  source: "assistant" | "workspace-rule" | "session";
  ops: SurfacePatchOp[];
  approvalState: "proposed" | "approved" | "rejected" | "auto-approved";
}
```

## Caching

Cache the right things, not everything.

### Good cache targets

- surface candidate selection for identical route+capability sets
- data recipes with stable arguments
- compiled planner prompts
- validated overlay merges

### Bad cache targets

- final plan including ephemeral session state
- anything containing stale permission snapshots
- AI proposal outputs without route/entity isolation

## SSR and hydration

The runtime should support server-side resolution of the initial surface plan.

Recommended pattern:
- resolve plan on server
- serialize a safe plan payload
- hydrate client runtime from that payload
- reattach local state, panel persistence, and assistant state client-side

### Avoid

- recomputing an entirely different layout immediately after hydration
- reading persistent panel state on the client only, if it causes visible flicker
- letting client-side AI planner race against server content on initial load

## Undo model

Every patch application should produce:
- forward ops
- inverse ops
- audit metadata

That makes undo straightforward and keeps the interaction model sane.

## Failure modes to handle

- overlay invalid after schema change
- saved layout references missing slot or panel
- AI proposes forbidden node
- data depth clamped due to performance
- route eligible but entity missing
- field renderer missing for custom field type

These should not crash the page. They should degrade into a known fallback and log structured diagnostics.

## Fallback rule

If a surface cannot be resolved cleanly, fall back in this order:

1. same route, simpler layout
2. same route, base overview surface
3. route-level error surface with explainable diagnostics

Do not leave the user on a blank page because your resolver got clever and then tripped over its own shoelaces.
