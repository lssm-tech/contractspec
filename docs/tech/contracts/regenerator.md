## Regenerator Service

The Regenerator daemon observes telemetry, error, and behavior streams, then suggests spec-level changes (not code patches) that can be reviewed and applied through the App Studio.

- Runtime entrypoint: `packages/libs/contracts/src/regenerator/service.ts`
- Types/interfaces: `packages/libs/contracts/src/regenerator/types.ts`
- Signal adapters: `packages/libs/contracts/src/regenerator/adapters.ts`

### Architecture

```text
Signal Adapters ──► RegeneratorService ──► Rules ──► ProposalSink
          ▲                                       │
          │                                       ▼
     Telemetry / Errors / Behavior         Spec change proposals
```

1. **Signal adapters** pull batches of telemetry, error logs, or behavior metrics for each `RegenerationContext`.
2. `RegeneratorService` schedules polling (`resolveAppConfig` + `composeAppConfig` provide context).
3. **Rules** implement domain heuristics and emit `SpecChangeProposal` objects.
4. **Proposal sinks** persist or forward proposals for human review.

### Key types

```ts
export interface RegenerationContext {
  id: string;
  blueprint: AppBlueprintSpec;
  tenantConfig: TenantAppConfig;
  resolved: ResolvedAppConfig;
}

export interface RegeneratorRule {
  id: string;
  description: string;
  evaluate(
    context: RegenerationContext,
    signals: RegeneratorSignal[]
  ): Promise<SpecChangeProposal[]>;
}

export interface SpecChangeProposal {
  id: string;
  title: string;
  summary: string;
  confidence: 'low' | 'medium' | 'high';
  target: ProposalTarget;
  actions: ProposalAction[];
  blockers?: ProposalBlocker[];
  signalIds: string[];
  createdAt: Date;
}
```

- Signals are normalized envelopes: telemetry (`count`, anomaly score), errors, and behavior trends.
- Proposals reference blueprint or tenant specs via `ProposalTarget`.
- Actions encode what the automation should perform (update blueprint, run tests/migrations, trigger regeneration).

### Providing signals

Implement `TelemetrySignalProvider`, `ErrorSignalProvider`, or `BehaviorSignalProvider`:

```ts
const service = new RegeneratorService({
  contexts,
  adapters: {
    telemetry: new PosthogTelemetryAdapter(),
    errors: new SentryErrorAdapter(),
  },
  rules: [new WorkflowFailureRule(), new DataViewUsageRule()],
  sink: new ProposalQueueSink(),
  pollIntervalMs: 60_000,
});
```

Adapters receive the full `RegenerationContext`, making it easy to scope queries per tenant/app.

### Authoring rules

Rules focus on signals → proposals:

```ts
class WorkflowFailureRule implements RegeneratorRule {
  id = 'workflow-failure';
  description = 'Suggest splitting workflows that exceed failure thresholds';

  async evaluate(context, signals) {
    const failures = signals.filter(
      (signal) =>
        signal.type === 'telemetry' &&
        signal.signal.eventName === 'workflow.failure' &&
        signal.signal.count >= 10
    );

    if (failures.length === 0) return [];

    return [
      {
        id: `${this.id}-${context.id}`,
        title: 'Split onboarding workflow',
        summary: 'Step 3 fails consistently; propose dedicated remediation branch.',
        confidence: 'medium',
        rationale: ['Failure count ≥ 10 within last window'],
        target: {
          specType: 'workflow',
          reference: { name: 'onboarding.workflow', version: 1 },
          tenantScoped: true,
        },
        actions: [
          { kind: 'update_tenant_config', summary: 'Add alternate fallback path' },
          { kind: 'run_tests', tests: ['workflows/onboarding.spec.ts'] },
        ],
        signalIds: failures.map((f) => f.signal.eventName),
        createdAt: new Date(),
      },
    ];
  }
}
```

### Reviewing proposals

Proposals flow to a `ProposalSink` (queue, DB, messaging bus). The Studio will surface:

1. Signal evidence (telemetry counts, error metadata)
2. Proposed spec diffs and required actions (tests/migrations)
3. Approval workflow (approve → write spec diff → run automation)

### CLI driver

Run the regenerator daemon from the CLI:

```bash
bunx contracts regenerator ./app.blueprint.ts ./tenant.config.ts ./regenerator.rules.ts auto \
  --executor ./regenerator.executor.ts \
  --poll-interval 60000 \
  --batch-duration 300000 \
  --dry-run
```

- Expects modules exporting default `AppBlueprintSpec`, `TenantAppConfig`, and one or more `RegenerationRule`s.
- Pass a sink module path, or use the special `auto` value with `--executor <module>` to instantiate an `ExecutorProposalSink`.
- Executor modules can export a `ProposalExecutor` instance, a factory, or a plain dependency object for the executor constructor. Optional exports: `sinkOptions`, `logger`, `onResult`, `dryRun`.
- Optionally provide `--contexts ./contexts.ts` to load custom context arrays (advanced multi-tenant scenarios).
- Use `--dry-run` to preview actions without mutating specs/configs, and `--once` for CI smoke tests.

### Proposal executor

`ProposalExecutor` + `ExecutorProposalSink` orchestrate follow-up actions once a proposal is approved:

- Interfaces for applying blueprint or tenant-config updates (`BlueprintUpdater`, `TenantConfigUpdater`).
- Hooks for running contract tests and migrations (`TestExecutor`, `MigrationExecutor`).
- Optional trigger to recompose the runtime (`RegenerationTrigger`).
- Built-in `dryRun` mode to preview outcomes.
- Pluggable result logging/forwarding via `ExecutorSinkOptions`.

```ts
import {
  ProposalExecutor,
  ExecutorProposalSink,
} from '@lssm/lib.contracts/regenerator';

const executor = new ProposalExecutor({
  tenantConfigUpdater,
  testExecutor,
  migrationExecutor,
  regenerationTrigger,
});

const sink = new ExecutorProposalSink(executor, {
  dryRun: false,
  onResult: ({ result }) => console.log(result.status),
});
```

Execution results include per-action status (`success`, `skipped`, `failed`) plus aggregated proposal status (`success`, `partial`, `failed`). Missing dependencies mark actions as `skipped`, making it easy to plug into partial automation flows today and extend later.

### Next steps

- Build adapters for existing telemetry/error providers.
- Encode canonical rules (workflow failure, feature under-use, high latency).
- Integrate with App Studio proposal inbox and automate acceptance (write spec diff, run tests, queue migrations).

