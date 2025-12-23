import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

/**
 * Job status enum.
 */
export const JobStatusEnum = defineEntityEnum({
  name: 'JobStatus',
  values: [
    'PENDING',
    'RUNNING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'DEAD_LETTER',
  ] as const,
  schema: 'lssm_jobs',
  description: 'Status of a background job.',
});

/**
 * Job entity - represents a single job execution.
 */
export const JobEntity = defineEntity({
  name: 'Job',
  description: 'A background job for async processing.',
  schema: 'lssm_jobs',
  map: 'job',
  fields: {
    id: field.id({ description: 'Unique job identifier' }),
    type: field.string({ description: 'Job type identifier' }),
    version: field.int({ default: 1, description: 'Job type version' }),
    payload: field.json({ description: 'Job payload data' }),
    status: field.enum('JobStatus', { default: 'PENDING' }),
    priority: field.int({ default: 0, description: 'Higher = more urgent' }),

    // Execution tracking
    attempts: field.int({
      default: 0,
      description: 'Number of execution attempts',
    }),
    maxRetries: field.int({
      default: 3,
      description: 'Maximum retry attempts',
    }),
    lastError: field.string({
      isOptional: true,
      description: 'Last error message',
    }),
    lastErrorStack: field.string({
      isOptional: true,
      description: 'Last error stack trace',
    }),

    // Timing
    scheduledAt: field.dateTime({
      isOptional: true,
      description: 'When job should be processed',
    }),
    startedAt: field.dateTime({
      isOptional: true,
      description: 'When processing started',
    }),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When processing completed',
    }),
    timeoutAt: field.dateTime({
      isOptional: true,
      description: 'Job timeout deadline',
    }),

    // Deduplication
    dedupeKey: field.string({
      isOptional: true,
      description: 'Key for deduplication',
    }),

    // Context
    tenantId: field.string({
      isOptional: true,
      description: 'Tenant/org context',
    }),
    userId: field.string({
      isOptional: true,
      description: 'User who enqueued',
    }),
    traceId: field.string({
      isOptional: true,
      description: 'Distributed trace ID',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),
    result: field.json({ isOptional: true, description: 'Job result data' }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    scheduledJob: field.belongsTo('ScheduledJob', ['scheduledJobId'], ['id']),
    scheduledJobId: field.string({ isOptional: true }),
    executions: field.hasMany('JobExecution'),
  },
  indexes: [
    index.on(['status', 'scheduledAt']),
    index.on(['type', 'status']),
    index.on(['tenantId', 'status']),
    index.unique(['dedupeKey'], { name: 'job_dedupe_key_unique' }),
  ],
  enums: [JobStatusEnum],
});

/**
 * ScheduledJob entity - recurring job definitions.
 */
export const ScheduledJobEntity = defineEntity({
  name: 'ScheduledJob',
  description: 'A scheduled/recurring job definition.',
  schema: 'lssm_jobs',
  map: 'scheduled_job',
  fields: {
    id: field.id(),
    name: field.string({ isUnique: true, description: 'Unique schedule name' }),
    description: field.string({ isOptional: true }),

    // Schedule definition
    cronExpression: field.string({
      description: 'Cron expression for scheduling',
    }),
    timezone: field.string({
      default: '"UTC"',
      description: 'Timezone for cron evaluation',
    }),

    // Job template
    jobType: field.string({ description: 'Job type to create' }),
    jobVersion: field.int({ default: 1 }),
    payload: field.json({
      isOptional: true,
      description: 'Default payload for created jobs',
    }),

    // Execution settings
    maxRetries: field.int({ default: 3 }),
    timeoutMs: field.int({
      isOptional: true,
      description: 'Job timeout in milliseconds',
    }),

    // State
    enabled: field.boolean({ default: true }),
    lastRunAt: field.dateTime({ isOptional: true }),
    nextRunAt: field.dateTime({ isOptional: true }),

    // Context
    tenantId: field.string({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    jobs: field.hasMany('Job'),
  },
  indexes: [index.on(['enabled', 'nextRunAt'])],
});

/**
 * JobExecution entity - individual execution attempts.
 */
export const JobExecutionEntity = defineEntity({
  name: 'JobExecution',
  description: 'A single execution attempt of a job.',
  schema: 'lssm_jobs',
  map: 'job_execution',
  fields: {
    id: field.id(),
    jobId: field.foreignKey(),
    attemptNumber: field.int({ description: 'Which attempt this is' }),

    // Execution details
    startedAt: field.dateTime(),
    completedAt: field.dateTime({ isOptional: true }),
    durationMs: field.int({ isOptional: true }),

    // Result
    success: field.boolean({ isOptional: true }),
    error: field.string({ isOptional: true }),
    errorStack: field.string({ isOptional: true }),
    result: field.json({ isOptional: true }),

    // Worker info
    workerId: field.string({
      isOptional: true,
      description: 'ID of worker that processed',
    }),

    // Relations
    job: field.belongsTo('Job', ['jobId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [index.on(['jobId', 'attemptNumber'])],
});

/**
 * All job entities for schema composition.
 */
export const jobEntities = [JobEntity, ScheduledJobEntity, JobExecutionEntity];

/**
 * Module schema contribution for jobs.
 */
export const jobsSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/lib.jobs',
  entities: jobEntities,
  enums: [JobStatusEnum],
};
