import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';
import { CitationModel } from './insights';

const EvidenceFindingSchema = z.object({
  findingId: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  citations: z.array(CitationModel.getZod()).min(1),
});

export const EvidenceFindingModel = new ZodSchemaType(EvidenceFindingSchema, {
  name: 'EvidenceFinding',
});

export type EvidenceFinding = z.infer<typeof EvidenceFindingSchema>;

const EvidenceFindingExtractionSchema = z.object({
  findings: z.array(EvidenceFindingSchema),
});

export const EvidenceFindingExtractionModel = new ZodSchemaType(
  EvidenceFindingExtractionSchema,
  {
    name: 'EvidenceFindingExtraction',
  }
);

export type EvidenceFindingExtraction = z.infer<
  typeof EvidenceFindingExtractionSchema
>;
