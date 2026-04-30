# @contractspec/lib.personalization

`@contractspec/lib.personalization` tracks behavior events, summarizes them into actionable insights, and converts those insights into transparent personalization outputs such as overlay suggestions, preference recommendations, and runtime adaptive-experience decisions. It also defines the shared preference-dimensions model consumed by runtime layers.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.personalization`

or

`npm install @contractspec/lib.personalization`

## What belongs here

This package currently has three jobs:

- Behavior telemetry and analysis: `tracker`, `store`, `analyzer`, `adapter`, and `types` handle event capture, storage, summarization, and conversion into adaptation hints.
- Shared adaptive contracts: `preference-dimensions`, behavior support, behavior signals, and runtime resolution define the generic adaptive-experience model consumed by runtime layers.
- Practical adoption: curated presets, onboarding recommendation, and safe evolution suggestions help applications offer a better starting point without creating rigid personas.

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

## DataView preferences

Use the data-view preference helpers when a collection `DataViewSpec` should
honor preferred list/grid/table mode, density, or data depth without coupling
the design-system renderer to personalization:

```tsx
import { DataViewRenderer } from "@contractspec/lib.design-system";
import { resolveDataViewPreferences } from "@contractspec/lib.personalization/data-view-preferences";

const resolved = resolveDataViewPreferences({
  spec: AccountsDataView,
  preferences: profile.canonical,
  insights,
  record: savedDataViewPreference,
});

<DataViewRenderer
  spec={AccountsDataView}
  items={rows}
  defaultViewMode={resolved.viewMode}
  defaultDensity={resolved.density}
  defaultDataDepth={resolved.dataDepth}
/>;
```

The helper returns plain data and never imports React or the design-system
package. Stored data-view preference records win over behavior insights,
preference dimensions, and authored contract defaults. Disallowed inferred view
modes are ignored so the renderer only receives modes allowed by the spec.

Record renderer interactions with the behavior tracker so later analysis can
derive scoped preferred modes:

```ts
tracker.trackDataViewInteraction({
  dataViewKey: AccountsDataView.meta.key,
  dataViewVersion: AccountsDataView.meta.version,
  action: "view_mode_changed",
  viewMode: "grid",
});

tracker.trackDataViewInteraction({
  dataViewKey: AccountsDataView.meta.key,
  action: "data_depth_changed",
  dataDepth: "detailed",
});
```

Agent prompt for a DataView preference integration:

```md
Add DataView personalization for <screen>.

