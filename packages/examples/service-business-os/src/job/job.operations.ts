import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import {
  JobModel,
  ScheduleJobInputModel,
  CompleteJobInputModel,
} from './job.schema';

const OWNERS = ['@examples.service-business-os'] as const;

// ============ List Jobs Query ============

export const ListJobsInputModel = defineSchemaModel({
  name: 'ListJobsInput',
  description: 'Input for listing jobs',
  fields: {
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const ListJobsOutputModel = defineSchemaModel({
  name: 'ListJobsOutput',
  description: 'Output for listing jobs',
  fields: {
    jobs: { type: JobModel, isOptional: false, isList: true },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const ListJobsOperation = defineQuery({
  meta: {
    key: 'service.job.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'job', 'list', 'query'],
    description: 'List all jobs with filtering',
    goal: 'Retrieve list of jobs',
    context: 'Job management',
  },
  io: {
    input: ListJobsInputModel,
    output: ListJobsOutputModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-jobs-happy-path',
        given: ['Jobs exist'],
        when: ['User lists jobs'],
        then: ['List of jobs is returned'],
      },
    ],
    examples: [
      {
        key: 'list-active',
        input: { status: 'scheduled', limit: 10 },
        output: { jobs: [], total: 5 },
      },
    ],
  },
});

// ============ Job Commands ============

/**
 * Schedule a job.
 */
export const ScheduleJobContract = defineCommand({
  meta: {
    key: 'service.job.schedule',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'job', 'schedule'],
    description: 'Schedule a job.',
    goal: 'Schedule work.',
    context: 'Job scheduling.',
  },
  io: {
    input: ScheduleJobInputModel,
    output: JobModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'schedule-job-happy-path',
        given: ['Client exists'],
        when: ['User schedules job'],
        then: ['Job is created with status SCHEDULED'],
      },
    ],
    examples: [
      {
        key: 'schedule-repair',
        input: {
          clientId: 'client-123',
          date: '2025-01-20T10:00:00Z',
          type: 'repair',
        },
        output: { id: 'job-456', status: 'scheduled' },
      },
    ],
  },
});

/**
 * Complete a job.
 */
export const CompleteJobContract = defineCommand({
  meta: {
    key: 'service.job.complete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'job', 'complete'],
    description: 'Mark a job as complete.',
    goal: 'Record job completion.',
    context: 'Job management.',
  },
  io: {
    input: CompleteJobInputModel,
    output: JobModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'complete-job-happy-path',
        given: ['Job is scheduled'],
        when: ['User completes job'],
        then: ['Job status becomes COMPLETED'],
      },
    ],
    examples: [
      {
        key: 'mark-complete',
        input: { jobId: 'job-456', notes: 'Done successfully' },
        output: { id: 'job-456', status: 'completed' },
      },
    ],
  },
});
