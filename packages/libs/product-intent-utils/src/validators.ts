import type { SchemaModelType } from '@contractspec/lib.schema';
import {
  CitationModel,
  type ContractPatchIntent,
  ContractPatchIntentModel,
  type EvidenceChunk,
  type ImpactReport,
  ImpactReportModel,
  type InsightExtraction,
  InsightExtractionModel,
  type OpportunityBrief,
  OpportunityBriefModel,
  type TaskPack,
  TaskPackModel,
} from '@contractspec/lib.contracts-spec/product-intent/types';

interface LengthBounds {
  min?: number;
  max?: number;
}

function assertStringLength(
  value: string,
  path: string,
  bounds: LengthBounds
): void {
  if (bounds.min !== undefined && value.length < bounds.min) {
    throw new Error(
      `Expected ${path} to be at least ${bounds.min} characters, got ${value.length}`
    );
  }
  if (bounds.max !== undefined && value.length > bounds.max) {
    throw new Error(
      `Expected ${path} to be at most ${bounds.max} characters, got ${value.length}`
    );
  }
}

function assertArrayLength<T>(
  value: T[],
  path: string,
  bounds: LengthBounds
): void {
  if (bounds.min !== undefined && value.length < bounds.min) {
    throw new Error(
      `Expected ${path} to have at least ${bounds.min} items, got ${value.length}`
    );
  }
  if (bounds.max !== undefined && value.length > bounds.max) {
    throw new Error(
      `Expected ${path} to have at most ${bounds.max} items, got ${value.length}`
    );
  }
}

function assertNumberRange(
  value: number,
  path: string,
  bounds: { min?: number; max?: number }
): void {
  if (bounds.min !== undefined && value < bounds.min) {
    throw new Error(`Expected ${path} to be >= ${bounds.min}, got ${value}`);
  }
  if (bounds.max !== undefined && value > bounds.max) {
    throw new Error(`Expected ${path} to be <= ${bounds.max}, got ${value}`);
  }
}

/**
 * Parse a raw string as JSON and validate it against a SchemaModelType.
 */
