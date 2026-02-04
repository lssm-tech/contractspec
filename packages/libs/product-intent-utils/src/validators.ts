import { z } from 'zod';
import {
  CitationSchema,
  ContractPatchIntentSchema,
  type EvidenceChunk,
  ImpactReportSchema,
  InsightExtractionSchema,
  OpportunityBriefSchema,
  TaskPackSchema,
} from '@contractspec/lib.contracts/product-intent/types';

/**
 * Parse a raw string as JSON and validate it against a Zod schema. If
 * the string is not valid JSON or fails schema validation, an error
 * will be thrown. Leading/trailing whitespace is ignored. The model
 * must not wrap JSON output in markdown fences.
 */
export function parseStrictJSON<T>(schema: z.ZodSchema<T>, raw: string): T {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    throw new Error('Model did not return JSON (missing leading { or [)');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e?.message ?? e}`);
  }
  return schema.parse(parsed);
}

/**
 * Build an index of evidence chunks keyed by chunkId. This allows
 * constant‑time lookup of chunk text and metadata when validating
 * citations.
 */
export function buildChunkIndex(chunks: EvidenceChunk[]) {
  const map = new Map<string, EvidenceChunk>();
  for (const c of chunks) map.set(c.chunkId, c);
  return map;
}

/**
 * Validate a single citation. Ensures the referenced chunk exists and
 * the quoted text is an exact substring of the chunk text. Throws
 * descriptive errors when validation fails.
 */
export function validateCitation(
  citation: unknown,
  chunkIndex: Map<string, EvidenceChunk>,
  opts?: { maxQuoteLen?: number; requireExactSubstring?: boolean }
): ReturnType<typeof CitationSchema.parse> {
  const maxQuoteLen = opts?.maxQuoteLen ?? 240;
  const requireExactSubstring = opts?.requireExactSubstring ?? true;
  const c = CitationSchema.parse(citation);
  if (c.quote.length > maxQuoteLen) {
    throw new Error(
      `Citation quote too long (${c.quote.length} > ${maxQuoteLen})`
    );
  }
  const chunk = chunkIndex.get(c.chunkId);
  if (!chunk) {
    throw new Error(`Citation references unknown chunkId: ${c.chunkId}`);
  }
  if (requireExactSubstring) {
    if (!chunk.text.includes(c.quote)) {
      throw new Error(
        `Citation quote is not an exact substring of chunk ${c.chunkId}`
      );
    }
  }
  return c;
}

/**
 * Validate citations embedded within a text block. Ensures that the
 * citations array is present and each citation is valid. Throws on
 * missing citations or invalid entries.
 */
export function validateCitationsInTextBlock(
  block: { text: string; citations: unknown[] },
  chunkIndex: Map<string, EvidenceChunk>
) {
  if (!block?.citations?.length) {
    throw new Error('Missing required citations');
  }
  const citations = block.citations.map((c) => validateCitation(c, chunkIndex));
  return { text: block.text, citations };
}

/**
 * Validate a raw JSON string as an OpportunityBrief, ensuring citations
 * reference actual chunks and quotes are exact substrings. Returns the
 * parsed and validated brief.
 */
export function validateOpportunityBrief(raw: string, chunks: EvidenceChunk[]) {
  const chunkIndex = buildChunkIndex(chunks);
  const brief = parseStrictJSON(OpportunityBriefSchema, raw);
  // Validate citation fields
  validateCitationsInTextBlock(brief.problem, chunkIndex);
  validateCitationsInTextBlock(brief.who, chunkIndex);
  validateCitationsInTextBlock(brief.proposedChange, chunkIndex);
  // Validate risk citations if present
  if (brief.risks) {
    for (const r of brief.risks) {
      if (r.citations) {
        for (const c of r.citations) validateCitation(c, chunkIndex);
      }
    }
  }
  return brief;
}

/**
 * Validate a raw JSON string as an InsightExtraction. Ensures that
 * each insight contains citations that reference actual chunks.
 */
export function validateInsightExtraction(
  raw: string,
  chunks: EvidenceChunk[]
) {
  const chunkIndex = buildChunkIndex(chunks);
  const data = parseStrictJSON(InsightExtractionSchema, raw);
  for (const ins of data.insights) {
    if (!ins.citations?.length) {
      throw new Error(`Insight ${ins.insightId} has no citations`);
    }
    for (const c of ins.citations) validateCitation(c, chunkIndex);
  }
  return data;
}

/**
 * Validate a raw JSON string as a ContractPatchIntent.
 */
export function validatePatchIntent(raw: string) {
  return parseStrictJSON(ContractPatchIntentSchema, raw);
}

/**
 * Validate a raw JSON string as an ImpactReport.
 */
export function validateImpactReport(raw: string) {
  return parseStrictJSON(ImpactReportSchema, raw);
}

/**
 * Validate a raw JSON string as a TaskPack.
 */
export function validateTaskPack(raw: string) {
  return parseStrictJSON(TaskPackSchema, raw);
}

/**
 * Build a repair prompt from a validation error. Use this message as
 * the system instruction when asking the model to regenerate a
 * response that previously failed validation.
 */
export function buildRepairPrompt(error: string): string {
  return [
    'Your previous output failed validation.',
    'Fix the output and return JSON ONLY (no markdown, no commentary).',
    'Validation error:',
    error,
  ].join('\n');
}
