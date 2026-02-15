import type { SchemaModelType } from '@contractspec/lib.schema';
import {
  type EvidenceChunk,
  type EvidenceFinding,
  type EvidenceFindingExtraction,
  EvidenceFindingExtractionModel,
  type ProblemGrouping,
  ProblemGroupingModel,
  type TicketCollection,
  TicketCollectionModel,
} from '@contractspec/lib.contracts-spec/product-intent/types';
import {
  buildChunkIndex,
  parseStrictJSON,
  validateCitation,
} from './validators';

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

function assertIdsExist(
  ids: string[],
  allowed: Set<string>,
  path: string
): void {
  for (const id of ids) {
    if (!allowed.has(id)) {
      throw new Error(`Unknown ${path} reference: ${id}`);
    }
  }
}

function parseJSON<T>(schema: SchemaModelType, raw: string): T {
  return parseStrictJSON<T>(schema, raw);
}

export function validateEvidenceFindingExtraction(
  raw: string,
  chunks: EvidenceChunk[]
): EvidenceFindingExtraction {
  const chunkIndex = buildChunkIndex(chunks);
  const data = parseJSON<EvidenceFindingExtraction>(
    EvidenceFindingExtractionModel,
    raw
  );

  assertArrayLength(data.findings, 'findings', { min: 1, max: 40 });
  for (const finding of data.findings) {
    assertStringLength(finding.findingId, 'findings[].findingId', { min: 1 });
    assertStringLength(finding.summary, 'findings[].summary', {
      min: 1,
      max: 320,
    });
    if (finding.tags) {
      for (const tag of finding.tags) {
        assertStringLength(tag, 'findings[].tags[]', { min: 1, max: 48 });
      }
    }
    assertArrayLength(finding.citations, 'findings[].citations', { min: 1 });
    for (const citation of finding.citations) {
      validateCitation(citation, chunkIndex);
    }
  }
  return data;
}

export function validateProblemGrouping(
  raw: string,
  findings: EvidenceFinding[]
): ProblemGrouping {
  const data = parseJSON<ProblemGrouping>(ProblemGroupingModel, raw);
  const allowedIds = new Set(findings.map((finding) => finding.findingId));

  assertArrayLength(data.problems, 'problems', { min: 1, max: 20 });
  for (const problem of data.problems) {
    assertStringLength(problem.problemId, 'problems[].problemId', { min: 1 });
    assertStringLength(problem.statement, 'problems[].statement', {
      min: 1,
      max: 320,
    });
    assertArrayLength(problem.evidenceIds, 'problems[].evidenceIds', {
      min: 1,
      max: 8,
    });
    assertIdsExist(problem.evidenceIds, allowedIds, 'evidenceId');
    if (problem.tags) {
      for (const tag of problem.tags) {
        assertStringLength(tag, 'problems[].tags[]', { min: 1, max: 48 });
      }
    }
  }
  return data;
}

export function validateTicketCollection(
  raw: string,
  findings: EvidenceFinding[]
): TicketCollection {
  const data = parseJSON<TicketCollection>(TicketCollectionModel, raw);
  const allowedIds = new Set(findings.map((finding) => finding.findingId));

  assertArrayLength(data.tickets, 'tickets', { min: 1, max: 30 });
  for (const ticket of data.tickets) {
    assertStringLength(ticket.ticketId, 'tickets[].ticketId', { min: 1 });
    assertStringLength(ticket.title, 'tickets[].title', { min: 1, max: 120 });
    assertStringLength(ticket.summary, 'tickets[].summary', {
      min: 1,
      max: 320,
    });
    assertArrayLength(ticket.evidenceIds, 'tickets[].evidenceIds', {
      min: 1,
      max: 8,
    });
    assertIdsExist(ticket.evidenceIds, allowedIds, 'evidenceId');
    assertArrayLength(
      ticket.acceptanceCriteria,
      'tickets[].acceptanceCriteria',
      {
        min: 1,
        max: 8,
      }
    );
    for (const criterion of ticket.acceptanceCriteria) {
      assertStringLength(criterion, 'tickets[].acceptanceCriteria[]', {
        min: 1,
        // max: 160,
        max: 280,
      });
    }
    if (ticket.tags) {
      for (const tag of ticket.tags) {
        assertStringLength(tag, 'tickets[].tags[]', { min: 1, max: 48 });
      }
    }
  }
  return data;
}