export function parseStrictJSON<T>(schema: SchemaModelType, raw: string): T {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    throw new Error('Model did not return JSON (missing leading { or [)');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON: ${message}`);
  }
  return schema.getZod().parse(parsed) as T;
}

/**
 * Build an index of evidence chunks keyed by chunkId.
 */
export function buildChunkIndex(
  chunks: EvidenceChunk[]
): Map<string, EvidenceChunk> {
  const map = new Map<string, EvidenceChunk>();
  for (const chunk of chunks) {
    map.set(chunk.chunkId, chunk);
  }
  return map;
}

/**
 * Validate a single citation. Ensures the referenced chunk exists and
 * the quoted text is an exact substring of the chunk text.
 */
export function validateCitation(
  citation: unknown,
  chunkIndex: Map<string, EvidenceChunk>,
  opts?: { maxQuoteLen?: number; requireExactSubstring?: boolean }
) {
  const maxQuoteLen = opts?.maxQuoteLen ?? 240;
  const requireExactSubstring = opts?.requireExactSubstring ?? true;
  const parsed = CitationModel.getZod().parse(citation);

  assertStringLength(parsed.quote, 'citation.quote', {
    min: 1,
    max: maxQuoteLen,
  });

  const chunk = chunkIndex.get(parsed.chunkId);
  if (!chunk) {
    throw new Error(`Citation references unknown chunkId: ${parsed.chunkId}`);
  }
  if (requireExactSubstring && !chunk.text.includes(parsed.quote)) {
    throw new Error(
      `Citation quote is not an exact substring of chunk ${parsed.chunkId}`
    );
  }
  return parsed;
}

/**
 * Validate citations embedded within a text block.
 */
export function validateCitationsInTextBlock(
  block: { text: string; citations: unknown[] },
  chunkIndex: Map<string, EvidenceChunk>
) {
  assertStringLength(block.text, 'textBlock.text', { min: 1 });
  if (!block.citations?.length) {
    throw new Error('Missing required citations');
  }
  const citations = block.citations.map((c) => validateCitation(c, chunkIndex));
  return { text: block.text, citations };
}

/**
 * Validate a raw JSON string as an OpportunityBrief, ensuring citations
 * reference actual chunks and quotes are exact substrings.
 */
export function validateOpportunityBrief(
  raw: string,
  chunks: EvidenceChunk[]
): OpportunityBrief {
  const chunkIndex = buildChunkIndex(chunks);
  const brief = parseStrictJSON<OpportunityBrief>(OpportunityBriefModel, raw);

  assertStringLength(brief.opportunityId, 'opportunityId', { min: 1 });
  assertStringLength(brief.title, 'title', { min: 1, max: 120 });

  validateCitationsInTextBlock(brief.problem, chunkIndex);
  validateCitationsInTextBlock(brief.who, chunkIndex);
  validateCitationsInTextBlock(brief.proposedChange, chunkIndex);

  assertStringLength(brief.expectedImpact.metric, 'expectedImpact.metric', {
    min: 1,
    max: 64,
  });
  if (brief.expectedImpact.magnitudeHint) {
    assertStringLength(
      brief.expectedImpact.magnitudeHint,
      'expectedImpact.magnitudeHint',
      { max: 64 }
    );
  }
  if (brief.expectedImpact.timeframeHint) {
    assertStringLength(
      brief.expectedImpact.timeframeHint,
      'expectedImpact.timeframeHint',
      { max: 64 }
    );
  }

  if (brief.risks) {
    for (const risk of brief.risks) {
      assertStringLength(risk.text, 'risks[].text', { min: 1, max: 240 });
      if (risk.citations) {
        for (const c of risk.citations) {
          validateCitation(c, chunkIndex);
        }
      }
    }
  }
  return brief;
}

/**
 * Validate a raw JSON string as an InsightExtraction.
 */
export function validateInsightExtraction(
  raw: string,
  chunks: EvidenceChunk[]
): InsightExtraction {
  const chunkIndex = buildChunkIndex(chunks);
  const data = parseStrictJSON<InsightExtraction>(InsightExtractionModel, raw);

  assertArrayLength(data.insights, 'insights', { min: 1, max: 30 });
  for (const insight of data.insights) {
    assertStringLength(insight.insightId, 'insights[].insightId', { min: 1 });
    assertStringLength(insight.claim, 'insights[].claim', {
      min: 1,
      max: 320,
    });
    if (insight.tags) {
      for (const tag of insight.tags) {
        assertStringLength(tag, 'insights[].tags[]', { min: 1 });
      }
    }
    if (insight.confidence !== undefined) {
      assertNumberRange(insight.confidence, 'insights[].confidence', {
        min: 0,
        max: 1,
      });
    }
    assertArrayLength(insight.citations, 'insights[].citations', { min: 1 });
    for (const c of insight.citations) {
      validateCitation(c, chunkIndex);
    }
  }
  return data;
}

/**
 * Validate a raw JSON string as a ContractPatchIntent.
 */
export function validatePatchIntent(raw: string): ContractPatchIntent {
  const data = parseStrictJSON<ContractPatchIntent>(
    ContractPatchIntentModel,
    raw
  );

  assertStringLength(data.featureKey, 'featureKey', { min: 1, max: 80 });
  assertArrayLength(data.changes, 'changes', { min: 1, max: 25 });
  for (const change of data.changes) {
    assertStringLength(change.target, 'changes[].target', { min: 1 });
    assertStringLength(change.detail, 'changes[].detail', { min: 1 });
  }
  assertArrayLength(data.acceptanceCriteria, 'acceptanceCriteria', {
    min: 1,
    max: 12,
  });
  for (const item of data.acceptanceCriteria) {
    assertStringLength(item, 'acceptanceCriteria[]', { min: 1, max: 140 });
  }
  return data;
}

/**
 * Validate a raw JSON string as an ImpactReport.
 */
export function validateImpactReport(raw: string): ImpactReport {
  const data = parseStrictJSON<ImpactReport>(ImpactReportModel, raw);

  assertStringLength(data.reportId, 'reportId', { min: 1 });
  assertStringLength(data.patchId, 'patchId', { min: 1 });
  assertStringLength(data.summary, 'summary', { min: 1, max: 200 });

  if (data.breaks) {
    for (const item of data.breaks) {
      assertStringLength(item, 'breaks[]', { min: 1, max: 160 });
    }
  }
  if (data.mustChange) {
    for (const item of data.mustChange) {
      assertStringLength(item, 'mustChange[]', { min: 1, max: 160 });
    }
  }
  if (data.risky) {
    for (const item of data.risky) {
      assertStringLength(item, 'risky[]', { min: 1, max: 160 });
    }
  }
  const surfaces = data.surfaces;
  if (surfaces.api) {
    for (const item of surfaces.api) {
      assertStringLength(item, 'surfaces.api[]', { min: 1, max: 140 });
    }
  }
  if (surfaces.db) {
    for (const item of surfaces.db) {
      assertStringLength(item, 'surfaces.db[]', { min: 1, max: 140 });
    }
  }
  if (surfaces.ui) {
    for (const item of surfaces.ui) {
      assertStringLength(item, 'surfaces.ui[]', { min: 1, max: 140 });
    }
  }
  if (surfaces.workflows) {
    for (const item of surfaces.workflows) {
      assertStringLength(item, 'surfaces.workflows[]', { min: 1, max: 140 });
    }
  }
  if (surfaces.policy) {
    for (const item of surfaces.policy) {
      assertStringLength(item, 'surfaces.policy[]', { min: 1, max: 140 });
    }
  }
  if (surfaces.docs) {
    for (const item of surfaces.docs) {
      assertStringLength(item, 'surfaces.docs[]', { min: 1, max: 140 });
    }
  }
  if (surfaces.tests) {
    for (const item of surfaces.tests) {
      assertStringLength(item, 'surfaces.tests[]', { min: 1, max: 140 });
    }
  }
  return data;
}

/**
 * Validate a raw JSON string as a TaskPack.
 */
export function validateTaskPack(raw: string): TaskPack {
  const data = parseStrictJSON<TaskPack>(TaskPackModel, raw);

  assertStringLength(data.packId, 'packId', { min: 1 });
  assertStringLength(data.patchId, 'patchId', { min: 1 });
  assertStringLength(data.overview, 'overview', { min: 1, max: 240 });
  assertArrayLength(data.tasks, 'tasks', { min: 3, max: 14 });

  for (const task of data.tasks) {
    assertStringLength(task.id, 'tasks[].id', { min: 1 });
    assertStringLength(task.title, 'tasks[].title', { min: 1, max: 120 });
    assertArrayLength(task.surface, 'tasks[].surface', { min: 1 });
    assertStringLength(task.why, 'tasks[].why', { min: 1, max: 200 });
    assertArrayLength(task.acceptance, 'tasks[].acceptance', {
      min: 1,
      max: 10,
    });
    for (const criterion of task.acceptance) {
      assertStringLength(criterion, 'tasks[].acceptance[]', {
        min: 1,
        max: 160,
      });
    }
    assertStringLength(task.agentPrompt, 'tasks[].agentPrompt', {
      min: 1,
      max: 1400,
    });
    if (task.dependsOn) {
      for (const dep of task.dependsOn) {
        assertStringLength(dep, 'tasks[].dependsOn[]', { min: 1 });
      }
    }
  }
  return data;
}

/**
 * Build a repair prompt from a validation error.
 */
export function buildRepairPrompt(error: string): string {
  return [
    'Your previous output failed validation.',
    'Fix the output and return JSON ONLY (no markdown, no commentary).',
    'Validation error:',
    error,
  ].join('\n');
}

function truncateText(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n...(truncated)`;
}

export function buildRepairPromptWithOutput(
  error: string,
  previousOutput: string,
  maxOutputChars = 4000
): string {
  return [
    'Your previous output failed validation.',
    'Fix the output and return JSON ONLY (no markdown, no commentary).',
    'Do not change the JSON shape or rename fields.',
    'If a citation quote is invalid, replace it with an exact substring from the referenced chunk.',
    'Validation error:',
    error,
    'Previous output:',
    truncateText(previousOutput, maxOutputChars),
  ].join('\n');
}
