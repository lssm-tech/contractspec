# Phase 1: API Reference Index

Quick reference for all new Phase 1 APIs.

---

## @lssm/lib.multi-tenancy

### RLS
```typescript
import { createRlsMiddleware, type TenantIdProvider } from '@lssm/lib.multi-tenancy/rls';
```

### Provisioning
```typescript
import { 
  TenantProvisioningService,
  type CreateTenantInput,
  type TenantProvisioningConfig 
} from '@lssm/lib.multi-tenancy/provisioning';
```

### Isolation
```typescript
import { IsolationValidator } from '@lssm/lib.multi-tenancy/isolation';
```

---

## @lssm/lib.observability

### Tracing
```typescript
import { 
  getTracer,
  traceAsync,
  traceSync,
  createTracingMiddleware 
} from '@lssm/lib.observability/tracing';
```

### Metrics
```typescript
import {
  getMeter,
  createCounter,
  createUpDownCounter,
  createHistogram,
  standardMetrics
} from '@lssm/lib.observability/metrics';
```

### Logging
```typescript
import {
  Logger,
  logger,
  type LogLevel,
  type LogEntry
} from '@lssm/lib.observability/logging';
```

---

## @lssm/lib.resilience

### Circuit Breaker
```typescript
import {
  CircuitBreaker,
  type CircuitState,
  type CircuitBreakerConfig
} from '@lssm/lib.resilience/circuit-breaker';
```

### Retry
```typescript
import { retry } from '@lssm/lib.resilience/retry';
```

### Timeout
```typescript
import { timeout } from '@lssm/lib.resilience/timeout';
```

### Fallback
```typescript
import { fallback } from '@lssm/lib.resilience/fallback';
```

---

## Enhanced: @lssm/lib.contracts

### DataViews
```typescript
import { DataViewQueryGenerator } from '@lssm/lib.contracts/data-views/query-generator';
import { DataViewRuntime } from '@lssm/lib.contracts/data-views/runtime';
```

### Workflows
```typescript
import { SLAMonitor, type SLABreachEvent } from '@lssm/lib.contracts/workflow/sla-monitor';
import { PrismaStateStore } from '@lssm/lib.contracts/workflow/adapters/db-adapter';
```

---

## Enhanced: @lssm/lib.design-system

### DataView Components
```typescript
import { DataViewRenderer } from '@lssm/lib.design-system/components/data-view/DataViewRenderer';
// Also available: DataViewList, DataViewTable, DataViewDetail
```

---

## Usage Examples

### Complete Workflow with All Features

```typescript
import { WorkflowRunner } from '@lssm/lib.contracts/workflow/runner';
import { PrismaStateStore } from '@lssm/lib.contracts/workflow/adapters/db-adapter';
import { SLAMonitor } from '@lssm/lib.contracts/workflow/sla-monitor';
import { CircuitBreaker } from '@lssm/lib.resilience/circuit-breaker';
import { traceAsync } from '@lssm/lib.observability/tracing';

const runner = new WorkflowRunner({
  registry,
  stateStore: new PrismaStateStore(db),
  opExecutor: async (op, input, ctx) => {
    return traceAsync(`op.${op.name}`, async (span) => {
      span.setAttribute('operation', op.name);
      const breaker = getCircuitBreaker(op.name);
      return breaker.execute(() => executeOperation(op, input, ctx));
    });
  },
  eventEmitter: (event, payload) => {
    if (event.startsWith('workflow.')) {
      logger.info(event, payload);
    }
  },
});

const monitor = new SLAMonitor((event, payload) => {
  logger.warn('SLA_BREACH', payload);
  alertOps(payload);
});

// Start workflow
const workflowId = await runner.start('payment.flow', 1);

// Monitor SLA
const state = await runner.getState(workflowId);
const spec = registry.get('payment.flow', 1);
monitor.check(state, spec!);
```

### Complete DataView with Observability

```typescript
import { DataViewRenderer } from '@lssm/lib.design-system';
import { DataViewQueryGenerator } from '@lssm/lib.contracts/data-views/query-generator';
import { traceAsync } from '@lssm/lib.observability/tracing';
import { MyDataView } from './specs/users.data-view';

export function UserListPage() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    return traceAsync('load_users', async (span) => {
      const generator = new DataViewQueryGenerator(MyDataView);
      const query = generator.generate({ pagination: { page, pageSize: 20 } });
      
      span.setAttribute('page', page);
      const result = await api.execute(query);
      setUsers(result.data);
    });
  };

  return (
    <DataViewRenderer
      spec={MyDataView}
      items={users}
      pagination={{ page, pageSize: 20, total: users.length }}
      onPageChange={setPage}
    />
  );
}
```

