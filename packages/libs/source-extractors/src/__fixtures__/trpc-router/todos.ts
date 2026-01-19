/**
 * Fixture: tRPC Router
 *
 * A minimal tRPC router for testing extraction.
 */

import { z } from 'zod';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
const publicProcedure = t.procedure;

// Input/output schemas
const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
});

const createTodoInput = z.object({
  title: z.string().min(1),
});

const updateTodoInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
});

// Router
export const todoRouter = t.router({
  list: publicProcedure.output(z.array(todoSchema)).query(async () => {
    return [];
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(todoSchema.nullable())
    .query(async ({ input: _input }) => {
      return null;
    }),

  create: publicProcedure
    .input(createTodoInput)
    .output(todoSchema)
    .mutation(async ({ input }) => {
      return {
        id: 'new-id',
        title: input.title,
        completed: false,
        createdAt: new Date(),
      };
    }),

  update: publicProcedure
    .input(updateTodoInput)
    .output(todoSchema)
    .mutation(async ({ input }) => {
      return {
        id: input.id,
        title: input.title ?? 'Updated',
        completed: input.completed ?? false,
        createdAt: new Date(),
      };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(z.boolean())
    .mutation(async () => {
      return true;
    }),
});
