import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
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
    version: 1,
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
});

// ============ Job Commands ============

/**
 * Schedule a job.
 */
export const ScheduleJobContract = defineCommand({
  meta: {
    key: 'service.job.schedule',
    version: 1,
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
});

/**
 * Complete a job.
 */
export const CompleteJobContract = defineCommand({
  meta: {
    key: 'service.job.complete',
    version: 1,
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
});
