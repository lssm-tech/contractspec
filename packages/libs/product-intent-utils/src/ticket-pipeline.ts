import {
  ContractPatchIntentModel,
  EvidenceFindingExtractionModel,
  ProblemGroupingModel,
  TicketCollectionModel,
  type ContractPatchIntent,
  type EvidenceChunk,
  type EvidenceFinding,
  type EvidenceFindingExtraction,
  type ProblemGrouping,
  type ProblemStatement,
  type Ticket,
  type TicketCollection,
} from '@contractspec/lib.contracts/product-intent/types';
import { formatEvidenceForModel } from './prompts';
import {
  promptExtractEvidenceFindings,
  promptGenerateTickets,
  promptGroupProblems,
  promptSuggestPatchIntent,
} from './ticket-prompts';
import {
  validateEvidenceFindingExtraction,
  validateProblemGrouping,
  validateTicketCollection,
} from './ticket-validators';
import {
  buildChunkIndex,
  parseStrictJSON,
  validatePatchIntent,
} from './validators';
import {
  runWithValidation,
  type TicketPipelineLogger,
  type TicketPipelineModelRunner,
} from './ticket-pipeline-runner';

export type { TicketPipelineLogger, TicketPipelineModelRunner };

export interface RetrieveChunksOptions {
  chunkSize?: number;
  sourceId?: string;
  meta?: Record<string, unknown>;
}

export interface ExtractEvidenceOptions {
  modelRunner?: TicketPipelineModelRunner;
  maxFindings?: number;
  logger?: TicketPipelineLogger;
  maxAttempts?: number;
}

export interface GroupProblemsOptions {
  modelRunner?: TicketPipelineModelRunner;
  logger?: TicketPipelineLogger;
  maxAttempts?: number;
}

export interface GenerateTicketsOptions {
  modelRunner?: TicketPipelineModelRunner;
  logger?: TicketPipelineLogger;
  maxAttempts?: number;
}

export interface SuggestPatchOptions {
  modelRunner?: TicketPipelineModelRunner;
  logger?: TicketPipelineLogger;
  maxAttempts?: number;
}

const TAG_HINTS: Record<string, string[]> = {
  onboarding: ['onboarding', 'setup', 'activation'],
  pricing: ['pricing', 'cost', 'billing'],
  security: ['security', 'compliance', 'audit'],
  support: ['support', 'ticket', 'helpdesk'],
  analytics: ['analytics', 'report', 'dashboard'],
  performance: ['slow', 'latency', 'performance'],
  integrations: ['integration', 'api', 'webhook'],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function pickQuote(text: string, maxLen = 220): string {
  const trimmed = text.trim();
  const sentenceEnd = trimmed.search(/[.!?]\s/);
  const sentence =
    sentenceEnd === -1 ? trimmed : trimmed.slice(0, sentenceEnd + 1);
  const quote = sentence.length > maxLen ? sentence.slice(0, maxLen) : sentence;
  return quote.trim();
}

function deriveTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags = Object.entries(TAG_HINTS)
    .filter(([, hints]) => hints.some((hint) => lower.includes(hint)))
    .map(([tag]) => tag);
  return tags.slice(0, 3);
}

function truncateToMax(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  if (maxChars <= 3) return value.slice(0, maxChars);
  return `${value.slice(0, maxChars - 3).trimEnd()}...`;
}

const QUOTE_HYPHENS = new Set(['-', '‐', '‑', '‒', '–', '—']);
const QUOTE_SINGLE = new Set(["'", '’', '‘']);
const QUOTE_DOUBLE = new Set(['"', '“', '”']);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLooseQuotePattern(quote: string): string {
  let pattern = '';
  for (let i = 0; i < quote.length; i += 1) {
    const char = quote[i] ?? '';
    if (char === '.' && quote.slice(i, i + 3) === '...') {
      pattern += '(?:\\.\\.\\.|…)';
      i += 2;
      continue;
    }
    if (char === '…') {
      pattern += '(?:\\.\\.\\.|…)';
      continue;
    }
    if (/\s/.test(char)) {
      pattern += '\\s+';
      while (i + 1 < quote.length && /\s/.test(quote[i + 1] ?? '')) {
        i += 1;
      }
      continue;
    }
    if (QUOTE_HYPHENS.has(char)) {
      pattern += '[-‐‑‒–—]';
      continue;
    }
    if (QUOTE_SINGLE.has(char)) {
      pattern += "['‘’]";
      continue;
    }
    if (QUOTE_DOUBLE.has(char)) {
      pattern += '["“”]';
      continue;
    }
    pattern += escapeRegex(char);
  }
  return pattern;
}

