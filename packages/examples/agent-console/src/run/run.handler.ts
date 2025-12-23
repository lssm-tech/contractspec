/**
 * Mock handlers for Run contracts.
 */
import { MOCK_RUNS } from '../shared/mock-runs';
import { MOCK_AGENTS } from '../shared/mock-agents';

export interface ListRunsInput {
  organizationId?: string;
  agentId?: string;
  userId?: string;
  sessionId?: string;
  status?:
    | 'QUEUED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface RunSummary {
  id: string;
  agentId: string;
  agentName: string;
  status:
    | 'QUEUED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED';
  totalTokens: number;
  durationMs?: number;
  estimatedCostUsd?: number;
  queuedAt: Date;
  completedAt?: Date;
}

export interface ListRunsOutput {
  items: RunSummary[];
  total: number;
  hasMore: boolean;
}

/**
 * Mock handler for ListRunsQuery.
 */
export async function mockListRunsHandler(
  input: ListRunsInput
): Promise<ListRunsOutput> {
  const { agentId, status, limit = 20, offset = 0 } = input;

  let filtered = [...MOCK_RUNS];
  if (agentId) filtered = filtered.filter((r) => r.agentId === agentId);
  if (status) filtered = filtered.filter((r) => r.status === status);

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit).map((r) => {
    const agent = MOCK_AGENTS.find((a) => a.id === r.agentId);
    return {
      id: r.id,
      agentId: r.agentId,
      agentName: agent?.name ?? 'Unknown',
      status: r.status,
      totalTokens: r.totalTokens,
      durationMs: r.durationMs,
      estimatedCostUsd: r.estimatedCostUsd,
      queuedAt: r.queuedAt,
      completedAt: r.completedAt,
    };
  });

  return { items, total, hasMore: offset + limit < total };
}

/**
 * Mock handler for GetRunQuery.
 */
export async function mockGetRunHandler(input: {
  runId: string;
  includeSteps?: boolean;
  includeLogs?: boolean;
}) {
  const run = MOCK_RUNS.find((r) => r.id === input.runId);
  if (!run) throw new Error('RUN_NOT_FOUND');

  const agent = MOCK_AGENTS.find((a) => a.id === run.agentId);
  return {
    ...run,
    agent: agent
      ? {
          id: agent.id,
          name: agent.name,
          modelProvider: agent.modelProvider,
          modelName: agent.modelName,
        }
      : undefined,
    steps: input.includeSteps ? run.steps : undefined,
    logs: input.includeLogs ? run.logs : undefined,
  };
}

/**
 * Mock handler for ExecuteAgentCommand.
 */
export async function mockExecuteAgentHandler(input: {
  agentId: string;
  input: { message: string; context?: Record<string, unknown> };
}) {
  const agent = MOCK_AGENTS.find((a) => a.id === input.agentId);
  if (!agent) throw new Error('AGENT_NOT_FOUND');
  if (agent.status !== 'ACTIVE') throw new Error('AGENT_NOT_ACTIVE');

  return {
    runId: `run-${Date.now()}`,
    status: 'QUEUED' as const,
    estimatedWaitMs: 500,
  };
}

/**
 * Mock handler for CancelRunCommand.
 */
export async function mockCancelRunHandler(input: {
  runId: string;
  reason?: string;
}) {
  const run = MOCK_RUNS.find((r) => r.id === input.runId);
  if (!run) throw new Error('RUN_NOT_FOUND');
  if (!['QUEUED', 'IN_PROGRESS'].includes(run.status))
    throw new Error('RUN_NOT_CANCELLABLE');

  return { success: true, status: 'CANCELLED' as const };
}
