# @contractspec/lib.database-studio

Prisma database client and schema for ContractSpec Studio.

## Overview

This library provides:
- Prisma client for Studio database operations
- Database schema and migrations
- Type-safe model exports
- Enum definitions

## Installation

```bash
bun add @contractspec/lib.database-studio
```

## Exports

- `./client` — Configured Prisma client
- `./enums` — Database enum types
- `./models` — Model type definitions

## Usage

```typescript
import { prisma } from '@contractspec/lib.database-studio/client';
import { ProjectStatus, LifecycleStage } from '@contractspec/lib.database-studio/enums';

const project = await prisma.project.findUnique({
  where: { id: 'project-id' }
});
```

## Database Commands

```bash
# Generate Prisma client
bun db:generate

# Run migrations
bun db:migrate

# Deploy migrations (production)
bun db:deploy

# Push schema changes (development)
bun db:push

# Reset database
bun db:reset
```

## Schema

The schema includes models for:
- `User`, `Session`, `Account` — Authentication
- `Organization`, `Team`, `TeamMember` — Multi-tenancy
- `Project`, `Spec`, `Canvas`, `CanvasVersion` — Core entities
- `Integration`, `Credential` — Third-party integrations
- `Deployment` — Deployment management
- `LearningEvent`, `OnboardingProgress` — Learning journey

## Related Packages

- [`@contractspec/bundle.studio`](../../bundles/studio/README.md) — Business logic
- [`@contractspec/lib.contracts-studio`](../contracts-studio/README.md) — Contracts
- [`@contractspec/app.api-studio`](../../apps/api-studio/README.md) — API server
