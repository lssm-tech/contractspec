import { defineQuery } from '@lssm/lib.contracts';
import { z } from 'zod';

export const ListJobsOperation = defineQuery({
  meta: {
    name: 'service.job.list',
    version: 1,
    description: 'List all jobs with filtering',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['job', 'list', 'query'],
  },
  io: {
    input: z.object({
      status: z.string().optional(),
      clientId: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    output: z.object({
      jobs: z.array(
        z.object({
          id: z.string(),
          status: z.string(),
          clientId: z.string(),
          scheduledDate: z.string(),
        })
      ),
      total: z.number(),
    }),
  },
});