- Resolve viewMode, density, dataDepth, and pageSize with resolveDataViewPreferences.
- Apply resolved values to DataViewRenderer as default or controlled props.
- Track opened, view_mode_changed, density_changed, data_depth_changed, search_changed, filter_changed, sort_changed, and page_changed actions with trackDataViewInteraction.
- Persist only the dimensions enabled by view.collection.personalization.persist.
- Ignore behavior-derived modes not allowed by view.collection.viewModes.allowedModes.
- Keep @contractspec/lib.personalization free of React and design-system imports.
```

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

- `BehaviorEvent`: discriminated union with four event kinds: `field_access`, `feature_usage`, `workflow_step`, and `data_view_interaction`.
- `BehaviorQuery`: filter shape used by `BehaviorStore.query()` and `BehaviorStore.summarize()`.
- `BehaviorSummary`: aggregated counts returned by store summarization.
- `BehaviorInsights`: analyzer output including hidden-field candidates, bottlenecks, and layout preference hints.
  When authorization decisions are supplied, denied fields/actions are surfaced for suppression and are not promoted in overlay reorder suggestions.
- `BehaviorAnalyzerOptions`: tuning knobs for inactivity threshold and minimum workflow sample size.
- `OverlaySuggestionOptions`: metadata required to build an overlay suggestion.
- `WorkflowAdaptation`: workflow, step, and note triple derived from bottlenecks.
- DataView preference helpers: `resolveDataViewPreferences`, `DataViewPreferenceRecord`, `DataViewPreferencePatch`, and mapping helpers for density and view-mode patches.

### Preference model contracts

- `PreferenceDimensions`: the shared 7-dimension personalization model.
- `BehaviorSupportDimensions`: the support-strategy model for helping users act, recover, and review progress.
- `BehaviorSignalModel`: scoped behavior evidence used to explain adaptation suggestions without profiling users.
- `ResolvedAdaptiveExperience`: runtime-only result describing what the application should do now.
- Preset helpers: `PREFERENCE_DIMENSION_PRESETS`, `PREFERENCE_PRESET_DEFINITIONS`, `getPreferencePresetDimensions`, and `createPreferencePresetCatalog`.
- Behavior support preset helpers: `BEHAVIOR_SUPPORT_PRESETS`, `BEHAVIOR_SUPPORT_PRESET_DEFINITIONS`, and `getBehaviorSupportPresetDimensions`.
- Onboarding helpers: `recommendPreferencePreset`, `recommendBehaviorSupportPreset`, `recommendAdaptiveExperience`, and related recommendation types.
- Evolution helpers: `suggestPreferenceEvolution`, `suggestAdaptiveExperienceEvolution`, and related suggestion types.
- `PreferenceScope`: source scope used when a preference value is resolved.
- `ResolvedPreferenceProfile`: canonical resolved preferences plus source attribution and constraint notes.
- `PreferenceResolutionContext`: minimal runtime context required to resolve a preference profile.
- `BundlePreferenceAdapter`: contract for resolving and persisting preference patches in runtime consumers.

## Adaptive experience toolkit

Use ContractSpec personalization to give builders a transparent adaptation layer. The package separates how software presents itself from how the system supports user action:

- `PreferenceDimensions` decide how the software adapts as a tool.
- `BehaviorSupportDimensions` decide how the system supports human action.
- `BehaviorSignalModel` records what evidence is strong enough to suggest a change.
- `ResolvedAdaptiveExperience` describes what should happen now, at runtime.

This is not a profiling engine, user-personality classifier, behavioral manipulation toolkit, analytics platform, or authorization system. It is a small set of contracts for saying: "The system noticed this scoped pattern and can adjust the experience in a way the user can inspect and override."

### Interaction preferences

`PreferenceDimensions` describes how a person wants to experience an application across seven independent dimensions:

- `guidance`: how much help the interface offers.
- `density`: how much information appears at once.
- `dataDepth`: whether the app starts from summaries, details, or exhaustive evidence.
- `control`: how much configuration and direct manipulation is exposed.
- `media`: whether the experience prefers text, visuals, voice, or a hybrid.
- `pace`: whether interactions should feel deliberate, balanced, or rapid.
- `narrative`: whether content starts top-down, bottom-up, or adapts by context.

These dimensions are software interaction preferences, not behavior labels and not permissions. `control: "full"` never grants access to features a user is not authorized to use.

### Behavior support dimensions

`BehaviorSupportDimensions` describes how the system supports action, momentum, recovery, and decision-making:

- `attention`: how the system helps the user notice what matters next.
- `activation`: how the system helps the user start.
- `actionScale`: how large the next useful action should be.
- `rhythm`: how work fits time, energy, urgency, or changing context.
- `environment`: what surrounding structure makes action easier.
- `challenge`: how much stretch or pressure is appropriate.
- `meaningFrame`: what makes the action feel worthwhile.
- `permission`: what helps the user begin, reduce, pause, or renegotiate.
- `selfAuthority`: how the system supports confidence, composure, structure, and follow-through.
- `accountability`: how much external structure or review the user wants.
- `recovery`: what should happen after skipped actions, misses, contradictions, or failed attempts.
- `reflection`: how much learning or review should happen after action.

This layer is support strategy, not identity. Use language such as "start support", "smaller first step", "repair first", "private review", or "brief reflection". Avoid moral, clinical, or manipulative labels such as "lazy", "avoidant", "low motivation", "approval-seeking", "low-value user", or "manipulable user".

### Presets are starting points

The package exports a small interaction preset catalog that application builders can ship directly:

- `balanced`: safe default for general use.
- `guideMe`: slower, guided onboarding for new or uncertain users.
- `summaryFirst`: compact, fast, dashboard-style usage.
- `deepAnalyst`: data-rich, evidence-first investigation mode.
- `builder`: fast, configurable mode for creating and adjusting workflows.
- `opsWarRoom`: dense, visual, rapid mode for live operational surfaces.
- `auditReview`: deliberate, traceable, detail-heavy review mode.
- `minimalFocus`: low-noise, focused, simple experience.

Presets are not identities. Use labels such as "Summary-first" or "Minimal focus", not labels such as "manager mode" or "junior user".

```ts
import {
  getPreferencePresetDimensions,
  PREFERENCE_PRESET_DEFINITIONS,
} from "@contractspec/lib.personalization";

