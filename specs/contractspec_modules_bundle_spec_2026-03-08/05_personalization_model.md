# Personalization Model

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Integrate the bundle runtime with the existing 7-dimension preference model in a way that is:
- explicit
- composable
- auditable
- and actually useful

## Canonical stance

The 7-dimension model is the canonical personalization grammar for this package.

The bundle package should consume a resolved preference profile and produce concrete UI adaptations from it. It should not invent a second preference system.

## The 7 dimensions

The bundle package must respect all 7 dimensions:

1. `guidance`
2. `density`
3. `dataDepth`
4. `control`
5. `media`
6. `pace`
7. `narrative`

## Storage scopes

Preferences should be resolvable at these scopes:

- global user defaults
- workspace-specific user defaults
- bundle-specific defaults
- surface-specific overrides
- entity-context overrides
- session overrides

### Important distinction

A **preference** is not the same thing as a **layout snapshot**.

- Preferences are stable intent.
- Layout snapshots are a concrete arrangement.
- Views are data-shaping projections.
- Overlays are durable mutations to the rendered contract.

Do not merge all of those into one blob. That way lies pain.

## Resolver model

The resolver should produce:

```ts
export interface ResolvedPreferenceProfile {
  canonical: PreferenceDimensions;
  sourceByDimension: {
    guidance: string;
    density: string;
    dataDepth: string;
    control: string;
    media: string;
    pace: string;
    narrative: string;
  };
  constrained: Partial<Record<keyof PreferenceDimensions, string>>;
  notes: string[];
}
```

This is important because user intent can be constrained by:
- capability gates
- device constraints
- performance thresholds
- workspace policy
- current route semantics

## Example

A user may request:

```ts
{
  control: "full",
  media: "voice",
  dataDepth: "exhaustive"
}
```

But the resolver may output:

```ts
{
  canonical: {
    control: "advanced",
    media: "hybrid",
    dataDepth: "detailed",
    guidance: "hints",
    density: "dense",
    pace: "rapid",
    narrative: "bottom-up",
  },
  constrained: {
    control: "missing advanced_policies capability",
    media: "voice unavailable on current route",
    dataDepth: "data set too large for exhaustive mode",
  },
}
```

That is honest and debuggable.

## Mapping each dimension to runtime behavior

### Guidance

Guidance changes:
- presence of hints
- onboarding explainers
- progressive disclosure
- step wrappers
- visible “why this matters” content
- assistant prompting style

It should **not** change the underlying allowed actions.

### Density

Density changes:
- spacing
- default panel expansion
- whether tables or cards are favored
- number of visible side rails
- whether secondary data is collapsed

Density is visual and structural, not semantic.

### Data Depth

Data depth changes:
- query shape
- pagination size
- inline expansion of related records
- source visibility
- raw payload inspection affordances

This dimension is partly runtime-data, not just UI chrome.

### Control

Control changes:
- visible toggles
- advanced inspectors
- raw configs
- batch operations
- editable policies
- command palette breadth

It should never bypass capability checks.

### Media

Media changes:
- whether text, visuals, or voice surfaces are preferred
- whether charts or prose summaries are primary
- whether TTS / voice notes are enabled
- whether a visual map or relation graph is promoted

### Pace

Pace changes:
- animation duration
- confirmation depth
- skeleton persistence
- undo prominence
- whether instant transitions are used

This dimension must respect `prefers-reduced-motion`.

### Narrative

Narrative changes:
- ordering of summary vs evidence
- whether dashboards open with verdicts or raw signals
- whether assistant responses lead with conclusions or evidence

## Presets

Bundle specs may define presets like:
- `executive`
- `analyst`
- `builder`
- `guide-me`
- `ops-war-room`

But presets should only be shorthand for patches to the same 7 dimensions.

## Required verification block

Every surface must explain how it responds to each dimension.

Example:

```ts
verification: {
  dimensions: {
    guidance: "Promotes inline hints and assistant explanation panel",
    density: "Switches between card-first and split-view table layouts",
    dataDepth: "Controls relation inlining and pagination size",
    control: "Shows or hides advanced filters, policy editor, and raw config tabs",
    media: "Prefers text summary, charts, or voice note panel",
    pace: "Maps to motion tokens and confirmation behavior",
    narrative: "Reorders summary and evidence sections",
  }
}
```

## Persisted layout versus personalization

A user may prefer `density=dense`, but still resize the right inspector to 22%.

Those are different facts:
- one is a preference
- the other is a layout snapshot

The bundle runtime should combine them, not confuse them.

## Recommended APIs

```ts
export interface BundlePreferenceAdapter {
  resolve(ctx: BundleContext): Promise<ResolvedPreferenceProfile>;
  savePreferencePatch(args: {
    actorId: string;
    workspaceId?: string;
    patch: Partial<PreferenceDimensions>;
    scope: "user" | "workspace-user" | "surface";
  }): Promise<void>;
}
```

## Opinionated rule

Do not create route-specific preference enums like `issueDensityMode` or `meetingNarrativeMode` unless there is a truly domain-specific need.

The whole point of your current preference model is that it is orthogonal, portable, and broad. Keep it that way. Humans love adding bespoke flags and then wondering why the system became incomprehensible.
