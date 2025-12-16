import { defineQuery } from '@lssm/lib.contracts';
import { z } from 'zod';

export const ListTasksOperation = defineQuery({
  meta: {
    name: 'team.task.list',
    version: 1,
    description: 'List all tasks with filtering',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['task', 'list', 'query'],
  },
  io: {
    input: z.object({
      spaceId: z.string().optional(),
      status: z.string().optional(),
      assigneeId: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    output: z.object({
      tasks: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          status: z.string(),
          spaceId: z.string(),
        })
      ),
      total: z.number(),
    }),
  },
});
