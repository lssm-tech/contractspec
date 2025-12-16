import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@lssm/lib.schema/entity';

/**
 * Run status enum for entities.
 */
export const RunStatusEntityEnum = defineEntityEnum({
  name: 'RunStatus',
  values: [
    'QUEUED',
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'EXPIRED',
  ],
  description: 'Status of an agent run',
});

/**
 * Run step type enum for entities.
 */
export const RunStepTypeEntityEnum = defineEntityEnum({
  name: 'RunStepType',
  values: ['MESSAGE_CREATION', 'TOOL_CALL', 'TOOL_RESULT', 'ERROR'],
  description: 'Type of run step',
});

/**
 * Log level enum for entities.
 */
export const LogLevelEntityEnum = defineEntityEnum({
  name: 'LogLevel',
  values: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
  description: 'Log level',
});

/**
 * Run entity - Represents an agent execution.
 */
export const RunEntity = defineEntity({
  name: 'Run',
  schema: 'agent_console',
  description: 'An execution of an agent with input/output and metrics.',
  fields: {
    id: field.id(),
    organizationId: field.string({ description: 'Organization ID' }),
    agentId: field.foreignKey({ description: 'Agent being executed' }),
    userId: field.string({
      isOptional: true,
      description: 'User who initiated the run',
    }),
    sessionId: field.string({
      isOptional: true,
      description: 'Conversation session ID',
    }),
    input: field.json({ description: 'Input data for the run' }),
    output: field.json({
      isOptional: true,
      description: 'Output result from the run',
    }),
    status: field.enum('RunStatus', { default: 'QUEUED' }),
    errorMessage: field.string({
      isOptional: true,
      description: 'Error message if failed',
    }),
    errorCode: field.string({
      isOptional: true,
      description: 'Error code if failed',
    }),
    totalTokens: field.int({ default: 0, description: 'Total tokens used' }),
    promptTokens: field.int({ default: 0, description: 'Prompt tokens used' }),
    completionTokens: field.int({
      default: 0,
      description: 'Completion tokens used',
    }),
    totalIterations: field.int({
      default: 0,
      description: 'Number of iterations',
    }),
    durationMs: field.int({
      isOptional: true,
      description: 'Execution duration in ms',
    }),
    estimatedCostUsd: field.float({
      isOptional: true,
      description: 'Estimated cost in USD',
    }),
    queuedAt: field.dateTime({ description: 'When run was queued' }),
    startedAt: field.dateTime({
      isOptional: true,
      description: 'When run started executing',
    }),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When run completed',
    }),
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),
    agent: field.belongsTo('Agent', ['agentId'], ['id']),
    steps: field.hasMany('RunStep', { description: 'Execution steps' }),
    logs: field.hasMany('RunLog', { description: 'Execution logs' }),
  },
  indexes: [
    index.on(['organizationId', 'agentId', 'queuedAt']),
    index.on(['organizationId', 'status']),
    index.on(['agentId', 'status']),
    index.on(['sessionId']),
  ],
  enums: [RunStatusEntityEnum],
});

/**
 * RunStep entity - Individual step in a run.
 */
export const RunStepEntity = defineEntity({
  name: 'RunStep',
  schema: 'agent_console',
  description: 'An individual step in an agent run.',
  fields: {
    id: field.id(),
    runId: field.foreignKey({ description: 'Parent run' }),
    stepNumber: field.int({ description: 'Step sequence number' }),
    type: field.enum('RunStepType'),
    toolId: field.string({
      isOptional: true,
      description: 'Tool used in this step',
    }),
    toolName: field.string({ isOptional: true, description: 'Tool name' }),
    input: field.json({ isOptional: true, description: 'Step input' }),
    output: field.json({ isOptional: true, description: 'Step output' }),
    status: field.enum('RunStatus'),
    errorMessage: field.string({ isOptional: true }),
    tokensUsed: field.int({ default: 0 }),
    durationMs: field.int({ isOptional: true }),
    startedAt: field.dateTime(),
    completedAt: field.dateTime({ isOptional: true }),
    run: field.belongsTo('Run', ['runId'], ['id']),
  },
  indexes: [index.on(['runId', 'stepNumber'])],
  enums: [RunStepTypeEntityEnum],
});

/**
 * RunLog entity - Log entry for a run.
 */
export const RunLogEntity = defineEntity({
  name: 'RunLog',
  schema: 'agent_console',
  description: 'A log entry for an agent run.',
  fields: {
    id: field.id(),
    runId: field.foreignKey({ description: 'Parent run' }),
    stepId: field.string({ isOptional: true, description: 'Related step' }),
    level: field.enum('LogLevel'),
    message: field.string({ description: 'Log message' }),
    data: field.json({ isOptional: true, description: 'Additional log data' }),
    source: field.string({
      isOptional: true,
      description: 'Log source component',
    }),
    traceId: field.string({ isOptional: true }),
    spanId: field.string({ isOptional: true }),
    timestamp: field.dateTime(),
    run: field.belongsTo('Run', ['runId'], ['id']),
  },
  indexes: [index.on(['runId', 'timestamp']), index.on(['runId', 'level'])],
  enums: [LogLevelEntityEnum],
});
