import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const ProblemSeveritySchema = z.enum(['low', 'medium', 'high']);
export type ProblemSeverity = z.infer<typeof ProblemSeveritySchema>;

const ProblemStatementSchema = z.object({
  problemId: z.string().min(1),
  statement: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).optional(),
  severity: ProblemSeveritySchema.optional(),
});

export const ProblemStatementModel = new ZodSchemaType(ProblemStatementSchema, {
  name: 'ProblemStatement',
});

export type ProblemStatement = z.infer<typeof ProblemStatementSchema>;

const ProblemGroupingSchema = z.object({
  problems: z.array(ProblemStatementSchema),
});

export const ProblemGroupingModel = new ZodSchemaType(ProblemGroupingSchema, {
  name: 'ProblemGrouping',
});

export type ProblemGrouping = z.infer<typeof ProblemGroupingSchema>;
