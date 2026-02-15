import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const TaskSurfaceSchema = z.enum([
  'api',
  'db',
  'ui',
  'workflows',
  'policy',
  'docs',
  'tests',
  'other',
]);

export type TaskSurface = z.infer<typeof TaskSurfaceSchema>;

const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  surface: z.array(TaskSurfaceSchema),
  why: z.string().min(1),
  acceptance: z.array(z.string().min(1)),
  agentPrompt: z.string().min(1),
  dependsOn: z.array(z.string().min(1)).optional(),
});

export const TaskModel = new ZodSchemaType(TaskSchema, {
  name: 'Task',
});

export type Task = z.infer<typeof TaskSchema>;

const TaskPackSchema = z.object({
  packId: z.string().min(1),
  patchId: z.string().min(1),
  overview: z.string().min(1),
  tasks: z.array(TaskSchema),
});

export const TaskPackModel = new ZodSchemaType(TaskPackSchema, {
  name: 'TaskPack',
});

export type TaskPack = z.infer<typeof TaskPackSchema>;
