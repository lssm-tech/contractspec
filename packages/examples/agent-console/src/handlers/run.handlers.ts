/**
 * Mock handlers for Run contracts
 */
import { MOCK_RUNS, MOCK_RUN_STEPS, MOCK_RUN_LOGS } from './mock-data';

// Types inferred from contract schemas
export interface ListRunsInput {
  organizationId?: string;
  agentId?: string;
  userId?: string;
  sessionId?: string;
  status?: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface RunSummary {
  id: string;
  agentId: string;
  agentName: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
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

export interface GetRunInput {
  runId: string;
  includeSteps?: boolean;
  includeLogs?: boolean;
}

export interface Run {
  id: string;
  organizationId: string;
  agentId: string;
  userId?: string;
  sessionId?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  errorMessage?: string;
  errorCode?: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalIterations: number;
  durationMs?: number;
  estimatedCostUsd?: number;
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
  steps?: RunStep[];
  logs?: RunLog[];
}

export interface RunStep {
  id: string;
  stepNumber: number;
  type: 'MESSAGE_CREATION' | 'TOOL_CALL' | 'TOOL_RESULT' | 'ERROR';
  toolId?: string;
  toolName?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  errorMessage?: string;
  tokensUsed: number;
  durationMs?: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface RunLog {
  id: string;
  stepId?: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  data?: Record<string, unknown>;
  source?: string;
  traceId?: string;
  spanId?: string;
  timestamp: Date;
}

export interface GetRunMetricsInput {
  organizationId: string;
  agentId?: string;
  startDate: Date;
  endDate: Date;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

export interface TimelineDataPoint {
  period: string;
  runs: number;
  tokens: number;
  costUsd: number;
  avgDurationMs: number;
}

export interface RunMetrics {
  totalRuns: number;
  completedRuns: number;
  failedRuns: number;
  totalTokens: number;
  totalCostUsd: number;
  averageDurationMs: number;
  successRate: number;
  timeline: TimelineDataPoint[];
}

/**
 * Mock handler for ListRunsQuery
 */
export async function mockListRunsHandler(
  input: ListRunsInput
): Promise<ListRunsOutput> {
  const { agentId, status, limit = 20, offset = 0 } = input;

  let filtered = [...MOCK_RUNS];

  if (agentId) {
    filtered = filtered.filter((r) => r.agentId === agentId);
  }

  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }

  // Sort by queuedAt descending
  filtered.sort((a, b) => b.queuedAt.getTime() - a.queuedAt.getTime());

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit).map((r) => ({
    id: r.id,
    agentId: r.agentId,
    agentName: r.agentName,
    status: r.status,
    totalTokens: r.totalTokens,
    durationMs: r.durationMs,
    estimatedCostUsd: r.estimatedCostUsd,
    queuedAt: r.queuedAt,
    completedAt: r.completedAt,
  }));

  return {
    items,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Mock handler for GetRunQuery
 */
export async function mockGetRunHandler(input: GetRunInput): Promise<Run> {
  const run = MOCK_RUNS.find((r) => r.id === input.runId);

  if (!run) {
    throw new Error('RUN_NOT_FOUND');
  }

  const result: Run = {
    ...run,
    promptTokens: run.promptTokens ?? 0,
    completionTokens: run.completionTokens ?? 0,
    totalIterations: run.totalIterations ?? 0,
  };

  if (input.includeSteps) {
    result.steps = MOCK_RUN_STEPS.filter((s) => s.runId === input.runId).map((s) => ({
      id: s.id,
      stepNumber: s.stepNumber,
      type: s.type,
      toolId: s.toolId,
      toolName: s.toolName,
      input: s.input,
      output: s.output,
      status: s.status,
      errorMessage: undefined,
      tokensUsed: s.tokensUsed,
      durationMs: s.durationMs,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
    }));
  }

  if (input.includeLogs) {
    result.logs = MOCK_RUN_LOGS.filter((l) => l.runId === input.runId).map((l) => ({
      id: l.id,
      stepId: l.stepId,
      level: l.level,
      message: l.message,
      data: l.data,
      source: l.source,
      timestamp: l.timestamp,
    }));
  }

  return result;
}

/**
 * Mock handler for GetRunMetricsQuery
 */
export async function mockGetRunMetricsHandler(
  input: GetRunMetricsInput
): Promise<RunMetrics> {
  const { agentId } = input;

  let runs = [...MOCK_RUNS];
  if (agentId) {
    runs = runs.filter((r) => r.agentId === agentId);
  }

  const completed = runs.filter((r) => r.status === 'COMPLETED');
  const failed = runs.filter((r) => r.status === 'FAILED');

  const totalTokens = runs.reduce((sum, r) => sum + r.totalTokens, 0);
  const totalCost = runs.reduce((sum, r) => sum + (r.estimatedCostUsd ?? 0), 0);
  const avgDuration =
    completed.length > 0
      ? completed.reduce((sum, r) => sum + (r.durationMs ?? 0), 0) / completed.length
      : 0;

  // Generate mock timeline
  const timeline: TimelineDataPoint[] = [
    { period: '2024-04-14', runs: 2, tokens: 7200, costUsd: 0.0168, avgDurationMs: 30000 },
    { period: '2024-04-15', runs: 3, tokens: 5550, costUsd: 0.0137, avgDurationMs: 3600 },
  ];

  return {
    totalRuns: runs.length,
    completedRuns: completed.length,
    failedRuns: failed.length,
    totalTokens,
    totalCostUsd: totalCost,
    averageDurationMs: avgDuration,
    successRate: runs.length > 0 ? completed.length / runs.length : 0,
    timeline,
  };
}

/**
 * Mock handler for ExecuteAgentCommand
 */
export async function mockExecuteAgentHandler(input: {
  agentId: string;
  input: { message: string; context?: Record<string, unknown> };
}) {
  // Simulate queuing a run
  return {
    runId: `run-${Date.now()}`,
    status: 'QUEUED' as const,
    estimatedWaitMs: 2000,
  };
}

/**
 * Mock handler for CancelRunCommand
 */
export async function mockCancelRunHandler(input: { runId: string; reason?: string }) {
  const run = MOCK_RUNS.find((r) => r.id === input.runId);
  if (!run) {
    throw new Error('RUN_NOT_FOUND');
  }

  if (!['QUEUED', 'IN_PROGRESS'].includes(run.status)) {
    throw new Error('RUN_NOT_CANCELLABLE');
  }

  return {
    success: true,
    status: 'CANCELLED' as const,
  };
}