function findQuoteInChunk(quote: string, chunkText: string): string | null {
  if (chunkText.includes(quote)) return quote;
  const pattern = buildLooseQuotePattern(quote);
  const match = chunkText.match(new RegExp(pattern));
  return match?.[0] ?? null;
}

function normalizeForTokens(value: string): string {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalizeForTokens(value).toLowerCase();
  return normalized.match(/[a-z0-9]+/g) ?? [];
}

function splitIntoSegments(text: string): string[] {
  const matches = text.match(/[^.!?\n]+[.!?]?/g);
  if (!matches) return [text];
  return matches.map((segment) => segment.trim()).filter(Boolean);
}

function selectBestQuoteFromChunk(
  quote: string,
  chunkText: string,
  maxLen = 240
): string | null {
  const quoteTokens = tokenize(quote);
  if (!quoteTokens.length) return null;

  const quoteTokenSet = new Set(quoteTokens);
  let best: { segment: string; score: number; overlap: number } | null = null;

  for (const segment of splitIntoSegments(chunkText)) {
    if (!segment) continue;
    const segmentTokens = new Set(tokenize(segment));
    if (!segmentTokens.size) continue;
    let overlap = 0;
    for (const token of quoteTokenSet) {
      if (segmentTokens.has(token)) overlap += 1;
    }
    if (!overlap) continue;
    const score = overlap / quoteTokenSet.size;
    if (!best || score > best.score) {
      best = { segment, score, overlap };
    }
  }

  if (!best) return null;
  if (best.overlap < 2 && quoteTokens.length > 2) return null;
  const trimmed = best.segment.trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen).trimEnd() : trimmed;
}

function fallbackQuoteFromChunk(
  chunkText: string,
  maxLen = 240
): string | null {
  const trimmed = chunkText.trim();
  if (!trimmed) return null;
  const slice = trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
  return slice.trimEnd();
}

function findQuoteAcrossChunks(
  quote: string,
  chunkIndex: Map<string, EvidenceChunk>
): { chunkId: string; quote: string } | null {
  for (const [chunkId, chunk] of chunkIndex.entries()) {
    if (chunk.text.includes(quote)) {
      return { chunkId, quote };
    }
    const repaired = findQuoteInChunk(quote, chunk.text);
    if (repaired) {
      return { chunkId, quote: repaired };
    }
  }
  return null;
}

function repairEvidenceFindingExtraction(
  raw: string,
  chunks: EvidenceChunk[]
): string | null {
  let data: EvidenceFindingExtraction;
  try {
    data = parseStrictJSON<EvidenceFindingExtraction>(
      EvidenceFindingExtractionModel,
      raw
    );
  } catch {
    return null;
  }

  const chunkIndex = buildChunkIndex(chunks);
  let updated = false;

  for (const finding of data.findings) {
    for (const citation of finding.citations) {
      const chunk = chunkIndex.get(citation.chunkId);
      if (chunk) {
        if (chunk.text.includes(citation.quote)) continue;
        const repaired = findQuoteInChunk(citation.quote, chunk.text);
        if (repaired) {
          citation.quote = repaired;
          updated = true;
          continue;
        }
      }

      const other = findQuoteAcrossChunks(citation.quote, chunkIndex);
      if (other) {
        citation.chunkId = other.chunkId;
        citation.quote = other.quote;
        updated = true;
        continue;
      }

      if (chunk) {
        const best = selectBestQuoteFromChunk(citation.quote, chunk.text);
        if (best) {
          citation.quote = best;
          updated = true;
          continue;
        }
        const fallback = fallbackQuoteFromChunk(chunk.text);
        if (fallback) {
          citation.quote = fallback;
          updated = true;
          continue;
        }
      }
    }
  }

  return updated ? JSON.stringify(data, null, 2) : null;
}

