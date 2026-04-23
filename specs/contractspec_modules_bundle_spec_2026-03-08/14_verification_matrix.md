# Verification Matrix

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime`
- **Repo Path:** `packages/libs/surface-runtime`


## Goal

Make it impossible for new surfaces to ignore the 7 preference dimensions or silently bypass the model.

## Hard requirement

Every in-scope surface must be represented in a verification matrix with explicit accountability for all 7 dimensions.

This is not optional documentation. It should become:
- a lint target
- a review artifact
- and eventually a test fixture

## Required columns

- bundle key
- route / context
- surface id
- guidance behavior
- density behavior
- dataDepth behavior
- control behavior
- media behavior
- pace behavior
- narrative behavior
- notes / constraints
- test coverage status
- owner

## Example matrix

| Bundle | Route | Surface | Guidance | Density | Data Depth | Control | Media | Pace | Narrative | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `pm.workbench` | `/operate/pm/issues/:issueId` | `issue-workbench` | Inline hints or walkthrough rail when `walkthrough+` | Compact to dense 3-pane layouts on desktop | Summary through detailed relation hydration | Advanced commands and raw config tabs gated by capability | Text summary, visual relation graph, hybrid assistant | Motion tokens and confirmation depth map from pace | Summary-first or evidence-first reorder | `voice` may be unavailable if route or capability does not allow it |
| `pm.workbench` | `/operate/pm/issues/:issueId` | `issue-template-editor` | Wizard guidance can wrap template creation | Standard or detailed layout; dense discouraged | Standard field library loading, detailed in advanced mode | Full template automation editing gated | Text-first by default | Deliberate recommended | Top-down by default | High-sensitivity surface |

## Suggested authoring shape

```ts
export interface SurfaceVerificationSpec {
  dimensions: {
    guidance: string;
    density: string;
    dataDepth: string;
    control: string;
    media: string;
    pace: string;
    narrative: string;
  };
}
```

## Automated checks

### Check 1
Every surface has all 7 dimension descriptions.

### Check 2
Every surface description is non-empty and not copy-pasted boilerplate.

### Check 3
Capability-gated dimensions are explicitly called out.

### Check 4
If a surface disables a dimension effect, it must say why.

Example:
- voice unavailable
- exhaustive depth clamped
- full control disabled for guided mode

## Snapshot coverage recommendation

For each critical bundle surface, snapshot at least:

- one low-guidance state
- one high-guidance state
- one compact state
- one dense state
- one top-down state
- one bottom-up state
- one constrained capability state
- one authenticated state when the feature has gated user/admin behavior
- one visual baseline state for high-risk UI surfaces

You do not need the full Cartesian product. That would be absurd. Use risk-based combinations.

## Review questions

When reviewing a new bundle or surface, ask:

1. What does `density=dense` actually do here?
2. What changes when `control=full`?
3. Is `narrative=bottom-up` visible in the ordering?
4. What happens when `dataDepth=exhaustive` is requested but not allowed?
5. How is `pace=rapid` expressed beyond “faster animations”?
6. If `media=voice`, what is rendered differently?
7. If `guidance=wizard`, does the surface actually become more guided?

If the answers are fuzzy, the surface is not ready.

## Why this matters

Without this matrix, “adaptive UI” becomes hand-wavy marketing language and slowly degrades into random conditionals.

With it, the team can reason about adaptation as a real contract.
