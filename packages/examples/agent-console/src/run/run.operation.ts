import {
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { GranularityEnum, LogLevelEnum, RunStatusEnum } from './run.enum';
import {
  RunInputModel,
  RunLogModel,
  RunModel,
  RunStepModel,
  RunSummaryModel,
  TimelineDataPointModel,
} from './run.schema';

const OWNERS = ['@agent-console-team'] as const;

/**
 * ExecuteAgentCommand - Starts a new agent run.
 */
export const ExecuteAgentCommand = defineCommand({
  meta: {
    key: 'agent.run.execute',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'execute'],
    description: 'Starts a new agent run with the given input.',
    goal: 'Execute an AI agent with user input.',
    context: 'Called from chat interface or API.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ExecuteAgentInput',
      fields: {
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        input: { type: RunInputModel, isOptional: false },
        sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
        stream: { type: ScalarTypeEnum.Boolean(), isOptional: true },
        maxIterations: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
        },
        timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
      },
    }),
    output: defineSchemaModel({
      name: 'ExecuteAgentOutput',
      fields: {
        runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        status: { type: RunStatusEnum, isOptional: false },
        estimatedWaitMs: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
        },
      },
    }),
    errors: {
      AGENT_NOT_FOUND: {
        description: 'The specified agent does not exist',
        http: 404,
        gqlCode: 'AGENT_NOT_FOUND',
        when: 'Agent ID is invalid',
      },
      AGENT_NOT_ACTIVE: {
        description: 'The specified agent is not active',
        http: 400,
        gqlCode: 'AGENT_NOT_ACTIVE',
        when: 'Agent is in draft/paused/archived state',
      },
    },
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'run.started',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['run', 'started'],
        when: 'Run is queued',
        payload: RunSummaryModel,
      },
    ],
    audit: ['run.started'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'execute-agent-happy-path',
        given: ['Agent exists', 'Agent is active'],
        when: ['User submits execution request'],
        then: ['Run is created', 'RunStarted event is emitted'],
      },
      {
        key: 'execute-agent-not-active',
        given: ['Agent exists but is not active'],
        when: ['User attempts to execute'],
        then: ['AGENT_NOT_ACTIVE error is returned'],
      },
    ],
    examples: [
      {
        key: 'basic-execute',
        input: { agentId: 'agent-123', input: { message: 'Hello' } },
        output: { runId: 'run-456', status: 'pending', estimatedWaitMs: 5000 },
      },
    ],
  },
});

/**
 * CancelRunCommand - Cancels an in-progress run.
 */
export const CancelRunCommand = defineCommand({
  meta: {
    key: 'agent.run.cancel',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'cancel'],
    description: 'Cancels an in-progress agent run.',
    goal: 'Stop a running agent execution.',
    context: 'Called when user wants to abort a long-running task.',
  },
  io: {
    input: defineSchemaModel({
      name: 'CancelRunInput',
      fields: {
        runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      },
    }),
    output: defineSchemaModel({
      name: 'CancelRunOutput',
      fields: {
        success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
        status: { type: RunStatusEnum, isOptional: false },
      },
    }),
    errors: {
      RUN_NOT_FOUND: {
        description: 'The specified run does not exist',
        http: 404,
        gqlCode: 'RUN_NOT_FOUND',
        when: 'Run ID is invalid',
      },
      RUN_NOT_CANCELLABLE: {
        description: 'The run cannot be cancelled',
        http: 400,
        gqlCode: 'RUN_NOT_CANCELLABLE',
        when: 'Run is already completed/failed/cancelled',
      },
    },
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'run.cancelled',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['run', 'cancelled'],
        when: 'Run is cancelled',
        payload: RunSummaryModel,
      },
    ],
    audit: ['run.cancelled'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'cancel-run-happy-path',
        given: ['Run exists', 'Run is in progress'],
        when: ['User cancels run'],
        then: ['Run is cancelled', 'RunCancelled event is emitted'],
      },
      {
        key: 'cancel-run-already-completed',
        given: ['Run exists but is already completed'],
        when: ['User attempts to cancel'],
        then: ['RUN_NOT_CANCELLABLE error is returned'],
      },
    ],
    examples: [
      {
        key: 'cancel-basic',
        input: { runId: 'run-456', reason: 'User requested' },
        output: { success: true, status: 'cancelled' },
      },
    ],
  },
});

/**
 * GetRunQuery - Retrieves a run by ID.
 */
export const GetRunQuery = defineQuery({
  meta: {
    key: 'agent.run.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'get'],
    description: 'Retrieves a run by its ID with optional details.',
    goal: 'View detailed run information.',
    context: 'Run details page or monitoring.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetRunInput',
      fields: {
        runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        includeSteps: { type: ScalarTypeEnum.Boolean(), isOptional: true },
        includeLogs: { type: ScalarTypeEnum.Boolean(), isOptional: true },
      },
    }),
    output: RunModel,
    errors: {
      RUN_NOT_FOUND: {
        description: 'The specified run does not exist',
        http: 404,
        gqlCode: 'RUN_NOT_FOUND',
        when: 'Run ID is invalid',
      },
    },
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-run-happy-path',
        given: ['Run exists'],
        when: ['User requests run by ID'],
        then: ['Run details are returned'],
      },
    ],
    examples: [
      {
        key: 'get-with-steps',
        input: { runId: 'run-456', includeSteps: true, includeLogs: false },
        output: { id: 'run-456', status: 'completed', steps: [] },
      },
    ],
  },
});

