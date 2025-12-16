import { defineQuery } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { JobModel } from './job.schema';

const OWNERS = ['@examples.service-business-os'] as const;

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
    name: 'service.job.list',
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
