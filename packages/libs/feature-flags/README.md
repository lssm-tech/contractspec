# @lssm/lib.feature-flags

Feature flags and experiments module for ContractSpec applications.

## Overview

This module provides a reusable feature flag and experimentation system that can be used across all ContractSpec applications. It supports:

- **Feature Flags**: Toggle features on/off with targeting rules
- **Gradual Rollouts**: Roll out features to a percentage of users
- **Targeting Rules**: Target by org, user, plan, segment, or custom attributes
- **Experiments**: A/B testing with variants and metrics tracking
- **Evaluation Logging**: Track flag evaluations for analytics

## Entities

### FeatureFlag

Core feature flag definition.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| key | string | Flag key (e.g., `new_dashboard`) |
| name | string | Human-readable name |
| description | string | Description of the flag |
| status | enum | `off`, `on`, `gradual` |
| defaultValue | boolean/string | Default value when no rules match |
| variants | json | Variant definitions for multivariate flags |
| orgId | string | Organization scope (optional) |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### FlagTargetingRule

Targeting rules for conditional flag evaluation.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| flagId | string | Parent flag |
| priority | int | Rule priority (lower = higher priority) |
| attribute | string | Target attribute (org, user, plan, etc.) |
| operator | enum | `eq`, `neq`, `in`, `nin`, `contains`, `percentage` |
| value | json | Target value(s) |
| rolloutPercentage | int | Percentage for gradual rollout |
| variant | string | Variant to serve (for multivariate) |

### Experiment

A/B test configuration.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| key | string | Experiment key |
| name | string | Human-readable name |
| flagId | string | Associated feature flag |
| status | enum | `draft`, `running`, `paused`, `completed` |
| variants | json | Variant definitions with split ratios |
| metrics | json | Metrics to track |
| startedAt | datetime | Experiment start time |
| endedAt | datetime | Experiment end time |

### FlagEvaluation

Evaluation log for debugging and analytics.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| flagKey | string | Evaluated flag key |
| subjectType | string | Subject type (user, org) |
| subjectId | string | Subject identifier |
| result | json | Evaluation result |
| matchedRuleId | string | Rule that matched (if any) |
| evaluatedAt | datetime | Evaluation timestamp |

## Contracts

### Commands

- `flag.create` - Create a new feature flag
- `flag.update` - Update flag configuration
- `flag.delete` - Delete a feature flag
- `flag.toggle` - Toggle flag status
- `rule.create` - Add targeting rule
- `rule.delete` - Remove targeting rule
- `experiment.create` - Create an experiment
- `experiment.start` - Start an experiment
- `experiment.stop` - Stop an experiment

### Queries

- `flag.get` - Get flag by key
- `flag.list` - List all flags
- `flag.evaluate` - Evaluate flag for a subject
- `experiment.get` - Get experiment details
- `experiment.results` - Get experiment results

## Events

- `flag.created` - Flag was created
- `flag.updated` - Flag configuration changed
- `flag.deleted` - Flag was deleted
- `flag.toggled` - Flag status changed
- `experiment.started` - Experiment started
- `experiment.stopped` - Experiment stopped
- `flag.evaluated` - Flag was evaluated (for analytics)

## Usage

```typescript
import { 
  FeatureFlagEntity, 
  EvaluateFlagContract,
  FlagEvaluator 
} from '@lssm/lib.feature-flags';

// Create an evaluator
const evaluator = new FlagEvaluator(flagRepository);

// Evaluate a flag
const result = await evaluator.evaluate('new_dashboard', {
  userId: 'user-123',
  orgId: 'org-456',
  plan: 'pro',
});

if (result.enabled) {
  // Show new dashboard
}
```

## Integration

This module integrates with:

- `@lssm/lib.identity-rbac` - User/org context for targeting
- `@lssm/lib.analytics` - Evaluation tracking
- `@lssm/module.audit-trail` - Configuration changes

## Schema Contribution

```typescript
import { featureFlagsSchemaContribution } from '@lssm/lib.feature-flags';

export const schemaComposition = {
  modules: [
    featureFlagsSchemaContribution,
    // ... other modules
  ],
};
```






