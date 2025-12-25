# @lssm/lib.metering

Website: https://contractspec.lssm.tech/


Usage metering and billing core module for ContractSpec applications.

## Overview

This module provides a reusable metering system that can be used to track usage-based metrics across all ContractSpec applications. It supports:

- **Metric Definitions**: Define what metrics to track
- **Usage Recording**: Record usage events
- **Aggregation**: Roll up usage into summaries
- **Thresholds & Alerts**: Monitor usage against limits
- **Billing Integration**: Connect usage to billing/plans

## Entities

### MetricDefinition

Defines a trackable metric.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| key | string | Metric key (e.g., `api_calls`, `storage_gb`) |
| name | string | Human-readable name |
| description | string | Metric description |
| unit | string | Unit of measurement |
| aggregationType | enum | How to aggregate (count, sum, avg, max, min) |
| resetPeriod | enum | When to reset (never, hourly, daily, monthly) |
| orgId | string | Organization scope (null = global) |

### UsageRecord

Individual usage event.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| metricKey | string | Metric being recorded |
| subjectType | string | Subject type (org, user, project) |
| subjectId | string | Subject identifier |
| quantity | decimal | Usage quantity |
| timestamp | datetime | When usage occurred |
| metadata | json | Additional context |

### UsageSummary

Pre-aggregated usage summary.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| metricKey | string | Metric key |
| subjectType | string | Subject type |
| subjectId | string | Subject identifier |
| periodType | enum | Period type (hourly, daily, monthly) |
| periodStart | datetime | Period start time |
| periodEnd | datetime | Period end time |
| totalQuantity | decimal | Aggregated quantity |
| recordCount | int | Number of records aggregated |

### UsageThreshold

Threshold configuration for alerts.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| metricKey | string | Metric to monitor |
| subjectType | string | Subject type |
| subjectId | string | Subject identifier |
| threshold | decimal | Threshold value |
| action | enum | Action when exceeded (alert, block, none) |
| notifyEmails | json | Email addresses to notify |

## Contracts

### Commands

- `metric.define` - Define a new metric
- `metric.update` - Update metric definition
- `metric.delete` - Delete a metric
- `usage.record` - Record a usage event
- `usage.recordBatch` - Record multiple usage events
- `threshold.create` - Create a usage threshold
- `threshold.update` - Update a threshold
- `threshold.delete` - Delete a threshold

### Queries

- `metric.get` - Get metric definition
- `metric.list` - List all metrics
- `usage.get` - Get usage for a subject
- `usage.getSummary` - Get aggregated usage summary
- `usage.export` - Export usage data
- `threshold.list` - List thresholds

## Events

- `metric.defined` - Metric was defined
- `usage.recorded` - Usage was recorded
- `usage.aggregated` - Usage was aggregated into summary
- `threshold.exceeded` - Usage exceeded a threshold
- `threshold.approaching` - Usage approaching threshold (80%)

## Usage

```typescript
import { 
  MetricDefinitionEntity,
  RecordUsageContract,
  UsageAggregator 
} from '@lssm/lib.metering';

// Define a metric
await meteringService.defineMetric({
  key: 'api_calls',
  name: 'API Calls',
  unit: 'calls',
  aggregationType: 'COUNT',
  resetPeriod: 'MONTHLY',
});

// Record usage
await meteringService.recordUsage({
  metricKey: 'api_calls',
  subjectType: 'org',
  subjectId: 'org-123',
  quantity: 1,
});

// Get usage summary
const summary = await meteringService.getUsageSummary({
  metricKey: 'api_calls',
  subjectType: 'org',
  subjectId: 'org-123',
  periodType: 'MONTHLY',
  periodStart: new Date('2024-01-01'),
});
```

## Aggregation

The module includes an aggregation engine that periodically rolls up usage records:

```typescript
import { UsageAggregator } from '@lssm/lib.metering/aggregation';

const aggregator = new UsageAggregator({
  storage: usageStorage,
});

// Run hourly aggregation
await aggregator.aggregate({
  periodType: 'HOURLY',
  periodStart: new Date(),
});
```

## Integration

This module integrates with:

- `@lssm/lib.jobs` - Scheduled aggregation jobs
- `@lssm/module.notifications` - Threshold alerts
- `@lssm/lib.identity-rbac` - Subject resolution

## Schema Contribution

```typescript
import { meteringSchemaContribution } from '@lssm/lib.metering';

export const schemaComposition = {
  modules: [
    meteringSchemaContribution,
    // ... other modules
  ],
};
```
















