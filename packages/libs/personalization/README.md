# @contractspec/lib.personalization

`@contractspec/lib.personalization` tracks behavior events, summarizes them into actionable insights, and converts those insights into personalization outputs such as overlay suggestions. It also defines the shared preference-dimensions model consumed by runtime layers.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.personalization`

or

`npm install @contractspec/lib.personalization`

## What belongs here

This package currently has two jobs:

- Behavior telemetry and analysis: `tracker`, `store`, `analyzer`, `adapter`, and `types` handle event capture, storage, summarization, and conversion into adaptation hints.
- Shared preference contracts: `preference-dimensions` defines the 7-dimension personalization model and the adapter types used by runtime consumers.

Use this package when you need a thin personalization layer inside ContractSpec. Do not use it as a general analytics platform or as the full overlay runtime.

## Core workflow

```ts
import {
  BehaviorAnalyzer,
  createBehaviorTracker,
  insightsToOverlaySuggestion,
  InMemoryBehaviorStore,
} from "@contractspec/lib.personalization";

const store = new InMemoryBehaviorStore();

const tracker = createBehaviorTracker({
  store,
  context: {
    tenantId: "acme",
    userId: "user-123",
    role: "manager",
    roles: ["manager"],
    permissions: ["billing.order.read"],
    policyDecisions: {
      internalNotes: {
        effect: "deny",
        fields: ["internalNotes"],
        missing: { permissions: ["billing.notes.read"] },
      },
    },
  },
  autoFlushIntervalMs: 5000,
});

tracker.trackFieldAccess({
  operation: "billing.createOrder",
  field: "internalNotes",
});
tracker.trackFieldAccess({
  operation: "billing.createOrder",
  field: "customerReference",
});
tracker.trackFeatureUsage({
  feature: "workflow-editor",
  action: "opened",
});
tracker.trackWorkflowStep({
  workflow: "invoice-approval",
  step: "review",
  status: "entered",
});

await tracker.flush();
await tracker.dispose();

const analyzer = new BehaviorAnalyzer(store, {
  fieldInactivityThreshold: 2,
});

const insights = await analyzer.analyze({
  tenantId: "acme",
  userId: "user-123",
  windowMs: 7 * 24 * 60 * 60 * 1000,
});

const overlay = insightsToOverlaySuggestion(insights, {
  overlayId: "acme-order-form",
  tenantId: "acme",
  capability: "billing.createOrder",
});
```

Typical flow:

1. Record behavior events through `BehaviorTracker`.
2. Persist and summarize those events through a `BehaviorStore`.
3. Analyze the summary with `BehaviorAnalyzer`.
4. Convert insights into an `OverlaySpec` suggestion or workflow adaptation hints.

## API map

### Main runtime APIs

- `BehaviorStore`: persistence boundary for recording, querying, and summarizing `BehaviorEvent` data.
- `InMemoryBehaviorStore`: simple in-memory implementation for tests, demos, and local composition.
- `BehaviorTracker` and `createBehaviorTracker`: buffered event capture with tenant/user context and OpenTelemetry instrumentation.
- `BehaviorAnalyzer`: converts `BehaviorSummary` data into `BehaviorInsights`.
- Authorization context: events may carry `roles`, `permissions`, and policy decision summaries so analyzers can suppress denied fields/actions without granting access.
- `insightsToOverlaySuggestion`: turns analysis output into an overlay-engine `OverlaySpec`.
- `insightsToWorkflowAdaptations`: turns workflow bottlenecks into lightweight adaptation notes.

### Core data contracts

- `BehaviorEvent`: discriminated union with three event kinds: `field_access`, `feature_usage`, and `workflow_step`.
- `BehaviorQuery`: filter shape used by `BehaviorStore.query()` and `BehaviorStore.summarize()`.
- `BehaviorSummary`: aggregated counts returned by store summarization.
- `BehaviorInsights`: analyzer output including hidden-field candidates, bottlenecks, and layout preference hints.
  When authorization decisions are supplied, denied fields/actions are surfaced for suppression and are not promoted in overlay reorder suggestions.
- `BehaviorAnalyzerOptions`: tuning knobs for inactivity threshold and minimum workflow sample size.
- `OverlaySuggestionOptions`: metadata required to build an overlay suggestion.
- `WorkflowAdaptation`: workflow, step, and note triple derived from bottlenecks.

### Preference model contracts

- `PreferenceDimensions`: the shared 7-dimension personalization model.
- `PreferenceScope`: source scope used when a preference value is resolved.
- `ResolvedPreferenceProfile`: canonical resolved preferences plus source attribution and constraint notes.
- `PreferenceResolutionContext`: minimal runtime context required to resolve a preference profile.
- `BundlePreferenceAdapter`: contract for resolving and persisting preference patches in runtime consumers.

## Public entrypoints

The root barrel at `src/index.ts` re-exports public symbols from:

- `adapter`
- `analyzer`
- `preference-dimensions`
- `store`
- `tracker`
- `types`

Published subpaths from `package.json`:

- `.`
- `./adapter`
- `./analyzer`
- `./docs`
- `./docs/behavior-tracking.docblock`
- `./docs/overlay-engine.docblock`
- `./docs/workflow-composition.docblock`
- `./preference-dimensions`
- `./store`
- `./tracker`
- `./types`

For application code, prefer `.` or the focused subpaths above. The `./docs*` subpaths exist for docblock registration and documentation surfaces.

## Operational semantics and gotchas

- `BehaviorTracker` buffers events in memory and flushes when the buffer reaches the configured size or when `autoFlushIntervalMs` is enabled.
- `flush()` persists the current buffer with `BehaviorStore.bulkRecord()`.
- `dispose()` clears the interval timer, then flushes any remaining buffered events.
- Each enqueue also emits OpenTelemetry metrics and tracing through `@opentelemetry/api`.
- `BehaviorAnalyzer` uses deterministic threshold heuristics. It does not do ranking, learning, or probabilistic inference.
- `insightsToOverlaySuggestion()` currently emits only `hideField` and `reorderFields` modifications.
- `layoutPreference` is inferred from field-count thresholds, not from UI render telemetry.
- `PreferenceDimensions` and related types are contracts. Durable persistence and runtime resolution live elsewhere.

## When not to use this package

- Do not use it as a full analytics warehouse or reporting system.
- Do not use it as the durable preference persistence layer.
- Do not use it as the overlay runtime or overlay registry implementation.
- Do not use it when you need workflow composition itself; this package only emits adaptation hints.

## Related packages

- `@contractspec/lib.overlay-engine`: runtime for registering, validating, and applying overlays.
- `@contractspec/lib.surface-runtime`: runtime consumer of preference resolution and adaptive surface behavior.
- `@contractspec/lib.workflow-composer`: workflow extension and composition runtime.
- `@contractspec/lib.contracts-spec`: shared spec and docblock contracts used across ContractSpec.

## Local commands

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
- `bun run build`