/**
 * ListRunsQuery - Lists runs for an organization or agent.
 */
export const ListRunsQuery = defineQuery({
  meta: {
    key: 'agent.run.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'list'],
    description: 'Lists runs with optional filtering.',
    goal: 'Browse and search run history.',
    context: 'Run history/dashboard view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ListRunsInput',
      fields: {
        organizationId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        status: { type: RunStatusEnum, isOptional: true },
        startDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
        endDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
        limit: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
          defaultValue: 20,
        },
        offset: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
          defaultValue: 0,
        },
      },
    }),
    output: defineSchemaModel({
      name: 'ListRunsOutput',
      fields: {
        items: { type: RunSummaryModel, isArray: true, isOptional: false },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-runs-happy-path',
        given: ['Organization has runs'],
        when: ['User lists runs'],
        then: ['Paginated list of runs is returned'],
      },
    ],
    examples: [
      {
        key: 'list-by-agent',
        input: { agentId: 'agent-123', limit: 20, offset: 0 },
        output: { items: [], total: 0, hasMore: false },
      },
    ],
  },
});

/**
 * GetRunStepsQuery - Retrieves steps for a run.
 */
export const GetRunStepsQuery = defineQuery({
  meta: {
    key: 'agent.run.getSteps',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'steps'],
    description: 'Retrieves all steps for a specific run.',
    goal: 'View step-by-step execution details.',
    context: 'Run details page - steps tab.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetRunStepsInput',
      fields: {
        runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: defineSchemaModel({
      name: 'GetRunStepsOutput',
      fields: {
        steps: { type: RunStepModel, isArray: true, isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-run-steps-happy-path',
        given: ['Run exists with steps'],
        when: ['User requests steps'],
        then: ['Steps list is returned'],
      },
    ],
    examples: [
      {
        key: 'get-steps-basic',
        input: { runId: 'run-456' },
        output: { steps: [] },
      },
    ],
  },
});

/**
 * GetRunLogsQuery - Retrieves logs for a run.
 */
export const GetRunLogsQuery = defineQuery({
  meta: {
    key: 'agent.run.getLogs',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'logs'],
    description: 'Retrieves all logs for a specific run.',
    goal: 'Debug and audit run execution.',
    context: 'Run details page - logs tab.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetRunLogsInput',
      fields: {
        runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        level: { type: LogLevelEnum, isOptional: true },
        stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        limit: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
          defaultValue: 100,
        },
        offset: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: true,
          defaultValue: 0,
        },
      },
    }),
    output: defineSchemaModel({
      name: 'GetRunLogsOutput',
      fields: {
        items: { type: RunLogModel, isArray: true, isOptional: false },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-run-logs-happy-path',
        given: ['Run exists with logs'],
        when: ['User requests logs'],
        then: ['Paginated logs list is returned'],
      },
    ],
    examples: [
      {
        key: 'get-logs-filtered',
        input: { runId: 'run-456', level: 'error', limit: 50 },
        output: { items: [], total: 0, hasMore: false },
      },
    ],
  },
});

/**
 * GetRunMetricsQuery - Retrieves aggregated metrics for runs.
 */
export const GetRunMetricsQuery = defineQuery({
  meta: {
    key: 'agent.run.getMetrics',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['run', 'metrics'],
    description: 'Retrieves aggregated metrics for runs within a time period.',
    goal: 'Monitor and analyze agent usage.',
    context: 'Analytics dashboard.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetRunMetricsInput',
      fields: {
        organizationId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        startDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
        endDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
        granularity: {
          type: GranularityEnum,
          isOptional: true,
          defaultValue: 'day',
        },
      },
    }),
    output: defineSchemaModel({
      name: 'GetRunMetricsOutput',
      fields: {
        totalRuns: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        completedRuns: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: false,
        },
        failedRuns: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        totalCostUsd: {
          type: ScalarTypeEnum.Float_unsecure(),
          isOptional: false,
        },
        averageDurationMs: {
          type: ScalarTypeEnum.Float_unsecure(),
          isOptional: false,
        },
        successRate: {
          type: ScalarTypeEnum.Float_unsecure(),
          isOptional: false,
        },
        timeline: {
          type: TimelineDataPointModel,
          isArray: true,
          isOptional: false,
        },
      },
    }),
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-run-metrics-happy-path',
        given: ['Organization has run history'],
        when: ['User requests metrics for date range'],
        then: ['Aggregated metrics are returned'],
      },
    ],
    examples: [
      {
        key: 'get-daily-metrics',
        input: {
          organizationId: 'org-123',
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          granularity: 'day',
        },
        output: {
          totalRuns: 100,
          completedRuns: 90,
          failedRuns: 10,
          totalTokens: 50000,
          totalCostUsd: 5.0,
          averageDurationMs: 2500,
          successRate: 0.9,
          timeline: [],
        },
      },
    ],
  },
});
