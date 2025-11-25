# @lssm/bundle.lifecycle-managed

Lifecycle assessment + guidance managed service for ContractSpec Studio. This bundle wires the lifecycle modules, analytics bridges, and AI advisor agent into a deployable service surface (REST, events, Studio integrations).

## Modules

- `LifecycleAssessmentService` – orchestrates detection, scoring, guidance, metrics, and managed events.
- `LifecycleAdvisorAgent` – AI spec definition for conversational lifecycle coaching.
- `LifecycleEventBridge` – helper to broadcast stage changes + assessment telemetry.
- REST handlers – HTTP-friendly adapters for serving assessments + playbooks.

## Usage

```ts
import { LifecycleAssessmentService, createLifecycleHandlers } from '@lssm/bundle.lifecycle-managed';

const service = new LifecycleAssessmentService({
  tenantId: 'tenant_123',
  collectorOptions: {
    analyticsAdapter,
    questionnaireAdapter,
  },
});

const handlers = createLifecycleHandlers(service);

app.post('/lifecycle/assessments', handlers.runAssessment);
app.get('/lifecycle/playbooks/:stage', handlers.getPlaybook);
```

The bundle stays framework-agnostic: you can mount the handlers on Elysia, Express, Next.js routes, or background jobs.*** End Patch












