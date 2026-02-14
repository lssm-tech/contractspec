import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const CitationSchema = z.object({
  chunkId: z.string().min(1),
  quote: z.string().min(1),
});

export const CitationModel = new ZodSchemaType(CitationSchema, {
  name: 'Citation',
});

export type Citation = z.infer<typeof CitationSchema>;

const InsightSchema = z.object({
  insightId: z.string().min(1),
  claim: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  segment: z.string().min(1).optional(),
  confidence: z.number().min(0).max(1).optional(),
  citations: z.array(CitationSchema),
});

export const InsightModel = new ZodSchemaType(InsightSchema, {
  name: 'Insight',
});

export type Insight = z.infer<typeof InsightSchema>;

const InsightExtractionSchema = z.object({
  insights: z.array(InsightSchema),
});

export const InsightExtractionModel = new ZodSchemaType(
  InsightExtractionSchema,
  {
    name: 'InsightExtraction',
  }
);

export type InsightExtraction = z.infer<typeof InsightExtractionSchema>;
