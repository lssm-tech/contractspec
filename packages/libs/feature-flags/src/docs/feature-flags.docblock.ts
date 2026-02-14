import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const featureFlagsDocBlocks: DocBlock[] = [
  {
    id: 'docs.feature-flags.overview',
    title: 'Feature Flags & Experiments',
    summary:
      'Reusable, spec-first feature flag and experiment module with targeting, gradual rollout, multivariate variants, and evaluation logging.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/feature-flags/overview',
    tags: ['feature-flags', 'experiments', 'progressive-delivery'],
    body: `## What this module provides

- **Entities**: FeatureFlag, FlagTargetingRule, Experiment, ExperimentAssignment, FlagEvaluation.
- **Contracts**: create/update/delete/toggle/list/get flags; create/delete rules; evaluate flags; create/start/stop/get experiments.
- **Events**: flag.created/updated/deleted/toggled, rule.created/deleted, experiment.created/started/stopped, flag.evaluated, experiment.variant_assigned.
- **Evaluation Engine**: Deterministic evaluator with gradual rollout, rule priority, audience filters, and experiment bucketing.

## How to use

1) Compose schema
 - Add \`featureFlagsSchemaContribution\` to your module composition.

2) Register contracts/events
 - Import exports from \`@contractspec/lib.feature-flags\` into your spec registry.

3) Evaluate at runtime
 - Instantiate \`FlagEvaluator\` with a repository implementation and optional logger.
 - Evaluate with context attributes (userId, orgId, plan, segment, sessionId, attributes).

4) Wire observability
 - Emit audit trail on config changes; emit \`flag.evaluated\` for analytics.

## Usage example

${'```'}ts
import {
  FlagEvaluator,
  InMemoryFlagRepository,
} from '@contractspec/lib.feature-flags';

const repo = new InMemoryFlagRepository();
repo.addFlag({
  id: 'flag-1',
  key: 'new_dashboard',
  status: 'GRADUAL',
  defaultValue: false,
});

const evaluator = new FlagEvaluator({ repository: repo });
const result = await evaluator.evaluate('new_dashboard', {
  userId: 'user-123',
  orgId: 'org-456',
  plan: 'pro',
});

if (result.enabled) {
  // serve the new dashboard
}
${'```'},

## Guardrails

- Keep flag keys stable and human-readable; avoid PII in context.
- Ensure experiments’ variant percentages sum to 100; default flag status to OFF.
- Use org-scoped flags for multi-tenant isolation.
- Log evaluations only when needed to control volume; prefer sampling for noisy paths.
`,
  },
];

registerDocBlocks(featureFlagsDocBlocks);