const startingPreferences = getPreferencePresetDimensions("summaryFirst");
const presetIntent = PREFERENCE_PRESET_DEFINITIONS.summaryFirst.intent;
```

Override or extend the catalog by merging your own named bundles of `PreferenceDimensions`:

```ts
import {
  createPreferencePresetCatalog,
  PREFERENCE_PRESET_DEFINITIONS,
} from "@contractspec/lib.personalization";

const catalog = createPreferencePresetCatalog({
  calmReview: {
    id: "calmReview",
    label: "Calm review",
    intent: "A slower review flow with fewer visual interruptions.",
    dimensions: {
      ...PREFERENCE_PRESET_DEFINITIONS.auditReview.dimensions,
      media: "text",
      pace: "deliberate",
    },
  },
});
```

Behavior support presets are also editable starting points, not user types:

- `steadyMomentum`: consistent progress with moderate support.
- `activationFirst`: reduce start friction and help users begin.
- `permissionFirst`: make smaller starts, pauses, or renegotiation easy.
- `deepWorkBuilder`: protect focus, mastery, and intentional work.
- `recoveryFirst`: help users resume after misses or interruptions.
- `identityBuilder`: connect action to user-defined values or commitments.
- `selfAuthorityBuilder`: build confidence, composure, structure, and follow-through.
- `socialMomentum`: support shared rhythm or review when explicitly wanted.
- `deadlineSprint`: support short-term urgency and focused execution.
- `minimalNudge`: keep support low-noise with minimal intervention.

Good UI wording: "Suggested support style: Recovery-first." Bad UI wording: "You are a recovery-first user."

### Onboarding recommendation

Recommend first settings from intent and product questions, not role stereotypes. Ask simple questions such as:

- What kind of guidance do you prefer?
- Do you prefer summaries or details?
- Do you prefer simple controls or advanced controls?
- What helps you start?
- What action size feels easiest to trust?
- What should happen when something is missed?
- Do you want private progress, self-review, or shared review?
- What makes progress meaningful?

```ts
import {
  getPreferencePresetDimensions,
  getBehaviorSupportPresetDimensions,
  recommendAdaptiveExperience,
} from "@contractspec/lib.personalization";

const recommendation = recommendAdaptiveExperience({
  interaction: {
    primaryIntent: "reviewing",
    detailPreference: "evidence",
    controlPreference: "advanced",
    role: "Manager", // recorded for context, not used for scoring
  },
  behaviorSupport: {
    startSupport: "guided",
    actionSize: "small",
    recoveryPreference: "repair",
  },
});

const preferences = getPreferencePresetDimensions(
  recommendation.selectedInteractionPreset
);
const behaviorSupport = getBehaviorSupportPresetDimensions(
  recommendation.selectedBehaviorSupportPreset
);

