# @lssm/lib.multi-tenancy

Multi-tenancy utilities for secure SaaS applications.

## Features

- **Row-Level Security**: Automatic tenant isolation via Prisma middleware
- **Tenant Provisioning**: Automated tenant setup and database initialization
- **Isolation Validation**: Test utilities to ensure cross-tenant access prevention

## Installation

```bash
npm install @lssm/lib.multi-tenancy
```

## Quick Start

### RLS Middleware

```typescript
import { createRlsMiddleware } from '@lssm/lib.multi-tenancy/rls';
import { prisma } from './db';

prisma.$use(createRlsMiddleware(() => currentTenantId));
```

### Tenant Provisioning

```typescript
import { TenantProvisioningService } from '@lssm/lib.multi-tenancy/provisioning';

const service = new TenantProvisioningService({ db: prisma });
await service.provision({
  id: 'acme',
  name: 'Acme Corp',
  slug: 'acme',
  ownerEmail: 'admin@acme.com',
});
```

## Documentation

Full docs: https://contractspec.chaman.ventures/docs/libraries/multi-tenancy

















