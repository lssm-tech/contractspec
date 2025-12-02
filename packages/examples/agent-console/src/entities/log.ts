import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Log level enum.
 */
export const LogLevelEnum = defineEntityEnum({
  name: 'LogLevel',
  values: ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const,
  schema: 'agent',
  description: 'Log severity level.',
});

/**
 * Log type enum.
 */
export const LogTypeEnum = defineEntityEnum({
  name: 'LogType',
  values: [
    'MESSAGE',
    'TOOL_CALL',
    'TOOL_RESULT',
    'THINKING',
    'ERROR',
    'SYSTEM',
  ] as const,
  schema: 'agent',
  description: 'Type of log entry.',
});

/**
 * RunLog entity - detailed run logs.
 */
export const RunLogEntity = defineEntity({
  name: 'RunLog',
  description: 'A log entry within an agent run.',
  schema: 'agent',
  map: 'run_log',
  fields: {
    id: field.id(),

    // Parent
    runId: field.foreignKey(),

    // Type
    type: field.enum('LogType'),
    level: field.enum('LogLevel', { default: 'INFO' }),

    // Content
    role: field.string({
      isOptional: true,
      description: 'Message role (user, assistant, system, tool)',
    }),
    content: field.string({ description: 'Log content/message' }),

    // Metadata
    metadata: field.json({ isOptional: true }),

    // Sequence
    sequence: field.int({ description: 'Order within run' }),
    iteration: field.int({ isOptional: true }),

    // Tokens
    tokens: field.int({ isOptional: true }),

    // Timing
    timestamp: field.dateTime(),
    durationMs: field.int({ isOptional: true }),

    // Relations
    run: field.belongsTo('AgentRun', ['runId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['runId', 'sequence']), index.on(['runId', 'type'])],
  enums: [LogLevelEnum, LogTypeEnum],
});