function repairProblemGrouping(raw: string): string | null {
  let data: ProblemGrouping;
  try {
    data = parseStrictJSON<ProblemGrouping>(ProblemGroupingModel, raw);
  } catch {
    return null;
  }

  let updated = false;
  for (const problem of data.problems) {
    const statement = truncateToMax(problem.statement, 320);
    if (statement !== problem.statement) {
      problem.statement = statement;
      updated = true;
    }
  }

  return updated ? JSON.stringify(data, null, 2) : null;
}

function repairTicketCollection(raw: string): string | null {
  let data: TicketCollection;
  try {
    data = parseStrictJSON<TicketCollection>(TicketCollectionModel, raw);
  } catch {
    return null;
  }

  let updated = false;
  for (const ticket of data.tickets) {
    const title = truncateToMax(ticket.title, 120);
    const summary = truncateToMax(ticket.summary, 320);
    if (title !== ticket.title) {
      ticket.title = title;
      updated = true;
    }
    if (summary !== ticket.summary) {
      ticket.summary = summary;
      updated = true;
    }
    ticket.acceptanceCriteria = ticket.acceptanceCriteria.map((criterion) => {
      const next = truncateToMax(criterion, 160);
      if (next !== criterion) updated = true;
      return next;
    });
  }

  return updated ? JSON.stringify(data, null, 2) : null;
}

function repairPatchIntent(raw: string): string | null {
  let data: ContractPatchIntent;
  try {
    data = parseStrictJSON<ContractPatchIntent>(ContractPatchIntentModel, raw);
  } catch {
    return null;
  }

  let updated = false;
  const featureKey = truncateToMax(data.featureKey, 80);
  if (featureKey !== data.featureKey) {
    data.featureKey = featureKey;
    updated = true;
  }
  data.acceptanceCriteria = data.acceptanceCriteria.map((criterion) => {
    const next = truncateToMax(criterion, 140);
    if (next !== criterion) updated = true;
    return next;
  });

  return updated ? JSON.stringify(data, null, 2) : null;
}

export function retrieveChunks(
  transcript: string,
  question: string,
  options: RetrieveChunksOptions = {}
): EvidenceChunk[] {
  const chunkSize = options.chunkSize ?? 800;
  const sourceId = options.sourceId ?? slugify(question || 'transcript');
  const clean = transcript.trim();
  const chunks: EvidenceChunk[] = [];

  for (let offset = 0, idx = 0; offset < clean.length; idx += 1) {
    const slice = clean.slice(offset, offset + chunkSize);
    chunks.push({
      chunkId: `${sourceId}#c_${String(idx).padStart(2, '0')}`,
      text: slice,
      meta: { sourceId, ...options.meta },
    });
    offset += chunkSize;
  }

  return chunks;
}

export async function extractEvidence(
  chunks: EvidenceChunk[],
  question: string,
  options: ExtractEvidenceOptions = {}
): Promise<EvidenceFinding[]> {
  if (options.modelRunner) {
    const evidenceJSON = formatEvidenceForModel(chunks, 900);
    const prompt = promptExtractEvidenceFindings({ question, evidenceJSON });
    return runWithValidation({
      stage: 'extractEvidence',
      prompt,
      modelRunner: options.modelRunner,
      logger: options.logger,
      maxAttempts: options.maxAttempts,
      repair: (raw) => repairEvidenceFindingExtraction(raw, chunks),
      validate: (raw) =>
        validateEvidenceFindingExtraction(raw, chunks).findings,
    });
  }

  const maxFindings = options.maxFindings ?? 12;
  const findings: EvidenceFinding[] = [];
  for (const chunk of chunks) {
    if (findings.length >= maxFindings) break;
    const quote = pickQuote(chunk.text);
    findings.push({
      findingId: `find_${String(findings.length + 1).padStart(3, '0')}`,
      summary: quote.length > 160 ? `${quote.slice(0, 160)}...` : quote,
      tags: deriveTags(chunk.text),
      citations: [{ chunkId: chunk.chunkId, quote }],
    });
  }

  const raw = JSON.stringify({ findings }, null, 2);
  return validateEvidenceFindingExtraction(raw, chunks).findings;
}

