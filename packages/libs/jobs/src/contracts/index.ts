import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

const OWNERS = ['platform.jobs'] as const;

// ============ Schema Models ============

export const JobModel = defineSchemaModel({
  name: 'Job',
  description: 'Represents a background job',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // JobStatus enum value
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    attempts: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    maxRetries: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    lastError: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ScheduledJobModel = defineSchemaModel({
  name: 'ScheduledJob',
  description: 'Represents a scheduled/recurring job',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cronExpression: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    timezone: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jobType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    enabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    lastRunAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    nextRunAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QueueStatsModel = defineSchemaModel({
  name: 'QueueStats',
  description: 'Job queue statistics',
  fields: {
    pending: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    running: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    failed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    deadLetter: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Input/Output Models ============

const EnqueueJobInput = defineSchemaModel({
  name: 'EnqueueJobInput',
  description: 'Input for enqueuing a new job',
  fields: {
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: false },
    delaySeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    dedupeKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    maxRetries: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    timeoutMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const GetJobInput = defineSchemaModel({
  name: 'GetJobInput',
  description: 'Input for getting a job by ID',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const CancelJobInput = defineSchemaModel({
  name: 'CancelJobInput',
  description: 'Input for cancelling a job',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const CancelJobOutput = defineSchemaModel({
  name: 'CancelJobOutput',
  description: 'Output for cancel job operation',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

const CreateScheduledJobInput = defineSchemaModel({
  name: 'CreateScheduledJobInput',
  description: 'Input for creating a scheduled job',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cronExpression: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    timezone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    jobType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    maxRetries: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    enabled: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const ListScheduledJobsOutput = defineSchemaModel({
  name: 'ListScheduledJobsOutput',
  description: 'Output for listing scheduled jobs',
  fields: {
    schedules: { type: ScheduledJobModel, isArray: true, isOptional: false },
  },
});

const ToggleScheduledJobInput = defineSchemaModel({
  name: 'ToggleScheduledJobInput',
  description: 'Input for toggling a scheduled job',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    enabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

// ============ Event Payloads ============

const JobEnqueuedPayload = defineSchemaModel({
  name: 'JobEnqueuedPayload',
  description: 'Payload for job.enqueued event',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    tenantId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    enqueuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobCancelledPayload = defineSchemaModel({
  name: 'JobCancelledPayload',
  description: 'Payload for job.cancelled event',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Enqueue a job.
 */
export const EnqueueJobContract = defineCommand({
  meta: {
    name: 'jobs.enqueue',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'enqueue'],
    description: 'Enqueue a background job for async processing.',
    goal: 'Allow services to offload work to background processing.',
    context: 'Called by any service that needs async processing.',
  },
  io: {
    input: EnqueueJobInput,
    output: JobModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'job.enqueued',
        version: 1,
        when: 'Job is enqueued',
        payload: JobEnqueuedPayload,
      },
    ],
  },
});

/**
 * Get job by ID.
 */
export const GetJobContract = defineQuery({
  meta: {
    name: 'jobs.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'get'],
    description: 'Get a job by ID.',
    goal: 'Check job status and result.',
    context: 'Called to poll job status or retrieve results.',
  },
  io: {
    input: GetJobInput,
    output: JobModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Cancel a job.
 */
export const CancelJobContract = defineCommand({
  meta: {
    name: 'jobs.cancel',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'cancel'],
    description: 'Cancel a pending job.',
    goal: 'Allow cancellation of jobs that are no longer needed.',
    context: 'Only pending jobs can be cancelled.',
  },
  io: {
    input: CancelJobInput,
    output: CancelJobOutput,
    errors: {
      JOB_NOT_FOUND: {
        description: 'Job does not exist',
        http: 404,
        gqlCode: 'JOB_NOT_FOUND',
        when: 'Job ID is invalid',
      },
      JOB_NOT_PENDING: {
        description: 'Job is not in pending state',
        http: 409,
        gqlCode: 'JOB_NOT_PENDING',
        when: 'Job has already started or completed',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'job.cancelled',
        version: 1,
        when: 'Job is cancelled',
        payload: JobCancelledPayload,
      },
    ],
  },
});

/**
 * Get queue statistics.
 */
export const GetQueueStatsContract = defineQuery({
  meta: {
    name: 'jobs.stats',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'stats', 'admin'],
    description: 'Get job queue statistics.',
    goal: 'Monitor queue health and backlog.',
    context: 'Admin dashboard monitoring.',
  },
  io: {
    input: null,
    output: QueueStatsModel,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Create a scheduled job.
 */
export const CreateScheduledJobContract = defineCommand({
  meta: {
    name: 'jobs.schedule.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'schedule', 'create'],
    description: 'Create a scheduled/recurring job.',
    goal: 'Set up recurring background tasks.',
    context: 'Admin configuration for periodic tasks.',
  },
  io: {
    input: CreateScheduledJobInput,
    output: ScheduledJobModel,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * List scheduled jobs.
 */
export const ListScheduledJobsContract = defineQuery({
  meta: {
    name: 'jobs.schedule.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'schedule', 'list'],
    description: 'List all scheduled jobs.',
    goal: 'View configured recurring tasks.',
    context: 'Admin dashboard.',
  },
  io: {
    input: null,
    output: ListScheduledJobsOutput,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Toggle scheduled job enabled state.
 */
export const ToggleScheduledJobContract = defineCommand({
  meta: {
    name: 'jobs.schedule.toggle',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['jobs', 'schedule', 'toggle'],
    description: 'Enable or disable a scheduled job.',
    goal: 'Control when recurring tasks run.',
    context: 'Admin control over scheduled tasks.',
  },
  io: {
    input: ToggleScheduledJobInput,
    output: ScheduledJobModel,
  },
  policy: {
    auth: 'admin',
  },
});
