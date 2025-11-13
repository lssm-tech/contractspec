import type { SpecChangeProposal, ProposalAction, RegenerationContext } from './types';

export type ExecutionStatus = 'success' | 'skipped' | 'failed';

export interface ActionExecutionResult {
  index: number;
  action: ProposalAction;
  status: ExecutionStatus;
  startedAt: Date;
  finishedAt: Date;
  reason?: string;
  error?: Error;
  output?: unknown;
}

export interface ProposalExecutionResult {
  proposalId: string;
  contextId: string;
  startedAt: Date;
  finishedAt: Date;
  status: 'success' | 'partial' | 'failed';
  actions: ActionExecutionResult[];
}

export type UpdateBlueprintAction = Extract<ProposalAction, { kind: 'update_blueprint' }>;
export type UpdateTenantConfigAction = Extract<ProposalAction, { kind: 'update_tenant_config' }>;
export type RunTestsAction = Extract<ProposalAction, { kind: 'run_tests' }>;
export type RunMigrationsAction = Extract<ProposalAction, { kind: 'run_migrations' }>;
export type TriggerRegenerationAction = Extract<ProposalAction, { kind: 'trigger_regeneration' }>;

export interface BlueprintUpdater {
  applyBlueprintUpdate(
    context: RegenerationContext,
    proposal: SpecChangeProposal,
    action: UpdateBlueprintAction
  ): Promise<unknown>;
}

export interface TenantConfigUpdater {
  applyTenantConfigUpdate(
    context: RegenerationContext,
    proposal: SpecChangeProposal,
    action: UpdateTenantConfigAction
  ): Promise<unknown>;
}

export interface TestExecutor {
  runTests(
    context: RegenerationContext,
    proposal: SpecChangeProposal,
    action: RunTestsAction
  ): Promise<unknown>;
}

export interface MigrationExecutor {
  runMigrations(
    context: RegenerationContext,
    proposal: SpecChangeProposal,
    action: RunMigrationsAction
  ): Promise<unknown>;
}

export interface RegenerationTrigger {
  triggerRegeneration(
    context: RegenerationContext,
    proposal: SpecChangeProposal,
    action: TriggerRegenerationAction
  ): Promise<unknown>;
}

export interface ProposalExecutorOptions {
  dryRun?: boolean;
}

export interface ProposalExecutorDeps {
  blueprintUpdater?: BlueprintUpdater;
  tenantConfigUpdater?: TenantConfigUpdater;
  testExecutor?: TestExecutor;
  migrationExecutor?: MigrationExecutor;
  regenerationTrigger?: RegenerationTrigger;
}

export class ProposalExecutor {
  constructor(private readonly deps: ProposalExecutorDeps = {}) {}

  async execute(
    context: RegenerationContext,
    proposal: SpecChangeProposal,
    options: ProposalExecutorOptions = {}
  ): Promise<ProposalExecutionResult> {
    const startedAt = new Date();
    const actionResults: ActionExecutionResult[] = [];

    for (const [index, action] of proposal.actions.entries()) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.executeAction({
        index,
        action,
        context,
        proposal,
        options,
      });
      actionResults.push(result);
    }

    const finishedAt = new Date();
    const summaryStatus = summarizeStatus(actionResults);

    return {
      proposalId: proposal.id,
      contextId: context.id,
      startedAt,
      finishedAt,
      status: summaryStatus,
      actions: actionResults,
    };
  }

  private async executeAction({
    index,
    action,
    context,
    proposal,
    options,
  }: {
    index: number;
    action: ProposalAction;
    context: RegenerationContext;
    proposal: SpecChangeProposal;
    options: ProposalExecutorOptions;
  }): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    const dryRun = options.dryRun ?? false;

    const complete = (
      status: ExecutionStatus,
      params: {
        reason?: string;
        output?: unknown;
        error?: Error;
      } = {}
    ): ActionExecutionResult => ({
      index,
      action,
      status,
      startedAt,
      finishedAt: new Date(),
      reason: params.reason,
      output: params.output,
      error: params.error,
    });

    if (dryRun) {
      return complete('skipped', { reason: 'dry_run' });
    }

    try {
      switch (action.kind) {
        case 'update_blueprint': {
          const updater = this.deps.blueprintUpdater;
          if (!updater) {
            return complete('skipped', { reason: 'missing_blueprint_updater' });
          }
          const output = await updater.applyBlueprintUpdate(context, proposal, action);
          return complete('success', { output });
        }
        case 'update_tenant_config': {
          const updater = this.deps.tenantConfigUpdater;
          if (!updater) {
            return complete('skipped', { reason: 'missing_tenant_config_updater' });
          }
          const output = await updater.applyTenantConfigUpdate(context, proposal, action);
          return complete('success', { output });
        }
        case 'run_tests': {
          const executor = this.deps.testExecutor;
          if (!executor) {
            return complete('skipped', { reason: 'missing_test_executor' });
          }
          const output = await executor.runTests(context, proposal, action);
          return complete('success', { output });
        }
        case 'run_migrations': {
          const executor = this.deps.migrationExecutor;
          if (!executor) {
            return complete('skipped', { reason: 'missing_migration_executor' });
          }
          const output = await executor.runMigrations(context, proposal, action);
          return complete('success', { output });
        }
        case 'trigger_regeneration': {
          const trigger = this.deps.regenerationTrigger;
          if (!trigger) {
            return complete('skipped', { reason: 'missing_regeneration_trigger' });
          }
          const output = await trigger.triggerRegeneration(context, proposal, action);
          return complete('success', { output });
        }
        default: {
          return complete('skipped', { reason: 'unknown_action' });
        }
      }
    } catch (error) {
      return complete('failed', {
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

function summarizeStatus(actionResults: ActionExecutionResult[]): ProposalExecutionResult['status'] {
  if (actionResults.some((result) => result.status === 'failed')) {
    return 'failed';
  }
  if (actionResults.some((result) => result.status === 'success') &&
      actionResults.some((result) => result.status === 'skipped')) {
    return 'partial';
  }
  if (actionResults.every((result) => result.status === 'skipped')) {
    return 'partial';
  }
  return 'success';
}

