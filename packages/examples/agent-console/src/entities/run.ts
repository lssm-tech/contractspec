import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@lssm/lib.schema/entity';

/**
 * Run status for tracking execution lifecycle
 */
export const RunStatusEnum = defineEntityEnum({
  name: 'RunStatus',
  values: [
    'QUEUED', // Waiting to start
    'IN_PROGRESS', // Currently executing
    'COMPLETED', // Successfully finished
    'FAILED', // Encountered an error
    'CANCELLED', // User cancelled
    'EXPIRED', // Timed out
  ],
  description: 'Execution lifecycle status',
});

/**
 * Run entity - Represents an agent execution instance
 */
export const RunEntity = defineEntity({
  name: 'Run',
  schema: 'agent_console',
  description: 'Represents an agent execution instance.',
  fields: {
    id: field.id(),
    organizationId: field.string({
      description: 'Organization that owns this run',
    }),
    agentId: field.foreignKey({ description: 'Agent being executed' }),
    // Execution context
    userId: field.string({
      isOptional: true,
      description: 'User who initiated the run',
    }),
    sessionId: field.string({
      isOptional: true,
      description: 'Session ID for conversational context',
    }),
    parentRunId: field.string({
      isOptional: true,
      description: 'Parent run ID for nested agent calls',
    }),
    // Input/Output
    input: field.json({ description: 'Input data for the run' }),
    output: field.json({
      isOptional: true,
      description: 'Output data from the run',
    }),
    // Status
    status: field.enum('RunStatus', { default: 'QUEUED' }),
    errorMessage: field.string({
      isOptional: true,
      description: 'Error message if run failed',
    }),
    errorCode: field.string({
      isOptional: true,
      description: 'Error code if run failed',
    }),
    // Metrics
    totalTokens: field.int({ default: 0, description: 'Total tokens used' }),
    promptTokens: field.int({ default: 0, description: 'Prompt tokens used' }),
    completionTokens: field.int({
      default: 0,
      description: 'Completion tokens used',
    }),
    totalIterations: field.int({
      default: 0,
      description: 'Total iterations executed',
    }),
    durationMs: field.int({
      isOptional: true,
      description: 'Total duration in milliseconds',
    }),
    // Cost tracking
    estimatedCostUsd: field.float({
      isOptional: true,
      description: 'Estimated cost in USD',
    }),
    // Timestamps
    queuedAt: field.createdAt(),
    startedAt: field.dateTime({
      isOptional: true,
      description: 'When execution started',
    }),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When execution completed',
    }),
    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional run metadata',
    }),
    // Relations
    agent: field.belongsTo('Agent', ['agentId'], ['id']),
    parentRun: field.belongsTo('Run', ['parentRunId'], ['id']),
    steps: field.hasMany('RunStep'),
    logs: field.hasMany('RunLog'),
  },
  indexes: [
    index.on(['organizationId', 'status']),
    index.on(['organizationId', 'agentId']),
    index.on(['organizationId', 'userId']),
    index.on(['sessionId']),
    index.on(['queuedAt']),
  ],
  enums: [RunStatusEnum],
});

/**
 * Run step type
 */
export const RunStepTypeEnum = defineEntityEnum({
  name: 'RunStepType',
  values: [
    'MESSAGE_CREATION', // Agent generates a response
    'TOOL_CALL', // Agent calls a tool
    'TOOL_RESULT', // Tool returns a result
    'ERROR', // Step encountered an error
  ],
  description: 'Type of step in an agent run',
});

/**
 * RunStep entity - Individual step within a run
 */
export const RunStepEntity = defineEntity({
  name: 'RunStep',
  schema: 'agent_console',
  description: 'Represents an individual step within an agent run.',
  fields: {
    id: field.id(),
    runId: field.foreignKey({ description: 'Run ID' }),
    stepNumber: field.int({ description: 'Step number in sequence' }),
    type: field.enum('RunStepType'),
    // Step details
    toolId: field.string({
      isOptional: true,
      description: 'Tool ID if tool call',
    }),
    toolName: field.string({
      isOptional: true,
      description: 'Tool name for display',
    }),
    input: field.json({ isOptional: true, description: 'Step input data' }),
    output: field.json({ isOptional: true, description: 'Step output data' }),
    // Status
    status: field.enum('RunStatus', { default: 'IN_PROGRESS' }),
    errorMessage: field.string({
      isOptional: true,
      description: 'Error message if step failed',
    }),
    // Metrics
    tokensUsed: field.int({
      default: 0,
      description: 'Tokens used in this step',
    }),
    durationMs: field.int({
      isOptional: true,
      description: 'Step duration in milliseconds',
    }),
    // Timestamps
    startedAt: field.createdAt(),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When step completed',
    }),
    // Relations
    run: field.belongsTo('Run', ['runId'], ['id']),
    tool: field.belongsTo('Tool', ['toolId'], ['id']),
  },
  indexes: [
    index.on(['runId', 'stepNumber']),
    index.on(['runId', 'type']),
    index.on(['toolId']),
  ],
  enums: [RunStepTypeEnum],
});

/**
 * Log level
 */
export const LogLevelEnum = defineEntityEnum({
  name: 'LogLevel',
  values: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
  description: 'Log severity level',
});

/**
 * RunLog entity - Detailed execution logs
 */
export const RunLogEntity = defineEntity({
  name: 'RunLog',
  schema: 'agent_console',
  description: 'Detailed execution logs for debugging and auditing.',
  fields: {
    id: field.id(),
    runId: field.foreignKey({ description: 'Run ID' }),
    stepId: field.string({
      isOptional: true,
      description: 'Step ID if related to a specific step',
    }),
    level: field.enum('LogLevel', { default: 'INFO' }),
    message: field.string({ description: 'Log message' }),
    // Structured data
    data: field.json({ isOptional: true, description: 'Structured log data' }),
    // Context
    source: field.string({
      isOptional: true,
      description: "Log source: 'agent', 'tool', 'system'",
    }),
    traceId: field.string({
      isOptional: true,
      description: 'Trace ID for distributed tracing',
    }),
    spanId: field.string({
      isOptional: true,
      description: 'Span ID for distributed tracing',
    }),
    // Timestamp
    timestamp: field.createdAt(),
    // Relations
    run: field.belongsTo('Run', ['runId'], ['id']),
    step: field.belongsTo('RunStep', ['stepId'], ['id']),
  },
  indexes: [
    index.on(['runId', 'timestamp']),
    index.on(['runId', 'level']),
    index.on(['stepId']),
    index.on(['traceId']),
  ],
  enums: [LogLevelEnum],
});
