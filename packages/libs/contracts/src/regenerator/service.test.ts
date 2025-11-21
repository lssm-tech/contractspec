import { describe, expect, it } from 'vitest';
import { RegeneratorService } from './service';
import type {
  ProposalSink,
  RegenerationContext,
  RegenerationRule,
  RegeneratorSignal,
  SpecChangeProposal,
} from './types';
import type { SignalAdapters, TelemetrySignalProvider } from './adapters';
import { resolveAppConfig } from '../app-config/runtime';
import type { AppBlueprintSpec, TenantAppConfig } from '../app-config/spec';

const blueprint: AppBlueprintSpec = {
  meta: {
    name: 'demo.app',
    version: 1,
    appId: 'demo',
    title: 'Demo App',
    description: 'Demo blueprint',
    domain: 'demo',
    owners: ['@team.demo'],
    tags: ['demo'],
    stability: 'experimental',
  },
  capabilities: {
    enabled: [{ key: 'demo.capability', version: 1 }],
  },
  dataViews: {
    dashboard: { name: 'demo.dashboard', version: 1 },
  },
};

const tenantConfig: TenantAppConfig = {
  meta: {
    id: 'tenant-1',
    tenantId: 'tenant-1',
    appId: 'demo',
    blueprintName: blueprint.meta.name,
    blueprintVersion: blueprint.meta.version,
    version: 1,
    status: 'draft',
  },
};

const resolvedContext: RegenerationContext = {
  id: 'tenant-1',
  blueprint,
  tenantConfig,
  resolved: resolveAppConfig(blueprint, tenantConfig),
};

class MockTelemetryAdapter implements TelemetrySignalProvider {
  public polls: { since: Date; until: Date }[] = [];
  public signals: Parameters<NonNullable<TelemetrySignalProvider>['pollTelemetry']>[2][] =
  > = [];

  constructor(private readonly payload: number[]) {}

  async pollTelemetry(_context: RegenerationContext, since: Date, until: Date) {
    this.polls.push({ since, until });
    return this.payload.map((count, index) => ({
      eventName: 'demo.event',
      eventVersion: 1,
      count,
      windowStart: new Date(until.getTime() - 1000 * (index + 1)),
      windowEnd: until,
      metadata: { index },
    }));
  }
}

class MockRule implements RegenerationRule {
  public invocations: RegeneratorSignal[][] = [];

  constructor(
    public readonly id: string,
    private readonly condition: (signals: RegeneratorSignal[]) => boolean
  ) {}

  description = 'Mock rule';

  async evaluate(
    context: RegenerationContext,
    signals: RegeneratorSignal[]
  ): Promise<SpecChangeProposal[]> {
    this.invocations.push(signals);
    if (!this.condition(signals)) return [];
    return [
      {
        id: `${this.id}-${context.id}`,
        title: 'Propose workflow tweak',
        summary: 'Split onboarding workflow step',
        confidence: 'medium',
        rationale: ['Repeated failures detected'],
        target: {
          specType: 'workflow',
          reference: { name: 'demo.workflow', version: 1 },
          tenantScoped: true,
        },
        actions: [
          {
            kind: 'update_tenant_config',
            summary: 'Introduce alternate workflow',
          },
          { kind: 'run_tests', tests: ['workflows/onboarding.spec.ts'] },
        ],
        blockers: [],
        createdAt: new Date(),
        signalIds: ['demo.event'],
      },
    ];
  }
}

class RecordingSink implements ProposalSink {
  public proposals: { context: RegenerationContext; proposal: SpecChangeProposal }[] = [];

  async submit(
    context: RegenerationContext,
    proposal: SpecChangeProposal
  ): Promise<void> {
    this.proposals.push({ context, proposal });
  }
}

describe('RegeneratorService', () => {
  it('collects signals and emits proposals through rules', async () => {
    const telemetry = new MockTelemetryAdapter([5, 7, 9]);
    const sink = new RecordingSink();
    const rule = new MockRule('high-count', (signals) => {
      const telemetrySignals = signals.filter(
        (signal) => signal.type === 'telemetry'
      );
      return telemetrySignals.some(
        (envelope) =>
          envelope.type === 'telemetry' && envelope.signal.count >= 7
      );
    });

    const service = new RegeneratorService({
      contexts: [resolvedContext],
      adapters: { telemetry },
      rules: [rule],
      sink,
      pollIntervalMs: 10,
      batchDurationMs: 5_000,
      clock: () => new Date('2025-01-01T00:00:00Z'),
    });

    await service.runOnce();

    expect(rule.invocations).toHaveLength(1);
    expect(rule.invocations[0]?.length).toBe(3);
    expect(sink.proposals).toHaveLength(1);
    expect(sink.proposals[0]?.proposal.id).toBe('high-count-tenant-1');
  });

  it('respects strict rules and ignores empty results', async () => {
    const telemetry = new MockTelemetryAdapter([1, 1, 1]);
    const sink = new RecordingSink();
    const rule = new MockRule('noop', () => false);

    const service = new RegeneratorService({
      contexts: [resolvedContext],
      adapters: { telemetry },
      rules: [rule],
      sink,
      clock: () => new Date('2025-01-01T00:00:00Z'),
    });

    await service.runOnce();

    expect(rule.invocations).toHaveLength(1);
    expect(sink.proposals).toHaveLength(0);
  });
});