console.log(recommendation.reasons);
console.log(recommendation.alternativeInteractionPresets);
console.log(recommendation.alternativeBehaviorSupportPresets);
```

The recommendation returns selected interaction and behavior support presets, confidence, human-readable reasons, alternatives, and editable dimension lists. Role text may be recorded as context, but it does not score presets because a job title should not decide the experience.

### Behavior signals are evidence

`BehaviorSignalModel` records observations that may support an adaptation. A signal is not a conclusion about the user.

Safe examples:

- user repeatedly switches one table to a more detailed view
- user completes smaller actions more often than large ones
- user skips long reflections but completes short ones
- user dismisses social/accountability prompts
- user uses advanced controls often
- user repeatedly chooses repair over reset

Unsafe interpretations:

- user is lazy
- user lacks discipline
- user wants to be controlled
- user is unreliable
- user has a psychological condition
- user is low-performing

```ts
import { createBehaviorSignalModel } from "@contractspec/lib.personalization";

const signal = createBehaviorSignalModel({
  id: "brief-reflection-pattern",
  kind: "repeated_pattern",
  summary: "User completes brief reflections more often than long reflections.",
  evidence: {
    repeatedPattern: "Brief reflections completed in three sessions.",
    timeWindow: { start: "2026-04-01T00:00:00Z" },
    scope: { level: "workflow", id: "review" },
    confidence: "high",
    source: "system-observation",
    userFeedback: "not-asked",
    safetyLevel: "safe",
    observations: [
      "Completed brief reflection in session 1.",
      "Completed brief reflection in session 2.",
      "Completed brief reflection in session 3.",
    ],
    suggestedAdaptation: {
      id: "brief-reflection-default",
      label: "Use brief reflection",
      description: "Use brief reflection by default for this workflow.",
      target: "behaviorSupport",
      dimension: "reflection",
      value: "brief",
      scope: { level: "workflow", id: "review" },
      impact: "low",
    },
  },
});
```

The helper rejects common unsafe labels so tests and logs stay observation-oriented.

### Runtime resolution

`ResolvedAdaptiveExperience` combines preferences, behavior support, signals, current context, surface, intent, product constraints, permissions, policies, and explicit overrides. It answers: "What should the application do now?"

```ts
import {
  resolveAdaptiveExperience,
  PREFERENCE_DIMENSION_PRESETS,
  BEHAVIOR_SUPPORT_PRESETS,
} from "@contractspec/lib.personalization";

const resolved = resolveAdaptiveExperience({
  preferences: PREFERENCE_DIMENSION_PRESETS.balanced,
  behaviorSupport: BEHAVIOR_SUPPORT_PRESETS.steadyMomentum,
  behaviorSignals: [signal],
  context: { workflowId: "review" },
  permissions: [
    {
      key: "advanced-controls",
      allowed: false,
      reason: "Advanced controls are not permitted.",
    },
  ],
});
```

The resolved result is `runtime-only`. Do not persist it as a hidden user profile. Persist explicit choices, accepted suggestions, or scoped preference records instead.

### Preference evolution

Evolution suggestions are deterministic and explainable. They do not mutate preferences by themselves.

Start with surface-level suggestions, then promote to workflow, workspace, or user scope only when behavior is consistent across multiple sessions and surfaces. Explicit user choices beat inferred behavior. Changes that affect `control`, `dataDepth`, `challenge`, `accountability`, or social exposure require confirmation because they can change perceived power, data exposure, pressure, or visibility.

```ts
import { suggestAdaptiveExperienceEvolution } from "@contractspec/lib.personalization";

const result = suggestAdaptiveExperienceEvolution({
  currentPreferences: preferences,
  currentBehaviorSupport: behaviorSupport,
  preferenceObservations: [
    {
      dimension: "density",
      value: "detailed",
      signal: "setting_changed",
      surfaceId: "orders",
      sessionId: "s1",
      reason: "Changed orders density to detailed.",
    },
    {
      dimension: "density",
      value: "detailed",
      signal: "setting_changed",
      surfaceId: "orders",
      sessionId: "s2",
    },
    {
      dimension: "density",
      value: "detailed",
      signal: "setting_changed",
      surfaceId: "orders",
      sessionId: "s3",
    },
  ],
  behaviorSignals: [signal],
});

