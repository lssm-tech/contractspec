import { defineCommand } from '@lssm/lib.contracts';
import { JobModel, ScheduleJobInputModel, CompleteJobInputModel } from './job.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Schedule a job.
 */
export const ScheduleJobContract = defineCommand({
  meta: {
    name: 'service.job.schedule',
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
    name: 'service.job.complete',
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




