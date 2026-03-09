# Observability, Evals, and Metrics

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime`
- **Repo Path:** `packages/libs/surface-runtime`


## Goal

Measure whether the bundle system is actually making the product better rather than merely more complicated.

## Why this matters

Dynamic UI systems are easy to rationalize and hard to validate.

Without structured telemetry, people will look at a clever demo, nod solemnly, and then ship a system that:
- confuses users,
- hides useful information,
- creates layout churn,
- or causes assistants to spam “helpful” suggestions no one wanted.

## Event taxonomy

### Resolution events
- `bundle.surface.resolved`
- `bundle.surface.fallback`
- `bundle.layout.selected`
- `bundle.preference.adapted`

### Interaction events
- `bundle.action.executed`
- `bundle.command.executed`
- `bundle.panel.resized`
- `bundle.node.moved`
- `bundle.view.changed`

### AI events
- `bundle.ai.proposal.created`
- `bundle.ai.proposal.approved`
- `bundle.ai.proposal.rejected`
- `bundle.ai.followup.requested`
- `bundle.ai.patch.validation_failed`

### Policy events
- `bundle.policy.denied`
- `bundle.policy.redacted`

### Entity rendering events
- `bundle.field.renderer.missing`
- `bundle.section.collapsed`
- `bundle.saved_view.applied`

## Core metrics

### 1. Time to first useful action
How long until the user does something meaningful after the surface loads?

### 2. Surface switch rate
How often does the user immediately switch away from the resolved surface?

High rate may mean bad selection logic.

### 3. Layout churn
How often does the same user repeatedly resize or rearrange the same layout?

High churn suggests the defaults are wrong.

### 4. AI patch acceptance rate
What fraction of assistant proposals are accepted?

### 5. AI patch persistence rate
Of accepted patches, how many are promoted from session-only to user or workspace persistence?

This is a much better signal than raw suggestion volume.

### 6. Policy friction rate
How often do users hit disabled or denied actions?

Useful for understanding whether the UI is tempting users into dead ends.

### 7. Field interaction depth
How many non-empty fields are actually read or edited on complex entity surfaces?

### 8. Performance
Track:
- resolver latency
- data recipe latency
- hydration mismatch rate
- panel persistence restore success
- motion-related frame drops on dense surfaces

## Bundle-specific success metrics

Add bundle-level metrics such as:
- surface usefulness score
- customization adoption
- saved layout reuse
- view preset reuse
- assistant-guided completion rate
- relation panel usefulness
- top-down vs bottom-up completion deltas

## Golden context evals

Create a golden-context harness.

A golden context is a fixed bundle context plus expected output constraints.

Example:
- PM issue with 120 related entities
- `density=dense`
- `dataDepth=detailed`
- `narrative=bottom-up`
- `control=advanced`

Expected:
- dense workbench layout selected
- relation panel visible
- evidence above summary
- advanced filters visible
- no forbidden raw config tabs without capability

## Snapshot testing

For critical bundles, store:
- surface selection snapshots
- resolved plan snapshots
- patch validation snapshots
- policy/redaction snapshots

Do this for:
- desktop
- mobile
- low capability actors
- advanced actors
- different preference presets

## Assistant evals

Evaluate assistant behavior on:
- intent detection accuracy
- invalid patch rate
- over-eager suggestion rate
- explanation usefulness
- patch size discipline
- follow-up question necessity

### Bad assistant behavior signals

- suggests too many changes
- repeats obvious UI operations
- proposes destructive layout edits
- ignores preference profile
- explains badly hidden policy constraints

## Example telemetry payload

```ts
export interface SurfaceResolvedEvent {
  event: "bundle.surface.resolved";
  bundleKey: string;
  surfaceId: string;
  layoutId: string;
  actorId?: string;
  workspaceId?: string;
  route: string;
  dimensions: PreferenceDimensions;
  resolutionMs: number;
  fallback: boolean;
  reasons: string[];
}
```

## Use observability primitives already present in ContractSpec

This package should not reinvent:
- tracing
- metrics
- anomaly detection
- intent detection pipelines

It should emit semantically rich events that the existing observability package can consume.

## Recommended dashboards

### Product dashboard
- task completion
- assistant usefulness
- view/layout adoption
- personalization distribution

### Runtime dashboard
- resolver latency
- plan size
- render failures
- hydration mismatch
- patch validation failures

### Safety dashboard
- policy denies
- redaction frequency
- workspace-publish approvals
- AI rejection reasons

## Final warning

Do not declare success because a few users say “this feels smart”.

Smart-feeling systems can still be wrong, unstable, intrusive, or slow. Measure the actual outcomes. Humans are famously unreliable narrators of their own workflows.
