import { describe, expect, it, vi } from 'bun:test';
import { ExecutorProposalSink } from './sinks';
import { ProposalExecutor } from './executor';
import type { ExecutorResultPayload } from './sinks';
import type { ProposalExecutionResult } from './executor';
import type { SpecChangeProposal } from './types';
import type { AppBlueprintSpec, TenantAppConfig } from '../app-config/spec';
import type { RegenerationContext } from './types';
import { resolveAppConfig } from '../app-config/runtime';

const blueprint: AppBlueprintSpec = {
  meta: {
    key: 'demo.app',
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
    blueprintName: blueprint.meta.key,
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
    reference: { key: 'demo.workflow', version: 1 },
    tenantScoped: true,
  },
  actions: [{ kind: 'run_tests', tests: ['workflows/onboarding.spec.ts'] }],
  createdAt: new Date(),
  signalIds: ['telemetry:workflow.failure'],
};

describe('ExecutorProposalSink', () => {
  it('invokes executor and result handler', async () => {
    const executor = new ProposalExecutor();
    const executeSpy = vi.spyOn(executor, 'execute').mockResolvedValue({
      proposalId: proposal.id,
      contextId: context.id,
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'success',
      actions: [],
    } satisfies ProposalExecutionResult);

    const onResult = vi.fn<(payload: ExecutorResultPayload) => void>();
    const logger = { info: vi.fn(), error: vi.fn() };
    const sink = new ExecutorProposalSink(executor, { onResult, logger });

    await sink.submit(context, proposal);

    expect(executeSpy).toHaveBeenCalledWith(context, proposal, {
      dryRun: false,
    });
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      '[regenerator] proposal executed',
      expect.objectContaining({ proposalId: proposal.id, status: 'success' })
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('propagates errors and logs failure', async () => {
    const executor = new ProposalExecutor();
    const executeSpy = vi
      .spyOn(executor, 'execute')
      .mockRejectedValue(new Error('boom'));
    const logger = { info: vi.fn(), error: vi.fn() };
    const sink = new ExecutorProposalSink(executor, { logger, dryRun: false });

    await expect(sink.submit(context, proposal)).rejects.toThrow('boom');
    expect(executeSpy).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      '[regenerator] proposal execution failed',
      expect.any(Error),
      expect.objectContaining({ proposalId: proposal.id })
    );
  });

  it('passes dry-run flag through to executor', async () => {
    const executor = new ProposalExecutor();
    const executeSpy = vi.spyOn(executor, 'execute').mockResolvedValue({
      proposalId: proposal.id,
      contextId: context.id,
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'partial',
      actions: [],
    } satisfies ProposalExecutionResult);

    const sink = new ExecutorProposalSink(executor, { dryRun: true });
    await sink.submit(context, proposal);

    expect(executeSpy).toHaveBeenCalledWith(context, proposal, {
      dryRun: true,
    });
  });
});
