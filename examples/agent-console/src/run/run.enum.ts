import { defineEnum } from '@contractspec/lib.schema';

/**
 * Run status enum.
 */
export const RunStatusEnum = defineEnum('RunStatus', [
  'QUEUED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
]);

/**
 * Run step type enum.
 */
export const RunStepTypeEnum = defineEnum('RunStepType', [
  'MESSAGE_CREATION',
  'TOOL_CALL',
  'TOOL_RESULT',
  'ERROR',
]);

/**
 * Log level enum.
 */
export const LogLevelEnum = defineEnum('LogLevel', [
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
]);

/**
 * Granularity enum for metrics.
 */
export const GranularityEnum = defineEnum('Granularity', [
  'hour',
  'day',
  'week',
  'month',
]);