console.log(result.preferenceSuggestions);
console.log(result.behaviorSupportSuggestions);
```

Recommended UI wording:

- "You often switch this table to detailed mode. Remember detailed mode here?"
- "You complete more actions when they start small. Use smaller first steps for this workflow?"
- "You often choose repair instead of reset. Suggest repair first after missed actions?"
- "You often skip long reflections. Use brief reflection by default?"
- "You regularly dismiss shared review prompts. Keep accountability private by default?"

Avoid wording that implies an identity profile or hidden optimization.

### Scope and examples

Adapt narrowly first. If a user repeatedly changes one table to detailed mode, do not make every product screen detailed. If a user repeatedly asks for smaller actions in one workflow, do not shrink every task globally. Promote from surface to workflow, workspace, or user scope only with stronger evidence and confirmation.

Generic integration examples:

- Adaptive dashboard: compact UI with detailed mode remembered for one table after repeated explicit switches.
- Guided onboarding: walkthrough interaction preset with activation-first support for the first setup flow.
- Review workflow: detailed audit mode with brief reflection and neutral recovery language.
- Focus workflow: minimal UI with protected focus blocks and self-review.
- Recovery after skipped action: suggest repair first, not shame or reset by default.
- Compact expert mode with gentle support: advanced controls stay visible, but first actions remain small and reversible.
- Detailed audit mode with minimal nudging: exhaustive data remains available while behavior support stays private and low-noise.

### Safety boundaries

- Preferences do not grant authorization.
- Behavior support does not replace business rules or permissions.
- Behavior observations are evidence, not psychological explanations.
- Resolved adaptive experiences are runtime outputs, not stored identities.
- No black-box machine learning is used.
- High-impact changes require confirmation.
- Suggestions are reversible and scoped.
- Applications should log or display what changed, why it changed, what evidence supported it, whether it was automatic or suggested, and how to undo or disable adaptation.
- Adaptation should never silently increase pressure, accountability, challenge, or social exposure.

## Public entrypoints

The root barrel at `src/index.ts` re-exports public symbols from:

- `adapter`
- `adaptive-evolution`
- `adaptive-experience`
- `adaptive-onboarding`
- `analyzer`
- `behavior-signals`
- `behavior-support`
- `data-view-preferences`
- `preference-dimensions`
- `preference-evolution`
- `preference-evolution-types`
- `preference-onboarding`
- `preference-presets`
- `store`
- `tracker`
- `types`

Published subpaths from `package.json`:

- `.`
- `./adapter`
- `./adaptive-evolution`
- `./adaptive-experience`
- `./adaptive-onboarding`
- `./adaptive-onboarding-scores`
- `./analyzer`
- `./behavior-signals`
- `./behavior-support`
- `./behavior-support-preset-definitions`
- `./behavior-support-presets`
- `./data-view-preferences`
- `./docs`
- `./docs/behavior-tracking.docblock`
- `./docs/overlay-engine.docblock`
- `./docs/workflow-composition.docblock`
- `./personalization.feature`
- `./preference-dimensions`
- `./preference-evolution`
- `./preference-evolution-types`
- `./preference-onboarding`
- `./preference-presets`
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
- `layoutPreference` is still inferred from field-count thresholds. Data-view-specific preferred modes are derived from `data_view_interaction` events when those events include a valid collection `viewMode`.
- `PreferenceDimensions` and related types are contracts. Durable persistence and runtime resolution live elsewhere.
- Preset recommendation and preference evolution helpers are deterministic utilities. They return explainable data for applications to display, log, confirm, or ignore.

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
