import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['agent-console-team'] as const;

// ============ Enums ============

export const RunStatusEnum = defineEnum('RunStatus', [
  'QUEUED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
]);

export const RunStepTypeEnum = defineEnum('RunStepType', [
  'MESSAGE_CREATION',
  'TOOL_CALL',
  'TOOL_RESULT',
  'ERROR',
]);

export const LogLevelEnum = defineEnum('LogLevel', [
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
]);

export const GranularityEnum = defineEnum('Granularity', [
  'hour',
  'day',
  'week',
  'month',
]);

// ============ Schemas ============

export const RunInputModel = defineSchemaModel({
  name: 'RunInput',
  description: 'Input data for agent execution',
  fields: {
    message: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    context: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const RunStepModel = defineSchemaModel({
  name: 'RunStep',
  description: 'Individual step within a run',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepNumber: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    type: { type: RunStepTypeEnum, isOptional: false },
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toolName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    input: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    status: { type: RunStatusEnum, isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tokensUsed: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 0,
    },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const RunLogModel = defineSchemaModel({
  name: 'RunLog',
  description: 'Execution log entry',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    level: { type: LogLevelEnum, isOptional: false },
    message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    data: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    spanId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const RunAgentRefModel = defineSchemaModel({
  name: 'RunAgentRef',
  description: 'Agent reference in a run',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    modelName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const RunModel = defineSchemaModel({
  name: 'Run',
  description: 'Agent execution instance',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    input: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    status: { type: RunStatusEnum, isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    errorCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    totalTokens: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 0,
    },
    promptTokens: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 0,
    },
    completionTokens: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 0,
    },
    totalIterations: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
      defaultValue: 0,
    },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    estimatedCostUsd: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    queuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    steps: { type: RunStepModel, isArray: true, isOptional: true },
    logs: { type: RunLogModel, isArray: true, isOptional: true },
    agent: { type: RunAgentRefModel, isOptional: true },
  },
});

export const RunSummaryModel = defineSchemaModel({
  name: 'RunSummary',
  description: 'Summary of a run for list views',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    status: { type: RunStatusEnum, isOptional: false },
    totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    estimatedCostUsd: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    queuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const TimelineDataPointModel = defineSchemaModel({
  name: 'TimelineDataPoint',
  description: 'Timeline data point for metrics',
  fields: {
    period: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    runs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    tokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    costUsd: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    avgDurationMs: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * ExecuteAgentCommand - Starts a new agent run
 */
export const ExecuteAgentCommand = defineCommand({
  meta: {
    name: 'agent.run.execute',
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
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'run.started',
        version: 1,
        when: 'Run is queued',
        payload: RunSummaryModel,
      },
    ],
    audit: ['run.started'],
  },
});

/**
 * CancelRunCommand - Cancels an in-progress run
 */
export const CancelRunCommand = defineCommand({
  meta: {
    name: 'agent.run.cancel',
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
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'run.cancelled',
        version: 1,
        when: 'Run is cancelled',
        payload: RunSummaryModel,
      },
    ],
    audit: ['run.cancelled'],
  },
});

/**
 * GetRunQuery - Retrieves a run by ID
 */
export const GetRunQuery = defineQuery({
  meta: {
    name: 'agent.run.get',
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
  policy: {
    auth: 'user',
  },
});

/**
 * ListRunsQuery - Lists runs for an organization or agent
 */
export const ListRunsQuery = defineQuery({
  meta: {
    name: 'agent.run.list',
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
  policy: {
    auth: 'user',
  },
});

/**
 * GetRunStepsQuery - Retrieves steps for a run
 */
export const GetRunStepsQuery = defineQuery({
  meta: {
    name: 'agent.run.getSteps',
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
  policy: {
    auth: 'user',
  },
});

/**
 * GetRunLogsQuery - Retrieves logs for a run
 */
export const GetRunLogsQuery = defineQuery({
  meta: {
    name: 'agent.run.getLogs',
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
  policy: {
    auth: 'user',
  },
});

/**
 * GetRunMetricsQuery - Retrieves aggregated metrics for runs
 */
export const GetRunMetricsQuery = defineQuery({
  meta: {
    name: 'agent.run.getMetrics',
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
  policy: {
    auth: 'user',
  },
});
