import { describe, expect, it, vi } from 'bun:test';
import { ProposalExecutor } from './executor';
import type {
  RegenerationContext,
  SpecChangeProposal,
  ProposalAction,
} from './types';
import type {
  BlueprintUpdater,
  TenantConfigUpdater,
  TestExecutor,
  MigrationExecutor,
  RegenerationTrigger,
} from './executor';
import type { AppBlueprintSpec, TenantAppConfig } from '../app-config/spec';
import { resolveAppConfig } from '../app-config/runtime';

const blueprint: AppBlueprintSpec = {
  meta: {
    name: 'demo.app',
    version: 1,
    appId: 'demo',
    title: 'Demo',
    description: 'Demo blueprint',
    domain: 'demo',
    owners: ['ops'],
    tags: ['demo'],
    stability: 'experimental',
  },
  capabilities: {
    enabled: [{ key: 'demo.capability', version: 1 }],
  },
};

const tenant: TenantAppConfig = {
  meta: {
    id: 'tenant-demo',
    tenantId: 'tenant-demo',
    appId: 'demo',
    blueprintName: blueprint.meta.name,
    blueprintVersion: blueprint.meta.version,
    version: 1,
    status: 'draft',
  },
};

const context: RegenerationContext = {
  id: 'tenant-demo',
  blueprint,
  tenantConfig: tenant,
  resolved: resolveAppConfig(blueprint, tenant),
};

const proposal: SpecChangeProposal = {
  id: 'proposal-1',
  title: 'Improve workflow',
  summary: 'Split step',
  confidence: 'medium',
  rationale: ['Repeated failures'],
  target: {
    specType: 'workflow',
    reference: { name: 'demo.workflow', version: 1 },
    tenantScoped: true,
  },
  actions: [
    { kind: 'update_tenant_config', summary: 'Add alternate branch' },
    { kind: 'run_tests', tests: ['workflows/onboarding.spec.ts'] },
    { kind: 'run_migrations', migrations: ['001-add-column'] },
    { kind: 'trigger_regeneration', summary: 'Recompose app' },
  ],
  createdAt: new Date(),
  signalIds: ['telemetry:workflow.failure'],
};

function createDeps(
  overrides: Partial<{
    blueprintUpdater: BlueprintUpdater;
    tenantConfigUpdater: TenantConfigUpdater;
    testExecutor: TestExecutor;
    migrationExecutor: MigrationExecutor;
    regenerationTrigger: RegenerationTrigger;
  }> = {}
) {
  const defaults = {
    blueprintUpdater: {
      applyBlueprintUpdate: vi.fn().mockResolvedValue({ status: 'applied' }),
    } satisfies BlueprintUpdater,
    tenantConfigUpdater: {
      applyTenantConfigUpdate: vi.fn().mockResolvedValue({ status: 'applied' }),
    } satisfies TenantConfigUpdater,
    testExecutor: {
      runTests: vi.fn().mockResolvedValue({
        passed: ['workflows/onboarding.spec.ts'],
        failed: [],
      }),
    } satisfies TestExecutor,
    migrationExecutor: {
      runMigrations: vi.fn().mockResolvedValue({
        applied: ['001-add-column'],
      }),
    } satisfies MigrationExecutor,
    regenerationTrigger: {
      triggerRegeneration: vi.fn().mockResolvedValue(undefined),
    } satisfies RegenerationTrigger,
  };

  return { ...defaults, ...overrides };
}

describe('ProposalExecutor', () => {
  it('executes supported actions when dependencies provided', async () => {
    const deps = createDeps();
    const executor = new ProposalExecutor(deps);

    const result = await executor.execute(context, proposal);

    expect(result.status).toBe('success');
    expect(result.actions).toHaveLength(proposal.actions.length);
    const testAction = result.actions.find(
      (action) => action.action.kind === 'run_tests'
    );
    expect(testAction?.status).toBe('success');
    expect(deps.testExecutor.runTests).toHaveBeenCalledWith(
      context,
      proposal,
      proposal.actions[1] as Extract<ProposalAction, { kind: 'run_tests' }>
    );
  });

  it('skips actions when dependency missing', async () => {
    const deps = createDeps({
      testExecutor: undefined,
      migrationExecutor: undefined,
    });
    const executor = new ProposalExecutor(deps);

    const result = await executor.execute(context, proposal);

    expect(result.status).toBe('partial');
    const skippedKinds = result.actions
      .filter((action) => action.status === 'skipped')
      .map((action) => action.action.kind);
    expect(skippedKinds).toEqual(
      expect.arrayContaining(['run_tests', 'run_migrations'])
    );
  });

  it('records failure when dependency throws', async () => {
    const deps = createDeps({
      tenantConfigUpdater: {
        applyTenantConfigUpdate: vi.fn().mockRejectedValue(new Error('boom')),
      },
    });
    const executor = new ProposalExecutor(deps);

    const result = await executor.execute(context, proposal);

    expect(result.actions[0]).toBeDefined();
    const firstAction = result.actions[0];
    expect(firstAction?.status).toBe('failed');
    expect(result.status).toBe('failed');
    expect(firstAction?.error?.message).toBe('boom');
  });

  it('observes dry run mode and skips execution', async () => {
    const deps = createDeps();
    const executor = new ProposalExecutor(deps);

    const result = await executor.execute(context, proposal, { dryRun: true });

    expect(result.status).toBe('partial');
    expect(result.actions.every((action) => action.status === 'skipped')).toBe(
      true
    );
    expect(result.actions[0]?.reason).toBe('dry_run');
    expect(deps.testExecutor.runTests).not.toHaveBeenCalled();
  });
});
