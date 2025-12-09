## TelemetrySpec

Telemetry specs describe product analytics in a durable, type-safe way. They reference existing `EventSpec`s (same name/version) but layer on privacy classification, retention, sampling, and anomaly detection so instrumentation stays compliant and observable.

- **File location**: `packages/libs/contracts/src/telemetry/spec.ts`
- **Runtime tracker**: `packages/libs/contracts/src/telemetry/tracker.ts`
- **Anomaly monitor**: `packages/libs/contracts/src/telemetry/anomaly.ts`

### Core concepts

```ts
export interface TelemetrySpec {
  meta: TelemetryMeta;
  events: TelemetryEventDef[];
  config?: TelemetryConfig;
}
```

- `meta`: ownership + identifiers (`name`, `version`, `domain`)
- `events`: per-event semantics, property definitions, privacy level, retention, sampling, anomaly rules
- `config`: defaults and provider configuration
- `TelemetryRegistry`: registers specs, resolves latest version, finds event definitions by name/version

### An example

```ts
export const SigilTelemetry: TelemetrySpec = {
  meta: {
    name: 'sigil.telemetry',
    version: 1,
    title: 'Sigil telemetry',
    description: 'Core Sigil product telemetry',
    domain: 'sigil',
    owners: ['@team.analytics'],
    tags: ['telemetry'],
    stability: StabilityEnum.Experimental,
  },
  config: {
    defaultRetentionDays: 30,
    defaultSamplingRate: 1,
    providers: [
      { type: 'posthog', config: { projectApiKey: process.env.POSTHOG_KEY } },
    ],
  },
  events: [
    {
      name: 'sigil.telemetry.workflow_step',
      version: 1,
      semantics: {
        what: 'Workflow step executed',
        who: 'Actor executing the workflow',
      },
      privacy: 'internal',
      properties: {
        workflow: { type: 'string', required: true },
        step: { type: 'string', required: true },
        durationMs: { type: 'number' },
        userId: { type: 'string', pii: true, redact: true },
      },
      anomalyDetection: {
        enabled: true,
        minimumSample: 10,
        thresholds: [
          { metric: 'durationMs', max: 1500 },
        ],
        actions: ['alert', 'trigger_regen'],
      },
    },
  ],
};
```

### Tracking events at runtime

`TelemetryTracker` performs sampling, PII redaction, provider dispatch, and anomaly detection.

```ts
const tracker = new TelemetryTracker({
  registry: telemetryRegistry,
  providers: [
    {
      id: 'posthog',
      async send(dispatch) {
        posthog.capture({
          event: dispatch.name,
          properties: dispatch.properties,
          distinctId: dispatch.context.userId ?? dispatch.context.sessionId,
        });
      },
    },
  ],
  anomalyMonitor: new TelemetryAnomalyMonitor({
    onAnomaly(event) {
      console.warn('Telemetry anomaly detected', event);
    },
  }),
});

await tracker.track('sigil.telemetry.workflow_step', 1, {
  workflow: 'onboarding',
  step: 'verify_email',
  durationMs: 2100,
  userId: 'user-123',
});
```

- Sampling obeys the event-specific rate (fallback to spec defaults)
- Properties flagged with `pii` or `redact` are masked before dispatch
- Anomaly monitor evaluates thresholds and triggers actions (e.g., log, alert, regeneration)

### Spec integration

- `ContractSpec.telemetry` allows operations to emit success/failure events automatically
- `SpecRegistry.execute()` uses the tracker when `ctx.telemetry` is provided
- `WorkflowRunner` (Phase 4 follow-up) will emit telemetry during step transitions
- `TelemetrySpec` events should reuse `EventSpec` names/versions to keep analytics/contract parity

### CLI workflow

```
contracts-cli create telemetry
```

- Interactive wizard prompts for meta, providers, events, properties, retention, anomaly rules
- Output: `*.telemetry.ts` file using `TelemetrySpec`

### Best practices

- Prefer `internal` privacy for non-PII; mark PII properties explicitly with `pii` + `redact`
- Keep sampling ≥0.05 except for high-volume events
- Configure anomaly detection on key metrics (duration, error count, conversion)
- Check telemetry into source control alongside contracts; regenerate via CLI when specs change

### Next steps

- Phase 5: Regenerator monitors telemetry anomalies to propose spec improvements
- Phase 6: Studio surfaces telemetry controls per tenant via `TenantAppConfig`