### Complete Multi-Tenant Setup

```typescript
// 1. RLS Middleware
import { createRlsMiddleware } from '@lssm/lib.multi-tenancy/rls';
db.$use(createRlsMiddleware(() => req.tenantId));

// 2. Tenant Provisioning
import { TenantProvisioningService } from '@lssm/lib.multi-tenancy/provisioning';
const service = new TenantProvisioningService({ db });

// 3. Create new tenant
await service.provision({
  id: 'acme',
  name: 'Acme Corp',
  slug: 'acme',
  ownerEmail: 'admin@acme.com',
});

// 4. Validate isolation in tests
import { IsolationValidator } from '@lssm/lib.multi-tenancy/isolation';

test('queries are isolated', () => {
  const isValid = IsolationValidator.validateQuery(
    'User',
    'findMany',
    { where: { tenantId: 'acme' } },
    'acme'
  );
  expect(isValid).toBe(true);
});
```

---

## Testing

### Test Circuit Breakers

```typescript
import { CircuitBreaker } from '@lssm/lib.resilience/circuit-breaker';

test('circuit opens after threshold', async () => {
  const breaker = new CircuitBreaker({
    failureThreshold: 3,
    resetTimeoutMs: 5000,
  });

  // Trigger failures
  for (let i = 0; i < 3; i++) {
    await expect(
      breaker.execute(() => Promise.reject('error'))
    ).rejects.toThrow();
  }

  // Circuit should be open
  await expect(
    breaker.execute(() => Promise.resolve('ok'))
  ).rejects.toThrow('CircuitBreaker is OPEN');
});
```

### Test Workflow Retry

```typescript
test('workflow retries on failure', async () => {
  let attempts = 0;
  const opExecutor = async () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };

  const runner = new WorkflowRunner({ /* ... */ opExecutor });
  await runner.executeStep(workflowId);
  
  expect(attempts).toBe(3);
});
```

---

## Common Patterns

### Pattern: Resilient External Call

```typescript
import { CircuitBreaker } from '@lssm/lib.resilience/circuit-breaker';
import { retry } from '@lssm/lib.resilience/retry';
import { timeout } from '@lssm/lib.resilience/timeout';
import { traceAsync } from '@lssm/lib.observability/tracing';

const breaker = new CircuitBreaker({ failureThreshold: 5, resetTimeoutMs: 30000 });

export async function callExternalAPI(input: any) {
  return traceAsync('external_api_call', async (span) => {
    span.setAttribute('service', 'stripe');
    
    return breaker.execute(() =>
      retry(
        () => timeout(() => stripe.api.call(input), 5000),
        3,
        1000,
        true
      )
    );
  });
}
```

**Benefits**: Circuit breaker + retry + timeout + tracing in one place.

---

### Pattern: Tenant-Aware Operation

```typescript
import { traceAsync } from '@lssm/lib.observability/tracing';

export async function listUsers(tenantId: string) {
  return traceAsync('list_users', async (span) => {
    span.setAttribute('tenant_id', tenantId);
    
    // RLS middleware will inject WHERE tenantId = ?
    return db.user.findMany();
  });
}
```

---

### Pattern: Monitored Workflow

```typescript
import { WorkflowRunner } from '@lssm/lib.contracts/workflow/runner';
import { SLAMonitor } from '@lssm/lib.contracts/workflow/sla-monitor';
import { logger } from '@lssm/lib.observability/logging';

const monitor = new SLAMonitor((event, payload) => {
  logger.warn('workflow.sla_breach', payload);
});

// In workflow poller
const state = await runner.getState(workflowId);
const spec = registry.get(state.workflowName, state.workflowVersion);
if (spec) {
  monitor.check(state, spec);
}
```

---

## Next Steps

1. **Implement one quick win** (30 minutes)
2. **Add tests for new functionality** (1 hour)
3. **Deploy to staging and verify observability** (1 hour)
4. **Roll out to production** (monitor closely)
5. **Read full documentation** at https://contractspec.lssm.tech/docs

---

**Questions?** See `/docs/guides/phase-1-migration` or reach out via https://contractspec.lssm.tech/contact

























