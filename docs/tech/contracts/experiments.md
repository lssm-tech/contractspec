# ExperimentSpec & ExperimentEvaluator

Use experiments to test alternative workflows, data views, or themes with controlled allocations and measurable outcomes.

- Types & registry: `packages/libs/contracts/src/experiments/spec.ts`
- Runtime evaluator: `packages/libs/contracts/src/experiments/evaluator.ts`
- CLI wizard/template: `contractspec create experiment`

## Structure

```ts
export interface ExperimentSpec {
  meta: ExperimentMeta;
  controlVariant: string;
  variants: ExperimentVariant[];
  allocation: AllocationStrategy;
  successMetrics?: SuccessMetric[];
}
```

- `variants`: define UI/behavior overrides (data views, workflows, themes, policies)
- `allocation`:
  - `random`: 50/50 or weighted via `weight`
  - `sticky`: deterministic hash on user/organization/session
  - `targeted`: rule-based (policy + expression + optional percentage)
- `successMetrics`: telemetry events + aggregation (count/avg/p95) to track outcomes

### Example

```ts
export const OnboardingSplitFormExperiment: ExperimentSpec = {
  meta: {
    name: 'sigil.onboarding.split_form',
    version: 1,
    title: 'Split onboarding form',
    description: 'Compare single vs multi-step onboarding',
    domain: 'onboarding',
    owners: ['@team.onboarding'],
    tags: ['experiment'],
    stability: StabilityEnum.Experimental,
  },
  controlVariant: 'control',
  variants: [
    { id: 'control', name: 'Single-step form' },
    {
      id: 'multi_step',
      name: 'Multi-step form',
      overrides: [
        { type: 'workflow', target: 'sigil.onboarding.workflow.multi_step' },
      ],
    },
  ],
  allocation: {
    type: 'targeted',
    rules: [
      {
        variantId: 'multi_step',
        expression: "context.attributes?.segment === 'vip'",
      },
    ],
    fallback: 'random',
  },
  successMetrics: [
    {
      name: 'Completion rate',
      telemetryEvent: { name: 'sigil.telemetry.onboarding_completed', version: 1 },
      aggregation: 'count',
    },
  ],
};
```

## Variant evaluation

```ts
const evaluator = new ExperimentEvaluator({
  registry: experimentRegistry,
  policyChecker: (policyRef, context) =>
    policyEngine.decide({
      action: 'experiment_targeting',
      subject: { roles: context.flags },
      resource: { type: 'experiment', attributes: { name: context.experiment } },
      policies: [policyRef],
    }).effect === 'allow',
});

const assignment = await evaluator.chooseVariant({
  experiment: 'sigil.onboarding.split_form',
  userId: ctx.userId,
  organizationId: ctx.organizationId,
  attributes: ctx.attributes,
});

if (assignment) {
  // Apply overrides for the chosen variant
  applyExperimentOverrides(assignment.variant);
}
```

- `random` uses deterministic hashing (`salt` optional) for stable splits
- `sticky` hashes a specified attribute (userId/orgId/sessionId)
- `targeted` evaluates rules in order; each rule can reference a PolicySpec and simple JS expressions (`context` input)

## Integrations

- **Feature modules**: `FeatureModuleSpec.experiments` references experiments owned by a module
- **DataViewSpec / WorkflowSpec**: `experiments?: ExperimentRef[]` indicate which experiments modify the spec
- **Telemetry**: success metrics reference `TelemetrySpec` events to ensure compliant tracking
- **Policy**: targeting rules call into `PolicyEngine` via the evaluator callback to respect privacy/security

## CLI workflow

```
contractspec create experiment
```

- Prompts for control/variants, allocation strategy, targeting rules, success metrics
- Outputs a typed `ExperimentSpec` file alongside your contracts

## Best practices

1. Keep experiments short-lived; increment `meta.version` when changing allocation or variants.
2. Always declare a control variant and ensure overrides are reversible.
3. Tie success metrics to privacy-reviewed telemetry events.
4. Use targeting rules sparingly; combine with PolicySpec to avoid exposing experiments to unauthorized users.
5. When an experiment wins, promote the variant to the canonical spec and retire the experiment.

