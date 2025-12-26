# @lssm/module.audit-trail

Website: https://contractspec.io/


Audit trail module for tracking and querying system events in ContractSpec applications.

## Purpose

Provides a complete audit logging solution that captures, stores, and queries audit events. Integrates with the event bus to automatically capture domain events and exposes a query API for compliance and debugging.

## Features

- **Event Capture**: Automatic capture of events from the event bus
- **Persistent Storage**: Multiple storage adapters (Prisma, append-only log)
- **Rich Querying**: Filter by actor, target, organization, time range
- **Retention Policies**: Configurable retention and archival
- **Export**: Export audit logs for compliance reporting

## Installation

```bash
bun add @lssm/module.audit-trail
```

## Usage

### Entity Specs (for schema generation)

```typescript
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail/entities';

// Use in schema composition
const config = {
  modules: [auditTrailSchemaContribution],
};
```

### Set Up Audit Capture

```typescript
import { createAuditCapture, PrismaAuditStorage } from '@lssm/module.audit-trail';
import { prisma } from './db';

// Create storage adapter
const storage = new PrismaAuditStorage(prisma);

// Create audit capture (connects to event bus)
const auditCapture = createAuditCapture({
  bus: eventBus,
  storage,
  filters: {
    // Only audit events with audit:true tag or from specific domains
    domains: ['identity', 'billing', 'security'],
  },
});

// Start capturing
auditCapture.start();
```

### Query Audit Logs

```typescript
import { AuditLogService } from '@lssm/module.audit-trail';

const service = new AuditLogService(storage);

// Query by actor
const userActions = await service.query({
  actorId: 'user-123',
  from: new Date('2024-01-01'),
  to: new Date(),
  limit: 100,
});

// Query by target
const resourceChanges = await service.query({
  targetId: 'project-456',
  eventName: 'project.*',
});

// Export for compliance
const report = await service.export({
  orgId: 'org-789',
  from: new Date('2024-01-01'),
  to: new Date('2024-12-31'),
  format: 'csv',
});
```

## Entity Overview

| Entity | Description |
|--------|-------------|
| AuditLog | Main audit log entry |
| AuditLogArchive | Archived logs for retention |

## Retention

Configure retention policies:

```typescript
const retention = new RetentionPolicy({
  // Keep detailed logs for 90 days
  hotRetentionDays: 90,
  // Archive for 7 years (compliance)
  archiveRetentionDays: 2555,
  // Run cleanup daily at 3 AM
  cleanupSchedule: '0 3 * * *',
});
```

