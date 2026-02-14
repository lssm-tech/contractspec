import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const EvidenceChunkSchema = z.object({
  chunkId: z.string().min(1),
  text: z.string().min(1),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const EvidenceChunkModel = new ZodSchemaType(EvidenceChunkSchema, {
  name: 'EvidenceChunk',
});

export type EvidenceChunk = z.infer<typeof EvidenceChunkSchema>;
