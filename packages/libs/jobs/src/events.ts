import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent, StabilityEnum } from '@contractspec/lib.contracts';

// ============ Event Payloads ============

const JobEnqueuedPayload = defineSchemaModel({
  name: 'JobEnqueuedEventPayload',
  description: 'Payload when a job is added to the queue',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    tenantId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    enqueuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobStartedPayload = defineSchemaModel({
  name: 'JobStartedEventPayload',
  description: 'Payload when a job starts processing',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attempt: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobCompletedPayload = defineSchemaModel({
  name: 'JobCompletedEventPayload',
  description: 'Payload when a job completes successfully',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attempt: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobFailedPayload = defineSchemaModel({
  name: 'JobFailedEventPayload',
  description: 'Payload when a job attempt fails',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attempt: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    error: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    willRetry: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    failedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobRetryingPayload = defineSchemaModel({
  name: 'JobRetryingEventPayload',
  description: 'Payload when a job is scheduled for retry',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attempt: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    nextAttemptAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    backoffMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const JobDeadLetteredPayload = defineSchemaModel({
  name: 'JobDeadLetteredEventPayload',
  description: 'Payload when a job is moved to dead letter queue',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attempts: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    lastError: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deadLetteredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobCancelledPayload = defineSchemaModel({
  name: 'JobCancelledEventPayload',
  description: 'Payload when a job is cancelled',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cancelledBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cancelledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ScheduledJobTriggeredPayload = defineSchemaModel({
  name: 'ScheduledJobTriggeredEventPayload',
  description: 'Payload when a scheduled job is triggered',
  fields: {
    scheduleName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jobType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    triggeredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    nextRunAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

// ============ Events ============

/**
 * Emitted when a job is enqueued.
 */
export const JobEnqueuedEvent = defineEvent({
  meta: {
    key: 'job.enqueued',
    version: 1,
    description: 'A job has been added to the queue.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle'],
  },
  payload: JobEnqueuedPayload,
});

/**
 * Emitted when a job starts processing.
 */
export const JobStartedEvent = defineEvent({
  meta: {
    key: 'job.started',
    version: 1,
    description: 'A job has started processing.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle'],
  },
  payload: JobStartedPayload,
});

/**
 * Emitted when a job completes successfully.
 */
export const JobCompletedEvent = defineEvent({
  meta: {
    key: 'job.completed',
    version: 1,
    description: 'A job has completed successfully.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle'],
  },
  payload: JobCompletedPayload,
});

/**
 * Emitted when a job fails (single attempt).
 */
export const JobFailedEvent = defineEvent({
  meta: {
    key: 'job.failed',
    version: 1,
    description: 'A job attempt has failed.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle', 'error'],
  },
  payload: JobFailedPayload,
});

/**
 * Emitted when a job is being retried.
 */
export const JobRetryingEvent = defineEvent({
  meta: {
    key: 'job.retrying',
    version: 1,
    description: 'A job is being scheduled for retry.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle', 'retry'],
  },
  payload: JobRetryingPayload,
});

/**
 * Emitted when a job is moved to dead letter queue.
 */
export const JobDeadLetteredEvent = defineEvent({
  meta: {
    key: 'job.dead_lettered',
    version: 1,
    description:
      'A job has exhausted all retries and moved to dead letter queue.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle', 'error'],
  },
  payload: JobDeadLetteredPayload,
});

/**
 * Emitted when a job is cancelled.
 */
export const JobCancelledEvent = defineEvent({
  meta: {
    key: 'job.cancelled',
    version: 1,
    description: 'A job has been cancelled.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'lifecycle'],
  },
  payload: JobCancelledPayload,
});

/**
 * Emitted when a scheduled job is triggered.
 */
export const ScheduledJobTriggeredEvent = defineEvent({
  meta: {
    key: 'scheduler.job_triggered',
    version: 1,
    description: 'A scheduled job has been triggered.',
    stability: StabilityEnum.Stable,
    owners: ['@contractspec.libs.jobs'],
    tags: ['job-queue', 'scheduler'],
  },
  payload: ScheduledJobTriggeredPayload,
});

/**
 * All job events.
 */
export const JobEvents = {
  JobEnqueuedEvent,
  JobStartedEvent,
  JobCompletedEvent,
  JobFailedEvent,
  JobRetryingEvent,
  JobDeadLetteredEvent,
  JobCancelledEvent,
  ScheduledJobTriggeredEvent,
};