export async function groupProblems(
  findings: EvidenceFinding[],
  question: string,
  options: GroupProblemsOptions = {}
): Promise<ProblemStatement[]> {
  if (options.modelRunner) {
    const findingsJSON = JSON.stringify({ findings }, null, 2);
    const prompt = promptGroupProblems({
      question,
      findingsJSON,
      findingIds: findings.map((finding) => finding.findingId),
    });
    return runWithValidation({
      stage: 'groupProblems',
      prompt,
      modelRunner: options.modelRunner,
      logger: options.logger,
      maxAttempts: options.maxAttempts,
      repair: (raw) => repairProblemGrouping(raw),
      validate: (raw) => validateProblemGrouping(raw, findings).problems,
    });
  }

  const grouped = new Map<string, EvidenceFinding[]>();
  for (const finding of findings) {
    const tag = finding.tags?.[0] ?? 'general';
    if (!grouped.has(tag)) grouped.set(tag, []);
    grouped.get(tag)?.push(finding);
  }

  const problems: ProblemStatement[] = [];
  for (const [tag, items] of grouped.entries()) {
    const count = items.length;
    const severity = count >= 4 ? 'high' : count >= 2 ? 'medium' : 'low';
    const statement =
      tag === 'general'
        ? 'Users report friction that slows adoption.'
        : `Users report ${tag} friction that blocks progress.`;
    problems.push({
      problemId: `prob_${String(problems.length + 1).padStart(3, '0')}`,
      statement,
      evidenceIds: items.map((item) => item.findingId),
      tags: tag === 'general' ? undefined : [tag],
      severity,
    });
  }

  const raw = JSON.stringify({ problems }, null, 2);
  return validateProblemGrouping(raw, findings).problems;
}

export async function generateTickets(
  problems: ProblemStatement[],
  findings: EvidenceFinding[],
  question: string,
  options: GenerateTicketsOptions = {}
): Promise<Ticket[]> {
  if (options.modelRunner) {
    const problemsJSON = JSON.stringify({ problems }, null, 2);
    const findingsJSON = JSON.stringify({ findings }, null, 2);
    const prompt = promptGenerateTickets({
      question,
      problemsJSON,
      findingsJSON,
    });
    return runWithValidation({
      stage: 'generateTickets',
      prompt,
      modelRunner: options.modelRunner,
      logger: options.logger,
      maxAttempts: options.maxAttempts,
      repair: (raw) => repairTicketCollection(raw),
      validate: (raw) => validateTicketCollection(raw, findings).tickets,
    });
  }

  const tickets: Ticket[] = problems.map((problem, idx) => {
    const tag = problem.tags?.[0];
    const title = tag ? `Improve ${tag} flow` : 'Reduce user friction';
    const summary = problem.statement;
    return {
      ticketId: `t_${String(idx + 1).padStart(3, '0')}`,
      title,
      summary,
      evidenceIds: problem.evidenceIds.slice(0, 4),
      acceptanceCriteria: [
        'Acceptance criteria maps to the evidence findings',
        'Success metrics are tracked for the change',
      ],
      tags: problem.tags,
      priority: problem.severity === 'high' ? 'high' : 'medium',
    };
  });

  const raw = JSON.stringify({ tickets }, null, 2);
  return validateTicketCollection(raw, findings).tickets;
}

export async function suggestPatch(
  ticket: Ticket,
  options: SuggestPatchOptions = {}
): Promise<ContractPatchIntent> {
  if (options.modelRunner) {
    const ticketJSON = JSON.stringify(ticket, null, 2);
    const prompt = promptSuggestPatchIntent({ ticketJSON });
    return runWithValidation({
      stage: 'suggestPatch',
      prompt,
      modelRunner: options.modelRunner,
      logger: options.logger,
      maxAttempts: options.maxAttempts,
      repair: (raw) => repairPatchIntent(raw),
      validate: (raw) => validatePatchIntent(raw),
    });
  }

  const featureKey = slugify(ticket.title) || 'product_intent_ticket';
  const intent: ContractPatchIntent = {
    featureKey,
    changes: [
      {
        type: 'update_operation',
        target: `productIntent.${featureKey}`,
        detail: ticket.summary,
      },
    ],
    acceptanceCriteria: ticket.acceptanceCriteria,
  };

  return validatePatchIntent(JSON.stringify(intent, null, 2));
}
