import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Scheduled job.
 */
export const JobModel = defineSchemaModel({
  name: 'Job',
  description: 'Scheduled job',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    assignedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for scheduling a job.
 */
export const ScheduleJobInputModel = defineSchemaModel({
  name: 'ScheduleJobInput',
  description: 'Input for scheduling a job',
  fields: {
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    assignedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    location: { type: ScalarTypeEnum.JSON(), isOptional: true },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for completing a job.
 */
export const CompleteJobInputModel = defineSchemaModel({
  name: 'CompleteJobInput',
  description: 'Input for completing a job',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});




