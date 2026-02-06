import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const ImpactSurfacesSchema = z.object({
  api: z.array(z.string().min(1)).optional(),
  db: z.array(z.string().min(1)).optional(),
  ui: z.array(z.string().min(1)).optional(),
  workflows: z.array(z.string().min(1)).optional(),
  policy: z.array(z.string().min(1)).optional(),
  docs: z.array(z.string().min(1)).optional(),
  tests: z.array(z.string().min(1)).optional(),
});

export const ImpactSurfacesModel = new ZodSchemaType(ImpactSurfacesSchema, {
  name: 'ImpactSurfaces',
});

export type ImpactSurfaces = z.infer<typeof ImpactSurfacesSchema>;

const ImpactReportSchema = z.object({
  reportId: z.string().min(1),
  patchId: z.string().min(1),
  summary: z.string().min(1),
  breaks: z.array(z.string().min(1)).optional(),
  mustChange: z.array(z.string().min(1)).optional(),
  risky: z.array(z.string().min(1)).optional(),
  surfaces: ImpactSurfacesSchema,
});

export const ImpactReportModel = new ZodSchemaType(ImpactReportSchema, {
  name: 'ImpactReport',
});

export type ImpactReport = z.infer<typeof ImpactReportSchema>;
